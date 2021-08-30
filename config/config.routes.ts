/*
  路由配置
*/

import {
  ruleListRouter,
  ruleAddRouter,
  ruleAddSalesRouter,
  ruleAddCartRouter,
  ruleAddCompetitorRouter,
  ruleHistoryRouter,
  setCompetingGoodsRouter,
  report,
  ppcCampaignAddRouter,
  ppcGroupAddRouter,
  fba,
  configuration,
  product,
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
      { path: '/users/account-info', component: './user/AccountInfo', title: '填写账号信息' },
    ],
  },

  //个人中心
  {
    path: '/center',
    component: '../layouts/BasicLayout',
    routes: [{ path: '/center', component: './user/Center', title: '个人中心' }]
  },

  // 会员中心
  {
    path: '/vip',
    component: '../layouts/IndexLayout',
    routes: [
      { path: '/vip/membership', component: './vip/MyVip', title: '我的会员' },
      { path: '/vip/upgrade', component: './vip/buy/Upgrade', title: '会员升级' },
      { path: '/vip/renew', component: './vip/buy/Renew', title: '会员续费' },
      { path: '/vip/instructions', component: './vip/LevelExplain', title: '付费说明' },
      // 重定向
      { path: '/vip', redirect: '/vip/membership' },
    ]
  },

  // 消息中心
  {
    path: '/message',
    component: '../layouts/BasicLayout',
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
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
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
    routes: [
      { title: '数据大盘', path: '/overview', component: './UncompletedPage' }, // 数据大盘不需要店铺，可以抽出去
      { title: '店铺报告', path: '/overview/shop', component: './UncompletedPage' },
      { title: 'BI诊断', path: '/overview/bi', component: './BiBoard' },
    ],
  },

  // 商品
  {
    path: '/product',
    component: '../layouts/BasicLayout',
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
    routes: [
      { title: '商品列表', path: '/product/list', component: './mws/GoodsList' },
      { title: '错误报告', path: '/product/error-report', component: './mws/ErrorReport' },
      { title: '竞品设定', path: setCompetingGoodsRouter, component: './mws/CompetingGoods' }, // 入口是商品列表
      { title: 'SKU资料管理', path: product.skuData, component: './product/SkuData' },
      // 重定向
      { path: '/product', redirect: '/product/list' },
    ],
  },

  // asin总览，无导航， 入口是每个列表中的 ASIN
  {
    path: '/asin',
    component: '../layouts/AsinPandectLayout',
    wrappers: ['../layouts/BasicLayout/guard.tsx', '../layouts/AsinPandectLayout/guard.tsx'],
    routes: [
      { title: 'ASIN总览', path: '/asin/base', component: './asinPandect/Base' },
      { title: 'ASIN总览', path: '/asin/dt', component: './asinPandect/Dynamic' },
      { title: 'ASIN总览', path: '/asin/com-pro', component: './asinPandect/ComPro' },
      { title: 'ASIN总览', path: '/asin/order', component: './asinPandect/Order' },
      { title: 'ASIN总览', path: '/asin/b2b', component: './asinPandect/B2B' },
      { title: 'ASIN总览', path: '/asin/ar', component: './asinPandect/Ad' },
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
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
    routes: [
      { title: 'ASIN动态汇总', path: '/dynamic/asin-overview', component: './mws/AsinChange/summary' },
      { title: 'ASIN动态监控设定', path: '/dynamic/asin-monitor', component: './mws/AsinChange/monitor' },
      { title: '关键词搜索排名监控', path: '/dynamic/rank-monitor', component: './mws/AsinChange/rank' },
      // 重定向
      { path: '/dynamic', redirect: '/dynamic/asin-overview' },
    ],
  },

  // 订单
  {
    path: '/order',
    component: '../layouts/BasicLayout',
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
    routes: [
      { title: '订单列表', path: '/order', component: './mws/order/List' },
    ],
  },

  // 调价
  {
    path: '/reprice',
    component: '../layouts/BasicLayout',
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
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
      { title: '调价记录', path: ruleHistoryRouter, component: './reprice/History' },
      // 重定向
      { path: '/reprice', redirect: ruleListRouter },
    ],
  },

  // 报表
  {
    path: '/report',
    component: '../layouts/BasicLayout',
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
    routes: [
      { title: 'ASIN报表', path: '/report/asin-overview', component: './report/AsinTable' },
      { title: 'Business Rport导入', path: '/report/import', component: './businessRport/Import' },
      { title: 'Business Rport详情', path: '/report/details', component: './businessRport/Details' },
      { title: '利润表', path: report.profit, component: './report/Profit' },
    ],
  },

  // 补货
  {
    path: '/replenishment',
    component: '../layouts/BasicLayout',
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
    routes: [
      { title: '补货建议', path: '/replenishment', component: './mws/Replenishment' },
    ],
  },

  // 广告系统
  {
    path: '/ppc',
    component: '../layouts/BasicLayout',
    routes: [
      { title: '广告管理', path: '/ppc/manage', component: './ppc/AdManage' },
      { title: '广告管理', path: '/ppc/manage/group/target', component: './ppc/AdManage/AutoGroupTarget' },
      { title: '广告管理', path: '/ppc/manage/group/time', component: './ppc/AdManage/GroupTime' },
      { title: '广告店铺授权', path: '/ppc/shop/list', component: './UncompletedPage' },
      { title: '创建广告活动', path: ppcCampaignAddRouter, component: './ppc/Creates/Campaign' },
      { title: '创建广告组', path: ppcGroupAddRouter, component: './ppc/Creates/Group' },
      // 以下为重定向路由
      { path: '/ppc', redirect: '/ppc/manage' },
    ],
  },

  // 评论
  {
    path: '/review',
    component: '../layouts/BasicLayout',
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
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
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
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
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
    routes: [
      { title: '跟卖监控', path: '/competitor/monitor', component: './follow/Monitor' },
      { title: '跟卖列表', path: '/competitor/list', component: './follow/List' },
      { title: '跟卖历史', path: '/competitor/history', component: './follow/History' },
      // 重定向
      { path: '/competitor', redirect: '/competitor/monitor' },
    ],
  },

  // 配置
  {
    path: '/config',
    component: '../layouts/BasicLayout',
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
    routes: [
      { title: '物流方式管理', path: configuration.logistics, component: './configuration/Logistics' },
      { title: '库位管理',  path: configuration.storageLocation, component: './configuration/StorageLocation'  },
      { title: '仓库地址管理',  path: configuration.warehouse, component: './configuration/WarehouseLocation'  },
    ]
  },

  // FBA
  {
    path: '/fba',
    component: '../layouts/BasicLayout',
    wrappers: ['../layouts/BasicLayout/guard.tsx'],
    routes: [
      { title: '补货计划', path: '/fba/replenishment', component: './mws/Replenishment' },
      { title: '货件计划',  path: fba.planList, component: './fba/PlanList'  },
      { title: 'Shipment',  path: fba.shipment, component: './fba/Shipment'  },
      { title: '发货单',  path: fba.dispatchList, component: './fba/DispatchList'  },
    ]
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

 