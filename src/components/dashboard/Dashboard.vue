<template>
  <div class="dashboard">
    <h1 class="page-title">数据看板</h1>
    
    <!-- 当查看活动详情时，显示活动详情组件 -->
    <ActivityDetail 
      v-if="selectedActivity" 
      :activity="selectedActivity" 
      :productRankings="productRankings"
      @back-to-dashboard="backToDashboard"
    />
    
    <!-- 当未查看活动详情时，显示正常的仪表板内容 -->
    <template v-else>
      <!-- 页面控制模块 -->
      <DashboardControls 
        @changeClient="updateClient" 
        @changeProject="updateProject"
        @changeTimeRange="updateTimeRange"
      />

      <!-- 预警提醒模块 -->
      <DashboardAlerts :alerts="alertItems" />
      
      <!-- 客户目标数据模块 -->
      <ClientTargets 
        :clientTargets="clientTargets" 
        :clientName="selectedClient"
        :projectName="selectedProject"
      />
      
      <!-- 网站数据模块 -->
      <WebsiteData 
        :websiteData="websiteData"
        :timeRange="timeRange"
      />

      <!-- 渠道流量数据模块 -->
      <ChannelData
        :channelData="channelData"
        :timeRange="timeRange"
      />

      <!-- 广告平台数据模块 -->
      <AdPlatformData
        :adPlatformData="adPlatformData"
        :timeRange="timeRange"
      />

      <!-- 活动数据模块 -->
      <ActivityData 
        :activities="activities" 
        @view-activity-details="viewActivityDetails"
      />

      <!-- 产品销量排名模块 -->
      <ProductRanking :productRankings="productRankings" />

      <!-- 合作红人模块 -->
      <InfluencerData :influencerData="influencerData" />
    </template>
  </div>
</template>

<script>
import DashboardControls from './DashboardControls.vue';
import DashboardAlerts from './DashboardAlerts.vue';
import ClientTargets from './ClientTargets.vue';
import WebsiteData from './WebsiteData.vue';
import ChannelData from './ChannelData.vue';
import AdPlatformData from './AdPlatformData.vue';
import ActivityData from './ActivityData.vue';
import ProductRanking from './ProductRanking.vue';
import InfluencerData from './InfluencerData.vue';
import ActivityDetail from './ActivityDetail.vue';

