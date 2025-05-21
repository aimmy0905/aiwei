<template>
  <div class="project-list">
    <div class="module-header">
      <h2 class="module-title">项目列表</h2>
      <div class="header-buttons">
        <button class="import-button" @click="showImportDialog = true">
          <span class="import-icon">↑</span> 导入项目
        </button>
        <button class="add-button" @click="showAddDialog = true">
          <span class="add-icon">+</span> 新建项目
        </button>
      </div>
    </div>
    
    <div class="filter-bar">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索项目名称" 
          class="search-input"
        >
      </div>
      
      <div class="filter-group">
        <label>项目状态:</label>
        <select v-model="statusFilter" class="filter-select">
          <option value="">全部</option>
          <option value="进行中">进行中</option>
          <option value="计划中">计划中</option>
          <option value="已完成">已完成</option>
          <option value="即将开始">即将开始</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>跟进团队:</label>
        <select v-model="teamFilter" class="filter-select">
          <option value="">全部</option>
          <option v-for="team in teamOptions" :key="team" :value="team">{{ team }}</option>
        </select>
      </div>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>项目名称</th>
            <th>客户信息</th>
            <th>项目状态</th>
            <th>项目合作时间</th>
            <th>结束时间</th>
            <th>到期时间</th>
            <th>跟进团队</th>
            <th>投放渠道</th>
            <th>累计服务费</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in filteredProjects" :key="project.id">
            <td>{{ project.name }}</td>
            <td>{{ project.clientName || '未设置' }}</td>
            <td>
              <span 
                class="status-badge" 
                :class="{
                  'status-active': project.status === '进行中',
                  'status-planned': project.status === '计划中',
                  'status-completed': project.status === '已完成',
                  'status-upcoming': project.status === '即将开始'
                }"
              >
                {{ project.status }}
              </span>
            </td>
            <td>{{ formatDate(project.startDate) }}</td>
            <td>{{ formatDate(project.endDate) }}</td>
            <td>
              <span 
                class="expiry-date" 
                :class="{'expiry-warning': isExpiryNear(project.expiryDate)}"
              >
                {{ formatDate(project.expiryDate) }}
              </span>
            </td>
            <td>{{ project.team }}</td>
            <td>{{ project.channels }}</td>
            <td>¥{{ formatNumber(project.totalFee) }}</td>
            <td class="action-buttons">
              <button class="dashboard-btn" @click="viewDashboard(project)">数据看板</button>
              <button class="service-btn" @click="renewService(project)">服务费续费</button>
              <div class="more-actions">
                <button class="more-btn" @click="showMoreActions(project)">•••</button>
                <div class="dropdown-menu" v-if="activeDropdown === project.id">
                  <button class="dropdown-item" @click="editProject(project)">编辑</button>
                  <button class="dropdown-item delete" @click="deleteProject(project)">删除</button>
                </div>
              </div>
            </td>
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
    
    <!-- 项目新建/编辑对话框 -->
    <div class="modal" v-if="showAddDialog || editingProject">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingProject ? '编辑项目' : '新建项目' }}</h3>
          <button class="close-button" @click="closeAddDialog">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>项目名称</label>
            <input type="text" v-model="projectForm.name" class="form-input" placeholder="请输入项目名称">
          </div>
          <div class="form-group">
            <label>客户信息</label>
            <select v-model="projectForm.clientName" class="form-input">
              <option value="">请选择客户</option>
              <option v-for="client in clientList" :key="client.id" :value="client.name">
                {{ client.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>项目状态</label>
            <select v-model="projectForm.status" class="form-input">
              <option value="进行中">进行中</option>
              <option value="计划中">计划中</option>
              <option value="已完成">已完成</option>
              <option value="即将开始">即将开始</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label>项目合作时间</label>
              <input type="date" v-model="projectForm.startDate" class="form-input">
            </div>
            <div class="form-group half">
              <label>结束时间</label>
              <input type="date" v-model="projectForm.endDate" class="form-input">
            </div>
          </div>
          <div class="form-group">
            <label>到期时间</label>
            <input type="date" v-model="projectForm.expiryDate" class="form-input">
          </div>
          <div class="form-group">
            <label>跟进团队</label>
            <input type="text" v-model="projectForm.team" class="form-input" placeholder="请输入跟进团队">
          </div>
          <div class="form-group">
            <label>投放渠道</label>
            <input type="text" v-model="projectForm.channels" class="form-input" placeholder="请输入投放渠道，多个渠道用逗号分隔">
          </div>
         
          
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="closeAddDialog">取消</button>
          <button class="save-button" @click="saveProject">保存</button>
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
          <p>您确定要删除项目 "{{ projectToDelete?.name }}" 吗？此操作不可恢复。</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="showDeleteConfirm = false">取消</button>
          <button class="delete-button" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </div>

    <!-- 项目导入对话框 -->
    <div class="modal" v-if="showImportDialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3>导入项目</h3>
          <button class="close-button" @click="showImportDialog = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="import-instructions">
            <p>请选择Excel文件（.xlsx或.xls格式）导入项目数据。</p>
            <p>Excel文件应包含以下列：项目名称、客户信息、项目状态、项目合作时间、结束时间、跟进团队、投放渠道、累计服务费等。</p>
          </div>
          
          <div class="file-upload-container">
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelected" 
              class="file-input" 
              accept=".xlsx, .xls"
            >
            <div class="upload-button" @click="triggerFileInput">
              选择Excel文件
            </div>
            <div class="selected-file" v-if="selectedFile">
              已选择: {{ selectedFile.name }}
            </div>
          </div>
          
          <div class="template-download">
            <a href="#" @click.prevent="downloadTemplate">下载导入模板</a>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="showImportDialog = false">取消</button>
          <button class="import-button" @click="importProjects" :disabled="!selectedFile">导入</button>
        </div>
      </div>
    </div>

    <!-- 服务费续费对话框 -->
    <div class="modal" v-if="showRenewDialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3>服务费续费</h3>
          <button class="close-button" @click="showRenewDialog = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="info-section">
            <h4>项目信息</h4>
            <div class="info-row">
              <div class="info-label">项目名称:</div>
              <div class="info-value">{{ renewProject?.name }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">所属客户:</div>
              <div class="info-value">{{ getClientName(renewProject) }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">当前到期时间:</div>
              <div class="info-value">{{ formatDate(renewProject?.expiryDate) }}</div>
            </div>
            <div class="info-row">
              <div class="info-label">剩余服务时长:</div>
              <div class="info-value">{{ calculateRemainingDays(renewProject?.expiryDate) }}天</div>
            </div>
          </div>
          
          <div class="form-group">
            <label>服务费金额 <span class="required">*</span></label>
            <input type="number" v-model="renewalForm.amount" class="form-input" placeholder="请输入续费金额">
          </div>
          
          <div class="form-group">
            <label>续费时长 <span class="required">*</span></label>
            <div class="duration-options">
              <div 
                v-for="option in durationOptions" 
                :key="option.value"
                class="duration-option"
                :class="{ active: renewalForm.duration === option.value }"
                @click="renewalForm.duration = option.value"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>服务到期日 <span class="note">(自动计算)</span></label>
            <div class="calculated-date">{{ calculateNewExpiryDate(renewProject?.expiryDate, renewalForm.duration) }}</div>
          </div>
          
          <div class="form-group">
            <label>付费凭证 <span class="required">*</span></label>
            <div class="file-upload">
              <input 
                type="file" 
                ref="paymentProof" 
                class="file-input" 
                accept="image/*,.pdf" 
                @change="handleFileChange"
              >
              <button class="upload-btn" @click="triggerFileUpload">
                {{ renewalForm.paymentProof ? '更改文件' : '上传文件' }}
              </button>
              <span class="file-name">{{ renewalForm.paymentProof ? renewalForm.paymentProof.name : '未选择文件' }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label>备注</label>
            <textarea v-model="renewalForm.remarks" class="form-textarea" placeholder="请输入备注信息"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="showRenewDialog = false">取消</button>
          <button class="save-button" @click="submitRenewal" :disabled="!isRenewalFormValid">确认续费</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectList',
  props: {
    projects: {
      type: Array,
      required: true
    },
    clientList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      teamFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      activeDropdown: null,
      showAddDialog: false,
      editingProject: null,
      projectForm: {
        name: '',
        status: '进行中',
        startDate: '',
        endDate: '',
        expiryDate: '',
        team: '',
        channels: '',
        totalFee: 0,
        clientName: ''
      },
      showDeleteConfirm: false,
      projectToDelete: null,
      showRenewDialog: false,
      renewProject: null,
      renewalForm: {
        amount: '',
        duration: '',
        paymentProof: null,
        remarks: ''
      },
      durationOptions: [
        { value: '1', label: '1个月' },
        { value: '3', label: '3个月' },
        { value: '6', label: '6个月' },
        { value: '12', label: '12个月' }
      ],
      showImportDialog: false,
      selectedFile: null
    };
  },
  computed: {
    teamOptions() {
      const teams = new Set();
      this.projects.forEach(project => {
        teams.add(project.team);
      });
      return Array.from(teams);
    },
    
    filteredProjects() {
      let result = [...this.projects];
      
      // 应用搜索
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(project => 
          project.name.toLowerCase().includes(query)
        );
      }
      
      // 应用状态筛选
      if (this.statusFilter) {
        result = result.filter(project => 
          project.status === this.statusFilter
        );
      }
      
      // 应用团队筛选
      if (this.teamFilter) {
        result = result.filter(project => 
          project.team === this.teamFilter
        );
      }
      
      // 分页
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      
      return result.slice(startIndex, endIndex);
    },
    
    totalPages() {
      const filteredCount = this.filteredProjects.length;
      return Math.ceil(filteredCount / this.itemsPerPage) || 1;
    },
    
    isRenewalFormValid() {
      return (
        this.renewalForm.amount && 
        this.renewalForm.amount > 0 &&
        this.renewalForm.duration && 
        this.renewalForm.paymentProof
      );
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    calculateProgress(current, target) {
      if (!target) return 0;
      const progress = (current / target) * 100;
      return Math.min(Math.round(progress), 100);
    },
    
    isExpiryNear(dateString) {
      if (!dateString) return false;
      
      const expiryDate = new Date(dateString);
      const today = new Date();
      
      // 计算相差天数
      const diffTime = expiryDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // 如果在30天内到期，返回true
      return diffDays >= 0 && diffDays <= 30;
    },
    
    viewDashboard(project) {
      // 跳转到数据看板页面
      console.log('查看项目数据看板:', project.name);
      // 实际项目中应该使用路由导航
      // this.$router.push(`/dashboard/${project.id}`);
    },
    
    renewService(project) {
      // 打开服务费续费弹窗
      this.renewProject = project;
      this.showRenewDialog = true;
      
      // 重置表单
      this.renewalForm = {
        amount: '',
        duration: '3', // 默认选择3个月
        paymentProof: null,
        remarks: ''
      };
    },
    
    showMoreActions(project) {
      this.activeDropdown = this.activeDropdown === project.id ? null : project.id;
    },
    
    editProject(project) {
      this.editingProject = project;
      this.projectForm = JSON.parse(JSON.stringify(project)); // 深拷贝
      this.activeDropdown = null;
    },
    
    deleteProject(project) {
      this.projectToDelete = project;
      this.showDeleteConfirm = true;
      this.activeDropdown = null;
    },
    
    confirmDelete() {
      // 删除项目
      console.log('删除项目:', this.projectToDelete.name);
      // 实际项目中应该调用API
      this.showDeleteConfirm = false;
      this.projectToDelete = null;
    },
    
    closeAddDialog() {
      this.showAddDialog = false;
      this.editingProject = null;
      this.resetForm();
    },
    
    resetForm() {
      this.projectForm = {
        name: '',
        status: '进行中',
        startDate: '',
        endDate: '',
        expiryDate: '',
        team: '',
        channels: '',
        totalFee: 0,
        clientName: ''
      };
    },
    
    saveProject() {
      if (this.editingProject) {
        // 编辑现有项目
        console.log('保存编辑的项目:', this.projectForm);
      } else {
        // 添加新项目
        console.log('添加新项目:', this.projectForm);
      }
      
      // 实际项目中应该调用API
      this.closeAddDialog();
    },
    
    calculateRemainingDays(expiryDate) {
      if (!expiryDate) return 0;
      
      const today = new Date();
      const expiry = new Date(expiryDate);
      
      const diffTime = expiry - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    },
    
    calculateNewExpiryDate(currentExpiry, duration) {
      if (!currentExpiry || !duration) return currentExpiry;
      
      const expiry = new Date(currentExpiry);
      const durationInMonths = parseInt(duration);
      
      expiry.setMonth(expiry.getMonth() + durationInMonths);
      
      return expiry.toISOString().split('T')[0];
    },
    
    getClientName(project) {
      // 从projectTarget数据中查找对应的客户名称
      if (!project) return '未知客户';
      
      // 这里应该从projectTargets数组中查找对应项目的客户名称
      const projectClient = this.$parent.projectTargets.find(target => 
        target.projectName === project.name
      );
      
      return projectClient ? projectClient.clientName : '未知客户';
    },
    
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.renewalForm.paymentProof = file;
      }
    },
    
    triggerFileUpload() {
      const input = this.$refs.paymentProof;
      if (input) {
        input.click();
      }
    },
    
    submitRenewal() {
      if (!this.isRenewalFormValid) return;
      
      // 更新项目到期日
      if (this.renewProject) {
        const newExpiryDate = this.calculateNewExpiryDate(
          this.renewProject.expiryDate, 
          this.renewalForm.duration
        );
        
        // 更新项目数据
        this.renewProject.expiryDate = newExpiryDate;
        this.renewProject.totalFee += parseFloat(this.renewalForm.amount);
        
        // 在实际项目中，这里应该调用API提交数据
        console.log('服务费续费成功:', {
          projectId: this.renewProject.id,
          newExpiryDate: newExpiryDate,
          amount: this.renewalForm.amount,
          duration: this.renewalForm.duration,
          // 这里应该上传付费凭证
          paymentProof: this.renewalForm.paymentProof ? this.renewalForm.paymentProof.name : null,
          remarks: this.renewalForm.remarks
        });
        
        // 显示成功提示
        alert('服务费续费成功');
      }
      
      this.showRenewDialog = false;
    },
    
    handleFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    },
    
    triggerFileInput() {
      const input = this.$refs.fileInput;
      if (input) {
        input.click();
      }
    },
    
    downloadTemplate() {
      // 实现下载模板的功能
      console.log('下载导入模板');
    },
    
    importProjects() {
      // 实现导入项目数据的功能
      if (!this.selectedFile) {
        alert('请先选择Excel文件');
        return;
      }
      
      // 这里需要使用适当的Excel解析库，如xlsx或sheetjs
      // 以下是模拟导入过程
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // 模拟导入成功
          // 注意：真实场景需使用xlsx库解析Excel数据
          setTimeout(() => {
            alert('导入成功！已导入5个项目');
            this.showImportDialog = false;
            this.selectedFile = null;
            
            // 通知父组件刷新数据
            this.$emit('import-complete');
          }, 1000);
        } catch (error) {
          console.error('导入失败:', error);
          alert('导入失败，请检查文件格式是否正确');
        }
      };
      
      reader.readAsArrayBuffer(this.selectedFile);
    }
  }
};
</script>

