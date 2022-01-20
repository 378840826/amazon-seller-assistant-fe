
// 需要转成金额格式的字段
export const moneyFormatNames = [
  '总销售额',
  'FBA销售额',
  'FBM销售额',
  'B2B销售额',
  '广告销售额',
  '广告花费',
];

// 要显示柱状图的字段
export const showBarNames = [
  '总销售额',
  'FBA销售额',
  'FBM销售额',
  'B2B销售额',
  '广告销售额',
  'FBA广告销售额',
  'FBM广告销售额',
  'B2B广告销售额',
];

// 人民币 美元 代码
export const currencyDict = {
  'rmb': '￥',
  'usd': '$',
};

// 提供细分数据源选择的字段（选择 全部、FBA、FBM、B2B）
export const multiDataOrigin = ['总订单量', '总销量', '总销售额'];

// 需要显示 上期 复选框的日期周期的 key
export const showPreviousPeriodKey = [
  'week',
  'biweekly',
  'month',
  'quarter',
  '7', '15', '30', '60', '90', '180',
];

// 折线图颜色
export const colors = ['#49B5FF', '#FFC175'];

// // 固定对应的颜色
// export const colorDict = {
//   '总销售额': '#0083FF',
//   '总订单量': '#FF5958',
//   '总销量': '#0083FF',
//   '广告销售额': '#4B7DEF',
//   '广告订单量': '#30D772',
//   '广告花费': '#FF9200',
// };
