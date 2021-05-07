/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-10 14:03:15
 * @LastEditTime: 2021-05-06 17:24:11
 * 
 * 报表 -> 利润表
 */
import request from '@/utils/request';


// 获取店铺利润详情列表
export async function getStoreList(params: API.IParams) {
  return request('/api/mws/profit/store/list', {
    method: 'POST',
    data: params,
    params,
  });
}


// 店铺利润导出
export async function storeExport(data: API.IParams) {
  return request('/api/mws/profit/store/export', {
    method: 'POST',
    data,
    params: data,
    responseType: 'blob',
  });
}

// 站点地区店铺筛选接口(店铺列表)
export async function getShopDownList(data: API.IParams) {
  return request('/api/mws/profit/store/screen', {
    method: 'POST',
    data,
  });
}

// 获取ASIN详情列表
export async function getAsinList(params: API.IParams) {
  return request('/api/mws/profit/asin/screen', {
    method: 'POST',
    data: params,
    params,
  });
}

// ASIN列表导出
export async function asinExport(params: API.IParams) {
  return request('/api/mws/profit/asin/export', {
    method: 'POST',
    data: params,
    params,
    responseType: 'blob',
  });
}

// 获取店铺利润详情列表
export async function getChildAsinList(params: API.IParams) {
  return request('/api/mws/profit/asin/list', {
    method: 'POST',
    data: params,
    params,
  });
}

// 站点地区店铺筛选接口(店铺列表)
export async function getChildAsinDownList(data: API.IParams) {
  return request('/api/mws/profit/asin/screen', {
    method: 'POST',
    data,
  });
}
