/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-11-16 14:56:27
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinTable\ParentAsin\config.ts
 */
export const sprs = [
  'childAsin', 
  'sku', 
];

// 总体销售表现
export const adSales = [
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
export const flux = [
  'pageView',
  'session',
  'pageViewExceptSession',
  'conversionsRate',
];

export const refunds = [
  'returnRate',
  'returnQuantity',
];

export const b2b = [
  'b2bSales',
  'b2bOrderQuantity',
  'b2bSalesQuantity',
  'b2bSalesQuantityExceptOrderQuantity',
  'b2bAvgSellingPrice',
  'b2bAvgCustomerPrice',
];
