/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-18 11:14:36
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\utils\huang.ts
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
