/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-18 11:14:36
 * @FilePath: \amzics-react\src\utils\huang.ts
 */

import { storage } from '@/utils/utils';
/**
  storageKeys localStorage Key 放这里
  isEmptyObj 判断对象是否为空
  getQuery  URL解析
  outerHeight 获取元素高度
  getRangeDate 获取日期范围
  moneyFormat 金额格式
*/

// 所有localStorage放这里，避免冲突
export const storageKeys = {
  asinBrDateRange: 'asinBrDateRange', // ASIN总览 - 退货分析
  asinB2b: 'asinB2b', // ASIN总览 - B2B销售
  asinOrderDateRange: 'asinOrderDateRange', // ASIN总览 -订单解读周期
  asinOrderCheckbox: 'asinOrderCheckboxs', // ASIN总览 - 订单解读自定义数据
  asinOrderCheckDoufu: 'asinOrderCheckDoufu', // ASIN总览 - 订单解读选中的豆腐块
  asinB2BCheckDoufu: 'asinB2BCheckDoufu', // ASIN总览 - B2B销售 选中的豆腐块
  asinB2BDateRange: 'asinB2BDateRange', // ASIN总览 - B2B销售 周期
  adinTableCalendar: 'adinTableCalendar', // ASIN报表 周期
  asinTableChildCustomCol: 'asinTableChildCustomCol', // ASIN报表 子ASIN自定义列
  asinTableParentCustomCol: 'asinTableParentCustomCol', // ASIN报表 子ASIN自定义列
};

// 判断对象是否为空
export function isEmptyObj(obj = {}) {
  for (const key in obj) {
    return false;
  }
  return true;
}

// 解析 queryString，可不传参
export function getQuery(queryString = ''): {} {
  if (!queryString) {
    if (window.location.search !== '') {
      queryString = window.location.search.split('?')[1];
    } else {
      const href = window.location.href;
      const pathname = window.location.pathname;
      const lastUrl = href.split(pathname)[1];
      const searchString = lastUrl.split('?')[1];
      if (searchString !== undefined) {
        queryString = lastUrl.split('?')[1].split('#')[0];
      }
    }
  }
  
  if (queryString === '') {
    return {};
  }
  const arr = queryString.split('&');
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const key = item.split('=')[0];
    if (key !== '') {
      const value = decodeURIComponent(item.split('=')[1]);
      obj[key] = value;
    }
  }
  return obj;
}

// 拿元素的高度（height + border + padding + margin
export function outerHeight(selector: string): number|undefined {
  const el = document.querySelector(selector) as Element;
  if (el === null) {
    console.error('不存在的选择器');
    return;
  }
  const style = getComputedStyle(el, null);
  const height = Number(style.height.slice(0, -2));
  const marginTop = Number(style.marginTop.slice(0, -2));
  const marginBottom = Number(style.marginBottom.slice(0, -2));
  const borderTopWidth = Number(style.borderTopWidth.slice(0, -2));
  const borderBottomWidth = Number(style.borderBottomWidth.slice(0, -2));
  
  return (
    height +
    marginTop + 
    marginBottom +
    borderTopWidth + 
    borderBottomWidth
  );
}

/**
 * @param query 按最近N天 week本周 lastWeek上周 month本月 lastMonth上月 year今年 lastYear去年
 * @param isMoment true返回moment, false 返回 YYYY-MM-DD格式日期
 * @param date 可选 规定时间范围、用于获取某个月、如 getRange('week', new Date()),当前月，也可以指定其它
  """夏令时"""：
  日本，北京时间-1个小时
  英国，北京时间-7个小时
  加拿大、美国，北京时间-15个小时
  德国、法国、意大利、西班牙，北京时间-6个小时
  """冬令时"""：
  日本，北京时间-1个小时
  英国，北京时间-8个小时
  加拿大、美国，北京时间-16个小时
  德国、法国、意大利、西班牙，北京时间-7个小时
 */
export function getRangeDate(query: string|number, isMoment = true, date = {}) {
  const moment = require('moment-timezone'); // eslint-disable-line
  const { timezone } = storage.get('currentShop');
  timezone ? moment.tz.setDefault(timezone) : null; // 当前没有
  date = isEmptyObj(date) ? moment() : date;
  // console.log('当前站点时间', moment(date).format('YYYY-MM-DD HH:mm:ss'));
  let start = moment();
  let end = moment();

  switch (query) {
  case 'week': // 本周
    start = moment(date).startOf('week');
    end = moment(date).endOf('week');
    break;
  case 'lastWeek': // 上周
    start = moment(date).subtract(1, 'week').startOf('week');
    end = moment(date).subtract(1, 'week').endOf('week');
    break;
  case 'month': // 本月
    start = moment(date).startOf('month');
    end = moment(date).endOf('month');
    break;
  case 'lastMonth': // 上月
    start = moment(date).subtract(1, 'month').startOf('month');
    end = moment(date).subtract(1, 'month').endOf('month');
    break;
  case 'year': // 今年
    start = moment(date).startOf('year');
    end = moment(date).endOf('year');
    break;
  case 'lastYear': // 去年
    start = moment(date).subtract(1, 'year').startOf('year');
    end = moment(date).subtract(1, 'year').endOf('year');
    break;
  case 'quarter': // 季度
    start = moment(moment(date)).startOf('quarter').format('YYYY-MM-DD');
    end = moment(moment(date)).endOf('quarter').format('YYYY-MM-DD');
    break;
  default: 
    start = moment(date).subtract(query as number - 1, 'day');
    end = moment(date);
  }

  if (isMoment) {
    return {
      start,
      end,
    };
  }
  return {
    start: moment(start).format('YYYY-MM-DD'),
    end: moment(end).format('YYYY-MM-DD'),
  };
}


/**
 * 金额格式
 * @param dataNumber 要格式化的数字
 * @param decimals 保留几位小数
 * @param thousandsSep  千分位符号
 * @param decPoint 小数点符号
 * @param zeroIsSave 保留的小数位为0是否显示 如 1,255.000 true=1,255.000 false=1,255
 */
// eslint-disable-next-line
export function moneyFormat(
  dataNumber: number,
  decimals = 0,
  thousandsSep = ',',
  decPoint = '.',
  zeroIsSave = true,
) {

  const num = String(dataNumber).replace(/[^0-9+-Ee.]/g, '');
  const sep = thousandsSep;
  const dec = decPoint;

  const n: number = !isFinite(+num) ? 0 : + num;
  
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
  const toFixedFix = function(n: string, prec: number) {
    const pow = Math.pow(10, prec);
    return `${Math.ceil(Number(n) * pow) / pow}`;
  };

  const s = String((prec ? toFixedFix(String(n), prec) : Math.round(n))).split('.');
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(s[0])) {
    s[0] = s[0].replace(pattern, '$1' + sep + '$2'); // eslint-disable-line
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }

  // 去掉0
  if (zeroIsSave === false && decimals > 0 && Number(s[1]) === 0) {
    s.splice(1, 1);
  }
  
  return s.join(dec);
}

/**
 * 转换成指定位数的数字
 * @param {Number|String} value {}
 * @param {Number} index 
 */
export function toIndexFixed(value: number|string, index = 2): string {
  return new Number(value).toFixed(index);
}


/**
 * 判断是否为真正的对象
 * @param any
 */
export function isObject(param: any) { // eslint-disable-line
  return Object.prototype.toString.call(param) === '[object Object]';
}

