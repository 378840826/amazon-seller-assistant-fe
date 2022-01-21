import request from '@/utils/request';

// 豆腐块数据和更新时间汇率等
export async function queryBaseAndTofu(params: API.IParams) {
  // timeMethod 参数在特定情况下才需要， 不然后端会报错
  if (!['WEEK', 'BIWEEKLY', 'MONTH', 'QUARTER'].includes(params.timeMethod.toUpperCase())) {
    delete params.timeMethod;
  }
  return request('/api/mws/sales/market/tofu', {
    method: 'POST',
    data: params,
  });
}

// 折线图和地图数据
export async function queryChartsData(params: API.IParams) {
  // timeMethod 参数在特定情况下才需要， 不然后端会报错
  if (!['WEEK', 'BIWEEKLY', 'MONTH', 'QUARTER'].includes(params.timeMethod.toUpperCase())) {
    delete params.timeMethod;
  }
  return request('/api/mws/sales/market/graph', {
    method: 'POST',
    data: params,
  });
}
