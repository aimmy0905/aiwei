<template>
  <div class="product-ranking">
    <h2 class="module-title">产品销量排名</h2>
    
    <div class="product-list">
      <div class="product-list-header">
        <div class="col-rank">排名</div>
        <div class="col-image">商品图片</div>
        <div class="col-name">商品名称</div>
        <div class="col-category">分类</div>
        <div class="col-sku">SKU</div>
        <div class="col-sales">销售额</div>
        <div class="col-orders">订单数</div>
        <div class="col-unit-price">客单价</div>
        <div class="col-stock">库存状态</div>
      </div>
      
      <div 
        v-for="(product, index) in productRankings" 
        :key="product.id"
        class="product-list-item"
      >
        <div class="col-rank">
          <div 
            class="rank-badge"
            :class="{
              'top-1': index === 0,
              'top-2': index === 1,
              'top-3': index === 2
            }"
          >
            {{ index + 1 }}
          </div>
        </div>
        <div class="col-image">
          <div class="image-container">
            <img 
              :src="product.image" 
              :alt="product.name" 
              class="product-image"
              @error="handleImageError"
              :data-product-id="product.id"
              :key="'img-' + product.id"
            >
            <div class="image-placeholder" v-if="isImageFailed(product.id)">
              {{ getProductInitials(product.name) }}
            </div>
          </div>
        </div>
        <div class="col-name">{{ product.name }}</div>
        <div class="col-category">{{ product.category }}</div>
        <div class="col-sku">{{ product.sku }}</div>
        <div class="col-sales">¥{{ formatNumber(product.sales) }}</div>
        <div class="col-orders">{{ formatNumber(product.orders) }}</div>
        <div class="col-unit-price">¥{{ formatNumber(product.unitPrice) }}</div>
        <div class="col-stock">
          <span 
            class="stock-status"
            :class="{ 'out-of-stock': product.outOfStock }"
          >
            {{ product.outOfStock ? '缺货' : '正常' }}
          </span>
          <div v-if="product.outOfStock" class="out-of-stock-loss">
            <span class="loss-label">损失:</span>
            <span class="loss-value">¥{{ formatNumber(product.lossAmount) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="product-summary">
      <h3 class="summary-title">产品销量小结</h3>
      <div class="summary-content">
        <p>Top 3产品贡献了总销售额的35%，其中"高级保湿面霜"表现最好，客单价高达380元。</p>
        <p>有2个热销产品处于缺货状态，预计损失销售额约3.5万元，建议立即补货。</p>
        <p>注意到女装类目产品销量环比增长25%，可考虑增加相关产品投放。</p>
      </div>
      <div class="summary-actions">
        <button class="view-all-btn">查看所有产品</button>
        <button class="edit-summary-btn">编辑小结</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductRanking',
  props: {
    productRankings: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      failedImages: new Set()
    }
  },
  methods: {
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    handleImageError(event) {
      // 存储加载失败的图片ID
      const productId = event.target.getAttribute('data-product-id');
      this.failedImages.add(productId.toString());
      
      // 隐藏实际的img元素
      event.target.style.display = 'none';
    },
    isImageFailed(productId) {
      return this.failedImages.has(productId.toString());
    },
    getProductInitials(name) {
      if (!name) return '?';
      
      // Get the first two characters of the product name
      const initials = name.substring(0, 2);
      return initials;
    }
  }
}
</script>

<style scoped>
.product-ranking {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  padding: 20px;
}

.module-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
}

.product-list {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 20px;
}

.product-list-header {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.product-list-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.product-list-item:last-child {
  border-bottom: none;
}

.product-list-item:hover {
  background-color: #f9f9f9;
}

.col-rank {
  width: 60px;
  text-align: center;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #666;
  font-weight: 500;
}

.rank-badge.top-1 {
  background-color: #f8d64e;
  color: #333;
}

.rank-badge.top-2 {
  background-color: #c0c0c0;
  color: #333;
}

.rank-badge.top-3 {
  background-color: #cd7f32;
  color: white;
}

.col-image {
  width: 80px;
}

.image-container {
  position: relative;
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 4px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  color: #666;
  font-weight: 500;
  font-size: 1.2rem;
}

.col-name {
  flex: 2;
  padding: 0 10px;
}

.col-category {
  width: 80px;
  padding: 0 10px;
}

.col-sku {
  width: 100px;
}

.col-sales, .col-orders, .col-unit-price {
  width: 100px;
  text-align: right;
}

.col-stock {
  width: 100px;
  text-align: center;
}

.stock-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: #e8f5e9;
  color: #4caf50;
  font-size: 0.8rem;
}

.stock-status.out-of-stock {
  background-color: #ffebee;
  color: #f44336;
}

.out-of-stock-loss {
  margin-top: 5px;
  font-size: 0.8rem;
  color: #666;
}

.loss-value {
  color: #f44336;
  font-weight: 500;
}

.product-summary {
  background-color: #f5f7fa;
  border-radius: 6px;
  padding: 15px;
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
  gap: 10px;
  margin-top: 10px;
}

.view-all-btn {
  background-color: #1976d2;
  border: none;
  color: white;
  font-size: 0.9rem;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background-color: #1565c0;
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

@media (max-width: 768px) {
  .col-sku,
  .col-category {
    display: none;
  }
  
  .col-name {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>