<template>
  <div class="report-management">
    <h1 class="page-title">周报/月报管理</h1>
    
    <!-- 顶部选项卡 -->
    <div class="tabs-container">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'weekly' }" 
        @click="switchTab('weekly')"
      >
        周报
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'monthly' }" 
        @click="switchTab('monthly')"
      >
        月报
      </div>
    </div>
    
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-group">
        <label for="date-range">日期范围：</label>
        <select id="date-range" v-model="selectedDateRange" class="date-select">
          <option value="all">全部时间</option>
          <option value="last-month">最近一个月</option>
          <option value="last-quarter">最近一个季度</option>
          <option value="last-year">最近一年</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="client-select">客户：</label>
        <select id="client-select" v-model="selectedClient" class="client-select">
          <option value="">全部客户</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label for="project-select">项目：</label>
        <select id="project-select" v-model="selectedProject" class="project-select">
          <option value="">全部项目</option>
          <option v-for="project in filteredProjects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label for="status-select">状态：</label>
        <select id="status-select" v-model="selectedStatus" class="status-select">
          <option value="">全部状态</option>
          <option value="draft">草稿</option>
          <option value="pending">待审核</option>
          <option value="approved">已审核</option>
          <option value="synced">已同步</option>
        </select>
      </div>
      <button class="btn primary-btn" @click="applyFilters">
        查询
      </button>
      <button class="btn create-btn" @click="createNewReport">
        新建{{ activeTab === 'weekly' ? '周报' : '月报' }}
      </button>
    </div>
    
    <!-- 报告列表 -->
    <div class="report-list-container">
      <table class="data-table report-table">
        <thead>
          <tr>
            <th>报告期</th>
            <th>日期范围</th>
            <th>客户名称</th>
            <th>项目名称</th>
            <th>审核状态</th>
            <th>同步状态</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(report, index) in filteredReports" :key="index">
            <td>{{ report.period }}</td>
            <td>{{ report.dateRange }}</td>
            <td>{{ report.clientName }}</td>
            <td>{{ report.projectName }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(report.reviewStatus)">
                {{ getStatusText(report.reviewStatus) }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="getSyncStatusClass(report.syncStatus)">
                {{ getSyncStatusText(report.syncStatus) }}
              </span>
            </td>
            <td>{{ report.createdAt }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn view-btn small" @click="viewReport(report)">查看</button>
                <button 
                  class="btn edit-btn small" 
                  @click="editReport(report)"
                  v-if="report.reviewStatus === 'draft'"
                >
                  编辑
                </button>
                <button 
                  class="btn review-btn small" 
                  @click="reviewReport(report)"
                  v-if="report.reviewStatus === 'pending'"
                >
                  审核
                </button>
                <button 
                  class="btn sync-btn small" 
                  @click="syncReport(report)"
                  v-if="report.reviewStatus === 'approved' && report.syncStatus === 'not-synced'"
                >
                  同步
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredReports.length === 0">
            <td colspan="8" class="empty-message">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 报告详情弹窗 -->
    <div v-if="showReportModal" class="modal-overlay">
      <div class="modal-container report-modal">
        <div class="modal-header">
          <h3>{{ activeReport.period }} {{ activeTab === 'weekly' ? '周报' : '月报' }}</h3>
          <button class="close-btn" @click="closeReportModal">×</button>
        </div>
        <div class="modal-body">
          <!-- 基础信息 -->
          <div class="report-section">
            <h4>基础信息</h4>
            <div class="basic-info-grid">
              <div class="info-item">
                <div class="info-label">客户名称：</div>
                <div class="info-value">{{ activeReport.clientName }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">项目名称：</div>
                <div class="info-value">{{ activeReport.projectName }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">报告期：</div>
                <div class="info-value">{{ activeReport.period }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">日期范围：</div>
                <div class="info-value">{{ activeReport.dateRange }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">审核状态：</div>
                <div class="info-value">
                  <span class="status-badge" :class="getStatusClass(activeReport.reviewStatus)">
                    {{ getStatusText(activeReport.reviewStatus) }}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">同步状态：</div>
                <div class="info-value">
                  <span class="status-badge" :class="getSyncStatusClass(activeReport.syncStatus)">
                    {{ getSyncStatusText(activeReport.syncStatus) }}
                  </span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">创建时间：</div>
                <div class="info-value">{{ activeReport.createdAt }}</div>
              </div>
            </div>
          </div>
          
          <!-- 总结信息 -->
          <div class="report-section">
            <div class="section-header">
              <h4>报告总结</h4>
              <button v-if="!editingSummary" class="btn edit-btn small" @click="startEditSummary">
                编辑
              </button>
            </div>
            
            <div v-if="!editingSummary" class="report-summary">
              <p v-for="(paragraph, idx) in activeReport.summary.split('\n')" :key="idx">
                {{ paragraph }}
              </p>
            </div>
            
            <div v-else class="summary-editor">
              <textarea 
                v-model="editedSummary" 
                class="summary-textarea"
                rows="6"
                placeholder="请输入报告总结内容..."
              ></textarea>
              <div class="editor-buttons">
                <button class="btn secondary-btn small" @click="cancelEditSummary">取消</button>
                <button class="btn primary-btn small" @click="saveSummary">保存</button>
              </div>
            </div>
          </div>
          
          <!-- 各模块小结 -->
          <div class="report-section">
            <h4>数据模块分析</h4>
            
            <div class="module-summaries">
              <div v-for="(module, idx) in activeReport.modules" :key="idx" class="module-summary-card">
                <div class="module-header">
                  <h5>{{ module.title }}</h5>
                  <button v-if="!module.editing" class="btn edit-btn tiny" @click="startEditModule(idx)">
                    编辑
                  </button>
                </div>
                
                <div v-if="!module.editing" class="module-content">
                  <p>{{ module.content }}</p>
                </div>
                
                <div v-else class="module-editor">
                  <textarea 
                    v-model="module.editContent" 
                    class="module-textarea"
                    rows="4"
                    :placeholder="`请输入${module.title}内容...`"
                  ></textarea>
                  <div class="editor-buttons">
                    <button class="btn secondary-btn tiny" @click="cancelEditModule(idx)">取消</button>
                    <button class="btn primary-btn tiny" @click="saveModule(idx)">保存</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            class="btn download-btn" 
            @click="downloadReport"
            title="下载PDF报告"
          >
            <i class="fas fa-download"></i> 导出PDF
          </button>
          <button class="btn secondary-btn" @click="closeReportModal">关闭</button>
          <button 
            v-if="activeReport.reviewStatus === 'pending'" 
            class="btn approve-btn" 
            @click="approveReport"
          >
            审核通过
          </button>
          <button 
            v-if="activeReport.reviewStatus === 'approved' && activeReport.syncStatus === 'not-synced'" 
            class="btn sync-btn" 
            @click="syncCurrentReport"
          >
            同步到客户
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportManagement',
  data() {
    return {
      // 选项卡相关
      activeTab: 'weekly',
      
      // 筛选条件
      selectedDateRange: 'all',
      selectedClient: '',
      selectedProject: '',
      selectedStatus: '',
      
      // 弹窗相关
      showReportModal: false,
      activeReport: null,
      editingSummary: false,
      editedSummary: '',
      
      // 客户数据
      clients: [
        { id: 1, name: '北京某科技有限公司' },
        { id: 2, name: '上海某贸易有限公司' },
        { id: 3, name: '广州某电子商务有限公司' },
        { id: 4, name: '深圳某互联网科技有限公司' }
      ],
      
      // 项目数据
      projects: [
        { id: 101, name: '品牌推广项目', clientId: 1 },
        { id: 102, name: '销售增长项目', clientId: 1 },
        { id: 103, name: '市场扩张项目', clientId: 2 },
        { id: 104, name: '产品推广项目', clientId: 3 },
        { id: 105, name: '用户增长项目', clientId: 4 },
        { id: 106, name: '平台优化项目', clientId: 4 }
      ],
      
      // 周报数据
      weeklyReports: [
        {
          id: 1001,
          period: '2023年第18周',
          dateRange: '2023-05-01 至 2023-05-07',
          clientId: 1,
          clientName: '北京某科技有限公司',
          projectId: 101,
          projectName: '品牌推广项目',
          reviewStatus: 'approved',
          syncStatus: 'synced',
          createdAt: '2023-05-08 10:25:36',
          summary: '本周品牌推广项目整体进展顺利，主要指标达成情况良好。\n广告投放ROI较上周提升15%，用户获取成本降低8%。\n新渠道拓展初见成效，下周将进一步加大力度。',
          modules: [
            {
              title: '客户目标完成情况',
              content: '本周销售目标完成率92%，利润目标完成率88%，ROI目标完成率105%。与上周相比，各项指标均有稳步提升，特别是ROI指标超额完成。',
              editing: false,
              editContent: ''
            },
            {
              title: '网站整体数据',
              content: '网站总体流量较上周增长12%，用户停留时间提升15%，跳出率下降5个百分点。移动端访问占比提升至65%，PC端访问呈下降趋势。',
              editing: false,
              editContent: ''
            },
            {
              title: '渠道流量分析',
              content: '社交媒体渠道贡献流量占比32%，较上周提升5个百分点。搜索引擎流量相对稳定，占比28%。直接访问略有下降，可能与节假日结束有关。',
              editing: false,
              editContent: ''
            },
            {
              title: '广告平台数据',
              content: 'Google Ads平台ROI表现最佳，达到350%。Facebook广告点击率提升，但转化率有待优化。建议调整创意素材，提升用户转化效果。',
              editing: false,
              editContent: ''
            },
            {
              title: '产品销售情况',
              content: '产品A销量领先，占总销量的35%。产品B增长迅速，环比增长25%。产品C库存偏低，建议增加备货。',
              editing: false,
              editContent: ''
            }
          ]
        },
        {
          id: 1002,
          period: '2023年第17周',
          dateRange: '2023-04-24 至 2023-04-30',
          clientId: 1,
          clientName: '北京某科技有限公司',
          projectId: 101,
          projectName: '品牌推广项目',
          reviewStatus: 'approved',
          syncStatus: 'synced',
          createdAt: '2023-05-01 09:18:42',
          summary: '本周品牌推广项目整体进展平稳，部分指标有待提升。\n用户获取成本较高，需优化投放策略。\n产品促销活动效果良好，带动销售额提升20%。',
          modules: [
            {
              title: '客户目标完成情况',
              content: '本周销售目标完成率85%，利润目标完成率80%，ROI目标完成率90%。与上周相比略有下降，主要受节假日影响。',
              editing: false,
              editContent: ''
            },
            {
              title: '网站整体数据',
              content: '网站整体访问量较上周下降5%，但用户转化率提升3个百分点，客单价提高10%，总体销售额保持稳定。',
              editing: false,
              editContent: ''
            },
            {
              title: '渠道流量分析',
              content: '搜索引擎渠道表现最佳，贡献30%的流量。邮件营销活动效果显著，点击率达25%，高于行业平均水平。',
              editing: false,
              editContent: ''
            }
          ]
        },
        {
          id: 1003,
          period: '2023年第16周',
          dateRange: '2023-04-17 至 2023-04-23',
          clientId: 2,
          clientName: '上海某贸易有限公司',
          projectId: 103,
          projectName: '市场扩张项目',
          reviewStatus: 'pending',
          syncStatus: 'not-synced',
          createdAt: '2023-04-24 14:05:18',
          summary: '本周市场扩张项目取得重要突破，新市场渗透率超预期。\n华东区域销售额环比增长30%，成为新的增长点。\n品牌知名度提升，市场反馈积极正面。',
          modules: [
            {
              title: '客户目标完成情况',
              content: '本周销售目标完成率110%，利润目标完成率95%，新用户获取目标完成率120%。市场扩张项目成效显著。',
              editing: false,
              editContent: ''
            },
            {
              title: '网站整体数据',
              content: '新市场地区访问量增长显著，其中华东地区增长42%。移动端转化率首次超过PC端，建议优化移动端购物体验。',
              editing: false,
              editContent: ''
            }
          ]
        },
        {
          id: 1004,
          period: '2023年第15周',
          dateRange: '2023-04-10 至 2023-04-16',
          clientId: 3,
          clientName: '广州某电子商务有限公司',
          projectId: 104,
          projectName: '产品推广项目',
          reviewStatus: 'draft',
          syncStatus: 'not-synced',
          createdAt: '2023-04-17 16:35:27',
          summary: '本周为产品推广项目第一周，各项工作开展有序。\n初步完成推广策略制定，渠道资源整合。\n数据采集系统搭建完成，为后续优化提供支持。',
          modules: [
            {
              title: '产品推广计划',
              content: '完成产品推广整体规划，确定目标人群与核心卖点。计划分三阶段实施，当前处于第一阶段前期。',
              editing: false,
              editContent: ''
            }
          ]
        }
      ],
      
      // 月报数据
      monthlyReports: [
        {
          id: 2001,
          period: '2023年4月',
          dateRange: '2023-04-01 至 2023-04-30',
          clientId: 1,
          clientName: '北京某科技有限公司',
          projectId: 101,
          projectName: '品牌推广项目',
          reviewStatus: 'approved',
          syncStatus: 'synced',
          createdAt: '2023-05-02 11:20:36',
          summary: '4月份品牌推广项目整体表现良好，关键指标均实现稳步增长。\n销售额较上月增长15%，利润率提升2个百分点。\n新用户获取成本降低，客户留存率提高，品牌知名度持续提升。\n建议下月加大社交媒体投放力度，抓住季节性消费热点。',
          modules: [
            {
              title: '月度业绩概览',
              content: '4月总销售额达525万元，完成月度目标的92%。新增用户580人，用户增长率12%，客单价较上月提升8%。季节性产品销售表现突出。',
              editing: false,
              editContent: ''
            },
            {
              title: '渠道效果分析',
              content: '本月社交媒体渠道ROI最高，达到380%。搜索广告获客成本较高但质量较好，客户留存率高于平均水平15个百分点。',
              editing: false,
              editContent: ''
            },
            {
              title: '产品表现分析',
              content: '产品线中A系列表现最佳，贡献45%的销售额。B系列需要优化产品页面，当前转化率低于平均水平。C系列库存周转率提升，供应链优化见效。',
              editing: false,
              editContent: ''
            }
          ]
        },
        {
          id: 2002,
          period: '2023年3月',
          dateRange: '2023-03-01 至 2023-03-31',
          clientId: 1,
          clientName: '北京某科技有限公司',
          projectId: 101,
          projectName: '品牌推广项目',
          reviewStatus: 'approved',
          syncStatus: 'synced',
          createdAt: '2023-04-03 09:45:18',
          summary: '3月份品牌推广项目整体达成预期目标，各项指标平稳发展。\n广告投放效率持续优化，投入产出比提升。\n用户行为分析发现新的增长机会，将在下月针对性开展活动。',
          modules: [
            {
              title: '月度业绩概览',
              content: '3月总销售额达480万元，完成月度目标的88%。产品平均利润率32%，符合预期。用户满意度调查结果良好，NPS得分78分。',
              editing: false,
              editContent: ''
            },
            {
              title: '市场活动分析',
              content: '本月开展2次促销活动，促销期间销售额提升35%，但利润率有所下降。建议下月平衡促销频次与利润目标。',
              editing: false,
              editContent: ''
            }
          ]
        },
        {
          id: 2003,
          period: '2023年3月',
          dateRange: '2023-03-01 至 2023-03-31',
          clientId: 2,
          clientName: '上海某贸易有限公司',
          projectId: 103,
          projectName: '市场扩张项目',
          reviewStatus: 'pending',
          syncStatus: 'not-synced',
          createdAt: '2023-04-02 15:28:40',
          summary: '3月份市场扩张项目按计划推进，新市场布局初见成效。\n区域销售团队组建完成，本地化营销策略落地。\n产品适应性调整完成，满足当地市场需求。',
          modules: [
            {
              title: '市场拓展进展',
              content: '已完成华东三省市场调研，确定重点城市拓展策略。当地合作伙伴招募完成65%，进度符合预期。',
              editing: false,
              editContent: ''
            },
            {
              title: '区域销售数据',
              content: '新拓展区域销售额达120万元，占总销售额的15%。客户获取成本较高，但具有长期价值，后续将持续优化获客策略。',
              editing: false,
              editContent: ''
            }
          ]
        }
      ]
    };
  },
  computed: {
    // 根据选中的客户筛选项目
    filteredProjects() {
      if (!this.selectedClient) {
        return this.projects;
      }
      return this.projects.filter(project => project.clientId === parseInt(this.selectedClient));
    },
    
    // 根据筛选条件过滤报告
    filteredReports() {
      const reports = this.activeTab === 'weekly' ? this.weeklyReports : this.monthlyReports;
      
      return reports.filter(report => {
        // 根据客户筛选
        if (this.selectedClient && report.clientId !== parseInt(this.selectedClient)) {
          return false;
        }
        
        // 根据项目筛选
        if (this.selectedProject && report.projectId !== parseInt(this.selectedProject)) {
          return false;
        }
        
        // 根据状态筛选
        if (this.selectedStatus) {
          if (this.selectedStatus === 'draft' && report.reviewStatus !== 'draft') {
            return false;
          } else if (this.selectedStatus === 'pending' && report.reviewStatus !== 'pending') {
            return false;
          } else if (this.selectedStatus === 'approved' && report.reviewStatus !== 'approved') {
            return false;
          } else if (this.selectedStatus === 'synced' && report.syncStatus !== 'synced') {
            return false;
          }
        }
        
        // 根据日期范围筛选 (实际项目中可以根据日期进行更精确的筛选)
        if (this.selectedDateRange !== 'all') {
          // 简化处理，实际项目需要根据具体日期进行筛选
          return true;
        }
        
        return true;
      });
    }
  },
  methods: {
    // 切换选项卡
    switchTab(tab) {
      this.activeTab = tab;
    },
    
    // 应用筛选条件
    applyFilters() {
      console.log('应用筛选条件', {
        tab: this.activeTab,
        dateRange: this.selectedDateRange,
        client: this.selectedClient,
        project: this.selectedProject,
        status: this.selectedStatus
      });
    },
    
    // 创建新报告
    createNewReport() {
      console.log('创建新报告', this.activeTab);
      this.$router.push({
        path: '/report/create',
        query: { type: this.activeTab }
      });
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      switch (status) {
        case 'draft':
          return 'status-draft';
        case 'pending':
          return 'status-pending';
        case 'approved':
          return 'status-approved';
        default:
          return '';
      }
    },
    
    // 获取状态文本
    getStatusText(status) {
      switch (status) {
        case 'draft':
          return '草稿';
        case 'pending':
          return '待审核';
        case 'approved':
          return '已审核';
        default:
          return '未知状态';
      }
    },
    
    // 获取同步状态样式类
    getSyncStatusClass(status) {
      switch (status) {
        case 'not-synced':
          return 'status-not-synced';
        case 'synced':
          return 'status-synced';
        default:
          return '';
      }
    },
    
    // 获取同步状态文本
    getSyncStatusText(status) {
      switch (status) {
        case 'not-synced':
          return '未同步';
        case 'synced':
          return '已同步';
        default:
          return '未知状态';
      }
    },
    
    // 查看报告详情
    viewReport(report) {
      this.activeReport = JSON.parse(JSON.stringify(report)); // 深拷贝防止直接修改
      this.showReportModal = true;
    },
    
    // 关闭报告详情弹窗
    closeReportModal() {
      this.showReportModal = false;
      this.activeReport = null;
      this.editingSummary = false;
    },
    
    // 开始编辑总结
    startEditSummary() {
      this.editedSummary = this.activeReport.summary;
      this.editingSummary = true;
    },
    
    // 取消编辑总结
    cancelEditSummary() {
      this.editingSummary = false;
      this.editedSummary = '';
    },
    
    // 保存总结
    saveSummary() {
      if (!this.editedSummary.trim()) {
        alert('总结内容不能为空');
        return;
      }
      
      this.activeReport.summary = this.editedSummary;
      this.editingSummary = false;
      
      // 实际项目中这里应该调用API保存修改
      console.log('保存总结', this.activeReport.summary);
    },
    
    // 开始编辑模块
    startEditModule(index) {
      this.activeReport.modules[index].editing = true;
      this.activeReport.modules[index].editContent = this.activeReport.modules[index].content;
    },
    
    // 取消编辑模块
    cancelEditModule(index) {
      this.activeReport.modules[index].editing = false;
      this.activeReport.modules[index].editContent = '';
    },
    
    // 保存模块内容
    saveModule(index) {
      const module = this.activeReport.modules[index];
      
      if (!module.editContent.trim()) {
        alert('模块内容不能为空');
        return;
      }
      
      module.content = module.editContent;
      module.editing = false;
      
      // 实际项目中这里应该调用API保存修改
      console.log('保存模块内容', index, module.content);
    },
    
    // 审核报告
    reviewReport(report) {
      console.log('审核报告', report.id);
      this.viewReport(report);
    },
    
    // 审核通过当前报告
    approveReport() {
      console.log('审核通过报告', this.activeReport.id);
      
      // 实际项目中这里应该调用API更新状态
      this.activeReport.reviewStatus = 'approved';
      
      // 同时更新列表中的状态
      const reportsList = this.activeTab === 'weekly' ? this.weeklyReports : this.monthlyReports;
      const reportIndex = reportsList.findIndex(r => r.id === this.activeReport.id);
      
      if (reportIndex !== -1) {
        reportsList[reportIndex].reviewStatus = 'approved';
      }
      
      alert('报告审核通过！');
    },
    
    // 同步报告到客户
    syncReport(report) {
      console.log('同步报告到客户', report.id);
      
      // 实际项目中这里应该调用API同步报告
      const confirmSync = confirm(`确定要将该报告同步给客户吗？\n客户：${report.clientName}\n项目：${report.projectName}`);
      
      if (confirmSync) {
        // 更新报告状态
        const reportsList = this.activeTab === 'weekly' ? this.weeklyReports : this.monthlyReports;
        const reportIndex = reportsList.findIndex(r => r.id === report.id);
        
        if (reportIndex !== -1) {
          reportsList[reportIndex].syncStatus = 'synced';
        }
        
        alert('报告已成功同步给客户！');
      }
    },
    
    // 同步当前查看的报告
    syncCurrentReport() {
      console.log('同步当前报告到客户', this.activeReport.id);
      
      // 实际项目中这里应该调用API同步报告
      const confirmSync = confirm(`确定要将该报告同步给客户吗？\n客户：${this.activeReport.clientName}\n项目：${this.activeReport.projectName}`);
      
      if (confirmSync) {
        // 更新报告状态
        this.activeReport.syncStatus = 'synced';
        
        // 同时更新列表中的状态
        const reportsList = this.activeTab === 'weekly' ? this.weeklyReports : this.monthlyReports;
        const reportIndex = reportsList.findIndex(r => r.id === this.activeReport.id);
        
        if (reportIndex !== -1) {
          reportsList[reportIndex].syncStatus = 'synced';
        }
        
        alert('报告已成功同步给客户！');
      }
    },
    
    // 编辑报告
    editReport(report) {
      console.log('编辑报告', report.id);
      
      this.$router.push({
        path: '/report/create',
        query: { 
          edit: 'true',
          id: report.id,
          type: this.activeTab 
        }
      });
    },
    
    // 下载报告
    downloadReport() {
      console.log('下载报告', this.activeReport.id);
      
      // 模拟报告下载过程
      const loadingMsg = '正在生成PDF报告...';
      alert(loadingMsg);
      
      // 模拟异步处理
      setTimeout(() => {
        // 在实际项目中，这里会是真实的PDF生成和下载逻辑
        const reportName = this.activeTab === 'weekly' 
          ? `周报_${this.activeReport.clientName}_${this.activeReport.period}`
          : `月报_${this.activeReport.clientName}_${this.activeReport.period}`;
          
        alert(`${reportName}.pdf 已生成，开始下载...`);
        
        // 模拟下载完成提示
        setTimeout(() => {
          alert('报告下载完成！');
        }, 1000);
      }, 2000);
    }
  }
};
</script>

<style scoped>
.report-management {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

/* 选项卡样式 */
.tabs-container {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.tab {
  padding: 12px 24px;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  position: relative;
  transition: all 0.3s;
}

.tab.active {
  color: #1976d2;
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1976d2;
}

.tab:hover {
  background-color: #f5f5f5;
}

/* 筛选栏样式 */
.filter-bar {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.filter-group label {
  margin-right: 8px;
  font-weight: 500;
  color: #555;
}

.date-select,
.client-select,
.project-select,
.status-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 180px;
}

/* 报告列表样式 */
.report-list-container {
  margin-bottom: 30px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.report-table th,
.report-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.report-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #555;
}

.report-table tr:hover {
  background-color: #f9f9f9;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-draft {
  background-color: #e0e0e0;
  color: #757575;
}

.status-pending {
  background-color: #fff8e1;
  color: #ff8f00;
}

.status-approved {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-not-synced {
  background-color: #f3e5f5;
  color: #8e24aa;
}

.status-synced {
  background-color: #e3f2fd;
  color: #1976d2;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  margin-right: 8px;
}

.btn.small {
  padding: 4px 8px;
  font-size: 12px;
}

.btn.tiny {
  padding: 2px 6px;
  font-size: 11px;
}

.primary-btn {
  background-color: #1976d2;
  color: white;
}

.primary-btn:hover {
  background-color: #1565c0;
}

.secondary-btn {
  background-color: #f5f5f5;
  color: #333;
}

.secondary-btn:hover {
  background-color: #e0e0e0;
}

.create-btn {
  background-color: #4CAF50;
  color: white;
}

.create-btn:hover {
  background-color: #388E3C;
}

.view-btn {
  background-color: #2196F3;
  color: white;
}

.view-btn:hover {
  background-color: #1E88E5;
}

.review-btn {
  background-color: #FF9800;
  color: white;
}

.review-btn:hover {
  background-color: #F57C00;
}

.sync-btn {
  background-color: #9C27B0;
  color: white;
}

.sync-btn:hover {
  background-color: #7B1FA2;
}

.approve-btn {
  background-color: #4CAF50;
  color: white;
}

.approve-btn:hover {
  background-color: #388E3C;
}

.edit-btn {
  background-color: transparent;
  color: #1976d2;
  border: 1px solid #1976d2;
  padding: 2px 8px;
}

.edit-btn:hover {
  background-color: #e3f2fd;
}

.empty-message {
  text-align: center;
  padding: 30px;
  color: #888;
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
  z-index: 9999;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 900px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.report-modal {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.download-btn {
  background-color: #607D8B;
  color: white;
  margin-right: auto; /* 将下载按钮推到左侧 */
}

.download-btn:hover {
  background-color: #455A64;
}

/* 报告详情样式 */
.report-section {
  margin-bottom: 25px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.report-section h4 {
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  color: #333;
  font-size: 16px;
}

.section-header h4 {
  margin: 0;
  padding: 0;
  border: none;
}

.basic-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
}

.info-label {
  font-weight: bold;
  margin-right: 10px;
  width: 80px;
  color: #555;
}

.info-value {
  flex: 1;
}

.report-summary {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  line-height: 1.6;
}

.summary-editor {
  margin-top: 10px;
}

.summary-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
}

.editor-buttons {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 模块小结样式 */
.module-summaries {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.module-summary-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f5f5;
}

.module-header h5 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.module-content {
  padding: 15px;
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}

.module-content p {
  margin: 0;
}

.module-editor {
  padding: 15px;
}

.module-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .basic-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .module-summaries {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .date-select,
  .client-select,
  .project-select,
  .status-select {
    width: 100%;
  }
  
  .basic-info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 