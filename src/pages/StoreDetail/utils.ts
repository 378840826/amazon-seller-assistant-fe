// key: name
const keyToNameDict = {
  'skuTotal': 'SKU总数',
  'activeSku': 'Active-SKU',
  'inactiveSku': 'Inactive-SKU',
  'fbaActiveSku': 'FBA-active-SKU',
  'fbaInactiveSku': 'FBA-Inactive-SKU',
  'fbmActiveSku': 'FBM-active-SKU',
  'fbmInactiveSku': 'FBM-Inactive-SKU',
  'asinTotal': 'ASIN总数',
  'buyboxAsin': 'Buybox-ASIN',
  'notBuyboxAsin': '非Buybox-ASIN',
  '动销率': '动销率',
  '在售': '在售',
  '上新': '上新',
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
  'b2bSales': 'B2B销售额',
  'b2bOrderQuantity': 'B2B订单量',
  'b2bSalesQuantity': 'B2B销量',
  'b2bSalesQuantityExceptOrderQuantity': 'B2B销量/订单量',
  'b2bAvgSellingPrice': 'B2B平均售价',
  'b2bAvgCustomerPrice': 'B2B平均客单价',
  'returnQuantity': '退货量',
  'returnRate': '退货率',
  'adSales': '广告销售额',
  'naturalSales': '自然销售额',
  'adOrderQuantity': '广告订单量',
  'naturalOrderQuantity': '自然订单量',
  'cpc': 'CPC',
  'cpa': 'CPA',
  'cpm': 'CPM',
  'spend': 'Spend',
  'acos': 'ACoS',
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

// 需要转成金额格式的字段
export const moneyFormatNames = ['总销售额', '平均售价', '平均客单价'];
// 需要转成百分比的字段
export const percentageFormatNames = ['转化率'];
// 提供数据源选择的字段（选择 全部、FBA、FBM、B2B）
export const multiDataOrigin = ['总订单量', '总销量', '总销售额'];
