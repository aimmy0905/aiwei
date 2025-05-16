<template>
  <div class="dashboard-controls">
    <div class="control-panel">
      <div class="control-group">
        <div class="control-item">
          <label for="client-select">客户</label>
          <select 
            id="client-select" 
            v-model="selectedClient"
            @change="onClientChange"
            class="control-select"
          >
            <option value="全部客户">全部客户</option>
            <option value="上海某科技有限公司">上海某科技有限公司</option>
            <option value="北京某贸易有限公司">北京某贸易有限公司</option>
            <option value="广州某电子有限公司">广州某电子有限公司</option>
            <option value="深圳某数码有限公司">深圳某数码有限公司</option>
          </select>
        </div>
        
        <div class="control-item">
          <label for="project-select">项目</label>
          <select 
            id="project-select" 
            v-model="selectedProject"
            @change="onProjectChange"
            class="control-select"
            :disabled="selectedClient === '全部客户'"
          >
            <option value="全部项目">全部项目</option>
            <option v-for="project in availableProjects" :key="project" :value="project">
              {{ project }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="control-group time-controls">
        <div class="time-presets">
          <button 
            v-for="option in timeOptions" 
            :key="option.value"
            class="time-option"
            :class="{ active: timeRange.type === option.value }"
            @click="selectTimeOption(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        
        <div class="custom-date-range" v-if="timeRange.type === 'custom'">
          <div class="date-inputs">
            <div class="date-field">
              <label for="start-date">开始日期</label>
              <input 
                type="date" 
                id="start-date"
                v-model="customStartDate"
                @change="updateCustomRange"
                class="date-input"
              />
            </div>
            <span class="date-separator">至</span>
            <div class="date-field">
              <label for="end-date">结束日期</label>
              <input 
                type="date" 
                id="end-date"
                v-model="customEndDate"
                @change="updateCustomRange"
                class="date-input"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="control-group report-buttons">
        <button class="report-btn" @click="viewWeeklyReport">
          查看周报
        </button>
        <button class="report-btn" @click="viewMonthlyReport">
          查看月报
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardControls',
  data() {
    return {
      selectedClient: '全部客户',
      selectedProject: '全部项目',
      timeRange: {
        type: 'last7days',
        startDate: null,
        endDate: null
      },
      customStartDate: '',
      customEndDate: '',
      timeOptions: [
        { label: '今天', value: 'today' },
        { label: '近7天', value: 'last7days' },
        { label: '近14天', value: 'last14days' },
        { label: '近30天', value: 'last30days' },
        { label: '近90天', value: 'last90days' },
        { label: '近1年', value: 'last1year' },
        { label: '自定义', value: 'custom' }
      ],
      // 模拟的客户项目映射数据
      clientProjects: {
        '上海某科技有限公司': ['电商广告投放项目', '品牌SEO优化项目'],
        '北京某贸易有限公司': ['品牌推广项目', '海外市场拓展项目'],
        '广州某电子有限公司': ['产品推广项目', '新品上市推广'],
        '深圳某数码有限公司': ['社交媒体营销项目', '电商平台运营']
      }
    }
  },
  computed: {
    availableProjects() {
      if (this.selectedClient === '全部客户') {
        return [];
      }
      return this.clientProjects[this.selectedClient] || [];
    }
  },
  mounted() {
    // 初始化时设置默认的时间范围
    this.setTimeRangeDates('last7days');
  },
  methods: {
    onClientChange() {
      this.selectedProject = '全部项目';
      this.$emit('changeClient', this.selectedClient);
    },
    
    onProjectChange() {
      this.$emit('changeProject', this.selectedProject);
    },
    
    selectTimeOption(type) {
      this.timeRange.type = type;
      
      if (type !== 'custom') {
        this.setTimeRangeDates(type);
      }
    },
    
    setTimeRangeDates(type) {
      const today = new Date();
      let startDate = new Date(today);
      
      switch (type) {
        case 'today':
          // 开始和结束日期都是今天
          break;
        case 'last7days':
          startDate.setDate(today.getDate() - 6);
          break;
        case 'last14days':
          startDate.setDate(today.getDate() - 13);
          break;
        case 'last30days':
          startDate.setDate(today.getDate() - 29);
          break;
        case 'last90days':
          startDate.setDate(today.getDate() - 89);
          break;
        case 'last1year':
          startDate.setFullYear(today.getFullYear() - 1);
          startDate.setDate(today.getDate() + 1);
          break;
      }
      
      this.timeRange.startDate = this.formatDate(startDate);
      this.timeRange.endDate = this.formatDate(today);
      
      // 更新自定义日期输入框的值
      this.customStartDate = this.timeRange.startDate;
      this.customEndDate = this.timeRange.endDate;
      
      // 通知父组件时间范围变更
      this.$emit('changeTimeRange', { ...this.timeRange });
    },
    
    updateCustomRange() {
      this.timeRange.startDate = this.customStartDate;
      this.timeRange.endDate = this.customEndDate;
      
      // 通知父组件时间范围变更
      this.$emit('changeTimeRange', { ...this.timeRange });
    },
    
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    viewWeeklyReport() {
      // 这里应该有实际的跳转到周报页面的逻辑
      alert('跳转到周报页面');
    },
    
    viewMonthlyReport() {
      // 这里应该有实际的跳转到月报页面的逻辑
      alert('跳转到月报页面');
    }
  }
}
</script>

<style scoped>
.dashboard-controls {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  padding: 20px;
}

.control-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.control-group {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 15px;
}

.control-item {
  min-width: 200px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
}

.control-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  color: #333;
  background-color: #fff;
}

.control-select:focus {
  outline: none;
  border-color: #1976d2;
}

.control-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.time-controls {
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.time-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.time-option {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.time-option:hover {
  background-color: #f5f7fa;
}

.time-option.active {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

.custom-date-range {
  width: 100%;
  margin-top: 10px;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-field {
  flex: 1;
}

.date-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  color: #333;
}

.date-input:focus {
  outline: none;
  border-color: #1976d2;
}

.date-separator {
  color: #666;
  margin: 0 5px;
}

.report-buttons {
  margin-left: auto;
}

.report-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #f5f7fa;
  color: #555;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 10px;
}

.report-btn:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .control-panel {
    flex-direction: column;
  }
  
  .report-buttons {
    margin-left: 0;
    margin-top: 10px;
  }
  
  .report-btn {
    margin-left: 0;
    margin-right: 10px;
  }
}
</style> 