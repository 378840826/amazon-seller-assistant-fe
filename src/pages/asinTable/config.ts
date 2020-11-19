import { storage } from '@/utils/utils';
const list = [
  {
    label: '总销售额', 
    field: 'totalSales',
  },
  {
    label: '总订单量', 
    field: 'totalOrderQuantity',
  },
  {
    label: '总销量', 
    field: 'totalSalesQuantity',
  },
  {
    label: '回评率', 
    field: 'replyReviewRate',
  },
  {
    label: '利润', 
    field: 'profit',
  },
  {
    label: '利润率 ',
    field: 'profitRate',
  },
  {
    label: '平均售价',
    field: 'avgSellingPrice',
  },
  {
    label: '平均客单价',
    field: 'avgCustomerPrice',
  },
  {
    label: '销量/订单量',
    field: 'salesQuantityExceptOrderQuantity',
  },
  {
    label: '优惠订单',
    field: 'preferentialOrderQuantity',
  },
  {
    label: '关联销售',
    field: 'associateSales',
  },
  {
    label: 'PageView', 
    field: 'pageView',
  },
  {
    label: 'Session', 
    field: 'session',
  },
  {
    label: 'PageView/Session',
    field: 'pageViewExceptSession',
  },
  {
    label: '转化率 ', 
    field: 'conversionsRate',
  },
  {
    label: '退货量', 
    field: 'returnQuantity',
  },
  {
    label: '退货率', 
    field: 'returnRate',
  },
  {
    label: 'B2B销售额', 
    field: 'b2bSales',
  },
  {
    label: 'B2B订单量', 
    field: 'b2bOrderQuantity',
  },
  {
    label: 'B2B销量', 
    field: 'b2bSalesQuantity',
  },
  {
    label: 'B2B销量/订单量',
    field: 'b2bSalesQuantityExceptOrderQuantity',
  },
  {
    label: 'B2B平均售价', 
    field: 'b2bAvgSellingPrice',
  },
  {
    label: 'B2B平均客单价', 
    field: 'b2bAvgCustomerPrice',
  },
  {
    label: '广告销售额', 
    field: 'adSales',
  },
  {
    label: '本SKU广告销售额', 
    field: 'skuAdSales',
  },
  {
    label: '自然销售额', 
    field: 'naturalSales',
  },
  {
    label: '广告订单量',
    field: 'adOrderQuantity',
  },
  {
    label: '本SKU广告订单量', 
    field: 'skuAdOrderQuantity',
  },
  {
    label: '自然订单量', 
    field: 'naturalOrderQuantity',
  },
  {
    label: 'CPC', 
    field: 'cpc',
  },
  {
    label: 'Spend', 
    field: 'spend',
  },
  {
    label: 'ACoS', 
    field: 'acos',
  },
  {
    label: '综合ACoS ',
    field: 'compositeAcos',
  },
  {
    label: 'RoAS ', 
    field: 'roas',
  },
  {
    label: '综合RoAS', 
    field: 'compositeRoas',
  },
  {
    label: 'Impressions', 
    field: 'impressions',
  },
  {
    label: 'Clicks', 
    field: 'clicks',
  },
  {
    label: 'CTR', 
    field: 'ctr',
  },
  {
    label: '广告转化率',
    field: 'adConversionsRate',
  },
  {
    label: '评分',
    field: 'reviewScore',
  },
  {
    label: 'Review',
    field: 'reviewNum',
  },
];

// 状态, Active:在售, Inactive 不可售 ,Incomplete：禁止显示, Remove 移除
export function getlistingStatus(value: string) {
  switch (value) {
  case 'Active':
    return '在售';
  case 'Inactive':
    return '不可售';
  case 'Incomplete':
    return '禁止显示';
  case 'Remove':
    return '移除';
  default: 
    return '';
  }
}

// son asin 获取表单的筛选字段
export function getLabel(field: string) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item.field === field) {
      return item.label;
    }
  }
}

// 获取表单的筛选字段(英文)
export function getLabelEnglish(label: string) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]; 
    if (item.label === label) {
      return item.field;
    }
  }
}

/**
 * 根据日历返回不同的字段给后端
 * 传了cycle就不用起始时间, 传了起始时间就不用cycle
 * @param val 当前日历选中的key
 * @param key 本地存储的localStorage
 */
export function getCalendarFields(val: string, key: string) {
  const newVal = Number(val);
  const result = {
    cycle: 0,
  };
  if (isNaN(newVal)) {
    if (val === 'year') {
      result.cycle = 12;
      return result;
    } else if (val === 'lastYear') {
      result.cycle = 13;
      return result;
    }
    const {
      startDate,
      endDate,
    } = storage.get(`${key}_date`);
    return {
      startTime: startDate,
      endTime: endDate,
    };
  } 
  switch (newVal) {
  case 7:
    result.cycle = 6;
    break;
  case 30:
    result.cycle = 7;
    break;
  case 60:
    result.cycle = 8;
    break;
  case 90:
    result.cycle = 9;
    break;
  case 180:
    result.cycle = 10;
    break;
  case 365:
    result.cycle = 11;
    break;
  default: 
    //
  }
  return result;
}
