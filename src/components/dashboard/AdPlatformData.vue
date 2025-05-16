<template>
  <div class="ad-platform-data">
    <h2 class="module-title">广告平台数据</h2>
    <div class="time-range">{{ formatTimeRange }}</div>
    
    <div class="platform-tabs">
      <div 
        v-for="platform in adPlatformData.platforms" 
        :key="platform"
        class="platform-tab"
        :class="{ active: selectedPlatform === platform }"
        @click="selectedPlatform = platform"
      >
        {{ platform }}
      </div>
      <div 
        class="platform-tab"
        :class="{ active: selectedPlatform === 'all' }"
        @click="selectedPlatform = 'all'"
      >
        全部平台
      </div>
    </div>
    
    <div class="metrics-grid">
      <!-- 总销售额卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">总销售额</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            ¥{{ formatNumber(getPlatformTotalSales()) }}
          </div>
          <div class="metric-detail" v-if="selectedPlatform === 'all'">
            <div class="pie-chart-container">
              <div class="horizontal-bar-chart">
                <div 
                  v-for="item in adPlatformData.totalSales.data" 
                  :key="item.platform + '-sales'"
                  class="chart-bar"
                  :style="{ width: item.percentage + '%', backgroundColor: getPlatformColor(item.platform) }"
                >
                  <span class="bar-label">{{ item.platform }}</span>
                </div>
              </div>
            </div>
            <div class="platform-details">
              <div 
                v-for="item in adPlatformData.totalSales.data" 
                :key="item.platform"
                class="platform-detail-item"
              >
                <span 
                  class="platform-color-dot"
                  :style="{ backgroundColor: getPlatformColor(item.platform) }"
                ></span>
                <span class="platform-name">{{ item.platform }}</span>
                <span class="platform-value">¥{{ formatNumber(item.value) }}</span>
                <span class="platform-percentage">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 总消费卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">总消费</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            ¥{{ formatNumber(getPlatformTotalCost()) }}
          </div>
          <div class="metric-detail" v-if="selectedPlatform === 'all'">
            <div class="pie-chart-container">
              <div class="horizontal-bar-chart">
                <div 
                  v-for="item in adPlatformData.totalCost.data" 
                  :key="item.platform + '-cost'"
                  class="chart-bar"
                  :style="{ width: item.percentage + '%', backgroundColor: getPlatformColor(item.platform) }"
                >
                  <span class="bar-label">{{ item.platform }}</span>
                </div>
              </div>
            </div>
            <div class="platform-details">
              <div 
                v-for="item in adPlatformData.totalCost.data" 
                :key="item.platform"
                class="platform-detail-item"
              >
                <span 
                  class="platform-color-dot"
                  :style="{ backgroundColor: getPlatformColor(item.platform) }"
                ></span>
                <span class="platform-name">{{ item.platform }}</span>
                <span class="platform-value">¥{{ formatNumber(item.value) }}</span>
                <span class="platform-percentage">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 转化价值卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">转化价值</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            ¥{{ formatNumber(getPlatformConversionValue()) }}
          </div>
          <div class="metric-detail" v-if="selectedPlatform === 'all'">
            <div class="bar-chart-container">
              <div class="vertical-bar-chart">
                <div 
                  v-for="item in adPlatformData.conversionValue.data" 
                  :key="item.platform + '-conv'"
                  class="chart-column-wrapper"
                >
                  <div 
                    class="chart-column"
                    :style="{ 
                      height: getPercentageHeight(item.value, getMaxValue('conversionValue')) + '%',
                      backgroundColor: getPlatformColor(item.platform)
                    }"
                  ></div>
                  <div class="column-label">{{ getShortPlatformName(item.platform) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 广告ROI卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">广告ROI</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            {{ formatNumber(getPlatformROI()) }}%
          </div>
          <div class="metric-detail" v-if="selectedPlatform === 'all'">
            <div class="bar-chart-container">
              <div class="vertical-bar-chart">
                <div 
                  v-for="item in adPlatformData.roi.data" 
                  :key="item.platform + '-roi'"
                  class="chart-column-wrapper"
                >
                  <div 
                    class="chart-column"
                    :style="{ 
                      height: getPercentageHeight(item.value, getMaxValue('roi')) + '%',
                      backgroundColor: getPlatformColor(item.platform)
                    }"
                  ></div>
                  <div class="column-label">{{ getShortPlatformName(item.platform) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 用户数卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">用户数</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            {{ formatNumber(getPlatformUsers()) }}
          </div>
          <div class="metric-detail" v-if="selectedPlatform === 'all'">
            <div class="pie-chart-container">
              <div class="horizontal-bar-chart">
                <div 
                  v-for="item in adPlatformData.users.data" 
                  :key="item.platform + '-users'"
                  class="chart-bar"
                  :style="{ width: item.percentage + '%', backgroundColor: getPlatformColor(item.platform) }"
                >
                  <span class="bar-label">{{ item.platform }}</span>
                </div>
              </div>
            </div>
            <div class="platform-details">
              <div 
                v-for="item in adPlatformData.users.data" 
                :key="item.platform"
                class="platform-detail-item"
              >
                <span 
                  class="platform-color-dot"
                  :style="{ backgroundColor: getPlatformColor(item.platform) }"
                ></span>
                <span class="platform-name">{{ item.platform }}</span>
                <span class="platform-value">{{ formatNumber(item.value) }}</span>
                <span class="platform-percentage">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 用户成本卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">用户成本</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            ¥{{ formatNumber(getPlatformUserCost()) }}
          </div>
          <div class="metric-detail" v-if="selectedPlatform === 'all'">
            <div class="bar-chart-container">
              <div class="vertical-bar-chart">
                <div 
                  v-for="item in adPlatformData.userCost.data" 
                  :key="item.platform + '-user-cost'"
                  class="chart-column-wrapper"
                >
                  <div 
                    class="chart-column"
                    :style="{ 
                      height: getPercentageHeight(item.value, getMaxValue('userCost')) + '%',
                      backgroundColor: getPlatformColor(item.platform)
                    }"
                  ></div>
                  <div class="column-label">{{ getShortPlatformName(item.platform) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 平台转化率卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">平台转化率</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            {{ formatNumber(getPlatformConversionRate()) }}%
          </div>
          <div class="metric-detail" v-if="selectedPlatform === 'all'">
            <div class="bar-chart-container">
              <div class="vertical-bar-chart">
                <div 
                  v-for="item in adPlatformData.conversionRate.data" 
                  :key="item.platform + '-rate'"
                  class="chart-column-wrapper"
                >
                  <div 
                    class="chart-column"
                    :style="{ 
                      height: getPercentageHeight(item.value, getMaxValue('conversionRate')) + '%',
                      backgroundColor: getPlatformColor(item.platform)
                    }"
                  ></div>
                  <div class="column-label">{{ getShortPlatformName(item.platform) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="ad-platform-summary">
      <h3 class="summary-title">广告数据小结</h3>
      <div class="summary-content">
        <p>Google Ads平台投放效果最佳，ROI达350%，但广告成本占比较高(57.32%)；Facebook平台用户获取成本较低，但转化率略低于Google Ads。</p>
        <p>建议增加Bing广告的投放比例，其ROI和用户获取成本表现优异，但目前占比较低。</p>
      </div>
      <div class="summary-actions">
        <button class="edit-summary-btn">编辑小结</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdPlatformData',
  props: {
    adPlatformData: {
      type: Object,
      required: true
    },
    timeRange: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedPlatform: 'all' // 默认显示所有平台
    }
  },
  computed: {
    formatTimeRange() {
      if (this.timeRange.type === 'custom') {
        return `${this.timeRange.startDate} 至 ${this.timeRange.endDate}`;
      }
      
      const typeMap = {
        'today': '今天',
        'last7days': '近7天',
        'last14days': '近14天',
        'last30days': '近30天',
        'last90days': '近90天',
        'last1year': '近1年'
      };
      
      return typeMap[this.timeRange.type] || '';
    }
  },
  methods: {
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    getPlatformData(metric, platform) {
      if (platform === 'all') {
        return this.adPlatformData[metric].data;
      }
      return this.adPlatformData[metric].data.filter(item => item.platform === platform);
    },
    
    getPlatformTotalSales() {
      if (this.selectedPlatform === 'all') {
        return this.adPlatformData.totalSales.data.reduce((sum, item) => sum + item.value, 0);
      } else {
        const platformData = this.adPlatformData.totalSales.data.find(
          item => item.platform === this.selectedPlatform
        );
        return platformData ? platformData.value : 0;
      }
    },
    
    getPlatformTotalCost() {
      if (this.selectedPlatform === 'all') {
        return this.adPlatformData.totalCost.data.reduce((sum, item) => sum + item.value, 0);
      } else {
        const platformData = this.adPlatformData.totalCost.data.find(
          item => item.platform === this.selectedPlatform
        );
        return platformData ? platformData.value : 0;
      }
    },
    
    getPlatformConversionValue() {
      if (this.selectedPlatform === 'all') {
        return this.adPlatformData.conversionValue.data.reduce((sum, item) => sum + item.value, 0);
      } else {
        const platformData = this.adPlatformData.conversionValue.data.find(
          item => item.platform === this.selectedPlatform
        );
        return platformData ? platformData.value : 0;
      }
    },
    
    getPlatformROI() {
      if (this.selectedPlatform === 'all') {
        // 计算平均ROI
        const totalData = this.adPlatformData.roi.data;
        return (totalData.reduce((sum, item) => sum + item.value, 0) / totalData.length).toFixed(2);
      } else {
        const platformData = this.adPlatformData.roi.data.find(
          item => item.platform === this.selectedPlatform
        );
        return platformData ? platformData.value : 0;
      }
    },
    
    getPlatformUsers() {
      if (this.selectedPlatform === 'all') {
        return this.adPlatformData.users.data.reduce((sum, item) => sum + item.value, 0);
      } else {
        const platformData = this.adPlatformData.users.data.find(
          item => item.platform === this.selectedPlatform
        );
        return platformData ? platformData.value : 0;
      }
    },
    
    getPlatformUserCost() {
      if (this.selectedPlatform === 'all') {
        // 计算平均用户成本
        const totalData = this.adPlatformData.userCost.data;
        return (totalData.reduce((sum, item) => sum + item.value, 0) / totalData.length).toFixed(2);
      } else {
        const platformData = this.adPlatformData.userCost.data.find(
          item => item.platform === this.selectedPlatform
        );
        return platformData ? platformData.value : 0;
      }
    },
    
    getPlatformConversionRate() {
      if (this.selectedPlatform === 'all') {
        // 计算平均转化率
        const totalData = this.adPlatformData.conversionRate.data;
        return (totalData.reduce((sum, item) => sum + item.value, 0) / totalData.length).toFixed(2);
      } else {
        const platformData = this.adPlatformData.conversionRate.data.find(
          item => item.platform === this.selectedPlatform
        );
        return platformData ? platformData.value : 0;
      }
    },
    
    getPlatformColor(platform) {
      // 为每个平台分配固定颜色
      const colorMap = {
        'Google Ads': '#4285F4', // Google蓝
        'Facebook': '#1877F2',   // Facebook蓝
        'Bing': '#00897B',       // 青绿色
        'Criteo': '#FF6D00'      // 橙色
      };
      
      return colorMap[platform] || '#BDBDBD'; // 默认为灰色
    },
    
    getShortPlatformName(platform) {
      // 获取平台的简短名称
      const shortNameMap = {
        'Google Ads': 'Google',
        'Facebook': 'FB',
        'Bing': 'Bing',
        'Criteo': 'Criteo'
      };
      
      return shortNameMap[platform] || platform;
    },
    
    getPercentageHeight(value, maxValue) {
      if (!maxValue || !isFinite(maxValue) || !value || !isFinite(value)) return 0;
      return Math.min(100, Math.max(5, Math.round((value / maxValue) * 90)));
    },
    
    getMaxValue(metric) {
      // 获取指定度量的最大值
      if (!this.adPlatformData[metric] || !this.adPlatformData[metric].data) {
        return 1;
      }
      
      const values = this.adPlatformData[metric].data
        .map(item => item.value)
        .filter(val => isFinite(val) && val > 0);
      
      if (values.length === 0) return 1;
      
      return Math.max(...values);
    }
  }
}
</script>

<style scoped>
.ad-platform-data {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  padding: 20px;
}

.module-title {
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
}

.time-range {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.platform-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
  white-space: nowrap;
}

.platform-tab {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.platform-tab:hover {
  color: #1976d2;
}

.platform-tab.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
  font-weight: 500;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.metric-card {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s;
}

.metric-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.metric-header {
  padding: 12px 15px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-title {
  margin: 0;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.more-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.more-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.metric-content {
  padding: 15px;
}

.main-number {
  font-size: 1.8rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 15px;
}

.metric-detail {
  display: flex;
  flex-direction: column;
}

.pie-chart-container, .bar-chart-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.pie-chart-placeholder, .bar-chart-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 4px;
  color: #999;
  font-size: 0.9rem;
}

.platform-details {
  margin-top: 5px;
}

.platform-detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.85rem;
}

.platform-color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.platform-name {
  flex-grow: 1;
}

.platform-value, .platform-percentage {
  margin-left: 10px;
  font-weight: 500;
}

.ad-platform-summary {
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

.horizontal-bar-chart {
  height: 35px;
  display: flex;
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  text-align: center;
  color: white;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bar-label {
  display: block;
  text-align: center;
  font-size: 0.8rem;
  color: #333;
}

.vertical-bar-chart {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}

.chart-column-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
}

.chart-column {
  width: 30px;
  min-height: 5px;
  border-radius: 3px 3px 0 0;
}

.column-label {
  font-size: 0.8rem;
  color: #333;
  margin-top: 5px;
}
</style> 