<style scoped>
.project-list {
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

.header-buttons {
  display: flex;
  gap: 10px;
}

.import-button,
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

.import-button:hover,
.add-button:hover {
  background-color: #1565c0;
}

.import-icon,
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

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
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

.filter-select {
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

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-planned {
  background-color: #e3f2fd;
  color: #1565c0;
}

.status-completed {
  background-color: #ede7f6;
  color: #5e35b1;
}

.status-upcoming {
  background-color: #fff8e1;
  color: #ff8f00;
}

.expiry-date {
  font-weight: normal;
}

.expiry-warning {
  color: #f44336;
  font-weight: 500;
}

.targets-preview {
  width: 150px;
}

.target-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.target-label {
  width: 60px;
  font-size: 0.8rem;
  color: #666;
}

.progress-bar {
  width: 60px;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin: 0 6px;
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

.action-buttons {
  display: flex;
  gap: 8px;
  white-space: nowrap;
}

.dashboard-btn,
.service-btn {
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  border: 1px solid;
}

.dashboard-btn {
  background-color: #1976d2;
  border-color: #1976d2;
  color: white;
}

.dashboard-btn:hover {
  background-color: #1565c0;
}

.service-btn {
  background-color: white;
  border-color: #1976d2;
  color: #1976d2;
}

.service-btn:hover {
  background-color: #e3f2fd;
}

.more-actions {
  position: relative;
}

.more-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 2px 8px;
  font-size: 1rem;
  border-radius: 4px;
}

.more-btn:hover {
  background-color: #f5f7fa;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 120px;
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
}

.dropdown-item.delete {
  color: #f44336;
}

.dropdown-item.delete:hover {
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

.form-row {
  display: flex;
  gap: 15px;
}

.form-group.half {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #666;
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

.save-button:hover {
  background-color: #1565c0;
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

.info-section {
  margin-bottom: 20px;
}

.info-row {
  margin-bottom: 10px;
}

.info-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 0.9rem;
  color: #333;
}

.duration-options {
  display: flex;
  gap: 8px;
}

.duration-option {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.duration-option.active {
  background-color: #1976d2;
  color: white;
}

.calculated-date {
  font-size: 0.9rem;
  color: #333;
}

.file-upload {
  margin-top: 10px;
}

.file-input {
  display: none;
}

.upload-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.file-name {
  margin-left: 10px;
  font-size: 0.9rem;
  color: #666;
}

.note {
  font-size: 0.8rem;
  color: #666;
}

.required {
  color: #f44336;
  font-weight: 500;
}

.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.import-instructions {
  margin-bottom: 20px;
}

.file-upload-container {
  margin-bottom: 20px;
}

.upload-button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.selected-file {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
}

.template-download {
  margin-top: 10px;
}

.template-download a {
  color: #1976d2;
  text-decoration: none;
}

.template-download a:hover {
  text-decoration: underline;
}
</style> 