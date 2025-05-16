<template>
  <div class="service-fee-list">
    <div class="module-header">
      <h2 class="module-title">服务费用列表</h2>
      <button class="add-button" @click="showAddDialog = true">
        <span class="add-icon">+</span> 新增服务费
      </button>
    </div>
    
    <div class="filter-bar">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索客户或项目名称" 
          class="search-input"
        >
      </div>
      
      <div class="filter-group">
        <label>到期时间:</label>
        <select v-model="expiryFilter" class="filter-select">
          <option value="">全部</option>
          <option value="current">本月到期</option>
          <option value="next">下月到期</option>
          <option value="expired">已过期</option>
        </select>
      </div>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>客户名称</th>
            <th>续费项目</th>
            <th>续费金额</th>
            <th>服务时长</th>
            <th>到期时间</th>
            <th>付费凭证</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fee in filteredServiceFees" :key="fee.id">
            <td>{{ fee.customerName }}</td>
            <td>{{ fee.projectName }}</td>
            <td>¥{{ formatNumber(fee.amount) }}</td>
            <td>{{ fee.duration }}个月</td>
            <td>
              <span :class="{ 'expiry-warning': isNearExpiry(fee.expiryDate) }">
                {{ formatDate(fee.expiryDate) }}
              </span>
            </td>
            <td>
              <button v-if="fee.paymentProof" class="view-btn" @click="viewPaymentProof(fee)">查看凭证</button>
              <span v-else>未上传</span>
            </td>
            <td class="action-buttons">
              <button class="edit-btn" @click="editServiceFee(fee)">编辑</button>
              <button class="delete-btn" @click="deleteServiceFee(fee)">删除</button>
            </td>
          </tr>
          <tr v-if="filteredServiceFees.length === 0">
            <td colspan="7" class="empty-data">暂无服务费用数据</td>
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
    
    <!-- 服务费添加/编辑对话框 -->
    <ServiceFeeForm 
      v-if="showAddDialog || editingFee" 
      :fee="editingFee"
      :isEditing="!!editingFee"
      @close="closeDialog"
      @save="saveFee"
    />
    
    <!-- 付费凭证查看对话框 -->
    <div class="modal" v-if="showProofDialog">
      <div class="modal-content proof-modal">
        <div class="modal-header">
          <h3>付费凭证</h3>
          <button class="close-button" @click="showProofDialog = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="proof-image-container">
            <img :src="selectedProof" alt="付费凭证" class="proof-image">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceFeeForm from './ServiceFeeForm.vue';

