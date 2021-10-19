/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-19 16:53:46
 * @FilePath: \amzics-react\src\utils\routes.ts
 * 
 * 路由相关 , 懒得修改
 */


// 调价规则
export const ruleListRouter = '/reprice/rules'; // 调价规则列表
export const ruleAddRouter = '/reprice/rules/add'; // 添加一条规则
export const ruleAddSalesRouter = '/reprice/rules/sales'; // 添加根据销售表现调价
export const ruleAddCartRouter = '/reprice/rules/cart'; // 根据黄金购物车调价
export const ruleAddCompetitorRouter = '/reprice/rules/competitor'; // 根据竞品价格调价

// 调价记录
export const ruleHistoryRouter = '/reprice/history'; // 调价记录列表

// 报表
export const report = {
  profit: '/report/profit', // 利润表
};


// 跟卖监控
export const competitorMonitorRouter = '/competitor/monitor'; // 跟卖监控列表
export const competitorListRouter = '/competitor/list'; // 跟卖者列表
export const competitorHistoryRouter = '/competitor/history'; // 跟卖历史

// ASIN总览
export const asinPandectBaseRouter = '/asin/base'; // ASIN总览 - 基本信息
export const asinPandectDynamicRouter = '/asin/dt'; // ASIN总览 - ASIN动态
export const asinPandectOrderRouter = '/asin/order'; // ASIN总览 - 订单解读
export const asinPandectB2bRouter = '/asin/b2b'; // ASIN总览 - B2B
export const asinPandectPpcRouter = '/asin/ar'; // ASIN总览 - 广告表现
export const asinPandectTerritoryRouter = '/asin/territory'; // ASIN总览 - 广告表现
export const asinPandectReturnRouter = '/asin/return'; // ASIN总览 - 退货分析
export const asinPandectComPro = '/asin/com-pro';//ASIN总览 - 竞品监控

// 评论
export const reviewListRouter = '/review/list'; // 评论列表

// 竞品设定
export const setCompetingGoodsRouter = '/product/cp'; // 商品ID


// 商品列表
export const productListRouter = '/product/list';


// 广告系统
export const ppcCampaignAddRouter = '/ppc/campaign/add'; // 创建广告活动
export const ppcGroupAddRouter = '/ppc/group/add'; // 创建广告组
export const ppcCampaginListRouter = '/ppc/manage'; // 广告活动列表
export const ppcGroupListRouter = '/ppc/manage?tab=group'; // 广告组列表
// 商品
export const product = {
  list: '/product/list', // 商品列表,
  skuData: '/product/sku', // SKU资料管理
};


// FBA 
export const fba = {
  planList: '/fba/plan-list', // 货件计划列表
  shipment: '/fba/shipment', // shipment
  dispatchList: '/fba/dispatch-list', // 发货单
};


// 配置
export const configuration = {
  logistics: '/config/wuliu', // 物流方式管理
  storageLocation: '/config/kuwei', // 库位管理
  warehouse: '/config/warehouse', // 仓库地址管理
  supplier: '/config/supplier',
};
