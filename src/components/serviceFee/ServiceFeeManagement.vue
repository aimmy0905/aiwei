<template>
  <div class="service-fee-management">
    <h1 class="page-title">服务费管理</h1>
    
    <!-- 服务费列表 -->
    <div class="service-fee-container">
      <ServiceFeeList />
    </div>
  </div>
</template>

<script>
import ServiceFeeList from './ServiceFeeList.vue';

export default {
  name: 'ServiceFeeManagement',
  components: {
    ServiceFeeList
  }
};
</script>

<style scoped>
.service-fee-management {
  padding: 20px;
}

.page-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}

.service-fee-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style> 