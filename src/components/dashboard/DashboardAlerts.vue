<template>
  <div class="dashboard-alerts">
    <h2 class="module-title">预警提醒</h2>
    <div class="alerts-container">
      <div v-if="alerts.length === 0" class="no-alerts">
        <span class="icon">✓</span>
        <p>当前没有需要处理的预警信息</p>
      </div>
      
      <div v-else class="alert-cards">
        <!-- 账户余额预警 -->
        <div 
          v-for="alert in accountAlerts" 
          :key="'account-'+alert.accountName" 
          class="alert-card"
          :class="{ 'high-urgency': alert.urgency === 'high', 'medium-urgency': alert.urgency === 'medium' }"
        >
          <div class="alert-header">
            <span class="alert-icon">💰</span>
            <span class="alert-type">账户余额预警</span>
            <button class="close-btn">×</button>
          </div>
          <div class="alert-content">
            <p class="alert-title">{{ alert.accountName }}余额不足</p>
            <div class="alert-details">
              <div class="detail-item">
                <span class="detail-label">当前余额:</span>
                <span class="detail-value">￥{{ alert.balance.toFixed(2) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">预警阈值:</span>
                <span class="detail-value">￥{{ alert.threshold.toFixed(2) }}</span>
              </div>
              <div class="detail-item" v-if="alert.balance < 100">
                <span class="detail-note">余额较低，建议尽快充值</span>
              </div>
            </div>
          </div>
          <div class="alert-footer">
            <button class="action-btn">立即充值</button>
            <button class="action-btn secondary">稍后提醒</button>
          </div>
        </div>
        
        <!-- 服务到期预警 -->
        <div 
          v-for="alert in serviceAlerts" 
          :key="'service-'+alert.clientName+alert.projectName" 
          class="alert-card"
          :class="{ 'high-urgency': alert.urgency === 'high', 'medium-urgency': alert.urgency === 'medium' }"
        >
          <div class="alert-header">
            <span class="alert-icon">⏰</span>
            <span class="alert-type">服务到期提醒</span>
            <button class="close-btn">×</button>
          </div>
          <div class="alert-content">
            <p class="alert-title">
              {{ alert.daysLeft <= 7 ? '即将到期' : '服务到期' }}：{{ alert.clientName }}
            </p>
            <div class="alert-details">
              <div class="detail-item">
                <span class="detail-label">项目名称:</span>
                <span class="detail-value">{{ alert.projectName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">到期时间:</span>
                <span class="detail-value">{{ alert.expiryDate }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">剩余天数:</span>
                <span class="detail-value">{{ alert.daysLeft }}天</span>
              </div>
            </div>
          </div>
          <div class="alert-footer">
            <button class="action-btn">续费服务</button>
            <button class="action-btn secondary">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardAlerts',
  props: {
    alerts: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    accountAlerts() {
      return this.alerts.filter(alert => alert.type === 'account');
    },
    serviceAlerts() {
      return this.alerts.filter(alert => alert.type === 'service');
    }
  }
}
</script>

<style scoped>
.dashboard-alerts {
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

.alerts-container {
  width: 100%;
}

.no-alerts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: #4caf50;
}

.no-alerts .icon {
  font-size: 2rem;
  margin-bottom: 10px;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.alert-card {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
}

.alert-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.high-urgency {
  border-left: 4px solid #f44336;
}

.medium-urgency {
  border-left: 4px solid #ff9800;
}

.alert-header {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
}

.alert-icon {
  margin-right: 8px;
  font-size: 1.1rem;
}

.alert-type {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.alert-content {
  padding: 15px;
}

.alert-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.alert-details {
  color: #666;
  font-size: 0.9rem;
}

.detail-item {
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;
}

.detail-label {
  min-width: 70px;
  color: #888;
}

.detail-value {
  font-weight: 500;
}

.detail-note {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 5px;
}

.alert-footer {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #e0e0e0;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:not(.secondary) {
  background-color: #1976d2;
  color: white;
}

.action-btn:not(.secondary):hover {
  background-color: #1565c0;
}

.action-btn.secondary {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
}

.action-btn.secondary:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style> 