<template>
  <div class="project-management">
    <h1 class="page-title">项目管理</h1>
    
    <div class="tab-navigation">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'list' }"
        @click="activeTab = 'list'"
      >
        项目列表
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'targets' }"
        @click="activeTab = 'targets'"
      >
        项目目标管理
      </button>
    </div>
    
    <div class="tab-content">
      <ProjectList v-if="activeTab === 'list'" :projects="projects" />
      <ProjectTargets v-else-if="activeTab === 'targets'" :projectTargets="projectTargets" :clientList="clientList" :projectList="projects" />
    </div>
  </div>
</template>

<script>
import ProjectList from './ProjectList.vue';
import ProjectTargets from './ProjectTargets.vue';

export default {
  name: 'ProjectManagement',
  components: {
    ProjectList,
    ProjectTargets
  },
  data() {
    return {
      activeTab: 'list',
      // 模拟数据 - 实际项目中应从API获取
      projects: [
        {
          id: 1,
          name: '电商广告投放项目',
          status: '进行中',
          startDate: '2023-01-15',
          endDate: '2023-12-31',
          expiryDate: '2023-06-30',
          team: '数字营销团队',
          channels: 'Google Ads, Facebook, Instagram',
          totalFee: 150000,
          targets: {
            sales: { target: 500000, current: 325000 },
            profit: { target: 150000, current: 112000 },
            cost: { target: 100000, current: 78500 },
            roi: { target: 350, current: 312 },
            users: { target: 10000, current: 6532 }
          }
        },
        {
          id: 2,
          name: '品牌推广项目',
          status: '进行中',
          startDate: '2023-03-01',
          endDate: '2023-08-31',
          expiryDate: '2023-07-15',
          team: '品牌推广团队',
          channels: 'YouTube, Facebook, Twitter',
          totalFee: 120000,
          targets: {
            sales: { target: 300000, current: 180000 },
            profit: { target: 90000, current: 68000 },
            cost: { target: 70000, current: 42000 },
            roi: { target: 320, current: 290 },
            users: { target: 8000, current: 4200 }
          }
        },
        {
          id: 3,
          name: '新品上市推广',
          status: '计划中',
          startDate: '2023-07-01',
          endDate: '2023-12-31',
          expiryDate: '2023-12-31',
          team: '产品推广团队',
          channels: 'Google Ads, Instagram, Pinterest',
          totalFee: 80000,
          targets: {
            sales: { target: 200000, current: 0 },
            profit: { target: 60000, current: 0 },
            cost: { target: 50000, current: 0 },
            roi: { target: 300, current: 0 },
            users: { target: 5000, current: 0 }
          }
        },
        {
          id: 4,
          name: '海外市场拓展',
          status: '已完成',
          startDate: '2022-09-15',
          endDate: '2023-03-15',
          expiryDate: '2023-03-15',
          team: '国际业务团队',
          channels: 'Google Ads, Bing, Criteo',
          totalFee: 200000,
          targets: {
            sales: { target: 800000, current: 750000 },
            profit: { target: 240000, current: 215000 },
            cost: { target: 180000, current: 175000 },
            roi: { target: 380, current: 360 },
            users: { target: 15000, current: 12800 }
          }
        },
        {
          id: 5,
          name: '节日营销活动',
          status: '即将开始',
          startDate: '2023-11-01',
          endDate: '2024-01-15',
          expiryDate: '2024-01-15',
          team: '活动策划团队',
          channels: 'Facebook, Instagram, TikTok',
          totalFee: 100000,
          targets: {
            sales: { target: 400000, current: 0 },
            profit: { target: 120000, current: 0 },
            cost: { target: 80000, current: 0 },
            roi: { target: 350, current: 0 },
            users: { target: 12000, current: 0 }
          }
        }
      ],
      projectTargets: [
        {
          id: 1,
          projectName: '电商广告投放项目',
          clientName: '上海某科技有限公司',
          salesTarget: 500000,
          profitTarget: 150000,
          costTarget: 100000,
          roiTarget: 350,
          usersTarget: 10000,
          targetMonth: '2023-06',
          currentSales: 325000,
          currentProfit: 112000,
          currentCost: 78500,
          currentRoi: 312,
          currentUsers: 6532
        },
        {
          id: 2,
          projectName: '品牌推广项目',
          clientName: '北京某贸易有限公司',
          salesTarget: 300000,
          profitTarget: 90000,
          costTarget: 70000,
          roiTarget: 320,
          usersTarget: 8000,
          targetMonth: '2023-06',
          currentSales: 180000,
          currentProfit: 68000,
          currentCost: 42000,
          currentRoi: 290,
          currentUsers: 4200
        },
        {
          id: 3,
          projectName: '电商广告投放项目',
          clientName: '上海某科技有限公司',
          salesTarget: 520000,
          profitTarget: 160000,
          costTarget: 110000,
          roiTarget: 360,
          usersTarget: 11000,
          targetMonth: '2023-07',
          currentSales: 260000,
          currentProfit: 84000,
          currentCost: 65000,
          currentRoi: 310,
          currentUsers: 5300
        },
        {
          id: 4,
          projectName: '品牌推广项目',
          clientName: '北京某贸易有限公司',
          salesTarget: 320000,
          profitTarget: 98000,
          costTarget: 75000,
          roiTarget: 330,
          usersTarget: 8500,
          targetMonth: '2023-07',
          currentSales: 130000,
          currentProfit: 42000,
          currentCost: 38000,
          currentRoi: 270,
          currentUsers: 3800
        },
        {
          id: 5,
          projectName: '新品上市推广',
          clientName: '广州某电子商务有限公司',
          salesTarget: 200000,
          profitTarget: 60000,
          costTarget: 50000,
          roiTarget: 300,
          usersTarget: 5000,
          targetMonth: '2023-07',
          currentSales: 0,
          currentProfit: 0,
          currentCost: 15000,
          currentRoi: 0,
          currentUsers: 0
        }
      ],
      clientList: [
        { id: 1, name: '上海某科技有限公司' },
        { id: 2, name: '北京某贸易有限公司' },
        { id: 3, name: '广州某电子商务有限公司' },
        { id: 4, name: '深圳某网络科技有限公司' },
        { id: 5, name: '杭州某文化传媒有限公司' }
      ]
    };
  }
};
</script>

<style scoped>
.project-management {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}

.tab-navigation {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button:hover {
  color: #1976d2;
}

.tab-button.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
  font-weight: 500;
}

.tab-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style> 