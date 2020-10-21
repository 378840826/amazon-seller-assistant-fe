import request from '@/utils/request';

// 查询补货商品
export async function queryGoodsList(params: API.IParams) {
  const { current, size, sort, order, skuStatus, inputContent, replenishmentExists } = params;
  const qs = {
    skuStatus,
    inputContent,
    replenishmentExists,
    current,
    size,
    order: sort,
    asc: order === 'ascend' ? 'true' : 'false',
  };
  return request('/api/mws/fis/page', {
    data: params,
    params: qs,
  });
}

// 获取 sku 保存的设置内容
export async function querySkuSetting(params: API.IParams) {
  return request('/api/mws/fis/sku-setting', {
    params: params,
    data: params,
  });
}

// 设置和批量设置
export async function updateRule(params: API.IParams) {
  if (params.dataRange === 2) {
    delete params.currentPageSkus;
  }
  return request('/api/mws/fis/update-rule', {
    method: 'POST',
    data: params,
  });
}

// 批量设置单项数据
export async function updateRuleSingle(params: API.IParams) {
  if (params.dataRange === 2) {
    delete params.currentPageSkus;
  }
  const lastPathDict = {
    period: 'expand',
    shipping: 'shipping',
    label: 'label',
    status: 'status',
    rule: 'rule',
  };
  const lastPath = lastPathDict[params.settingType];
  delete params.settingType;
  return request(`/api/mws/fis/update-rule/${lastPath}`, {
    method: 'POST',
    data: params,
  });
}

// 获取全部标签
export async function queryLabels(params: API.IParams) {
  return request('/api/mws/fis/labels', {
    data: params,
  });
}

// 删除标签
export async function deleteLabel(params: API.IParams) {
  return request('/api/mws/fis/label/remove', {
    method: 'POST',
    data: params,
  });
}

// 添加新标签
export async function addLabel(params: API.IParams) {
  return request('/api/mws/fis/label/add', {
    method: 'POST',
    data: params,
  });
}

// 获取在途详情
export async function queryTransitDetails(params: API.IParams) {
  return request('/api/mws/fis/transit-details', {
    data: params,
    params: params,
  });
}

// 获取店铺更新时间
export async function queryUpdateTime(params: API.IParams) {
  return request('/api/mws/fis/update-time', {
    data: params,
  });
}
