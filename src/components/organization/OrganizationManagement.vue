<template>
  <div class="organization-management">
    <h1 class="page-title">组织架构管理</h1>
    
    <div class="organization-container">
      <!-- 左侧树形结构 -->
      <div class="department-tree">
        <div class="search-bar">
          <input 
            v-model="searchText"
            placeholder="搜索部门"
            class="search-input"
          />
        </div>
        
        <div class="tree-container">
          <ul class="tree">
            <li v-for="department in filteredDepartments" :key="department.id" class="tree-item">
              <div 
                :class="['tree-node', activeDepartment && activeDepartment.id === department.id ? 'active' : '']"
                @click="onDepartmentSelect([department])">
                <span class="tree-icon">📁</span>
                <span class="tree-label">{{ department.name }}</span>
              </div>
              
              <ul v-if="department.children && department.children.length" class="sub-tree">
                <li v-for="child in department.children" :key="child.id" class="tree-item">
                  <div 
                    :class="['tree-node', activeDepartment && activeDepartment.id === child.id ? 'active' : '']"
                    @click.stop="onDepartmentSelect([child])">
                    <span class="tree-icon">📂</span>
                    <span class="tree-label">{{ child.name }}</span>
                  </div>
                  
                  <ul v-if="child.children && child.children.length" class="sub-tree">
                    <li v-for="subChild in child.children" :key="subChild.id" class="tree-item">
                      <div 
                        :class="['tree-node', activeDepartment && activeDepartment.id === subChild.id ? 'active' : '']"
                        @click.stop="onDepartmentSelect([subChild])">
                        <span class="tree-icon">📄</span>
                        <span class="tree-label">{{ subChild.name }}</span>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        
        <div class="tree-actions">
          <button class="btn primary-btn" @click="showAddDepartmentDialog = true">
            <span class="btn-icon">➕</span>添加部门
          </button>
        </div>
      </div>
      
      <!-- 右侧详细信息区 -->
      <div class="department-details">
        <div v-if="activeDepartment" class="details-card">
          <div class="card-header">
            <h2>{{ activeDepartment.name }} 部门详情</h2>
            <div class="header-actions">
              <button class="icon-btn edit-btn" @click="editDepartment(activeDepartment)">✏️</button>
              <button class="icon-btn delete-btn" @click="confirmDeleteDialog = true">🗑️</button>
            </div>
          </div>
          
          <div class="tabs">
            <button 
              v-for="(tab, index) in ['部门概览', '成员管理', '权限设置', '绩效考核']" 
              :key="index"
              :class="['tab', activeTab === index ? 'active' : '']"
              @click="activeTab = index">
              {{ tab }}
            </button>
          </div>
          
          <div class="tab-content">
            <!-- 部门概览选项卡 -->
            <div v-if="activeTab === 0" class="tab-pane">
              <div class="info-list">
                <div class="info-item">
                  <div class="info-label">部门名称:</div>
                  <div class="info-value">{{ activeDepartment.name }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">部门总监:</div>
                  <div class="info-value">{{ activeDepartment.director || '暂未设置' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">部门经理:</div>
                  <div class="info-value">{{ activeDepartment.manager || '暂未设置' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">创建时间:</div>
                  <div class="info-value">{{ activeDepartment.createdAt || '未知' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">部门人数:</div>
                  <div class="info-value">{{ activeDepartment.employees ? activeDepartment.employees.length : 0 }} 人</div>
                </div>
                <div class="info-item">
                  <div class="info-label">部门描述:</div>
                  <div class="info-value">{{ activeDepartment.description || '暂无描述' }}</div>
                </div>
              </div>
            </div>
            
            <!-- 成员管理选项卡 -->
            <div v-if="activeTab === 1" class="tab-pane">
              <div class="panel-actions">
                <input 
                  v-model="employeeSearch"
                  placeholder="搜索成员"
                  class="search-input"
                />
                <button class="btn primary-btn" @click="showAddEmployeeDialog = true">
                  <span class="btn-icon">➕</span>添加成员
                </button>
              </div>
              
              <table class="data-table">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>所属部门</th>
                    <th>职位</th>
                    <th>账号信息</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="employee in filteredEmployees" :key="employee.id">
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.department }}</td>
                    <td>{{ employee.position }}</td>
                    <td>{{ employee.account }}</td>
                    <td class="actions-cell">
                      <button class="icon-btn small edit-btn" @click="editEmployee(employee)">✏️</button>
                      <button class="icon-btn small delete-btn" @click="confirmDeleteEmployee(employee)">🗑️</button>
                    </td>
                  </tr>
                  <tr v-if="filteredEmployees.length === 0">
                    <td colspan="5" class="empty-message">暂无员工数据</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- 权限设置选项卡 -->
            <div v-if="activeTab === 2" class="tab-pane">
              <h3>部门权限设置</h3>
              <div class="permission-list">
                <div class="permission-item">
                  <input 
                    type="checkbox" 
                    id="viewData" 
                    v-model="departmentPermissions.viewData"
                  />
                  <label for="viewData">查看数据权限</label>
                </div>
                <div class="permission-item">
                  <input 
                    type="checkbox" 
                    id="editData" 
                    v-model="departmentPermissions.editData"
                  />
                  <label for="editData">编辑数据权限</label>
                </div>
                <div class="permission-item">
                  <input 
                    type="checkbox" 
                    id="manageMember" 
                    v-model="departmentPermissions.manageMember"
                  />
                  <label for="manageMember">管理成员权限</label>
                </div>
                <div class="permission-item">
                  <input 
                    type="checkbox" 
                    id="viewReport" 
                    v-model="departmentPermissions.viewReport"
                  />
                  <label for="viewReport">查看报表权限</label>
                </div>
              </div>
              
              <div class="panel-actions right">
                <button class="btn primary-btn" @click="savePermissions">保存权限设置</button>
              </div>
            </div>
            
            <!-- 绩效考核选项卡 -->
            <div v-if="activeTab === 3" class="tab-pane">
              <div class="filter-bar">
                <div class="filter-item">
                  <label for="month-select">选择月份：</label>
                  <select id="month-select" v-model="selectedMonth" class="month-select" @change="filterPerformanceByMonth">
                    <option v-for="month in availableMonths" :key="month.value" :value="month.value">
                      {{ month.label }}
                    </option>
                  </select>
                </div>
                <div class="summary-item">
                  <span>团队平均分：</span>
                  <strong class="team-score">{{ departmentPerformance.averageScore || '0' }}分</strong>
                </div>
              </div>
              
              <div class="metric-cards">
                <div class="metric-card">
                  <div class="metric-title">平均完成率</div>
                  <div class="metric-value">{{ departmentPerformance.averageCompletion || '0' }}%</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">达标人数</div>
                  <div class="metric-value">{{ departmentPerformance.qualifiedCount || '0' }}/{{ departmentPerformance.totalCount || '0' }}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">最高得分</div>
                  <div class="metric-value">{{ departmentPerformance.highestScore || '0' }}分</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">最低得分</div>
                  <div class="metric-value">{{ departmentPerformance.lowestScore || '0' }}分</div>
                </div>
              </div>
              
              <h3>部门员工绩效列表</h3>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>职位</th>
                    <th>销售额目标</th>
                    <th>ROI目标</th>
                    <th>返点目标</th>
                    <th>进度目标</th>
                    <th>个人素质得分</th>
                    <th>客户评价得分</th>
                    <th>考核总分</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(employee, index) in filteredPerformance" :key="index">
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.position }}</td>
                    <td>
                      <div class="target-cell">
                        <div class="target-value">{{ employee.salesTarget }}</div>
                        <div class="progress-bar">
                          <div 
                            class="progress-fill" 
                            :style="{ width: employee.salesCompletion + '%', backgroundColor: getCompletionColor(employee.salesCompletion) }"
                          ></div>
                        </div>
                        <div class="completion-info">
                          <span class="completion-percent">{{ employee.salesCompletion }}%</span>
                          <span class="current-value">当前: {{ employee.salesActual }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="target-cell">
                        <div class="target-value">{{ employee.roiTarget }}</div>
                        <div class="progress-bar">
                          <div 
                            class="progress-fill" 
                            :style="{ width: employee.roiCompletion + '%', backgroundColor: getCompletionColor(employee.roiCompletion) }"
                          ></div>
                        </div>
                        <div class="completion-info">
                          <span class="completion-percent">{{ employee.roiCompletion }}%</span>
                          <span class="current-value">当前: {{ employee.roiActual }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="target-cell">
                        <div class="target-value">{{ employee.rebateTarget }}</div>
                        <div class="progress-bar">
                          <div 
                            class="progress-fill" 
                            :style="{ width: employee.rebateCompletion + '%', backgroundColor: getCompletionColor(employee.rebateCompletion) }"
                          ></div>
                        </div>
                        <div class="completion-info">
                          <span class="completion-percent">{{ employee.rebateCompletion }}%</span>
                          <span class="current-value">当前: {{ employee.rebateActual }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="target-cell">
                        <div class="target-value">{{ employee.progressTarget }}</div>
                        <div class="progress-bar">
                          <div 
                            class="progress-fill" 
                            :style="{ width: employee.progressCompletion + '%', backgroundColor: getCompletionColor(employee.progressCompletion) }"
                          ></div>
                        </div>
                        <div class="completion-info">
                          <span class="completion-percent">{{ employee.progressCompletion }}%</span>
                          <span class="current-value">当前: {{ employee.progressActual }}</span>
                        </div>
                      </div>
                    </td>
                    <td>{{ employee.qualityScore }}</td>
                    <td>{{ employee.customerRatingScore }}</td>
                    <td>{{ employee.score }}</td>
                    <td>
                      <button class="btn primary-btn small" @click="showPerformanceDetail(employee)">
                        查看详情
                      </button>
                    </td>
                  </tr>
                  <tr v-if="filteredPerformance.length === 0">
                    <td colspan="10" class="empty-message">暂无绩效数据</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div v-else class="no-department-selected">
          <div class="empty-icon">👈</div>
          <p>请从左侧选择一个部门查看详情</p>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑部门对话框 -->
    <div v-if="showAddDepartmentDialog" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ editingDepartment ? '编辑部门' : '添加部门' }}</h3>
          <button class="close-btn" @click="showAddDepartmentDialog = false">×</button>
        </div>
        <div class="modal-body">
          <form ref="departmentForm">
            <div class="form-group">
              <label for="dept-name">部门名称</label>
              <input 
                id="dept-name"
                v-model="departmentForm.name"
                type="text" 
                placeholder="请输入部门名称"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="dept-director">部门总监</label>
              <input 
                id="dept-director"
                v-model="departmentForm.director"
                type="text" 
                placeholder="请输入部门总监"
              />
            </div>
            
            <div class="form-group">
              <label for="dept-manager">部门经理</label>
              <input 
                id="dept-manager"
                v-model="departmentForm.manager"
                type="text" 
                placeholder="请输入部门经理"
              />
            </div>
            
            <div class="form-group">
              <label for="dept-parent">上级部门</label>
              <select 
                id="dept-parent"
                v-model="departmentForm.parentId"
              >
                <option value="">无上级部门</option>
                <option 
                  v-for="option in departmentOptions" 
                  :key="option.id" 
                  :value="option.id"
                >
                  {{ option.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="dept-desc">部门描述</label>
              <textarea 
                id="dept-desc"
                v-model="departmentForm.description"
                rows="3"
                placeholder="请输入部门描述"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn secondary-btn" @click="showAddDepartmentDialog = false">取消</button>
          <button class="btn primary-btn" @click="saveDepartment">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑员工对话框 -->
    <div v-if="showAddEmployeeDialog" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ editingEmployee ? '编辑员工' : '添加员工' }}</h3>
          <button class="close-btn" @click="showAddEmployeeDialog = false">×</button>
        </div>
        <div class="modal-body">
          <form ref="employeeForm">
            <div class="form-group">
              <label for="emp-name">姓名</label>
              <input 
                id="emp-name"
                v-model="employeeForm.name"
                type="text" 
                placeholder="请输入员工姓名"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="emp-position">职位</label>
              <input 
                id="emp-position"
                v-model="employeeForm.position"
                type="text" 
                placeholder="请输入职位"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="emp-account">账号信息</label>
              <input 
                id="emp-account"
                v-model="employeeForm.account"
                type="text" 
                placeholder="请输入账号信息"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="emp-dept">所属部门</label>
              <select 
                id="emp-dept"
                v-model="employeeForm.departmentId"
                required
              >
                <option value="">请选择所属部门</option>
                <option 
                  v-for="option in departmentOptions" 
                  :key="option.id" 
                  :value="option.id"
                >
                  {{ option.name }}
                </option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn secondary-btn" @click="showAddEmployeeDialog = false">取消</button>
          <button class="btn primary-btn" @click="saveEmployee">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <div v-if="confirmDeleteDialog" class="modal-overlay">
      <div class="modal-container confirmation-modal">
        <div class="modal-header">
          <h3>确认删除</h3>
          <button class="close-btn" @click="confirmDeleteDialog = false">×</button>
        </div>
        <div class="modal-body">
          <p>您确定要删除 <strong>{{ activeDepartment ? activeDepartment.name : '' }}</strong> 部门吗？此操作不可撤销。</p>
        </div>
        <div class="modal-footer">
          <button class="btn secondary-btn" @click="confirmDeleteDialog = false">取消</button>
          <button class="btn danger-btn" @click="deleteDepartment">确认删除</button>
        </div>
      </div>
    </div>
    
    <!-- 删除员工确认对话框 -->
    <div v-if="confirmDeleteEmployeeDialog" class="modal-overlay">
      <div class="modal-container confirmation-modal">
        <div class="modal-header">
          <h3>确认删除</h3>
          <button class="close-btn" @click="confirmDeleteEmployeeDialog = false">×</button>
        </div>
        <div class="modal-body">
          <p>您确定要删除员工 <strong>{{ employeeToDelete ? employeeToDelete.name : '' }}</strong> 吗？此操作不可撤销。</p>
        </div>
        <div class="modal-footer">
          <button class="btn secondary-btn" @click="confirmDeleteEmployeeDialog = false">取消</button>
          <button class="btn danger-btn" @click="deleteEmployee">确认删除</button>
        </div>
      </div>
    </div>
    
    <!-- 绩效详情对话框 -->
    <div v-if="showPerformanceDetailDialog" class="modal-overlay">
      <div class="modal-container performance-detail-modal">
        <div class="modal-header">
          <h3>绩效详情 - {{ selectedEmployee ? selectedEmployee.name : '' }}</h3>
          <button class="close-btn" @click="showPerformanceDetailDialog = false">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedEmployee" class="performance-detail">
            <div class="detail-section">
              <h4>基本信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">姓名:</div>
                  <div class="info-value">{{ selectedEmployee.name }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">职位:</div>
                  <div class="info-value">{{ selectedEmployee.position }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">部门:</div>
                  <div class="info-value">{{ activeDepartment ? activeDepartment.name : '' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">考核月份:</div>
                  <div class="info-value">{{ selectedMonth }}</div>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>绩效目标完成情况</h4>
              <div class="performance-grid">
                <div class="performance-item">
                  <div class="performance-header">销售额</div>
                  <div class="performance-content">
                    <div class="target-item">
                      <span>目标：</span>
                      <strong>{{ selectedEmployee.salesTarget }}</strong>
                    </div>
                    <div class="target-item">
                      <span>实际：</span>
                      <strong>{{ selectedEmployee.salesActual }}</strong>
                    </div>
                    <div class="target-item">
                      <span>完成率：</span>
                      <strong>{{ selectedEmployee.salesCompletion }}%</strong>
                    </div>
                    <div class="target-item">
                      <span>得分：</span>
                      <strong>{{ selectedEmployee.salesScore }}分</strong>
                    </div>
                  </div>
                </div>
                
                <div class="performance-item">
                  <div class="performance-header">ROI</div>
                  <div class="performance-content">
                    <div class="target-item">
                      <span>目标：</span>
                      <strong>{{ selectedEmployee.roiTarget }}</strong>
                    </div>
                    <div class="target-item">
                      <span>实际：</span>
                      <strong>{{ selectedEmployee.roiActual }}</strong>
                    </div>
                    <div class="target-item">
                      <span>完成率：</span>
                      <strong>{{ selectedEmployee.roiCompletion }}%</strong>
                    </div>
                    <div class="target-item">
                      <span>得分：</span>
                      <strong>{{ selectedEmployee.roiScore }}分</strong>
                    </div>
                  </div>
                </div>
                
                <div class="performance-item">
                  <div class="performance-header">返点</div>
                  <div class="performance-content">
                    <div class="target-item">
                      <span>目标：</span>
                      <strong>{{ selectedEmployee.rebateTarget }}</strong>
                    </div>
                    <div class="target-item">
                      <span>实际：</span>
                      <strong>{{ selectedEmployee.rebateActual }}</strong>
                    </div>
                    <div class="target-item">
                      <span>完成率：</span>
                      <strong>{{ selectedEmployee.rebateCompletion }}%</strong>
                    </div>
                    <div class="target-item">
                      <span>得分：</span>
                      <strong>{{ selectedEmployee.rebateScore }}分</strong>
                    </div>
                  </div>
                </div>
                
                <div class="performance-item">
                  <div class="performance-header">进度</div>
                  <div class="performance-content">
                    <div class="target-item">
                      <span>目标：</span>
                      <strong>{{ selectedEmployee.progressTarget }}</strong>
                    </div>
                    <div class="target-item">
                      <span>实际：</span>
                      <strong>{{ selectedEmployee.progressActual }}</strong>
                    </div>
                    <div class="target-item">
                      <span>完成率：</span>
                      <strong>{{ selectedEmployee.progressCompletion }}%</strong>
                    </div>
                    <div class="target-item">
                      <span>得分：</span>
                      <strong>{{ selectedEmployee.progressScore }}分</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>客户评价</h4>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>客户名称</th>
                    <th>评分</th>
                    <th>评价内容</th>
                    <th>评价时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(review, reviewIndex) in selectedEmployee.customerReviews" :key="reviewIndex">
                    <td>{{ review.customerName }}</td>
                    <td>
                      <div class="star-rating">
                        <i class="fas fa-star" v-for="n in review.rating" :key="n"></i>
                        <i class="far fa-star" v-for="n in 5-review.rating" :key="n+5"></i>
                        <span>{{ review.rating }}.0</span>
                      </div>
                    </td>
                    <td>{{ review.comment }}</td>
                    <td>{{ review.date }}</td>
                  </tr>
                  <tr v-if="!selectedEmployee.customerReviews || selectedEmployee.customerReviews.length === 0">
                    <td colspan="4" class="empty-message">暂无客户评价</td>
                  </tr>
                </tbody>
              </table>
              
              <div class="review-summary">
                <div class="summary-item">
                  <span>平均评分：</span>
                  <strong>{{ selectedEmployee.averageCustomerRating }}分</strong>
                </div>
                <div class="summary-item">
                  <span>评价得分(占比20%)：</span>
                  <strong>{{ selectedEmployee.customerRatingScore }}分</strong>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>个人素质评估</h4>
              <div class="quality-grid">
                <div class="quality-item" v-for="(quality, qualityIndex) in selectedEmployee.qualityRatings" :key="qualityIndex">
                  <div class="quality-label">{{ quality.name }}:</div>
                  <div class="quality-rating">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: (quality.score / 10 * 100) + '%' }">
                        {{ quality.score }}分
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="review-summary">
                <div class="summary-item">
                  <span>个人素质得分(占比20%)：</span>
                  <strong>{{ selectedEmployee.qualityScore }}分</strong>
                </div>
              </div>
            </div>
            
            <div class="detail-section total-score">
              <div class="summary-item large">
                <span>绩效考核总分：</span>
                <strong>{{ selectedEmployee.score }}分</strong>
              </div>
              <div class="rating-breakdown">
                <div class="breakdown-item">
                  <span>销售额(占比20%)：</span>
                  <strong>{{ selectedEmployee.salesScore }}分</strong>
                </div>
                <div class="breakdown-item">
                  <span>ROI(占比20%)：</span>
                  <strong>{{ selectedEmployee.roiScore }}分</strong>
                </div>
                <div class="breakdown-item">
                  <span>返点(占比20%)：</span>
                  <strong>{{ selectedEmployee.rebateScore }}分</strong>
                </div>
                <div class="breakdown-item">
                  <span>进度(占比20%)：</span>
                  <strong>{{ selectedEmployee.progressScore }}分</strong>
                </div>
                <div class="breakdown-item">
                  <span>客户评价(占比10%)：</span>
                  <strong>{{ selectedEmployee.customerRatingScore }}分</strong>
                </div>
                <div class="breakdown-item">
                  <span>个人素质(占比10%)：</span>
                  <strong>{{ selectedEmployee.qualityScore }}分</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn primary-btn" @click="showPerformanceDetailDialog = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrganizationManagement',
  data() {
    return {
      // 树形结构相关
      searchText: '',
      openNodes: [],
      activeDepartment: null,
      
      // 选项卡
      activeTab: 0,
      
      // 部门数据
      departments: [
        {
          id: 1,
          name: '总公司',
          director: '张总',
          manager: '李经理',
          createdAt: '2023-01-01',
          description: '公司总部',
          children: [
            {
              id: 2,
              name: '市场部',
              director: '王总监',
              manager: '赵经理',
              createdAt: '2023-01-15',
              description: '负责市场推广和品牌营销',
              employees: [
                { id: 101, name: '李四', department: '市场部', position: '市场专员', account: 'lisi@example.com' },
                { id: 102, name: '王五', department: '市场部', position: '品牌经理', account: 'wangwu@example.com' }
              ]
            },
            {
              id: 3,
              name: '销售部',
              director: '刘总监',
              manager: '钱经理',
              createdAt: '2023-01-20',
              description: '负责产品销售和客户关系维护',
              employees: [
                { id: 103, name: '张三', department: '销售部', position: '销售代表', account: 'zhangsan@example.com' },
                { id: 104, name: '李明', department: '销售部', position: '客户经理', account: 'liming@example.com' },
                { id: 105, name: '王芳', department: '销售部', position: '销售助理', account: 'wangfang@example.com' }
              ]
            },
            {
              id: 4,
              name: '技术部',
              director: '孙总监',
              manager: '周经理',
              createdAt: '2023-02-01',
              description: '负责产品研发和技术支持',
              children: [
                {
                  id: 5,
                  name: '研发组',
                  director: '吴组长',
                  manager: '',
                  createdAt: '2023-02-15',
                  description: '负责产品研发',
                  employees: [
                    { id: 106, name: '刘一', department: '研发组', position: '高级工程师', account: 'liuyi@example.com' },
                    { id: 107, name: '陈二', department: '研发组', position: '工程师', account: 'chener@example.com' }
                  ]
                },
                {
                  id: 6,
                  name: '测试组',
                  director: '郑组长',
                  manager: '',
                  createdAt: '2023-02-20',
                  description: '负责产品测试',
                  employees: [
                    { id: 108, name: '赵六', department: '测试组', position: '测试工程师', account: 'zhaoliu@example.com' }
                  ]
                }
              ]
            }
          ]
        }
      ],
      
      // 员工表格
      employeeSearch: '',
      employeeHeaders: [
        { text: '姓名', value: 'name' },
        { text: '所属部门', value: 'department' },
        { text: '职位', value: 'position' },
        { text: '账号信息', value: 'account' },
        { text: '操作', value: 'actions', sortable: false }
      ],
      
      // 部门权限
      departmentPermissions: {
        viewData: true,
        editData: false,
        manageMember: true,
        viewReport: true
      },
      
      // 部门绩效
      departmentPerformance: {
        averageCompletion: 85,
        averageScore: 8.7,
        qualifiedCount: 15,
        totalCount: 20,
        highestScore: 9.5,
        lowestScore: 7.2,
        employees: [
          { 
            name: '张三', 
            position: '销售代表', 
            salesTarget: '120万', 
            salesActual: '110万', 
            salesCompletion: 92, 
            salesScore: 9.2,
            roiTarget: '3.5',
            roiActual: '3.2',
            roiCompletion: 91,
            roiScore: 9.1,
            rebateTarget: '15%',
            rebateActual: '14%',
            rebateCompletion: 93,
            rebateScore: 9.3,
            progressTarget: '100%',
            progressActual: '95%',
            progressCompletion: 95,
            progressScore: 9.5,
            completion: 92, 
            score: 8.9,
            averageCustomerRating: 4.5,
            customerRatingScore: 9.0,
            qualityScore: 8.5,
            customerReviews: [
              { customerName: '客户A', rating: 5, comment: '服务态度很好，专业知识扎实', date: '2023-05-15' },
              { customerName: '客户B', rating: 4, comment: '反应迅速，但有些细节可以改进', date: '2023-05-10' }
            ],
            qualityRatings: [
              { name: '沟通能力', score: 8.5 },
              { name: '专业知识', score: 9.0 },
              { name: '团队协作', score: 8.0 },
              { name: '解决问题', score: 8.5 }
            ]
          },
          { 
            name: '李四', 
            position: '市场专员', 
            salesTarget: '10个活动', 
            salesActual: '8个活动', 
            salesCompletion: 80, 
            salesScore: 8.0,
            roiTarget: '2.5',
            roiActual: '2.0',
            roiCompletion: 80,
            roiScore: 8.0,
            rebateTarget: '10%',
            rebateActual: '8%',
            rebateCompletion: 80,
            rebateScore: 8.0,
            progressTarget: '100%',
            progressActual: '80%',
            progressCompletion: 80,
            progressScore: 8.0,
            completion: 80, 
            score: 8.2,
            averageCustomerRating: 4.2,
            customerRatingScore: 8.4,
            qualityScore: 8.8,
            customerReviews: [
              { customerName: '客户C', rating: 4, comment: '创意很好，执行略有拖延', date: '2023-05-20' }
            ],
            qualityRatings: [
              { name: '沟通能力', score: 9.0 },
              { name: '专业知识', score: 8.5 },
              { name: '团队协作', score: 9.0 },
              { name: '解决问题', score: 8.5 }
            ]
          },
          { 
            name: '王五', 
            position: '品牌经理', 
            salesTarget: '5个方案', 
            salesActual: '4个方案', 
            salesCompletion: 80, 
            salesScore: 8.0,
            roiTarget: '4.0',
            roiActual: '3.5',
            roiCompletion: 88,
            roiScore: 8.8,
            rebateTarget: '20%',
            rebateActual: '18%',
            rebateCompletion: 90,
            rebateScore: 9.0,
            progressTarget: '100%',
            progressActual: '85%',
            progressCompletion: 85,
            progressScore: 8.5,
            completion: 80, 
            score: 8.5,
            averageCustomerRating: 4.7,
            customerRatingScore: 9.4,
            qualityScore: 8.7,
            customerReviews: [
              { customerName: '客户D', rating: 5, comment: '方案非常出色，提升了品牌价值', date: '2023-05-12' },
              { customerName: '客户E', rating: 4, comment: '策略很好，执行中有一些小问题', date: '2023-05-03' }
            ],
            qualityRatings: [
              { name: '沟通能力', score: 8.0 },
              { name: '专业知识', score: 9.5 },
              { name: '团队协作', score: 8.5 },
              { name: '解决问题', score: 9.0 }
            ]
          }
        ]
      },
      
      // 绩效相关
      selectedMonth: '2023-05',
      availableMonths: [
        { value: '2023-05', label: '2023年5月' },
        { value: '2023-04', label: '2023年4月' },
        { value: '2023-03', label: '2023年3月' },
        { value: '2023-02', label: '2023年2月' },
        { value: '2023-01', label: '2023年1月' }
      ],
      showPerformanceDetailDialog: false,
      selectedEmployee: null,
      
      // 对话框
      showAddDepartmentDialog: false,
      showAddEmployeeDialog: false,
      confirmDeleteDialog: false,
      confirmDeleteEmployeeDialog: false,
      
      // 表单
      departmentForm: {
        name: '',
        director: '',
        manager: '',
        parentId: null,
        description: ''
      },
      validDepartmentForm: false,
      editingDepartment: null,
      
      employeeForm: {
        name: '',
        position: '',
        account: '',
        departmentId: null
      },
      validEmployeeForm: false,
      employeeToDelete: null
    }
  },
  computed: {
    // 筛选后的部门树
    filteredDepartments() {
      if (!this.searchText) return this.departments;
      
      // 递归搜索部门树
      const searchInTree = (items, term) => {
        return items.filter(item => {
          const matches = item.name.toLowerCase().includes(term.toLowerCase());
          
          if (item.children && item.children.length) {
            const filteredChildren = searchInTree(item.children, term);
            if (filteredChildren.length) {
              item.children = filteredChildren;
              return true;
            }
          }
          
          return matches;
        });
      };
      
      return searchInTree([...this.departments], this.searchText);
    },
    
    // 部门下拉选项
    departmentOptions() {
      const options = [];
      
      const collectDepartments = (items, path = '') => {
        items.forEach(item => {
          const newPath = path ? `${path} > ${item.name}` : item.name;
          options.push({
            id: item.id,
            name: newPath
          });
          
          if (item.children && item.children.length) {
            collectDepartments(item.children, newPath);
          }
        });
      };
      
      collectDepartments(this.departments);
      return options;
    },
    
    // 当前部门的员工
    filteredEmployees() {
      if (!this.activeDepartment || !this.activeDepartment.employees) return [];
      return this.activeDepartment.employees;
    },
    
    // 筛选后的绩效数据
    filteredPerformance() {
      // 本示例中我们假设数据已经按月份准备好
      // 在实际应用中，这里会根据selectedMonth从服务器获取相应月份的数据
      return this.departmentPerformance.employees;
    }
  },
  methods: {
    // 树形结构相关方法
    getDepartmentIcon(item) {
      return item.children && item.children.length ? 'mdi-domain' : 'mdi-folder-account';
    },
    
    // 部门选择
    onDepartmentSelect(items) {
      if (items.length) {
        this.activeDepartment = items[0];
      } else {
        this.activeDepartment = null;
      }
    },
    
    // 部门操作
    editDepartment(department) {
      this.editingDepartment = department;
      this.departmentForm = {
        name: department.name,
        director: department.director || '',
        manager: department.manager || '',
        parentId: null, // 需要根据实际结构设置
        description: department.description || ''
      };
      this.showAddDepartmentDialog = true;
    },
    
    saveDepartment() {
      if (!this.$refs.departmentForm.validate()) return;
      
      if (this.editingDepartment) {
        // 更新部门逻辑
        this.findAndUpdateDepartment(this.departments, this.editingDepartment.id, this.departmentForm);
      } else {
        // 添加新部门逻辑
        const newDepartment = {
          id: Math.floor(Math.random() * 1000) + 100, // 临时ID生成
          name: this.departmentForm.name,
          director: this.departmentForm.director,
          manager: this.departmentForm.manager,
          createdAt: new Date().toISOString().split('T')[0],
          description: this.departmentForm.description,
          employees: []
        };
        
        // 如果有父部门，添加到父部门的children
        if (this.departmentForm.parentId) {
          this.findAndAddDepartment(this.departments, this.departmentForm.parentId, newDepartment);
        } else {
          // 否则添加到根级
          this.departments.push(newDepartment);
        }
      }
      
      // 重置表单
      this.$refs.departmentForm.reset();
      this.editingDepartment = null;
      this.showAddDepartmentDialog = false;
      
      // 提示信息
      this.$nextTick(() => {
        alert('部门保存成功！');
      });
    },
    
    deleteDepartment() {
      if (!this.activeDepartment) return;
      
      // 删除部门逻辑
      this.findAndDeleteDepartment(this.departments, this.activeDepartment.id);
      
      this.confirmDeleteDialog = false;
      this.activeDepartment = null;
      
      // 提示信息
      this.$nextTick(() => {
        alert('部门删除成功！');
      });
    },
    
    // 辅助方法 - 查找并更新部门
    findAndUpdateDepartment(items, id, updateData) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          // 更新部门数据
          items[i].name = updateData.name;
          items[i].director = updateData.director;
          items[i].manager = updateData.manager;
          items[i].description = updateData.description;
          return true;
        }
        
        if (items[i].children && items[i].children.length) {
          if (this.findAndUpdateDepartment(items[i].children, id, updateData)) {
            return true;
          }
        }
      }
      
      return false;
    },
    
    // 辅助方法 - 查找并添加部门
    findAndAddDepartment(items, parentId, newDepartment) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === parentId) {
          // 初始化children数组
          if (!items[i].children) {
            items[i].children = [];
          }
          // 添加到父部门的children
          items[i].children.push(newDepartment);
          return true;
        }
        
        if (items[i].children && items[i].children.length) {
          if (this.findAndAddDepartment(items[i].children, parentId, newDepartment)) {
            return true;
          }
        }
      }
      
      return false;
    },
    
    // 辅助方法 - 查找并删除部门
    findAndDeleteDepartment(items, id) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          // 删除部门
          items.splice(i, 1);
          return true;
        }
        
        if (items[i].children && items[i].children.length) {
          if (this.findAndDeleteDepartment(items[i].children, id)) {
            return true;
          }
        }
      }
      
      return false;
    },
    
    // 员工操作
    editEmployee(employee) {
      this.editingEmployee = employee;
      this.employeeForm = {
        name: employee.name,
        position: employee.position,
        account: employee.account,
        departmentId: this.activeDepartment ? this.activeDepartment.id : null
      };
      this.showAddEmployeeDialog = true;
    },
    
    saveEmployee() {
      if (!this.$refs.employeeForm.validate()) return;
      
      if (this.editingEmployee) {
        // 更新员工
        const index = this.activeDepartment.employees.findIndex(e => e.id === this.editingEmployee.id);
        if (index !== -1) {
          this.activeDepartment.employees[index] = {
            ...this.editingEmployee,
            name: this.employeeForm.name,
            position: this.employeeForm.position,
            account: this.employeeForm.account,
            department: this.activeDepartment.name
          };
        }
      } else {
        // 添加新员工
        const newEmployee = {
          id: Math.floor(Math.random() * 1000) + 200, // 临时ID生成
          name: this.employeeForm.name,
          position: this.employeeForm.position,
          account: this.employeeForm.account,
          department: this.activeDepartment.name
        };
        
        // 确保目标部门有employees数组
        if (!this.activeDepartment.employees) {
          this.activeDepartment.employees = [];
        }
        
        this.activeDepartment.employees.push(newEmployee);
      }
      
      // 重置表单
      this.$refs.employeeForm.reset();
      this.editingEmployee = null;
      this.showAddEmployeeDialog = false;
      
      // 提示信息
      this.$nextTick(() => {
        alert('员工保存成功！');
      });
    },
    
    confirmDeleteEmployee(employee) {
      this.employeeToDelete = employee;
      this.confirmDeleteEmployeeDialog = true;
    },
    
    deleteEmployee() {
      if (!this.employeeToDelete || !this.activeDepartment.employees) return;
      
      // 从员工数组中删除
      const index = this.activeDepartment.employees.findIndex(e => e.id === this.employeeToDelete.id);
      if (index !== -1) {
        this.activeDepartment.employees.splice(index, 1);
      }
      
      this.confirmDeleteEmployeeDialog = false;
      this.employeeToDelete = null;
      
      // 提示信息
      this.$nextTick(() => {
        alert('员工删除成功！');
      });
    },
    
    // 权限保存
    savePermissions() {
      // 这里实现保存权限的逻辑
      alert('权限设置已保存！');
    },
    
    // 筛选绩效数据
    filterPerformanceByMonth() {
      // 在实际应用中，这里会触发从服务器获取新数据
      console.log(`加载 ${this.selectedMonth} 的绩效数据`);
      // 模拟加载不同月份数据的场景
      // 实际应用中这里应该是个API调用
    },
    
    // 根据完成率获取对应的颜色
    getCompletionColor(completion) {
      if (completion >= 90) return '#4CAF50'; // 绿色
      if (completion >= 70) return '#8BC34A'; // 浅绿色
      if (completion >= 50) return '#FFC107'; // 黄色
      return '#F44336'; // 红色
    },
    
    // 显示绩效详情
    showPerformanceDetail(employee) {
      this.selectedEmployee = employee;
      this.showPerformanceDetailDialog = true;
    }
  }
}
</script>

