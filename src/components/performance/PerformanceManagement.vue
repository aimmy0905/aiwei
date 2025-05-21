<template>
  <div class="performance-management">
    <h1 class="page-title">业绩管理</h1>
    
    <div class="filter-bar">
      <div class="filter-group">
        <label for="period-select">业绩周期：</label>
        <select id="period-select" v-model="selectedPeriod" class="period-select">
          <option v-for="period in periods" :key="period.value" :value="period.value">
            {{ period.label }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label for="month-select">月份：</label>
        <select id="month-select" v-model="selectedMonth" class="month-select">
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label for="department-select">部门：</label>
        <select id="department-select" v-model="selectedDepartment" class="department-select">
          <option value="">全部部门</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label for="employee-select">员工：</label>
        <select id="employee-select" v-model="selectedEmployee" class="employee-select">
          <option value="">全部员工</option>
          <option v-for="emp in filteredEmployees" :key="emp.id" :value="emp.id">
            {{ emp.name }}
          </option>
        </select>
      </div>
      <button class="btn primary-btn" @click="applyFilters">
        查询
      </button>
      <button class="btn create-btn" @click="goToCreateGoal">
        创建员工目标
      </button>
    </div>
    
    <div class="performance-overview">
      <div class="metric-cards">
        <div class="metric-card">
          <div class="metric-title">销售额目标</div>
          <div class="metric-value">¥{{ totalSalesTarget.toLocaleString() }}</div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: salesCompletion + '%', backgroundColor: getCompletionColor(salesCompletion) }"
            ></div>
          </div>
          <div class="completion-info">
            <span class="completion-percent">{{ salesCompletion }}%</span>
            <span class="current-value">当前: ¥{{ totalSalesActual.toLocaleString() }}</span>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-title">ROI目标</div>
          <div class="metric-value">{{ totalRoiTarget }}%</div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: roiCompletion + '%', backgroundColor: getCompletionColor(roiCompletion) }"
            ></div>
          </div>
          <div class="completion-info">
            <span class="completion-percent">{{ roiCompletion }}%</span>
            <span class="current-value">当前: {{ totalRoiActual }}%</span>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-title">返点目标</div>
          <div class="metric-value">{{ totalRebateTarget }}%</div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: rebateCompletion + '%', backgroundColor: getCompletionColor(rebateCompletion) }"
            ></div>
          </div>
          <div class="completion-info">
            <span class="completion-percent">{{ rebateCompletion }}%</span>
            <span class="current-value">当前: {{ totalRebateActual }}%</span>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-title">进度目标</div>
          <div class="metric-value">{{ totalProgressTarget }}%</div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: progressCompletion + '%', backgroundColor: getCompletionColor(progressCompletion) }"
            ></div>
          </div>
          <div class="completion-info">
            <span class="completion-percent">{{ progressCompletion }}%</span>
            <span class="current-value">当前: {{ totalProgressActual }}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="performance-table-container">
      <h2>业绩明细</h2>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>员工</th>
            <th>部门</th>
            <th>销售额目标</th>
            <th>ROI目标</th>
            <th>返点目标</th>
            <th>进度目标</th>
            <th>客户评价得分</th>
            <th>个人素质得分</th>
            <th>考核总分</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in filteredPerformance" :key="index">
            <td>{{ record.employee }}</td>
            <td>{{ record.department }}</td>
            <td>
              <div class="target-cell">
                <div class="target-value">¥{{ record.salesTarget.toLocaleString() }}</div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: record.salesCompletion + '%', backgroundColor: getCompletionColor(record.salesCompletion) }"
                  ></div>
                </div>
                <div class="completion-info">
                  <span class="completion-percent">{{ record.salesCompletion }}%</span>
                  <span class="current-value">当前: ¥{{ record.salesActual.toLocaleString() }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="target-cell">
                <div class="target-value">{{ record.roiTarget }}%</div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: record.roiCompletion + '%', backgroundColor: getCompletionColor(record.roiCompletion) }"
                  ></div>
                </div>
                <div class="completion-info">
                  <span class="completion-percent">{{ record.roiCompletion }}%</span>
                  <span class="current-value">当前: {{ record.roiActual }}%</span>
                </div>
              </div>
            </td>
            <td>
              <div class="target-cell">
                <div class="target-value">{{ record.rebateTarget }}%</div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: record.rebateCompletion + '%', backgroundColor: getCompletionColor(record.rebateCompletion) }"
                  ></div>
                </div>
                <div class="completion-info">
                  <span class="completion-percent">{{ record.rebateCompletion }}%</span>
                  <span class="current-value">当前: {{ record.rebateActual }}%</span>
                </div>
              </div>
            </td>
            <td>
              <div class="target-cell">
                <div class="target-value">{{ record.progressTarget }}%</div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: record.progressCompletion + '%', backgroundColor: getCompletionColor(record.progressCompletion) }"
                  ></div>
                </div>
                <div class="completion-info">
                  <span class="completion-percent">{{ record.progressCompletion }}%</span>
                  <span class="current-value">当前: {{ record.progressActual }}%</span>
                </div>
              </div>
            </td>
            <td>
              <div class="score-cell">
                <span class="score-value">{{ record.customerRating || 0 }}</span>
                <div class="star-rating">
                  <i class="fas fa-star" v-for="n in Math.floor(record.customerRating || 0)" :key="n"></i>
                  <i class="far fa-star" v-for="n in 5-Math.floor(record.customerRating || 0)" :key="n+5"></i>
                </div>
              </div>
            </td>
            <td>
              <div class="score-cell">
                <span class="score-value">{{ record.qualityRating || 0 }}</span>
                <div class="quality-bar">
                  <div class="quality-fill" :style="{ width: ((record.qualityRating || 0) / 10 * 100) + '%', backgroundColor: getQualityColor(record.qualityRating || 0) }">
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="score-cell total-score">
                {{ record.totalScore || 0 }}
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn secondary-btn small" @click="showDetailDialog(record)">
                  查看详情
                </button>
                <button class="btn quality-btn small" @click="showQualityDialog(record)">
                  评分
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredPerformance.length === 0">
            <td colspan="10" class="empty-message">暂无业绩数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 业绩详情对话框 -->
    <div v-if="showDetailModal" class="modal-overlay">
      <div class="modal-container performance-detail-modal">
        <div class="modal-header">
          <h3>业绩详情 - {{ selectedRecord.employee }}</h3>
          <button class="close-btn" @click="showDetailModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="performance-detail">
            <div class="detail-section">
              <h4>基本信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">姓名:</div>
                  <div class="info-value">{{ selectedRecord.employee }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">部门:</div>
                  <div class="info-value">{{ selectedRecord.department }}</div>
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
                      <strong>¥{{ selectedRecord.salesTarget.toLocaleString() }}</strong>
                    </div>
                    <div class="target-item">
                      <span>实际：</span>
                      <strong>¥{{ selectedRecord.salesActual.toLocaleString() }}</strong>
                    </div>
                    <div class="target-item">
                      <span>完成率：</span>
                      <strong>{{ selectedRecord.salesCompletion }}%</strong>
                    </div>
                    <div class="compare-chart">
                      <div class="chart-bar target-bar" :style="{ width: '100%' }"></div>
                      <div class="chart-bar actual-bar" :style="{ width: selectedRecord.salesCompletion + '%' }"></div>
                      <div class="chart-labels">
                        <span class="target-label">目标</span>
                        <span class="actual-label">实际 ({{ selectedRecord.salesCompletion }}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="performance-item">
                  <div class="performance-header">ROI</div>
                  <div class="performance-content">
                    <div class="target-item">
                      <span>目标：</span>
                      <strong>{{ selectedRecord.roiTarget }}%</strong>
                    </div>
                    <div class="target-item">
                      <span>实际：</span>
                      <strong>{{ selectedRecord.roiActual }}%</strong>
                    </div>
                    <div class="target-item">
                      <span>完成率：</span>
                      <strong>{{ selectedRecord.roiCompletion }}%</strong>
                    </div>
                    <div class="compare-chart">
                      <div class="chart-bar target-bar" :style="{ width: '100%' }"></div>
                      <div class="chart-bar actual-bar" :style="{ width: selectedRecord.roiCompletion + '%' }"></div>
                      <div class="chart-labels">
                        <span class="target-label">目标</span>
                        <span class="actual-label">实际 ({{ selectedRecord.roiCompletion }}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="performance-item">
                  <div class="performance-header">返点</div>
                  <div class="performance-content">
                    <div class="target-item">
                      <span>目标：</span>
                      <strong>{{ selectedRecord.rebateTarget }}%</strong>
                    </div>
                    <div class="target-item">
                      <span>实际：</span>
                      <strong>{{ selectedRecord.rebateActual }}%</strong>
                    </div>
                    <div class="target-item">
                      <span>完成率：</span>
                      <strong>{{ selectedRecord.rebateCompletion }}%</strong>
                    </div>
                    <div class="compare-chart">
                      <div class="chart-bar target-bar" :style="{ width: '100%' }"></div>
                      <div class="chart-bar actual-bar" :style="{ width: selectedRecord.rebateCompletion + '%' }"></div>
                      <div class="chart-labels">
                        <span class="target-label">目标</span>
                        <span class="actual-label">实际 ({{ selectedRecord.rebateCompletion }}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="performance-item">
                  <div class="performance-header">进度</div>
                  <div class="performance-content">
                    <div class="target-item">
                      <span>目标：</span>
                      <strong>{{ selectedRecord.progressTarget }}%</strong>
                    </div>
                    <div class="target-item">
                      <span>实际：</span>
                      <strong>{{ selectedRecord.progressActual }}%</strong>
                    </div>
                    <div class="target-item">
                      <span>完成率：</span>
                      <strong>{{ selectedRecord.progressCompletion }}%</strong>
                    </div>
                    <div class="compare-chart">
                      <div class="chart-bar target-bar" :style="{ width: '100%' }"></div>
                      <div class="chart-bar actual-bar" :style="{ width: selectedRecord.progressCompletion + '%' }"></div>
                      <div class="chart-labels">
                        <span class="target-label">目标</span>
                        <span class="actual-label">实际 ({{ selectedRecord.progressCompletion }}%)</span>
                      </div>
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
                  <tr v-for="(review, reviewIndex) in selectedRecord.customerReviews || []" :key="reviewIndex">
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
                  <tr v-if="!selectedRecord.customerReviews || selectedRecord.customerReviews.length === 0">
                    <td colspan="4" class="empty-message">暂无客户评价</td>
                  </tr>
                </tbody>
              </table>
              
              <div class="review-summary">
                <div class="summary-item">
                  <span>平均评分：</span>
                  <strong>{{ selectedRecord.customerRating || 0 }}分</strong>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>个人素质评估</h4>
              <div class="quality-grid">
                <div class="quality-item" v-for="(quality, qualityIndex) in selectedRecord.qualityRatings || []" :key="qualityIndex">
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
                  <span>个人素质得分：</span>
                  <strong>{{ selectedRecord.qualityRating || 0 }}分</strong>
                </div>
                <div class="summary-item">
                  <span>考核总分：</span>
                  <strong>{{ selectedRecord.totalScore || 0 }}分</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn primary-btn" @click="showDetailModal = false">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 个人素质评分对话框 -->
    <div v-if="showQualityModal" class="modal-overlay">
      <div class="modal-container quality-modal">
        <div class="modal-header">
          <h3>个人素质评分 - {{ selectedRecord.employee }}</h3>
          <button class="close-btn" @click="showQualityModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="quality-rating-form">
            <div class="form-group" v-for="(quality, index) in qualityForm" :key="index">
              <label :for="'quality-' + index">{{ quality.name }}:</label>
              <div class="rating-input">
                <input 
                  :id="'quality-' + index"
                  type="range" 
                  v-model="quality.score" 
                  min="1" 
                  max="10" 
                  step="0.5"
                  class="range-slider"
                />
                <span class="rating-value">{{ quality.score }}</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="quality-comment">评价内容:</label>
              <textarea 
                id="quality-comment" 
                v-model="qualityComment" 
                placeholder="请输入评价内容..."
                class="comment-input"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn secondary-btn" @click="showQualityModal = false">取消</button>
          <button class="btn primary-btn" @click="saveQualityRating">保存评分</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PerformanceManagement',
  data() {
    return {
      // 筛选条件
      selectedPeriod: '2023-Q2',
      selectedMonth: '2023-04',
      selectedDepartment: '',
      selectedEmployee: '',
      
      // 弹窗相关
      showDetailModal: false,
      selectedRecord: null,
      showQualityModal: false,
      qualityForm: [],
      qualityComment: '',
      
      // 周期选项
      periods: [
        { value: '2023-Q1', label: '2023年第一季度' },
        { value: '2023-Q2', label: '2023年第二季度' },
        { value: '2022-Q4', label: '2022年第四季度' },
        { value: '2022-Q3', label: '2022年第三季度' }
      ],
      
      // 月份选项
      months: [
        { value: '2023-05', label: '2023年5月' },
        { value: '2023-04', label: '2023年4月' },
        { value: '2023-03', label: '2023年3月' },
        { value: '2023-02', label: '2023年2月' },
        { value: '2023-01', label: '2023年1月' },
        { value: '2022-12', label: '2022年12月' },
        { value: '2022-11', label: '2022年11月' },
        { value: '2022-10', label: '2022年10月' }
      ],
      
      // 部门数据
      departments: [
        { id: 1, name: '市场部' },
        { id: 2, name: '销售部' },
        { id: 3, name: '产品部' },
        { id: 4, name: '技术部' },
        { id: 5, name: '客服部' }
      ],
      
      // 员工数据
      employees: [
        { id: 101, name: '张三', departmentId: 1 },
        { id: 102, name: '李四', departmentId: 1 },
        { id: 103, name: '王五', departmentId: 2 },
        { id: 104, name: '赵六', departmentId: 2 },
        { id: 105, name: '钱七', departmentId: 3 },
        { id: 106, name: '孙八', departmentId: 3 },
        { id: 107, name: '周九', departmentId: 4 },
        { id: 108, name: '吴十', departmentId: 4 },
        { id: 109, name: '郑十一', departmentId: 5 },
        { id: 110, name: '王十二', departmentId: 5 }
      ],
      
      // 业绩数据
      performanceData: [
        // 4月份数据
        {
          id: 1,
          period: '2023-Q2',
          month: '2023-04',
          employee: '张三',
          employeeId: 101,
          department: '销售部',
          departmentId: 1,
          position: '销售经理',
          
          // 业务指标
          salesTarget: 1000000,
          salesActual: 920000,
          salesCompletion: 92,
          
          profitTarget: 300000,
          profitActual: 260000,
          profitCompletion: 87,
          
          costTarget: 700000,
          costActual: 660000,
          costCompletion: 106, // 成本越低越好
          
          roiTarget: 40,
          roiActual: 35,
          roiCompletion: 88,
          
          userTarget: 500,
          userActual: 480,
          userCompletion: 96,
          
          // 新增客户评价和个人素质相关
          customerRating: 4.5,
          qualityRating: 8.2,
          totalScore: 85,
          overallCompletion: 92,
          
          // 客户评价
          customerReviews: [
            {
              customerName: '北京某科技公司',
              rating: 5,
              comment: '服务态度很好，专业知识扎实',
              date: '2023-04-15'
            },
            {
              customerName: '上海某贸易公司',
              rating: 4,
              comment: '响应速度快，但方案可以更全面',
              date: '2023-04-22'
            }
          ],
          
          // 个人素质评估
          qualityRatings: [
            { name: '专业知识', score: 8.5 },
            { name: '沟通能力', score: 9.0 },
            { name: '团队协助', score: 7.5 },
            { name: '解决问题', score: 8.0 }
          ]
        },
        {
          id: 2,
          employeeId: 103,
          employee: '王五',
          departmentId: 2,
          department: '销售部',
          period: '2023-Q2',
          month: '2023-04',
          
          salesTarget: 300000,
          salesActual: 180000,
          salesCompletion: 60,
          salesYearGrowth: 10,
          salesMonthGrowth: 2,
          
          profitTarget: 90000,
          profitActual: 68000,
          profitCompletion: 76,
          profitYearGrowth: 12,
          profitMonthGrowth: 5,
          
          costTarget: 70000,
          costActual: 42000,
          costCompletion: 60,
          costYearGrowth: -8,
          costMonthGrowth: -3,
          
          roiTarget: 320,
          roiActual: 290,
          roiCompletion: 91,
          roiYearGrowth: 18,
          roiMonthGrowth: 6,
          
          userTarget: 8000,
          userActual: 4200,
          userCompletion: 53,
          userYearGrowth: 15,
          userMonthGrowth: 4,
          
          customerRating: 4.2,
          qualityRating: 7.8,
          totalScore: 78,
          overallCompletion: 68,
          
          // 客户评价
          customerReviews: [
            {
              customerName: '杭州某互联网公司',
              rating: 4,
              comment: '服务态度很好，但响应稍慢',
              date: '2023-04-18'
            },
            {
              customerName: '广州某贸易公司',
              rating: 5,
              comment: '解决方案很专业',
              date: '2023-04-25'
            }
          ],
          
          // 个人素质评估
          qualityRatings: [
            { name: '专业知识', score: 8.0 },
            { name: '沟通能力', score: 7.5 },
            { name: '团队协助', score: 8.0 },
            { name: '解决问题', score: 7.5 }
          ]
        },
        {
          id: 3,
          employeeId: 105,
          employee: '钱七',
          departmentId: 3,
          department: '产品部',
          period: '2023-Q2',
          month: '2023-04',
          
          salesTarget: 520000,
          salesActual: 260000,
          salesCompletion: 50,
          salesYearGrowth: 5,
          salesMonthGrowth: 0,
          
          profitTarget: 160000,
          profitActual: 84000,
          profitCompletion: 53,
          profitYearGrowth: 3,
          profitMonthGrowth: -1,
          
          costTarget: 110000,
          costActual: 65000,
          costCompletion: 59,
          costYearGrowth: -2,
          costMonthGrowth: 1,
          
          roiTarget: 360,
          roiActual: 310,
          roiCompletion: 86,
          roiYearGrowth: 10,
          roiMonthGrowth: 2,
          
          userTarget: 11000,
          userActual: 5300,
          userCompletion: 48,
          userYearGrowth: 8,
          userMonthGrowth: 0,
          
          customerRating: 3.8,
          qualityRating: 7.5,
          totalScore: 72,
          overallCompletion: 59,
          
          // 客户评价
          customerReviews: [
            {
              customerName: '北京某电商公司',
              rating: 3,
              comment: '产品迭代速度有待提高',
              date: '2023-04-10'
            },
            {
              customerName: '深圳某科技公司',
              rating: 4,
              comment: '产品功能完善，但上线时间晚于预期',
              date: '2023-04-20'
            }
          ],
          
          // 个人素质评估
          qualityRatings: [
            { name: '专业知识', score: 8.5 },
            { name: '沟通能力', score: 7.0 },
            { name: '团队协助', score: 7.0 },
            { name: '解决问题', score: 7.5 }
          ]
        },
        {
          id: 4,
          employeeId: 107,
          employee: '周九',
          departmentId: 4,
          department: '技术部',
          period: '2023-Q2',
          month: '2023-04',
          
          salesTarget: 320000,
          salesActual: 130000,
          salesCompletion: 41,
          salesYearGrowth: 2,
          salesMonthGrowth: -2,
          
          profitTarget: 98000,
          profitActual: 42000,
          profitCompletion: 43,
          profitYearGrowth: 1,
          profitMonthGrowth: -3,
          
          costTarget: 75000,
          costActual: 38000,
          costCompletion: 51,
          costYearGrowth: -6,
          costMonthGrowth: -2,
          
          roiTarget: 330,
          roiActual: 270,
          roiCompletion: 82,
          roiYearGrowth: 8,
          roiMonthGrowth: 1,
          
          userTarget: 8500,
          userActual: 3800,
          userCompletion: 45,
          userYearGrowth: 5,
          userMonthGrowth: -1,
          
          customerRating: 4.0,
          qualityRating: 8.0,
          totalScore: 74,
          overallCompletion: 52,
          
          // 客户评价
          customerReviews: [
            {
              customerName: '上海某金融公司',
              rating: 4,
              comment: '系统稳定性好，但新功能开发有延迟',
              date: '2023-04-12'
            },
            {
              customerName: '成都某互联网公司',
              rating: 4,
              comment: '解决问题及时，技术实力强',
              date: '2023-04-22'
            }
          ],
          
          // 个人素质评估
          qualityRatings: [
            { name: '专业知识', score: 9.0 },
            { name: '沟通能力', score: 7.0 },
            { name: '团队协助', score: 8.0 },
            { name: '解决问题', score: 8.5 }
          ]
        },
        {
          id: 5,
          employeeId: 109,
          employee: '郑十一',
          departmentId: 5,
          department: '客服部',
          period: '2023-Q2',
          month: '2023-04',
          
          salesTarget: 200000,
          salesActual: 0,
          salesCompletion: 0,
          salesYearGrowth: 0,
          salesMonthGrowth: 0,
          
          profitTarget: 60000,
          profitActual: 0,
          profitCompletion: 0,
          profitYearGrowth: 0,
          profitMonthGrowth: 0,
          
          costTarget: 50000,
          costActual: 15000,
          costCompletion: 30,
          costYearGrowth: -10,
          costMonthGrowth: -5,
          
          roiTarget: 300,
          roiActual: 0,
          roiCompletion: 0,
          roiYearGrowth: 0,
          roiMonthGrowth: 0,
          
          userTarget: 5000,
          userActual: 0,
          userCompletion: 0,
          userYearGrowth: 0,
          userMonthGrowth: 0,
          
          customerRating: 4.8,
          qualityRating: 8.5,
          totalScore: 70,
          overallCompletion: 6,
          
          // 客户评价
          customerReviews: [
            {
              customerName: '武汉某制造公司',
              rating: 5,
              comment: '客服响应速度快，服务态度很好',
              date: '2023-04-05'
            },
            {
              customerName: '长沙某零售公司',
              rating: 5,
              comment: '问题解决得很彻底，很专业',
              date: '2023-04-15'
            },
            {
              customerName: '南京某教育机构',
              rating: 4,
              comment: '服务质量高，但流程较复杂',
              date: '2023-04-25'
            }
          ],
          
          // 个人素质评估
          qualityRatings: [
            { name: '专业知识', score: 8.0 },
            { name: '沟通能力', score: 9.5 },
            { name: '团队协助', score: 8.0 },
            { name: '解决问题', score: 8.5 }
          ]
        },
        // 3月份数据
        {
          id: 6,
          period: '2023-Q1',
          month: '2023-03',
          employee: '张三',
          employeeId: 101,
          department: '销售部',
          departmentId: 1,
          position: '销售经理',
          
          // 业务指标
          salesTarget: 950000,
          salesActual: 830000,
          salesCompletion: 87,
          
          profitTarget: 280000,
          profitActual: 235000,
          profitCompletion: 84,
          
          costTarget: 670000,
          costActual: 625000,
          costCompletion: 107,
          
          roiTarget: 38,
          roiActual: 33,
          roiCompletion: 87,
          
          userTarget: 480,
          userActual: 420,
          userCompletion: 88,
          
          // 评价相关
          customerRating: 4.2,
          qualityRating: 8.0,
          totalScore: 82,
          overallCompletion: 88,
          
          // 客户评价
          customerReviews: [
            {
              customerName: '北京某传媒公司',
              rating: 4,
              comment: '服务专业，但有改进空间',
              date: '2023-03-10'
            },
            {
              customerName: '广州某零售公司',
              rating: 5,
              comment: '解决方案很好，效果明显',
              date: '2023-03-25'
            }
          ],
          
          // 个人素质评估
          qualityRatings: [
            { name: '专业知识', score: 8.0 },
            { name: '沟通能力', score: 8.5 },
            { name: '团队协助', score: 7.5 },
            { name: '解决问题', score: 8.0 }
          ]
        },
        {
          id: 7,
          period: '2023-Q1',
          month: '2023-03',
          employee: '王五',
          employeeId: 103,
          department: '销售部',
          departmentId: 2,
          position: '销售代表',
          
          // 业务指标
          salesTarget: 280000,
          salesActual: 230000,
          salesCompletion: 82,
          
          profitTarget: 85000,
          profitActual: 72000,
          profitCompletion: 85,
          
          costTarget: 68000,
          costActual: 58000,
          costCompletion: 115,
          
          roiTarget: 310,
          roiActual: 280,
          roiCompletion: 90,
          
          userTarget: 7500,
          userActual: 6200,
          userCompletion: 83,
          
          // 评价相关
          customerRating: 4.0,
          qualityRating: 7.5,
          totalScore: 81,
          overallCompletion: 85,
          
          // 客户评价
          customerReviews: [
            {
              customerName: '深圳某电子公司',
              rating: 4,
              comment: '态度很好，专业能力强',
              date: '2023-03-15'
            }
          ],
          
          // 个人素质评估
          qualityRatings: [
            { name: '专业知识', score: 7.5 },
            { name: '沟通能力', score: 8.0 },
            { name: '团队协助', score: 7.0 },
            { name: '解决问题', score: 7.5 }
          ]
        }
      ]
    };
  },
  computed: {
    // 根据部门筛选员工
    filteredEmployees() {
      if (!this.selectedDepartment) {
        return this.employees;
      }
      return this.employees.filter(emp => emp.departmentId === parseInt(this.selectedDepartment));
    },
    
    // 根据筛选条件过滤业绩数据
    filteredPerformance() {
      return this.performanceData.filter(record => {
        // 根据周期筛选
        if (record.period !== this.selectedPeriod) {
          return false;
        }
        
        // 根据月份筛选
        if (record.month !== this.selectedMonth) {
          return false;
        }
        
        // 根据部门筛选
        if (this.selectedDepartment && record.departmentId !== parseInt(this.selectedDepartment)) {
          return false;
        }
        
        // 根据员工筛选
        if (this.selectedEmployee && record.employeeId !== parseInt(this.selectedEmployee)) {
          return false;
        }
        
        return true;
      });
    },
    
    // 计算汇总数据
    totalSalesTarget() {
      return this.calculateTotal('salesTarget');
    },
    totalSalesActual() {
      return this.calculateTotal('salesActual');
    },
    salesCompletion() {
      return this.calculateCompletion(this.totalSalesActual, this.totalSalesTarget);
    },
    
    totalProfitTarget() {
      return this.calculateTotal('profitTarget');
    },
    totalProfitActual() {
      return this.calculateTotal('profitActual');
    },
    profitCompletion() {
      return this.calculateCompletion(this.totalProfitActual, this.totalProfitTarget);
    },
    
    totalCostTarget() {
      return this.calculateTotal('costTarget');
    },
    totalCostActual() {
      return this.calculateTotal('costActual');
    },
    costCompletion() {
      return this.calculateCompletion(this.totalCostActual, this.totalCostTarget);
    },
    
    totalRoiTarget() {
      // ROI是平均值而非累加
      const filtered = this.filteredPerformance;
      if (filtered.length === 0) return 0;
      
      const sum = filtered.reduce((acc, item) => acc + item.roiTarget, 0);
      return Math.round(sum / filtered.length);
    },
    totalRoiActual() {
      // ROI是平均值而非累加
      const filtered = this.filteredPerformance;
      if (filtered.length === 0) return 0;
      
      const sum = filtered.reduce((acc, item) => acc + item.roiActual, 0);
      return Math.round(sum / filtered.length);
    },
    roiCompletion() {
      return this.calculateCompletion(this.totalRoiActual, this.totalRoiTarget);
    },
    
    totalUserTarget() {
      return this.calculateTotal('userTarget');
    },
    totalUserActual() {
      return this.calculateTotal('userActual');
    },
    userCompletion() {
      return this.calculateCompletion(this.totalUserActual, this.totalUserTarget);
    },
    
    totalRebateTarget() {
      // 假设返点目标是一个固定值
      return 5; // 这里需要根据实际业务逻辑计算
    },
    totalRebateActual() {
      // 假设返点实际是一个固定值
      return 5; // 这里需要根据实际业务逻辑计算
    },
    rebateCompletion() {
      return 100; // 假设返点完成度是100%
    },
    
    totalProgressTarget() {
      // 假设进度目标是一个固定值
      return 100; // 这里需要根据实际业务逻辑计算
    },
    totalProgressActual() {
      // 假设进度实际是一个固定值
      return 100; // 这里需要根据实际业务逻辑计算
    },
    progressCompletion() {
      return 100; // 假设进度完成度是100%
    }
  },
  methods: {
    // 应用筛选条件
    applyFilters() {
      // 实际项目中可能需要从API获取数据
      console.log('应用筛选', {
        period: this.selectedPeriod,
        month: this.selectedMonth,
        department: this.selectedDepartment,
        employee: this.selectedEmployee
      });
    },
    
    // 计算总和
    calculateTotal(field) {
      return this.filteredPerformance.reduce((sum, record) => sum + record[field], 0);
    },
    
    // 计算完成率
    calculateCompletion(actual, target) {
      if (!target) return 0;
      return Math.round((actual / target) * 100);
    },
    
    // 根据完成率获取对应的颜色
    getCompletionColor(completion) {
      if (completion >= 90) return '#4CAF50'; // 绿色
      if (completion >= 70) return '#8BC34A'; // 浅绿色
      if (completion >= 50) return '#FFC107'; // 黄色
      return '#F44336'; // 红色
    },
    
    // 显示详情弹窗
    showDetailDialog(record) {
      this.selectedRecord = record;
      this.showDetailModal = true;
    },
    
    // 获取当前选择的周期标签
    getSelectedPeriodLabel() {
      const period = this.periods.find(p => p.value === this.selectedPeriod);
      return period ? period.label : '';
    },
    
    // 跳转到创建员工目标页面
    goToCreateGoal() {
      // 使用Vue Router导航到创建员工目标页面
      console.log('正在跳转到创建员工目标页面...');
      this.$router.push({ path: '/performance/create-goal' }).catch(err => {
        console.error('导航失败:', err);
        // 如果导航失败，可能是因为我们已经在目标页面上
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    
    // 根据评分获取质量颜色
    getQualityColor(rating) {
      if (rating >= 8) return '#4CAF50'; // 绿色
      if (rating >= 6) return '#8BC34A'; // 浅绿色
      if (rating >= 4) return '#FFC107'; // 黄色
      return '#F44336'; // 红色
    },
    
    // 显示个人素质评分对话框
    showQualityDialog(record) {
      this.selectedRecord = record;
      this.showQualityModal = true;
      this.qualityForm = record.qualityRatings.map(q => ({ ...q }));
      this.qualityComment = '';
    },
    
    // 保存个人素质评分
    saveQualityRating() {
      // 这里需要将评分保存到后端
      console.log('保存评分', {
        recordId: this.selectedRecord.id,
        qualityRatings: this.qualityForm,
        comment: this.qualityComment
      });
      this.showQualityModal = false;
    }
  }
};
</script>

<style scoped>
.performance-management {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

/* 筛选栏样式 */
.filter-bar {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.filter-group label {
  margin-right: 8px;
  font-weight: 500;
  color: #555;
}

.period-select,
.department-select,
.employee-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 180px;
}

/* 概览卡片样式 */
.performance-overview {
  margin-bottom: 30px;
}

.metric-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.metric-card {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.metric-title {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
  margin-bottom: 15px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
}

.completion-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

/* 表格样式 */
.performance-table-container {
  margin-top: 30px;
}

.performance-table-container h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
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

/* 目标单元格样式 */
.target-cell {
  min-width: 180px;
  padding: 8px 0;
}

.target-value {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 6px;
}

.overall-completion {
  font-weight: bold;
  font-size: 16px;
  color: #1976d2;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.primary-btn {
  background-color: #1976d2;
  color: white;
}

.primary-btn:hover {
  background-color: #1565c0;
}

.btn.small {
  padding: 4px 8px;
  font-size: 12px;
}

.create-btn {
  background-color: #4CAF50;
  color: white;
  margin-left: 10px;
}

.create-btn:hover {
  background-color: #388E3C;
}

/* 对话框样式 */
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
  width: 800px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
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
}

/* 详情样式 */
.performance-detail-modal {
  width: 800px;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
}

.info-label {
  font-weight: bold;
  margin-right: 10px;
  width: 80px;
}

.info-value {
  flex: 1;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table th,
.detail-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.detail-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #555;
}

.chart-placeholder {
  height: 300px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  border: 1px dashed #ddd;
  border-radius: 8px;
}

.performance-comment {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  line-height: 1.5;
}

/* 响应式样式 */
@media (max-width: 1200px) {
  .metric-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .metric-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .period-select,
  .department-select,
  .employee-select {
    width: 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .metric-cards {
    grid-template-columns: 1fr;
  }
}

.score-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.star-rating {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.star-rating i {
  color: gold;
  margin-right: 2px;
}

.quality-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.quality-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.quality-label {
  font-weight: bold;
}

.quality-rating .progress-bar {
  height: 25px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.quality-rating .progress-fill {
  height: 100%;
  background-color: #4CAF50;
  text-align: center;
  line-height: 25px;
  color: white;
  font-weight: bold;
}

.review-summary {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 20px;
}

.summary-item {
  font-size: 16px;
}

.summary-item strong {
  color: #1976d2;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.performance-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.performance-header {
  background-color: #f5f5f5;
  padding: 10px;
  font-weight: bold;
  text-align: center;
}

.performance-content {
  padding: 15px;
}

.target-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.quality-bar {
  width: 100%;
  height: 25px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.quality-fill {
  height: 100%;
  background-color: #4CAF50;
}

.total-score {
  font-weight: bold;
  font-size: 16px;
  color: #1976d2;
}

.compare-chart {
  position: relative;
  height: 25px;
  margin-top: 10px;
  margin-bottom: 25px;
}

.chart-bar {
  height: 25px;
  border-radius: 4px;
  position: absolute;
  left: 0;
  top: 0;
}

.target-bar {
  width: 100%;
  background-color: #f0f0f0;
  z-index: 1;
}

.actual-bar {
  background-color: #4CAF50;
  z-index: 2;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  font-size: 12px;
  color: #666;
}

.target-label {
  color: #888;
}

.actual-label {
  color: #1976d2;
  font-weight: bold;
}

.quality-btn {
  background-color: #ff9800;
  color: white;
  margin-top: 5px;
}

.quality-btn:hover {
  background-color: #f57c00;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.quality-modal {
  width: 500px;
  max-width: 90%;
}

.quality-rating-form {
  padding: 10px 0;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}

.range-slider {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: #f0f0f0;
  border-radius: 5px;
  outline: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #1976d2;
  cursor: pointer;
}

.rating-value {
  font-weight: bold;
  width: 30px;
  text-align: center;
}

.comment-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  margin-top: 5px;
}
</style> 