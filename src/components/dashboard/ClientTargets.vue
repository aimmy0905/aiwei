<template>
  <div class="client-targets">
    <h2 class="module-title">
      <span>客户目标数据</span>
      <span v-if="clientName !== '全部客户'" class="client-name">{{ clientName }}</span>
      <span v-if="projectName !== '全部项目'" class="project-name">- {{ projectName }}</span>
    </h2>
    
    <div class="targets-container">
      <!-- 销售目标 -->
      <div class="target-card">
        <div class="target-title">
          <h3>销售目标</h3>
          <button class="view-details-btn">查看明细</button>
        </div>
        
        <div class="target-content">
          <div class="progress-circle-container">
            <div class="progress-circle">
              <svg viewBox="0 0 36 36" class="progress-circle-svg">
                <path class="progress-circle-bg"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path class="progress-circle-fill"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  :stroke-dasharray="`${clientTargets.sales.progress}, 100`"
                />
                <text x="18" y="20.35" class="progress-circle-text">{{ clientTargets.sales.progress }}%</text>
              </svg>
            </div>
          </div>
          
          <div class="target-details">
            <div class="target-item">
              <span class="label">目标</span>
              <span class="value">¥{{ formatNumber(clientTargets.sales.target) }}</span>
            </div>
            <div class="target-item">
              <span class="label">当前</span>
              <span class="value">¥{{ formatNumber(clientTargets.sales.current) }}</span>
            </div>
            <div class="target-item">
              <span class="label">差额</span>
              <span class="value">¥{{ formatNumber(clientTargets.sales.target - clientTargets.sales.current) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 利润目标 -->
      <div class="target-card">
        <div class="target-title">
          <h3>利润目标</h3>
          <button class="view-details-btn">查看明细</button>
        </div>
        
        <div class="target-content">
          <div class="progress-circle-container">
            <div class="progress-circle">
              <svg viewBox="0 0 36 36" class="progress-circle-svg">
                <path class="progress-circle-bg"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path class="progress-circle-fill"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  :stroke-dasharray="`${clientTargets.profit.progress}, 100`"
                />
                <text x="18" y="20.35" class="progress-circle-text">{{ clientTargets.profit.progress }}%</text>
              </svg>
            </div>
          </div>
          
          <div class="target-details">
            <div class="target-item">
              <span class="label">目标</span>
              <span class="value">¥{{ formatNumber(clientTargets.profit.target) }}</span>
            </div>
            <div class="target-item">
              <span class="label">当前</span>
              <span class="value">¥{{ formatNumber(clientTargets.profit.current) }}</span>
            </div>
            <div class="target-item">
              <span class="label">差额</span>
              <span class="value">¥{{ formatNumber(clientTargets.profit.target - clientTargets.profit.current) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- ROI目标 -->
      <div class="target-card">
        <div class="target-title">
          <h3>ROI目标</h3>
          <button class="view-details-btn">查看明细</button>
        </div>
        
        <div class="target-content">
          <div class="progress-circle-container">
            <div class="progress-circle">
              <svg viewBox="0 0 36 36" class="progress-circle-svg">
                <path class="progress-circle-bg"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path class="progress-circle-fill"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  :stroke-dasharray="`${clientTargets.roi.progress}, 100`"
                />
                <text x="18" y="20.35" class="progress-circle-text">{{ clientTargets.roi.progress }}%</text>
              </svg>
            </div>
          </div>
          
          <div class="target-details">
            <div class="target-item">
              <span class="label">目标</span>
              <span class="value">{{ clientTargets.roi.target }}%</span>
            </div>
            <div class="target-item">
              <span class="label">当前</span>
              <span class="value">{{ clientTargets.roi.current }}%</span>
            </div>
            <div class="target-item">
              <span class="label">差额</span>
              <span class="value">{{ clientTargets.roi.target - clientTargets.roi.current }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 成本目标 -->
      <div class="target-card">
        <div class="target-title">
          <h3>成本目标</h3>
          <button class="view-details-btn">查看明细</button>
        </div>
        
        <div class="target-content">
          <div class="progress-circle-container">
            <div class="progress-circle">
              <svg viewBox="0 0 36 36" class="progress-circle-svg">
                <path class="progress-circle-bg"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path class="progress-circle-fill"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  :stroke-dasharray="`${clientTargets.cost.progress}, 100`"
                />
                <text x="18" y="20.35" class="progress-circle-text">{{ clientTargets.cost.progress }}%</text>
              </svg>
            </div>
          </div>
          
          <div class="target-details">
            <div class="target-item">
              <span class="label">目标</span>
              <span class="value">¥{{ formatNumber(clientTargets.cost.target) }}</span>
            </div>
            <div class="target-item">
              <span class="label">当前</span>
              <span class="value">¥{{ formatNumber(clientTargets.cost.current) }}</span>
            </div>
            <div class="target-item">
              <span class="label">差额</span>
              <span class="value">¥{{ formatNumber(clientTargets.cost.target - clientTargets.cost.current) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 用户数目标 -->
      <div class="target-card">
        <div class="target-title">
          <h3>用户数目标</h3>
          <button class="view-details-btn">查看明细</button>
        </div>
        
        <div class="target-content">
          <div class="progress-circle-container">
            <div class="progress-circle">
              <svg viewBox="0 0 36 36" class="progress-circle-svg">
                <path class="progress-circle-bg"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path class="progress-circle-fill"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  :stroke-dasharray="`${clientTargets.users.progress}, 100`"
                />
                <text x="18" y="20.35" class="progress-circle-text">{{ clientTargets.users.progress }}%</text>
              </svg>
            </div>
          </div>
          
          <div class="target-details">
            <div class="target-item">
              <span class="label">目标</span>
              <span class="value">{{ formatNumber(clientTargets.users.target) }}</span>
            </div>
            <div class="target-item">
              <span class="label">当前</span>
              <span class="value">{{ formatNumber(clientTargets.users.current) }}</span>
            </div>
            <div class="target-item">
              <span class="label">差额</span>
              <span class="value">{{ formatNumber(clientTargets.users.target - clientTargets.users.current) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="target-summary">
      <h3 class="summary-title">目标小结</h3>
      <div class="summary-content">
        <p>本期销售目标完成度为65%，与上期同比提升5.2%。利润目标完成度为74.67%，主要得益于产品线优化。ROI目标完成度为89.14%，建议进一步优化广告投放策略以提高ROI。</p>
        <p>根据当前趋势，预计在月底可以达成销售和用户数目标，但成本控制仍需加强以保证利润目标的达成。</p>
      </div>
      <div class="summary-actions">
        <button class="edit-summary-btn">编辑小结</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientTargets',
  props: {
    clientTargets: {
      type: Object,
      required: true
    },
    clientName: {
      type: String,
      default: '全部客户'
    },
    projectName: {
      type: String,
      default: '全部项目'
    }
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
}
</script>

<style scoped>
.client-targets {
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
  display: flex;
  align-items: center;
}

.client-name {
  margin-left: 10px;
  font-size: 1rem;
  color: #1976d2;
  font-weight: normal;
}

.project-name {
  margin-left: 5px;
  font-size: 1rem;
  color: #666;
  font-weight: normal;
}

.targets-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.target-card {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s;
}

.target-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.target-title {
  padding: 12px 15px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.target-title h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.view-details-btn {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
}

.view-details-btn:hover {
  text-decoration: underline;
}

.target-content {
  padding: 15px;
}

.progress-circle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.progress-circle {
  width: 100px;
  height: 100px;
}

.progress-circle-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 2.8;
}

.progress-circle-fill {
  fill: none;
  stroke: #1976d2;
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-dasharray: 0, 100;
  transition: stroke-dasharray 0.6s ease;
}

.progress-circle-text {
  fill: #333;
  font-size: 0.5rem;
  text-anchor: middle;
  dominant-baseline: middle;
  font-weight: 500;
}

.target-details {
  margin-top: 15px;
}

.target-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.target-item .label {
  color: #666;
}

.target-item .value {
  font-weight: 500;
  color: #333;
}

.target-summary {
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