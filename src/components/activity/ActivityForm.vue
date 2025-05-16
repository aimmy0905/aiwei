<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditing ? '编辑活动' : '新增活动' }}</h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="saveActivity">
          <div class="form-group">
            <label>活动名称 <span class="required">*</span></label>
            <input type="text" v-model="form.name" required>
          </div>
          
          <div class="form-group">
            <label>选择客户 <span class="required">*</span></label>
            <select v-model="form.customer" required class="form-select">
              <option value="" disabled>请选择客户</option>
              <option v-for="customer in customers" :key="customer" :value="customer">
                {{ customer }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>选择项目 <span class="required">*</span></label>
            <select v-model="form.project" required class="form-select">
              <option value="" disabled>请选择项目</option>
              <option v-for="project in projects" :key="project" :value="project">
                {{ project }}
              </option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>开始日期 <span class="required">*</span></label>
              <input type="date" v-model="form.startDate" required>
            </div>
            <div class="form-group">
              <label>结束日期 <span class="required">*</span></label>
              <input type="date" v-model="form.endDate" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>活动渠道</label>
            <input type="text" v-model="form.channel">
          </div>
          
          <div class="form-group">
            <label>活动预算</label>
            <input type="number" v-model="form.budget" min="0" step="0.01" placeholder="请输入活动预算金额">
          </div>
          
          <div class="form-group">
            <label>活动商品</label>
            <input type="text" v-model="form.products">
          </div>
          
          <div class="form-group">
            <label>活动内容</label>
            <textarea v-model="form.content" rows="4"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-button" @click="$emit('close')">取消</button>
            <button type="submit" class="save-button">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityForm',
  props: {
    activity: {
      type: Object,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        customer: '',
        project: '',
        startDate: '',
        endDate: '',
        channel: '',
        budget: '',
        products: '',
        content: ''
      },
      // 客户列表
      customers: [
        '北京环球科技有限公司',
        '上海教育装备有限公司',
        '全球电子科技集团',
        '欧美商贸有限公司',
        '时尚服饰有限公司',
        '数字媒体有限公司',
        '健康生活用品有限公司'
      ],
      // 项目列表
      projects: [
        '2023年夏季营销方案',
        '2023年校园市场拓展计划',
        '2023年度全球营销活动',
        '2023年冬季节庆营销',
        '2024春季新品上市计划',
        '品牌年度推广计划',
        '新产品线上市推广'
      ]
    };
  },
  created() {
    if (this.activity) {
      // 仅保留我们需要的字段
      const { id, name, customer, project, startDate, endDate, channel, budget, products, content } = this.activity;
      this.form = { id, name, customer, project, startDate, endDate, channel, budget, products, content };
    } else {
      // 设置默认日期
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 7);
      
      this.form.startDate = this.formatDateForInput(today);
      this.form.endDate = this.formatDateForInput(tomorrow);
    }
  },
  methods: {
    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    saveActivity() {
      if (new Date(this.form.endDate) < new Date(this.form.startDate)) {
        alert('结束日期必须晚于开始日期');
        return;
      }
      
      this.$emit('save', { ...this.form });
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #f44336;
}

input[type="text"],
input[type="number"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button,
.save-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: #9e9e9e;
}

.cancel-button:hover {
  background-color: #757575;
}

.save-button {
  background-color: #4caf50;
}

.save-button:hover {
  background-color: #43a047;
}
</style> 