import { createFromIconfontCN } from '@ant-design/icons';

type Site = 'US' | 'CA' | 'UK' | 'DE' | 'FR' | 'ES' | 'IT';

export const Iconfont = createFromIconfontCN({
  // 在 iconfont.cn 上生成
  scriptUrl: '//at.alicdn.com/t/font_1799129_tetgsde260g.js',
  
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

// 判断数组是否有重复值
export const isRepeatArray = function (array: Array<string | number>): boolean {
  if ((new Set(array)).size !== array.length) {
    return true;
  }
  return false;
};

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
