import request from '@/utils/request';

export async function queryMwsShopList() {
  return request<API.ICurrentUser>('/api/shop/list');
}

export async function queryPpcShopList() {
  return request<API.ICurrentUser>('/api/adshop/list');
}
