import request from '@/utils/request';

// 查询商品
export async function queryGoodsList(params: API.IParams) {
  const { code } = params;
  const qs = {
    current: params.current,
    size: params.size,
    order: params.sort,
    asc: params.order === 'ascend' ? 'true' : 'false',
  };
  let url = '/api/mws/product/page/search';
  // 如果是批量查询
  if (code) {
    url = '/api/mws/product/batch/page';
  }
  return request(url, {
    method: 'POST',
    data: params,
    params: qs,
  });
}

// 获取全部分组
export async function getShopGroups(params: API.IParams) {
  return request('/api/mws/product/group', {
    data: params,
  });
}

// 修改商品售价（单个/批量）
export async function updateGoodsPrice(params: API.IParams) {
  return request('/api/mws/product/batch/update/price', {
    method: 'POST',
    data: params,
  });
}

// 单行修改商品的调价系统参数（最高价。最低价，成本，运费，调价规则）
export async function updateGoods(params: API.IParams) {
  return request('/api/mws/product/update', {
    method: 'POST',
    data: params,
  });
}

// 批量修改商品的（最高价。最低价，分组，调价规则）
export async function updateBatchGoods(params: API.IParams) {
  let url = '';
  switch (params.key) {
  case 'groupId':
    url = '/api/mws/product/batch/update/group';
    break;
  case 'ruleId':
    url = '/api/mws/product/batch/update/rule';
    break;
  case 'maxPrice':
    url = '/api/mws/product/batch/update/max-price';
    break;
  case 'minPrice':
    url = '/api/mws/product/batch/update/min-price';
    break;
  default:
    throw '快捷设置参数 key 不存在';
  }
  return request(url, {
    method: 'POST',
    data: params,
  });
}

// 开/关商品调价（单个/批量）
export async function updateAdjustSwitch(params: API.IParams) {
  let url = '/api/mws/product/batch/update/start-aj';
  if (!params.adjustSwitch) {
    url = '/api/mws/product/batch/update/close-aj';
  }
  return request(url, {
    method: 'POST',
    data: params,
  });
}

// 快捷设置价格相关，价格，最低价，最高价（单个/批量）
export async function updatePriceFast(params: API.IParams) {
  let url = '';
  switch (params.key) {
  case 'price':
    url = '/api/mws/product/batch/fast-update/price';
    break;
  case 'maxPrice':
    url = '/api/mws/product/batch/fast-update/max-price';
    break;
  case 'minPrice':
    url = '/api/mws/product/batch/fast-update/min-price';
    break;
  default:
    throw '快捷设置参数 key 不存在';
  }
  return request(url, {
    method: 'POST',
    data: params,
  });
}

// 修改分组名称
export async function updateGroupName(params: API.IParams) {
  return request('/api/mws/product/group/update', {
    method: 'POST',
    data: params,
  });
}

// 删除分组
export async function deleteGroup(params: API.IParams) {
  return request('/api/mws/product/group/delete', {
    method: 'POST',
    data: params,
  });
}

// 添加分组
export async function addGroup(params: API.IParams) {
  return request('/api/mws/product/group/add', {
    method: 'POST',
    data: params,
  });
}

// 修改补货周期
export async function updateCycle(params: API.IParams) {
  return request('/api/mws/product/replenishment-cycle', {
    method: 'POST',
    data: params,
  });
}

// 获取补货周期
export async function getCycle(params: API.IParams) {
  return request('/api/mws/product/find/replenishment-cycle', {
    data: params,
  });
}

// 获取错误报告
export async function getErrorReport(params: API.IParams) {
  return request('/api/mws/product/report/error', {
    params: {
      size: params.size,
      current: params.current,
    },
    data: params,
  });
}

// 添加跟卖监控
export async function addMonitor(params: API.IParams) {
  const { type, asin } = params;
  const monitorTypeUrl = {
    follow: '/api/mws/follow/monitor/add-asin',
    asin: '/api/mws/asin-dynamic/monitoring-settings/add-asin',
    review: `/api/mws/review/monitoring-settings/add-asin?asin=${asin}`,
  };
  return request(monitorTypeUrl[type], {
    method: 'POST',
    data: params,
  });
}

// 批量添加跟卖监控
export async function addBatchMonitor(params: API.IParams) {
  const monitorTypeUrl = {
    follow: '/api/mws/follow/monitor/batch/add-asin',
    asin: '/api/mws/asin-dynamic/monitoring-settings/add-asins',
    review: '/api/mws/review/monitoring-settings/add-asins',
  };
  return request(monitorTypeUrl[params.type], {
    method: 'POST',
    data: params,
  });
}
