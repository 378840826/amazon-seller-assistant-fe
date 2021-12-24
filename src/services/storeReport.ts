import request from '@/utils/request';

export async function queryList(data: API.IParams) {
  return request('/api/mws/store-report/list', {
    method: 'POST',
    data,
  });
}

// 站点地区店铺筛选接口(店铺列表)
export async function queryRegionSiteStore(data: API.IParams) {
  return request('/api/mws/profit/store/screen', {
    method: 'POST',
    data,
  });
}
