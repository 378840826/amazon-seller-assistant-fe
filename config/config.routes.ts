/*
  路由配置
*/
export default [
  // 账户
  {
    path: '/users',
    routes: [
      { path: '/users/login', component: './user/Login', title: '登录' },
      { path: '/users/password/forgot', component: './user/ResetPwd', title: '设置新密码' },
      { path: '/users/send-email', component: './user/SendEmail', title: '密码重置' },
      { path: '/users/active', component: './user/Active', title: '激活' },
    ],
  },

   //个人中心
  {
    path:'/center',
    component: '../layouts/BasicLayout',
    routes:[{ path: '/center', component: './user/Center', title: '个人中心' }]
  },

  // 消息中心
  {
    path: '/message',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/message/all', component: './message/', title: '消息中心'},
      // 重定向
      { path: '/message', redirect: '/message/all' },
    ],
  },

  //子账号
  {
    path:'/sub-account',
    component: '../layouts/BasicLayout',
    routes:[{ path: '/sub-account', component: './sub/Account', title: '子账号' }]
  },

  // 店铺管理
  {
    path: '/shop',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '店铺管理', path: '/shop/list', component: './mws/shop/List' },
      { title: '店铺绑定', path: '/shop/bind', component: './mws/shop/Bind' },
    ],
  },

  // 大盘
  {
    path: '/overview',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '数据大盘', path: '/overview', component: './mws/GoodsList' },
      { title: '店铺报告', path: '/overview/shop', component: './mws/GoodsList' },
      { title: 'BI看板', path: '/overview/bi', component: './mws/GoodsList' },
    ],
  },

  // 商品
  {
    path: '/product',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '商品列表', path: '/product/list', component: './mws/GoodsList' },
      { title: '错误报告', path: '/product/error-report', component: './mws/ErrorReport' },
    ],
  },

  // 动态
  {
    path: '/dynamic',
    component: '../layouts/BasicLayout',
    routes: [
      { title: 'ASIN动态汇总', path: '/dynamic/asin-overview', component: './mws/AsinChange' },
      { title: 'ASIN动态监控设定', path: '/dynamic/asin-monitor', component: './mws/AsinChange' },
    ],
  },

  // 订单
  {
    path: '/order',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '订单列表', path: '/order', component: './mws/order/List' },
    ],
  },

  // 调价
  {
    path: '/reprice',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '调价规则', path: '/reprice/rules', component: './mws/GoodsList' },
      { title: '调价记录', path: '/reprice/history', component: './mws/GoodsList' },
    ],
  },

  // 报表
  {
    path: '/report',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/report/asin',
        component: '../layouts/AsinPandectLayout',
        wrappers: ['../layouts/AsinPandectLayout/guard.tsx'],
        routes: [
          { path: '/report/asin/base', title: 'ASIN总览', component: './asinPandect/Base' },
          { path: '/report/asin/dsell', title: 'ASIN总览 - 地区销售', component: './asinPandect/Dsell' },
          { path: '/report/asin/order', title: 'ASIN总览 - 订单解读', component: './asinPandect/Order' },
          { path: '/report/asin/ra', title: 'ASIN总览 - 退货分析', component: './asinPandect/ReturnProduct' },
          { path: '/report/asin/b2b', title: 'ASIN总览 - B2B销售', component: './asinPandect/B2B' },
          // 重定向
          { path: '/report', redirect: '/report/asin/base' },
        ]
      },
      { title: 'Business Rport导入', path: '/report/business', component: './mws/GoodsList' },
    ],
  },

  // 补货
  {
    path: '/replenishment',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '补货计划', path: '/replenishment', component: './mws/Replenishment' },
    ],
  },

  // 广告系统
  {
    path: '/ppc',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '广告系列', path: '/ppc/campaign', component: './ppc/Campaign' },
      { title: '广告组', path: '/ppc/group', component: './ppc/Campaign' },
      { title: '广告', path: '/ppc/product', component: './ppc/Campaign' },
      { title: 'Targeting', path: '/ppc/targeting', component: './ppc/Campaign' },
      { title: 'search term 报表', path: '/ppc/search-report', component: './ppc/Campaign' },
      // 以下为重定向路由
      { path: '/ppc', redirect: '/ppc/campaign' },
    ],
  },

  // 评论
  {
    path: '/review',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '评论列表', path: '/review/list', component: './mws/comment/Monitor' },
      { title: '评论监控设定', path: '/review/monitor', component: './mws/comment/Settings' },
    ],
  },

  // 跟卖
  {
    path: '/competitor',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '跟卖监控', path: '/competitor/monitor', component: './mws/GoodsList' },
    ],
  },

  // 邮件
  {
    path: '/mail',
    component: '../layouts/BasicLayout',
    routes: [
      { path:'/mail/',component:'./mws/Mail/components/Menu',routes:[
        {title:'邮件统计',path:'/mail/summary',component:'./mws/Mail/summary'},
        {title:'收件箱',path:'/mail/inbox',component:'./mws/Mail/Inbox'},
        {title:'已回复',path:'/mail/reply',component:'./mws/Mail/Inbox'},
        {title:'未回复',path:'/mail/no-reply',component:'./mws/Mail/Inbox'},
        {title:'发件箱',path:'/mail/outbox',component:'./mws/Mail/outbox'},
        {title:'发送成功',path:'/mail/send-success',component:'./mws/Mail/outbox'},
        {title:'发送失败',path:'/mail/send-fail',component:'./mws/Mail/outbox'},
        {title:'正在发送',path:'/mail/sending',component:'./mws/Mail/outbox'},
        {title:'自动邮件规则',path:'/mail/rule',component:'./mws/Mail/rule'},
        {title:'邮件模版',path:'/mail/template',component:'./mws/Mail/template'}
      ]},
    ],
  },
  // 首页
  {
    path: '/',
    component: '../layouts/IndexLayout',
    routes: [
      { path: '/', component: './index', title: '首页' },
      { path: '/index/privacy', component: './privacy', title: '隐私政策' },
      { path: '/index/logs', component: './logs', title: '更新日志' },
    ],
  },
]