export default {
  name: 'DataDashboard',
  components: {
    DashboardControls,
    DashboardAlerts,
    ClientTargets,
    WebsiteData,
    ChannelData,
    AdPlatformData,
    ActivityData,
    ProductRanking,
    InfluencerData,
    ActivityDetail
  },
  data() {
    return {
      selectedActivity: null, // 当前查看的活动详情，为null时显示仪表板
      selectedClient: '全部客户',
      selectedProject: '全部项目',
      timeRange: {
        type: 'last7days',
        startDate: null,
        endDate: null
      },
      // 预警提醒数据
      alertItems: [
        {
          type: 'account',
          accountName: 'Google Ads账户01',
          balance: 156.78,
          threshold: 200,
          urgency: 'medium'
        },
        {
          type: 'account',
          accountName: 'Facebook账户03',
          balance: 45.23,
          threshold: 100,
          urgency: 'high'
        },
        {
          type: 'service',
          clientName: '上海某科技有限公司',
          projectName: '电商广告投放项目',
          expiryDate: '2023-06-30',
          daysLeft: 3,
          urgency: 'high'
        },
        {
          type: 'service',
          clientName: '北京某贸易有限公司',
          projectName: '品牌推广项目',
          expiryDate: '2023-07-15',
          daysLeft: 18,
          urgency: 'medium'
        }
      ],
      // 客户目标数据
      clientTargets: {
        sales: {
          target: 500000,
          current: 325000,
          progress: 65
        },
        profit: {
          target: 150000,
          current: 112000,
          progress: 74.67
        },
        roi: {
          target: 350,
          current: 312,
          progress: 89.14
        },
        cost: {
          target: 100000,
          current: 78500,
          progress: 78.5
        },
        users: {
          target: 10000,
          current: 6532,
          progress: 65.32
        }
      },
      // 网站数据
      websiteData: {
        totalSales: {
          value: 325000,
          yoy: 12.5, // 同比
          mom: 5.2,  // 环比
          channels: [
            { name: 'Google Ads', value: 175000, percentage: 53.85 },
            { name: 'Facebook', value: 85000, percentage: 26.15 },
            { name: 'Bing', value: 40000, percentage: 12.31 },
            { name: 'Criteo', value: 25000, percentage: 7.69 }
          ]
        },
        totalOrders: {
          value: 1250,
          yoy: 8.7,
          mom: 3.1,
          channels: [
            { name: 'Google Ads', value: 650, percentage: 52 },
            { name: 'Facebook', value: 350, percentage: 28 },
            { name: 'Bing', value: 150, percentage: 12 },
            { name: 'Criteo', value: 100, percentage: 8 }
          ]
        },
        totalCost: {
          value: 78500,
          yoy: 5.3,
          mom: 2.1,
          channels: [
            { name: 'Google Ads', value: 45000, percentage: 57.32 },
            { name: 'Facebook', value: 23000, percentage: 29.3 },
            { name: 'Bing', value: 6500, percentage: 8.28 },
            { name: 'Criteo', value: 4000, percentage: 5.1 }
          ]
        },
        roi: {
          value: 312,
          yoy: 7.2,
          mom: 3.4,
          channels: [
            { name: 'Google Ads', value: 350 },
            { name: 'Facebook', value: 320 },
            { name: 'Bing', value: 280 },
            { name: 'Criteo', value: 250 }
          ]
        },
        conversionCost: {
          value: 62.8,
          yoy: -3.5,
          mom: -1.2,
          channels: [
            { name: 'Google Ads', value: 58.5 },
            { name: 'Facebook', value: 65.7 },
            { name: 'Bing', value: 72.4 },
            { name: 'Criteo', value: 68.9 }
          ]
        },
        conversionRate: {
          value: 3.2,
          yoy: 0.4,
          mom: 0.1,
          channels: [
            { name: 'Google Ads', value: 3.8 },
            { name: 'Facebook', value: 3.2 },
            { name: 'Bing', value: 2.7 },
            { name: 'Criteo', value: 2.5 }
          ]
        },
        averageOrderValue: {
          value: 260,
          yoy: 3.8,
          mom: 1.5,
          channels: [
            { name: 'Google Ads', value: 275 },
            { name: 'Facebook', value: 258 },
            { name: 'Bing', value: 242 },
            { name: 'Criteo', value: 232 }
          ]
        },
        returnRate: {
          value: 4.2,
          yoy: -0.3,
          mom: -0.1,
          channels: [
            { name: 'Google Ads', value: 3.9 },
            { name: 'Facebook', value: 4.3 },
            { name: 'Bing', value: 4.5 },
            { name: 'Criteo', value: 4.8 }
          ]
        },
        returnAmount: {
          value: 12500,
          yoy: 2.5,
          mom: 0.8,
          channels: [
            { name: 'Google Ads', value: 6500, percentage: 52 },
            { name: 'Facebook', value: 3500, percentage: 28 },
            { name: 'Bing', value: 1500, percentage: 12 },
            { name: 'Criteo', value: 1000, percentage: 8 }
          ]
        },
        userCount: {
          value: 8500,
          yoy: 15.2,
          mom: 4.8,
          channels: [
            { name: 'Google Ads', value: 4250, percentage: 50 },
            { name: 'Facebook', value: 2550, percentage: 30 },
            { name: 'Bing', value: 1020, percentage: 12 },
            { name: 'Criteo', value: 680, percentage: 8 }
          ]
        },
        userCost: {
          value: 9.2,
          yoy: -8.5,
          mom: -2.3,
          channels: [
            { name: 'Google Ads', value: 8.5 },
            { name: 'Facebook', value: 9.8 },
            { name: 'Bing', value: 10.2 },
            { name: 'Criteo', value: 9.7 }
          ]
        },
        repeatPurchaseRate: {
          value: 28.5,
          yoy: 3.2,
          mom: 1.1,
          channels: [
            { name: 'Google Ads', value: 32.1 },
            { name: 'Facebook', value: 27.4 },
            { name: 'Bing', value: 25.8 },
            { name: 'Criteo', value: 24.2 }
          ]
        },
        websiteLoadSpeed: {
          value: 1.8,
          yoy: -15.2,
          mom: -8.3
        }
      },
      // 渠道流量数据
      channelData: {
        categories: [
          { key: 'direct', name: '直接流量' },
          { key: 'ad', name: '广告流量' },
          { key: 'social', name: '社交流量' },
          { key: 'organic', name: '自然搜索' }
        ],
        sales: {
          data: [
            { category: 'direct', value: 85000, yoy: 5.2, mom: 2.1 },
            { category: 'ad', value: 175000, yoy: 12.5, mom: 5.8 },
            { category: 'social', value: 45000, yoy: 18.3, mom: 7.6 },
            { category: 'organic', value: 20000, yoy: 3.1, mom: 1.5 }
          ]
        },
        users: {
          data: [
            { category: 'direct', value: 1500, yoy: 4.8, mom: 1.9 },
            { category: 'ad', value: 3500, yoy: 15.3, mom: 6.8 },
            { category: 'social', value: 1000, yoy: 22.5, mom: 9.2 },
            { category: 'organic', value: 532, yoy: 2.5, mom: 1.1 }
          ]
        },
        adCost: {
          data: [
            { category: 'direct', value: 0, yoy: 0, mom: 0 },
            { category: 'ad', value: 78500, yoy: 5.3, mom: 2.1 },
            { category: 'social', value: 15000, yoy: 10.5, mom: 5.2 },
            { category: 'organic', value: 0, yoy: 0, mom: 0 }
          ]
        },
        orders: {
          data: [
            { category: 'direct', value: 320, yoy: 3.2, mom: 1.5 },
            { category: 'ad', value: 650, yoy: 8.7, mom: 3.1 },
            { category: 'social', value: 180, yoy: 15.5, mom: 6.3 },
            { category: 'organic', value: 100, yoy: 1.2, mom: 0.5 }
          ]
        },
        averageOrderValue: {
          data: [
            { category: 'direct', value: 265.6, yoy: 2.0, mom: 0.6 },
            { category: 'ad', value: 269.2, yoy: 3.5, mom: 2.6 },
            { category: 'social', value: 250.0, yoy: 2.4, mom: 1.2 },
            { category: 'organic', value: 200.0, yoy: 1.9, mom: 1.0 }
          ]
        },
        conversionRate: {
          data: [
            { category: 'direct', value: 3.6, yoy: 0.3, mom: 0.1 },
            { category: 'ad', value: 2.8, yoy: 0.5, mom: 0.2 },
            { category: 'social', value: 1.9, yoy: 0.4, mom: 0.1 },
            { category: 'organic', value: 2.2, yoy: 0.2, mom: 0.1 }
          ]
        },
        userCost: {
          data: [
            { category: 'direct', value: 0, yoy: 0, mom: 0 },
            { category: 'ad', value: 22.4, yoy: -9.1, mom: -4.2 },
            { category: 'social', value: 15.0, yoy: -12.3, mom: -6.5 },
            { category: 'organic', value: 0, yoy: 0, mom: 0 }
          ]
        },
        bounceRate: {
          data: [
            { category: 'direct', value: 42.5, yoy: -3.2, mom: -1.5 },
            { category: 'ad', value: 38.6, yoy: -4.8, mom: -2.3 },
            { category: 'social', value: 45.2, yoy: -2.6, mom: -1.0 },
            { category: 'organic', value: 35.7, yoy: -5.4, mom: -2.8 }
          ]
        },
        stayDuration: {
          data: [
            { category: 'direct', value: '3:25', rawValue: 205, yoy: 12.4, mom: 5.8 },
            { category: 'ad', value: '2:48', rawValue: 168, yoy: 8.7, mom: 3.2 },
            { category: 'social', value: '1:52', rawValue: 112, yoy: 15.3, mom: 7.6 },
            { category: 'organic', value: '4:10', rawValue: 250, yoy: 5.4, mom: 2.1 }
          ]
        },
        pageViews: {
          data: [
            { category: 'direct', value: 4.8, yoy: 8.2, mom: 3.5 },
            { category: 'ad', value: 3.5, yoy: 5.6, mom: 2.1 },
            { category: 'social', value: 2.7, yoy: 12.5, mom: 5.8 },
            { category: 'organic', value: 5.2, yoy: 3.6, mom: 1.2 }
          ]
        },
        roi: {
          data: [
            { category: 'direct', value: Infinity, yoy: 0, mom: 0 },
            { category: 'ad', value: 222.9, yoy: 6.8, mom: 3.5 },
            { category: 'social', value: 300.0, yoy: 7.1, mom: 2.3 },
            { category: 'organic', value: Infinity, yoy: 0, mom: 0 }
          ]
        },
        conversionCost: {
          data: [
            { category: 'direct', value: 0, yoy: 0, mom: 0 },
            { category: 'ad', value: 120.8, yoy: -3.2, mom: -1.5 },
            { category: 'social', value: 83.3, yoy: -4.5, mom: -1.8 },
            { category: 'organic', value: 0, yoy: 0, mom: 0 }
          ]
        },
        returnRate: {
          data: [
            { category: 'direct', value: 3.8, yoy: -0.2, mom: -0.1 },
            { category: 'ad', value: 4.2, yoy: -0.3, mom: -0.1 },
            { category: 'social', value: 4.5, yoy: -0.2, mom: -0.1 },
            { category: 'organic', value: 3.5, yoy: -0.1, mom: 0 }
          ]
        }
      },
      // 广告平台数据
      adPlatformData: {
        platforms: ['Google Ads', 'Facebook', 'Bing', 'Criteo'],
        totalSales: {
          data: [
            { platform: 'Google Ads', value: 175000, percentage: 53.85 },
            { platform: 'Facebook', value: 85000, percentage: 26.15 },
            { platform: 'Bing', value: 40000, percentage: 12.31 },
            { platform: 'Criteo', value: 25000, percentage: 7.69 }
          ]
        },
        totalCost: {
          data: [
            { platform: 'Google Ads', value: 45000, percentage: 57.32 },
            { platform: 'Facebook', value: 23000, percentage: 29.3 },
            { platform: 'Bing', value: 6500, percentage: 8.28 },
            { platform: 'Criteo', value: 4000, percentage: 5.1 }
          ]
        },
        conversionValue: {
          data: [
            { platform: 'Google Ads', value: 157500 },
            { platform: 'Facebook', value: 73600 },
            { platform: 'Bing', value: 37000 },
            { platform: 'Criteo', value: 21500 }
          ]
        },
        roi: {
          data: [
            { platform: 'Google Ads', value: 350 },
            { platform: 'Facebook', value: 320 },
            { platform: 'Bing', value: 569 },
            { platform: 'Criteo', value: 538 }
          ]
        },
        users: {
          data: [
            { platform: 'Google Ads', value: 3500, percentage: 53.58 },
            { platform: 'Facebook', value: 1800, percentage: 27.56 },
            { platform: 'Bing', value: 750, percentage: 11.48 },
            { platform: 'Criteo', value: 482, percentage: 7.38 }
          ]
        },
        userCost: {
          data: [
            { platform: 'Google Ads', value: 12.86 },
            { platform: 'Facebook', value: 12.78 },
            { platform: 'Bing', value: 8.67 },
            { platform: 'Criteo', value: 8.3 }
          ]
        },
        conversionRate: {
          data: [
            { platform: 'Google Ads', value: 3.2 },
            { platform: 'Facebook', value: 2.7 },
            { platform: 'Bing', value: 2.3 },
            { platform: 'Criteo', value: 2.1 }
          ]
        }
      },
      // 活动数据
      activities: [
        {
          name: '618电商大促',
          timeRange: { start: '2023-06-01', end: '2023-06-18' },
          sales: 250000,
          cost: 50000,
          roi: 340,
          orders: 800,
          orderValue: 312.5,
          conversionRate: 4.2,
          averageOrderValue: 312.5,
          users: 2000,
          userCost: 25,
          channels: 'Google Ads, Facebook, Instagram',
          products: '服装、电子产品、家居用品',
          content: '618年中大促，全场商品8折起，满2000减200'
        },
        {
          name: '新品上线推广',
          timeRange: { start: '2023-05-15', end: '2023-05-30' },
          sales: 120000,
          cost: 30000,
          roi: 300,
          orders: 400,
          orderValue: 300,
          conversionRate: 3.5,
          averageOrderValue: 300,
          users: 1200,
          userCost: 25,
          channels: 'Facebook, Instagram, Pinterest',
          products: '新款春夏服装系列',
          content: '2023春夏新品上市，首发限时9折'
        },
        {
          name: '节日特卖活动',
          timeRange: { start: '2023-04-20', end: '2023-05-05' },
          sales: 180000,
          cost: 40000,
          roi: 315,
          orders: 600,
          orderValue: 300,
          conversionRate: 3.8,
          averageOrderValue: 300,
          users: 1600,
          userCost: 25,
          channels: 'Google Ads, Facebook, Email',
          products: '礼品套装、节日装饰品',
          content: '五一假期特别活动，全场满减，送礼优选'
        }
      ],
      // 产品销量排名数据
      productRankings: [
        {
          id: 1,
          name: '高级保湿面霜',
          category: '护肤品',
          sku: 'SKU001',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiM4ZWM1ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+6aaW57qnPC90ZXh0Pjwvc3ZnPg==',
          sales: 45000,
          orders: 120,
          unitPrice: 375,
          outOfStock: false
        },
        {
          id: 2,
          name: '轻奢真丝连衣裙',
          category: '女装',
          sku: 'SKU002',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmQ2ZTciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+6L+35LioPC90ZXh0Pjwvc3ZnPg==',
          sales: 38000,
          orders: 95,
          unitPrice: 400,
          outOfStock: true,
          lossAmount: 20000
        },
        {
          id: 3,
          name: '智能手表Pro',
          category: '电子产品',
          sku: 'SKU003',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNjMGUwZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+5omL6KGjPC90ZXh0Pjwvc3ZnPg==',
          sales: 36000,
          orders: 72,
          unitPrice: 500,
          outOfStock: false
        },
        {
          id: 4,
          name: '纯棉T恤衫',
          category: '男装',
          sku: 'SKU004',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNlOGYxZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+5aGU6KGjPC90ZXh0Pjwvc3ZnPg==',
          sales: 25000,
          orders: 250,
          unitPrice: 100,
          outOfStock: false
        },
        {
          id: 5,
          name: '便携式蓝牙音箱',
          category: '电子产品',
          sku: 'SKU005',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNkZGZmZDgiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+6Z+z566xPC90ZXh0Pjwvc3ZnPg==',
          sales: 22000,
          orders: 110,
          unitPrice: 200,
          outOfStock: false
        },
        {
          id: 6,
          name: '高性能跑步鞋',
          category: '运动装备',
          sku: 'SKU006',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmU4ZTgiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+6Le06KGjPC90ZXh0Pjwvc3ZnPg==',
          sales: 20000,
          orders: 80,
          unitPrice: 250,
          outOfStock: true,
          lossAmount: 15000
        },
        {
          id: 7,
          name: '厨房多功能料理机',
          category: '家居用品',
          sku: 'SKU007',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmVkYzQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+5paZ5ZqOPC90ZXh0Pjwvc3ZnPg==',
          sales: 18000,
          orders: 45,
          unitPrice: 400,
          outOfStock: false
        },
        {
          id: 8,
          name: '儿童玩具套装',
          category: '玩具',
          sku: 'SKU008',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmQzYzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+546p5YW4PC90ZXh0Pjwvc3ZnPg==',
          sales: 15000,
          orders: 100,
          unitPrice: 150,
          outOfStock: false
        },
        {
          id: 9,
          name: '时尚真皮手提包',
          category: '配饰',
          sku: 'SKU009',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNlYmU1ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+5omL5YyFPC90ZXh0Pjwvc3ZnPg==',
          sales: 14000,
          orders: 35,
          unitPrice: 400,
          outOfStock: false
        },
        {
          id: 10,
          name: '多功能办公椅',
          category: '家具',
          sku: 'SKU010',
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+5Yqe5YWsPC90ZXh0Pjwvc3ZnPg==',
          sales: 12000,
          orders: 30,
          unitPrice: 400,
          outOfStock: false
        }
      ],
      // 合作红人数据
      influencerData: {
        summary: {
          totalCount: 120,
          newCount: 12,
          avgEngagement: 4.8, // 平均互动率(%)
          totalPosts: 45 // 合作帖子总数
        },
        list: [
          {
            id: 1,
            name: 'Emily Johnson',
            account: '@emily_beauty',
            platform: 'Instagram',
            category: 'Beauty',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2ZmYzBjYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMzMzIj5FSjwvdGV4dD48L3N2Zz4=',
            followers: 2500000,
            engagementChange: 5.2, // 互动数变化(%)
            postsCount: 12
          },
          {
            id: 2,
            name: 'Mark Wilson',
            account: '@markwilson_tech',
            platform: 'YouTube',
            category: 'Technology',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2FkZThmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMzMzIj5NVzwvdGV4dD48L3N2Zz4=',
            followers: 1800000,
            engagementChange: 3.7,
            postsCount: 8
          },
          {
            id: 3,
            name: 'Sarah Chen',
            account: '@sarahchen',
            platform: 'TikTok',
            category: 'Fashion',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2IyZmZiNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMzMzIj5TQzwvdGV4dD48L3N2Zz4=',
            followers: 1200000,
            engagementChange: 6.5,
            postsCount: 9
          },
          {
            id: 4,
            name: 'Alex Rodriguez',
            account: '@alex_lifestyle',
            platform: 'Instagram',
            category: 'Lifestyle',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2ZmZjJiMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMzMzIj5BUjwvdGV4dD48L3N2Zz4=',
            followers: 950000,
            engagementChange: 4.1,
            postsCount: 7
          },
          {
            id: 5,
            name: 'Julia Smith',
            account: '@julia_cooking',
            platform: 'YouTube',
            category: 'Cooking',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2RjZmZkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMzMzIj5KUzwvdGV4dD48L3N2Zz4=',
            followers: 850000,
            engagementChange: 3.8,
            postsCount: 6
          },
          {
            id: 6,
            name: 'Ryan Thompson',
            account: '@ryan_fitness',
            platform: 'Instagram',
            category: 'Fitness',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2ZmZDJiMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMzMzIj5SVDwvdGV4dD48L3N2Zz4=',
            followers: 750000,
            engagementChange: 2.9,
            postsCount: 5
          },
          {
            id: 7,
            name: 'Sophia Williams',
            account: '@sophia_parenting',
            platform: 'YouTube',
            category: 'Parenting',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2ZmZjhjMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMzMzIj5TVzwvdGV4dD48L3N2Zz4=',
            followers: 680000,
            engagementChange: 5.2,
            postsCount: 4
          },
          {
            id: 8,
            name: 'Tom Harris',
            account: '@tom_gaming',
            platform: 'Twitch',
            category: 'Gaming',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI2Q5ZDlmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjMzMzIj5USDwvdGV4dD48L3N2Zz4=',
            followers: 580000,
            engagementChange: 7.3,
            postsCount: 3
          }
        ],
        // 添加热门合作帖子
        posts: [
          {
            id: 1,
            title: "Summer Collection Unboxing",
            content: "Check out our latest summer collection! Perfect for beach days and outdoor activities. #SummerVibes #NewCollection",
            influencer: "Emily Johnson",
            platform: "Instagram",
            engagementCount: 156000,
            postDate: "2023-06-15",
            imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmVkYzQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+U3VtbWVyIENvbGxlY3Rpb248L3RleHQ+PC9zdmc+"
          },
          {
            id: 2,
            title: "Tech Review: Latest Smart Devices",
            content: "In this video, I review the newest smart home gadgets that will transform your living space. Full comparison and recommendations included!",
            influencer: "Mark Wilson",
            platform: "YouTube",
            engagementCount: 89500,
            postDate: "2023-05-28",
            imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNjMGUwZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+VGVjaCBSZXZpZXc8L3RleHQ+PC9zdmc+"
          },
          {
            id: 3,
            title: "Spring Fashion Trends 2023",
            content: "These are the must-have pieces for your spring wardrobe! Styling tips included for every body type. #FashionTrends #SpringStyle",
            influencer: "Sarah Chen",
            platform: "TikTok",
            engagementCount: 124700,
            postDate: "2023-04-12",
            imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmQ2ZTciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+U3ByaW5nIEZhc2hpb248L3RleHQ+PC9zdmc+"
          },
          {
            id: 4,
            title: "10-Minute Healthy Breakfast Ideas",
            content: "Start your day right with these quick and nutritious breakfast recipes. Perfect for busy mornings! #HealthyEating #QuickRecipes",
            influencer: "Julia Smith",
            platform: "YouTube",
            engagementCount: 76800,
            postDate: "2023-06-02",
            imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNkY2ZmZGQiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+SGVhbHRoeSBCcmVha2Zhc3Q8L3RleHQ+PC9zdmc+"
          },
          {
            id: 5,
            title: "Home Workout Challenge: 30 Days to Transform",
            content: "Join me for this 30-day fitness challenge! No equipment needed, just 15 minutes per day to see real results. #FitnessChallenge #HomeWorkout",
            influencer: "Ryan Thompson",
            platform: "Instagram",
            engagementCount: 95300,
            postDate: "2023-05-10",
            imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmQyYjMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+Rml0bmVzcyBDaGFsbGVuZ2U8L3RleHQ+PC9zdmc+"
          }
        ]
      }
    }
  },
  methods: {
    // 查看活动详情
    viewActivityDetails(activity) {
      this.selectedActivity = activity;
      // 可以在这里添加记录浏览历史或其他逻辑
    },
    
    // 返回到仪表板
    backToDashboard() {
      this.selectedActivity = null;
      // 可以在这里添加恢复状态或其他逻辑
    },
    
    // 现有方法保持不变
    updateClient(client) {
      this.selectedClient = client;
      // 这里应该有实际的数据加载逻辑
    },
    updateProject(project) {
      this.selectedProject = project;
      // 这里应该有实际的数据加载逻辑
    },
    updateTimeRange(timeRange) {
      this.timeRange = timeRange;
      // 这里应该有实际的数据加载逻辑
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}
</style> 