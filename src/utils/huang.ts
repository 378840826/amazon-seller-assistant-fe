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
  asinDsellDateRange: 'asinDsellDateRange', // ASIN总览 - 地区销售 周期
  adinTableCalendar: 'adinTableCalendar', // ASIN报表 周期
  asinTableChildCustomCol: 'asinTableChildCustomCol', // ASIN报表 子ASIN自定义列
  asinTableParentCustomCol: 'asinTableParentCustomCol', // ASIN报表 子ASIN自定义列
};

/**
 * 所有在里面的数据字段都要补齐2位小数
 */
export const fillFields = [
  '销售额',
  '销量/订单量',
  '平均客单价',
  'PageView/Session',
  '平均售价',
  '转化率',
  'B2B销售额',
  'B2B销量/订单量',
  'B2B平均售价',
  'B2B销售额占比',
  'B2B平均客单价',
];

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
 * @param isMoment true返回moment对象, false 返回 YYYY-MM-DD格式日期
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
export function getRangeDate(query: string|number, isMoment = true) {
  let moment = require('moment-timezone'); // eslint-disable-line
  const { timezone } = storage.get('currentShop');
  // moment = timezone ? moment.tz.setDefault(timezone) : null; // 这种方式会影响整个项目日期时间
  // console.log('当前站点时间', moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss'));
  let start = moment();
  let end = moment();

  switch (query) {
  case 'week': // 本周
    start = moment().startOf('week');
    end = moment().tz(timezone).endOf('week');
    break;
  case 'lastWeek': // 上周
    start = moment().tz(timezone).subtract(1, 'week').startOf('week');
    end = moment().tz(timezone).subtract(1, 'week').endOf('week');
    break;
  case 'month': // 本月
    start = moment().tz(timezone).startOf('month');
    end = moment().tz(timezone).endOf('month');
    break;
  case 'lastMonth': // 上月
    start = moment().tz(timezone).subtract(1, 'month').startOf('month');
    end = moment().tz(timezone).subtract(1, 'month').endOf('month');
    break;
  case 'year': // 今年
    start = moment().tz(timezone).startOf('year');
    end = moment().tz(timezone).endOf('year');
    break;
  case 'lastYear': // 去年
    start = moment().tz(timezone).subtract(1, 'year').startOf('year');
    end = moment().tz(timezone).subtract(1, 'year').endOf('year');
    break;
  case 'quarter': // 季度
    start = moment().tz(timezone).startOf('quarter').format('YYYY-MM-DD');
    end = moment().tz(timezone).endOf('quarter').format('YYYY-MM-DD');
    break;
  default: // 最近N天
    start = moment().tz(timezone).subtract(query as number - 1, 'day');
    end = moment().tz(timezone);
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
 * 根据站点获取北京时间
 */
export function getBeijingTime(time = '00:00:00', format = 'HH:mm:ss') {
  const moment = require('moment-timezone'); // eslint-disable-line
  const { timezone } = storage.get('currentShop');
  if (time.indexOf(':') === -1) {
    throw new Error('时间格式错误！');
  }
  const times = time.split(':');
  const hour = times[0];
  const minute = times[1];
  const seconds = times[2];
  return moment().tz(timezone).hour(hour).minute(minute).seconds(seconds).tz('Asia/Shanghai').format(format);
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
 * 判断是否为真正的对象
 * @param any
 */
export function isObject(param: any) { // eslint-disable-line
  return Object.prototype.toString.call(param) === '[object Object]';
}

/**
 * 随机返回数组的一个元素，只用于mock
 */
export function arrayRandomOne(arr: any[]) { // eslint-disable-line
  const length = arr.length;
  const index = Math.floor(Math.random() * length);
  return arr[index];
}

/*
 * 获取当前站点的对应的时区时间
 * @param site 站点
 */
export function getSiteDate(site: string) {
  if (!site || typeof site !== 'string') {
    throw new Error('请传入一个站点');
  }
  switch (site) {
  case 'US':
    return {
      nationality: '美国',
      timeText: '太平洋时间',
    };
  case 'CA':
    return {
      nationality: '加拿大',
      timeText: '太平洋时间',
    };
  case 'UK':
    return {
      nationality: '英国',
      timeText: '英国时间',
    };
  case 'ES':
    return {
      nationality: '西班牙',
      timeText: '西班牙时间',
    };
  case 'DE':
    return {
      nationality: '德国',
      timeText: '德国时间',
    };
  case 'FR':
    return {
      nationality: '法国',
      timeText: '法国时间',
    };
  case 'IT':
    return {
      nationality: '意大利',
      timeText: '意大利时间',
    };
  case 'JP':
    return {
      nationality: '日本',
      timeText: '日本时间',
    };
  default: 
    // 
  }
}

/*
 * 是否为正式版环境
 * 因为还不知道正式的域名，只能尽量限制
 */
export function isFormal() {
  // 测试环境
  const hostname = location.hostname;
  if (
    hostname === 'dev.workics.cn'
    || hostname === 'test.workics.cn'
    || hostname === '127.0.0.1'
    || hostname === 'localhost'
  ) {
    return false;
  }

  // 其它都是正式版
  return true;
}

/**
 * 验证一个字段末尾是否需要补齐2位小数
 * @param field 验证的字段
 */
export function isFillField(field: string): boolean {
  return fillFields.indexOf(field) > -1 ? true : false;
}

/**
 * 随机生成一段假的UUID码
 * @param len 
 */
export function createUUID(len = 36): string {
  const codeStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-*/!@#$%^&*()_+';

  function getRandom(m: number, n: number) {
    const index = Math.floor(Math.random() * (m - n) + n);
    return index;
  }

  let str = '';
  for (let i = 0; i < len; i++) {
    const ran = getRandom(0, codeStr.length);
    str += codeStr.charAt(ran);
  }
  return str;
}

