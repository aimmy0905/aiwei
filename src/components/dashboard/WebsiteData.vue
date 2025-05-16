<template>
  <div class="website-data">
    <h2 class="module-title">网站数据</h2>
    <div class="time-range">{{ formatTimeRange }}</div>
    
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
          <div class="main-number">¥{{ formatNumber(websiteData.totalSales.value) }}</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(websiteData.totalSales.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.totalSales.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(websiteData.totalSales.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.totalSales.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-pie-chart">
              <div v-for="(channel, index) in websiteData.totalSales.channels" 
                   :key="channel.name" 
                   class="pie-segment"
                   :style="{
                     backgroundColor: getChannelColor(index),
                     width: `${Math.max(5, channel.percentage)}%`
                   }">
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="(channel, index) in websiteData.totalSales.channels" 
                :key="channel.name" 
                class="legend-item"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getChannelColor(index) }"
                ></span>
                <span class="channel-name">{{ channel.name }}</span>
                <span class="channel-value">{{ channel.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 总订单数卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">总订单数</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">{{ formatNumber(websiteData.totalOrders.value) }}</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(websiteData.totalOrders.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.totalOrders.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(websiteData.totalOrders.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.totalOrders.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-pie-chart">
              <div v-for="(channel, index) in websiteData.totalOrders.channels" 
                   :key="channel.name" 
                   class="pie-segment"
                   :style="{
                     backgroundColor: getChannelColor(index),
                     width: `${Math.max(5, channel.percentage)}%`
                   }">
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="(channel, index) in websiteData.totalOrders.channels" 
                :key="channel.name" 
                class="legend-item"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getChannelColor(index) }"
                ></span>
                <span class="channel-name">{{ channel.name }}</span>
                <span class="channel-value">{{ channel.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 总花费卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">总花费</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">¥{{ formatNumber(websiteData.totalCost.value) }}</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(websiteData.totalCost.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.totalCost.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(websiteData.totalCost.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.totalCost.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-pie-chart">
              <div v-for="(channel, index) in websiteData.totalCost.channels" 
                   :key="channel.name" 
                   class="pie-segment"
                   :style="{
                     backgroundColor: getChannelColor(index),
                     width: `${Math.max(5, channel.percentage)}%`
                   }">
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="(channel, index) in websiteData.totalCost.channels" 
                :key="channel.name" 
                class="legend-item"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getChannelColor(index) }"
                ></span>
                <span class="channel-name">{{ channel.name }}</span>
                <span class="channel-value">{{ channel.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- ROI卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">ROI</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">{{ websiteData.roi.value }}%</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(websiteData.roi.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.roi.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(websiteData.roi.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.roi.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-bar-chart">
              <div 
                v-for="(channel, index) in websiteData.roi.channels" 
                :key="channel.name" 
                class="bar-container"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: `${Math.max(5, channel.value / getMaxValue(websiteData.roi.channels) * 90)}%`,
                    backgroundColor: getChannelColor(index)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(channel.name) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 转化成本卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">转化成本</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">¥{{ formatNumber(websiteData.conversionCost.value) }}</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(-websiteData.conversionCost.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.conversionCost.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(-websiteData.conversionCost.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.conversionCost.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-bar-chart">
              <div 
                v-for="(channel, index) in websiteData.conversionCost.channels" 
                :key="channel.name" 
                class="bar-container"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: `${Math.max(5, channel.value / getMaxValue(websiteData.conversionCost.channels) * 90)}%`,
                    backgroundColor: getChannelColor(index)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(channel.name) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 转化率卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">转化率</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">{{ websiteData.conversionRate.value }}%</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(websiteData.conversionRate.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.conversionRate.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(websiteData.conversionRate.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.conversionRate.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-bar-chart">
              <div 
                v-for="(channel, index) in websiteData.conversionRate.channels" 
                :key="channel.name" 
                class="bar-container"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: `${Math.max(5, channel.value / getMaxValue(websiteData.conversionRate.channels) * 90)}%`,
                    backgroundColor: getChannelColor(index)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(channel.name) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 客单价卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">客单价</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">¥{{ formatNumber(websiteData.averageOrderValue.value) }}</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(websiteData.averageOrderValue.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.averageOrderValue.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(websiteData.averageOrderValue.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.averageOrderValue.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-bar-chart">
              <div 
                v-for="(channel, index) in websiteData.averageOrderValue.channels" 
                :key="channel.name" 
                class="bar-container"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: `${Math.max(5, channel.value / getMaxValue(websiteData.averageOrderValue.channels) * 90)}%`,
                    backgroundColor: getChannelColor(index)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(channel.name) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 退货率卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">退货率</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">{{ websiteData.returnRate.value }}%</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(-websiteData.returnRate.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.returnRate.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(-websiteData.returnRate.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.returnRate.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-bar-chart">
              <div 
                v-for="(channel, index) in websiteData.returnRate.channels" 
                :key="channel.name" 
                class="bar-container"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: `${Math.max(5, channel.value / getMaxValue(websiteData.returnRate.channels) * 90)}%`,
                    backgroundColor: getChannelColor(index)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(channel.name) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 退货金额卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">退货金额</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">¥{{ formatNumber(websiteData.returnAmount.value) }}</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(-websiteData.returnAmount.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.returnAmount.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(-websiteData.returnAmount.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.returnAmount.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-pie-chart">
              <div v-for="(channel, index) in websiteData.returnAmount.channels" 
                   :key="channel.name" 
                   class="pie-segment"
                   :style="{
                     backgroundColor: getChannelColor(index),
                     width: `${Math.max(5, channel.percentage)}%`
                   }">
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="(channel, index) in websiteData.returnAmount.channels" 
                :key="channel.name" 
                class="legend-item"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getChannelColor(index) }"
                ></span>
                <span class="channel-name">{{ channel.name }}</span>
                <span class="channel-value">{{ channel.percentage }}%</span>
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
          <div class="main-number">{{ formatNumber(websiteData.userCount.value) }}</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(websiteData.userCount.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.userCount.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(websiteData.userCount.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.userCount.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-pie-chart">
              <div v-for="(channel, index) in websiteData.userCount.channels" 
                   :key="channel.name" 
                   class="pie-segment"
                   :style="{
                     backgroundColor: getChannelColor(index),
                     width: `${Math.max(5, channel.percentage)}%`
                   }">
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="(channel, index) in websiteData.userCount.channels" 
                :key="channel.name" 
                class="legend-item"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getChannelColor(index) }"
                ></span>
                <span class="channel-name">{{ channel.name }}</span>
                <span class="channel-value">{{ channel.percentage }}%</span>
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
          <div class="main-number">¥{{ formatNumber(websiteData.userCost.value) }}</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(-websiteData.userCost.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.userCost.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(-websiteData.userCost.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.userCost.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-bar-chart">
              <div 
                v-for="(channel, index) in websiteData.userCost.channels" 
                :key="channel.name" 
                class="bar-container"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: `${Math.max(5, channel.value / getMaxValue(websiteData.userCost.channels) * 90)}%`,
                    backgroundColor: getChannelColor(index)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(channel.name) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 复购率卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">复购率</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">{{ websiteData.repeatPurchaseRate.value }}%</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(websiteData.repeatPurchaseRate.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.repeatPurchaseRate.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(websiteData.repeatPurchaseRate.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.repeatPurchaseRate.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="simple-bar-chart">
              <div 
                v-for="(channel, index) in websiteData.repeatPurchaseRate.channels" 
                :key="channel.name" 
                class="bar-container"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: `${Math.max(5, channel.value / getMaxValue(websiteData.repeatPurchaseRate.channels) * 90)}%`,
                    backgroundColor: getChannelColor(index)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(channel.name) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 网站加载度卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">网站加载度</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">{{ websiteData.websiteLoadSpeed.value }}秒</div>
          <div class="change-indicators">
            <div class="indicator" :class="getChangeClass(-websiteData.websiteLoadSpeed.yoy)">
              <span class="label">同比</span>
              <span class="value">{{ formatPercentage(websiteData.websiteLoadSpeed.yoy) }}</span>
            </div>
            <div class="indicator" :class="getChangeClass(-websiteData.websiteLoadSpeed.mom)">
              <span class="label">环比</span>
              <span class="value">{{ formatPercentage(websiteData.websiteLoadSpeed.mom) }}</span>
            </div>
          </div>
        </div>
        
        <div class="metric-chart">
          <div class="chart-container">
            <div class="progress-chart">
              <div class="progress-bar">
                <div 
                  class="progress" 
                  :style="{
                    width: `${100 - (websiteData.websiteLoadSpeed.value / 3 * 100)}%`,
                    backgroundColor: websiteData.websiteLoadSpeed.value < 2 ? '#4caf50' : 
                                     websiteData.websiteLoadSpeed.value < 2.5 ? '#ff9800' : '#f44336'
                  }"
                ></div>
              </div>
              <div class="progress-labels">
                <span>快</span>
                <span>慢</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="website-summary">
      <h3 class="summary-title">网站数据小结</h3>
      <div class="summary-content">
        <p>总体来看，网站数据呈现稳步增长趋势。销售额同比增长12.5%，环比增长5.2%，主要得益于Google Ads和Facebook广告投放的优化。</p>
        <p>ROI表现良好，但转化成本仍有下降空间。建议进一步优化广告定向和落地页体验，提升整体转化率。</p>
      </div>
      <div class="summary-actions">
        <button class="edit-summary-btn">编辑小结</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebsiteData',
  props: {
    websiteData: {
      type: Object,
      required: true
    },
    timeRange: {
      type: Object,
      required: true
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
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    formatPercentage(num) {
      const sign = num >= 0 ? '+' : '';
      return `${sign}${num}%`;
    },
    
    getChangeClass(value) {
      if (value > 0) return 'positive';
      if (value < 0) return 'negative';
      return 'neutral';
    },
    
    getChannelColor(index) {
      const colors = ['#1976d2', '#26a69a', '#ec407a', '#7e57c2'];
      return colors[index % colors.length];
    },
    
    getMaxValue(channels) {
      return Math.max(...channels.map(channel => channel.value));
    },
    
    getShortChannelName(name) {
      // Shorten channel names for bar charts
      const map = {
        'Google Ads': 'Google',
        'Facebook': 'FB',
        'Instagram': 'IG'
      };
      
      return map[name] || name;
    }
  }
}
</script>

<style scoped>
.website-data {
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
  margin-bottom: 10px;
}

.change-indicators {
  display: flex;
  gap: 15px;
  margin-bottom: 5px;
}

.indicator {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.indicator .label {
  color: #777;
  margin-right: 5px;
}

.indicator .value {
  font-weight: 500;
}

.indicator.positive .value {
  color: #4caf50;
}

.indicator.negative .value {
  color: #f44336;
}

.indicator.neutral .value {
  color: #757575;
}

.metric-chart {
  padding: 0 15px 15px;
}

.chart-container {
  height: 180px;
  display: flex;
  flex-direction: column;
}

/* Simple pie chart styles - horizontal bar approach */
.simple-pie-chart {
  display: flex;
  height: 30px;
  width: 100%;
  margin: 20px 0;
  overflow: hidden;
  border-radius: 4px;
}

.pie-segment {
  height: 100%;
}

.chart-legend {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}

.channel-name {
  flex: 1;
  color: #666;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}

.channel-value {
  font-weight: 500;
  color: #333;
  min-width: 45px;
  text-align: right;
}

/* Simple bar chart styles */
.simple-bar-chart {
  height: 130px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding-top: 15px;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
}

.bar {
  width: 24px;
  border-radius: 3px 3px 0 0;
  transition: height 0.3s;
  min-height: 5px; /* Ensure bar is always visible */
}

.bar-label {
  margin-top: 5px;
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Progress bar styles */
.progress-chart {
  padding: 30px 15px;
}

.progress-bar {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

.website-summary {
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