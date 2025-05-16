<template>
  <div class="influencer-data">
    <h2 class="module-title">合作红人数据</h2>
    
    <div class="influencer-metrics">
      <div class="metric-item">
        <h3 class="metric-title">红人总数</h3>
        <div class="metric-value">{{ formatNumber(influencerData.summary.totalCount) }}</div>
      </div>
      <div class="metric-item">
        <h3 class="metric-title">本月新增</h3>
        <div class="metric-value">{{ formatNumber(influencerData.summary.newCount) }}</div>
      </div>
      <div class="metric-item">
        <h3 class="metric-title">平均互动率</h3>
        <div class="metric-value">{{ influencerData.summary.avgEngagement }}%</div>
      </div>
      <div class="metric-item">
        <h3 class="metric-title">合作帖子总数</h3>
        <div class="metric-value">{{ formatNumber(influencerData.summary.totalPosts) }}</div>
      </div>
    </div>
    
    <div class="influencer-list">
      <h3 class="list-title">红人排行</h3>
      
      <div class="list-filter">
        <div class="filter-group">
          <span class="filter-label">平台:</span>
          <div class="filter-options">
            <button 
              class="filter-option"
              :class="{ active: selectedPlatform === 'all' }"
              @click="selectedPlatform = 'all'"
            >
              全部
            </button>
            <button 
              v-for="platform in platforms" 
              :key="platform"
              class="filter-option"
              :class="{ active: selectedPlatform === platform }"
              @click="selectedPlatform = platform"
            >
              {{ platform }}
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">分类:</span>
          <div class="filter-options">
            <button 
              class="filter-option"
              :class="{ active: selectedCategory === 'all' }"
              @click="selectedCategory = 'all'"
            >
              全部
            </button>
            <button 
              v-for="category in categories" 
              :key="category"
              class="filter-option"
              :class="{ active: selectedCategory === category }"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">排序:</span>
          <div class="filter-options">
            <button 
              class="filter-option"
              :class="{ active: sortBy === 'followers' }"
              @click="sortBy = 'followers'"
            >
              粉丝数
            </button>
            <button 
              class="filter-option"
              :class="{ active: sortBy === 'engagement' }"
              @click="sortBy = 'engagement'"
            >
              互动变化
            </button>
            <button 
              class="filter-option"
              :class="{ active: sortBy === 'posts' }"
              @click="sortBy = 'posts'"
            >
              帖子数
            </button>
          </div>
        </div>
      </div>
      
      <div class="influencer-table">
        <div class="table-header">
          <div class="col-rank">排名</div>
          <div class="col-avatar">头像</div>
          <div class="col-name">红人姓名</div>
          <div class="col-account">账号</div>
          <div class="col-platform">平台</div>
          <div class="col-category">分类</div>
          <div class="col-followers">粉丝数</div>
          <div class="col-engagement">互动变化</div>
          <div class="col-posts">帖子数</div>
        </div>
        
        <div 
          v-for="(influencer, index) in filteredInfluencers" 
          :key="influencer.id"
          class="influencer-item"
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
          <div class="col-avatar">
            <div class="avatar-container">
              <img 
                :src="influencer.avatar" 
                :alt="influencer.name" 
                class="avatar-image"
                @error="handleImageError"
                :data-influencer-id="influencer.id"
                :key="'img-' + influencer.id"
              >
              <div class="avatar-placeholder" v-if="isImageFailed(influencer.id)">
                {{ getInitials(influencer.name) }}
              </div>
            </div>
          </div>
          <div class="col-name">{{ influencer.name }}</div>
          <div class="col-account">{{ influencer.account }}</div>
          <div class="col-platform">{{ influencer.platform }}</div>
          <div class="col-category">{{ influencer.category }}</div>
          <div class="col-followers">{{ formatNumber(influencer.followers) }}</div>
          <div class="col-engagement" :class="influencer.engagementChange > 0 ? 'positive' : 'negative'">
            {{ influencer.engagementChange > 0 ? '+' : '' }}{{ influencer.engagementChange }}%
          </div>
          <div class="col-posts">{{ influencer.postsCount }}</div>
        </div>
      </div>
    </div>
    
    <!-- 热门合作帖子部分 -->
    <div class="popular-posts">
      <h3 class="section-title">热门合作帖子</h3>
      <div class="posts-grid">
        <div 
          v-for="post in influencerData.posts" 
          :key="post.id" 
          class="post-card"
        >
          <div class="post-image">
            <img :src="post.imageUrl" :alt="post.title">
          </div>
          <div class="post-content">
            <h4 class="post-title">{{ post.title }}</h4>
            <div class="post-info">
              <span class="post-author">{{ post.influencer }}</span>
              <span class="post-platform">{{ post.platform }}</span>
              <span class="post-date">{{ formatDate(post.postDate) }}</span>
            </div>
            <p class="post-text">{{ post.content }}</p>
            <div class="post-stats">
              <span class="engagement-count">
                <i class="engagement-icon">👍</i>
                {{ formatNumber(post.engagementCount) }} 互动
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="influencer-summary">
      <h3 class="summary-title">红人数据小结</h3>
      <div class="summary-content">
        <p>Instagram平台红人贡献了最高的互动量，TikTok平台红人互动增长率最高。</p>
        <p>Beauty和Fashion类目红人的粉丝活跃度普遍高于其他类目，互动增长明显。</p>
        <p>建议加大YouTube平台的中等影响力红人投入，该群体互动质量高且合作成本可控。</p>
      </div>
      <div class="summary-actions">
        <button class="view-all-btn">查看所有红人</button>
        <button class="edit-summary-btn">编辑小结</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfluencerData',
  props: {
    influencerData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedPlatform: 'all',
      selectedCategory: 'all',
      sortBy: 'followers',
      failedImages: new Set()
    };
  },
  computed: {
    platforms() {
      const platforms = new Set();
      this.influencerData.list.forEach(influencer => {
        platforms.add(influencer.platform);
      });
      return Array.from(platforms);
    },
    
    categories() {
      const categories = new Set();
      this.influencerData.list.forEach(influencer => {
        categories.add(influencer.category);
      });
      return Array.from(categories);
    },
    
    filteredInfluencers() {
      let filtered = [...this.influencerData.list];
      
      // 按平台筛选
      if (this.selectedPlatform !== 'all') {
        filtered = filtered.filter(i => i.platform === this.selectedPlatform);
      }
      
      // 按分类筛选
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(i => i.category === this.selectedCategory);
      }
      
      // 排序
      filtered.sort((a, b) => {
        if (this.sortBy === 'followers') {
          return b.followers - a.followers;
        } else if (this.sortBy === 'engagement') {
          return b.engagementChange - a.engagementChange;
        } else if (this.sortBy === 'posts') {
          return b.postsCount - a.postsCount;
        }
        return 0;
      });
      
      return filtered;
    }
  },
  methods: {
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    handleImageError(event) {
      // 存储加载失败的图片ID
      const influencerId = event.target.getAttribute('data-influencer-id');
      this.failedImages.add(influencerId.toString());
      
      // 隐藏实际的img元素
      event.target.style.display = 'none';
    },
    isImageFailed(influencerId) {
      return this.failedImages.has(influencerId.toString());
    },
    getInitials(name) {
      if (!name) return '?';
      
      // 获取名字的前两个字符作为首字母缩写
      const initials = name.substring(0, 2);
      return initials;
    }
  }
}
</script>

