export const nameDict = {
  impressions: 'Impressions',
  clicks: 'Clicks',
  spend: 'Spend',
  acos: 'ACoS',
  roas: 'RoAS',
  ctr: 'CTR',
  cpc: 'CPC',
  cpa: 'CPA',
  sales: '销售额',
  orderNum: '订单量',
  conversionsRate: '转化率',
};

// 货币或百分比键值对显示
export function getFormatterValue(name?: string, value?: unknown, currency?: string) {
  const currencyNames = ['销售额', 'CPC', 'CPA', 'Spend'];
  const percentNames = ['ACoS', 'CTR', '转化率'];
  let result = value;
  if (name && currencyNames.includes(name)) {
    result = `${currency}${value}`;
  } else if (name && percentNames.includes(name)) {
    result = `${value}%`;
  }
  return result;
}

// 左侧菜单数据显示处理
export function getMenuShowValue(value?: number | null, currency?: string, percent?: boolean) {
  if (value === null || value === undefined) {
    return '—';
  }
  return `${currency}${value}${percent && '%'}`;
}

// 折线图线条的颜色
export const colors = ['#49B5FF', '#FFC175'];

// 表格下载地址
export const downloadUrl = {
  campaign: '/api/gd/management/campaign-analysis/download',
  group: '/api/gd/management/group-analysis/download',
  ad: '/api/gd/management/product-analysis/download',
  keyword: '/api/gd/management/keyword-analysis/download',
  targeting: '/api/gd/management/keyword-analysis/download',
};

// 数据请求
export const actionTypes = {
  getStatisticData: 'adManage/fetchAnalysisStatistic',
  getPolylineData: 'adManage/fetchAnalysisPolyline',
  getTableData: 'adManage/fetchAnalysisTable',
};

// 日期周期存储在 localStorage 中的 key
export const localStorageKeys = {
  campaign: 'adCampaignChartsDateKey',
  group: 'adGroupChartsDateKeyd',
  ad: 'adAdChartsDateKey',
  keyword: 'adKeywordChartsDateKey',
  targeting: 'adTargetingChartsDateKey',
};
