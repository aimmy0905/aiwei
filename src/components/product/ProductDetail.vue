<template>
  <div class="product-detail">
    <div class="header">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span> 返回
      </button>
      <h1 class="title">产品详情</h1>
    </div>
    
    <div class="content">
      <div class="product-info-card">
        <div class="product-header">
          <div class="product-image-container">
            <img 
              v-if="!imageError" 
              :src="product.image" 
              :alt="product.name"
              class="product-image"
              @error="imageError = true"
            >
            <div class="image-placeholder" v-if="imageError">
              {{ getProductInitials(product.name) }}
            </div>
          </div>
          
          <div class="product-basic-info">
            <h2 class="product-name">{{ product.name }}</h2>
            <div class="product-sku">商品编号: {{ product.sku }}</div>
            <div class="product-category">分类: {{ product.category }}</div>
            <div class="product-price">
              售价: <span class="price-value">¥{{ formatNumber(product.price) }}</span>
              <span 
                class="price-change" 
                :class="{
                  'price-increase': product.priceChange > 0,
                  'price-decrease': product.priceChange < 0,
                  'price-stable': product.priceChange === 0,
                  'price-alert': Math.abs(product.priceChange) >= 10
                }"
              >
                {{ formatPriceChange(product.priceChange) }}
              </span>
            </div>
            <div class="product-stock">
              <span class="stock-label">库存状态:</span>
              <span class="stock-status" :class="{ 'status-out': product.outOfStock }">
                {{ product.outOfStock ? '缺货' : '有货' }}
              </span>
              <span v-if="product.outOfStock" class="stock-loss">
                预计损失: ¥{{ formatNumber(product.lossAmount || 0) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="product-metrics">
          <div class="metric-card">
            <div class="metric-title">总销售额</div>
            <div class="metric-value">¥{{ formatNumber(product.sales) }}</div>
            <div class="metric-trend">
              <span class="trend-value positive">+5.2%</span> 较上月
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-title">订单数</div>
            <div class="metric-value">{{ formatNumber(product.orders) }}</div>
            <div class="metric-trend">
              <span class="trend-value positive">+3.8%</span> 较上月
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-title">客单价</div>
            <div class="metric-value">¥{{ formatNumber(product.unitPrice) }}</div>
            <div class="metric-trend">
              <span class="trend-value positive">+1.2%</span> 较上月
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-title">转化率</div>
            <div class="metric-value">{{ (product.conversionRate || 2.5).toFixed(1) }}%</div>
            <div class="metric-trend">
              <span class="trend-value negative">-0.3%</span> 较上月
            </div>
          </div>
        </div>
      </div>
      
      <div class="sales-trend-card">
        <h3 class="section-title">销售趋势</h3>
        <div class="chart-placeholder">
          <div class="chart-message">销售趋势图表加载中...</div>
        </div>
      </div>
      
      <div class="product-details-card">
        <h3 class="section-title">产品详情</h3>
        <div class="details-table">
          <div class="details-row">
            <div class="details-label">产品规格</div>
            <div class="details-value">{{ product.specifications || '标准规格' }}</div>
          </div>
          <div class="details-row">
            <div class="details-label">上架时间</div>
            <div class="details-value">{{ product.listedDate || '2023-09-15' }}</div>
          </div>
          <div class="details-row">
            <div class="details-label">供应商</div>
            <div class="details-value">{{ product.supplier || '优质供应商有限公司' }}</div>
          </div>
          <div class="details-row">
            <div class="details-label">销售区域</div>
            <div class="details-value">{{ product.salesRegion || '全球' }}</div>
          </div>
          <div class="details-row">
            <div class="details-label">配送方式</div>
            <div class="details-value">{{ product.shippingMethod || '标准配送' }}</div>
          </div>
          <div class="details-row">
            <div class="details-label">退换政策</div>
            <div class="details-value">{{ product.returnPolicy || '30天无理由退换' }}</div>
          </div>
        </div>
      </div>
      
      <div class="actions-card">
        <h3 class="section-title">操作</h3>
        <div class="action-buttons">
          <button class="action-button primary" @click="editProduct">
            编辑产品
          </button>
          <button class="action-button" :class="{ 'active': product.hasAlert }" @click="toggleAlert">
            {{ product.hasAlert ? '取消价格提醒' : '设置价格提醒' }}
          </button>
          <button class="action-button danger" @click="confirmDelete">
            删除产品
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  props: {
    productId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      product: {},
      imageError: false,
      loading: true
    }
  },
  created() {
    this.fetchProductDetails();
  },
  methods: {
    fetchProductDetails() {
      // 模拟API请求获取产品详情
      this.loading = true;
      
      // 使用mock数据，实际应用中应从API获取
      setTimeout(() => {
        // 假设这是从API返回的详细产品数据
        this.product = {
          id: 1,
          name: '高级保湿面霜',
          category: '护肤品',
          sku: 'SKU001',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiB2aWV3Qm94PSIwIDAgMTYwIDE2MCI+PHJlY3Qgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IiM4ZWM1ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+6aaW57qnPC90ZXh0Pjwvc3ZnPg==',
          price: 199,
          sales: 45000,
          orders: 120,
          unitPrice: 375,
          outOfStock: false,
          priceChange: 0,
          hasAlert: false,
          conversionRate: 2.8,
          specifications: '50ml/瓶',
          listedDate: '2023-09-01',
          supplier: '美妆科技有限公司',
          salesRegion: '亚太地区',
          shippingMethod: '标准配送',
          returnPolicy: '30天无理由退换'
        };
        
        this.loading = false;
      }, 800);
    },
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatPriceChange(change) {
      if (change === 0) return '0%';
      const sign = change > 0 ? '+' : '';
      return `${sign}${change}%`;
    },
    getProductInitials(name) {
      if (!name) return '?';
      return name.substring(0, 2);
    },
    goBack() {
      // 返回产品列表
      this.$emit('back');
    },
    editProduct() {
      alert(`编辑产品: ${this.product.name}`);
    },
    toggleAlert() {
      this.product.hasAlert = !this.product.hasAlert;
      const message = this.product.hasAlert 
        ? `已为产品 ${this.product.name} 设置价格变动提醒` 
        : `已取消产品 ${this.product.name} 的价格变动提醒`;
      alert(message);
    },
    confirmDelete() {
      if (confirm(`确定要删除产品 "${this.product.name}" 吗？此操作不可撤销。`)) {
        alert('产品已删除');
        this.goBack();
      }
    }
  }
}
</script>

