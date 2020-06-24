import { parse } from 'querystring';
import { message } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

type Site = 'US' | 'CA' | 'UK' | 'DE' | 'FR' | 'ES' | 'IT';

export const Iconfont = createFromIconfontCN({
  // 在 iconfont.cn 上生成
  scriptUrl: '//at.alicdn.com/t/font_1799129_4yd4vhggcuc.js',
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
