<template>
  <div class="create-report">
    <div class="page-header">
      <h1>{{ isEdit ? '编辑' : '创建' }}{{ reportType === 'weekly' ? '周报' : '月报' }}</h1>
      <button class="btn secondary-btn" @click="goBack">返回</button>
    </div>

    <div class="report-form">
      <div class="form-section">
        <h3>基础信息</h3>
        <div class="form-grid">
          <div class="form-group">
            <label for="report-type">报告类型</label>
            <select id="report-type" v-model="reportType" class="form-control" :disabled="isEdit">
              <option value="weekly">周报</option>
              <option value="monthly">月报</option>
            </select>
          </div>

          <div class="form-group">
            <label for="client">客户</label>
            <select id="client" v-model="clientId" class="form-control" @change="onClientChange">
              <option value="">请选择客户</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">
                {{ client.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="project">项目</label>
            <select id="project" v-model="projectId" class="form-control" :disabled="!clientId">
              <option value="">请选择项目</option>
              <option v-for="project in filteredProjects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="period-start">报告期开始</label>
            <input type="date" id="period-start" v-model="periodStart" class="form-control" />
          </div>

          <div class="form-group">
            <label for="period-end">报告期结束</label>
            <input type="date" id="period-end" v-model="periodEnd" class="form-control" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>报告总结</h3>
        <div class="form-group">
          <textarea 
            v-model="summary" 
            class="form-control summary-textarea" 
            rows="6" 
            placeholder="请输入本期报告的总体总结..."></textarea>
        </div>
      </div>

      <div class="form-section">
        <div class="section-header">
          <h3>数据模块分析</h3>
          <button class="btn primary-btn small" @click="addModule">添加模块</button>
        </div>

        <div v-if="modules.length === 0" class="empty-modules">
          请添加数据分析模块
        </div>

        <div v-for="(module, index) in modules" :key="index" class="module-item">
          <div class="module-header">
            <input 
              type="text" 
              v-model="module.title" 
              class="form-control module-title" 
              placeholder="模块标题"
            />
            <button class="btn delete-btn small" @click="removeModule(index)">删除</button>
          </div>
          <textarea 
            v-model="module.content" 
            class="form-control module-content" 
            rows="4" 
            placeholder="请输入模块分析内容..."></textarea>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn secondary-btn" @click="cancelEdit">取消</button>
        <button class="btn primary-btn" @click="saveReport" :disabled="!isFormValid">保存</button>
        <button class="btn submit-btn" @click="submitReport" :disabled="!isFormValid">提交审核</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateReport',
  data() {
    return {
      isEdit: false,
      reportId: null,
      reportType: 'weekly',
      clientId: '',
      projectId: '',
      periodStart: '',
      periodEnd: '',
      summary: '',
      modules: [],
      
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
      ]
    }
  },
  computed: {
    filteredProjects() {
      if (!this.clientId) return [];
      return this.projects.filter(project => project.clientId === parseInt(this.clientId));
    },
    isFormValid() {
      return (
        this.clientId && 
        this.projectId && 
        this.periodStart && 
        this.periodEnd && 
        this.summary.trim() && 
        this.modules.length > 0 && 
        this.modules.every(module => module.title.trim() && module.content.trim())
      );
    }
  },
  methods: {
    goBack() {
      this.$router.push('/report');
    },
    
    onClientChange() {
      this.projectId = '';
    },
    
    addModule() {
      this.modules.push({
        title: '',
        content: ''
      });
    },
    
    removeModule(index) {
      this.modules.splice(index, 1);
    },
    
    cancelEdit() {
      if (confirm('确定要取消编辑吗？所有未保存的内容将丢失。')) {
        this.goBack();
      }
    },
    
    saveReport() {
      // 检查表单有效性
      if (!this.isFormValid) {
        alert('请完成所有必填项');
        return;
      }
      
      // 构建报告数据
      const reportData = this.buildReportData();
      reportData.reviewStatus = 'draft';
      
      console.log('保存报告', reportData);
      
      // 实际项目中这里应该调用API保存报告
      alert('报告已保存为草稿');
      this.goBack();
    },
    
    submitReport() {
      // 检查表单有效性
      if (!this.isFormValid) {
        alert('请完成所有必填项');
        return;
      }
      
      // 构建报告数据
      const reportData = this.buildReportData();
      reportData.reviewStatus = 'pending';
      
      console.log('提交报告审核', reportData);
      
      // 实际项目中这里应该调用API提交报告
      alert('报告已提交审核');
      this.goBack();
    },
    
    buildReportData() {
      // 获取客户和项目名称
      const client = this.clients.find(c => c.id === parseInt(this.clientId));
      const project = this.projects.find(p => p.id === parseInt(this.projectId));
      
      // 格式化日期范围
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      };
      
      // 生成报告期文本
      let periodText = '';
      if (this.reportType === 'weekly') {
        const startDate = new Date(this.periodStart);
        const year = startDate.getFullYear();
        // 计算周数
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (startDate - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        periodText = `${year}年第${weekNumber}周`;
      } else {
        const startDate = new Date(this.periodStart);
        const year = startDate.getFullYear();
        const month = startDate.getMonth() + 1;
        periodText = `${year}年${month}月`;
      }
      
      return {
        id: this.isEdit ? this.reportId : Date.now(), // 使用时间戳作为临时ID
        type: this.reportType,
        period: periodText,
        dateRange: `${formatDate(this.periodStart)} 至 ${formatDate(this.periodEnd)}`,
        clientId: parseInt(this.clientId),
        clientName: client ? client.name : '',
        projectId: parseInt(this.projectId),
        projectName: project ? project.name : '',
        summary: this.summary,
        modules: this.modules.map(module => ({
          title: module.title,
          content: module.content,
          editing: false,
          editContent: ''
        })),
        syncStatus: 'not-synced',
        createdAt: new Date().toLocaleString('zh-CN')
      };
    },
    
    // 加载报告数据（用于编辑现有报告）
    loadReportData(reportId) {
      // 实际项目中这里应该调用API获取报告数据
      console.log('加载报告数据', reportId);
      
      // 模拟从API获取报告数据
      const reportsList = this.reportType === 'weekly' 
        ? [
            // 模拟周报数据
            {
              id: 1001,
              type: 'weekly',
              period: '2023年第18周',
              dateRange: '2023-05-01 至 2023-05-07',
              clientId: 1,
              clientName: '北京某科技有限公司',
              projectId: 101,
              projectName: '品牌推广项目',
              reviewStatus: 'draft', // 只有草稿状态的报告才能编辑
              syncStatus: 'not-synced',
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
                }
              ]
            }
          ]
        : [
            // 模拟月报数据
            {
              id: 2001,
              type: 'monthly',
              period: '2023年5月',
              dateRange: '2023-05-01 至 2023-05-31',
              clientId: 2,
              clientName: '上海某贸易有限公司',
              projectId: 103,
              projectName: '市场扩张项目',
              reviewStatus: 'draft',
              syncStatus: 'not-synced',
              createdAt: '2023-06-01 09:15:22',
              summary: '5月份市场扩张项目取得显著进展，各项指标均超额完成。\n新市场渗透率提升25%，品牌知名度提升15%。\n用户增长迅速，新增客户转化率高于行业平均水平。',
              modules: [
                {
                  title: '月度目标达成情况',
                  content: '5月销售目标完成率115%，利润目标完成率108%，ROI目标完成率120%。与4月相比，各项指标均有大幅提升。',
                  editing: false,
                  editContent: ''
                },
                {
                  title: '市场渠道分析',
                  content: '社交媒体渠道表现最佳，贡献40%销售额。搜索引擎营销效果显著，投入产出比提升20%。直接访问占比稳定在25%左右。',
                  editing: false,
                  editContent: ''
                }
              ]
            }
          ];
      
      // 查找对应ID的报告
      const report = reportsList.find(r => r.id === parseInt(reportId));
      
      if (report) {
        this.isEdit = true;
        this.reportId = report.id;
        this.reportType = report.type;
        
        // 解析日期范围
        const dateRange = report.dateRange.split(' 至 ');
        if (dateRange.length === 2) {
          this.periodStart = dateRange[0];
          this.periodEnd = dateRange[1];
        }
        
        this.clientId = report.clientId;
        this.projectId = report.projectId;
        this.summary = report.summary;
        
        // 加载模块数据
        this.modules = report.modules.map(module => ({
          title: module.title,
          content: module.content
        }));
      } else {
        // 未找到报告，返回列表页
        alert('未找到要编辑的报告');
        this.goBack();
      }
    }
  },
  created() {
    // 获取路由参数
    const { type, edit, id } = this.$route.query;
    
    if (type && (type === 'weekly' || type === 'monthly')) {
      this.reportType = type;
    }
    
    if (edit === 'true' && id) {
      this.loadReportData(id);
    }
    
    // 设置默认日期（当前周或当前月）
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // 转换周日(0)为7
    
    if (this.reportType === 'weekly') {
      // 计算本周的周一和周日
      const monday = new Date(today);
      monday.setDate(today.getDate() - dayOfWeek + 1);
      
      const sunday = new Date(today);
      sunday.setDate(today.getDate() + (7 - dayOfWeek));
      
      this.periodStart = monday.toISOString().split('T')[0];
      this.periodEnd = sunday.toISOString().split('T')[0];
    } else {
      // 计算本月的第一天和最后一天
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      this.periodStart = firstDay.toISOString().split('T')[0];
      this.periodEnd = lastDay.toISOString().split('T')[0];
    }
  }
}
</script>

<style scoped>
.create-report {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.report-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.form-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  border-color: #1976d2;
  outline: none;
}

.summary-textarea {
  resize: vertical;
}

.empty-modules {
  padding: 20px;
  text-align: center;
  color: #888;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.module-item {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.module-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.module-title {
  flex: 1;
  font-weight: bold;
}

.module-content {
  resize: vertical;
}

.form-actions {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
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
  border: 1px solid #ddd;
}

.secondary-btn:hover {
  background-color: #e0e0e0;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
}

.submit-btn:hover {
  background-color: #388e3c;
}

@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style> 