<style scoped>
.organization-management {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.organization-container {
  display: flex;
  min-height: 80vh;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

/* 左侧树形结构 */
.department-tree {
  width: 300px;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  background-color: #f9f9f9;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 15px;
}

.tree-container {
  max-height: calc(80vh - 150px);
  overflow-y: auto;
  margin-bottom: 15px;
}

.tree {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tree-item {
  margin-bottom: 5px;
}

.tree-node {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tree-node:hover {
  background-color: #f0f0f0;
}

.tree-node.active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.tree-icon {
  margin-right: 8px;
}

.sub-tree {
  list-style: none;
  padding-left: 20px;
  margin-top: 5px;
}

.tree-actions {
  text-align: center;
}

/* 右侧详情区 */
.department-details {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.details-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.tab {
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  background-color: #f0f0f0;
}

.tab.active {
  border-bottom-color: #1976d2;
  color: #1976d2;
  background-color: white;
}

.tab-content {
  padding: 20px;
}

.tab-pane {
  min-height: 300px;
}

.info-list {
  display: grid;
  gap: 15px;
}

.info-item {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
}

.info-label {
  width: 120px;
  font-weight: bold;
  color: #555;
}

.info-value {
  flex: 1;
}

.panel-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-actions.right {
  justify-content: flex-end;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #555;
}

.data-table tbody tr:hover {
  background-color: #f9f9f9;
}

.empty-message {
  text-align: center;
  padding: 30px;
  color: #888;
}

.actions-cell {
  display: flex;
  gap: 5px;
}

.permission-list {
  display: grid;
  gap: 15px;
  margin: 20px 0;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.metric-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.metric-card {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.metric-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: #555;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
}

.progress-bar {
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 15px;
  overflow: hidden;
}

.progress-fill {
  height: 20px;
  background-color: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.no-department-selected {
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #9e9e9e;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.primary-btn {
  background-color: #1976d2;
  color: white;
}

.primary-btn:hover {
  background-color: #1565c0;
}

.secondary-btn {
  background-color: #f5f5f5;
  color: #333;
}

.secondary-btn:hover {
  background-color: #e0e0e0;
}

.danger-btn {
  background-color: #f44336;
  color: white;
}

.danger-btn:hover {
  background-color: #e53935;
}

.btn-icon {
  margin-right: 5px;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s;
}

.icon-btn.small {
  font-size: 14px;
}

.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.edit-btn:hover {
  color: #1976d2;
}

.delete-btn:hover {
  color: #f44336;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow: auto;
}

.confirmation-modal {
  width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .organization-container {
    flex-direction: column;
  }
  
  .department-tree {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .metric-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 绩效考核页面样式 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-item label {
  margin-right: 10px;
  font-weight: 500;
}

.month-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

.summary-item {
  font-size: 16px;
}

.team-score {
  color: #1976d2;
  font-size: 18px;
}

.metric-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.metric-card {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.metric-title {
  font-size: 16px;
  margin-bottom: 10px;
  color: #555;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
}

.btn.small {
  padding: 4px 8px;
  font-size: 12px;
}

/* 绩效详情样式 */
.performance-detail-modal {
  width: 800px;
  max-width: 90%;
  max-height: 90vh;
}

.performance-detail {
  padding: 0 10px;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.performance-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.performance-header {
  background-color: #f5f5f5;
  padding: 10px 15px;
  font-weight: 500;
}

.performance-content {
  padding: 15px;
}

.target-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.target-item:last-child {
  margin-bottom: 0;
}

.star-rating {
  color: #FFC107;
}

.review-summary {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 10px 15px;
  border-radius: 4px;
}

.quality-grid {
  display: grid;
  gap: 15px;
}

.quality-item {
  display: flex;
  align-items: center;
}

.quality-label {
  width: 120px;
}

.quality-rating {
  flex: 1;
}

.total-score {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.summary-item.large {
  font-size: 18px;
  margin-bottom: 15px;
}

.summary-item.large strong {
  font-size: 24px;
  color: #1976d2;
}

.rating-breakdown {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (max-width: 768px) {
  .metric-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .info-grid,
  .performance-grid,
  .rating-breakdown {
    grid-template-columns: 1fr;
  }
  
  .performance-detail-modal {
    width: 95%;
  }
}

/* 目标单元格样式 */
.target-cell {
  min-width: 180px;
  padding: 8px 0;
}

.target-value {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
}

.progress-bar {
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background-color: #1976d2;
}

.completion-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.completion-percent {
  color: #666;
}

.current-value {
  color: #666;
}
</style> 