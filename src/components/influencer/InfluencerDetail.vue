<template>
  <div class="influencer-detail-container">
    <div class="header">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span> 返回列表
      </button>
      <h1 class="title">红人详情</h1>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <div v-else class="content">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-container">
            <img 
              v-if="!imageError" 
              :src="influencer.avatar" 
              :alt="influencer.name"
              class="influencer-avatar"
              @error="imageError = true"
            >
            <div class="avatar-placeholder" v-if="imageError">
              {{ getInfluencerInitials(influencer.name) }}
            </div>
          </div>
          
          <div class="profile-info">
            <h2 class="influencer-name">{{ influencer.name }}</h2>
            <div class="platform-info">
              <span class="platform-badge" :class="'platform-' + influencer.platform.toLowerCase()">
                {{ influencer.platform }}
              </span>
              <span class="platform-id">{{ influencer.platformId }}</span>
            </div>
            <div class="region">
              <span class="region-icon">🌎</span> {{ influencer.region }}
            </div>
            <div class="contact-info">
              <div class="contact-row" v-if="influencer.email">
                <span class="contact-icon">✉️</span> {{ influencer.email }}
              </div>
              <div class="contact-row" v-if="influencer.phone">
                <span class="contact-icon">📱</span> {{ influencer.phone }}
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="action-btn contact-btn">联系红人</button>
            <button class="action-btn collab-btn">开始合作</button>
          </div>
        </div>
        
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-value">{{ formatNumber(influencer.followers) }}</div>
            <div class="stat-label">粉丝数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ influencer.engagement }}%</div>
            <div class="stat-label">互动率</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ influencer.postCount }}</div>
            <div class="stat-label">发布数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ formatNumber(influencer.avgViews) }}</div>
            <div class="stat-label">平均观看</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ influencer.conversion }}%</div>
            <div class="stat-label">转化率</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ influencer.roi }}x</div>
            <div class="stat-label">投入产出比</div>
          </div>
        </div>
      </div>
      
      <div class="detail-tabs">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'posts' }"
          @click="activeTab = 'posts'"
        >
          最近帖子
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'analytics' }"
          @click="activeTab = 'analytics'"
        >
          数据分析
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          合作历史
        </div>
      </div>
      
      <div class="tab-content">
        <!-- 最近帖子 -->
        <div v-if="activeTab === 'posts'" class="posts-container">
          <h3 class="section-title">最近帖子</h3>
          
          <div class="posts-grid">
            <div 
              v-for="post in influencer.recentPosts" 
              :key="post.id"
              class="post-card"
            >
              <div class="post-image-container">
                <img :src="post.image" :alt="post.title" class="post-image">
                <div class="post-metrics">
                  <div class="metric">
                    <span class="metric-icon">❤️</span> {{ formatNumber(post.likes) }}
                  </div>
                  <div class="metric">
                    <span class="metric-icon">💬</span> {{ formatNumber(post.comments) }}
                  </div>
                  <div class="metric">
                    <span class="metric-icon">👁️</span> {{ formatNumber(post.views) }}
                  </div>
                </div>
              </div>
              <div class="post-content">
                <div class="post-date">{{ formatDate(post.date) }}</div>
                <div class="post-title">{{ post.title }}</div>
                <div class="post-description">{{ post.description }}</div>
              </div>
              <div class="post-actions">
                <a :href="post.link" target="_blank" class="post-link">在 {{ influencer.platform }} 查看</a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 数据分析 -->
        <div v-else-if="activeTab === 'analytics'" class="analytics-container">
          <h3 class="section-title">数据分析</h3>
          
          <div class="analytics-row">
            <div class="chart-container">
              <h4 class="chart-title">粉丝增长趋势</h4>
              <div class="chart-placeholder">
                此处将显示粉丝增长趋势图
              </div>
            </div>
            
            <div class="chart-container">
              <h4 class="chart-title">互动率趋势</h4>
              <div class="chart-placeholder">
                此处将显示互动率趋势图
              </div>
            </div>
          </div>
          
          <div class="analytics-row">
            <div class="chart-container">
              <h4 class="chart-title">受众分析</h4>
              <div class="chart-placeholder">
                此处将显示受众分析图
              </div>
            </div>
            
            <div class="chart-container">
              <h4 class="chart-title">发布效果</h4>
              <div class="chart-placeholder">
                此处将显示发布效果图
              </div>
            </div>
          </div>
        </div>
        
        <!-- 合作历史 -->
        <div v-else class="history-container">
          <h3 class="section-title">合作历史</h3>
          
          <div class="history-timeline">
            <div 
              v-for="(collab, index) in influencer.collaborations" 
              :key="index"
              class="timeline-item"
            >
              <div class="timeline-date">{{ formatDate(collab.date) }}</div>
              <div class="timeline-content">
                <div class="timeline-title">{{ collab.campaign }}</div>
                <div class="timeline-details">
                  <div class="timeline-detail">
                    <span class="detail-label">活动类型:</span> {{ collab.type }}
                  </div>
                  <div class="timeline-detail">
                    <span class="detail-label">产品:</span> {{ collab.product }}
                  </div>
                  <div class="timeline-detail">
                    <span class="detail-label">费用:</span> {{ collab.cost }}
                  </div>
                  <div class="timeline-detail">
                    <span class="detail-label">ROI:</span> {{ collab.roi }}x
                  </div>
                </div>
                <div class="timeline-results">
                  <div class="result-item">
                    <div class="result-value">{{ formatNumber(collab.views) }}</div>
                    <div class="result-label">观看</div>
                  </div>
                  <div class="result-item">
                    <div class="result-value">{{ formatNumber(collab.engagements) }}</div>
                    <div class="result-label">互动</div>
                  </div>
                  <div class="result-item">
                    <div class="result-value">{{ formatNumber(collab.clicks) }}</div>
                    <div class="result-label">点击</div>
                  </div>
                  <div class="result-item">
                    <div class="result-value">{{ formatNumber(collab.conversions) }}</div>
                    <div class="result-label">转化</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfluencerDetail',
  props: {
    influencerId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      influencer: null,
      loading: true,
      imageError: false,
      activeTab: 'posts'
    }
  },
  created() {
    this.fetchInfluencerData();
  },
  methods: {
    fetchInfluencerData() {
      // 在真实项目中，这里会从API获取红人详细数据
      this.loading = true;
      
      // 模拟API请求
      setTimeout(() => {
        // 假数据 - 红人详情
        this.influencer = {
          id: 2,
          name: 'Lucas Wang',
          platformId: '@lucaswang_official',
          avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNjMGUwZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+TFc8L3RleHQ+PC9zdmc+',
          platform: 'TikTok',
          region: '加拿大',
          email: 'lucas.wang@example.com',
          phone: '+1 (555) 123-4567',
          followers: 2850000,
          engagement: 5.7,
          postCount: 128,
          avgViews: 428000,
          conversion: 3.5,
          roi: 6.2,
          recentPosts: [
            {
              id: 1,
              image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNjMGUwZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+UG9zdCBJbWFnZSAxPC90ZXh0Pjwvc3ZnPg==',
              title: '夏季必备美妆产品分享',
              description: '夏天到了，分享我的夏季美妆小心机，这些产品让你清爽一夏！#美妆 #夏季护肤',
              date: '2023-07-15T12:30:00',
              likes: 125000,
              comments: 3200,
              views: 580000,
              link: 'https://example.com/post1'
            },
            {
              id: 2,
              image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmQ2ZTciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+UG9zdCBJbWFnZSAyPC90ZXh0Pjwvc3ZnPg==',
              title: '全新限量版运动鞋开箱',
              description: '今天给大家带来全新限量版运动鞋开箱，超级舒适又时尚！#运动鞋 #开箱',
              date: '2023-07-05T15:45:00',
              likes: 98000,
              comments: 2500,
              views: 420000,
              link: 'https://example.com/post2'
            },
            {
              id: 3,
              image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNkMWZmZDEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+UG9zdCBJbWFnZSAzPC90ZXh0Pjwvc3ZnPg==',
              title: '30分钟居家健身挑战',
              description: '不用去健身房也能练出好身材，跟我一起完成这个30分钟居家健身挑战！#健身 #居家运动',
              date: '2023-06-28T09:15:00',
              likes: 87000,
              comments: 1800,
              views: 390000,
              link: 'https://example.com/post3'
            },
            {
              id: 4,
              image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmZmU4YzciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+UG9zdCBJbWFnZSA0PC90ZXh0Pjwvc3ZnPg==',
              title: '智能手表功能详解',
              description: '今天给大家详细讲解这款智能手表的各种功能，帮你提高工作效率！#科技 #智能手表',
              date: '2023-06-20T14:00:00',
              likes: 76000,
              comments: 1950,
              views: 350000,
              link: 'https://example.com/post4'
            }
          ],
          collaborations: [
            {
              date: '2023-06-10T00:00:00',
              campaign: '夏季新品推广活动',
              type: '产品展示',
              product: '智能手表Pro',
              cost: '¥50,000',
              roi: 4.8,
              views: 520000,
              engagements: 85000,
              clicks: 32000,
              conversions: 2800
            },
            {
              date: '2023-03-15T00:00:00',
              campaign: '春季限定系列',
              type: '开箱视频',
              product: '运动服装套装',
              cost: '¥38,000',
              roi: 3.6,
              views: 480000,
              engagements: 72000,
              clicks: 25000,
              conversions: 1900
            },
            {
              date: '2022-12-05T00:00:00',
              campaign: '年末促销',
              type: '折扣码推广',
              product: '美妆礼盒',
              cost: '¥45,000',
              roi: 5.2,
              views: 620000,
              engagements: 95000,
              clicks: 48000,
              conversions: 3200
            }
          ]
        };
        
        this.loading = false;
      }, 1000);
    },
    goBack() {
      this.$emit('go-back');
    },
    getInfluencerInitials(name) {
      if (!name) return '?';
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return parts[0].charAt(0) + parts[1].charAt(0);
      }
      return name.substring(0, 2);
    },
    formatNumber(num) {
      if (!num && num !== 0) return '0';
      
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}
</script>

