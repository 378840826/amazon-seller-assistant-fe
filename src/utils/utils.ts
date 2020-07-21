import { parse } from 'querystring';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { message } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

type Site = 'US' | 'CA' | 'UK' | 'DE' | 'FR' | 'ES' | 'IT';

export const Iconfont = createFromIconfontCN({
  // 在 iconfont.cn 上生成
  scriptUrl: '//at.alicdn.com/t/font_1799129_mra884d2vr.js',
});

// 获取亚马逊站点基本链接
export const getAmazonBaseUrl = function (state: Site): string {
  const urlDict = {
    US: 'https://www.amazon.com',
    CA: 'https://www.amazon.ca',
    UK: 'https://www.amazon.co.uk',
    DE: 'https://www.amazon.de',
    FR: 'https://www.amazon.fr',
    ES: 'https://www.amazon.es',
    IT: 'https://www.amazon.it',
  };
  return urlDict[state];
};

// 获取亚马逊 asin 链接
export const getAmazonAsinUrl = function (asin: string, state: Site): string {
  const baseUrl = getAmazonBaseUrl(state);
  return `${baseUrl}/dp/${asin}`;
};

// 获取亚马逊 asin 链接
export const getAmazonKeywordUrl = function (keyword: string, state: Site): string {
  const baseUrl = getAmazonBaseUrl(state);
  return `${baseUrl}/s?k=${keyword}`;
};

// 请求反馈提示（正常异常都提示）
export const requestFeedback = function (code?: number, msg?: string): void {
  if (code === undefined || code === 200) {
    message.success(msg || '操作成功');
  } else {
    if (msg && msg.length > 15) {
      message.error(msg, 5);
    } else {
      message.error(msg || '操作失败！');
    }
  }
};

// 请求异常反馈提示（code !== 200 时提示）
export const requestErrorFeedback = function (code?: number, msg?: string): void {
  if (code === undefined || code !== 200) {
    if (msg && msg.length > 15) {
      message.error(msg, 5);
    } else {
      message.error(msg || '网络有点问题，请稍后再试！');
    }
  }
};

// 日期相关
export const day = {
  // 获取天数日期范围， end 为空时获取 start 天前到昨天的范围
  getDateRange: function (options: { start: number; end?: number; format?: string }) {
    const { start, end, format } = options;
    const s = moment().subtract('days', start).format(format || 'MM.DD');
    const e = moment().subtract('days', end || 1).format(format || 'MM.DD');
    return [s, e];
  },
};

// 字符串格式化为 自然数 字符串（包含 0）
export const strToNaturalNumStr = function (value: string) {
  // 删除非数字字符
  let newValue = value.replace(/[^0-9]/g, '');
  if (newValue !== '') {
    newValue = String(Number(newValue));
  }
  return newValue;
};

// 字符串格式化为 正整数 字符串（不包含 0）
export const strToUnsignedIntStr = function(value: string) {
  // 删除非数字字符, 再用 Number 转为数字去掉前导的 0。如果为 NaN，返回空字符串
  const newValue = Number(value.replace(/[^0-9]/g, ''));
  return newValue ? String(newValue) : '';
};

// 字符串格式化为 两位小数 的字符串（金额）
export const strToMoneyStr = function (value: string) {
  // 删除数字和小数点以外的字符
  let newValue = value.replace(/[^\d.]/g, '');
  // 只保留第一个小数点
  // newValue = newValue.replace(/\.{2,}/g, '.');
  newValue = newValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  // 只保留两位小数
  newValue = newValue.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  // 去掉整数部分前导的 0
  if (newValue.indexOf('.') < 0 && newValue !== '') {
    newValue = String(parseFloat(newValue));
  }
  // 第一位不能为小数点
  if (newValue.indexOf('.') === 0) {
    newValue = '0.';
  }
  return newValue;
};

// 字符串格式化为 两位小数 的字符串（正负金额）
export const strToMinusMoneyStr = function(value: string) {
  // 删除除数字，小数点和负号以外的字符
  let newValue = value.replace(/[^\d\-.]/, '');
  // 只保留第一个小数点
  // newValue = newValue.replace(/\.{2,}/g, '.');
  newValue = newValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  // 保留两位小数
  newValue = newValue.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  // 负号只能在第一位
  if (newValue.lastIndexOf('-') > 0) {
    newValue = newValue.replace(/-$/, '');
  }
  // 第一位不能为小数点
  if (newValue.indexOf('.') === 0) {
    newValue = '0.';
  }
  // 去掉整数部分前导的 0
  if (newValue.length === 2 && newValue[0] === '0' && newValue[1] !== '.') {
    newValue = newValue.slice(1);
  }
  // 负后面不能为小数点
  if (newValue[0] === '-' && newValue[1] === '.') {
    newValue = '-0.';
  }
  return newValue;
};

// 字符串格式化为 0-5 的一位小数 字符串（review评分 0 - 5.0）
export const strToReviewScoreStr = function (value: string) {
  // 删除数字和小数点以外的字符
  let newValue = value.replace(/[^\d.]/g, '');
  // 只保留第一个小数点
  // newValue = newValue.replace(/\.{2,}/g, '.');
  newValue = newValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  // 只保留两位小数
  newValue = newValue.replace(/^(-)*(\d+)\.(\d).*$/, '$1$2.$3');
  // 去掉整数部分前导的 0
  if (newValue.indexOf('.') < 0 && newValue !== '') {
    newValue = String(parseFloat(newValue));
  }
  // 第一位不能为小数点
  if (newValue.indexOf('.') === 0) {
    newValue = '0.';
  }
  // 大于 5 时
  if (newValue > '5') {
    newValue = '5';
  }
  return newValue;
};

// 复制文字
export const copyText = function (text: string, successMsg?: string): void {
  const input = document.createElement('input');
  input.style.opacity = '0';
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input);
  message.success(successMsg || '复制成功');
};

// 判断数组是否有重复值
export const isRepeatArray = function (array: Array<string | number>): boolean {
  if ((new Set(array)).size !== array.length) {
    return true;
  }
  return false;
};

// 获取解析后的 queryString 参数
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

// localstorage 方法
export const storage = {
  set(key: string, value: unknown) {
    if (typeof value === 'string') {
      window.localStorage[key] = value;
    } else {
      window.localStorage[key] = JSON.stringify(value);
    }
  },

  get(key: string) {
    const data = window.localStorage[key];
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        return data;
      }
    }
    return '';
  },

  remove(key: string) {
    window.localStorage.removeItem(key);
  },
};
//用户名，邮箱，密码正则
export const validate = {
  email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, //
  username: /^(?![0-9]+$)\w{4,16}$/, //用户名格式验证 长度4~16，支持字母、数字、下划线，不允许为纯数字
  password: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/, //长度在6~16，至少包含字母、数字、和英文符号中的两种
};


//获取url参数
export const getUrlParam = function (name: string) {
  // name=123&age=111
  const reg = new RegExp(`(^|&)${ name }=([^&]*)(&|$)`);
  const result = window.location.search.substr(1).match(reg);
  return result ? decodeURIComponent(result[2]) : null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nTs = (ary: any) => {
  for (const i in ary) {
    if (typeof ary[i] === 'object' && ary[i] !== null && !(Array.isArray(ary[i]) && ary[i].length === 0)) {
      nTs(ary[i]);
    } else {
      if (ary[i] === null) {
        ary[i] = '';
      }
    }
  }
};
