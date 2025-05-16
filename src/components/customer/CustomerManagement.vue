<template>
  <div class="customer-management">
    <h1 class="page-title">客户管理</h1>
    
    <div v-if="!selectedCustomer">
      <!-- 客户列表 -->
      <CustomerList 
        :customers="customers" 
        @select-customer="onSelectCustomer" 
      />
    </div>
    
    <div v-else>
      <!-- 客户详情 -->
      <CustomerDetail 
        :customer="selectedCustomer"
        :projects="projects"
        @add-situation="handleAddSituation"
        @add-evaluation="handleAddEvaluation"
      />
    </div>
  </div>
</template>

<script>
import CustomerList from './CustomerList.vue';
import CustomerDetail from './CustomerDetail.vue';

export default {
  name: 'CustomerManagement',
  components: {
    CustomerList,
    CustomerDetail
  },
  data() {
    return {
      selectedCustomer: null,
      // 客户数据
      customers: [
        {
          id: 1,
          name: '上海某科技有限公司',
          cooperationType: '整合营销',
          contactPerson: '张经理',
          contactInfo: '13800138000',
          salesManager: '王总监',
          salesPerson: '李销售',
          createdAt: '2023-01-15',
          situations: [
            {
              info: '客户需要提升线上销售额，主要通过Google Ads和Facebook投放广告。目前面临转化率低的问题。',
              creator: '李销售',
              createdAt: '2023-01-18'
            },
            {
              info: '经过三个月的合作，客户销售额提升30%，转化率从1.2%提升到2.8%。',
              creator: '王总监',
              createdAt: '2023-04-20'
            }
          ],
          evaluations: [
            {
              score: 8,
              date: '2023-03-15',
              comment: '广告投放效果好，团队反应迅速，但报告不够详细。'
            },
            {
              score: 9,
              date: '2023-06-15',
              comment: '服务质量持续提升，报告更加全面，非常满意。'
            }
          ]
        },
        {
          id: 2,
          name: '北京某贸易有限公司',
          cooperationType: '品牌推广',
          contactPerson: '刘总',
          contactInfo: '13900139000',
          salesManager: '陈总监',
          salesPerson: '赵销售',
          createdAt: '2023-02-10',
          situations: [
            {
              info: '客户希望提升品牌知名度，增强品牌形象。主要通过YouTube和Facebook进行品牌推广。',
              creator: '赵销售',
              createdAt: '2023-02-15'
            }
          ],
          evaluations: [
            {
              score: 7,
              date: '2023-05-10',
              comment: '品牌曝光量有所提升，但效果不如预期。期待更有创意的推广方案。'
            }
          ]
        },
        {
          id: 3,
          name: '广州某电子商务有限公司',
          cooperationType: '产品推广',
          contactPerson: '周经理',
          contactInfo: '13700137000',
          salesManager: '吴总监',
          salesPerson: '郑销售',
          createdAt: '2023-03-05',
          situations: [
            {
              info: '客户计划推出新品系列，需要全方位的营销推广方案。',
              creator: '郑销售',
              createdAt: '2023-03-08'
            }
          ],
          evaluations: []
        },
        {
          id: 4,
          name: '深圳某网络科技有限公司',
          cooperationType: '整合营销',
          contactPerson: '黄总',
          contactInfo: '13600136000',
          salesManager: '朱总监',
          salesPerson: '孙销售',
          createdAt: '2023-04-12',
          situations: [
            {
              info: '客户业务主要面向海外市场，需要针对不同国家制定差异化投放策略。',
              creator: '孙销售',
              createdAt: '2023-04-15'
            }
          ],
          evaluations: [
            {
              score: 8,
              date: '2023-07-10',
              comment: '国际化投放策略得当，数据分析深入。'
            }
          ]
        },
        {
          id: 5,
          name: '杭州某文化传媒有限公司',
          cooperationType: '内容营销',
          contactPerson: '徐经理',
          contactInfo: '13500135000',
          salesManager: '胡总监',
          salesPerson: '高销售',
          createdAt: '2023-05-20',
          situations: [
            {
              info: '客户主要做内容创作和传播，需要在社交媒体上扩大影响力。',
              creator: '高销售',
              createdAt: '2023-05-25'
            }
          ],
          evaluations: [
            {
              score: 9,
              date: '2023-08-18',
              comment: '社交媒体粉丝量显著增长，内容互动率高。'
            }
          ]
        }
      ],
      // 项目数据
      projects: [
        {
          id: 1,
          name: '电商广告投放项目',
          customerId: 1,
          status: '进行中',
          startDate: '2023-01-15',
          endDate: '2023-12-31',
          expiryDate: '2023-06-30',
          team: '数字营销团队',
          channels: 'Google Ads, Facebook, Instagram',
          totalFee: 150000
        },
        {
          id: 2,
          name: '品牌推广项目',
          customerId: 2,
          status: '进行中',
          startDate: '2023-03-01',
          endDate: '2023-08-31',
          expiryDate: '2023-07-15',
          team: '品牌推广团队',
          channels: 'YouTube, Facebook, Twitter',
          totalFee: 120000
        },
        {
          id: 3,
          name: '新品上市推广',
          customerId: 3,
          status: '计划中',
          startDate: '2023-07-01',
          endDate: '2023-12-31',
          expiryDate: '2023-12-31',
          team: '产品推广团队',
          channels: 'Google Ads, Instagram, Pinterest',
          totalFee: 80000
        },
        {
          id: 4,
          name: '海外市场拓展',
          customerId: 4,
          status: '已完成',
          startDate: '2022-09-15',
          endDate: '2023-03-15',
          expiryDate: '2023-03-15',
          team: '国际业务团队',
          channels: 'Google Ads, Bing, Criteo',
          totalFee: 200000
        },
        {
          id: 5,
          name: '节日营销活动',
          customerId: 5,
          status: '即将开始',
          startDate: '2023-11-01',
          endDate: '2024-01-15',
          expiryDate: '2024-01-15',
          team: '活动策划团队',
          channels: 'Facebook, Instagram, TikTok',
          totalFee: 100000
        }
      ],
      // 投放账户数据
      accounts: [
        {
          id: 1,
          customerId: 1,
          platform: 'Google Ads',
          account: 'customer1@gmail.com',
          accountId: 'GA-12345678',
          balance: 1567.89,
          availableDate: '2023-12-31'
        },
        {
          id: 2,
          customerId: 1,
          platform: 'Facebook',
          account: 'customer1@facebook.com',
          accountId: 'FB-87654321',
          balance: 982.45,
          availableDate: '2023-12-31'
        },
        {
          id: 3,
          customerId: 2,
          platform: 'YouTube',
          account: 'customer2@gmail.com',
          accountId: 'YT-23456789',
          balance: 2345.67,
          availableDate: '2023-10-15'
        },
        {
          id: 4,
          customerId: 3,
          platform: 'Google Ads',
          account: 'customer3@gmail.com',
          accountId: 'GA-34567890',
          balance: 765.43,
          availableDate: '2023-12-31'
        },
        {
          id: 5,
          customerId: 4,
          platform: 'Bing',
          account: 'customer4@outlook.com',
          accountId: 'BI-45678901',
          balance: 456.78,
          availableDate: '2023-09-30'
        },
        {
          id: 6,
          customerId: 4,
          platform: 'Google Ads',
          account: 'customer4@gmail.com',
          accountId: 'GA-56789012',
          balance: 1234.56,
          availableDate: '2023-12-31'
        },
        {
          id: 7,
          customerId: 5,
          platform: 'Facebook',
          account: 'customer5@facebook.com',
          accountId: 'FB-67890123',
          balance: 876.54,
          availableDate: '2023-11-30'
        }
      ]
    };
  },
  methods: {
    onSelectCustomer(customer) {
      this.selectedCustomer = customer;
    },
    
    handleAddSituation(data) {
      // 找到对应的客户并添加新情况
      const customer = this.customers.find(c => c.id === data.customerId);
      if (customer) {
        customer.situations.unshift(data.situation);
      }
    },
    
    handleAddEvaluation(data) {
      // 找到对应的客户并添加新评价
      const customer = this.customers.find(c => c.id === data.customerId);
      if (customer) {
        customer.evaluations.unshift(data.evaluation);
      }
    }
  }
};
</script>

<style scoped>
.customer-management {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}

.tab-navigation {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button:hover:not(:disabled) {
  color: #1976d2;
}

.tab-button.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
  font-weight: 500;
}

.tab-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style> 