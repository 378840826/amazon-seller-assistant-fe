import request from '@/utils/request';

export async function queryMyVip(params: API.IParams) {
  return request('/api/mws/vip/my', {
    data: params,
    params,
  });
}

export async function queryRenewCodeUrl(params: API.IParams) {
  return request('/api/mws/vip/renew-url', {
    data: params,
    params,
  });
}
