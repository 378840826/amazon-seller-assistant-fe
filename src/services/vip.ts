import request from '@/utils/request';

// 我的会员，功能余量和付费记录等
export async function queryMyVip(params: API.IParams) {
  return request('/api/system/member/info', {
    data: params,
    params,
  });
}

// 获取付款二维码
export async function queryCodeUrl(params: API.IParams) {
  return request('/api/system/member/qr-code', {
    method: 'POST',
    data: params,
    params,
  });
}

// 获取支付状态
export async function querypayStatus(params: API.IParams) {
  return request('/api/system/member/pay-status', {
    params,
  });
}

// 续费信息
export async function queryRenewInfo() {
  return request('/api/system/member/vip-renewal');
}

// 续费信息
export async function queryUpgradeInfo() {
  return request('/api/system/member/vip-upgrade');
}
