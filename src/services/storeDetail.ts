import request from '@/utils/request';

export async function queryBaseData(params: API.IParams) {
  return request('/api/mws/store-report/tofu', {
    method: 'POST',
    data: params,
  });
}

// 整体表现-豆腐块
export async function queryMainData(params: API.IParams) {
  return request('/api/mws/store-report/overall-performance/tofu', {
    method: 'POST',
    data: params,
  });
}

// 整体表现-折线图
export async function queryMainPolyline(params: API.IParams) {
  return request('/api/mws/store-report/overall-performance', {
    method: 'POST',
    data: params,
  });
}

// 整体表现-表格
export async function queryMainTable(params: API.IParams) {
  return request('/api/mws/store-report/overall-performance/page', {
    method: 'POST',
    data: params,
  });
}

// B2B-豆腐块
export async function queryB2bData(params: API.IParams) {
  return request('/api/mws/store-report/b2b-sale/tofu', {
    method: 'POST',
    data: params,
  });
}

// B2B-折线图
export async function queryB2bPolyline(params: API.IParams) {
  return request('/api/mws/store-report/b2b-sale', {
    method: 'POST',
    data: params,
  });
}

// B2B-表格
export async function queryB2bTable(params: API.IParams) {
  return request('/api/mws/store-report/b2b-sale/page', {
    method: 'POST',
    data: params,
  });
}

// 费用成本-豆腐块
export async function queryCostData(params: API.IParams) {
  return request('/api/mws/store-report/overall-performance/tofu', {
    method: 'POST',
    data: params,
  });
}

// 费用成本-折线图
export async function queryCostPolyline(params: API.IParams) {
  return request('/api/mws/store-report/overall-performance', {
    method: 'POST',
    data: params,
  });
}

// 费用成本-表格
export async function queryCostTable(params: API.IParams) {
  return request('/api/mws/store-report/overall-performance/page', {
    method: 'POST',
    data: params,
  });
}

// 退货分析全部数据
export async function queryReturnAnalysis(params: API.IParams) {
  return request('/api/mws/store-report/return-analysis', {
    method: 'POST',
    data: params,
  });
}

// 广告表现-豆腐块
export async function queryAdData(params: API.IParams) {
  return request('/api/mws/store-report/ad/tofu', {
    method: 'POST',
    data: params,
  });
}

// 广告表现-折线图
export async function queryAdPolyline(params: API.IParams) {
  return request('/api/mws/store-report/ad', {
    method: 'POST',
    data: params,
  });
}

// 广告表现-表格
export async function queryAdTable(params: API.IParams) {
  return request('/api/mws/store-report/ad/page', {
    method: 'POST',
    data: params,
  });
}

// 广告表现-各渠道数据
export async function queryAdChannel(params: API.IParams) {
  return request('/api/mws/store-report/ad/channel', {
    method: 'POST',
    data: params,
  });
}

// 产品线-柱状图
export async function queryProductLineHistogram(params: API.IParams) {
  return request('/api/mws/store-report/product-line/histogram', {
    method: 'POST',
    data: params,
  });
}

// 产品线-表格
export async function queryProductLineTable(params: API.IParams) {
  return request('/api/mws/store-report/product-line/page', {
    method: 'POST',
    data: params,
  });
}

// 地区销售
export async function queryRegional(params: API.IParams) {
  return request('/api/mws/store-report/regional', {
    method: 'POST',
    data: params,
  });
}
