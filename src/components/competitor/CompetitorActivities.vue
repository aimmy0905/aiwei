<template>
  <div class="competitor-activities">
    <div class="section-header">
      <h2>竞品网站活动列表</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> 新建竞品网站
      </button>
    </div>
    
    <div class="search-filters">
      <div class="search-input">
        <input 
          type="text" 
          placeholder="搜索网站名称" 
          v-model="searchKeyword"
        >
        <i class="fas fa-search"></i>
      </div>
    </div>
    
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>网站名称</th>
            <th>网站链接</th>
            <th>活动名称</th>
            <th>对比客户</th>
            <th>对比项目</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(website, index) in filteredWebsites" :key="index">
            <td>{{ website.name }}</td>
            <td>
              <a :href="website.url" target="_blank" class="website-link">
                {{ website.url }} <i class="fas fa-external-link-alt"></i>
              </a>
            </td>
            <td>{{ website.activityName }}</td>
            <td>{{ getCustomerName(website.customerId) }}</td>
            <td>{{ getProjectName(website.projectId) }}</td>
            <td class="actions">
              <button class="btn btn-edit" @click="editWebsite(website)">
                <i class="fas fa-edit"></i> 编辑
              </button>
              <button class="btn btn-delete" @click="confirmDelete(website)">
                <i class="fas fa-trash"></i> 删除
              </button>
            </td>
          </tr>
          <tr v-if="filteredWebsites.length === 0">
            <td colspan="6" class="no-data">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页控件 -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">上一页</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">下一页</button>
    </div>
    
    <!-- 新建/编辑竞品网站弹窗 -->
    <div class="modal" v-if="showAddModal || showEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑竞品网站' : '新建竞品网站' }}</h3>
          <button class="close-btn" @click="closeModals">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>选择客户</label>
            <select v-model="formData.customerId" required>
              <option value="">请选择客户</option>
              <option v-for="(customer, index) in customers" :key="index" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>选择项目</label>
            <select v-model="formData.projectId" required>
              <option value="">请选择项目</option>
              <option v-for="(project, index) in projects" :key="index" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>网站名称</label>
            <input type="text" v-model="formData.name" required>
          </div>
          
          <div class="form-group">
            <label>网站地址</label>
            <input type="url" v-model="formData.url" required>
          </div>
          
          <div v-if="showEditModal" class="form-group">
            <label>活动名称</label>
            <input type="text" v-model="formData.activityName" disabled>
            <small>活动名称通过爬虫竞品网站的banner图自动获取</small>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModals">取消</button>
          <button class="btn btn-primary" @click="saveWebsite">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 删除确认弹窗 -->
    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content delete-confirm">
        <div class="modal-header">
          <h3>确认删除</h3>
          <button class="close-btn" @click="showDeleteModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <p>确定要删除竞品网站"{{ websiteToDelete?.name }}"吗？此操作不可撤销。</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDeleteModal = false">取消</button>
          <button class="btn btn-danger" @click="deleteWebsite">确认删除</button>
        </div>
      </div>
    </div>
    
    <!-- 爬虫抓取提示 -->
    <div class="modal" v-if="showCrawlerModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>抓取活动信息</h3>
          <button class="close-btn" @click="showCrawlerModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="crawler-status">
            <div class="spinner"></div>
            <p>正在从"{{ currentCrawlingWebsite?.name }}"网站抓取活动信息，请稍候...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompetitorActivities',
  data() {
    return {
      // 列表数据
      websites: [
        { 
          id: 1, 
          name: '竞品A官网', 
          url: 'https://example-a.com',
          activityName: '夏日促销大放送',
          customerId: 1,
          projectId: 2
        },
        { 
          id: 2, 
          name: '竞品B商城', 
          url: 'https://example-b.com',
          activityName: '新品发布会',
          customerId: 2,
          projectId: 1
        },
        { 
          id: 3, 
          name: '竞品C店铺', 
          url: 'https://example-c.com',
          activityName: '限时折扣活动',
          customerId: 3,
          projectId: 3
        },
      ],
      
      // 客户和项目数据
      customers: [
        { id: 1, name: '客户A' },
        { id: 2, name: '客户B' },
        { id: 3, name: '客户C' },
      ],
      projects: [
        { id: 1, name: '项目A' },
        { id: 2, name: '项目B' },
        { id: 3, name: '项目C' },
      ],
      
      // 筛选和分页
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      
      // 弹窗控制
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showCrawlerModal: false,
      
      // 表单数据和操作对象
      formData: {
        customerId: '',
        projectId: '',
        name: '',
        url: '',
        activityName: ''
      },
      websiteToDelete: null,
      editingWebsiteId: null,
      currentCrawlingWebsite: null
    }
  },
  computed: {
    filteredWebsites() {
      // 根据搜索关键词筛选
      let filtered = this.websites;
      
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(w => 
          w.name.toLowerCase().includes(keyword)
        );
      }
      
      // 计算分页
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      
      return filtered.slice(start, end);
    },
    totalPages() {
      // 计算总页数
      let filtered = this.websites;
      
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(w => 
          w.name.toLowerCase().includes(keyword)
        );
      }
      
      return Math.max(1, Math.ceil(filtered.length / this.pageSize));
    }
  },
  methods: {
    // 获取客户名称
    getCustomerName(customerId) {
      const customer = this.customers.find(c => c.id === customerId);
      return customer ? customer.name : '未知客户';
    },
    
    // 获取项目名称
    getProjectName(projectId) {
      const project = this.projects.find(p => p.id === projectId);
      return project ? project.name : '未知项目';
    },
    
    // 编辑网站
    editWebsite(website) {
      this.formData = { 
        customerId: website.customerId,
        projectId: website.projectId,
        name: website.name,
        url: website.url,
        activityName: website.activityName
      };
      this.editingWebsiteId = website.id;
      this.showEditModal = true;
    },
    
    // 确认删除
    confirmDelete(website) {
      this.websiteToDelete = website;
      this.showDeleteModal = true;
    },
    
    // 删除网站
    deleteWebsite() {
      if (!this.websiteToDelete) return;
      
      // 移除网站
      this.websites = this.websites.filter(w => w.id !== this.websiteToDelete.id);
      
      // 关闭弹窗
      this.showDeleteModal = false;
      this.websiteToDelete = null;
      
      // 重置页码（如果当前页没有数据）
      if (this.filteredWebsites.length === 0 && this.currentPage > 1) {
        this.currentPage = Math.max(1, this.currentPage - 1);
      }
    },
    
    // 保存网站
    saveWebsite() {
      // 表单验证
      if (!this.formData.name || !this.formData.url || !this.formData.customerId || !this.formData.projectId) {
        alert('请填写所有必填项');
        return;
      }
      
      if (this.showEditModal) {
        // 更新现有网站
        const index = this.websites.findIndex(w => w.id === this.editingWebsiteId);
        if (index !== -1) {
          this.websites[index] = {
            ...this.websites[index],
            name: this.formData.name,
            url: this.formData.url,
            customerId: this.formData.customerId,
            projectId: this.formData.projectId
          };
        }
        
        // 关闭弹窗并重置表单
        this.closeModals();
      } else {
        // 添加新网站前，先模拟爬虫过程
        this.currentCrawlingWebsite = {
          name: this.formData.name,
          url: this.formData.url
        };
        this.showCrawlerModal = true;
        
        // 模拟爬虫延迟
        setTimeout(() => {
          // 添加新网站
          const newId = Math.max(0, ...this.websites.map(w => w.id)) + 1;
          
          // 模拟爬虫获取活动名称
          const mockActivityNames = [
            '限时折扣', '新品上市', '会员专享', '节日特惠', 
            '闪购活动', '清仓特卖', '买一送一', '满减优惠'
          ];
          const randomActivity = mockActivityNames[Math.floor(Math.random() * mockActivityNames.length)];
          
          this.websites.push({
            id: newId,
            name: this.formData.name,
            url: this.formData.url,
            customerId: this.formData.customerId,
            projectId: this.formData.projectId,
            activityName: randomActivity
          });
          
          // 关闭爬虫提示和弹窗
          this.showCrawlerModal = false;
          this.closeModals();
        }, 2000);
      }
    },
    
    // 关闭所有弹窗
    closeModals() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.editingWebsiteId = null;
      this.formData = {
        customerId: '',
        projectId: '',
        name: '',
        url: '',
        activityName: ''
      };
    }
  }
}
</script>

<style scoped>
.competitor-activities {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
}

.search-filters {
  display: flex;
  margin-bottom: 20px;
  gap: 15px;
}

.search-input {
  position: relative;
  width: 300px;
}

.search-input input {
  width: 100%;
  padding: 8px 12px 8px 35px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-input i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
}

.data-table {
  width: 100%;
  overflow-x: auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 500;
  color: #666;
  background-color: #f9f9f9;
}

.actions {
  display: flex;
  gap: 10px;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn i {
  font-size: 0.9rem;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover {
  background-color: #1565c0;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-edit {
  background-color: #2196f3;
  color: white;
  padding: 6px 12px;
}

.btn-edit:hover {
  background-color: #1e88e5;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  padding: 6px 12px;
}

.btn-delete:hover {
  background-color: #e53935;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #e53935;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 4px;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.delete-confirm {
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
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group small {
  display: block;
  margin-top: 5px;
  color: #999;
  font-size: 0.8rem;
}

/* 爬虫状态 */
.crawler-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 添加网站链接样式 */
.website-link {
  color: #1976d2;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

.website-link:hover {
  text-decoration: underline;
}

.website-link i {
  font-size: 0.8rem;
}
</style> 