export default {
  name: 'ServiceFeeList',
  components: {
    ServiceFeeForm
  },
  data() {
    return {
      searchQuery: '',
      expiryFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      showAddDialog: false,
      editingFee: null,
      showProofDialog: false,
      selectedProof: '',
      // 服务费数据列表
      serviceFees: [
        {
          id: 1,
          customerName: '上海某科技有限公司',
          projectName: '电商广告投放项目',
          amount: 15000,
          duration: 3,
          expiryDate: '2023-09-30',
          paymentProof: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmMmYyZjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+5Y2w6LSn6YeH6K2m5LuL5Yqb5aSH5qGIPC90ZXh0Pjwvc3ZnPg=='
        },
        {
          id: 2,
          customerName: '北京某贸易有限公司',
          projectName: '品牌推广项目',
          amount: 18000,
          duration: 6,
          expiryDate: '2023-12-15',
          paymentProof: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmMmYyZjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+5Y2w6LSn6YeH6K2m5LuL5Yqb5aSH5qGIPC90ZXh0Pjwvc3ZnPg=='
        },
        {
          id: 3,
          customerName: '广州某电子商务有限公司',
          projectName: '新品上市推广',
          amount: 12000,
          duration: 3,
          expiryDate: '2023-08-20',
          paymentProof: null
        },
        {
          id: 4,
          customerName: '深圳某网络科技有限公司',
          projectName: '海外市场拓展',
          amount: 30000,
          duration: 12,
          expiryDate: '2024-05-10',
          paymentProof: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmMmYyZjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+5Y2w6LSn6YeH6K2m5LuL5Yqb5aSH5qGIPC90ZXh0Pjwvc3ZnPg=='
        },
        {
          id: 5,
          customerName: '杭州某文化传媒有限公司',
          projectName: '节日营销活动',
          amount: 8000,
          duration: 2,
          expiryDate: '2023-10-15',
          paymentProof: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNmMmYyZjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+5Y2w6LSn6YeH6K2m5LuL5Yqb5aSH5qGIPC90ZXh0Pjwvc3ZnPg=='
        }
      ]
    };
  },
  computed: {
    filteredServiceFees() {
      let result = [...this.serviceFees];
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(fee => 
          fee.customerName.toLowerCase().includes(query) ||
          fee.projectName.toLowerCase().includes(query)
        );
      }
      
      // 到期时间过滤
      if (this.expiryFilter) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        if (this.expiryFilter === 'current') {
          // 本月到期
          result = result.filter(fee => {
            const expiryDate = new Date(fee.expiryDate);
            return expiryDate.getMonth() === currentMonth && 
                   expiryDate.getFullYear() === currentYear;
          });
        } else if (this.expiryFilter === 'next') {
          // 下月到期
          let nextMonth = currentMonth + 1;
          let nextYear = currentYear;
          if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
          }
          
          result = result.filter(fee => {
            const expiryDate = new Date(fee.expiryDate);
            return expiryDate.getMonth() === nextMonth && 
                   expiryDate.getFullYear() === nextYear;
          });
        } else if (this.expiryFilter === 'expired') {
          // 已过期
          result = result.filter(fee => {
            return new Date(fee.expiryDate) < now;
          });
        }
      }
      
      // 分页
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      
      return result.slice(startIndex, endIndex);
    },
    
    totalPages() {
      let filteredCount = this.getFilteredCount();
      return Math.ceil(filteredCount / this.itemsPerPage) || 1;
    }
  },
  methods: {
    getFilteredCount() {
      let result = [...this.serviceFees];
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(fee => 
          fee.customerName.toLowerCase().includes(query) ||
          fee.projectName.toLowerCase().includes(query)
        );
      }
      
      // 到期时间过滤
      if (this.expiryFilter) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        if (this.expiryFilter === 'current') {
          // 本月到期
          result = result.filter(fee => {
            const expiryDate = new Date(fee.expiryDate);
            return expiryDate.getMonth() === currentMonth && 
                   expiryDate.getFullYear() === currentYear;
          });
        } else if (this.expiryFilter === 'next') {
          // 下月到期
          let nextMonth = currentMonth + 1;
          let nextYear = currentYear;
          if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
          }
          
          result = result.filter(fee => {
            const expiryDate = new Date(fee.expiryDate);
            return expiryDate.getMonth() === nextMonth && 
                   expiryDate.getFullYear() === nextYear;
          });
        } else if (this.expiryFilter === 'expired') {
          // 已过期
          result = result.filter(fee => {
            return new Date(fee.expiryDate) < now;
          });
        }
      }
      
      return result.length;
    },
    
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    isNearExpiry(dateString) {
      const now = new Date();
      const expiryDate = new Date(dateString);
      const diffTime = expiryDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // 如果到期时间在30天内，显示警告
      return diffDays <= 30 && diffDays >= 0;
    },
    
    viewPaymentProof(fee) {
      this.selectedProof = fee.paymentProof;
      this.showProofDialog = true;
    },
    
    editServiceFee(fee) {
      this.editingFee = JSON.parse(JSON.stringify(fee));
      this.showAddDialog = false;
    },
    
    deleteServiceFee(fee) {
      if (confirm(`确定要删除 ${fee.customerName} 的 ${fee.projectName} 服务费记录吗？`)) {
        const index = this.serviceFees.findIndex(item => item.id === fee.id);
        if (index !== -1) {
          this.serviceFees.splice(index, 1);
          
          // 重新计算总页数，如果当前页没有数据了，回到上一页
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
          }
        }
      }
    },
    
    closeDialog() {
      this.showAddDialog = false;
      this.editingFee = null;
    },
    
    saveFee(feeData) {
      if (feeData.id) {
        // 编辑现有记录
        const index = this.serviceFees.findIndex(fee => fee.id === feeData.id);
        if (index !== -1) {
          this.serviceFees.splice(index, 1, feeData);
        }
      } else {
        // 创建新记录
        const newId = Math.max(0, ...this.serviceFees.map(fee => fee.id)) + 1;
        this.serviceFees.push({
          ...feeData,
          id: newId
        });
      }
      this.closeDialog();
    }
  }
}
</script>

<style scoped>
.service-fee-list {
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
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
}

.add-button {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #1565c0;
}

.add-icon {
  font-size: 1.2rem;
  margin-right: 5px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
  max-width: 300px;
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
}

.filter-group label {
  margin-right: 8px;
  font-size: 0.9rem;
  color: #666;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #f5f7fa;
  padding: 12px 15px;
  text-align: left;
  color: #666;
  font-weight: 500;
  border-bottom: 1px solid #e0e0e0;
}

.data-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.expiry-warning {
  color: #ff9800;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.view-btn, .edit-btn, .delete-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s;
}

.view-btn {
  background-color: #2196f3;
}

.view-btn:hover {
  background-color: #1e88e5;
}

.edit-btn {
  background-color: #4caf50;
}

.edit-btn:hover {
  background-color: #43a047;
}

.delete-btn {
  background-color: #f44336;
}

.delete-btn:hover {
  background-color: #e53935;
}

.empty-data {
  text-align: center;
  color: #888;
  padding: 20px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.page-button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: white;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-button:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 15px;
  font-size: 0.9rem;
  color: #666;
}

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
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.proof-modal {
  max-width: 800px;
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
  color: #666;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.proof-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.proof-image {
  max-width: 100%;
  max-height: 70vh;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style> 