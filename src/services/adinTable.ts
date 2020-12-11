/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-16 16:43:26
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\services\adinTable.ts
 * 
 * ASIN报表总览
 */
import request from '@/utils/request';

// 请求子ASIN的列表
export async function getChildInitList(data: API.IParams) {
  return request.post('/api/mws/aor/child-asin/list', {
    params: {
      current: data.current,
      size: data.size,
      order: data.order,
      asc: data.asc,
    },
    data,
  });
}

// 子asin列表校验周期内每天的bs数据是否都有导入
export async function getChildCheckIntact(params: {}) {
  return request('/api/mws/aor/child-asin/check-intact', {
    params,
    data: params,
  });
}

// 子asin列表校验店铺是否已通过MWS绑定或者广告授权
export async function getChildCheckShop(params: {}) {
  return request('/api/mws/aor/child-asin/check-shop', {
    params,
    data: params,
  });
}

// 请求子ASIN的高级筛选组
export async function getChildGroups(params: {}) {
  return request('/api/mws/aor/child-asin/product-group', {
    params,
    data: params,
  });
}

// 子ASIN 请求关联销售信息
export async function getChildRs(params: {}) {
  return request.post('/api/mws/aor/child-asin/associate-sales-info', {
    params,
    data: params,
  });
}

// 子ASIN 子asin列表载入偏好
export async function getChildPreference(params: API.IParams) {
  return request('/api/mws/aor/child-asin/load-preference', {
    params,
    data: params,
  });
}

// 子ASIN 删除偏好
export async function delPreference(params: API.IParams) {
  return request.post('/api/mws/aor/child-asin/deleted-preference', {
    params,
    data: params,
  });
}

// 子ASIN 表格导出
export async function exportChildTable(data: API.IParams) {
  return request.post('/api/mws/aor/child-asin/export-excel', {
    responseType: 'blob',
    data,
  });
}

// 子ASIN 保存偏好
export async function addPreference(params: API.IParams) {
  return request.post('/api/mws/aor/child-asin/save-preference', {
    // params: {
    //   current: params.current,
    //   size: params.size,
    //   order: params.order,
    //   asc: params.asc,
    // },
    data: params,
  });
}

// -----------父ASIN--------------
export async function getParentList(params: API.IParams) {
  return request.post('/api/mws/aor/parent-asin/list', {
    params,
    data: params,
  });
}

// 父ASIN 保存偏好
export async function addParentPreference(data: API.IParams) {
  return request.post('/api/mws/aor/parent-asin/save-preference', {
    data,
  });
}

// 父asin列表校验周期内每天的bs数据是否都有导入
export async function getParentCheckIntact(params: {}) {
  return request('/api/mws/aor/parent-asin/check-intact', {
    params,
    data: params,
  });
}

// 父asin列表校验店铺是否已通过MWS绑定或者广告授权
export async function getParentCheckShop(params: {}) {
  return request('/api/mws/aor/parent-asin/check-shop', {
    params,
    data: params,
  });
}

// 父asin 删除偏好
export async function delParentPreference(params: API.IParams) {
  return request.post('/api/mws/aor/parent-asin/deleted-preference', {
    params,
    data: params,
  });
}

// 父asin 父asin列表载入偏好
export async function getParentPreference(params: API.IParams) {
  return request('/api/mws/aor/parent-asin/load-preference', {
    params,
    data: params,
  });
}

// 父asin 表格导出
export async function exportParentTable(data: API.IParams) {
  return request.post('/api/mws/aor/parent-asin/export-excel', {
    responseType: 'blob',
    data,
  });
}
