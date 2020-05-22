/**
 * 功能页的菜单结构
 */
export interface INavigation {
  title: string;
  visible?: boolean;
  menu: {
    title: string;
    path: string;
  }[];
}

const navigation: INavigation[] = [
  {
    title: '数据大盘',
    menu: [
      { title: '店铺总揽', path: '/mws/overview' },
      { title: 'Business Report 导入', path: '/mws/report/import' },
      { title: 'Business Report 解读', path: '/mws/report/unscramble' },
    ],
  },
  {
    title: '商品管理',
    menu: [
      { title: '商品列表', path: '/mws/goods/list' },
      { title: 'ASIN动态', path: '/mws/goods/change' },
    ],
  },
  {
    title: '订单中心',
    menu: [
      { title: '订单列表', path: '/mws/order/list' },
      { title: '订单解读', path: '/mws/order/unscramble' },
    ],
  },
  {
    title: '智能调价',
    menu: [
      { title: '调价规则', path: '/mws/reprice/rules' },
      { title: '调价记录', path: '/mws/reprice/history' },
    ],
  },
  {
    title: '智能广告',
    menu: [
      { title: '广告总揽', path: '/ppc/overview' },
      { title: '店铺报告', path: '/ppc/shop' },
      { title: 'ASIN广告解读', path: '/ppc/asin' },
      { title: '广告系列', path: '/ppc/campaign' },
      { title: '广告组', path: '/ppc/group' },
      { title: '广告', path: '/ppc/item' },
      { title: '关键词', path: '/ppc/keyword' },
      { title: 'search term 报表', path: '/ppc/search-report' },
    ],
  },
  {
    title: '关键词',
    menu: [
      { title: '跟踪设定', path: '/mws/keywords/monitor' },
      { title: '搜索排名跟踪', path: '/mws/keywords/ranking' },
    ],
  },
  {
    title: '评论监控',
    menu: [
      { title: '评论监控', path: '/mws/comment/monitor' },
    ],
  },
  {
    title: '店铺管理',
    visible: false,
    menu: [
      { title: '已绑定店铺', path: '/mws/shop/list' },
      { title: '绑定店铺', path: '/mws/shop/bind' },
    ],
  },
];

export default navigation;
