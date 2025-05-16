<template>
  <div class="activity-detail">
    <div class="back-nav">
      <button class="back-btn" @click="$emit('back-to-dashboard')">
        <span class="back-icon">←</span> 返回
      </button>
    </div>
    
    <div class="detail-header">
      <h2 class="detail-title">{{ activity.name }}</h2>
      <div class="detail-time">{{ formatDateRange(activity.timeRange) }}</div>
    </div>
    
    <div class="detail-content">
      <div class="detail-section">
        <h3 class="section-title">活动概览</h3>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon sales-icon">📈</div>
            <div class="metric-details">
              <div class="metric-value">¥{{ formatNumber(activity.sales) }}</div>
              <div class="metric-label">活动销售额</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon cost-icon">💰</div>
            <div class="metric-details">
              <div class="metric-value">¥{{ formatNumber(activity.cost) }}</div>
              <div class="metric-label">广告成本</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon roi-icon">📊</div>
            <div class="metric-details">
              <div class="metric-value">{{ activity.roi }}%</div>
              <div class="metric-label">整站ROI</div>
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-icon orders-icon">🛒</div>
            <div class="metric-details">
              <div class="metric-value">{{ formatNumber(activity.orders) }}</div>
              <div class="metric-label">订单数</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3 class="section-title">活动指标</h3>
        <div class="metrics-table">
          <div class="table-row header">
            <div class="table-cell">指标名称</div>
            <div class="table-cell">数值</div>
            <div class="table-cell">同比</div>
            <div class="table-cell">环比</div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">客单价</div>
            <div class="table-cell">¥{{ formatNumber(activity.averageOrderValue) }}</div>
            <div class="table-cell positive">+5.2%</div>
            <div class="table-cell positive">+2.1%</div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">转化率</div>
            <div class="table-cell">{{ activity.conversionRate }}%</div>
            <div class="table-cell positive">+0.8%</div>
            <div class="table-cell positive">+0.3%</div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">用户成本</div>
            <div class="table-cell">¥{{ formatNumber(activity.userCost) }}</div>
            <div class="table-cell negative">-3.5%</div>
            <div class="table-cell negative">-1.2%</div>
          </div>
          
          <div class="table-row">
            <div class="table-cell">订单价值</div>
            <div class="table-cell">¥{{ formatNumber(activity.orderValue) }}</div>
            <div class="table-cell positive">+4.7%</div>
            <div class="table-cell positive">+1.9%</div>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3 class="section-title">活动详情</h3>
        <div class="info-grid">
          <div class="info-group">
            <div class="info-label">活动时间</div>
            <div class="info-value">{{ formatDateRange(activity.timeRange) }}</div>
          </div>
          
          <div class="info-group">
            <div class="info-label">投放渠道</div>
            <div class="info-value">{{ activity.channels }}</div>
          </div>
          
          <div class="info-group">
            <div class="info-label">推广商品</div>
            <div class="info-value">{{ activity.products }}</div>
          </div>
          
          <div class="info-group">
            <div class="info-label">投放人群</div>
            <div class="info-value">{{ activity.audience || '全部用户' }}</div>
          </div>
          
          <div class="info-group">
            <div class="info-label">定向方式</div>
            <div class="info-value">{{ activity.targeting || '兴趣定向、行为定向' }}</div>
          </div>
          
          <div class="info-group">
            <div class="info-label">活动创意</div>
            <div class="info-value">{{ activity.creative || '618年中大促，全场满减' }}</div>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3 class="section-title">活动内容</h3>
        <div class="content-box">
          <p>{{ activity.content }}</p>
          <div class="content-image" v-if="activity.image">
            <img :src="activity.image" alt="活动图片">
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3 class="section-title">热销产品排名</h3>
        <div class="product-ranking-table">
          <div class="table-row header">
            <div class="table-cell ranking">排名</div>
            <div class="table-cell image">图片</div>
            <div class="table-cell name">产品名称</div>
            <div class="table-cell category">分类</div>
            <div class="table-cell sales">销售额</div>
            <div class="table-cell orders">订单数</div>
            <div class="table-cell price">单价</div>
            <div class="table-cell status">库存状态</div>
          </div>
          
          <div 
            v-for="(product, index) in productRankings.slice(0, 10)" 
            :key="product.id"
            class="table-row"
          >
            <div class="table-cell ranking">
              <div class="rank-badge" :class="{'top-rank': index < 3}">{{ index + 1 }}</div>
            </div>
            <div class="table-cell image">
              <img :src="product.image" alt="产品图片" class="product-thumbnail">
            </div>
            <div class="table-cell name">{{ product.name }}</div>
            <div class="table-cell category">{{ product.category }}</div>
            <div class="table-cell sales">¥{{ formatNumber(product.sales) }}</div>
            <div class="table-cell orders">{{ formatNumber(product.orders) }}</div>
            <div class="table-cell price">¥{{ formatNumber(product.unitPrice) }}</div>
            <div class="table-cell status">
              <span :class="product.outOfStock ? 'out-of-stock' : 'in-stock'">
                {{ product.outOfStock ? '缺货' : '有货' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3 class="section-title">活动分析与建议</h3>
        <div class="analysis-box">
          <p>{{ activity.analysis || '根据活动数据分析，该活动整体表现良好，ROI达到了目标水平。' }}</p>
          <p>{{ activity.suggestion || '建议在下次类似活动中，增加在表现良好的渠道的预算投入，同时优化落地页体验，提高转化率。' }}</p>
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
    },
    productRankings: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    formatDateRange(range) {
      if (!range) return '';
      return `${range.start} 至 ${range.end}`;
    }
  }
}
</script>

