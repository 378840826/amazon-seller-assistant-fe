// 需要转成金额格式的字段
export const moneyFormatNames = [
  '总销售额',
  'FBA销售额',
  'FBM销售额',
  '平均售价',
  '平均客单价',
  'B2B销售额',
  'B2B平均售价',
  'B2B平均客单价',
  '毛利',
  '自然销售额',
  '广告销售额',
];

// 需要转成百分比的字段
export const percentageFormatNames = ['转化率', 'B2B销售额占比', '毛利率', '退货率'];

// 提供数据源选择的字段（选择 全部、FBA、FBM、B2B）
export const multiDataOrigin = ['总订单量', '总销量', '总销售额'];

// 折线图颜色
export const colors = ['#49B5FF', '#FFC175'];

// 要显示柱状图的字段
export const showBarNames = ['总销售额', 'FBA销售额', 'FBM销售额', 'B2B销售额', '广告销售额'];

// 需要显示 上期 复选框的日期周期的 key
export const showPreviousPeriodKey = [
  'week',
  'biweekly',
  'month',
  'quarter',
  'lastYear',
  'year',
  '7', '15', '30', '60', '90', '180', '365',
];
