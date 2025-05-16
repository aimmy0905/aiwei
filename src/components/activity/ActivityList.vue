<template>
  <div class="activity-list">
    <div class="module-header">
      <h2 class="module-title">活动列表</h2>
      <button class="add-button" @click="showAddDialog = true">
        <span class="add-icon">+</span> 新增活动
      </button>
    </div>
    
    <div class="filter-bar">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索活动名称" 
          class="search-input"
        >
      </div>
      
      <div class="filter-group">
        <label>活动时间:</label>
        <select v-model="timeFilter" class="filter-select">
          <option value="">全部</option>
          <option value="current">进行中</option>
          <option value="past">已结束</option>
          <option value="upcoming">即将开始</option>
        </select>
      </div>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>活动名称</th>
            <th>客户</th>
            <th>项目</th>
            <th>活动时间</th>
            <th>活动渠道</th>
            <th>活动预算</th>
            <th>活动花费</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="activity in filteredActivities" :key="activity.id">
            <td>{{ activity.name }}</td>
            <td>{{ activity.customer || '未指定' }}</td>
            <td>{{ activity.project || '未指定' }}</td>
            <td>{{ formatDateRange(activity.startDate, activity.endDate) }}</td>
            <td>{{ activity.channel }}</td>
            <td>{{ activity.budget ? formatCurrency(activity.budget) : '未设置' }}</td>
            <td>{{ activity.expense ? formatCurrency(activity.expense) : '未记录' }}</td>
            <td class="action-buttons">
              <button class="view-btn" @click="viewActivityDetail(activity)">详情</button>
              <button class="edit-btn" @click="editActivity(activity)">编辑</button>
              <button class="delete-btn" @click="deleteActivity(activity)">删除</button>
            </td>
          </tr>
          <tr v-if="filteredActivities.length === 0">
            <td colspan="8" class="empty-data">暂无活动数据</td>
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
    
    <!-- 活动添加/编辑对话框 -->
    <ActivityForm 
      v-if="showAddDialog || editingActivity" 
      :activity="editingActivity"
      :isEditing="!!editingActivity"
      @close="closeDialog"
      @save="saveActivity"
    />
    
    <!-- 活动详情对话框 -->
    <ActivityDetail
      v-if="showDetailDialog"
      :activity="selectedActivity"
      @close="showDetailDialog = false"
    />
  </div>
</template>

<script>
import ActivityForm from './ActivityForm.vue';
import ActivityDetail from './ActivityDetail.vue';

