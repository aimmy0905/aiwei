<template>
  <div class="collaboration-post-management">
    <h1 class="page-title">合作帖子管理</h1>
    
    <div class="tabs-container">
      <div class="tab-item" @click="goToInfluencerList">红人列表</div>
      <div class="tab-item active">合作帖子</div>
    </div>
    
    <div class="filters-section">
      <div class="search-filter">
        <input 
          type="text" 
          placeholder="搜索帖子标题/内容..." 
          v-model="searchQuery"
          @input="filterPosts"
        />
        <button class="search-button">
          <i class="search-icon">🔍</i>
        </button>
      </div>
      
      <div class="filter-controls">
        <div class="filter-group">
          <label>关联红人:</label>
          <select v-model="influencerFilter" @change="filterPosts">
            <option value="">全部红人</option>
            <option v-for="influencer in influencers" :key="influencer.id" :value="influencer.id">
              {{ influencer.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>合作客户:</label>
          <select v-model="clientFilter" @change="filterPosts">
            <option value="">全部客户</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>平台筛选:</label>
          <select v-model="platformFilter" @change="filterPosts">
            <option value="">全部平台</option>
            <option v-for="platform in platforms" :key="platform" :value="platform">
              {{ platform }}
            </option>
          </select>
        </div>
        
        <button class="add-post-btn" @click="showAddPostModal = true">
          添加合作帖子
        </button>
      </div>
    </div>
    
    <div class="posts-table">
      <div class="table-header">
        <div class="cell-title">标题</div>
        <div class="cell-influencer">关联红人</div>
        <div class="cell-client">合作客户</div>
        <div class="cell-project">关联项目</div>
        <div class="cell-platform">平台</div>
        <div class="cell-cost">费用</div>
        <div class="cell-interactions">互动数</div>
        <div class="cell-actions">操作</div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="filteredPosts.length === 0" class="empty-message">
        没有找到匹配的帖子
      </div>
      
      <div v-else class="table-body">
        <div 
          v-for="post in filteredPosts" 
          :key="post.id"
          class="table-row"
        >
          <div class="cell-title">{{ post.title }}</div>
          <div class="cell-influencer">{{ getInfluencerName(post.influencerId) }}</div>
          <div class="cell-client">{{ getClientName(post.clientId) }}</div>
          <div class="cell-project">{{ getProjectName(post.projectId) }}</div>
          <div class="cell-platform">
            <span class="platform-badge" :class="'platform-' + getInfluencerPlatform(post.influencerId).toLowerCase()">
              {{ getInfluencerPlatform(post.influencerId) }}
            </span>
          </div>
          <div class="cell-cost">¥{{ formatCurrency(post.cost) }}</div>
          <div class="cell-interactions">{{ formatNumber(post.interactions) }}</div>
          <div class="cell-actions">
            <button class="action-btn view-btn" @click="viewPost(post)">查看</button>
            <button class="action-btn edit-btn" @click="editPost(post)">编辑</button>
            <button class="action-btn delete-btn" @click="confirmDeletePost(post)">删除</button>
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
    
    <!-- 添加合作帖子对话框 -->
    <div v-if="showAddPostModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>添加合作帖子</h2>
          <button class="close-btn" @click="showAddPostModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>帖子标题:</label>
            <input v-model="newPost.title" type="text" placeholder="输入帖子标题">
          </div>
          <div class="form-group">
            <label>关联红人:</label>
            <select v-model="newPost.influencerId">
              <option value="">选择红人</option>
              <option v-for="influencer in influencers" :key="influencer.id" :value="influencer.id">
                {{ influencer.name }} ({{ influencer.platform }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>合作客户:</label>
            <select v-model="newPost.clientId">
              <option value="">选择客户</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>关联项目:</label>
            <select v-model="newPost.projectId">
              <option value="">选择项目</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>合作费用:</label>
            <input v-model="newPost.cost" type="number" placeholder="输入合作费用">
          </div>
          <div class="form-group">
            <label>帖子链接:</label>
            <input v-model="newPost.link" type="text" placeholder="输入帖子链接">
          </div>
          <div class="form-group">
            <label>帖子内容:</label>
            <textarea v-model="newPost.content" placeholder="输入帖子内容" rows="4"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showAddPostModal = false">取消</button>
          <button class="confirm-btn" @click="addPost">确认添加</button>
        </div>
      </div>
    </div>
    
    <!-- 查看帖子详情对话框 -->
    <div v-if="showViewPostModal" class="modal-overlay">
      <div class="modal-container post-detail-modal">
        <div class="modal-header">
          <h2>帖子详情</h2>
          <button class="close-btn" @click="showViewPostModal = false">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedPost" class="post-detail">
            <div class="post-detail-header">
              <h3 class="post-title">{{ selectedPost.title }}</h3>
              <div class="post-meta">
                <div class="meta-item">
                  <span class="meta-label">平台:</span>
                  <span class="platform-badge" :class="'platform-' + getInfluencerPlatform(selectedPost.influencerId).toLowerCase()">
                    {{ getInfluencerPlatform(selectedPost.influencerId) }}
                  </span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">发布日期:</span>
                  <span>{{ formatDate(selectedPost.date || Date.now()) }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <div class="detail-row">
                <div class="detail-label">关联红人:</div>
                <div class="detail-value">{{ getInfluencerName(selectedPost.influencerId) }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">合作客户:</div>
                <div class="detail-value">{{ getClientName(selectedPost.clientId) }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">关联项目:</div>
                <div class="detail-value">{{ getProjectName(selectedPost.projectId) }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">合作费用:</div>
                <div class="detail-value">¥{{ formatCurrency(selectedPost.cost) }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">互动数:</div>
                <div class="detail-value highlight">{{ formatNumber(selectedPost.interactions) }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">帖子链接:</div>
                <div class="detail-value link-value">
                  <a :href="selectedPost.link" target="_blank" rel="noopener noreferrer">{{ selectedPost.link }}</a>
                </div>
              </div>
            </div>
            
            <div class="content-section">
              <h4>帖子内容</h4>
              <div class="post-content">{{ selectedPost.content }}</div>
            </div>
            
            <div class="metrics-section">
              <h4>互动指标</h4>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-value">{{ formatNumber(selectedPost.interactions) }}</div>
                  <div class="metric-label">总互动数</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">{{ formatNumber(selectedPost.likes || Math.floor(selectedPost.interactions * 0.7)) }}</div>
                  <div class="metric-label">点赞数</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">{{ formatNumber(selectedPost.comments || Math.floor(selectedPost.interactions * 0.15)) }}</div>
                  <div class="metric-label">评论数</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">{{ formatNumber(selectedPost.shares || Math.floor(selectedPost.interactions * 0.15)) }}</div>
                  <div class="metric-label">分享数</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="confirm-btn" @click="showViewPostModal = false">关闭</button>
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
          <p>确定要删除帖子 <strong>{{ selectedPost ? selectedPost.title : '' }}</strong> 吗？</p>
          <p class="warning-text">此操作不可撤销。</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showDeleteConfirmModal = false">取消</button>
          <button class="delete-confirm-btn" @click="deletePost">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollaborationPostManagement',
  data() {
    return {
      posts: [],
      influencers: [],
      clients: [],
      projects: [],
      platforms: [],
      filteredPosts: [],
      loading: true,
      searchQuery: '',
      influencerFilter: '',
      clientFilter: '',
      platformFilter: '',
      currentPage: 1,
      pageSize: 10,
      showAddPostModal: false,
      showViewPostModal: false,
      showEditPostModal: false,
      showDeleteConfirmModal: false,
      selectedPost: null,
      newPost: {
        title: '',
        influencerId: '',
        clientId: '',
        projectId: '',
        cost: '',
        link: '',
        content: '',
        interactions: 0
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredPosts.length / this.pageSize);
    },
    paginatedPosts() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredPosts.slice(startIndex, endIndex);
    }
  },
  created() {
    this.fetchPosts();
    this.fetchInfluencers();
    this.fetchClients();
    this.fetchProjects();
    
    // 检查是否有传递的红人ID
    if (window.selectedInfluencerId) {
      this.influencerFilter = window.selectedInfluencerId.toString();
      // 使用后清除
      window.selectedInfluencerId = null;
    }
  },
  methods: {
    fetchPosts() {
      // 在真实项目中，这里会从API获取帖子数据
      this.loading = true;
      
      // 模拟API请求
      setTimeout(() => {
        // 假数据 - 合作帖子
        this.posts = [
          {
            id: 1,
            title: '夏季护肤新品展示',
            influencerId: 1,
            clientId: 3,
            projectId: 2,
            cost: 15000,
            link: 'https://www.instagram.com/p/example1',
            content: '今天为大家推荐夏季必备的几款护肤产品，这些产品都是我亲自使用过的，效果非常好！#护肤 #夏季护肤',
            interactions: 58600,
            date: '2023-07-15T12:30:00'
          },
          {
            id: 2,
            title: '健身增肌餐分享',
            influencerId: 6,
            clientId: 1,
            projectId: 4,
            cost: 12000,
            link: 'https://www.youtube.com/watch?v=example2',
            content: '健身后如何正确补充营养？今天分享我的增肌餐搭配方法，高蛋白低脂肪，助你轻松增肌！#健身 #增肌餐',
            interactions: 42300,
            date: '2023-07-05T15:45:00'
          },
          {
            id: 3,
            title: '最新科技产品开箱',
            influencerId: 4,
            clientId: 2,
            projectId: 1,
            cost: 20000,
            link: 'https://www.instagram.com/p/example3',
            content: '刚刚收到的最新款智能手表，带大家一起开箱体验它的各种功能，续航能力提升了50%！#科技 #开箱',
            interactions: 72100,
            date: '2023-06-28T09:15:00'
          },
          {
            id: 4,
            title: '旅行必备化妆品',
            influencerId: 3,
            clientId: 3,
            projectId: 3,
            cost: 18000,
            link: 'https://www.youtube.com/watch?v=example4',
            content: '出门旅行不想带太多化妆品？这几款多功能化妆品一定要带上，解决你的所有妆容需求！#旅行 #化妆品',
            interactions: 48900,
            date: '2023-06-20T14:00:00'
          },
          {
            id: 5,
            title: '早餐营养搭配指南',
            influencerId: 5,
            clientId: 4,
            projectId: 2,
            cost: 25000,
            link: 'https://www.tiktok.com/@example5',
            content: '早餐吃什么最健康？教你几种营养均衡、制作简单的早餐搭配，开启元气满满的一天！#早餐 #健康饮食',
            interactions: 63500,
            date: '2023-06-12T08:30:00'
          }
        ];
        
        // 默认排序和筛选
        this.filterPosts();
        this.loading = false;
      }, 800);
    },
    fetchInfluencers() {
      // 在真实项目中，这里会从API获取红人数据
      // 模拟API请求
      setTimeout(() => {
        this.influencers = [
          {
            id: 1,
            name: 'Emily Johnson',
            platformId: '@emilyjbeauty',
            platform: 'Instagram'
          },
          {
            id: 2,
            name: 'Lucas Wang',
            platformId: '@lucaswang_official',
            platform: 'TikTok'
          },
          {
            id: 3,
            name: 'Sophia Martinez',
            platformId: '@sophiastyle',
            platform: 'YouTube'
          },
          {
            id: 4,
            name: 'Akira Tanaka',
            platformId: '@akira_tech',
            platform: 'Instagram'
          },
          {
            id: 5,
            name: 'Nina Schmidt',
            platformId: '@nina_beauty',
            platform: 'TikTok'
          },
          {
            id: 6,
            name: 'Leo Kim',
            platformId: '@leokimfitness',
            platform: 'YouTube'
          }
        ];
        
        // 提取所有平台
        this.platforms = [...new Set(this.influencers.map(i => i.platform))];
      }, 600);
    },
    fetchClients() {
      // 模拟API请求获取客户数据
      setTimeout(() => {
        this.clients = [
          { id: 1, name: '美妆品牌A' },
          { id: 2, name: '科技公司B' },
          { id: 3, name: '护肤品牌C' },
          { id: 4, name: '健康食品D' }
        ];
      }, 500);
    },
    fetchProjects() {
      // 模拟API请求获取项目数据
      setTimeout(() => {
        this.projects = [
          { id: 1, name: '夏季新品推广' },
          { id: 2, name: '618促销活动' },
          { id: 3, name: '品牌形象提升' },
          { id: 4, name: '新用户获取计划' }
        ];
      }, 500);
    },
    filterPosts() {
      let result = [...this.posts];
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.content.toLowerCase().includes(query)
        );
      }
      
      // 红人过滤
      if (this.influencerFilter) {
        result = result.filter(p => p.influencerId === parseInt(this.influencerFilter));
      }
      
      // 客户过滤
      if (this.clientFilter) {
        result = result.filter(p => p.clientId === parseInt(this.clientFilter));
      }
      
      // 平台过滤
      if (this.platformFilter) {
        result = result.filter(p => {
          const influencer = this.influencers.find(i => i.id === p.influencerId);
          return influencer && influencer.platform === this.platformFilter;
        });
      }
      
      this.filteredPosts = result;
      // 重置为第一页
      this.currentPage = 1;
    },
    getInfluencerName(influencerId) {
      const influencer = this.influencers.find(i => i.id === influencerId);
      return influencer ? influencer.name : '未知红人';
    },
    getInfluencerPlatform(influencerId) {
      const influencer = this.influencers.find(i => i.id === influencerId);
      return influencer ? influencer.platform : '未知平台';
    },
    getClientName(clientId) {
      const client = this.clients.find(c => c.id === clientId);
      return client ? client.name : '未知客户';
    },
    getProjectName(projectId) {
      const project = this.projects.find(p => p.id === projectId);
      return project ? project.name : '未知项目';
    },
    truncateContent(content) {
      if (!content) return '';
      return content.length > 50 ? content.slice(0, 50) + '...' : content;
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
    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    viewPost(post) {
      this.selectedPost = post;
      this.showViewPostModal = true;
    },
    editPost(post) {
      this.selectedPost = {...post};
      this.showEditPostModal = true;
      alert(`编辑帖子: ${post.title}`);
    },
    confirmDeletePost(post) {
      this.selectedPost = post;
      this.showDeleteConfirmModal = true;
    },
    deletePost() {
      if (!this.selectedPost) return;
      
      // 在真实项目中，这里会调用API删除帖子
      const index = this.posts.findIndex(p => p.id === this.selectedPost.id);
      if (index !== -1) {
        this.posts.splice(index, 1);
        this.filterPosts();
        alert('帖子已删除');
      }
      
      this.selectedPost = null;
      this.showDeleteConfirmModal = false;
    },
    addPost() {
      // 验证表单
      if (!this.newPost.title || !this.newPost.influencerId || 
          !this.newPost.clientId || !this.newPost.projectId || 
          !this.newPost.cost || !this.newPost.link || 
          !this.newPost.content) {
        alert('请填写所有必填字段');
        return;
      }
      
      // 生成新帖子数据
      const newId = this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id)) + 1 : 1;
      const newPost = {
        id: newId,
        title: this.newPost.title,
        influencerId: parseInt(this.newPost.influencerId),
        clientId: parseInt(this.newPost.clientId),
        projectId: parseInt(this.newPost.projectId),
        cost: parseFloat(this.newPost.cost),
        link: this.newPost.link,
        content: this.newPost.content,
        interactions: 0,
        date: new Date().toISOString()
      };
      
      // 在真实项目中，这里会调用API保存帖子数据
      this.posts.push(newPost);
      this.filterPosts();
      
      // 重置表单
      this.newPost = {
        title: '',
        influencerId: '',
        clientId: '',
        projectId: '',
        cost: '',
        link: '',
        content: '',
        interactions: 0
      };
      
      // 关闭添加对话框
      this.showAddPostModal = false;
      alert('帖子已添加');
    },
    goToInfluencerList() {
      // 导航到红人列表页面
      const event = new CustomEvent('pageChange', {
        detail: {
          page: 'influencer'
        }
      });
      window.dispatchEvent(event);
    }
  }
}
</script>

<style scoped>
.collaboration-post-management {
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
  justify-content: space-between;
  align-items: center;
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
  white-space: nowrap;
}

.filter-group select {
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  min-width: 150px;
}

.add-post-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.add-post-btn:hover {
  background-color: #43a047;
}

.posts-table {
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

.cell-title {
  width: 18%;
  font-weight: 500;
}

.cell-influencer, .cell-client {
  width: 15%;
}

.cell-project {
  width: 15%;
}

.cell-platform {
  width: 10%;
}

.cell-cost {
  width: 10%;
  text-align: right;
}

.cell-interactions {
  width: 10%;
  text-align: right;
  color: #1976d2;
  font-weight: 500;
}

.cell-actions {
  width: 12%;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
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
  padding: 6px 10px;
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

/* 弹窗样式 */
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

.post-detail-modal {
  width: 700px;
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

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
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

.warning-text {
  color: #f44336;
  font-size: 14px;
}

.confirmation-modal {
  width: 400px;
}

/* 帖子详情样式 */
.post-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-detail-header {
  margin-bottom: 15px;
}

.post-title {
  font-size: 20px;
  color: #333;
  margin: 0 0 10px 0;
}

.post-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.meta-label {
  font-weight: 500;
}

.detail-section {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 15px;
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

.link-value a {
  color: #1976d2;
  text-decoration: none;
  word-break: break-all;
}

.link-value a:hover {
  text-decoration: underline;
}

.content-section {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 15px;
}

.content-section h4 {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 16px;
}

.post-content {
  white-space: pre-line;
  color: #333;
  line-height: 1.5;
}

.metrics-section {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 15px;
}

.metrics-section h4 {
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

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .table-header, .table-row {
    padding: 10px;
  }
  
  .cell-project, .cell-cost {
    display: none;
  }
  
  .cell-title {
    width: 30%;
  }
  
  .cell-influencer, .cell-client {
    width: 20%;
  }
  
  .cell-platform, .cell-interactions {
    width: 12%;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .cell-client {
    display: none;
  }
  
  .cell-title {
    width: 40%;
  }
  
  .cell-influencer {
    width: 25%;
  }
}
</style>
