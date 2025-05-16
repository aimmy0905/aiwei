<template>
  <div class="customer-detail">
    <div class="detail-header">
      <h2 class="detail-title">{{ customer.name }} - 客户详情</h2>
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span> 返回列表
      </button>
    </div>
    
    <div class="detail-container">
      <!-- 基本信息 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>基本信息</h3>
          <button class="edit-button" @click="editBasicInfo">编辑</button>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">客户名称</div>
            <div class="info-value">{{ customer.name }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">合作类型</div>
            <div class="info-value">{{ customer.cooperationType }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">联系人</div>
            <div class="info-value">{{ customer.contactPerson }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">联系方式</div>
            <div class="info-value">{{ customer.contactInfo }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">销售经理</div>
            <div class="info-value">{{ customer.salesManager }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">销售人员</div>
            <div class="info-value">{{ customer.salesPerson }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">创建时间</div>
            <div class="info-value">{{ formatDate(customer.createdAt) }}</div>
          </div>
        </div>
      </div>
      
      <!-- 客户情况 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>客户情况</h3>
          <div class="header-actions">
            <button class="action-button" @click="showAddSituationDialog = true">添加</button>
            <button class="action-button" @click="importSituation">导入</button>
          </div>
        </div>
        <div class="situation-list">
          <div v-for="(situation, index) in customer.situations" :key="index" class="situation-item">
            <div class="situation-content">{{ situation.info }}</div>
            <div class="situation-meta">
              <div class="situation-creator">创建人: {{ situation.creator }}</div>
              <div class="situation-date">创建时间: {{ formatDate(situation.createdAt) }}</div>
            </div>
          </div>
          <div v-if="customer.situations.length === 0" class="empty-data">
            暂无客户情况记录
          </div>
        </div>
      </div>
      
      <!-- 客户评价 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>客户评价</h3>
        </div>
        <div class="evaluation-list">
          <div v-for="(evaluation, index) in customer.evaluations" :key="index" class="evaluation-item">
            <div class="evaluation-score">
              评分: <span class="score-value">{{ evaluation.score }}</span>/10
            </div>
            <div class="evaluation-comment">{{ evaluation.comment }}</div>
            <div class="evaluation-date">评价时间: {{ formatDate(evaluation.date) }}</div>
          </div>
          <div v-if="customer.evaluations.length === 0" class="empty-data">
            暂无客户评价记录
          </div>
        </div>
      </div>
      
      <!-- 合作项目 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>合作项目</h3>
          <button class="action-button" @click="addProject">添加项目</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>项目名称</th>
                <th>项目状态</th>
                <th>项目合作时间</th>
                <th>结束时间</th>
                <th>到期时间</th>
                <th>跟进团队</th>
                <th>累计服务费</th>
                <th>投放渠道</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in customerProjects" :key="project.id">
                <td>{{ project.name }}</td>
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
                <td>{{ formatDate(project.expiryDate) }}</td>
                <td>{{ project.team }}</td>
                <td>¥{{ formatNumber(project.totalFee) }}</td>
                <td>{{ project.channels }}</td>
                <td class="action-buttons">
                  <button class="dashboard-btn" @click="viewDashboard(project)">数据看板</button>
                  <button class="service-btn" @click="renewService(project)">服务费续费</button>
                </td>
              </tr>
              <tr v-if="customerProjects.length === 0">
                <td colspan="9" class="empty-data">暂无项目数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 投放账户 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>投放账户</h3>
          <button class="action-button" @click="showAddAccountDialog = true">添加账户</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>平台</th>
                <th>账号</th>
                <th>账户ID绑定</th>
                <th>账号余额</th>
                <th>可用时间</th>
                <th>预计可用天数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in customerAccounts" :key="account.id">
                <td>{{ account.platform }}</td>
                <td>{{ account.account }}</td>
                <td>{{ account.accountId }}</td>
                <td>¥{{ formatNumber(account.balance) }}</td>
                <td>{{ formatDate(account.availableDate) }}</td>
                <td>
                  <span :class="{ 'warning-days': getDaysRemaining(account.availableDate) <= 7 }">
                    {{ getDaysRemaining(account.availableDate) }} 天
                  </span>
                </td>
                <td class="action-buttons">
                  <button class="edit-btn" @click="editAccount(account)">编辑</button>
                  <button class="delete-btn" @click="deleteAccount(account)">删除</button>
                </td>
              </tr>
              <tr v-if="customerAccounts.length === 0">
                <td colspan="7" class="empty-data">暂无账户数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- 添加客户情况对话框 -->
    <div class="modal" v-if="showAddSituationDialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3>添加客户情况</h3>
          <button class="close-button" @click="showAddSituationDialog = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>情况信息 <span class="required">*</span></label>
            <textarea 
              v-model="situationForm.info" 
              class="form-textarea" 
              placeholder="请输入客户情况描述"
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label>创建人 <span class="required">*</span></label>
            <input type="text" v-model="situationForm.creator" class="form-input" placeholder="请输入创建人姓名">
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="showAddSituationDialog = false">取消</button>
          <button class="save-button" @click="saveSituation" :disabled="!situationForm.info || !situationForm.creator">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 添加投放账户对话框 -->
    <div class="modal" v-if="showAddAccountDialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3>添加投放账户</h3>
          <button class="close-button" @click="showAddAccountDialog = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>平台 <span class="required">*</span></label>
            <select v-model="accountForm.platform" class="form-input">
              <option value="">请选择平台</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="Bing">Bing</option>
              <option value="Criteo">Criteo</option>
            </select>
          </div>
          <div class="form-group">
            <label>账号 <span class="required">*</span></label>
            <input type="text" v-model="accountForm.account" class="form-input" placeholder="请输入账号">
          </div>
          <div class="form-group">
            <label>账户ID绑定 <span class="required">*</span></label>
            <input type="text" v-model="accountForm.accountId" class="form-input" placeholder="请输入账户ID">
          </div>
          <div class="form-group">
            <label>账号余额 (元) <span class="required">*</span></label>
            <input type="number" v-model="accountForm.balance" class="form-input" min="0" step="0.01" placeholder="请输入账号余额">
          </div>
          <div class="form-group">
            <label>可用时间 <span class="required">*</span></label>
            <input type="date" v-model="accountForm.availableDate" class="form-input">
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="showAddAccountDialog = false">取消</button>
          <button 
            class="save-button" 
            @click="saveAccount" 
            :disabled="!accountForm.platform || !accountForm.account || !accountForm.accountId || !accountForm.balance || !accountForm.availableDate"
          >
            保存
          </button>
        </div>
      </div>
    </div>
    
    <!-- 添加项目对话框 -->
    <div class="modal" v-if="showAddProjectDialog">
      <div class="modal-content project-modal">
        <div class="modal-header">
          <h3>添加合作项目</h3>
          <button class="close-button" @click="showAddProjectDialog = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>项目名称 <span class="required">*</span></label>
            <input type="text" v-model="projectForm.name" class="form-input" placeholder="请输入项目名称">
          </div>
          <div class="form-group">
            <label>项目状态 <span class="required">*</span></label>
            <select v-model="projectForm.status" class="form-input">
              <option value="">请选择项目状态</option>
              <option value="计划中">计划中</option>
              <option value="即将开始">即将开始</option>
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group half-width">
              <label>开始日期 <span class="required">*</span></label>
              <input type="date" v-model="projectForm.startDate" class="form-input">
            </div>
            <div class="form-group half-width">
              <label>结束日期 <span class="required">*</span></label>
              <input type="date" v-model="projectForm.endDate" class="form-input">
            </div>
          </div>
          <div class="form-group">
            <label>到期时间 <span class="required">*</span></label>
            <input type="date" v-model="projectForm.expiryDate" class="form-input">
          </div>
          <div class="form-group">
            <label>跟进团队 <span class="required">*</span></label>
            <select v-model="projectForm.team" class="form-input">
              <option value="">请选择跟进团队</option>
              <option value="数字营销团队">数字营销团队</option>
              <option value="品牌推广团队">品牌推广团队</option>
              <option value="产品推广团队">产品推广团队</option>
              <option value="国际业务团队">国际业务团队</option>
              <option value="活动策划团队">活动策划团队</option>
            </select>
          </div>
          <div class="form-group">
            <label>服务费用 (元) <span class="required">*</span></label>
            <input type="number" v-model="projectForm.totalFee" class="form-input" placeholder="请输入服务费用">
          </div>
          <div class="form-group">
            <label>投放渠道 <span class="required">*</span></label>
            <div class="channel-checkboxes">
              <label class="channel-checkbox">
                <input type="checkbox" value="Google Ads" v-model="projectForm.selectedChannels">
                Google Ads
              </label>
              <label class="channel-checkbox">
                <input type="checkbox" value="Facebook" v-model="projectForm.selectedChannels">
                Facebook
              </label>
              <label class="channel-checkbox">
                <input type="checkbox" value="Instagram" v-model="projectForm.selectedChannels">
                Instagram
              </label>
              <label class="channel-checkbox">
                <input type="checkbox" value="YouTube" v-model="projectForm.selectedChannels">
                YouTube
              </label>
              <label class="channel-checkbox">
                <input type="checkbox" value="Twitter" v-model="projectForm.selectedChannels">
                Twitter
              </label>
              <label class="channel-checkbox">
                <input type="checkbox" value="TikTok" v-model="projectForm.selectedChannels">
                TikTok
              </label>
              <label class="channel-checkbox">
                <input type="checkbox" value="Bing" v-model="projectForm.selectedChannels">
                Bing
              </label>
              <label class="channel-checkbox">
                <input type="checkbox" value="Pinterest" v-model="projectForm.selectedChannels">
                Pinterest
              </label>
              <label class="channel-checkbox">
                <input type="checkbox" value="Criteo" v-model="projectForm.selectedChannels">
                Criteo
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="showAddProjectDialog = false">取消</button>
          <button class="save-button" @click="saveProject" :disabled="!isProjectFormValid">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerDetail',
  props: {
    customer: {
      type: Object,
      required: true
    },
    projects: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showAddSituationDialog: false,
      showAddAccountDialog: false,
      showAddProjectDialog: false,
      situationForm: {
        info: '',
        creator: ''
      },
      accountForm: {
        platform: '',
        account: '',
        accountId: '',
        balance: '',
        availableDate: ''
      },
      projectForm: {
        name: '',
        status: '',
        startDate: '',
        endDate: '',
        expiryDate: '',
        team: '',
        totalFee: '',
        selectedChannels: []
      }
    };
  },
  computed: {
    // 当前客户的项目
    customerProjects() {
      if (!this.customer) return [];
      
      return this.projects.filter(project => 
        project.customerId === this.customer.id
      );
    },
    
    // 当前客户的投放账户
    customerAccounts() {
      if (!this.customer) return [];
      
      return this.$parent.accounts.filter(account => 
        account.customerId === this.customer.id
      );
    },
    
    // 项目表单验证
    isProjectFormValid() {
      return (
        this.projectForm.name && 
        this.projectForm.status && 
        this.projectForm.startDate && 
        this.projectForm.endDate && 
        this.projectForm.expiryDate && 
        this.projectForm.team && 
        this.projectForm.totalFee && 
        this.projectForm.selectedChannels.length > 0
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
    
    goBack() {
      this.$emit('select-customer', null);
    },
    
    editBasicInfo() {
      console.log('编辑客户基本信息:', this.customer.name);
      // 实际项目中应该打开客户编辑弹窗
    },
    
    importSituation() {
      console.log('导入客户情况:', this.customer.name);
      // 实际项目中应该打开文件导入弹窗
    },
    
    saveSituation() {
      if (!this.situationForm.info || !this.situationForm.creator) return;
      
      const newSituation = {
        info: this.situationForm.info,
        creator: this.situationForm.creator,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      console.log('保存客户情况:', newSituation);
      
      // 不直接修改prop，而是通过事件通知父组件
      this.$emit('add-situation', {
        customerId: this.customer.id,
        situation: newSituation
      });
      
      // 重置表单和关闭弹窗
      this.situationForm = {
        info: '',
        creator: ''
      };
      this.showAddSituationDialog = false;
    },
    
    addProject() {
      console.log('为客户添加项目:', this.customer.name);
      this.projectForm = {
        name: '',
        status: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        expiryDate: '',
        team: '',
        totalFee: '',
        selectedChannels: []
      };
      this.showAddProjectDialog = true;
    },
    
    viewDashboard(project) {
      // 跳转到项目数据看板
      console.log('查看项目数据看板:', project.name);
      // 实际项目中应该使用路由导航
    },
    
    renewService(project) {
      // 服务费续费
      console.log('服务费续费:', project.name);
      // 实际项目中应该打开服务费续费弹窗或跳转页面
    },
    
    saveAccount() {
      if (!this.accountForm.platform || !this.accountForm.account || !this.accountForm.accountId || !this.accountForm.balance || !this.accountForm.availableDate) return;
      
      const newAccount = {
        id: this.$parent.accounts.length + 1,
        customerId: this.customer.id,
        platform: this.accountForm.platform,
        account: this.accountForm.account,
        accountId: this.accountForm.accountId,
        balance: parseFloat(this.accountForm.balance),
        availableDate: this.accountForm.availableDate
      };
      
      console.log('保存投放账户:', newAccount);
      
      // 实际项目中应该调用API
      // 模拟添加到本地数据
      this.$parent.accounts.push(newAccount);
      
      // 重置表单和关闭弹窗
      this.accountForm = {
        platform: '',
        account: '',
        accountId: '',
        balance: '',
        availableDate: ''
      };
      this.showAddAccountDialog = false;
    },
    
    editAccount(account) {
      console.log('编辑投放账户:', account);
      // 实际项目中应该打开投放账户编辑弹窗
    },
    
    deleteAccount(account) {
      console.log('删除投放账户:', account);
      // 实际项目中应该显示确认弹窗并调用API
    },
    
    saveProject() {
      if (!this.isProjectFormValid) return;
      
      const newProject = {
        id: this.$parent.projects.length + 1,
        customerId: this.customer.id,
        name: this.projectForm.name,
        status: this.projectForm.status,
        startDate: this.projectForm.startDate,
        endDate: this.projectForm.endDate,
        expiryDate: this.projectForm.expiryDate,
        team: this.projectForm.team,
        channels: this.projectForm.selectedChannels.join(', '),
        totalFee: parseFloat(this.projectForm.totalFee)
      };
      
      console.log('保存新项目:', newProject);
      
      // 实际项目中应该调用API
      // 模拟添加到本地数据
      this.$parent.projects.push(newProject);
      
      // 关闭弹窗
      this.showAddProjectDialog = false;
    },
    
    getDaysRemaining(dateString) {
      if (!dateString) return 0;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const targetDate = new Date(dateString);
      targetDate.setHours(0, 0, 0, 0);
      
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 ? diffDays : 0;
    }
  }
};
</script>

<style scoped>
.customer-detail {
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-title {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: 1px solid #1976d2;
  color: #1976d2;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: #e3f2fd;
}

.back-icon {
  margin-right: 6px;
  font-size: 1.1rem;
}

.detail-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.detail-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
}

.section-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.edit-button,
.action-button {
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button:hover,
.action-button:hover {
  background-color: #1565c0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.info-item {
  padding: 10px;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.info-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.info-value {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.situation-list,
.evaluation-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.situation-item,
.evaluation-item {
  padding: 15px;
  border-radius: 6px;
  background-color: #f9f9f9;
  border-left: 3px solid #1976d2;
}

.situation-content,
.evaluation-comment {
  font-size: 1rem;
  color: #333;
  margin-bottom: 10px;
}

.situation-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
}

.evaluation-score {
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #666;
}

.score-value {
  font-size: 1.1rem;
  font-weight: 500;
  color: #1976d2;
}

.evaluation-date {
  font-size: 0.9rem;
  color: #666;
  text-align: right;
  margin-top: 10px;
}

.empty-data {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

.table-container {
  overflow-x: auto;
  padding: 0 20px 20px;
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

.action-buttons {
  display: flex;
  gap: 8px;
  white-space: nowrap;
}

.edit-btn,
.delete-btn,
.dashboard-btn,
.service-btn {
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  border: 1px solid;
}

.edit-btn {
  background-color: #1976d2;
  border-color: #1976d2;
  color: white;
}

.delete-btn {
  background-color: white;
  border-color: #f44336;
  color: #f44336;
}

.dashboard-btn {
  background-color: #1976d2;
  border-color: #1976d2;
  color: white;
}

.service-btn {
  background-color: white;
  border-color: #1976d2;
  color: #1976d2;
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
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
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

.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.required {
  color: #f44336;
}

.save-button,
.cancel-button {
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

.warning-days {
  color: #f44336;
  font-weight: bold;
  position: relative;
  padding-left: 18px;
}

.warning-days::before {
  content: "⚠️";
  position: absolute;
  left: 0;
  font-size: 0.9rem;
}

.form-row {
  display: flex;
  gap: 15px;
}

.half-width {
  width: 50%;
}

.channel-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
}

.channel-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
  width: calc(33.33% - 7px);
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}

.channel-checkbox input[type="checkbox"] {
  cursor: pointer;
}

.project-modal {
  max-width: 600px;
}
</style> 