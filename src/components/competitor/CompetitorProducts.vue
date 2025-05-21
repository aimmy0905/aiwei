<template>
  <div class="competitor-products">
    <div class="section-header">
      <h2>竞品商品列表</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> 新建竞品
      </button>
    </div>
    
    <div class="search-filters">
      <div class="search-input">
        <input 
          type="text" 
          placeholder="搜索竞品名称" 
          v-model="searchKeyword"
        >
        <i class="fas fa-search"></i>
      </div>
      <div class="filter-group">
        <select v-model="categoryFilter">
          <option value="">全部分类</option>
          <option value="服装">服装</option>
          <option value="电子产品">电子产品</option>
          <option value="家居用品">家居用品</option>
        </select>
      </div>
    </div>
    
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>分类</th>
            <th>售价</th>
            <th>售价变化</th>
            <th>对比客户</th>
            <th>对比项目</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in filteredProducts" :key="index">
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>¥{{ product.price }}</td>
            <td>
              <span :class="getPriceChangeClass(product.priceChange)">
                {{ formatPriceChange(product.priceChange) }}
              </span>
            </td>
            <td>{{ getCustomerName(product.customerId) }}</td>
            <td>{{ getProjectName(product.projectId) }}</td>
            <td class="actions">
              <button class="btn btn-edit" @click="editProduct(product)">
                <i class="fas fa-edit"></i> 编辑
              </button>
              <button class="btn btn-delete" @click="confirmDelete(product)">
                <i class="fas fa-trash"></i> 删除
              </button>
            </td>
          </tr>
          <tr v-if="filteredProducts.length === 0">
            <td colspan="7" class="no-data">暂无数据</td>
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
    
    <!-- 新建/编辑竞品弹窗 -->
    <div class="modal" v-if="showAddModal || showEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑竞品' : '新建竞品' }}</h3>
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
            <label>商品名称</label>
            <input type="text" v-model="formData.name" required>
          </div>
          
          <div class="form-group">
            <label>商品分类</label>
            <input type="text" v-model="formData.category" required>
          </div>
          
          <div class="form-group">
            <label>商品售价</label>
            <input type="number" v-model="formData.price" step="0.01" min="0" required>
          </div>
          
          <div class="form-group">
            <label>商品链接</label>
            <input type="url" v-model="formData.link" required>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModals">取消</button>
          <button class="btn btn-primary" @click="saveProduct">保存</button>
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
          <p>确定要删除竞品"{{ productToDelete?.name }}"吗？此操作不可撤销。</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDeleteModal = false">取消</button>
          <button class="btn btn-danger" @click="deleteProduct">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompetitorProducts',
  data() {
    return {
      // 列表数据
      products: [
        { 
          id: 1, 
          name: '竞品A智能手表', 
          category: '电子产品', 
          price: 1299, 
          priceChange: 5.2,
          link: 'https://example.com/product1',
          customerId: 1,
          projectId: 1
        },
        { 
          id: 2, 
          name: '竞品B运动鞋', 
          category: '服装', 
          price: 899, 
          priceChange: -3.5,
          link: 'https://example.com/product2',
          customerId: 2,
          projectId: 2
        },
        { 
          id: 3, 
          name: '竞品C智能音箱', 
          category: '电子产品', 
          price: 599, 
          priceChange: 0,
          link: 'https://example.com/product3',
          customerId: 1,
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
      categoryFilter: '',
      currentPage: 1,
      pageSize: 10,
      
      // 弹窗控制
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      
      // 表单数据和操作对象
      formData: {
        customerId: '',
        projectId: '',
        name: '',
        category: '',
        price: '',
        link: ''
      },
      productToDelete: null,
      editingProductId: null
    }
  },
  computed: {
    filteredProducts() {
      // 根据搜索关键词和分类筛选
      let filtered = this.products;
      
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(keyword)
        );
      }
      
      if (this.categoryFilter) {
        filtered = filtered.filter(p => 
          p.category === this.categoryFilter
        );
      }
      
      // 计算分页
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      
      return filtered.slice(start, end);
    },
    totalPages() {
      // 计算总页数
      let filtered = this.products;
      
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(keyword)
        );
      }
      
      if (this.categoryFilter) {
        filtered = filtered.filter(p => 
          p.category === this.categoryFilter
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
    
    // 格式化价格变化
    formatPriceChange(change) {
      if (change === 0) return '无变化';
      return change > 0 ? `↑ ${change}%` : `↓ ${Math.abs(change)}%`;
    },
    
    // 获取价格变化的样式类
    getPriceChangeClass(change) {
      if (change > 0) return 'price-up';
      if (change < 0) return 'price-down';
      return '';
    },
    
    // 编辑商品
    editProduct(product) {
      this.formData = { 
        customerId: product.customerId,
        projectId: product.projectId,
        name: product.name,
        category: product.category,
        price: product.price,
        link: product.link
      };
      this.editingProductId = product.id;
      this.showEditModal = true;
    },
    
    // 确认删除
    confirmDelete(product) {
      this.productToDelete = product;
      this.showDeleteModal = true;
    },
    
    // 删除商品
    deleteProduct() {
      if (!this.productToDelete) return;
      
      // 移除商品
      this.products = this.products.filter(p => p.id !== this.productToDelete.id);
      
      // 关闭弹窗
      this.showDeleteModal = false;
      this.productToDelete = null;
      
      // 重置页码（如果当前页没有数据）
      if (this.filteredProducts.length === 0 && this.currentPage > 1) {
        this.currentPage = Math.max(1, this.currentPage - 1);
      }
    },
    
    // 保存商品
    saveProduct() {
      // 表单验证
      if (!this.formData.customerId || !this.formData.projectId || 
          !this.formData.name || !this.formData.category || 
          !this.formData.price || !this.formData.link) {
        alert('请填写所有必填项');
        return;
      }
      
      if (this.showEditModal) {
        // 更新现有商品
        const index = this.products.findIndex(p => p.id === this.editingProductId);
        if (index !== -1) {
          this.products[index] = {
            ...this.products[index],
            ...this.formData
          };
        }
      } else {
        // 添加新商品
        const newId = Math.max(0, ...this.products.map(p => p.id)) + 1;
        this.products.push({
          id: newId,
          ...this.formData,
          priceChange: 0 // 新商品默认无价格变化
        });
      }
      
      // 关闭弹窗并重置表单
      this.closeModals();
    },
    
    // 关闭所有弹窗
    closeModals() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.editingProductId = null;
      this.formData = {
        customerId: '',
        projectId: '',
        name: '',
        category: '',
        price: '',
        link: ''
      };
    }
  }
}
</script>

<style scoped>
.competitor-products {
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

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
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

.price-up {
  color: #f44336;
}

.price-down {
  color: #4caf50;
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
</style> 