<style scoped>
.influencer-data {
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

.influencer-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.metric-item {
  background-color: #f5f7fa;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
}

.metric-title {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  color: #666;
  font-weight: normal;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
}

.list-title, .section-title {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.list-filter {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-label {
  font-size: 0.9rem;
  color: #666;
  margin-right: 8px;
}

.filter-options {
  display: flex;
  gap: 5px;
}

.filter-option {
  background-color: #f5f7fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.85rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-option:hover {
  background-color: #eee;
}

.filter-option.active {
  background-color: #1976d2;
  border-color: #1976d2;
  color: white;
}

.influencer-table {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 30px;
}

.table-header {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.influencer-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.influencer-item:last-child {
  border-bottom: none;
}

.influencer-item:hover {
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

.col-avatar {
  width: 60px;
  display: flex;
  justify-content: center;
}

.avatar-container {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f5f7fa;
  font-size: 0.8rem;
  font-weight: 500;
  color: #666;
}

.col-name {
  width: 120px;
  font-weight: 500;
  color: #333;
}

.col-account {
  width: 140px;
  color: #666;
  font-size: 0.9rem;
}

.col-platform {
  width: 100px;
  color: #666;
}

.col-category {
  width: 100px;
  color: #666;
}

.col-followers {
  width: 100px;
  color: #666;
  text-align: right;
}

.col-engagement {
  width: 100px;
  text-align: right;
  font-weight: 500;
}

.positive {
  color: #4caf50;
}

.negative {
  color: #f44336;
}

.col-posts {
  width: 80px;
  text-align: right;
  color: #666;
}

/* 热门合作帖子部分样式 */
.popular-posts {
  margin-top: 30px;
  margin-bottom: 30px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.post-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  background-color: white;
}

.post-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.post-image {
  height: 160px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.post-card:hover .post-image img {
  transform: scale(1.05);
}

.post-content {
  padding: 15px;
}

.post-title {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
  line-height: 1.3;
}

.post-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #666;
}

.post-author {
  font-weight: 500;
  color: #1976d2;
}

.post-platform, .post-date {
  color: #888;
}

.post-text {
  margin: 0 0 15px 0;
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-stats {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.engagement-count {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
}

.engagement-icon {
  font-style: normal;
  margin-right: 5px;
}

.influencer-summary {
  background-color: #f5f7fa;
  border-radius: 6px;
  padding: 15px;
  margin-top: 20px;
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