<style scoped>
.product-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #1976d2;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-right: 15px;
}

.back-icon {
  margin-right: 5px;
  font-size: 18px;
}

.title {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  flex: 1;
}

.content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.product-info-card, 
.sales-trend-card, 
.product-details-card, 
.actions-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.product-header {
  display: flex;
  margin-bottom: 20px;
}

.product-image-container {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
  margin-right: 20px;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #666;
  font-size: 32px;
  font-weight: 500;
}

.product-basic-info {
  flex: 1;
}

.product-name {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 10px 0;
}

.product-sku, 
.product-category {
  color: #666;
  margin-bottom: 10px;
  font-size: 14px;
}

.product-price {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.price-value {
  font-size: 20px;
  font-weight: 500;
  color: #f44336;
  margin: 0 10px;
}

.price-change {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.price-increase {
  background-color: #e8f5e9;
  color: #4caf50;
}

.price-decrease {
  background-color: #ffebee;
  color: #f44336;
}

.price-stable {
  background-color: #f5f5f5;
  color: #757575;
}

.price-alert {
  font-weight: 700;
}

.product-stock {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.stock-label {
  color: #666;
}

.stock-status {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  background-color: #e8f5e9;
  color: #4caf50;
}

.stock-status.status-out {
  background-color: #ffebee;
  color: #f44336;
}

.stock-loss {
  font-size: 12px;
  color: #f44336;
}

.product-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.metric-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.metric-title {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.metric-trend {
  font-size: 12px;
  color: #666;
}

.trend-value {
  font-weight: 500;
}

.trend-value.positive {
  color: #4caf50;
}

.trend-value.negative {
  color: #f44336;
}

.section-title {
  font-size: 1.1rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.chart-placeholder {
  height: 300px;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-message {
  color: #666;
}

.details-table {
  width: 100%;
}

.details-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;
}

.details-row:last-child {
  border-bottom: none;
}

.details-label {
  width: 120px;
  color: #666;
  flex-shrink: 0;
}

.details-value {
  flex: 1;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-button {
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.action-button.primary {
  background-color: #1976d2;
  color: white;
  border-color: #1565c0;
}

.action-button.primary:hover {
  background-color: #1565c0;
}

.action-button.danger {
  background-color: white;
  color: #f44336;
  border-color: #ffcdd2;
}

.action-button.danger:hover {
  background-color: #ffebee;
}

.action-button.active {
  background-color: #fff8e1;
  color: #ffa000;
  border-color: #ffecb3;
}

@media (max-width: 768px) {
  .product-header {
    flex-direction: column;
  }
  
  .product-image-container {
    width: 120px;
    height: 120px;
    margin-bottom: 15px;
  }
  
  .product-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 