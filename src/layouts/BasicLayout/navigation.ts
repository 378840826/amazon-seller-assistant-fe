/**
 * 功能页的菜单结构
 */
export interface IMenu {
  title: string;
  path: string;
  // 有些二级菜单不需要显示在一级菜单的下拉框， 比如商品管理>错误报告
  hide?: boolean;
}

export interface INavigation {
  title: string;
  visible?: boolean;
  menu: IMenu[];
}

const navigation: INavigation[] = [
  {
    title: '大盘',
    menu: [
      { title: '数据大盘', path: '/overview' },
      { title: '店铺报告', path: '/overview/shop' },
      { title: 'BI看板', path: '/overview/bi' },
    ],
  },
  {
    title: '商品',
    menu: [
      { title: '商品列表', path: '/product' },
    ],
  },
  {
    title: '动态',
    menu: [
      { title: 'ASIN动态汇总', path: '/dynamic/asin-overview' },
      { title: 'ASIN动态监控设定', path: '/dynamic/asin-monitor' },
    ],
  },
  {
    title: '订单',
    menu: [
      { title: '订单列表', path: '/order' },
    ],
  },
  {
    title: '调价',
    menu: [
      { title: '调价规则', path: '/reprice/rules' },
      { title: '调价记录', path: '/reprice/history' },
    ],
  },
  {
    title: '报表',
    menu: [
      { title: 'ASIN总览报表', path: '/report/asin/base' },
      { title: 'Business Rport导入', path: '/report/import' },
    ],
  },
  {
    title: '补货',
    menu: [
      { title: '补货计划', path: '/replenishment' },
    ],
  },
  {
    title: '广告',
    menu: [
      { title: '广告系列', path: '/ppc/campaign' },
      { title: '广告组', path: '/ppc/group' },
      { title: '广告', path: '/ppc/product' },
      { title: 'Targeting', path: '/ppc/targeting' },
      { title: 'search term 报表', path: '/ppc/search-report' },
    ],
  },
  {
    title: '评论',
    menu: [
      { title: '评论列表', path: '/review/list' },
      { title: '评论监控设定', path: '/review/monitor' },
    ],
  },
  {
    title: '跟卖',
    menu: [
      { title: '跟卖监控', path: '/competitor/monitor' },
    ],
  },
  {
    title: '邮件',
    menu: [
      { title: '邮件助手', path: '/mail/summary' },
    ],
  },
  {
    title: '店铺管理',
    visible: false,
    menu: [
      { title: '已绑定店铺', path: '/shop/list' },
      { title: '绑定店铺', path: '/shop/bind' },
    ],
  },
];

export default navigation;
