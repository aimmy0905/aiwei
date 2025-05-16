<template>
  <div class="activity-management">
    <h1 class="page-title">活动管理</h1>
    
    <!-- 活动列表 -->
    <div class="activity-container">
      <ActivityList />
    </div>
  </div>
</template>

<script>
import ActivityList from './ActivityList.vue';

export default {
  name: 'ActivityManagement',
  components: {
    ActivityList
  }
};
</script>

<style scoped>
.activity-management {
  padding: 20px;
}

.page-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}

.activity-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style> 