export default {
  name: 'ActivityList',
  components: {
    ActivityForm,
    ActivityDetail
  },
  data() {
    return {
      searchQuery: '',
      timeFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      showAddDialog: false,
      editingActivity: null,
      showDetailDialog: false,
      selectedActivity: null,
      // 活动数据列表
      activities: [
        {
          id: 1,
          name: '618电商节促销活动',
          startDate: '2023-06-10',
          endDate: '2023-06-20',
          channel: 'Google Ads, Facebook',
          products: '夏季服装, 户外用品',
          content: '618电商促销活动，全场商品8折起，买满300元立减50元。',
          budget: 10000,
          expense: 9500,
          customer: '北京环球科技有限公司',
          project: '2023年夏季营销方案',
          sales: 85000,
          roi: 8.95,
          orderCount: 320,
          orderValue: 85000,
          conversionRate: 0.032,
          averageOrderValue: 265.63,
          userCount: 10500,
          userCost: 0.90
        },
        {
          id: 2,
          name: '开学季特惠活动',
          startDate: '2023-08-15',
          endDate: '2023-09-05',
          channel: 'Google Ads, Instagram',
          products: '学生用品, 电子产品',
          content: '开学季特惠活动，学生用品满100减20，电子产品每满1000减150。',
          budget: 8000,
          expense: 7600,
          customer: '上海教育装备有限公司',
          project: '2023年校园市场拓展计划',
          sales: 65000,
          roi: 8.55,
          orderCount: 280,
          orderValue: 65000,
          conversionRate: 0.028,
          averageOrderValue: 232.14,
          userCount: 9200,
          userCost: 0.83
        },
        {
          id: 3,
          name: '黑色星期五全球促销',
          startDate: '2023-11-24',
          endDate: '2023-11-27',
          channel: 'Google Ads, Facebook, Criteo',
          products: '电子产品, 家居用品, 服装',
          content: '黑色星期五全场最低5折起，限时抢购，数量有限。',
          budget: 15000,
          expense: 14200,
          customer: '全球电子科技集团',
          project: '2023年度全球营销活动',
          sales: 150000,
          roi: 10.56,
          orderCount: 520,
          orderValue: 150000,
          conversionRate: 0.058,
          averageOrderValue: 288.46,
          userCount: 18500,
          userCost: 0.77
        },
        {
          id: 4,
          name: '圣诞节假日促销',
          startDate: '2023-12-15',
          endDate: '2023-12-25',
          channel: 'Google Ads, Facebook, Bing',
          products: '礼品套装, 家居装饰, 冬季服装',
          content: '圣诞节特别促销，精选礼品8折起，满赠圣诞礼物。',
          budget: 12000,
          expense: 11800,
          customer: '欧美商贸有限公司',
          project: '2023年冬季节庆营销',
          sales: 125000,
          roi: 10.59,
          orderCount: 410,
          orderValue: 125000,
          conversionRate: 0.045,
          averageOrderValue: 304.88,
          userCount: 15600,
          userCost: 0.76
        },
        {
          id: 5,
          name: '春季新品发布会',
          startDate: '2024-03-10',
          endDate: '2024-03-20',
          channel: 'Google Ads, Instagram, Criteo',
          products: '春季服装, 户外用品',
          content: '2024春季新品上市，限时9折，新注册用户额外95折。',
          budget: 9000,
          expense: 8750,
          customer: '时尚服饰有限公司',
          project: '2024春季新品上市计划',
          sales: 78000,
          roi: 8.91,
          orderCount: 290,
          orderValue: 78000,
          conversionRate: 0.034,
          averageOrderValue: 268.97,
          userCount: 10800,
          userCost: 0.81
        }
      ],
      
      // 客户列表数据，用于下拉选择
      customers: [
        '北京环球科技有限公司',
        '上海教育装备有限公司',
        '全球电子科技集团',
        '欧美商贸有限公司',
        '时尚服饰有限公司',
        '数字媒体有限公司',
        '健康生活用品有限公司'
      ],
      
      // 项目列表数据，用于下拉选择
      projects: [
        '2023年夏季营销方案',
        '2023年校园市场拓展计划',
        '2023年度全球营销活动',
        '2023年冬季节庆营销',
        '2024春季新品上市计划',
        '品牌年度推广计划',
        '新产品线上市推广'
      ]
    };
  },
  computed: {
    filteredActivities() {
      let result = [...this.activities];
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(activity => 
          activity.name.toLowerCase().includes(query)
        );
      }
      
      // 活动时间过滤
      if (this.timeFilter) {
        const now = new Date();
        
        if (this.timeFilter === 'current') {
          // 进行中的活动
          result = result.filter(activity => {
            const startDate = new Date(activity.startDate);
            const endDate = new Date(activity.endDate);
            return startDate <= now && endDate >= now;
          });
        } else if (this.timeFilter === 'past') {
          // 已结束的活动
          result = result.filter(activity => {
            const endDate = new Date(activity.endDate);
            return endDate < now;
          });
        } else if (this.timeFilter === 'upcoming') {
          // 即将开始的活动
          result = result.filter(activity => {
            const startDate = new Date(activity.startDate);
            return startDate > now;
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
      let result = [...this.activities];
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(activity => 
          activity.name.toLowerCase().includes(query)
        );
      }
      
      // 活动时间过滤
      if (this.timeFilter) {
        const now = new Date();
        
        if (this.timeFilter === 'current') {
          // 进行中的活动
          result = result.filter(activity => {
            const startDate = new Date(activity.startDate);
            const endDate = new Date(activity.endDate);
            return startDate <= now && endDate >= now;
          });
        } else if (this.timeFilter === 'past') {
          // 已结束的活动
          result = result.filter(activity => {
            const endDate = new Date(activity.endDate);
            return endDate < now;
          });
        } else if (this.timeFilter === 'upcoming') {
          // 即将开始的活动
          result = result.filter(activity => {
            const startDate = new Date(activity.startDate);
            return startDate > now;
          });
        }
      }
      
      return result.length;
    },
    
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    formatCurrency(amount) {
      if (amount === undefined || amount === null) return '¥0.00';
      return `¥${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    
    formatDateRange(startDate, endDate) {
      return `${this.formatDate(startDate)} 至 ${this.formatDate(endDate)}`;
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    viewActivityDetail(activity) {
      if (!activity) return;
      this.selectedActivity = JSON.parse(JSON.stringify(activity));
      this.showDetailDialog = true;
    },
    
    editActivity(activity) {
      if (!activity) return;
      this.editingActivity = JSON.parse(JSON.stringify(activity));
      this.showAddDialog = false;
    },
    
    deleteActivity(activity) {
      if (confirm(`确定要删除活动"${activity.name}"吗？`)) {
        const index = this.activities.findIndex(item => item.id === activity.id);
        if (index !== -1) {
          this.activities.splice(index, 1);
          
          // 重新计算总页数，如果当前页没有数据了，回到上一页
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
          }
        }
      }
    },
    
    closeDialog() {
      this.showAddDialog = false;
      this.editingActivity = null;
    },
    
    saveActivity(activityData) {
      if (activityData.id) {
        // 编辑现有记录
        const index = this.activities.findIndex(activity => activity.id === activityData.id);
        if (index !== -1) {
          this.activities.splice(index, 1, activityData);
        }
      } else {
        // 创建新记录
        const newId = Math.max(0, ...this.activities.map(activity => activity.id)) + 1;
        this.activities.push({
          ...activityData,
          id: newId
        });
      }
      this.closeDialog();
    }
  }
}
</script>

<style scoped>
.activity-list {
  padding: 20px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}

.module-title {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
}

.add-button {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(25, 118, 210, 0.2);
}

.add-button:hover {
  background-color: #1565c0;
  box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
  transform: translateY(-1px);
}

.add-icon {
  font-size: 1.2rem;
  margin-right: 5px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  background-color: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-box {
  flex: 1;
  max-width: 350px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  padding-left: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>');
  background-repeat: no-repeat;
  background-position: 15px center;
  background-size: 16px;
  color: #555;
}

.search-input:focus {
  outline: none;
  border-color: #aaa;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-group label {
  margin-right: 10px;
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: white;
  min-width: 150px;
  color: #555;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #aaa;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.data-table th {
  background-color: #f5f7fa;
  padding: 14px 15px;
  text-align: left;
  color: #666;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
  font-size: 0.9rem;
}

.data-table td {
  padding: 14px 15px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  vertical-align: middle;
}

.data-table tr:hover {
  background-color: #f9fafb;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.view-btn, .edit-btn, .delete-btn {
  padding: 5px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s, transform 0.1s;
  white-space: nowrap;
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

.view-btn:hover, .edit-btn:hover, .delete-btn:hover {
  transform: translateY(-1px);
}

.view-btn:active, .edit-btn:active, .delete-btn:active {
  transform: translateY(0);
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
  margin-top: 30px;
}

.page-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 5px;
}

.page-button:hover:not(:disabled) {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 15px;
  font-size: 0.9rem;
  color: #666;
  background-color: #f9fafb;
  padding: 8px 16px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
</style> 