<style scoped>
.activity-detail {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  padding: 20px;
}

.back-nav {
  margin-bottom: 20px;
}

.back-btn {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 5px 0;
}

.back-icon {
  margin-right: 5px;
  font-size: 1.2rem;
}

.detail-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.detail-title {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  color: #333;
}

.detail-time {
  color: #666;
  font-size: 0.95rem;
}

.detail-section {
  margin-bottom: 30px;
}

.section-title {
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
  border-left: 4px solid #1976d2;
  padding-left: 10px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.metric-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.metric-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.metric-icon {
  font-size: 2rem;
  margin-right: 15px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.sales-icon {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

.cost-icon {
  background-color: rgba(245, 124, 0, 0.1);
  color: #f57c00;
}

.roi-icon {
  background-color: rgba(56, 142, 60, 0.1);
  color: #388e3c;
}

.orders-icon {
  background-color: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

.metric-details {
  flex: 1;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.metric-label {
  font-size: 0.9rem;
  color: #666;
}

.metrics-table {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid #eee;
}

.table-row.header {
  background-color: #f5f7fa;
  font-weight: 500;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 12px 15px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}

.positive {
  color: #4caf50;
}

.negative {
  color: #f44336;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.info-group {
  margin-bottom: 15px;
}

.info-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.info-value {
  font-size: 1rem;
  color: #333;
}

.content-box, .analysis-box {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  line-height: 1.6;
}

.content-image {
  margin-top: 15px;
}

.content-image img {
  max-width: 100%;
  border-radius: 4px;
}

.analysis-box p {
  margin: 0 0 10px 0;
}

.analysis-box p:last-child {
  margin-bottom: 0;
}

/* 热销产品排名相关样式 */
.product-ranking-table {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  font-size: 0.9rem;
}

.product-ranking-table .table-row {
  display: grid;
  grid-template-columns: 0.5fr 0.8fr 2fr 1fr 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid #eee;
}

.product-ranking-table .table-row:hover {
  background-color: #f9f9f9;
}

.product-thumbnail {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: #e0e0e0;
  color: #333;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.8rem;
}

.rank-badge.top-rank {
  background-color: #ffc107;
  color: #333;
}

.rank-badge:first-child {
  background-color: #f44336;
  color: white;
}

.rank-badge:nth-child(2) {
  background-color: #ff9800;
  color: white;
}

.rank-badge:nth-child(3) {
  background-color: #ffc107;
  color: #333;
}

.out-of-stock {
  color: #f44336;
  font-weight: 500;
}

.in-stock {
  color: #4caf50;
  font-weight: 500;
}
</style> 