/*
  路由配置
*/
export default [
  // 账户
  {
    path: '/users',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/users/center', component: './user/Center', title: '个人中心' },
      { path: '/users/login', component: './user/Login', title: '登录' },
      { path: '/users/register', component: './user/Register', title: '注册' },
    ],
  },
  // 首页
  {
    path: '/index',
    component: '../layouts/IndexLayout',
    routes: [
      { path: '/index', component: './index', title: '首页' },
    ],
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
  // 功能系统
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: './index' },
      {
        path: '/ppc',
        routes: [
          { title: '广告总揽', path: '/ppc/overview', component: './ppc/Overview' },
          { title: '店铺报告', path: '/ppc/shop', component: './ppc/Campaign' },
          { title: 'ASIN广告解读', path: '/ppc/asin', component: './ppc/Campaign' },
          { title: '广告系列', path: '/ppc/campaign', component: './ppc/Campaign' },
          { title: '广告组', path: '/ppc/group', component: './ppc/Campaign' },
          { title: '广告', path: '/ppc/item', component: './ppc/Campaign' },
          { title: '关键词', path: '/ppc/keyword', component: './ppc/Campaign' },
          { title: 'search term 报表', path: '/ppc/search-report', component: './ppc/Campaign' },
          // 以下为重定向路由
          { path: '/ppc', redirect: '/ppc/overview' },
        ],
      },
      {
        path: '/mws',
        routes: [
          { title: '店铺总揽', path: '/mws/overview', component: './mws/GoodsList' },
          { title: 'Business Report 导入', path: '/mws/report/import', component: './mws/GoodsList' },
          { title: 'Business Report 解读', path: '/mws/report/unscramble', component: './mws/GoodsList' },
          { title: '商品列表', path: '/mws/goods/list', component: './mws/GoodsList' },
          { title: 'ASIN动态', path: '/mws/goods/change', component: './mws/AsinChange' },
          { title: '订单列表', path: '/mws/order/list', component: './mws/GoodsList' },
          { title: '订单解读', path: '/mws/order/unscramble', component: './mws/GoodsList' },
          { title: '调价规则', path: '/mws/reprice/rules', component: './mws/GoodsList' },
          { title: '调价记录', path: '/mws/reprice/history', component: './mws/GoodsList' },
          { title: '跟踪设定', path: '/mws/keywords/monitor', component: './mws/GoodsList' },
          { title: '搜索排名跟踪', path: '/mws/keywords/ranking', component: './mws/GoodsList' },
          { title: '评论监控', path: '/mws/comment/monitor', component: './mws/GoodsList' },
          { title: '店铺绑定', path: '/mws/shop/bind', component: './mws/shop/Bind' },
          { title: '店铺管理', path: '/mws/shop/list', component: './mws/shop/List' },
          // 以下为重定向路由
          { path: '/mws', redirect: '/mws/overview' },
          { path: '/mws/goods', redirect: '/mws/goods/list' },
          { path: '/mws/report', redirect: '/mws/report/import' },
          { path: '/mws/order', redirect: '/mws/order/list' },
          { path: '/mws/reprice', redirect: '/mws/reprice/rules' },
          { path: '/mws/comment', redirect: '/mws/comment/monitor' },
          { path: '/mws/shop', redirect: '/mws/shop/list' },
        ],
      },
    ],
  },
]
