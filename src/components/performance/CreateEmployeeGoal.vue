<template>
  <div class="create-employee-goal">
    <div class="page-header">
      <h1 class="page-title">创建员工目标</h1>
      <button class="btn secondary-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i> 返回
      </button>
    </div>
    
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <div class="form-section">
          <h2>基本信息</h2>
          
          <div class="form-group">
            <label for="month-select">月份：</label>
            <select id="month-select" v-model="formData.month" required class="form-control">
              <option value="">请选择月份</option>
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="department-select">部门：</label>
            <select id="department-select" v-model="formData.departmentId" @change="loadEmployees" required class="form-control">
              <option value="">请选择部门</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="employee-select">员工：</label>
            <select id="employee-select" v-model="formData.employeeId" required class="form-control">
              <option value="">请选择员工</option>
              <option v-for="emp in filteredEmployees" :key="emp.id" :value="emp.id">
                {{ emp.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-section">
          <h2>目标设定</h2>
          
          <div class="goal-grid">
            <div class="form-group">
              <label for="sales-target">销售额目标(元)：</label>
              <input 
                id="sales-target" 
                type="number" 
                v-model="formData.salesTarget" 
                class="form-control"
                min="0"
              />
            </div>
            
            <div class="form-group">
              <label for="roi-target">ROI目标(%)：</label>
              <input 
                id="roi-target" 
                type="number" 
                v-model="formData.roiTarget" 
                class="form-control"
                min="0"
              />
            </div>
            
            <div class="form-group">
              <label for="rebate-target">返点目标(%)：</label>
              <input 
                id="rebate-target" 
                type="number" 
                v-model="formData.rebateTarget" 
                class="form-control"
                min="0"
              />
            </div>
            
            <div class="form-group">
              <label for="progress-target">进度目标(%)：</label>
              <input 
                id="progress-target" 
                type="number" 
                v-model="formData.progressTarget" 
                class="form-control"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn secondary-btn" @click="resetForm">重置</button>
          <button type="submit" class="btn primary-btn">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateEmployeeGoal',
  data() {
    return {
      formData: {
        month: '',
        departmentId: '',
        employeeId: '',
        salesTarget: '',
        roiTarget: '',
        rebateTarget: '',
        progressTarget: ''
      },
      
      // 月份选项
      months: [
        { value: '2023-05', label: '2023年5月' },
        { value: '2023-06', label: '2023年6月' },
        { value: '2023-07', label: '2023年7月' },
        { value: '2023-08', label: '2023年8月' },
        { value: '2023-09', label: '2023年9月' }
      ],
      
      // 部门列表
      departments: [
        { id: 1, name: '销售部' },
        { id: 2, name: '市场部' },
        { id: 3, name: '客服部' },
        { id: 4, name: '技术部' }
      ],
      
      // 所有员工列表
      employees: [
        { id: 101, name: '张三', departmentId: 1 },
        { id: 102, name: '李四', departmentId: 1 },
        { id: 103, name: '王五', departmentId: 2 },
        { id: 104, name: '赵六', departmentId: 2 },
        { id: 105, name: '钱七', departmentId: 3 },
        { id: 106, name: '孙八', departmentId: 4 }
      ]
    };
  },
  computed: {
    // 根据选择的部门筛选员工
    filteredEmployees() {
      if (!this.formData.departmentId) {
        return [];
      }
      
      const deptId = parseInt(this.formData.departmentId);
      return this.employees.filter(emp => emp.departmentId === deptId);
    }
  },
  methods: {
    // 加载员工列表
    loadEmployees() {
      // 清空已选择的员工
      this.formData.employeeId = '';
      
      // 实际项目中可以在这里从API加载对应部门的员工
      console.log('加载部门ID为', this.formData.departmentId, '的员工');
    },
    
    // 提交表单
    submitForm() {
      // 表单验证
      if (!this.formData.month || !this.formData.departmentId || !this.formData.employeeId) {
        alert('请填写完整的基本信息！');
        return;
      }
      
      // 至少填写一个目标
      if (!this.formData.salesTarget && 
          !this.formData.roiTarget && 
          !this.formData.rebateTarget && 
          !this.formData.progressTarget) {
        alert('请至少设置一项目标！');
        return;
      }
      
      // 准备提交的数据
      const goalData = {
        ...this.formData,
        // 将空字符串转为null
        salesTarget: this.formData.salesTarget ? parseFloat(this.formData.salesTarget) : null,
        roiTarget: this.formData.roiTarget ? parseFloat(this.formData.roiTarget) : null,
        rebateTarget: this.formData.rebateTarget ? parseFloat(this.formData.rebateTarget) : null,
        progressTarget: this.formData.progressTarget ? parseFloat(this.formData.progressTarget) : null,
        
        // 在实际项目中，这里会使用API保存数据
        createdAt: new Date().toISOString()
      };
      
      console.log('提交的目标数据:', goalData);
      
      // 模拟API调用
      setTimeout(() => {
        alert('员工目标设置成功！');
        // 返回业绩管理页面
        this.$router.push('/performance');
      }, 500);
    },
    
    // 重置表单
    resetForm() {
      this.formData = {
        month: '',
        departmentId: '',
        employeeId: '',
        salesTarget: '',
        roiTarget: '',
        rebateTarget: '',
        progressTarget: ''
      };
    },
    
    // 返回上一页
    goBack() {
      console.log('返回业绩管理页面...');
      this.$router.push({ path: '/performance' }).catch(err => {
        console.error('导航失败:', err);
        // 如果导航失败，可能是因为我们已经在目标页面上
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    }
  }
};
</script>

<style scoped>
.create-employee-goal {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h2 {
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  color: #333;
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
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.goal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
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

@media (max-width: 768px) {
  .goal-grid {
    grid-template-columns: 1fr;
  }
}
</style> 