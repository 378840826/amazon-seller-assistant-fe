import { createFromIconfontCN } from '@ant-design/icons';

type Site = 'US' | 'CA' | 'UK' | 'DE' | 'FR' | 'ES' | 'IT';

export const Iconfont = createFromIconfontCN({
  // 在 iconfont.cn 上生成
  scriptUrl: '//at.alicdn.com/t/font_1799129_tkabw0v0iyd.js',
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

