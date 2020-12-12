/*
  路由配置
*/

import {
  ruleListRouter,
  ruleAddRouter,
  ruleAddSalesRouter,
  ruleAddCartRouter,
  ruleAddCompetitorRouter
} from '../src/utils/routes';

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
    path: '/center',
    component: '../layouts/BasicLayout',
    routes: [{ path: '/center', component: './user/Center', title: '个人中心' }]
  },

  // 消息中心
  {
    path: '/message',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/message/all', component: './message/', title: '消息中心' },
      // 重定向
      { path: '/message', redirect: '/message/all' },
    ],
  },

  //子账号
  {
    path: '/sub-account',
    component: '../layouts/BasicLayout',
    routes: [{ path: '/sub-account', component: './sub/Account', title: '子账号' }]
  },

  // 店铺管理
  {
    path: '/shop',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '店铺管理', path: '/shop/list', component: './mws/shop/List' },
      { title: '店铺绑定', path: '/shop/bind', component: './mws/shop/Bind' },
      // 重定向
      { path: '/shop', redirect: '/shop/list' },
    ],
  },

  // 大盘
  {
    path: '/overview',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '数据大盘', path: '/overview', component: './mws/GoodsList' },
      { title: '店铺报告', path: '/overview/shop', component: './mws/GoodsList' },
      { title: 'BI诊断', path: '/overview/bi', component: './BiBoard' },
    ],
  },

  // 商品
  {
    path: '/product',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '商品列表', path: '/product/list', component: './mws/GoodsList' },
      { title: '错误报告', path: '/product/error-report', component: './mws/ErrorReport' },
      // 重定向
      { path: '/product', redirect: '/product/list' },
    ],
  },

  // asin总览，无导航， 入口是每个列表中的 ASIN
  {
    path: '/asin',
    component: '../layouts/AsinPandectLayout',
    wrappers: ['../layouts/AsinPandectLayout/guard.tsx'],
    routes: [
      { title: 'ASIN总览', path: '/asin/base', component: './asinPandect/Base' },
      { title: 'ASIN总览', path: '/asin/dt', component: './asinPandect/Dynamic' },
      { title: 'ASIN总览', path: '/asin/order', component: './asinPandect/Order' },
      { title: 'ASIN总览', path: '/asin/b2b', component: './asinPandect/B2B' },
      { title: 'ASIN总览', path: '/asin/ppc', component: './asinPandect/Base' },
      { title: 'ASIN总览', path: '/asin/territory', component: './asinPandect/Dsell' },
      { title: 'ASIN总览', path: '/asin/return', component: './asinPandect/ReturnProduct' },
      // 重定向
      { path: '/asin', redirect: '/asin/base' },
    ]
  },

  // 动态
  {
    path: '/dynamic',
    component: '../layouts/BasicLayout',
    routes: [
      { title: 'ASIN动态汇总', path: '/dynamic/asin-overview', component: './mws/AsinChange/summary' },
      { title: 'ASIN动态监控设定', path: '/dynamic/asin-monitor', component: './mws/AsinChange/monitor' },
      // 重定向
      { path: '/dynamic', redirect: '/dynamic/asin-overview' },
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
      {
        path: ruleListRouter,
        routes: [
          {
            path: ruleListRouter,
            title: '调价规则',
            component: './reprice/rules/Index'
          },
          {
            path: ruleAddRouter,
            title: '调价规则',
            component: './reprice/rules/AddIndex'
          },
          {
            path: ruleAddSalesRouter,
            title: '调价规则',
            component: './reprice/rules/Sales'
          },
          {
            path: ruleAddCartRouter,
            title: '调价规则',
            component: './reprice/rules/Cart'
          },
          {
            path: ruleAddCompetitorRouter,
            title: '调价规则',
            component: './reprice/rules/Competitor'
          },
        ]
      },
      { title: '调价记录', path: '/reprice/history', component: './mws/GoodsList' },
      // 重定向
      { path: '/reprice', redirect: ruleListRouter },
    ],
  },

  // 报表
  {
    path: '/report',
    component: '../layouts/BasicLayout',
    routes: [
      { title: 'ASIN报表', path: '/report/asin-overview', component: './mws/GoodsList' },
      { title: 'Business Rport导入', path: '/report/import', component: './businessRport/Import' },
      { title: 'Business Rport详情', path: '/report/details', component: './businessRport/Details' },
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
      // 重定向
      { path: '/review', redirect: '/review/list' },
    ],
  },

  // 邮件
  {
    path: '/mail',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/mail', component: './mws/Mail/components/Menu', routes: [
          { title: '邮件助手', path: '/mail/summary', component: './mws/Mail/summary' },
          { title: '邮件助手', path: '/mail/inbox', component: './mws/Mail/Inbox' },
          { title: '邮件助手', path: '/mail/reply', component: './mws/Mail/Inbox' },
          { title: '邮件助手', path: '/mail/no-reply', component: './mws/Mail/Inbox' },
          { title: '邮件助手', path: '/mail/outbox', component: './mws/Mail/outbox' },
          { title: '邮件助手', path: '/mail/send-success', component: './mws/Mail/outbox' },
          { title: '邮件助手', path: '/mail/send-fail', component: './mws/Mail/outbox' },
          { title: '邮件助手', path: '/mail/sending', component: './mws/Mail/outbox' },
          { title: '邮件助手', path: '/mail/rule', component: './mws/Mail/rule' },
          { title: '邮件助手', path: '/mail/template', component: './mws/Mail/template' },
        ]
      },
      // 重定向
      { path: '/mail', redirect: '/mail/summary' },
    ],
  },

  // 跟卖
  {
    path: '/competitor',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '跟卖监控', path: '/competitor/monitor', component: './follow/Monitor' },
      { title: '跟卖列表', path: '/competitor/list', component: './follow/List' },
      { title: '跟卖历史', path: '/competitor/history', component: './follow/History' },
      // 重定向
      { path: '/competitor', redirect: '/competitor/monitor' },
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
      { path: '/index/crx', component: './Crx', title: '插件' },
      // 重定向
      { path: '/index', redirect: '/' },
    ],
  },
]

 