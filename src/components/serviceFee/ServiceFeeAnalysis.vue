<template>
  <div class="service-fee-analysis">
    <div class="module-header">
      <h2 class="module-title">服务费用分析</h2>
      <div class="time-filter">
        <button class="time-button" :class="{ active: timeRange === 'month' }" @click="timeRange = 'month'">月度</button>
        <button class="time-button" :class="{ active: timeRange === 'quarter' }" @click="timeRange = 'quarter'">季度</button>
        <button class="time-button" :class="{ active: timeRange === 'year' }" @click="timeRange = 'year'">年度</button>
      </div>
    </div>
    
    <div class="analysis-grid">
      <!-- 趋势图区域 -->
      <div class="chart-card">
        <h3 class="chart-title">服务费收入趋势</h3>
        <div class="chart-container">
          <div class="trend-bar-chart">
            <div v-for="(item, index) in getTrendData()" :key="'trend-'+index" class="trend-bar-item">
              <div class="trend-bar-label">{{ item.label }}</div>
              <div class="trend-bar-container">
                <div class="trend-bar" :style="{ width: (item.value / getMaxTrendValue() * 100) + '%' }">
                  <span class="trend-bar-value">¥{{ formatNumber(item.value) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 客户分布图 -->
      <div class="chart-card">
        <h3 class="chart-title">客户服务费分布</h3>
        <div class="chart-container">
          <div class="donut-chart-container">
            <div class="donut-chart">
              <div class="donut-segment" style="--percentage: 35; --color: #4e79a7; --rotation: 0;"></div>
              <div class="donut-segment" style="--percentage: 25; --color: #f28e2c; --rotation: 126;"></div>
              <div class="donut-segment" style="--percentage: 20; --color: #e15759; --rotation: 216;"></div>
              <div class="donut-segment" style="--percentage: 12; --color: #76b7b2; --rotation: 288;"></div>
              <div class="donut-segment" style="--percentage: 8; --color: #59a14f; --rotation: 331.2;"></div>
              <div class="donut-hole"></div>
            </div>
            <div class="donut-legend">
              <div class="legend-item">
                <div class="color-box" style="background-color: #4e79a7;"></div>
                <div class="legend-label">上海某科技有限公司 (35%)</div>
              </div>
              <div class="legend-item">
                <div class="color-box" style="background-color: #f28e2c;"></div>
                <div class="legend-label">北京某贸易有限公司 (25%)</div>
              </div>
              <div class="legend-item">
                <div class="color-box" style="background-color: #e15759;"></div>
                <div class="legend-label">广州某电子商务有限公司 (20%)</div>
              </div>
              <div class="legend-item">
                <div class="color-box" style="background-color: #76b7b2;"></div>
                <div class="legend-label">深圳某网络科技有限公司 (12%)</div>
              </div>
              <div class="legend-item">
                <div class="color-box" style="background-color: #59a14f;"></div>
                <div class="legend-label">杭州某文化传媒有限公司 (8%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 续费率统计 -->
      <div class="chart-card">
        <h3 class="chart-title">续费率统计</h3>
        <div class="chart-container">
          <div class="stats-container">
            <div class="stat-item">
              <div class="stat-label">平均续费率</div>
              <div class="stat-value">85%</div>
              <div class="stat-trend up">↑ 3.5%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">平均续费时长</div>
              <div class="stat-value">5.2个月</div>
              <div class="stat-trend up">↑ 0.8</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">平均续费金额</div>
              <div class="stat-value">¥16,600</div>
              <div class="stat-trend up">↑ 12.4%</div>
            </div>
          </div>
          <div class="renewal-chart">
            <div class="renewal-bar">
              <div class="renewal-segment" style="width: 65%;">续费<span>65%</span></div>
              <div class="renewal-segment upgrade" style="width: 20%;">升级<span>20%</span></div>
              <div class="renewal-segment lost" style="width: 15%;">流失<span>15%</span></div>
            </div>
            <div class="renewal-labels">
              <div class="renewal-label" style="width: 65%;">续费</div>
              <div class="renewal-label" style="width: 20%;">升级</div>
              <div class="renewal-label" style="width: 15%;">流失</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 服务项目分布 -->
      <div class="chart-card">
        <h3 class="chart-title">服务项目分布</h3>
        <div class="chart-container">
          <div class="project-distribution">
            <div class="project-item">
              <div class="project-name">电商广告投放项目</div>
              <div class="project-bar-container">
                <div class="project-bar" style="width: 45%;">
                  <span>45%</span>
                </div>
              </div>
              <div class="project-value">¥37,350</div>
            </div>
            <div class="project-item">
              <div class="project-name">品牌推广项目</div>
              <div class="project-bar-container">
                <div class="project-bar" style="width: 22%;">
                  <span>22%</span>
                </div>
              </div>
              <div class="project-value">¥18,260</div>
            </div>
            <div class="project-item">
              <div class="project-name">新品上市推广</div>
              <div class="project-bar-container">
                <div class="project-bar" style="width: 18%;">
                  <span>18%</span>
                </div>
              </div>
              <div class="project-value">¥14,940</div>
            </div>
            <div class="project-item">
              <div class="project-name">海外市场拓展</div>
              <div class="project-bar-container">
                <div class="project-bar" style="width: 9%;">
                  <span>9%</span>
                </div>
              </div>
              <div class="project-value">¥7,470</div>
            </div>
            <div class="project-item">
              <div class="project-name">节日营销活动</div>
              <div class="project-bar-container">
                <div class="project-bar" style="width: 6%;">
                  <span>6%</span>
                </div>
              </div>
              <div class="project-value">¥4,980</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceFeeAnalysis',
  data() {
    return {
      timeRange: 'quarter', // month, quarter, year
      
      // 趋势数据
      monthlyTrend: [
        { label: '1月', value: 75000 },
        { label: '2月', value: 68000 },
        { label: '3月', value: 82000 },
        { label: '4月', value: 79000 },
        { label: '5月', value: 83000 },
        { label: '6月', value: 88000 }
      ],
      quarterlyTrend: [
        { label: 'Q1 2022', value: 180000 },
        { label: 'Q2 2022', value: 210000 },
        { label: 'Q3 2022', value: 195000 },
        { label: 'Q4 2022', value: 225000 },
        { label: 'Q1 2023', value: 240000 },
        { label: 'Q2 2023', value: 250000 }
      ],
      yearlyTrend: [
        { label: '2018', value: 680000 },
        { label: '2019', value: 720000 },
        { label: '2020', value: 650000 },
        { label: '2021', value: 750000 },
        { label: '2022', value: 810000 },
        { label: '2023', value: 920000 }
      ]
    };
  },
  methods: {
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    getTrendData() {
      switch(this.timeRange) {
        case 'month':
          return this.monthlyTrend;
        case 'quarter':
          return this.quarterlyTrend;
        case 'year':
          return this.yearlyTrend;
        default:
          return this.monthlyTrend;
      }
    },
    
    getMaxTrendValue() {
      const data = this.getTrendData();
      if (data.length === 0) return 1; // 防止除以0
      
      return Math.max(...data.map(item => item.value));
    }
  }
};
</script>

<style scoped>
.service-fee-analysis {
  margin-bottom: 20px;
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

.time-filter {
  display: flex;
  gap: 10px;
}

.time-button {
  padding: 6px 12px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.time-button.active {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}

.chart-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.chart-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.chart-container {
  height: 250px;
  overflow: hidden;
}

/* 趋势图样式 */
.trend-bar-chart {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  justify-content: space-between;
}

.trend-bar-item {
  display: flex;
  align-items: center;
}

.trend-bar-label {
  width: 70px;
  font-size: 0.9rem;
  color: #666;
}

.trend-bar-container {
  flex: 1;
  height: 25px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.trend-bar {
  height: 100%;
  background-color: #1976d2;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: white;
  font-size: 0.85rem;
  transition: width 0.5s;
}

.trend-bar-value {
  white-space: nowrap;
}

/* 环形图样式 */
.donut-chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
}

.donut-chart {
  position: relative;
  width: 150px;
  height: 150px;
}

.donut-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: circle(50% at center);
  background: conic-gradient(
    var(--color) 0% calc(var(--percentage) * 3.6deg),
    transparent calc(var(--percentage) * 3.6deg) 360deg
  );
  transform: rotate(calc(var(--rotation) * 1deg));
}

.donut-hole {
  position: absolute;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-radius: 50%;
  background-color: white;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
}

.color-box {
  width: 12px;
  height: 12px;
  margin-right: 8px;
  border-radius: 3px;
}

.legend-label {
  font-size: 0.85rem;
  color: #666;
}

/* 续费率统计样式 */
.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 6px;
  width: 30%;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.stat-trend {
  font-size: 0.85rem;
}

.stat-trend.up {
  color: #4caf50;
}

.stat-trend.down {
  color: #f44336;
}

.renewal-chart {
  margin-top: 20px;
}

.renewal-bar {
  display: flex;
  height: 40px;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
}

.renewal-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4caf50;
  color: white;
  font-size: 0.9rem;
  position: relative;
}

.renewal-segment.upgrade {
  background-color: #2196f3;
}

.renewal-segment.lost {
  background-color: #f44336;
}

.renewal-segment span {
  font-size: 0.85rem;
  font-weight: 500;
}

.renewal-labels {
  display: flex;
  margin-top: 8px;
}

.renewal-label {
  font-size: 0.85rem;
  color: #666;
  text-align: center;
}

/* 服务项目分布样式 */
.project-distribution {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.project-item {
  display: flex;
  align-items: center;
}

.project-name {
  width: 150px;
  font-size: 0.9rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-bar-container {
  flex: 1;
  height: 25px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 15px;
}

.project-bar {
  height: 100%;
  background-color: #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
  transition: width 0.5s;
}

.project-value {
  width: 80px;
  text-align: right;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .trend-bar-label {
    width: 50px;
  }
  
  .donut-chart-container {
    flex-direction: column;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .stat-item {
    width: 100%;
  }
  
  .project-name {
    width: 120px;
  }
}
</style> 