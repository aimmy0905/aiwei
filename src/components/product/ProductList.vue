<template>
  <div class="product-list-container">
    <div class="filters-section">
      <div class="search-filter">
        <input 
          type="text" 
          placeholder="搜索产品名称/SKU..." 
          v-model="searchQuery"
          @input="filterProducts"
        />
        <button class="search-button">
          <i class="search-icon">🔍</i>
        </button>
      </div>
      
      <div class="filter-controls">
        <div class="filter-group">
          <label>分类筛选:</label>
          <select v-model="categoryFilter" @change="filterProducts">
            <option value="">全部分类</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>库存状态:</label>
          <select v-model="stockFilter" @change="filterProducts">
            <option value="">全部</option>
            <option value="in-stock">有货</option>
            <option value="out-of-stock">缺货</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>排序:</label>
          <select v-model="sortOrder" @change="filterProducts">
            <option value="sales-desc">销量 (高-低)</option>
            <option value="sales-asc">销量 (低-高)</option>
            <option value="price-desc">价格 (高-低)</option>
            <option value="price-asc">价格 (低-高)</option>
            <option value="orders-desc">订单数 (高-低)</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="product-table">
      <div class="table-header">
        <div class="cell-image">图片</div>
        <div class="cell-name">产品名称</div>
        <div class="cell-category">产品分类</div>
        <div class="cell-sku">产品编号</div>
        <div class="cell-price">产品单价</div>
        <div class="cell-sales">销售额</div>
        <div class="cell-orders">订单数</div>
        <div class="cell-unit-price">客单件</div>
        <div class="cell-stock">库存状态</div>
        <div class="cell-price-change">价格波动</div>
        <div class="cell-actions">操作</div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="filteredProducts.length === 0" class="empty-message">
        没有找到匹配的产品
      </div>
      
      <div v-else class="table-body">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="table-row"
          :class="{ 'out-of-stock': product.outOfStock }"
        >
          <div class="cell-image">
            <div class="image-container">
              <img 
                :src="product.image" 
                :alt="product.name"
                class="product-image"
                @error="handleImageError"
                :data-product-id="product.id"
              >
              <div class="image-placeholder" v-if="isImageFailed(product.id)">
                {{ getProductInitials(product.name) }}
              </div>
            </div>
          </div>
          <div class="cell-name">
            <div class="product-name">{{ product.name }}</div>
          </div>
          <div class="cell-category">{{ product.category }}</div>
          <div class="cell-sku">{{ product.sku }}</div>
          <div class="cell-price">¥{{ formatNumber(product.price) }}</div>
          <div class="cell-sales">¥{{ formatNumber(product.sales) }}</div>
          <div class="cell-orders">{{ formatNumber(product.orders) }}</div>
          <div class="cell-unit-price">¥{{ formatNumber(product.unitPrice) }}</div>
          <div class="cell-stock">
            <span class="stock-status" :class="{ 'status-out': product.outOfStock }">
              {{ product.outOfStock ? '缺货' : '有货' }}
            </span>
            <span v-if="product.outOfStock" class="stock-loss">
              损失: ¥{{ formatNumber(product.lossAmount || 0) }}
            </span>
          </div>
          <div class="cell-price-change">
            <span 
              class="price-change" 
              :class="{
                'price-increase': product.priceChange > 0,
                'price-decrease': product.priceChange < 0,
                'price-stable': product.priceChange === 0,
                'price-alert': Math.abs(product.priceChange) >= 10
              }"
            >
              {{ formatPriceChange(product.priceChange) }}
            </span>
          </div>
          <div class="cell-actions">
            <button class="action-btn view-btn" @click="viewProduct(product)">查看</button>
            <button 
              class="action-btn alert-btn" 
              @click="setAlert(product)"
              :class="{ 'active': product.hasAlert }"
            >
              {{ product.hasAlert ? '已设提醒' : '设置提醒' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pagination">
      <button 
        class="pagination-btn" 
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        上一页
      </button>
      <span class="pagination-info">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button 
        class="pagination-btn" 
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        下一页
      </button>
    </div>
    
    <div class="sync-section">
      <button class="sync-btn" @click="syncShopifyData">
        <span class="sync-icon">🔄</span>
        同步Shopify产品数据
      </button>
      <span class="last-sync" v-if="lastSyncTime">
        上次同步: {{ lastSyncTime }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      filteredProducts: [],
      categories: [],
      loading: true,
      searchQuery: '',
      categoryFilter: '',
      stockFilter: '',
      sortOrder: 'sales-desc',
      currentPage: 1,
      pageSize: 10,
      lastSyncTime: null,
      failedImages: new Set(),
      selectedProductId: null,
      showProductDetail: false
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pageSize);
    },
    paginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredProducts.slice(startIndex, endIndex);
    }
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    fetchProducts() {
      // 在真实项目中，这里会从API获取产品数据
      // 模拟加载状态
      this.loading = true;
      
      // 模拟API请求
      setTimeout(() => {
        // 假数据
        this.products = [
          {
            id: 1,
            name: '高级保湿面霜',
            category: '护肤品',
            sku: 'SKU001',
            image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiM4ZWM1ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+6aaW57qnPC90ZXh0Pjwvc3ZnPg==',
            price: 199,
            sales: 45000,
            orders: 120,
            unitPrice: 375,
            outOfStock: false,
            priceChange: 0,
            hasAlert: false
          },
          {
            id: 2,
            name: '轻奢真丝连衣裙',
            category: '女装',
            sku: 'SKU002',
            image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmQ2ZTciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+6L+35LioPC90ZXh0Pjwvc3ZnPg==',
            price: 1299,
            sales: 38000,
            orders: 95,
            unitPrice: 400,
            outOfStock: true,
            lossAmount: 20000,
            priceChange: -15,
            hasAlert: true
          },
          {
            id: 3,
            name: '智能手表Pro',
            category: '电子产品',
            sku: 'SKU003',
            image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNjMGUwZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+5omL6KGjPC90ZXh0Pjwvc3ZnPg==',
            price: 1399,
            sales: 36000,
            orders: 72,
            unitPrice: 500,
            outOfStock: false,
            priceChange: 8,
            hasAlert: false
          },
          {
            id: 4,
            name: '高性能跑步鞋',
            category: '运动装备',
            sku: 'SKU004',
            image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmU4YzciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+6LW15pabPC90ZXh0Pjwvc3ZnPg==',
            price: 799,
            sales: 32000,
            orders: 80,
            unitPrice: 400,
            outOfStock: true,
            lossAmount: 16000,
            priceChange: 12,
            hasAlert: true
          },
          {
            id: 5,
            name: '便携式蓝牙音箱',
            category: '电子产品',
            sku: 'SKU005',
            image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNkMWZmZDEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+6Z+z566tPC90ZXh0Pjwvc3ZnPg==',
            price: 349,
            sales: 28000,
            orders: 110,
            unitPrice: 254.55,
            outOfStock: false,
            priceChange: -5,
            hasAlert: false
          }
        ];
        
        // 提取所有类别
        this.categories = [...new Set(this.products.map(p => p.category))];
        
        // 默认排序和筛选
        this.filterProducts();
        this.loading = false;
        
        // 设置最后同步时间
        this.lastSyncTime = new Date().toLocaleString();
      }, 800);
    },
    filterProducts() {
      let result = [...this.products];
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.sku.toLowerCase().includes(query)
        );
      }
      
      // 分类过滤
      if (this.categoryFilter) {
        result = result.filter(p => p.category === this.categoryFilter);
      }
      
      // 库存状态过滤
      if (this.stockFilter === 'in-stock') {
        result = result.filter(p => !p.outOfStock);
      } else if (this.stockFilter === 'out-of-stock') {
        result = result.filter(p => p.outOfStock);
      }
      
      // 排序
      result.sort((a, b) => {
        switch (this.sortOrder) {
          case 'sales-desc':
            return b.sales - a.sales;
          case 'sales-asc':
            return a.sales - b.sales;
          case 'price-desc':
            return b.price - a.price;
          case 'price-asc':
            return a.price - b.price;
          case 'orders-desc':
            return b.orders - a.orders;
          default:
            return b.sales - a.sales;
        }
      });
      
      this.filteredProducts = result;
      // 重置为第一页
      this.currentPage = 1;
    },
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatPriceChange(change) {
      if (change === 0) return '0%';
      const sign = change > 0 ? '+' : '';
      return `${sign}${change}%`;
    },
    handleImageError(event) {
      const productId = event.target.getAttribute('data-product-id');
      this.failedImages.add(productId);
      event.target.style.display = 'none';
    },
    isImageFailed(productId) {
      return this.failedImages.has(productId.toString());
    },
    getProductInitials(name) {
      if (!name) return '?';
      return name.substring(0, 2);
    },
    viewProduct(product) {
      // 查看产品详情
      this.selectedProductId = product.id;
      this.showProductDetail = true;
      this.$emit('view-detail', product.id);
    },
    setAlert(product) {
      // 设置价格变动提醒
      product.hasAlert = !product.hasAlert;
      if (product.hasAlert) {
        alert(`已为产品 ${product.name} 设置价格变动提醒`);
      }
    },
    syncShopifyData() {
      this.loading = true;
      
      // 模拟同步过程
      setTimeout(() => {
        alert('产品数据已成功同步');
        this.lastSyncTime = new Date().toLocaleString();
        this.loading = false;
      }, 1500);
    },
    hideProductDetail() {
      this.showProductDetail = false;
      this.selectedProductId = null;
    }
  }
}
</script>

