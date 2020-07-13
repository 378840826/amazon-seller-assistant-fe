import request from '@/utils/request';

// 查询商品
export async function queryGoodsList(params: API.IParams) {
  // 区分批量查询和单个查询接口
  const myParams = { ...params };
  const { code } = myParams;
  const qs = {
    current: myParams.current,
    size: myParams.size,
    order: myParams.sort,
    asc: myParams.order === 'ascend' ? 'true' : 'false',
  };
  let url = '/api/mws/product/page/search';
  if (code && (code.includes('\n') || code.includes('\r') || code.includes('\r\n'))) {
    url = '/api/mws/product/batch/page';
  } else {
    myParams.search = myParams.code;
  }
  return request(url, {
    method: 'POST',
    data: myParams,
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
