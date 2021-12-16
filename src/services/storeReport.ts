import request from '@/utils/request';

export async function queryList(params: API.IParams) {
  return request('/api/mws/store-report/list', {
  // return request('/api/mws/profit/store/list', {
    params,
  });
}

// 站点地区店铺筛选接口(店铺列表)
export async function queryRegionSiteStore(data: API.IParams) {
  return request('/api/mws/profit/store/screen', {
    method: 'POST',
    data,
  });
}
