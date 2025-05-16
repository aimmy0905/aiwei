<template>
  <div class="activity-data">
    <h2 class="module-title">活动数据</h2>
    
    <div class="activity-cards">
      <div 
        v-for="(activity, index) in activities" 
        :key="index"
        class="activity-card"
      >
        <div class="activity-header">
          <h3 class="activity-name">{{ activity.name }}</h3>
          <div class="activity-time">{{ formatDateRange(activity.timeRange) }}</div>
        </div>
        
        <div class="activity-content">
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-label">活动销售额</div>
              <div class="metric-value">¥{{ formatNumber(activity.sales) }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">广告成本</div>
              <div class="metric-value">¥{{ formatNumber(activity.cost) }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">整站ROI</div>
              <div class="metric-value">{{ activity.roi }}%</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">订单数</div>
              <div class="metric-value">{{ formatNumber(activity.orders) }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">订单价值</div>
              <div class="metric-value">¥{{ formatNumber(activity.orderValue) }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">转化率</div>
              <div class="metric-value">{{ activity.conversionRate }}%</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">客单价</div>
              <div class="metric-value">¥{{ formatNumber(activity.averageOrderValue) }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">用户数</div>
              <div class="metric-value">{{ formatNumber(activity.users) }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">用户成本</div>
              <div class="metric-value">¥{{ formatNumber(activity.userCost) }}</div>
            </div>
          </div>
          
          <div class="activity-details">
            <div class="detail-item">
              <span class="detail-label">渠道:</span>
              <span class="detail-value">{{ activity.channels }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">商品:</span>
              <span class="detail-value">{{ activity.products }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">活动内容:</span>
              <span class="detail-value">{{ activity.content }}</span>
            </div>
          </div>
        </div>
        
        <div class="activity-footer">
          <button class="view-details-btn" @click="viewActivityDetails(activity)">查看活动详情</button>
        </div>
      </div>
    </div>
    
    <div class="activity-summary">
      <h3 class="summary-title">活动数据小结</h3>
      <div class="summary-content">
        <p>"618电商大促"表现最佳，ROI达340%，建议在下次类似活动中增加预算投入。</p>
        <p>"新品上线推广"活动获客成本较高，但用户质量较好，客单价达300元，建议针对此类用户进行精准再营销。</p>
      </div>
      <div class="summary-actions">
        <button class="edit-summary-btn">编辑小结</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityData',
  props: {
    activities: {
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
    },
    
    viewActivityDetails(activity) {
      // 发送事件通知父组件打开活动详情页面
      this.$emit('view-activity-details', activity);
    }
  }
}
</script>

<style scoped>
.activity-data {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  padding: 20px;
}

.module-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
}

.activity-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.activity-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.activity-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.activity-header {
  padding: 15px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
}

.activity-name {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.activity-time {
  font-size: 0.85rem;
  color: #777;
}

.activity-content {
  padding: 15px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 15px;
}

.metric-item {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 3px;
}

.metric-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
}

.activity-details {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.detail-item {
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;
  font-size: 0.9rem;
}

.detail-label {
  color: #777;
  min-width: 70px;
}

.detail-value {
  color: #333;
}

.activity-footer {
  padding: 10px 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
  text-align: right;
}

.view-details-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-details-btn:hover {
  background-color: #1565c0;
}

.activity-summary {
  background-color: #f5f7fa;
  border-radius: 6px;
  padding: 15px;
  margin-top: 20px;
}

.summary-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.summary-content {
  color: #555;
  font-size: 0.95rem;
  line-height: 1.6;
}

.summary-content p {
  margin-top: 0;
  margin-bottom: 10px;
}

.summary-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.edit-summary-btn {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #666;
  font-size: 0.9rem;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-summary-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style> 