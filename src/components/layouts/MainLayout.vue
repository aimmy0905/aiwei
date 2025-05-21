<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">
        <h1>艾维数据整合平台</h1>
      </div>
      <div class="header-actions">
        <div class="notification-center">
          <span class="icon notification-icon">
            <i class="notification-badge" v-if="unreadNotifications > 0">{{ unreadNotifications }}</i>
            <i class="fas fa-bell"></i>
          </span>
        </div>
        <div class="user-center">
          <span class="icon user-icon"><i class="fas fa-user"></i></span>
          <span class="username">{{ username }}</span>
          <span class="dropdown-icon"><i class="fas fa-chevron-down"></i></span>
          <!-- 用户下拉菜单 (简化版) -->
          <div class="user-dropdown">
            <ul>
              <li>个人设置</li>
              <li>修改密码</li>
              <li>退出登录</li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <div class="content-container">
      <!-- 侧边栏导航 -->
      <aside class="sidebar">
        <nav>
          <ul class="nav-menu">
            <li class="nav-item" :class="{ active: isActive('dashboard') }">
              <router-link to="/dashboard">
                <span class="icon"><i class="fas fa-chart-bar"></i></span>
                <span class="title">数据看板</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: isActive('organization') }">
              <router-link to="/organization">
                <span class="icon"><i class="fas fa-building"></i></span>
                <span class="title">组织架构</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: isActive('performance') }">
              <router-link to="/performance">
                <span class="icon"><i class="fas fa-chart-line"></i></span>
                <span class="title">业绩管理</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: isActive('project') }">
              <router-link to="/project">
                <span class="icon"><i class="fas fa-clipboard-list"></i></span>
                <span class="title">项目管理</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: isActive('service') }">
              <router-link to="/service">
                <span class="icon"><i class="fas fa-money-bill-wave"></i></span>
                <span class="title">服务费管理</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: isActive('customer') }">
              <router-link to="/customer">
                <span class="icon"><i class="fas fa-users"></i></span>
                <span class="title">客户管理</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: isActive('activity') }">
              <router-link to="/activity">
                <span class="icon"><i class="fas fa-bullseye"></i></span>
                <span class="title">活动管理</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: isActive('product') }">
              <router-link to="/product">
                <span class="icon"><i class="fas fa-box"></i></span>
                <span class="title">产品管理</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: isActive('competitor') }">
              <router-link to="/competitor">
                <span class="icon"><i class="fas fa-search"></i></span>
                <span class="title">竞品管理</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: isActive('influencer') }">
              <router-link to="/influencer">
                <span class="icon"><i class="fas fa-star"></i></span>
                <span class="title">红人管理</span>
              </router-link>
            </li>
            <li class="nav-item" :class="{ active: isActive('report') }">
              <router-link to="/report">
                <span class="icon"><i class="fas fa-file-alt"></i></span>
                <span class="title">周报/月报</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainLayout',
  data() {
    return {
      username: '张三',
      unreadNotifications: 5
    }
  },
  computed: {
    currentRoute() {
      return this.$route.path;
    }
  },
  methods: {
    isActive(routeName) {
      return this.currentRoute.includes(routeName);
    }
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

/* 顶部导航栏样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  background-color: #1976d2;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
}

.notification-center, .user-center {
  position: relative;
  margin-left: 20px;
  cursor: pointer;
}

.icon {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}

.notification-icon {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  background-color: #ff4081;
  color: white;
  border-radius: 50%;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-center {
  display: flex;
  align-items: center;
}

.username {
  margin: 0 5px;
  font-size: 0.9rem;
}

.dropdown-icon {
  font-size: 0.7rem;
}

.user-dropdown {
  display: none;
  position: absolute;
  top: 40px;
  right: 0;
  width: 150px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.user-center:hover .user-dropdown {
  display: block;
}

.user-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-dropdown li {
  padding: 10px 15px;
  color: #333;
  transition: background-color 0.2s;
}

.user-dropdown li:hover {
  background-color: #f5f5f5;
}

/* 内容区域样式 */
.content-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 侧边栏样式 */
.sidebar {
  width: 220px;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
}

.nav-menu {
  list-style: none;
  padding: 15px 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 5px;
}

.nav-item a,
.nav-item router-link {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #333;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-item a:hover,
.nav-item router-link:hover {
  background-color: rgba(25, 118, 210, 0.05);
}

.nav-item.active a,
.nav-item.active router-link,
.router-link-active {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976d2;
  font-weight: 500;
}

.nav-item .icon {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style> 