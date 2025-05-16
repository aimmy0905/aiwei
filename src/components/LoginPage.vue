<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo">
        <h1>数据跨平台整合平台</h1>
        <p>Cross-Platform Data Integration Platform</p>
      </div>
      
      <div v-if="!isForgetPassword" class="login-form">
        <!-- 登录表单 -->
        <h2>账号登录</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="phone">手机号码</label>
            <input 
              type="text" 
              id="phone" 
              v-model="loginForm.phone" 
              placeholder="请输入手机号码" 
              required
            />
            <div class="error-message" v-if="errors.phone">{{ errors.phone }}</div>
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              type="password" 
              id="password" 
              v-model="loginForm.password" 
              placeholder="请输入密码" 
              required
            />
            <div class="error-message" v-if="errors.password">{{ errors.password }}</div>
          </div>
          
          <div class="remember-password">
            <input type="checkbox" id="remember" v-model="loginForm.remember" />
            <label for="remember">记住密码</label>
            <a href="#" class="forget-link" @click.prevent="toggleForgetPassword">忘记密码?</a>
          </div>
          
          <div class="form-group">
            <button type="submit" class="login-button">登录</button>
          </div>
          
          <div class="error-message login-error" v-if="loginError">{{ loginError }}</div>
        </form>
      </div>
      
      <div v-else class="forget-password-form">
        <!-- 忘记密码表单 -->
        <h2>密码重置</h2>
        <form @submit.prevent="handleResetPassword">
          <div class="form-group">
            <label for="resetPhone">手机号码</label>
            <input 
              type="text" 
              id="resetPhone" 
              v-model="resetForm.phone" 
              placeholder="请输入手机号码" 
              required
            />
            <div class="error-message" v-if="errors.resetPhone">{{ errors.resetPhone }}</div>
          </div>
          
          <div class="form-group verification-code">
            <label for="verificationCode">验证码</label>
            <div class="code-input-group">
              <input 
                type="text" 
                id="verificationCode" 
                v-model="resetForm.code" 
                placeholder="请输入验证码" 
                required
              />
              <button 
                type="button" 
                class="get-code-button" 
                @click="getVerificationCode" 
                :disabled="isGettingCode"
              >
                {{ codeButtonText }}
              </button>
            </div>
            <div class="error-message" v-if="errors.code">{{ errors.code }}</div>
          </div>
          
          <div class="form-group">
            <label for="newPassword">新密码</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="resetForm.newPassword" 
              placeholder="请输入新密码" 
              required
            />
            <div class="error-message" v-if="errors.newPassword">{{ errors.newPassword }}</div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="resetForm.confirmPassword" 
              placeholder="请再次输入新密码" 
              required
            />
            <div class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</div>
          </div>
          
          <div class="form-group">
            <button type="submit" class="reset-button">重置密码</button>
            <button type="button" class="back-button" @click="toggleForgetPassword">返回登录</button>
          </div>
          
          <div class="success-message" v-if="resetSuccess">{{ resetSuccess }}</div>
          <div class="error-message" v-if="resetError">{{ resetError }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      isForgetPassword: false,
      loginForm: {
        phone: '',
        password: '',
        remember: false
      },
      resetForm: {
        phone: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      },
      errors: {},
      loginError: '',
      resetError: '',
      resetSuccess: '',
      isGettingCode: false,
      countdown: 60,
      codeButtonText: '获取验证码'
    }
  },
  methods: {
    // 切换忘记密码/登录表单
    toggleForgetPassword() {
      this.isForgetPassword = !this.isForgetPassword;
      this.errors = {};
      this.loginError = '';
      this.resetError = '';
      this.resetSuccess = '';
    },
    
    // 验证手机号码
    validatePhone(phone) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      return phoneRegex.test(phone);
    },
    
    // 验证密码长度
    validatePassword(password) {
      return password.length >= 6;
    },
    
    // 处理登录提交
    handleLogin() {
      this.errors = {};
      this.loginError = '';
      
      // 验证手机号码
      if (!this.validatePhone(this.loginForm.phone)) {
        this.errors.phone = '请输入正确的手机号码格式';
        return;
      }
      
      // 验证密码
      if (!this.validatePassword(this.loginForm.password)) {
        this.errors.password = '密码长度不能少于6位';
        return;
      }
      
      // 模拟API调用
      console.log('登录信息提交:', this.loginForm);
      
      // 这里应该有实际的登录API调用
      // 模拟登录成功
      setTimeout(() => {
        // 模拟登录成功
        alert('登录成功！即将跳转到系统主页');
        // 这里应该有实际的路由跳转
        // this.$router.push('/dashboard');
      }, 1000);
    },
    
    // 获取验证码
    getVerificationCode() {
      if (!this.validatePhone(this.resetForm.phone)) {
        this.errors.resetPhone = '请输入正确的手机号码格式';
        return;
      }
      
      this.isGettingCode = true;
      this.countdown = 60;
      this.codeButtonText = `${this.countdown}秒后重新获取`;
      
      // 模拟发送验证码
      console.log('发送验证码到手机:', this.resetForm.phone);
      
      // 倒计时
      const timer = setInterval(() => {
        this.countdown--;
        this.codeButtonText = `${this.countdown}秒后重新获取`;
        
        if (this.countdown <= 0) {
          clearInterval(timer);
          this.isGettingCode = false;
          this.codeButtonText = '获取验证码';
        }
      }, 1000);
    },
    
    // 处理重置密码
    handleResetPassword() {
      this.errors = {};
      this.resetError = '';
      this.resetSuccess = '';
      
      // 验证手机号码
      if (!this.validatePhone(this.resetForm.phone)) {
        this.errors.resetPhone = '请输入正确的手机号码格式';
        return;
      }
      
      // 验证验证码
      if (!this.resetForm.code || this.resetForm.code.length !== 6) {
        this.errors.code = '请输入6位验证码';
        return;
      }
      
      // 验证新密码
      if (!this.validatePassword(this.resetForm.newPassword)) {
        this.errors.newPassword = '密码长度不能少于6位';
        return;
      }
      
      // 验证确认密码
      if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
        this.errors.confirmPassword = '两次输入的密码不一致';
        return;
      }
      
      // 模拟API调用
      console.log('重置密码信息提交:', this.resetForm);
      
      // 这里应该有实际的重置密码API调用
      // 模拟重置密码成功
      setTimeout(() => {
        this.resetSuccess = '密码重置成功，请使用新密码登录！';
        
        // 3秒后返回登录页面
        setTimeout(() => {
          this.isForgetPassword = false;
          this.resetForm = {
            phone: '',
            code: '',
            newPassword: '',
            confirmPassword: ''
          };
          this.resetSuccess = '';
        }, 3000);
      }, 1000);
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-box {
  width: 420px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo h1 {
  color: #1976d2;
  margin-bottom: 5px;
  font-size: 24px;
}

.logo p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 25px;
  font-size: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  color: #666;
  font-size: 14px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #1976d2;
}

.login-button,
.reset-button,
.back-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button,
.reset-button {
  background-color: #1976d2;
  color: white;
  margin-bottom: 10px;
}

.login-button:hover,
.reset-button:hover {
  background-color: #1565c0;
}

.back-button {
  background-color: #f5f5f5;
  color: #666;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.remember-password {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.remember-password input {
  margin-right: 8px;
}

.forget-link {
  margin-left: auto;
  color: #1976d2;
  text-decoration: none;
}

.forget-link:hover {
  text-decoration: underline;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

.success-message {
  color: #4caf50;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}

.login-error {
  text-align: center;
  margin-top: 10px;
}

.verification-code .code-input-group {
  display: flex;
  gap: 10px;
}

.verification-code input {
  flex: 1;
}

.get-code-button {
  padding: 0 15px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: background-color 0.3s;
}

.get-code-button:hover {
  background-color: #1565c0;
}

.get-code-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 