<style scoped>
.influencer-detail-container {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  margin-right: 15px;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.back-icon {
  font-size: 18px;
}

.title {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
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

.content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.profile-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.profile-header {
  display: flex;
  padding: 25px;
  border-bottom: 1px solid #eee;
}

.avatar-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 25px;
  border: 1px solid #eee;
  position: relative;
}

.influencer-avatar {
  width: 100%;
  height: 100%;
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
  background-color: #f0f0f0;
  color: #555;
  font-weight: 500;
  font-size: 32px;
}

.profile-info {
  flex: 1;
}

.influencer-name {
  font-size: 24px;
  color: #333;
  margin: 0 0 10px 0;
}

.platform-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.platform-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.platform-instagram {
  background-color: #fcf1ff;
  color: #c13584;
}

.platform-tiktok {
  background-color: #f0f8ff;
  color: #00f2ea;
}

.platform-youtube {
  background-color: #fff0f0;
  color: #ff0000;
}

.platform-id {
  font-size: 14px;
  color: #555;
}

.region {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #555;
}

.contact-info {
  margin-top: 15px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}

.contact-icon {
  font-size: 16px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  padding: 10px 15px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.contact-btn {
  background-color: #e3f2fd;
  color: #1976d2;
}

.contact-btn:hover {
  background-color: #bbdefb;
}

.collab-btn {
  background-color: #1976d2;
  color: white;
}

.collab-btn:hover {
  background-color: #1565c0;
}

.stats-container {
  display: flex;
  padding: 20px;
}

.stat-card {
  flex: 1;
  text-align: center;
  padding: 15px 10px;
  border-right: 1px solid #eee;
}

.stat-card:last-child {
  border-right: none;
}

.stat-value {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #777;
}

.detail-tabs {
  display: flex;
  background-color: white;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 15px;
  cursor: pointer;
  font-weight: 500;
  color: #555;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-item:hover {
  background-color: #f9fafb;
}

.tab-item.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
}

.tab-content {
  background-color: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.section-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.post-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-image-container {
  position: relative;
  height: 180px;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-metrics {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.metric {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.metric-icon {
  font-size: 14px;
}

.post-content {
  padding: 15px;
}

.post-date {
  font-size: 12px;
  color: #777;
  margin-bottom: 5px;
}

.post-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.post-description {
  font-size: 13px;
  color: #555;
  line-height: 1.4;
  height: 55px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-actions {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  text-align: center;
}

.post-link {
  color: #1976d2;
  text-decoration: none;
  font-size: 13px;
}

.post-link:hover {
  text-decoration: underline;
}

.analytics-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-container {
  flex: 1;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.chart-title {
  font-size: 16px;
  color: #333;
  margin: 0 0 15px 0;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #777;
  font-size: 14px;
  border-radius: 4px;
}

.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.timeline-item {
  display: flex;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.timeline-date {
  width: 120px;
  padding-right: 15px;
  font-size: 14px;
  color: #777;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.timeline-content {
  flex: 1;
  padding-left: 15px;
}

.timeline-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.timeline-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 15px;
}

.timeline-detail {
  font-size: 13px;
  color: #555;
}

.detail-label {
  font-weight: 500;
  color: #777;
  margin-right: 5px;
}

.timeline-results {
  display: flex;
  justify-content: space-between;
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
}

.result-item {
  text-align: center;
}

.result-value {
  font-size: 16px;
  font-weight: 500;
  color: #1976d2;
  margin-bottom: 2px;
}

.result-label {
  font-size: 12px;
  color: #777;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .action-buttons {
    flex-direction: row;
    margin-top: 20px;
  }
  
  .stats-container {
    flex-wrap: wrap;
  }
  
  .stat-card {
    flex: 0 0 33.33%;
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
  }
  
  .stat-card:nth-child(3n) {
    border-right: none;
  }
  
  .stat-card:nth-child(n+4) {
    border-bottom: none;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
  
  .analytics-row {
    flex-direction: column;
  }
  
  .timeline-item {
    flex-direction: column;
  }
  
  .timeline-date {
    width: auto;
    padding-right: 0;
    padding-bottom: 10px;
    border-right: none;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
  }
  
  .timeline-content {
    padding-left: 0;
  }
  
  .timeline-details {
    grid-template-columns: 1fr;
  }
  
  .timeline-results {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .result-item {
    flex: 0 0 45%;
  }
}
</style> 