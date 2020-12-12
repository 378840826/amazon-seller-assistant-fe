import request from '@/utils/request';

export async function queryMwsShopList() {
  return request('/api/mws/store/list');
}

export async function queryPpcShopList() {
  return request('/api/adshop/list');
}

export async function modifyShopAutoPrice(params: API.IParams) {
  return request('/api/mws/store/modify/auto-price', {
    method: 'POST',
    data: params,
  });
}

export async function unbindShop(params: API.IParams) {
  return request('/api/mws/store/unbind', {
    method: 'POST',
    data: params,
  });
}

export async function renameShop(params: API.IParams) {
  return request('/api/mws/store/modify/name', {
    method: 'POST',
    data: params,
  });
}

export async function updateShopToken(params: API.IParams) {
  return request('/api/mws/store/modify/token', {
    method: 'POST',
    data: params,
  });
}

export async function bindShop(params: API.IParams) {
  return request('/api/mws/store/bind', {
    method: 'POST',
    data: params,
  });
}
