/*
  路由配置
*/
export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', component: './index', title: '首页' },
      { path: '/repricing', component: './repricing', title: 'repricing' },
    ]
  },
  // 登录注册
  { path: '/login', component: './user/Login', title: '登录' },
  { path: '/register', component: './user/Register', title: '注册' },
  // 个人中心
  {
    path: '/user-center',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user-center', component: './user/Center', title: '个人中心' },
    ]
  },
]
