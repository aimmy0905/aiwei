<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditing ? '编辑服务费' : '新增服务费' }}</h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>客户名称 <span class="required">*</span></label>
          <select v-model="form.customerName" class="form-input" :class="{ 'error': validationErrors.customerName }">
            <option value="">请选择客户</option>
            <option v-for="customer in customerOptions" :key="customer" :value="customer">{{ customer }}</option>
          </select>
          <div v-if="validationErrors.customerName" class="error-message">请选择客户</div>
        </div>
        <div class="form-group">
          <label>续费项目 <span class="required">*</span></label>
          <select v-model="form.projectName" class="form-input" :class="{ 'error': validationErrors.projectName }">
            <option value="">请选择项目</option>
            <option v-for="project in filteredProjects" :key="project" :value="project">{{ project }}</option>
          </select>
          <div v-if="validationErrors.projectName" class="error-message">请选择项目</div>
        </div>
        <div class="form-group">
          <label>续费金额 (元) <span class="required">*</span></label>
          <input type="number" v-model.number="form.amount" class="form-input" :class="{ 'error': validationErrors.amount }" min="0" step="0.01" placeholder="请输入续费金额">
          <div v-if="validationErrors.amount" class="error-message">请输入有效的续费金额</div>
        </div>
        <div class="form-group">
          <label>服务时长 (月) <span class="required">*</span></label>
          <div class="duration-options">
            <div 
              v-for="option in durationOptions" 
              :key="option.value"
              class="duration-option"
              :class="{ active: form.duration === option.value, 'error-border': validationErrors.duration }"
              @click="form.duration = option.value"
            >
              {{ option.label }}
            </div>
          </div>
          <div v-if="validationErrors.duration" class="error-message">请选择服务时长</div>
        </div>
        <div class="form-group">
          <label>到期时间 <span class="required">*</span></label>
          <input type="date" v-model="form.expiryDate" class="form-input" :class="{ 'error': validationErrors.expiryDate }">
          <div v-if="validationErrors.expiryDate" class="error-message">请设置到期时间</div>
        </div>
        <div class="form-group">
          <label>付费凭证</label>
          <div class="file-upload">
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*,.pdf" class="file-input">
            <button class="upload-button" @click="triggerFileInput">选择文件</button>
            <span class="file-name">{{ fileName || '未选择文件' }}</span>
          </div>
          <div v-if="previewImage" class="preview-container">
            <img :src="previewImage" alt="付费凭证预览" class="preview-image">
            <button class="remove-button" @click="removeFile">&times;</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="$emit('close')">取消</button>
        <button class="save-button" @click="validateAndSaveFee">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceFeeForm',
  props: {
    fee: {
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
        customerName: '',
        projectName: '',
        amount: '',
        duration: '',
        expiryDate: '',
        paymentProof: null
      },
      fileName: '',
      previewImage: '',
      validationErrors: {
        customerName: false,
        projectName: false,
        amount: false,
        duration: false,
        expiryDate: false
      },
      customerOptions: [
        '上海某科技有限公司',
        '北京某贸易有限公司',
        '广州某电子商务有限公司',
        '深圳某网络科技有限公司',
        '杭州某文化传媒有限公司'
      ],
      projectMap: {
        '上海某科技有限公司': ['电商广告投放项目', '新品上市推广'],
        '北京某贸易有限公司': ['品牌推广项目', '节日营销活动'],
        '广州某电子商务有限公司': ['新品上市推广', '电商广告投放项目'],
        '深圳某网络科技有限公司': ['海外市场拓展', '品牌推广项目'],
        '杭州某文化传媒有限公司': ['节日营销活动', '新品上市推广']
      },
      durationOptions: [
        { value: 1, label: '1个月' },
        { value: 3, label: '3个月' },
        { value: 6, label: '6个月' },
        { value: 12, label: '12个月' }
      ]
    };
  },
  computed: {
    filteredProjects() {
      if (!this.form.customerName) {
        return [];
      }
      return this.projectMap[this.form.customerName] || [];
    }
  },
  created() {
    if (this.fee) {
      // 编辑模式
      this.form = { ...this.fee };
      if (this.fee.paymentProof) {
        this.previewImage = this.fee.paymentProof;
        const pathParts = this.fee.paymentProof.split('/');
        this.fileName = pathParts[pathParts.length - 1];
      }
    } else {
      // 默认设置为今天日期
      const today = new Date();
      this.form.expiryDate = today.toISOString().split('T')[0];
    }
  },
  watch: {
    'form.customerName': function() {
      // 当客户变更时，清空项目选择
      this.form.projectName = '';
      // 清除验证错误
      this.validationErrors.customerName = false;
    },
    'form.projectName': function() {
      // 清除验证错误
      this.validationErrors.projectName = false;
    },
    'form.amount': function() {
      // 清除验证错误
      this.validationErrors.amount = false;
    },
    'form.duration': function() {
      // 清除验证错误
      this.validationErrors.duration = false;
      
      // 自动计算到期时间
      if (this.form.duration) {
        const today = new Date();
        today.setMonth(today.getMonth() + this.form.duration);
        this.form.expiryDate = today.toISOString().split('T')[0];
      }
    },
    'form.expiryDate': function() {
      // 清除验证错误
      this.validationErrors.expiryDate = false;
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // 检查文件大小（限制为5MB）
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('文件大小不能超过5MB');
        this.$refs.fileInput.value = '';
        return;
      }
      
      // 获取文件名
      this.fileName = file.name;
      
      // 检查文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('只能上传图片或PDF文件');
        this.$refs.fileInput.value = '';
        this.fileName = '';
        return;
      }
      
      // 预览图片（不预览PDF）
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
          this.form.paymentProof = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        // 如果是PDF，显示一个占位图
        this.previewImage = '/images/pdf_icon.png';
        this.form.paymentProof = '/uploads/' + file.name; // 模拟上传后的文件路径
      }
    },
    
    removeFile() {
      this.fileName = '';
      this.previewImage = '';
      this.form.paymentProof = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    
    validateForm() {
      let isValid = true;
      
      // 重置所有验证错误
      Object.keys(this.validationErrors).forEach(key => {
        this.validationErrors[key] = false;
      });
      
      // 验证客户名称
      if (!this.form.customerName) {
        this.validationErrors.customerName = true;
        isValid = false;
      }
      
      // 验证项目名称
      if (!this.form.projectName) {
        this.validationErrors.projectName = true;
        isValid = false;
      }
      
      // 验证金额
      if (!this.form.amount || this.form.amount <= 0) {
        this.validationErrors.amount = true;
        isValid = false;
      }
      
      // 验证服务时长
      if (!this.form.duration) {
        this.validationErrors.duration = true;
        isValid = false;
      }
      
      // 验证到期时间
      if (!this.form.expiryDate) {
        this.validationErrors.expiryDate = true;
        isValid = false;
      }
      
      return isValid;
    },
    
    validateAndSaveFee() {
      if (this.validateForm()) {
        this.$emit('save', { ...this.form });
      }
    }
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #666;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-input.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 4px;
}

.required {
  color: #f44336;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.file-input {
  display: none;
}

.upload-button {
  background-color: #f5f7fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.upload-button:hover {
  background-color: #e3f2fd;
}

.file-name {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.preview-container {
  position: relative;
  display: inline-block;
  margin-top: 10px;
}

.preview-image {
  max-width: 200px;
  max-height: 150px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-button {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f44336;
  color: white;
  border: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
}

.cancel-button, .save-button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}

.cancel-button {
  background-color: #f5f7fa;
  border: 1px solid #ddd;
  color: #333;
}

.cancel-button:hover {
  background-color: #e3f2fd;
}

.save-button {
  background-color: #1976d2;
  border: none;
  color: white;
}

.save-button:hover {
  background-color: #1565c0;
}

.duration-options {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.duration-option {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.duration-option:hover {
  background-color: #f5f7fa;
}

.duration-option.active {
  background-color: #e3f2fd;
  border-color: #1976d2;
  color: #1976d2;
}

.error-border {
  border-color: #f44336;
}
</style> 