import request from '@/utils/request';

export async function queryBaseData(params: API.IParams) {
  return request('/api/mws/store/detail/asinsku', {
    params,
  });
}

// 整体表现-豆腐块
export async function queryMainData(params: API.IParams) {
  return request('/api/mws/store/detail/main/tofu', {
    params,
  });
}

// 整体表现-折线图
export async function queryMainPolyline(params: API.IParams) {
  return request('/api/mws/store/detail/main/polyline', {
    data: params,
    params,
  });
}

// 整体表现-表格
export async function queryMainTable(params: API.IParams) {
  return request('/api/mws/store/detail/main/table', {
    data: params,
    params,
  });
}
