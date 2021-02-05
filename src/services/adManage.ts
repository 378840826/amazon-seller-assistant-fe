import request from '@/utils/request';

// 更新时间
export async function queryUpdateTime(params: API.IParams) {
  return request('/api/gd/management/update-time', {
    data: params,
    params,
  });
}

// 菜单树-广告活动
export async function queryCampaignSimpleList(params: API.IParams) {
  return request('/api/gd/management/campaign/simple-list', {
    data: params,
    params,
  });
}

// 菜单树-广告组
export async function queryGroupSimpleList(params: API.IParams) {
  return request('/api/gd/management/campaign/simple-list/group', {
    data: params,
    params,
  });
}

// 标签页数量
export async function queryTabsCellCount(params: API.IParams) {
  return request('/api/gd/management/campaign/child-count', {
    data: params,
    params,
  });
}

// 广告活动
// 广告活动-获取广告活动列表
export async function queryCampaignList(params: API.IParams) {
  return request('/api/gd/management/campaign/list', {
    method: 'POST',
    data: params,
    params: {
      current: params.current,
      size: params.size,
      // 后端接口要求
      order: params.sort,
      asc: params.order === 'ascend' ? 'true' : 'false',
    },
  });
}

// 广告活动-获取 Portfolios
export async function queryPortfolioList(params: API.IParams) {
  return request('/api/gd/management/campaign/portfolio/list', {
    data: params,
  });
}

// 广告活动-添加Portfolios
export async function createPortfolio (params: API.IParams) {
  return request('/api/gd/management/campaign/portfolio/add', {
    method: 'POST',
    data: params,
    params,
  });
}

// 广告活动-修改Portfolios名称
export async function updatePortfolioName (params: API.IParams) {
  return request('/api/gd/management/campaign/portfolio/update', {
    method: 'POST',
    data: params,
    params,
  });
}

// 广告活动-批量修改状态
export async function batchCampaignState(params: API.IParams) {
  return request('/api/gd/management/campaign/batchSetting', {
    method: 'POST',
    data: params,
    params,
  });
}

// 广告活动-修改数据
export async function updateCampaign(params: API.IParams) {
  return request('/api/gd/management/campaign/update', {
    method: 'POST',
    data: params,
    params,
  });
}

// 广告组
// 广告组-获取广告组列表
export async function queryGroupList(params: API.IParams) {
  return request('/api/gd/management/group/list', {
    method: 'POST',
    data: params,
    params: {
      current: params.current,
      size: params.size,
      // 后端接口要求
      order: params.sort,
      asc: params.order === 'ascend' ? 'true' : 'false',
    },
  });
}

// 广告组-修改数据
export async function updateGroup(params: API.IParams) {
  return request('/api/gd/management/group/update', {
    method: 'POST',
    data: params,
    params,
  });
}

// 广告组-批量修改状态
export async function batchGroupState(params: API.IParams) {
  return request('/api/gd/management/group/batchSetting', {
    method: 'POST',
    data: params,
    params,
  });
}

// 广告组-复制广告组
export async function copyGroup(params: API.IParams) {
  return request('/api/gd/management/group/copy', {
    data: params,
    params,
  });
}

// 广告
// 广告-获取广告列表
export async function queryAdList(params: API.IParams) {
  return request('/api/gd/management/product/list', {
    method: 'POST',
    data: params,
    params: {
      current: params.current,
      size: params.size,
      // 后端接口要求
      order: params.sort,
      asc: params.order === 'ascend' ? 'true' : 'false',
    },
  });
}

// 广告组-批量修改状态
export async function batchAdState(params: API.IParams) {
  return request('/api/gd/management/product/batchSetting', {
    method: 'POST',
    data: params,
    params,
  });
}

// 关键词
// 关键词-列表
export async function queryKeywordList(params: API.IParams) {
  return request('/api/gd/management/keyword/list', {
    method: 'POST',
    data: params,
    params: {
      current: params.current,
      size: params.size,
      // 后端接口要求
      order: params.sort,
      asc: params.order === 'ascend' ? 'true' : 'false',
    },
  });
}

// 关键词-获取建议竞价
export async function queryKeywordSuggestedBid(params: API.IParams) {
  return request('/api/gd/management/keyword/suggested', {
    method: 'POST',
    data: params,
    params,
  });
}

// 关键词-批量修改
export async function batchKeyword(params: API.IParams) {
  return request('/api/gd/management/keyword/batchSetting', {
    method: 'POST',
    data: params,
    params,
  });
}

// Targeting
// Targeting-列表
export async function queryTargetingList(params: API.IParams) {
  return request('/api/gd/management/targeting/list', {
    method: 'POST',
    data: params,
    params: {
      current: params.current,
      size: params.size,
      // 后端接口要求
      order: params.sort,
      asc: params.order === 'ascend' ? 'true' : 'false',
    },
  });
}

// Targeting-获取建议竞价
export async function queryTargetingSuggestedBid(params: API.IParams) {
  return request('/api/gd/management/targeting/suggested', {
    method: 'POST',
    data: params,
    params,
  });
}

// Targeting-批量修改
export async function batchTargeting(params: API.IParams) {
  return request('/api/gd/management/targeting/batchSetting', {
    method: 'POST',
    data: params,
    params,
  });
}
