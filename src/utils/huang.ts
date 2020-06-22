/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-18 11:14:36
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-18 11:36:19
 * @FilePath: \amzics-react_am_10\src\utils\huang.ts
 */ 

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

