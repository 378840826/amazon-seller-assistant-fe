// key: name
const keyToNameDict = {
  // sku
  'totalSku': 'SKU总数',
  'activeSku': 'Active-SKU',
  'inactiveSku': 'Inactive-SKU',
  'fbaActiveSku': 'FBA-active-SKU',
  'fbaInactiveSku': 'FBA-Inactive-SKU',
  'fbmActiveSku': 'FBM-active-SKU',
  'fbmInactiveSku': 'FBM-Inactive-SKU',
  // asin
  'asinTotal': 'ASIN总数',
  'buyboxAsin': 'Buybox-ASIN',
  'notBuyboxAsin': '非Buybox-ASIN',
  'dynamicSalesRate': '动销率',
  'quantityOnSale': '在售',
  'newProductQuantity': '上新',
  // 整体表现
  'totalSales': '总销售额',
  'totalOrderQuantity': '总订单量',
  'totalSalesQuantity': '总销量',
  'salesQuantityExceptOrderQuantity': '销量/订单量',
  'avgSellingPrice': '平均售价',
  'avgCustomerPrice': '平均客单价',
  'preferentialOrderQuantity': '优惠订单',
  'associateSales': '关联销售',
  'pageView': 'PageView',
  'session': 'Session',
  'pageViewExceptSession': 'PageView/Session',
  'conversionsRate': '转化率',
  /* ---总销售额选择数据源(fba fbm b2b)后的。 后端要求 */
  'fbaSales': 'FBA销售额',
  'fbmSales': 'FBM销售额',
  'fbaOrderQuantity': 'FBA订单量',
  'fbmOrderQuantity': 'FBM订单量',
  'fbaSalesQuantity': 'FBA销量',
  'fbmSalesQuantity': 'FBM销量',
  /* ---*/
  // b2b 销售
  'b2bSales': 'B2B销售额',
  'b2bOrderQuantity': 'B2B订单量',
  'b2bSalesQuantity': 'B2B销量',
  'b2bSalesProportion': 'B2B销售额占比',
  'b2bSalesQuantityExceptOrderQuantity': 'B2B销量/订单量',
  'b2bAvgSellingPrice': 'B2B平均售价',
  'b2bAvgCustomerPrice': 'B2B平均客单价',
  // 费用成本
  'grossProfit': '毛利',
  'grossProfitRate': '毛利率',
  '订单费用': '订单费用',
  '退货退款': '退货退款',
  '仓储费用': '仓储费用',
  '其他服务费': '其他服务费',
  '促销费用': '促销费用',
  '广告实际扣费': '广告实际扣费',
  '评测费用': '评测费用',
  'Eearly Reviewer': 'Eearly Reviewer',
  '成本': '成本',
  '物流': '物流',
  '运营': '运营',
  // 退货分析
  'returnQuantity': '退货量',
  'returnRate': '退货率',
  'returnReason': '退款原因', 
  'proportion': '占比', 
  'returnAmount': '退款金额',
  // 广告表现
  'adSales': '广告销售额',
  'adSalesProportion': '广告销售额占比',
  'adSalesRingRatio': '广告销售额环比',
  'naturalSales': '自然销售额',
  'naturalSalesProportion': '自然销售额占比',
  'naturalSalesRingRatio': '自然销售额环比',
  'adOrderQuantity': '广告订单量',
  'adOrderQuantityProportion': '广告订单量占比',
  'adOrderQuantityRingRatio': '广告订单量环比',
  'naturalOrderQuantity': '自然订单量',
  'naturalOrderQuantityProportion': '自然订单量占比',
  'cpc': 'CPC',
  'cpa': 'CPA',
  'cpm': 'CPM',
  'spend': 'Spend',
  'spendRingRatio': 'Spend环比',
  'acos': 'ACoS',
  'acosRingRatio': 'ACoS环比',
  'compositeAcos': '综合ACoS',
  'roas': 'RoAS',
  'compositeRoas': '综合RoAS',
  'impressions': 'Impressions',
  'clicks': 'Clicks',
  'ctr': 'CTR',
  'adConversionsRate': '广告转化率',
};

// key to name   name to key
export const AssignmentKeyName = (function () {
  const nameToKeyDict = {};
  Object.keys(keyToNameDict).forEach(key => {
    nameToKeyDict[keyToNameDict[key]] = key;
  });
  return {
    ...nameToKeyDict,
    ...keyToNameDict,
    getName(key: string) {
      return keyToNameDict[key];
    },
    getkey(name: string) {
      return nameToKeyDict[name];
    },
  };
})();
