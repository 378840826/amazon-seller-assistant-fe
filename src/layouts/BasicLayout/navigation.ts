/**
 * 功能页的菜单结构
 */
import {
  ruleListRouter,
  ruleAddRouter,
  ruleAddSalesRouter,
  ruleAddCartRouter,
  ruleAddCompetitorRouter,
  ruleHistoryRouter,
  report,
  fba,
  configuration,
  product,
} from '@/utils/routes';
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
      { title: '销售大盘', path: '/overview' },
      { title: '店铺报表', path: '/overview/shop' },
      { title: '店铺概况', path: '/overview/shop/detail', hide: true },
      { title: 'BI诊断', path: '/overview/bi' },
    ],
  },
  {
    title: '商品',
    menu: [
      { title: '商品列表', path: '/product/list' },
      // 隐藏的 asin总览， 需要高亮 '商品' 一级导航， 所以放这里
      { title: '', path: '/asin/base', hide: true },
      { title: '', path: '/asin/dt', hide: true },
      { title: '', path: '/asin/order', hide: true },
      { title: '', path: '/asin/b2b', hide: true },
      { title: '', path: '/asin/ppc', hide: true },
      { title: '', path: '/asin/territory', hide: true },
      { title: '', path: '/asin/return', hide: true },
      { title: 'SKU资料管理', path: product.skuData },
    ],
  },
  {
    title: '调价',
    menu: [
      { title: '调价规则', path: ruleListRouter },
      { title: '选择规则类型', path: ruleAddRouter, hide: true },
      { title: '根据销售表现调价', path: ruleAddSalesRouter, hide: true },
      { title: '根据黄金购物车调价', path: ruleAddCartRouter, hide: true },
      { title: '根据竞品价格调价', path: ruleAddCompetitorRouter, hide: true },
      { title: '调价记录', path: ruleHistoryRouter },
    ],
  },
  {
    title: '动态',
    menu: [
      { title: 'ASIN动态汇总', path: '/dynamic/asin-overview' },
      { title: 'ASIN动态监控设定', path: '/dynamic/asin-monitor' },
      { title: '关键词搜索排名监控', path: '/dynamic/rank-monitor' },
    ],
  },
  {
    title: '订单',
    menu: [
      { title: '订单列表', path: '/order' },
    ],
  },
  {
    title: '报表',
    menu: [
      { title: 'ASIN报表', path: '/report/asin-overview' },
      { title: 'Business Report导入', path: '/report/import' },
      { title: '利润表', path: report.profit },
    ],
  },
  {
    title: 'FBA',
    menu: [
      { title: '补货计划', path: '/fba/replenishment' },
      { title: '货件计划', path: fba.planList },
      { title: 'Shipment', path: fba.shipment },
      { title: '发货单', path: fba.dispatchList },
    ],
  },
  {
    title: '广告',
    menu: [
      { title: '广告管理', path: '/ppc/manage' },
      { title: '广告管理', path: '/ppc/manage/group/target', hide: true },
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
      { title: '跟卖列表', path: '/competitor/list', hide: true },
      { title: '跟卖历史', path: '/competitor/history', hide: true },
    ],
  },
  {
    title: '邮件',
    menu: [
      { title: '邮件助手', path: '/mail/summary' },
      { title: '收件箱', path: '/mail/inbox', hide: true },
      { title: '已回复', path: '/mail/reply', hide: true },
      { title: '未回复', path: '/mail/no-reply', hide: true },
      { title: '发件箱', path: '/mail/outbox', hide: true },
      { title: '发送成功', path: '/mail/send-success', hide: true },
      { title: '发送失败', path: '/mail/send-fail', hide: true },
      { title: '正在发送', path: '/mail/sending', hide: true },
      { title: '自动邮件规则', path: '/mail/rule', hide: true },
      { title: '邮件模版', path: '/mail/template', hide: true },

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
  {
    title: '配置',
    menu: [
      { title: '仓库地址', path: configuration.warehouse },
      { title: '物流方式', path: configuration.logistics },
      { title: '库位管理', path: configuration.storageLocation },
      { title: '供应商管理', path: configuration.supplier },
    ],
  },
];

export default navigation;
