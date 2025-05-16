<template>
  <div class="influencer-management">
    <h1 class="page-title">红人管理</h1>
    
    <div class="tabs-container">
      <div class="tab-item active">红人列表</div>
      <div class="tab-item" @click="viewAllPosts">合作帖子</div>
    </div>
    
    <div class="filters-section">
      <div class="search-filter">
        <input 
          type="text" 
          placeholder="搜索红人名称/平台ID..." 
          v-model="searchQuery"
          @input="filterInfluencers"
        />
        <button class="search-button">
          <i class="search-icon">🔍</i>
        </button>
      </div>
      
      <div class="filter-controls">
        <div class="filter-group">
          <label>平台筛选:</label>
          <select v-model="platformFilter" @change="filterInfluencers">
            <option value="">全部平台</option>
            <option v-for="platform in platforms" :key="platform" :value="platform">
              {{ platform }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>地区筛选:</label>
          <select v-model="regionFilter" @change="filterInfluencers">
            <option value="">全部地区</option>
            <option v-for="region in regions" :key="region" :value="region">
              {{ region }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>排序:</label>
          <select v-model="sortOrder" @change="filterInfluencers">
            <option value="followers-desc">粉丝数 (高-低)</option>
            <option value="followers-asc">粉丝数 (低-高)</option>
            <option value="engagement-desc">互动率 (高-低)</option>
            <option value="roi-desc">投入产出比 (高-低)</option>
          </select>
        </div>
        
        <button class="add-influencer-btn" @click="showAddInfluencerModal = true">
          添加红人
        </button>
      </div>
    </div>
    
    <div class="influencer-table">
      <div class="table-header">
        <div class="cell-avatar">头像</div>
        <div class="cell-name">红人名称</div>
        <div class="cell-platform">平台</div>
        <div class="cell-region">地区</div>
        <div class="cell-followers">粉丝数</div>
        <div class="cell-engagement">互动率</div>
        <div class="cell-posts">发布数</div>
        <div class="cell-auth-status">授权状态</div>
        <div class="cell-actions">操作</div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="filteredInfluencers.length === 0" class="empty-message">
        没有找到匹配的红人
      </div>
      
      <div v-else class="table-body">
        <div 
          v-for="influencer in filteredInfluencers" 
          :key="influencer.id"
          class="table-row"
        >
          <div class="cell-avatar">
            <div class="avatar-container">
              <img 
                :src="influencer.avatar" 
                :alt="influencer.name"
                class="influencer-avatar"
                @error="handleImageError"
                :data-influencer-id="influencer.id"
              >
              <div class="avatar-placeholder" v-if="isImageFailed(influencer.id)">
                {{ getInfluencerInitials(influencer.name) }}
              </div>
            </div>
          </div>
          <div class="cell-name">
            <div class="influencer-name">{{ influencer.name }}</div>
            <div class="influencer-id">{{ influencer.platformId }}</div>
          </div>
          <div class="cell-platform">
            <span class="platform-badge" :class="'platform-' + influencer.platform.toLowerCase()">
              {{ influencer.platform }}
            </span>
          </div>
          <div class="cell-region">{{ influencer.region }}</div>
          <div class="cell-followers">{{ formatNumber(influencer.followers) }}</div>
          <div class="cell-engagement">{{ influencer.engagement }}%</div>
          <div class="cell-posts">{{ influencer.postCount }}</div>
          <div class="cell-auth-status">
            <span class="auth-badge" :class="influencer.isAuthorized ? 'authorized' : 'unauthorized'">
              {{ influencer.isAuthorized ? '已授权' : '未授权' }}
            </span>
          </div>
          <div class="cell-actions">
            <button class="action-btn view-btn" @click="viewInfluencer(influencer)">查看</button>
            <button class="action-btn posts-btn" @click="viewCollaborationPosts(influencer)">合作帖子</button>
            <button class="action-btn edit-btn" @click="editInfluencer(influencer)">编辑</button>
            <button class="action-btn delete-btn" @click="confirmDeleteInfluencer(influencer)">删除</button>
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
    
    <!-- 添加红人对话框 -->
    <div v-if="showAddInfluencerModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>添加红人</h2>
          <button class="close-btn" @click="showAddInfluencerModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>红人昵称:</label>
            <input v-model="newInfluencer.name" type="text" placeholder="输入红人昵称">
          </div>
          <div class="form-group">
            <label>平台账号ID:</label>
            <input v-model="newInfluencer.platformId" type="text" placeholder="输入平台账号ID">
          </div>
          <div class="form-group">
            <label>所属平台:</label>
            <select v-model="newInfluencer.platform">
              <option value="">选择平台</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>
          <div class="form-group">
            <label>所在地区:</label>
            <select v-model="newInfluencer.region">
              <option value="">选择地区</option>
              <option value="美国">美国</option>
              <option value="加拿大">加拿大</option>
              <option value="英国">英国</option>
              <option value="德国">德国</option>
              <option value="日本">日本</option>
              <option value="韩国">韩国</option>
              <option value="中国">中国</option>
            </select>
          </div>
          <div class="form-group">
            <label>联系方式:</label>
            <input v-model="newInfluencer.contact" type="text" placeholder="输入联系方式（邮箱或电话）">
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showAddInfluencerModal = false">取消</button>
          <button class="confirm-btn" @click="addInfluencer">确认添加</button>
        </div>
      </div>
    </div>
    
    <!-- 邀请链接对话框 -->
    <div v-if="showInviteLinkModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>邀请链接</h2>
          <button class="close-btn" @click="showInviteLinkModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>已生成以下邀请链接，请发送给红人进行授权：</p>
          <div class="invite-link-container">
            <input ref="inviteLinkInput" readonly :value="inviteLink" class="invite-link-input" />
            <button class="copy-btn" @click="copyInviteLink">复制</button>
          </div>
          <div v-if="linkCopied" class="copy-success">链接已复制到剪贴板!</div>
        </div>
        <div class="modal-footer">
          <button class="confirm-btn" @click="showInviteLinkModal = false">完成</button>
        </div>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirmModal" class="modal-overlay">
      <div class="modal-container confirmation-modal">
        <div class="modal-header">
          <h2>确认删除</h2>
          <button class="close-btn" @click="showDeleteConfirmModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>确定要删除红人 <strong>{{ selectedInfluencer ? selectedInfluencer.name : '' }}</strong> 吗？</p>
          <p class="warning-text">此操作不可撤销，相关的合作帖子信息也将被删除。</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showDeleteConfirmModal = false">取消</button>
          <button class="delete-confirm-btn" @click="deleteInfluencer">确认删除</button>
        </div>
      </div>
    </div>
    
    <!-- 红人详情对话框 -->
    <div v-if="showInfluencerDetail" class="modal-overlay">
      <div class="modal-container influencer-detail-modal">
        <div class="modal-header">
          <h2>红人详情</h2>
          <button class="close-btn" @click="showInfluencerDetail = false">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedInfluencer" class="influencer-detail">
            <div class="influencer-header">
              <div class="influencer-avatar-large">
                <img 
                  :src="selectedInfluencer.avatar" 
                  :alt="selectedInfluencer.name"
                  @error="handleImageError"
                  :data-influencer-id="selectedInfluencer.id"
                >
                <div class="avatar-placeholder" v-if="isImageFailed(selectedInfluencer.id)">
                  {{ getInfluencerInitials(selectedInfluencer.name) }}
                </div>
              </div>
              <div class="influencer-info">
                <h3 class="influencer-name">{{ selectedInfluencer.name }}</h3>
                <div class="influencer-id">{{ selectedInfluencer.platformId }}</div>
                <div class="platform-badge-large" :class="'platform-' + selectedInfluencer.platform.toLowerCase()">
                  {{ selectedInfluencer.platform }}
                </div>
                <div class="auth-status">
                  <span class="auth-badge" :class="selectedInfluencer.isAuthorized ? 'authorized' : 'unauthorized'">
                    {{ selectedInfluencer.isAuthorized ? '已授权' : '未授权' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="metrics-section">
              <h4>数据指标</h4>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-value">{{ formatNumber(selectedInfluencer.followers) }}</div>
                  <div class="metric-label">粉丝数</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">{{ selectedInfluencer.engagement }}%</div>
                  <div class="metric-label">互动率</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">{{ selectedInfluencer.postCount }}</div>
                  <div class="metric-label">发布数</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">{{ formatNumber(selectedInfluencer.avgViews) }}</div>
                  <div class="metric-label">平均观看</div>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>基本信息</h4>
              <div class="detail-row">
                <div class="detail-label">地区:</div>
                <div class="detail-value">{{ selectedInfluencer.region }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">转化率:</div>
                <div class="detail-value">{{ selectedInfluencer.conversion }}%</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">投入产出比:</div>
                <div class="detail-value highlight">{{ selectedInfluencer.roi }}x</div>
              </div>
            </div>
            
            <div class="recent-posts-section">
              <h4>最近帖子</h4>
              <div class="empty-posts" v-if="!recentPosts || recentPosts.length === 0">
                暂无帖子数据
              </div>
              <div class="posts-grid" v-else>
                <div class="post-card" v-for="post in recentPosts" :key="post.id">
                  <div class="post-title">{{ post.title }}</div>
                  <div class="post-meta">
                    <div class="post-date">{{ formatDate(post.date) }}</div>
                    <div class="post-interactions">{{ formatNumber(post.interactions) }} 互动</div>
                  </div>
                  <div class="post-content">{{ truncateContent(post.content) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            class="action-btn posts-btn"
            @click="viewCollaborationPosts(selectedInfluencer)"
          >
            查看合作帖子
          </button>
          <button 
            class="action-btn edit-btn"
            @click="editInfluencer(selectedInfluencer)"
          >
            编辑
          </button>
          <button class="confirm-btn" @click="showInfluencerDetail = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfluencerManagement',
  data() {
    return {
      influencers: [],
      filteredInfluencers: [],
      platforms: [],
      regions: [],
      loading: true,
      searchQuery: '',
      platformFilter: '',
      regionFilter: '',
      sortOrder: 'followers-desc',
      currentPage: 1,
      pageSize: 10,
      failedImages: new Set(),
      selectedInfluencer: null,
      showInfluencerDetail: false,
      showAddInfluencerModal: false,
      showInviteLinkModal: false,
      showDeleteConfirmModal: false,
      linkCopied: false,
      inviteLink: '',
      newInfluencer: {
        name: '',
        platformId: '',
        platform: '',
        region: '',
        contact: ''
      },
      recentPosts: []
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredInfluencers.length / this.pageSize);
    },
    paginatedInfluencers() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredInfluencers.slice(startIndex, endIndex);
    }
  },
  created() {
    this.fetchInfluencers();
  },
  methods: {
    fetchInfluencers() {
      // 在真实项目中，这里会从API获取红人数据
      // 模拟加载状态
      this.loading = true;
      
      // 模拟API请求
      setTimeout(() => {
        // 假数据 - 海外社媒红人
        this.influencers = [
          {
            id: 1,
            name: 'Emily Johnson',
            platformId: '@emilyjbeauty',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmQ2ZTciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+RUo8L3RleHQ+PC9zdmc+',
            platform: 'Instagram',
            region: '美国',
            followers: 1450000,
            engagement: 3.2,
            postCount: 342,
            avgViews: 98000,
            conversion: 2.8,
            roi: 4.5,
            isAuthorized: true
          },
          {
            id: 2,
            name: 'Lucas Wang',
            platformId: '@lucaswang_official',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNjMGUwZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+TFc8L3RleHQ+PC9zdmc+',
            platform: 'TikTok',
            region: '加拿大',
            followers: 2850000,
            engagement: 5.7,
            postCount: 128,
            avgViews: 428000,
            conversion: 3.5,
            roi: 6.2,
            isAuthorized: true
          },
          {
            id: 3,
            name: 'Sophia Martinez',
            platformId: '@sophiastyle',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmZmU4YzciLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+U008L3RleHQ+PC9zdmc+',
            platform: 'YouTube',
            region: '英国',
            followers: 875000,
            engagement: 4.5,
            postCount: 182,
            avgViews: 212000,
            conversion: 2.1,
            roi: 3.8,
            isAuthorized: true
          },
          {
            id: 4,
            name: 'Akira Tanaka',
            platformId: '@akira_tech',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiM4ZWM1ZmYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+QVQ8L3RleHQ+PC9zdmc+',
            platform: 'Instagram',
            region: '日本',
            followers: 1280000,
            engagement: 3.8,
            postCount: 215,
            avgViews: 185000,
            conversion: 3.2,
            roi: 5.1,
            isAuthorized: false
          },
          {
            id: 5,
            name: 'Nina Schmidt',
            platformId: '@nina_beauty',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNkMWZmZDEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+TlM8L3RleHQ+PC9zdmc+',
            platform: 'TikTok',
            region: '德国',
            followers: 3250000,
            engagement: 6.2,
            postCount: 156,
            avgViews: 520000,
            conversion: 4.1,
            roi: 7.2,
            isAuthorized: true
          },
          {
            id: 6,
            name: 'Leo Kim',
            platformId: '@leokimfitness',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmYWZhZmEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+TEs8L3RleHQ+PC9zdmc+',
            platform: 'YouTube',
            region: '韩国',
            followers: 925000,
            engagement: 4.8,
            postCount: 98,
            avgViews: 245000,
            conversion: 2.9,
            roi: 4.2,
            isAuthorized: false
          }
        ];
        
        // 提取所有平台和地区
        this.platforms = [...new Set(this.influencers.map(i => i.platform))];
        this.regions = [...new Set(this.influencers.map(i => i.region))];
        
        // 默认排序和筛选
        this.filterInfluencers();
        this.loading = false;
      }, 800);
    },
    filterInfluencers() {
      let result = [...this.influencers];
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(i => 
          i.name.toLowerCase().includes(query) || 
          i.platformId.toLowerCase().includes(query)
        );
      }
      
      // 平台过滤
      if (this.platformFilter) {
        result = result.filter(i => i.platform === this.platformFilter);
      }
      
      // 地区过滤
      if (this.regionFilter) {
        result = result.filter(i => i.region === this.regionFilter);
      }
      
      // 排序
      result.sort((a, b) => {
        switch (this.sortOrder) {
          case 'followers-desc':
            return b.followers - a.followers;
          case 'followers-asc':
            return a.followers - b.followers;
          case 'engagement-desc':
            return b.engagement - a.engagement;
          case 'roi-desc':
            return b.roi - a.roi;
          default:
            return b.followers - a.followers;
        }
      });
      
      this.filteredInfluencers = result;
      // 重置为第一页
      this.currentPage = 1;
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
    handleImageError(event) {
      const influencerId = event.target.getAttribute('data-influencer-id');
      this.failedImages.add(influencerId);
      event.target.style.display = 'none';
    },
    isImageFailed(influencerId) {
      return this.failedImages.has(influencerId.toString());
    },
    getInfluencerInitials(name) {
      if (!name) return '?';
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return parts[0].charAt(0) + parts[1].charAt(0);
      }
      return name.substring(0, 2);
    },
    viewInfluencer(influencer) {
      this.selectedInfluencer = influencer;
      this.fetchRecentPosts(influencer.id);
      this.showInfluencerDetail = true;
    },
    fetchRecentPosts(influencerId) {
      // 在真实项目中，这里会从API获取该红人的最近帖子
      // 模拟API请求
      setTimeout(() => {
        if (influencerId === 1) {
          this.recentPosts = [
            {
              id: 1,
              title: '夏季护肤新品展示',
              date: '2023-07-15T12:30:00',
              content: '今天为大家推荐夏季必备的几款护肤产品，这些产品都是我亲自使用过的，效果非常好！#护肤 #夏季护肤',
              interactions: 58600
            },
            {
              id: 7,
              title: '化妆品推荐',
              date: '2023-07-01T10:45:00',
              content: '今天给大家分享我最近在用的几款化妆品，都是很平价但是效果特别好的产品，值得入手！#美妆 #化妆品推荐',
              interactions: 45200
            }
          ];
        } else if (influencerId === 4) {
          this.recentPosts = [
            {
              id: 3,
              title: '最新科技产品开箱',
              date: '2023-06-28T09:15:00',
              content: '刚刚收到的最新款智能手表，带大家一起开箱体验它的各种功能，续航能力提升了50%！#科技 #开箱',
              interactions: 72100
            }
          ];
        } else {
          this.recentPosts = [];
        }
      }, 300);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    truncateContent(content) {
      if (!content) return '';
      return content.length > 80 ? content.slice(0, 80) + '...' : content;
    },
    viewAllPosts() {
      // 导航到合作帖子管理页面
      const event = new CustomEvent('pageChange', {
        detail: {
          page: 'collaboration'
        }
      });
      window.dispatchEvent(event);
    },
    addInfluencer() {
      // 验证表单
      if (!this.newInfluencer.name || !this.newInfluencer.platformId || 
          !this.newInfluencer.platform || !this.newInfluencer.region || 
          !this.newInfluencer.contact) {
        alert('请填写所有必填字段');
        return;
      }
      
      // 生成新红人数据
      const newId = this.influencers.length > 0 ? Math.max(...this.influencers.map(i => i.id)) + 1 : 1;
      const newInfluencer = {
        id: newId,
        name: this.newInfluencer.name,
        platformId: this.newInfluencer.platformId,
        avatar: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNlMGUwZTAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzMzMyI+JHt0aGlzLmdldEluZmx1ZW5jZXJJbml0aWFscyh0aGlzLm5ld0luZmx1ZW5jZXIubmFtZSl9PC90ZXh0Pjwvc3ZnPg==`,
        platform: this.newInfluencer.platform,
        region: this.newInfluencer.region,
        followers: 0,
        engagement: 0,
        postCount: 0,
        avgViews: 0,
        conversion: 0,
        roi: 0,
        isAuthorized: false
      };
      
      // 在真实项目中，这里会调用API保存红人数据
      this.influencers.push(newInfluencer);
      this.filterInfluencers();
      
      // 生成邀请链接
      this.generateInviteLink(newInfluencer);
      
      // 重置表单
      this.newInfluencer = {
        name: '',
        platformId: '',
        platform: '',
        region: '',
        contact: ''
      };
      
      // 关闭添加对话框，显示邀请链接对话框
      this.showAddInfluencerModal = false;
      this.showInviteLinkModal = true;
    },
    generateInviteLink(influencer) {
      // 在实际项目中，这里会生成一个真实的邀请链接
      const baseUrl = 'https://your-domain.com/influencer/authorize';
      const token = btoa(`${influencer.id}-${Date.now()}`); // 简单的编码，实际应使用更安全的方法
      this.inviteLink = `${baseUrl}?token=${token}&platform=${influencer.platform}&id=${influencer.platformId}`;
    },
    copyInviteLink() {
      // 复制链接到剪贴板
      const copyText = this.$refs.inviteLinkInput;
      copyText.select();
      copyText.setSelectionRange(0, 99999); // 兼容移动设备
      document.execCommand('copy');
      
      // 显示已复制提示
      this.linkCopied = true;
      setTimeout(() => {
        this.linkCopied = false;
      }, 2000);
    },
    editInfluencer(influencer) {
      // 在真实项目中，这里会打开编辑页面
      alert(`编辑红人: ${influencer.name}`);
    },
    confirmDeleteInfluencer(influencer) {
      this.selectedInfluencer = influencer;
      this.showDeleteConfirmModal = true;
    },
    deleteInfluencer() {
      if (!this.selectedInfluencer) return;
      
      // 在真实项目中，这里会调用API删除红人数据
      const index = this.influencers.findIndex(i => i.id === this.selectedInfluencer.id);
      if (index !== -1) {
        this.influencers.splice(index, 1);
        this.filterInfluencers();
        alert('红人已删除');
      }
      
      this.selectedInfluencer = null;
      this.showDeleteConfirmModal = false;
    },
    viewCollaborationPosts(influencer) {
      // 实现查看合作帖子功能
      // 在真实项目中，这里可能会导航到合作帖子列表页，
      // 并传递红人ID作为筛选条件
      const event = new CustomEvent('pageChange', {
        detail: {
          page: 'collaboration',
          influencerId: influencer.id
        }
      });
      window.dispatchEvent(event);
    }
  }
}
</script>

<style scoped>
.influencer-management {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.page-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.tabs-container {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.tab-item {
  padding: 12px 20px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.tab-item.active {
  color: #1976d2;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1976d2;
}

.tab-item:hover {
  color: #1976d2;
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

.influencer-table {
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

.cell-avatar {
  width: 70px;
}

.cell-name {
  width: 180px;
}

.cell-platform {
  width: 120px;
}

.cell-region {
  width: 100px;
}

.cell-followers {
  width: 90px;
  text-align: right;
}

.cell-engagement {
  width: 80px;
  text-align: right;
}

.cell-posts {
  width: 80px;
  text-align: right;
}

.cell-auth-status {
  width: 90px;
  text-align: center;
}

.auth-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.authorized {
  background-color: #e8f5e9;
  color: #4caf50;
}

.unauthorized {
  background-color: #ffebee;
  color: #f44336;
}

.cell-actions {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.avatar-container {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #eee;
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
  color: #666;
  font-weight: 500;
}

.influencer-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 3px;
}

.influencer-id {
  font-size: 12px;
  color: #666;
}

.platform-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
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

.contact-btn {
  background-color: #e8f5e9;
  color: #4caf50;
}

.contact-btn:hover {
  background-color: #c8e6c9;
}

.posts-btn {
  background-color: #e8eaf6;
  color: #3f51b5;
}

.posts-btn:hover {
  background-color: #c5cae9;
}

.edit-btn {
  background-color: #fff8e1;
  color: #ffa000;
}

.edit-btn:hover {
  background-color: #ffecb3;
}

.delete-btn {
  background-color: #ffebee;
  color: #f44336;
}

.delete-btn:hover {
  background-color: #ffcdd2;
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

.add-influencer-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.add-influencer-btn:hover {
  background-color: #43a047;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 24px;
  color: #888;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  flex: 1;
  overflow: auto;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.cancel-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #555;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
}

.delete-confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #f44336;
  color: white;
  cursor: pointer;
}

.invite-link-container {
  display: flex;
  margin-top: 15px;
  margin-bottom: 10px;
}

.invite-link-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  background-color: #f9f9f9;
}

.copy-btn {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-left: none;
  border-radius: 0 4px 4px 0;
  background-color: #f5f5f5;
  color: #555;
  cursor: pointer;
}

.copy-success {
  color: #4caf50;
  margin-top: 8px;
  font-size: 14px;
}

.warning-text {
  color: #f44336;
  font-size: 14px;
}

.confirmation-modal {
  width: 400px;
}

@media (max-width: 1200px) {
  .table-header, .table-row {
    padding: 10px;
  }
  
  .cell-posts, .cell-conversion {
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
  
  .cell-region, .cell-avg-views {
    display: none;
  }
}

/* 红人详情样式 */
.influencer-detail-modal {
  width: 700px;
}

.influencer-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.influencer-header {
  display: flex;
  gap: 20px;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.influencer-avatar-large {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #eee;
}

.influencer-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.influencer-info {
  flex: 1;
}

.influencer-name {
  font-size: 22px;
  margin: 0 0 5px 0;
  color: #333;
}

.platform-badge-large {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;
}

.auth-status {
  margin-top: 10px;
}

.metrics-section, .detail-section, .recent-posts-section {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 15px;
}

.metrics-section h4, .detail-section h4, .recent-posts-section h4 {
  margin: 0 0 15px 0;
  color: #555;
  font-size: 16px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.metric-card {
  background-color: white;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.metric-value {
  font-size: 18px;
  font-weight: 500;
  color: #1976d2;
  margin-bottom: 5px;
}

.metric-label {
  font-size: 12px;
  color: #666;
}

.detail-row {
  display: flex;
  margin-bottom: 12px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  width: 120px;
  font-weight: 500;
  color: #555;
}

.detail-value {
  flex: 1;
  color: #333;
}

.highlight {
  color: #1976d2;
  font-weight: 500;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.post-card {
  background-color: white;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.post-title {
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.post-content {
  font-size: 14px;
  color: #555;
  line-height: 1.4;
}

.empty-posts {
  text-align: center;
  padding: 20px 0;
  color: #888;
}

@media (max-width: 768px) {
  .influencer-detail-modal {
    width: 90%;
  }
  
  .influencer-header {
    flex-direction: column;
    text-align: center;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}

.cell-avg-views, .cell-conversion, .cell-roi {
  display: none;
}
</style> 