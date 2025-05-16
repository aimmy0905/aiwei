<template>
  <div class="product-ranking">
    <h2 class="module-title">产品销量排名</h2>
    
    <div class="ranking-table">
      <div class="table-header">
        <div class="col-rank">排名</div>
        <div class="col-image">图片</div>
        <div class="col-product">产品名称</div>
        <div class="col-category">分类</div>
        <div class="col-sales">销售额</div>
        <div class="col-orders">订单数</div>
        <div class="col-unit-price">客单价</div>
        <div class="col-stock">库存状态</div>
      </div>
      
      <div 
        v-for="(product, index) in productRankings" 
        :key="product.id"
        class="product-item"
        :class="{ 'out-of-stock': product.outOfStock }"
      >
        <div class="col-rank">
          <div 
            class="rank-badge"
            :class="{
              'rank-1': index === 0,
              'rank-2': index === 1,
              'rank-3': index === 2
            }"
          >
            {{ index + 1 }}
          </div>
        </div>
        <div class="col-image">
          <div class="product-image-container">
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
        <div class="col-product">
          <div class="product-name">{{ product.name }}</div>
          <div class="product-sku">{{ product.sku }}</div>
        </div>
        <div class="col-category">{{ product.category }}</div>
        <div class="col-sales">¥{{ formatNumber(product.sales) }}</div>
        <div class="col-orders">{{ formatNumber(product.orders) }}</div>
        <div class="col-unit-price">¥{{ formatNumber(product.unitPrice) }}</div>
        <div class="col-stock">
          <span 
            class="stock-status"
            :class="{ 'out-of-stock': product.outOfStock }"
          >
            {{ product.outOfStock ? '缺货' : '有货' }}
          </span>
          <span v-if="product.outOfStock" class="stock-loss">
            损失: ¥{{ formatNumber(product.lossAmount || 0) }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="ranking-summary">
      <h3 class="summary-title">产品销量小结</h3>
      <div class="summary-content">
        <p>高级保湿面霜是本月销售冠军，订单量和销售额领先其他产品，保持良好的库存状态。</p>
        <p>轻奢真丝连衣裙和高性能跑步鞋出现缺货，建议增加备货以减少销售损失。</p>
        <p>电子产品类别整体表现强劲，智能手表和便携式蓝牙音箱进入前五名。</p>
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
    };
  },
  methods: {
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    handleImageError(event) {
      // 存储加载失败的图片ID
      const productId = event.target.getAttribute('data-product-id');
      this.failedImages.add(productId);
      
      // 隐藏实际的img元素
      event.target.style.display = 'none';
    },
    isImageFailed(productId) {
      return this.failedImages.has(productId.toString());
    },
    getProductInitials(name) {
      if (!name) return '?';
      
      // 获取产品名称的前两个字符作为首字母缩写
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

.ranking-table {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  background-color: #f5f7fa;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
  font-size: 0.9rem;
  color: #666;
}

.product-item {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.product-item:last-child {
  border-bottom: none;
}

.product-item:hover {
  background-color: #f9f9f9;
}

.product-item.out-of-stock {
  background-color: #fff8f8;
}

.col-rank {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  color: #666;
  font-weight: 500;
}

.rank-badge.rank-1 {
  background-color: #ffd700;
  color: #333;
}

.rank-badge.rank-2 {
  background-color: #c0c0c0;
  color: #333;
}

.rank-badge.rank-3 {
  background-color: #cd7f32;
  color: white;
}

.col-image {
  width: 80px;
  padding: 0 10px;
}

.product-image-container {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
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
  background-color: #f0f0f0;
  color: #666;
  font-weight: 500;
}

.col-product {
  flex: 1;
  padding-right: 10px;
  min-width: 0; /* 防止文本溢出 */
}

.product-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-sku {
  font-size: 0.85rem;
  color: #888;
}

.col-category {
  width: 100px;
  display: flex;
  align-items: center;
  color: #666;
}

.col-sales {
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: 500;
  color: #1976d2;
}

.col-orders {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #666;
}

.col-unit-price {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #666;
}

.col-stock {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.stock-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  background-color: #e8f5e9;
  color: #4caf50;
}

.stock-status.out-of-stock {
  background-color: #ffebee;
  color: #f44336;
}

.stock-loss {
  font-size: 0.8rem;
  color: #f44336;
  margin-top: 4px;
}

.ranking-summary {
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
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
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
</style> 