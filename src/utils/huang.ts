/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-18 11:14:36
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\utils\huang.ts
 */

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
 * @param date 可选 规定时间范围、用于获取某个月、如 getRange('week', new Date()),当前月，也可以指定其它
 */
export function getRangeDate(
  query: string|number,
  date: Date|{} = {}
): {start: string; end: string} {
  const moment = require('moment'); // eslint-disable-line
  date = isEmptyObj(date) ? moment() : date;

  // 最近N天
  if (!isNaN(Number(query))) {
    return {
      start: moment(date).subtract(query as number - 1, 'day').format('YYYY-MM-DD'),
      end: moment(date).format('YYYY-MM-DD'),
    };
  }

  switch (query) {
  case 'week': // 本周
    return {
      start: moment(date).startOf('week').format('YYYY-MM-DD'),
      end: moment(date).endOf('week').format('YYYY-MM-DD'),
    };
  case 'lastWeek': // 上周
    return {
      start: moment(date).subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
      end: moment(date).subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
    };
  case 'month': // 本月
    return {
      start: moment(date).startOf('month').format('YYYY-MM-DD'),
      end: moment(date).endOf('month').format('YYYY-MM-DD'),
    };
  case 'lastMonth': // 上月
    return {
      start: moment(date).subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
      end: moment(date).subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
    };
  case 'year': // 今年
    return {
      start: moment(date).startOf('year').format('YYYY-MM-DD'),
      end: moment(date).endOf('year').format('YYYY-MM-DD'),
    };
  case 'lastYear': // 去年
    return {
      start: moment(date).subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
      end: moment(date).subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
    };
  default: 
    return {
      start: 'not data',
      end: 'not data',
    };
  }
}

/**
 * 金额格式
 * @param dataNumber 要格式化的数字
 * @param decimals 保留几位小数
 * @param thousandsSep  千分位符号
 * @param decPoint 小数点符号
 */
// eslint-disable-next-line
export function moneyFormat(
  dataNumber: number,
  decimals = 0,
  thousandsSep = ',',
  decPoint = '.',
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
  return s.join(dec);
}


/**
 * 判断是否为真正的对象
 * @param any
 */
export function isObject(param: any) { // eslint-disable-line
  return Object.prototype.toString.call(param) === '[object Object]';
}
