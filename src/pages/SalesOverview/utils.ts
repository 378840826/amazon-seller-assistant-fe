import { moneyFormatNames } from './config';

// key: name。 后端接口还未定，所有字段从这个表获取，等后端定字段后修改这个表就行
const keyToNameDict = {
  totalSales: '总销售额',
  totalSalesRingRatio: '总销售额环比',
  totalOrderQuantity: '总订单量',
  totalOrderQuantityRingRatio: '总订单量环比',
  totalSalesQuantity: '总销量',
  totalSalesQuantityRingRatio: '总销量环比',
  adSales: '广告销售额',
  adSalesRingRatio: '广告销售额环比',
  adOrderQuantity: '广告订单量',
  adOrderQuantityRingRatio: '广告订单量环比',
  adSpend: '广告花费',
  adSpendRingRatio: '广告花费环比',
  // FBA FBM B2B
  fbaSales: 'FBA销售额',
  fbmSales: 'FBM销售额',
  b2bSales: 'B2B销售额',
  fbaOrderQuantity: 'FBA订单量',
  fbmOrderQuantity: 'FBM订单量',
  b2bOrderQuantity: 'B2B订单量',
  fbaSalesQuantity: 'FBA销量',
  fbmSalesQuantity: 'FBM销量',
  b2bSalesQuantity: 'B2B销量',
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

// 货币或百分比显示。 每 3 位加逗号、金额和百分比保留两位小数
export function getFormatterValue(name: string, value?: number | null, currency?: string) {
  if ([null, undefined, NaN].includes(value)) {
    return '—';
  }
  let result;
  const floatLocalValue = Number(value).toLocaleString(
    undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );
  if (name && moneyFormatNames.includes(name)) {
    result = `${currency}${floatLocalValue}`;
  } else {
    result = Number(value).toLocaleString();
  }
  return result;
}
