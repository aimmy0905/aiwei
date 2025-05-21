<template>
  <div class="competitor-management">
    <h1>竞品管理</h1>
    
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'products' }" 
        @click="activeTab = 'products'"
      >
        竞品商品
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'activities' }" 
        @click="activeTab = 'activities'"
      >
        竞品网站活动
      </div>
    </div>
    
    <div class="tab-content">
      <competitor-products v-if="activeTab === 'products'" />
      <competitor-activities v-if="activeTab === 'activities'" />
    </div>
  </div>
</template>

<script>
import CompetitorProducts from './CompetitorProducts.vue';
import CompetitorActivities from './CompetitorActivities.vue';

export default {
  name: 'CompetitorManagement',
  components: {
    CompetitorProducts,
    CompetitorActivities
  },
  data() {
    return {
      activeTab: 'products'
    }
  }
}
</script>

<style scoped>
.competitor-management {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
  font-size: 1.8rem;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  font-weight: 500;
}

.tab:hover {
  background-color: rgba(25, 118, 210, 0.05);
}

.tab.active {
  border-bottom: 2px solid #1976d2;
  color: #1976d2;
}

.tab-content {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style> 