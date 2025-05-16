<template>
  <div class="product-management">
    <h1 class="page-title">产品数据管理</h1>
    
    <!-- 产品列表 -->
    <div class="product-container">
      <ProductList />
    </div>
  </div>
</template>

<script>
import ProductList from './ProductList.vue';

export default {
  name: 'ProductManagement',
  components: {
    ProductList
  }
};
</script>

<style scoped>
.product-management {
  padding: 20px;
}

.page-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}

.product-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style> 