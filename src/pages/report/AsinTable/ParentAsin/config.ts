/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-11-16 14:56:27
 * @LastEditors: Please set LastEditors
 * @FilePath: \amzics-react\src\pages\asinTable\ParentAsin\config.ts
 */
export const parentsprs = [
  'childAsin', 
  'sku', 
];

// 总体销售表现
export const parentadSales = [
  'totalSales',
  'totalOrderQuantity',
  'totalSalesQuantity',
  'replyReviewRate',
  'profit',
  'profitRate',
  'salesQuantityExceptOrderQuantity',
  'avgSellingPrice',
  'avgCustomerPrice',
  'preferentialOrderQuantity',
  'associateSales',
];

// 总体流量转化
export const parentflux = [
  'pageView',
  'session',
  'pageViewExceptSession',
  'conversionsRate',
];

export const parentrefunds = [
  'returnRate',
  'returnQuantity',
];

export const parentb2b = [
  'b2bSales',
  'b2bOrderQuantity',
  'b2bSalesQuantity',
  'b2bSalesQuantityExceptOrderQuantity',
  'b2bAvgSellingPrice',
  'b2bAvgCustomerPrice',
];

// 表格各列的宽度 修改这里，也要修改index.less的宽度，
export const colsWidth = {
  asin: 198,
  sku: 196,
  totalSales: 115, // 总销售额
  totalOrderQuantity: 115, // 总订单量
  totalSalesQuantity: 95, // 总销量
  replyReviewRate: 110, // 回评率
  profit: 100, // 利润
  profitRate: 100, // 利润率
  salesQuantityExceptOrderQuantity: 125, // 销量/订单量
  avgSellingPrice: 105, // 平均售价
  avgCustomerPrice: 115, // 平均客单价
  preferentialOrderQuantity: 120, // 优惠订单
  associateSales: 120, // 关联销售
  pageView: 80, // pageView
  session: 105, // Session
  pageViewExceptSession: 145, // PageView/Session
  conversionsRate: 105, // 转化率
  returnQuantity: 105, // 退货量
  returnRate: 95, // 退货率
  b2bSales: 120, // B2B销售额
  b2bSalesQuantity: 110, // B2B销量
  b2bOrderQuantity: 120, // B2B订单量
  b2bSalesQuantityExceptOrderQuantity: 160, // B2B销量/订单量
  b2bAvgSellingPrice: 130, // B2B平均售价
  b2bAvgCustomerPrice: 150, // B2B平均客单价
};