<style scoped>
.product-list-container {
  font-family: Arial, sans-serif;
}

.filters-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
}

.search-filter {
  display: flex;
  margin-bottom: 15px;
}

.search-filter input {
  flex: 1;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.search-button {
  width: 40px;
  height: 40px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  font-size: 18px;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #666;
}

.filter-group select {
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  min-width: 150px;
}

.product-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  background-color: #f5f7fa;
  padding: 15px;
  font-weight: 500;
  color: #555;
  border-bottom: 1px solid #eee;
}

.table-row {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #eee;
  align-items: center;
  transition: background-color 0.2s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background-color: #f9fafb;
}

.table-row.out-of-stock {
  background-color: #fff8f8;
}

.cell-image {
  width: 80px;
}

.cell-name {
  flex: 1;
  min-width: 150px;
}

.cell-category {
  width: 100px;
}

.cell-sku {
  width: 110px;
}

.cell-price {
  width: 100px;
  text-align: right;
}

.cell-sales {
  width: 110px;
  text-align: right;
  font-weight: 500;
  color: #1976d2;
}

.cell-orders {
  width: 80px;
  text-align: right;
}

.cell-unit-price {
  width: 90px;
  text-align: right;
}

.cell-stock {
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.cell-price-change {
  width: 100px;
  text-align: right;
}

.cell-actions {
  width: 170px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.image-container {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #eee;
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

.product-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 3px;
}

.stock-status {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  background-color: #e8f5e9;
  color: #4caf50;
}

.stock-status.status-out {
  background-color: #ffebee;
  color: #f44336;
}

.stock-loss {
  font-size: 12px;
  color: #f44336;
  margin-top: 5px;
}

.price-change {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.price-increase {
  background-color: #e8f5e9;
  color: #4caf50;
}

.price-decrease {
  background-color: #ffebee;
  color: #f44336;
}

.price-stable {
  background-color: #f5f5f5;
  color: #757575;
}

.price-alert {
  font-weight: 700;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn {
  background-color: #e3f2fd;
  color: #1976d2;
}

.view-btn:hover {
  background-color: #bbdefb;
}

.alert-btn {
  background-color: #f5f5f5;
  color: #757575;
  border: 1px solid #ddd;
}

.alert-btn:hover {
  background-color: #eeeeee;
}

.alert-btn.active {
  background-color: #fff8e1;
  color: #ffa000;
  border-color: #ffecb3;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-message {
  text-align: center;
  padding: 40px 0;
  color: #888;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  gap: 15px;
}

.pagination-btn {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #666;
}

.sync-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.sync-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.sync-btn:hover {
  background-color: #1565c0;
}

.sync-icon {
  font-size: 16px;
}

.last-sync {
  color: #666;
  font-size: 14px;
}

@media (max-width: 1200px) {
  .table-header, .table-row {
    padding: 10px;
  }
  
  .cell-category, .cell-unit-price {
    display: none;
  }
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-group select {
    flex: 1;
  }
  
  .cell-sku, .cell-price-change {
    display: none;
  }
  
  .cell-actions {
    width: 80px;
  }
  
  .action-btn.alert-btn {
    display: none;
  }
}
</style> 