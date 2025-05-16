<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>活动详情</h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="detail-container">
          <div class="detail-section">
            <h4 class="section-title">基本信息</h4>
            <div class="detail-item">
              <div class="detail-label">活动名称:</div>
              <div class="detail-value">{{ activity?.name || '暂无数据' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">所属客户:</div>
              <div class="detail-value">{{ activity?.customer || '未指定' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">关联项目:</div>
              <div class="detail-value">{{ activity?.project || '未指定' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动时间:</div>
              <div class="detail-value">{{ formatDateRange(activity?.startDate, activity?.endDate) }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动渠道:</div>
              <div class="detail-value">{{ activity?.channel || '暂无数据' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动预算:</div>
              <div class="detail-value">{{ activity?.budget ? formatCurrency(activity.budget) : '未设置' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动花费:</div>
              <div class="detail-value">{{ activity?.expense ? formatCurrency(activity.expense) : '未记录' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动商品:</div>
              <div class="detail-value">{{ activity?.products || '暂无数据' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动内容:</div>
              <div class="detail-value content">{{ activity?.content || '暂无数据' }}</div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4 class="section-title">活动数据</h4>
            <div class="detail-item">
              <div class="detail-label">活动销售额:</div>
              <div class="detail-value">{{ activity?.sales ? formatCurrency(activity.sales) : '暂无数据' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">整站ROI:</div>
              <div class="detail-value">{{ activity?.roi ? activity.roi.toFixed(2) : '暂无数据' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动订单数:</div>
              <div class="detail-value">{{ activity?.orderCount || '暂无数据' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动订单价值:</div>
              <div class="detail-value">{{ activity?.orderValue ? formatCurrency(activity.orderValue) : '暂无数据' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动转化率:</div>
              <div class="detail-value">{{ activity?.conversionRate ? (activity.conversionRate * 100).toFixed(2) + '%' : '暂无数据' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动客单价:</div>
              <div class="detail-value">{{ activity?.averageOrderValue ? formatCurrency(activity.averageOrderValue) : '暂无数据' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动用户数:</div>
              <div class="detail-value">{{ activity?.userCount || '暂无数据' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">活动用户成本:</div>
              <div class="detail-value">{{ activity?.userCost ? formatCurrency(activity.userCost) : '暂无数据' }}</div>
            </div>
          </div>
          
          <!-- 添加销量前10产品列表 -->
          <div class="detail-section">
            <h4 class="section-title">销量前10产品</h4>
            <div class="products-table-container">
              <table class="products-table">
                <thead>
                  <tr>
                    <th>产品图片</th>
                    <th>产品名称</th>
                    <th>产品分类</th>
                    <th>产品编号</th>
                    <th>销量</th>
                    <th>销售金额</th>
                    <th>单价</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in topProducts" :key="product.id">
                    <td>
                      <div class="product-image">
                        <img :src="product.image" :alt="product.name">
                      </div>
                    </td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.category }}</td>
                    <td>{{ product.sku }}</td>
                    <td>{{ product.salesCount }}</td>
                    <td>{{ formatCurrency(product.salesAmount) }}</td>
                    <td>{{ formatCurrency(product.price) }}</td>
                  </tr>
                  <tr v-if="topProducts.length === 0">
                    <td colspan="7" class="empty-data">暂无产品数据</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="edit-button" @click="editActivity">编辑活动</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityDetail',
  props: {
    activity: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 示例数据：销量前10的产品
      topProducts: [
        {
          id: 1,
          name: '夏季休闲T恤',
          category: '服装',
          sku: 'T2023-001',
          image: 'https://via.placeholder.com/60',
          salesCount: 156,
          salesAmount: 15600,
          price: 100
        },
        {
          id: 2,
          name: '户外防晒衣',
          category: '服装',
          sku: 'C2023-002',
          image: 'https://via.placeholder.com/60',
          salesCount: 132,
          salesAmount: 13200,
          price: 100
        },
        {
          id: 3,
          name: '轻便运动鞋',
          category: '鞋类',
          sku: 'S2023-003',
          image: 'https://via.placeholder.com/60',
          salesCount: 98,
          salesAmount: 13720,
          price: 140
        },
        {
          id: 4,
          name: '防水双肩包',
          category: '配件',
          sku: 'B2023-004',
          image: 'https://via.placeholder.com/60',
          salesCount: 87,
          salesAmount: 13050,
          price: 150
        },
        {
          id: 5,
          name: '户外遮阳帽',
          category: '配件',
          sku: 'H2023-005',
          image: 'https://via.placeholder.com/60',
          salesCount: 76,
          salesAmount: 3800,
          price: 50
        },
        {
          id: 6,
          name: '运动短裤',
          category: '服装',
          sku: 'P2023-006',
          image: 'https://via.placeholder.com/60',
          salesCount: 68,
          salesAmount: 4760,
          price: 70
        },
        {
          id: 7,
          name: '速干登山裤',
          category: '服装',
          sku: 'P2023-007',
          image: 'https://via.placeholder.com/60',
          salesCount: 65,
          salesAmount: 6500,
          price: 100
        },
        {
          id: 8,
          name: '防紫外线墨镜',
          category: '配件',
          sku: 'G2023-008',
          image: 'https://via.placeholder.com/60',
          salesCount: 59,
          salesAmount: 5900,
          price: 100
        },
        {
          id: 9,
          name: '户外保温杯',
          category: '配件',
          sku: 'C2023-009',
          image: 'https://via.placeholder.com/60',
          salesCount: 45,
          salesAmount: 3600,
          price: 80
        },
        {
          id: 10,
          name: '速干毛巾',
          category: '配件',
          sku: 'T2023-010',
          image: 'https://via.placeholder.com/60',
          salesCount: 42,
          salesAmount: 1260,
          price: 30
        }
      ]
    };
  },
  methods: {
    formatDateRange(startDate, endDate) {
      if (!startDate || !endDate) return '暂无数据';
      return `${this.formatDate(startDate)} 至 ${this.formatDate(endDate)}`;
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (e) {
        return '';
      }
    },
    
    formatCurrency(amount) {
      if (amount === undefined || amount === null) return '¥0.00';
      return `¥${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    
    editActivity() {
      this.$emit('close');
      // 安全地调用父组件的editActivity方法
      if (this.$parent && typeof this.$parent.editActivity === 'function') {
        this.$parent.editActivity(this.activity);
      }
    }
  }
};
</script>

<style scoped>
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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
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

.detail-container {
  margin-bottom: 20px;
}

.detail-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.1rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.detail-item {
  display: flex;
  margin-bottom: 10px;
}

.detail-label {
  flex: 0 0 100px;
  font-weight: 500;
  color: #666;
}

.detail-value {
  flex: 1;
  color: #333;
}

.detail-value.content {
  white-space: pre-line;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
}

.edit-button {
  padding: 8px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #43a047;
}

.products-table-container {
  margin-top: 15px;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background-color: white;
  font-size: 0.9rem;
}

.products-table th {
  background-color: #f5f7fa;
  padding: 12px 15px;
  text-align: left;
  color: #666;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
}

.products-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  vertical-align: middle;
}

.products-table tr:last-child td {
  border-bottom: none;
}

.products-table tr:hover {
  background-color: #f9fafb;
}

.product-image {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.empty-data {
  text-align: center;
  color: #888;
  padding: 20px 0;
}
</style> 