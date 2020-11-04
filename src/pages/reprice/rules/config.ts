/**
 * 规则类型， field为后端字段
 */
export const ruleTypes = [
  {
    field: 'sell',
    label: '根据销售表现调价',
  },
  {
    field: 'buybox',
    label: '根据黄金购物车调价',
  },
  {
    field: 'competitor',
    label: '根据竞品价格调价',
  },
];

// 添加规则 根据销售表现调价 周期下拉列表
export const salesDateRange = [
  {
    value: '1',
    label: '1天',
  },
  {
    value: '3',
    label: '3天',
  },
  {
    value: '7',
    label: '7天',
  },
  {
    value: '14',
    label: '14天',
  },
  {
    value: '30',
    label: '30天',
  },
  {
    value: 'week',
    label: '自然周',
  },
  {
    value: 'month',
    label: '自然月',
  },
];

// 添加规则 根据销售表现调价 条件类型下拉列表
export const salesConditionTypes = [
  {
    value: 'order',
    label: '订单量',
  },
  {
    value: 'sales',
    label: '销量',
  },
  {
    value: 'session',
    label: 'Session',
  },
  {
    value: 'rate',
    label: '转化率',
  },
  {
    value: 'salesAndStock',
    label: '销量和库存的比值',
  },
];

// ≥ < 范围 环比类的下拉列表
export const mmsrList = [
  {
    value: 'ge',
    label: '≥',
  },
  {
    value: 'lt',
    label: '＜',
  },
  {
    value: 'rate',
    label: '环比',
  },
  {
    value: 'bwteen',
    label: '范围',
  },
];

// ≥ < 范围的下拉列表
export const mmsList = [
  {
    value: 'ge',
    label: '≥',
  },
  {
    value: 'lt',
    label: '＜',
  },
  {
    value: 'bwteen',
    label: '范围',
  },
];

// 添加规则 根据销售表现调价 订单量/销量/Session => 环比下面的下拉列表
export const oosmmRates = [
  {
    value: 'upNoZero',
    label: '上升(本期>上期>0)',
  },
  {
    value: 'upHasZero',
    label: '上升(上期=0，本期>0)',
  },
  {
    value: 'downNoZero',
    label: '下降(上期>本期>0)',
  },
  {
    value: 'downHasZero',
    label: '下降(上期>0，本期=0)',
  },
  {
    value: 'unchangeNoZero',
    label: '不变(上期≠0，本期≠0)',
  },
  {
    value: 'unchangeHasZero',
    label: '不变(上期=0，本期=0)',
  },
];

export const upDownUnchange = [
  {
    value: 'up',
    label: '上升',
  },
  {
    value: 'down',
    label: '下降',
  },
  {
    value: 'unchange',
    label: '不变',
  },
];

// 上调 下调 调到最高价 调到最低价
export const upDownHLs = [
  {
    value: 'up',
    label: '上调',
  },
  {
    value: 'down',
    label: '下调',
  },
  {
    value: 'max',
    label: '调到最高价',
  },
  {
    value: 'min',
    label: '调到最低价',
  },
];

export const ffs = [
  {
    value: 'FBA',
    label: 'FBA',
  },
  {
    value: 'FBM',
    label: 'FBM',
  },
];

export const ffas = [
  {
    value: 'FBA',
    label: 'FBA',
  },
  {
    value: 'FBM',
    label: 'FBM',
  },
  {
    value: 'Amazon',
    label: 'Amazon',
  },
];


export const cartPriceList = [
  {
    value: 'gt',
    label: '>',
  },
  {
    value: 'lt',
    label: '＜',
  },
  {
    value: 'eq',
    label: '=',
  },
  {
    value: 'bwteen',
    label: '在我的最低价和最高价之间',
  },
];

export const cartCurrentPrint = [
  {
    value: 'current',
    label: '当前售价',
  },
  {
    value: 'max',
    label: '最高价',
  },
  {
    value: 'min',
    label: '最低价',
  },
  // {
  //   value: 'bwteen',
  //   label: '在我的最低价和最高价之间',
  // },
];

export const cartsmmr = [
  {
    value: 'unchange',
    label: '保存价格不变',
  },
  {
    value: 'max',
    label: '最高价',
  },
  {
    value: 'min',
    label: '最低价',
  },
  {
    value: 'lowest',
    label: '最低价对手的价格',
  },
];

export const addSubtract = [
  {
    value: 'up',
    label: '+',
  },
  {
    value: 'down',
    label: '-',
  },
];

export const cpList = [
  {
    value: 'max',
    label: '最高竞品的价格',
  },
  {
    value: 'min',
    label: '最低竞品的价格',
  },
  {
    value: 'avg',
    label: '竞品的平均价格',
  },
  {
    value: 'median',
    label: '竞品的中位数价格',
  },
];

export const action = [
  {
    value: 'buyboxPrice',
    label: '黄金购物车价格',
  },
  {
    value: 'myPrice',
    label: '我的售价',
  },
];

// export const ffaes = [
//   {
//     value: 'FBA',
//     label: 'FBA',
//   },
//   {
//     value: 'FBM',
//     label: 'FBM',
//   },
//   {
//     value: 'Amazon',
//     label: 'Amazon',
//   },
//   {
//     value: '二手',
//     label: 'Amazon',
//   },
// ];


// 获取规则名称
export function getRuleType(type: string) {
  for ( const item of ruleTypes) {
    if (item.field === type) {
      return item.label;
    }
  }
}

/**
 * 移动数组元素
 * @param arr 要移动的数组
 * @param index1 移动的位置
 * @param index2 移动到的位置
 */
export function moveArrItem(arr: any[], index1: number, index2: number) { // eslint-disable-line
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}


// 将当前条件组转换成对象存储
export function transitionObj(obj: any, value: {}, index: number) { // eslint-disable-line
  switch (index) {
  case 1:
    obj.one = value;
    break;
  case 2:
    obj.two = value;
    break;
  case 3:
    obj.three = value;
    break;
  case 4:
    obj.four = value;
    break;
  case 5:
    obj.five = value;
    break;
  case 6:
    obj.six = value;
    break;
  case 7:
    obj.seven = value;
    break;
  case 8:
    obj.eight = value;
    break;
  case 9:
    obj.nine = value;
    break;
  case 10:
    obj.ten = value;
    break;
  default:
    break;
  }
  return obj;
}

// 将当前条件组对象转换回顺序数组
export function transitionArr(obj: {}) { // eslint-disable-line
  const objArrr = [];  // eslint-disable-line
  for (const key in obj) {
    const item = obj[key];
    switch (key) {
    case 'one':
      objArrr[0] = { ...item };
      break;
    case 'two':
      objArrr[1] = { ...item };
      break;
    case 'three':
      objArrr[2] = { ...item };
      break;
    case 'four':
      objArrr[3] = { ...item };
      break;
    case 'five':
      objArrr[4] = { ...item };
      break;
    case 'six':
      objArrr[5] = { ...item };
      break;
    case 'seven':
      objArrr[6] = { ...item };
      break;
    case 'eight':
      objArrr[7] = { ...item };
      break;
    case 'nine':
      objArrr[8] = { ...item };
      break;
    case 'ten':
      objArrr[9] = { ...item };
      break;
    default:
      //
    }
  }
  return objArrr;
}
