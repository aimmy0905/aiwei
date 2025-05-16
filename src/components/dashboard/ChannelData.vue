<template>
  <div class="channel-data">
    <h2 class="module-title">渠道流量数据</h2>
    <div class="time-range">{{ formatTimeRange }}</div>
    
    <div class="channel-categories">
      <div 
        v-for="category in channelData.categories" 
        :key="category.key"
        class="category-tab"
        :class="{ active: selectedCategory === category.key }"
        @click="selectedCategory = category.key"
      >
        {{ category.name }}
      </div>
      <div 
        class="category-tab"
        :class="{ active: selectedCategory === 'all' }"
        @click="selectedCategory = 'all'"
      >
        全部渠道
      </div>
    </div>
    
    <div class="metrics-grid">
      <!-- 销售额卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">销售额</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            ¥{{ formatNumber(getSelectedCategoryData('sales').value) }}
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('sales').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('sales').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('sales').mom)"
              >
                {{ formatChange(getSelectedCategoryData('sales').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示对比图表 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="horizontal-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-sales'"
                class="channel-bar"
                :style="{ 
                  width: getCategoryPercentage('sales', category.key) + '%',
                  backgroundColor: getCategoryColor(category.key)
                }"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span class="bar-label" v-if="getCategoryPercentage('sales', category.key) > 10">
                  {{ getShortChannelName(category.name) }}
                </span>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">¥{{ formatNumber(getCategoryData('sales', category.key).value) }}</span>
                <span class="percentage">{{ getCategoryPercentage('sales', category.key) }}%</span>
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
            {{ formatNumber(getSelectedCategoryData('users').value) }}
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('users').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('users').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('users').mom)"
              >
                {{ formatChange(getSelectedCategoryData('users').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示对比图表 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="horizontal-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-users'"
                class="channel-bar"
                :style="{ 
                  width: getCategoryPercentage('users', category.key) + '%',
                  backgroundColor: getCategoryColor(category.key)
                }"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span class="bar-label" v-if="getCategoryPercentage('users', category.key) > 10">
                  {{ category.name }}
                </span>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">{{ formatNumber(getCategoryData('users', category.key).value) }}</span>
                <span class="percentage">{{ getCategoryPercentage('users', category.key) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 广告成本卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">广告成本</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            ¥{{ formatNumber(getSelectedCategoryData('adCost').value) }}
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('adCost').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('adCost').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('adCost').mom)"
              >
                {{ formatChange(getSelectedCategoryData('adCost').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示对比图表 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="horizontal-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-adCost'"
                class="channel-bar"
                :style="{ 
                  width: getCategoryPercentage('adCost', category.key) + '%',
                  backgroundColor: getCategoryColor(category.key)
                }"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span class="bar-label" v-if="getCategoryPercentage('adCost', category.key) > 10">
                  {{ category.name }}
                </span>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">¥{{ formatNumber(getCategoryData('adCost', category.key).value) }}</span>
                <span class="percentage">{{ getCategoryPercentage('adCost', category.key) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 订单数量卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">订单数量</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            {{ formatNumber(getSelectedCategoryData('orders').value) }}
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('orders').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('orders').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('orders').mom)"
              >
                {{ formatChange(getSelectedCategoryData('orders').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示对比图表 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="horizontal-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-orders'"
                class="channel-bar"
                :style="{ 
                  width: getCategoryPercentage('orders', category.key) + '%',
                  backgroundColor: getCategoryColor(category.key)
                }"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span class="bar-label" v-if="getCategoryPercentage('orders', category.key) > 10">
                  {{ category.name }}
                </span>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">{{ formatNumber(getCategoryData('orders', category.key).value) }}</span>
                <span class="percentage">{{ getCategoryPercentage('orders', category.key) }}%</span>
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
          <div class="main-number">
            ¥{{ formatNumber(getSelectedCategoryData('averageOrderValue').value) }}
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('averageOrderValue').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('averageOrderValue').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('averageOrderValue').mom)"
              >
                {{ formatChange(getSelectedCategoryData('averageOrderValue').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示柱状图 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="vertical-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-aov-bar'"
                class="bar-container"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: getCategoryBarHeight('averageOrderValue', category.key) + '%',
                    backgroundColor: getCategoryColor(category.key)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(category.name) }}</div>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-aov-legend'"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">¥{{ formatNumber(getCategoryData('averageOrderValue', category.key).value) }}</span>
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
          <div class="main-number">
            {{ getSelectedCategoryData('conversionRate').value }}%
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('conversionRate').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('conversionRate').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('conversionRate').mom)"
              >
                {{ formatChange(getSelectedCategoryData('conversionRate').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示柱状图 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="vertical-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-cr-bar'"
                class="bar-container"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: getCategoryBarHeight('conversionRate', category.key) + '%',
                    backgroundColor: getCategoryColor(category.key)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(category.name) }}</div>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-cr-legend'"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">{{ getCategoryData('conversionRate', category.key).value }}%</span>
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
            ¥{{ formatNumber(getSelectedCategoryData('userCost').value) }}
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(-getSelectedCategoryData('userCost').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('userCost').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(-getSelectedCategoryData('userCost').mom)"
              >
                {{ formatChange(getSelectedCategoryData('userCost').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示柱状图 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="vertical-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-uc-bar'"
                class="bar-container"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: getCategoryBarHeight('userCost', category.key) + '%',
                    backgroundColor: getCategoryColor(category.key)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(category.name) }}</div>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-uc-legend'"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">¥{{ formatNumber(getCategoryData('userCost', category.key).value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 跳出率卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">跳出率</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            {{ getSelectedCategoryData('bounceRate').value }}%
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(-getSelectedCategoryData('bounceRate').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('bounceRate').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(-getSelectedCategoryData('bounceRate').mom)"
              >
                {{ formatChange(getSelectedCategoryData('bounceRate').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示柱状图 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="vertical-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-br-bar'"
                class="bar-container"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: getCategoryBarHeight('bounceRate', category.key) + '%',
                    backgroundColor: getCategoryColor(category.key)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(category.name) }}</div>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-br-legend'"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">{{ getCategoryData('bounceRate', category.key).value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 网站停留时间卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">网站停留时间</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            {{ getSelectedCategoryData('stayDuration').value }}
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('stayDuration').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('stayDuration').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('stayDuration').mom)"
              >
                {{ formatChange(getSelectedCategoryData('stayDuration').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示柱状图 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="vertical-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-sd-bar'"
                class="bar-container"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: getCategoryBarHeight('stayDuration', category.key, 'rawValue') + '%',
                    backgroundColor: getCategoryColor(category.key)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(category.name) }}</div>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-sd-legend'"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">{{ getCategoryData('stayDuration', category.key).value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 平均访问页面数卡片 -->
      <div class="metric-card">
        <div class="metric-header">
          <h3 class="metric-title">平均访问页面数</h3>
          <div class="metric-actions">
            <button class="more-btn">⋮</button>
          </div>
        </div>
        
        <div class="metric-content">
          <div class="main-number">
            {{ formatDecimal(getSelectedCategoryData('pageViews').value) }}
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('pageViews').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('pageViews').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('pageViews').mom)"
              >
                {{ formatChange(getSelectedCategoryData('pageViews').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示柱状图 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="vertical-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-pv-bar'"
                class="bar-container"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: getCategoryBarHeight('pageViews', category.key) + '%',
                    backgroundColor: getCategoryColor(category.key)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(category.name) }}</div>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-pv-legend'"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">{{ formatDecimal(getCategoryData('pageViews', category.key).value) }}</span>
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
          <div class="main-number">
            {{ formatROI(getSelectedCategoryData('roi').value) }}
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('roi').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('roi').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(getSelectedCategoryData('roi').mom)"
              >
                {{ formatChange(getSelectedCategoryData('roi').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示垂直柱状图 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="vertical-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-roi-bar'"
                class="bar-container"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: getCategoryBarHeight('roi', category.key) + '%',
                    backgroundColor: getCategoryColor(category.key)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(category.name) }}</div>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-roi-legend'"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">{{ formatROI(getCategoryData('roi', category.key).value) }}</span>
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
          <div class="main-number">
            ¥{{ formatNumber(getSelectedCategoryData('conversionCost').value) }}
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(-getSelectedCategoryData('conversionCost').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('conversionCost').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(-getSelectedCategoryData('conversionCost').mom)"
              >
                {{ formatChange(getSelectedCategoryData('conversionCost').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示垂直柱状图 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="vertical-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-cc-bar'"
                class="bar-container"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: getCategoryBarHeight('conversionCost', category.key) + '%',
                    backgroundColor: getCategoryColor(category.key)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(category.name) }}</div>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-cc-legend'"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">¥{{ formatNumber(getCategoryData('conversionCost', category.key).value) }}</span>
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
          <div class="main-number">
            {{ getSelectedCategoryData('returnRate').value }}%
          </div>
          <div class="metrics-changes">
            <div class="metric-change">
              <span class="change-label">同比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(-getSelectedCategoryData('returnRate').yoy)"
              >
                {{ formatChange(getSelectedCategoryData('returnRate').yoy) }}
              </span>
            </div>
            <div class="metric-change">
              <span class="change-label">环比</span>
              <span 
                class="change-value" 
                :class="getChangeClass(-getSelectedCategoryData('returnRate').mom)"
              >
                {{ formatChange(getSelectedCategoryData('returnRate').mom) }}
              </span>
            </div>
          </div>
          
          <!-- 全部渠道时显示垂直柱状图 -->
          <div class="channel-comparison" v-if="selectedCategory === 'all'">
            <div class="vertical-bar-chart">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-rr-bar'"
                class="bar-container"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <div 
                  class="bar" 
                  :style="{
                    height: getCategoryBarHeight('returnRate', category.key) + '%',
                    backgroundColor: getCategoryColor(category.key)
                  }"
                ></div>
                <div class="bar-label">{{ getShortChannelName(category.name) }}</div>
              </div>
            </div>
            
            <div class="chart-legend">
              <div 
                v-for="category in channelData.categories" 
                :key="category.key + '-rr-legend'"
                class="legend-item"
                @click="selectedCategory = category.key"
                title="点击查看详情"
              >
                <span 
                  class="color-dot" 
                  :style="{ backgroundColor: getCategoryColor(category.key) }"
                ></span>
                <span class="channel-name">{{ category.name }}</span>
                <span class="value">{{ getCategoryData('returnRate', category.key).value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="channel-summary">
      <h3 class="summary-title">渠道数据小结</h3>
      <div class="summary-content">
        <p>直接流量销售额同比提升5.2%，环比提升2.1%；广告流量同比增长12.5%，环比增长5.8%，主要贡献来自Google Ads和Facebook投放的优化。</p>
        <p>社交流量增长明显，同比增幅18.3%，但转化率偏低，建议优化社交渠道落地页体验。</p>
      </div>
      <div class="summary-actions">
        <button class="edit-summary-btn">编辑小结</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChannelData',
  props: {
    channelData: {
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
      selectedCategory: 'all',  // 默认选中全部渠道，与截图一致
      channelColors: {
        direct: '#4285F4',  // 蓝色 - 直接流量
        ad: '#F4B400',      // 黄色 - 广告流量
        social: '#0F9D58',  // 绿色 - 社交流量
        organic: '#DB4437'  // 红色 - 自然搜索
      },
      // 预先计算总计数据，而不是每次在模板中重新计算
      totalData: {}
    }
  },
  computed: {
    formatTimeRange() {
      // 格式化时间范围显示
      const { type, startDate, endDate } = this.timeRange;
      
      if (type === 'last7days') {
        return '最近7天';
      } else if (type === 'last30days') {
        return '最近30天';
      } else if (type === 'custom' && startDate && endDate) {
        // 应该有日期格式化逻辑
        return `${startDate} 至 ${endDate}`;
      }
      
      return '最近7天'; // 默认值
    }
  },
  // 添加created钩子以预先计算总数据
  created() {
    this.calculateTotalData();
  },
  // 当数据变化时重新计算总数据
  watch: {
    'channelData': {
      handler() {
        this.calculateTotalData();
      },
      deep: true
    }
  },
  methods: {
    // 预先计算总数据的方法
    calculateTotalData() {
      const metrics = [
        'sales', 'users', 'adCost', 'orders', 'averageOrderValue', 
        'conversionRate', 'userCost', 'bounceRate', 'stayDuration', 
        'pageViews', 'roi', 'conversionCost', 'returnRate'
      ];
      
      // 初始化总数据结构
      this.totalData = {};
      
      metrics.forEach(metric => {
        // 如果channelData中不存在此指标，跳过
        if (!this.channelData[metric] || !this.channelData[metric].data) {
          return;
        }
        
        // 预先计算此指标的总计数据
        let totalValue = 0;
        let totalYoy = 0;
        let totalMom = 0;
        let dataCount = 0;
        
        this.channelData[metric].data.forEach(item => {
          // 对特殊情况进行处理，比如无穷大或者不是数字
          if (item.value !== Infinity && !isNaN(item.value)) {
            // 特殊处理停留时间，它有原始值
            if (metric === 'stayDuration' && 'rawValue' in item) {
              totalValue += item.rawValue;
            } else {
              totalValue += item.value;
            }
            
            if (!isNaN(item.yoy)) totalYoy += item.yoy;
            if (!isNaN(item.mom)) totalMom += item.mom;
            dataCount++;
          }
        });
        
        // 计算平均值
        const avgYoy = dataCount > 0 ? totalYoy / dataCount : 0;
        const avgMom = dataCount > 0 ? totalMom / dataCount : 0;
        
        // 存储预计算的数据
        this.totalData[metric] = {
          value: totalValue,
          yoy: avgYoy,
          mom: avgMom,
          dataCount
        };
      });
    },
    
    getSelectedCategoryData(metric) {
      // 如果选择了"全部渠道"，使用预先计算的总计数据
      if (this.selectedCategory === 'all') {
        if (this.totalData[metric]) {
          // 对停留时间进行特殊处理
          if (metric === 'stayDuration') {
            const minutes = Math.floor(this.totalData[metric].value / 60);
            const seconds = this.totalData[metric].value % 60;
            return {
              value: `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`,
              yoy: this.totalData[metric].yoy,
              mom: this.totalData[metric].mom
            };
          }
          
          return {
            value: this.totalData[metric].value,
            yoy: this.totalData[metric].yoy,
            mom: this.totalData[metric].mom
          };
        }
        
        // 如果没有预计算数据，返回默认值
        return { value: 0, yoy: 0, mom: 0 };
      }
      
      // 如果选择了特定渠道，返回该渠道的数据
      const metricData = this.channelData[metric];
      if (!metricData || !metricData.data) {
        return { value: 0, yoy: 0, mom: 0 };
      }
      
      const categoryData = metricData.data.find(item => item.category === this.selectedCategory);
      return categoryData || { value: 0, yoy: 0, mom: 0 };
    },
    
    getCategoryData(metric, categoryKey) {
      const metricData = this.channelData[metric];
      if (!metricData || !metricData.data) {
        return { value: 0, yoy: 0, mom: 0 };
      }
      
      const categoryData = metricData.data.find(item => item.category === categoryKey);
      return categoryData || { value: 0, yoy: 0, mom: 0 };
    },
    
    getCategoryPercentage(metric, categoryKey) {
      // 使用预先计算的总计数据作为分母
      const metricData = this.channelData[metric];
      if (!metricData || !metricData.data || !this.totalData[metric]) {
        return 0;
      }
      
      const categoryData = metricData.data.find(item => item.category === categoryKey);
      if (!categoryData || !categoryData.value || categoryData.value === Infinity || isNaN(categoryData.value)) {
        return 0;
      }
      
      // 使用预先计算的总值
      const totalValue = this.totalData[metric].value;
      if (totalValue === 0) return 0;
      
      // 计算百分比，确保结果有限
      const result = (categoryData.value / totalValue) * 100;
      return isFinite(result) ? Math.round(result) : 0;
    },
    
    getCategoryColor(categoryKey) {
      return this.channelColors[categoryKey] || '#999';
    },
    
    getChannelColor(index) {
      const colors = ['#4285F4', '#FBBC05', '#34A853', '#EA4335'];
      return colors[index % colors.length];
    },
    
    formatNumber(value) {
      if (value === undefined || value === null || isNaN(value)) {
        return '0';
      }
      
      if (value === Infinity) {
        return '∞';
      }
      
      // 千分位格式化
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    formatChange(value) {
      if (value === undefined || value === null || isNaN(value)) {
        return '0%';
      }
      
      const sign = value > 0 ? '+' : '';
      return `${sign}${value.toFixed(1)}%`;
    },
    
    formatROI(value) {
      if (value === undefined || value === null || isNaN(value)) {
        return '0%';
      }
      
      if (value === Infinity) {
        return '∞';
      }
      
      return `${value.toFixed(1)}%`;
    },
    
    getChangeClass(value) {
      if (value > 0) {
        return 'positive';
      } else if (value < 0) {
        return 'negative';
      } else {
        return 'neutral';
      }
    },
    
    getCategoryBarHeight(metric, categoryKey, valueField = 'value') {
      try {
        // 获取条形图高度百分比
        const allValues = this.channelData[metric].data
          .map(item => item[valueField])
          .filter(value => isFinite(value) && value > 0);
        
        if (allValues.length === 0) return 5;
        
        const maxValue = Math.max(...allValues);
        const value = this.getCategoryData(metric, categoryKey)[valueField];
        
        if (!value || !maxValue) return 5;
        
        return Math.min(100, Math.max(5, Math.round((value / maxValue) * 90)));
      } catch (error) {
        console.error('计算条形图高度出错:', error);
        return 5;
      }
    },
    
    getShortChannelName(name) {
      // 缩短渠道名称用于图表展示
      const map = {
        '直接流量': '直接',
        '广告流量': '广告',
        '社交流量': '社交',
        '自然搜索': '自然'
      };
      
      return map[name] || name;
    },
    
    formatDecimal(value) {
      if (value === undefined || value === null || isNaN(value)) {
        return '0';
      }
      
      return value.toFixed(1);
    }
  }
}
</script>

<style scoped>
.channel-data {
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

.channel-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 8px 16px;
  background-color: #f5f7fa;
  border-radius: 6px;
  color: #666;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab:hover {
  background-color: #e8eef5;
}

.category-tab.active {
  background-color: #1976d2;
  color: white;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.metric-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  background-color: white;
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

.metrics-changes {
  display: flex;
  margin-bottom: 10px;
}

.metric-change {
  display: flex;
  align-items: center;
  margin-right: 15px;
}

.change-label {
  color: #666;
  font-size: 0.85rem;
  margin-right: 5px;
}

.change-value {
  font-weight: 500;
  font-size: 0.9rem;
}

.change-value.positive {
  color: #0F9D58;
}

.change-value.negative {
  color: #DB4437;
}

.change-value.neutral {
  color: #666;
}

/* 更新的渠道比较图表样式 */
.channel-comparison {
  margin-top: 15px;
  border-top: 1px dashed #e0e0e0;
  padding-top: 15px;
}

.horizontal-bar-chart {
  height: 30px;
  display: flex;
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f7fa;
}

.vertical-bar-chart {
  height: 150px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  margin-bottom: 10px;
}

.channel-bar {
  height: 100%;
  text-align: center;
  color: white;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: opacity 0.2s;
}

.channel-bar:hover {
  opacity: 0.8;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.bar-container:hover {
  opacity: 0.8;
}

.bar {
  width: 24px;
  border-radius: 3px 3px 0 0;
  transition: height 0.3s;
  min-height: 5px;
}

.bar-label {
  margin-top: 5px;
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  padding: 0 5px;
}

.chart-legend {
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.legend-item:hover {
  background-color: #f5f7fa;
}

.color-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.channel-name {
  flex: 1;
  color: #666;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}

.value, .percentage {
  margin-left: 10px;
  font-weight: 500;
}

.channel-summary {
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

/* 确保下面的样式覆盖任何冲突的定义 */
.simple-bar-chart {
  height: 130px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding-top: 15px;
  margin-top: 15px;
  margin-bottom: 10px;
  cursor: default;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.bar-container:hover {
  opacity: 0.8;
}

.bar {
  width: 24px;
  border-radius: 3px 3px 0 0;
  transition: height 0.3s;
  min-height: 5px;
}
</style> 