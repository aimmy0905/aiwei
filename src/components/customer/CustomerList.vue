<template>
  <div class="customer-list">
    <div class="module-header">
      <h2 class="module-title">客户列表</h2>
      <button class="add-button" @click="showAddDialog = true">
        <span class="add-icon">+</span> 新建客户
      </button>
    </div>
    
    <div class="filter-bar">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索客户名称或联系人" 
          class="search-input"
        >
      </div>
      
      <div class="filter-group">
        <label>合作类型:</label>
        <select v-model="typeFilter" class="filter-select">
          <option value="">全部</option>
          <option v-for="type in cooperationTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>销售经理:</label>
        <select v-model="managerFilter" class="filter-select">
          <option value="">全部</option>
          <option v-for="manager in salesManagers" :key="manager" :value="manager">{{ manager }}</option>
        </select>
      </div>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>客户名称</th>
            <th>合作类型</th>
            <th>联系人</th>
            <th>联系方式</th>
            <th>销售经理</th>
            <th>销售人员</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.id">
            <td>{{ customer.name }}</td>
            <td>{{ customer.cooperationType }}</td>
            <td>{{ customer.contactPerson }}</td>
            <td>{{ customer.contactInfo }}</td>
            <td>{{ customer.salesManager }}</td>
            <td>{{ customer.salesPerson }}</td>
            <td>{{ formatDate(customer.createdAt) }}</td>
            <td class="action-buttons">
              <button class="detail-btn" @click="viewDetail(customer)">详情</button>
              <button class="projects-btn" @click="viewProjects(customer)">合作项目</button>
              <button class="accounts-btn" @click="viewAccounts(customer)">投放账户</button>
              <div class="more-actions">
                <button class="more-btn" @click="showMoreActions(customer)">•••</button>
                <div class="dropdown-menu" v-if="activeDropdown === customer.id">
                  <button class="dropdown-item" @click="editCustomer(customer)">编辑</button>
                  <button class="dropdown-item delete" @click="deleteCustomer(customer)">删除</button>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="filteredCustomers.length === 0">
            <td colspan="8" class="empty-data">暂无数据</td>
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
    
    <!-- 客户新建/编辑对话框 -->
    <div class="modal" v-if="showAddDialog || editingCustomer">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingCustomer ? '编辑客户' : '新建客户' }}</h3>
          <button class="close-button" @click="closeAddDialog">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>客户名称 <span class="required">*</span></label>
            <input type="text" v-model="customerForm.name" class="form-input" placeholder="请输入客户名称">
          </div>
          <div class="form-group">
            <label>合作类型 <span class="required">*</span></label>
            <select v-model="customerForm.cooperationType" class="form-input">
              <option value="">请选择合作类型</option>
              <option value="整合营销">整合营销</option>
              <option value="品牌推广">品牌推广</option>
              <option value="产品推广">产品推广</option>
              <option value="内容营销">内容营销</option>
            </select>
          </div>
          <div class="form-group">
            <label>联系人 <span class="required">*</span></label>
            <input type="text" v-model="customerForm.contactPerson" class="form-input" placeholder="请输入联系人姓名">
          </div>
          <div class="form-group">
            <label>联系方式 <span class="required">*</span></label>
            <input type="text" v-model="customerForm.contactInfo" class="form-input" placeholder="请输入联系方式">
          </div>
          <div class="form-group">
            <label>销售经理 <span class="required">*</span></label>
            <input type="text" v-model="customerForm.salesManager" class="form-input" placeholder="请输入销售经理姓名">
          </div>
          <div class="form-group">
            <label>销售人员 <span class="required">*</span></label>
            <input type="text" v-model="customerForm.salesPerson" class="form-input" placeholder="请输入销售人员姓名">
          </div>
          <div class="form-group">
            <label>客户情况</label>
            <textarea 
              v-model="customerForm.situationInfo" 
              class="form-textarea" 
              placeholder="请输入客户情况描述"
              rows="4"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="closeAddDialog">取消</button>
          <button class="save-button" @click="saveCustomer" :disabled="!isFormValid">保存</button>
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
          <p>您确定要删除客户 "{{ customerToDelete?.name }}" 吗？此操作不可恢复。</p>
          <p class="warning">注意：删除客户将同时删除与该客户相关的所有项目和投放账户信息。</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="showDeleteConfirm = false">取消</button>
          <button class="delete-button" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </div>
    
    <!-- 客户合作项目对话框 -->
    <div class="modal" v-if="showProjectsDialog">
      <div class="modal-content projects-modal">
        <div class="modal-header">
          <h3>{{ selectedCustomer?.name }} - 合作项目</h3>
          <button class="close-button" @click="showProjectsDialog = false">&times;</button>
        </div>
        <div class="modal-body">
          <table class="data-table inner-table">
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
                <td>{{ project.status }}</td>
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
          <div class="modal-actions">
            <button class="add-project-btn" @click="addProject">添加项目</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 客户投放账户对话框 -->
    <div class="modal" v-if="showAccountsDialog">
      <div class="modal-content accounts-modal">
        <div class="modal-header">
          <h3>{{ selectedCustomer?.name }} - 投放账户</h3>
          <button class="close-button" @click="showAccountsDialog = false">&times;</button>
        </div>
        <div class="modal-body">
          <table class="data-table inner-table">
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
          <div class="modal-actions">
            <button class="add-account-btn" @click="addAccount">添加账户</button>
          </div>
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
              <option value="Twitter">Twitter</option>
              <option value="TikTok">TikTok</option>
              <option value="Pinterest">Pinterest</option>
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
            :disabled="!isAccountFormValid"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerList',
  props: {
    customers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchQuery: '',
      typeFilter: '',
      managerFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      activeDropdown: null,
      showAddDialog: false,
      editingCustomer: null,
      customerForm: {
        name: '',
        cooperationType: '',
        contactPerson: '',
        contactInfo: '',
        salesManager: '',
        salesPerson: '',
        createdAt: '',
        situationInfo: ''
      },
      showDeleteConfirm: false,
      customerToDelete: null,
      showProjectsDialog: false,
      showAccountsDialog: false,
      selectedCustomer: null,
      showAddProjectDialog: false,
      projectForm: {
        name: '',
        status: '',
        startDate: '',
        endDate: '',
        expiryDate: '',
        team: '',
        totalFee: '',
        selectedChannels: []
      },
      showAddAccountDialog: false,
      accountForm: {
        platform: '',
        account: '',
        accountId: '',
        balance: '',
        availableDate: ''
      }
    };
  },
  computed: {
    // 合作类型选项
    cooperationTypes() {
      const types = new Set();
      this.customers.forEach(customer => {
        types.add(customer.cooperationType);
      });
      return Array.from(types);
    },
    
    // 销售经理选项
    salesManagers() {
      const managers = new Set();
      this.customers.forEach(customer => {
        managers.add(customer.salesManager);
      });
      return Array.from(managers);
    },
    
    // 筛选后的客户列表
    filteredCustomers() {
      let result = [...this.customers];
      
      // 应用搜索
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(customer => 
          customer.name.toLowerCase().includes(query) ||
          customer.contactPerson.toLowerCase().includes(query)
        );
      }
      
      // 应用合作类型筛选
      if (this.typeFilter) {
        result = result.filter(customer => 
          customer.cooperationType === this.typeFilter
        );
      }
      
      // 应用销售经理筛选
      if (this.managerFilter) {
        result = result.filter(customer => 
          customer.salesManager === this.managerFilter
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
      let result = [...this.customers];
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(customer => 
          customer.name.toLowerCase().includes(query) ||
          customer.contactPerson.toLowerCase().includes(query)
        );
      }
      
      if (this.typeFilter) {
        result = result.filter(customer => 
          customer.cooperationType === this.typeFilter
        );
      }
      
      if (this.managerFilter) {
        result = result.filter(customer => 
          customer.salesManager === this.managerFilter
        );
      }
      
      filteredCount = result.length;
      return Math.ceil(filteredCount / this.itemsPerPage) || 1;
    },
    
    // 表单验证
    isFormValid() {
      return (
        this.customerForm.name && 
        this.customerForm.cooperationType && 
        this.customerForm.contactPerson && 
        this.customerForm.contactInfo && 
        this.customerForm.salesManager && 
        this.customerForm.salesPerson
      );
    },
    
    // 当前选中客户的项目
    customerProjects() {
      if (!this.selectedCustomer) return [];
      
      return this.$parent.projects.filter(project => 
        project.customerId === this.selectedCustomer.id
      );
    },
    
    // 当前选中客户的投放账户
    customerAccounts() {
      if (!this.selectedCustomer) return [];
      
      return this.$parent.accounts.filter(account => 
        account.customerId === this.selectedCustomer.id
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
    },
    
    // 账户表单验证
    isAccountFormValid() {
      return (
        this.accountForm.platform && 
        this.accountForm.account && 
        this.accountForm.accountId &&
        this.accountForm.balance && 
        this.accountForm.availableDate
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
    
    viewDetail(customer) {
      this.$emit('select-customer', customer);
    },
    
    viewProjects(customer) {
      this.selectedCustomer = customer;
      this.showProjectsDialog = true;
    },
    
    viewAccounts(customer) {
      this.selectedCustomer = customer;
      this.showAccountsDialog = true;
    },
    
    showMoreActions(customer) {
      this.activeDropdown = this.activeDropdown === customer.id ? null : customer.id;
    },
    
    editCustomer(customer) {
      this.editingCustomer = customer;
      this.customerForm = { ...customer }; // 浅拷贝客户信息
      this.activeDropdown = null;
    },
    
    deleteCustomer(customer) {
      this.customerToDelete = customer;
      this.showDeleteConfirm = true;
      this.activeDropdown = null;
    },
    
    confirmDelete() {
      // 删除客户
      console.log('删除客户:', this.customerToDelete.name);
      // 实际项目中应该调用API
      this.showDeleteConfirm = false;
      this.customerToDelete = null;
    },
    
    closeAddDialog() {
      this.showAddDialog = false;
      this.editingCustomer = null;
      this.resetForm();
    },
    
    resetForm() {
      this.customerForm = {
        name: '',
        cooperationType: '',
        contactPerson: '',
        contactInfo: '',
        salesManager: '',
        salesPerson: '',
        createdAt: '',
        situationInfo: ''
      };
    },
    
    saveCustomer() {
      if (!this.isFormValid) return;
      
      if (this.editingCustomer) {
        // 编辑现有客户
        console.log('保存编辑的客户:', this.customerForm);
      } else {
        // 添加新客户
        const newCustomer = {
          ...this.customerForm,
          id: this.customers.length + 1,
          createdAt: new Date().toISOString().split('T')[0],
          situations: [],
          evaluations: []
        };
        
        // 如果有输入客户情况，添加到列表中
        if (this.customerForm.situationInfo) {
          newCustomer.situations.push({
            info: this.customerForm.situationInfo,
            creator: this.customerForm.salesPerson,
            createdAt: new Date().toISOString().split('T')[0]
          });
        }
        
        console.log('添加新客户:', newCustomer);
      }
      
      // 实际项目中应该调用API
      this.closeAddDialog();
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
    
    addProject() {
      // 添加项目
      console.log('为客户添加项目:', this.selectedCustomer.name);
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
    
    saveProject() {
      if (!this.isProjectFormValid) return;
      
      const newProject = {
        id: this.$parent.projects.length + 1,
        customerId: this.selectedCustomer.id,
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
    
    addAccount() {
      // 添加投放账户
      console.log('为客户添加投放账户:', this.selectedCustomer.name);
      this.accountForm = {
        platform: '',
        account: '',
        accountId: '',
        balance: '',
        availableDate: new Date().toISOString().split('T')[0]
      };
      this.showAddAccountDialog = true;
    },
    
    saveAccount() {
      if (!this.isAccountFormValid) return;
      
      const newAccount = {
        id: this.$parent.accounts.length + 1,
        customerId: this.selectedCustomer.id,
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
      
      // 关闭弹窗
      this.showAddAccountDialog = false;
    },
    
    editAccount(account) {
      // 编辑投放账户
      console.log('编辑投放账户:', account);
      // 实际项目中应该打开投放账户编辑弹窗
    },
    
    deleteAccount(account) {
      // 删除投放账户
      console.log('删除投放账户:', account);
      // 实际项目中应该显示确认弹窗并调用API
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
.customer-list {
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

.empty-data {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
  white-space: nowrap;
}

.detail-btn,
.projects-btn,
.accounts-btn,
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

.detail-btn {
  background-color: #1976d2;
  border-color: #1976d2;
  color: white;
}

.projects-btn {
  background-color: white;
  border-color: #4caf50;
  color: #4caf50;
}

.accounts-btn {
  background-color: white;
  border-color: #ff9800;
  color: #ff9800;
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

.projects-modal,
.accounts-modal {
  max-width: 90%;
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

.warning {
  color: #f44336;
  font-size: 0.9rem;
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

.inner-table {
  margin-bottom: 15px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.add-project-btn,
.add-account-btn {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.add-project-btn:hover {
  background-color: #45a049;
}

.add-account-btn:hover {
  background-color: #45a049;
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
</style> 