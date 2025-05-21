import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'

// 导入组件
import PerformanceManagement from './components/performance/PerformanceManagement.vue'
import CreateEmployeeGoal from './components/performance/CreateEmployeeGoal.vue'
import ReportManagement from './components/report/ReportManagement.vue'
import CreateReport from './components/report/CreateReport.vue'

// 创建路由
const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: () => import('./components/dashboard/Dashboard.vue') },
  { path: '/organization', component: () => import('./components/organization/OrganizationManagement.vue') },
  { path: '/performance', component: PerformanceManagement },
  { 
    path: '/performance/create-goal', 
    component: CreateEmployeeGoal,
    name: 'create-employee-goal'
  },
  { path: '/project', component: () => import('./components/project/ProjectManagement.vue') },
  { path: '/service', component: () => import('./components/serviceFee/ServiceFeeManagement.vue') },
  { path: '/customer', component: () => import('./components/customer/CustomerManagement.vue') },
  { path: '/activity', component: () => import('./components/activity/ActivityManagement.vue') },
  { path: '/product', component: () => import('./components/product/ProductManagement.vue') },
  { path: '/competitor', component: () => import('./components/competitor/CompetitorManagement.vue') },
  { path: '/influencer', component: () => import('./components/influencer/InfluencerManagement.vue') },
  { path: '/report', component: ReportManagement },
  { path: '/report/create', component: CreateReport }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 创建应用并挂载
const app = createApp(App)
app.use(router)
app.mount('#app')
