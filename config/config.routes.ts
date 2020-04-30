/*
  路由配置
*/
export default [
  // 账户
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user/center', component: './user/Center', title: '个人中心' },
      { path: '/user/login', component: './user/Login', title: '登录' },
      { path: '/user/register', component: './user/Register', title: '注册' },
    ],
  },
  // 功能系统
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', component: './index', title: '首页' },
      { path: '/repricing', component: './repricing', title: 'repricing' },
    ],
  },
]
