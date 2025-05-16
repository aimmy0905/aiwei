<template>
  <div class="project-targets">
    <div class="module-header">
      <h2 class="module-title">项目目标管理</h2>
      <button class="add-button" @click="showAddDialog = true">
        <span class="add-icon">+</span> 新建目标
      </button>
    </div>
    
    <div class="filter-bar">
      <div class="filter-group">
        <label>客户名称:</label>
        <select v-model="clientFilter" class="filter-select">
          <option value="">全部客户</option>
          <option v-for="client in clientList" :key="client.id" :value="client.name">
            {{ client.name }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>项目名称:</label>
        <select v-model="projectFilter" class="filter-select">
          <option value="">全部项目</option>
          <option v-for="project in filteredProjectOptions" :key="project.id" :value="project.name">
            {{ project.name }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>目标月份:</label>
        <input type="month" v-model="monthFilter" class="filter-month">
      </div>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>项目名称</th>
            <th>所属客户</th>
            <th>销售额目标</th>
            <th>利润目标</th>
            <th>成本目标</th>
            <th>ROI目标</th>
            <th>用户数目标</th>
            <th>目标月份</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="target in filteredTargets" :key="target.id">
            <td>{{ target.projectName }}</td>
            <td>{{ target.clientName }}</td>
            <td>
              <div class="target-with-progress">
                <div class="target-value">¥{{ formatNumber(target.salesTarget) }}</div>
                <div class="target-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{width: calculateProgress(target.currentSales || 0, target.salesTarget) + '%'}"></div>
                  </div>
                  <span class="target-percent">{{ calculateProgress(target.currentSales || 0, target.salesTarget) }}%</span>
                </div>
                <div class="current-value">当前: ¥{{ formatNumber(target.currentSales || 0) }}</div>
              </div>
            </td>
            <td>
              <div class="target-with-progress">
                <div class="target-value">¥{{ formatNumber(target.profitTarget) }}</div>
                <div class="target-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{width: calculateProgress(target.currentProfit || 0, target.profitTarget) + '%'}"></div>
                  </div>
                  <span class="target-percent">{{ calculateProgress(target.currentProfit || 0, target.profitTarget) }}%</span>
                </div>
                <div class="current-value">当前: ¥{{ formatNumber(target.currentProfit || 0) }}</div>
              </div>
            </td>
            <td>
              <div class="target-with-progress">
                <div class="target-value">¥{{ formatNumber(target.costTarget) }}</div>
                <div class="target-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{width: calculateProgress(target.currentCost || 0, target.costTarget) + '%'}"></div>
                  </div>
                  <span class="target-percent">{{ calculateProgress(target.currentCost || 0, target.costTarget) }}%</span>
                </div>
                <div class="current-value">当前: ¥{{ formatNumber(target.currentCost || 0) }}</div>
              </div>
            </td>
            <td>
              <div class="target-with-progress">
                <div class="target-value">{{ target.roiTarget }}%</div>
                <div class="target-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{width: calculateProgress(target.currentRoi || 0, target.roiTarget) + '%'}"></div>
                  </div>
                  <span class="target-percent">{{ calculateProgress(target.currentRoi || 0, target.roiTarget) }}%</span>
                </div>
                <div class="current-value">当前: {{ target.currentRoi || 0 }}%</div>
              </div>
            </td>
            <td>
              <div class="target-with-progress">
                <div class="target-value">{{ formatNumber(target.usersTarget) }}</div>
                <div class="target-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{width: calculateProgress(target.currentUsers || 0, target.usersTarget) + '%'}"></div>
                  </div>
                  <span class="target-percent">{{ calculateProgress(target.currentUsers || 0, target.usersTarget) }}%</span>
                </div>
                <div class="current-value">当前: {{ formatNumber(target.currentUsers || 0) }}</div>
              </div>
            </td>
            <td>{{ formatMonth(target.targetMonth) }}</td>
            <td class="action-buttons">
              <button class="edit-btn" @click="editTarget(target)">编辑</button>
              <button class="delete-btn" @click="deleteTarget(target)">删除</button>
            </td>
          </tr>
          <tr v-if="filteredTargets.length === 0">
            <td colspan="9" class="empty-data">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="pagination">
      <button 
        class="page-button" 
        :disabled="currentPage === 1" 
        @click="currentPage--"
      >
        上一页
      </button>
      <div class="page-info">
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
      </div>
      <button 
        class="page-button" 
        :disabled="currentPage === totalPages" 
        @click="currentPage++"
      >
        下一页
      </button>
    </div>
    
    <!-- 目标新建/编辑对话框 -->
    <div class="modal" v-if="showAddDialog || editingTarget">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingTarget ? '编辑目标' : '新建目标' }}</h3>
          <button class="close-button" @click="closeAddDialog">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>所属客户 <span class="required">*</span></label>
            <select v-model="targetForm.clientName" class="form-input" @change="onClientChange">
              <option value="">请选择客户</option>
              <option v-for="client in clientList" :key="client.id" :value="client.name">
                {{ client.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>选择项目 <span class="required">*</span></label>
            <select v-model="targetForm.projectName" class="form-input">
              <option value="">请选择项目</option>
              <option v-for="project in availableProjects" :key="project.id" :value="project.name">
                {{ project.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>目标月份 <span class="required">*</span></label>
            <input type="month" v-model="targetForm.targetMonth" class="form-input">
          </div>
          
          <h4 class="section-title">目标设置</h4>
          
          <div class="form-group">
            <label>销售额目标 <span class="required">*</span></label>
            <input type="number" v-model="targetForm.salesTarget" class="form-input" placeholder="请输入销售额目标">
          </div>
          
          <div class="form-group">
            <label>利润目标 <span class="required">*</span></label>
            <input type="number" v-model="targetForm.profitTarget" class="form-input" placeholder="请输入利润目标">
          </div>
          
          <div class="form-group">
            <label>成本目标 <span class="required">*</span></label>
            <input type="number" v-model="targetForm.costTarget" class="form-input" placeholder="请输入成本目标">
          </div>
          
          <div class="form-group">
            <label>ROI目标 <span class="required">*</span></label>
            <input type="number" v-model="targetForm.roiTarget" class="form-input" placeholder="请输入ROI目标">
          </div>
          
          <div class="form-group">
            <label>用户数目标 <span class="required">*</span></label>
            <input type="number" v-model="targetForm.usersTarget" class="form-input" placeholder="请输入用户数目标">
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="closeAddDialog">取消</button>
          <button class="save-button" @click="saveTarget" :disabled="!isFormValid">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 确认删除对话框 -->
    <div class="modal" v-if="showDeleteConfirm">
      <div class="modal-content delete-confirm">
        <div class="modal-header">
          <h3>确认删除</h3>
          <button class="close-button" @click="showDeleteConfirm = false">&times;</button>
        </div>
        <div class="modal-body">
          <p>您确定要删除 "{{ targetToDelete?.clientName }} - {{ targetToDelete?.projectName }}" 的目标数据吗？</p>
          <p>此操作不可恢复。</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="showDeleteConfirm = false">取消</button>
          <button class="delete-button" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectTargets',
  props: {
    projectTargets: {
      type: Array,
      required: true
    },
    clientList: {
      type: Array,
      required: true
    },
    projectList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      clientFilter: '',
      projectFilter: '',
      monthFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      showAddDialog: false,
      editingTarget: null,
      targetForm: {
        clientName: '',
        projectName: '',
        salesTarget: '',
        profitTarget: '',
        costTarget: '',
        roiTarget: '',
        usersTarget: '',
        targetMonth: ''
      },
      showDeleteConfirm: false,
      targetToDelete: null
    };
  },
  computed: {
    // 筛选后的目标列表
    filteredTargets() {
      let result = [...this.projectTargets];
      
      // 应用客户筛选
      if (this.clientFilter) {
        result = result.filter(target => 
          target.clientName === this.clientFilter
        );
      }
      
      // 应用项目筛选
      if (this.projectFilter) {
        result = result.filter(target => 
          target.projectName === this.projectFilter
        );
      }
      
      // 应用月份筛选
      if (this.monthFilter) {
        result = result.filter(target => 
          target.targetMonth.startsWith(this.monthFilter)
        );
      }
      
      // 分页
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      
      return result.slice(startIndex, endIndex);
    },
    
    // 总页数
    totalPages() {
      let filteredCount = 0;
      
      // 计算筛选后的总数量
      let result = [...this.projectTargets];
      
      if (this.clientFilter) {
        result = result.filter(target => 
          target.clientName === this.clientFilter
        );
      }
      
      if (this.projectFilter) {
        result = result.filter(target => 
          target.projectName === this.projectFilter
        );
      }
      
      if (this.monthFilter) {
        result = result.filter(target => 
          target.targetMonth.startsWith(this.monthFilter)
        );
      }
      
      filteredCount = result.length;
      return Math.ceil(filteredCount / this.itemsPerPage) || 1;
    },
    
    // 基于选择的客户筛选项目选项
    filteredProjectOptions() {
      if (!this.clientFilter) {
        return this.projectList;
      }
      
      return this.projectList.filter(project => {
        // 查找该项目是否有该客户的目标
        return this.projectTargets.some(target => 
          target.clientName === this.clientFilter && 
          target.projectName === project.name
        );
      });
    },
    
    // 基于选择的客户获取可用项目
    availableProjects() {
      if (!this.targetForm.clientName) {
        return [];
      }
      
      // 在实际项目中，应该有项目和客户的关联信息
      // 这里简化处理，所有项目都可选
      return this.projectList;
    },
    
    // 表单验证
    isFormValid() {
      return (
        this.targetForm.clientName && 
        this.targetForm.projectName && 
        this.targetForm.targetMonth &&
        this.targetForm.salesTarget && 
        this.targetForm.profitTarget && 
        this.targetForm.costTarget && 
        this.targetForm.roiTarget && 
        this.targetForm.usersTarget
      );
    }
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    formatMonth(dateString) {
      if (!dateString) return '-';
      const [year, month] = dateString.split('-');
      return `${year}年${month}月`;
    },
    
    calculateProgress(current, target) {
      if (!target) return 0;
      const progress = (current / target) * 100;
      return Math.min(Math.round(progress), 100);
    },
    
    onClientChange() {
      // 当选择客户变化时，清空项目选择
      this.targetForm.projectName = '';
    },
    
    editTarget(target) {
      this.editingTarget = target;
      this.targetForm = { ...target }; // 浅拷贝即可
    },
    
    deleteTarget(target) {
      this.targetToDelete = target;
      this.showDeleteConfirm = true;
    },
    
    confirmDelete() {
      // 删除目标
      console.log('删除目标:', this.targetToDelete);
      // 实际项目中应该调用API
      this.showDeleteConfirm = false;
      this.targetToDelete = null;
    },
    
    closeAddDialog() {
      this.showAddDialog = false;
      this.editingTarget = null;
      this.resetForm();
    },
    
    resetForm() {
      this.targetForm = {
        clientName: '',
        projectName: '',
        salesTarget: '',
        profitTarget: '',
        costTarget: '',
        roiTarget: '',
        usersTarget: '',
        targetMonth: ''
      };
    },
    
    saveTarget() {
      if (!this.isFormValid) return;
      
      if (this.editingTarget) {
        // 编辑现有目标
        console.log('保存编辑的目标:', this.targetForm);
      } else {
        // 添加新目标
        console.log('添加新目标:', this.targetForm);
      }
      
      // 实际项目中应该调用API
      this.closeAddDialog();
    }
  }
};
</script>

<style scoped>
.project-targets {
  padding: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.module-title {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.add-button {
  display: flex;
  align-items: center;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #1565c0;
}

.add-icon {
  margin-right: 6px;
  font-size: 1.2rem;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 0.9rem;
  color: #666;
}

.filter-select, .filter-month {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 120px;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background-color: #f5f7fa;
  font-weight: 500;
  color: #666;
}

.data-table tr:hover {
  background-color: #f9f9f9;
}

.empty-data {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.edit-btn {
  background-color: #1976d2;
  border: 1px solid #1976d2;
  color: white;
}

.edit-btn:hover {
  background-color: #1565c0;
}

.delete-btn {
  background-color: white;
  border: 1px solid #f44336;
  color: #f44336;
}

.delete-btn:hover {
  background-color: #ffebee;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.page-button {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-button:hover:not(:disabled) {
  background-color: #f5f7fa;
  border-color: #1976d2;
  color: #1976d2;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #666;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
}

.modal-content.delete-confirm {
  max-width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #666;
  cursor: pointer;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #666;
}

.required {
  color: #f44336;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.section-title {
  margin: 20px 0 15px;
  color: #333;
  font-size: 1.1rem;
  font-weight: 500;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 8px;
}

.save-button,
.cancel-button,
.delete-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

.save-button {
  background-color: #1976d2;
  border: 1px solid #1976d2;
  color: white;
}

.save-button:hover:not(:disabled) {
  background-color: #1565c0;
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-button {
  background-color: white;
  border: 1px solid #ddd;
  color: #666;
}

.cancel-button:hover {
  background-color: #f5f7fa;
}

.delete-button {
  background-color: #f44336;
  border: 1px solid #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #e53935;
}

.target-with-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.target-value {
  font-weight: 500;
  color: #333;
}

.target-progress {
  display: flex;
  align-items: center;
  gap: 6px;
}

.progress-bar {
  flex-grow: 1;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #1976d2;
}

.target-percent {
  font-size: 0.8rem;
  color: #666;
  width: 30px;
}

.current-value {
  font-size: 0.8rem;
  color: #666;
}
</style> 