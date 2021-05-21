import request from '@/utils/request';

// 更新时间
export async function queryUpdateTime(params: API.IParams) {
  return request('/api/gd/management/update-time', {
    data: params,
    params,
  });
}

// 广告活动简表
export async function querySimpleCampaignList(params: API.IParams) {
  return request('/api/gd/management/cam/store/list', {
    data: params,
    params,
  });
}

// 广告组简表
export async function querySimpleGroupList(params: API.IParams) {
  return request('/api/gd/management/group/simple-list', {
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
  });
}

// 广告活动-修改Portfolios名称
export async function updatePortfolioName (params: API.IParams) {
  return request('/api/gd/management/campaign/portfolio/update', {
    method: 'POST',
    data: params,
  });
}

// 广告活动-批量修改状态
export async function batchCampaignState(params: API.IParams) {
  return request('/api/gd/management/campaign/batchSetting', {
    method: 'POST',
    data: params,
  });
}

// 广告活动-修改数据
export async function updateCampaign(params: API.IParams) {
  return request('/api/gd/management/campaign/update', {
    method: 'POST',
    data: params,
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
  });
}

// 广告组-批量修改状态
export async function batchGroupState(params: API.IParams) {
  return request('/api/gd/management/group/batchSetting', {
    method: 'POST',
    data: params,
  });
}

// 广告组-复制广告组
export async function copyGroup(params: API.IParams) {
  return request('/api/gd/management/group/copy', {
    data: params,
    params,
  });
}

// 广告组-自动广告组的target设置列表
export async function queryAutoGroupTargetList(params: API.IParams) {
  return request('/api/gd/management/group/target/list', {
    data: params,
    params,
  });
}

// 广告组-修改自动广告组的target设置
export async function updateAutoGroupTarget(params: API.IParams) {
  return request('/api/gd/management/group/target/update', {
    method: 'POST',
    data: params,
  });
}

// 广告组-获取定时设置
export async function queryGroupTime(params: API.IParams) {
  return request('/api/gd/management/group/timing', {
    data: params,
    params,
  });
}

// 广告组-保存修改定时设置
export async function updateGroupTime(params: API.IParams) {
  return request('/api/gd/management/group/timing', {
    method: 'POST',
    data: params,
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

// 广告-修改数据
export async function updateAd(params: API.IParams) {
  return request('/api/gd/management/product/update', {
    method: 'POST',
    data: params,
  });
}

// 广告-批量修改状态
export async function batchAdState(params: API.IParams) {
  return request('/api/gd/management/product/batchSetting', {
    method: 'POST',
    data: params,
  });
}

// 广告-添加广告时搜索商品
export async function queryGoodsList(params: API.IParams) {
  return request('/api/gd/management/product/asin-list', {
    data: params,
    params,
  });
}

// 广告-添加广告
export async function addAd(params: API.IParams) {
  return request('/api/gd/management/product/add', {
    method: 'POST',
    data: params,
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
  return request('/api/gd/management/keyword/bid-recommendation', {
    method: 'POST',
    data: params,
  });
}

// 关键词-批量修改
export async function batchKeyword(params: API.IParams) {
  return request('/api/gd/management/keyword/batch-setting', {
    method: 'POST',
    data: params,
  });
}

// 关键词-获取建议关键词
export async function querySuggestedKeywords(params: API.IParams) {
  return request('/api/gd/management/keyword/suggested-keyword', {
    data: params,
    params,
  });
}

// 关键词-添加关键词
export async function addKeyword(params: API.IParams) {
  return request('/api/gd/management/product/add', {
    method: 'POST',
    data: params,
  });
}

// Targeting
// Targeting-列表
export async function queryTargetingList(params: API.IParams) {
  return request('/api/gd/management/target/list', {
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
  return request('/api/gd/management/target/bid-recommendation', {
    method: 'POST',
    data: params,
  });
}

// Targeting-修改
export async function updateTargeting(params: API.IParams) {
  return request('/api/gd/management/target/update', {
    method: 'POST',
    data: params,
  });
}

// Targeting-批量修改
export async function batchTargeting(params: API.IParams) {
  return request('/api/gd/management/target/batch-setting', {
    method: 'POST',
    data: params,
  });
}

// Targeting-获取建议分类
export async function querySuggestedCategory(params: API.IParams) {
  return request('/api/gd/management/target/suggested-categories', {
    data: params,
    params,
  });
}

// Targeting-获取建议品牌
export async function querySuggestedBrands(params: API.IParams) {
  return request('/api/gd/management/target/suggested-brands', {
    data: params,
    params,
  });
}

// Targeting-获取建议商品
export async function querySuggestedGoods(params: API.IParams) {
  return request('/api/gd/management/target/suggested-goods', {
    data: params,
    params,
  });
}

// Targeting-获取建议竞价-分类
export async function queryCategorySuggestedBid(params: API.IParams) {
  return request('/api/gd/management/target/category/bid-recommendations', {
    method: 'POST',
    data: params,
  });
}

// Targeting-获取建议竞价-商品
export async function queryGoodsSuggestedBid(params: API.IParams) {
  return request('/api/gd/management/target/product/bid-recommendations', {
    method: 'POST',
    data: params,
  });
}

// Targeting-添加Targeting
export async function addTargeting(params: API.IParams) {
  return request('/api/gd/management/target/add', {
    method: 'POST',
    data: params,
  });
}

// 否定Targeting
// 否定Targeting-列表
export async function queryNegativeTargetingList(params: API.IParams) {
  return request('/api/gd/management/group/ne-target/list', {
    data: params,
    params,
  });
}

// 否定Targeting-批量归档
export async function batchNegativeTargetingArchive(params: API.IParams) {
  return request('/api/gd/management/group/ne-target/archive', {
    method: 'POST',
    data: params,
  });
}

// 否定Targeting-添加
export async function createNegativeTargeting(params: API.IParams) {
  return request('/api/gd/management/gruop/netarget/add', {
    method: 'POST',
    data: params,
  });
}

// 否定关键词
// 否定关键词-列表
export async function queryNegativeKeywordList(params: API.IParams) {
  // 区分广告活动的否定关键词和关键词广告组的否定关键词
  let url = '';
  if (params.type === 'campaign') {
    url = '/api/gd/management/campaign/ne-keyword/list';
  } else if (params.type === 'group') {
    url = '/api/gd/management/group/ne-keyword/list';
  }
  return request(url, {
    data: params,
    params,
  });
}

// 否定关键词-批量归档
export async function batchNegativeKeywordArchive(params: API.IParams) {
  // 区分广告活动的否定关键词和关键词广告组的否定关键词
  let url = '';
  if (params.type === 'campaign') {
    url = '/api/gd/management/campaign/ne-keyword/archive';
  } else if (params.type === 'group') {
    url = '/api/gd/management/group/ne-keyword/archive';
  }
  return request(url, {
    method: 'POST',
    data: params,
  });
}

// 否定关键词-获取建议否定关键词
export async function querySuggestedNegativeKeywords(params: API.IParams) {
  // 区分广告活动的否定关键词和关键词广告组的否定关键词
  let url = '';
  if (params.type === 'campaign') {
    url = '/api/gd/management/campaign/suggested-negativeKeyword/list';
  } else if (params.type === 'group') {
    url = '/api/gd/management/group/suggested-negativeKeyword/list';
  }
  return request(url, {
    data: params,
    params,
  });
}

// 否定关键词-添加（同时支持广告活动和广告组，st搜索词是asin的也算关键词）
export async function createNegativeKeywords(params: API.IParams) {
  return request('/api/gd/management/st/add/ne-keyword', {
    method: 'POST',
    data: params,
  });
}

// SearchTerm报表
// SearchTerm报表-列表
export async function querySearchTermList(params: API.IParams) {
  return request('/api/gd/management/st/list', {
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

// SearchTerm报表-获取建议竞价
export async function queryQueryKeywordSuggestedBid(params: API.IParams) {
  return request('/api/gd/management/st/suggested', {
    method: 'POST',
    data: params,
  });
}

// SearchTerm报表-投放或否定搜索词时，获取可供选择的广告活动
export async function queryUsableCampaignList(params: API.IParams) {
  return request('/api/gd/management/st/cam', {
    data: params,
    params,
  });
}

// SearchTerm报表-投放搜索词时，获取可供选择的广告组
export async function queryUsablePutGroupList(params: API.IParams) {
  return request('/api/gd/management/st/group', {
    data: params,
    params,
  });
}

// SearchTerm报表-否定搜索词时，获取可供选择的广告组
export async function queryUsableNegateGroupList(params: API.IParams) {
  return request('/api/gd/management/st/group', {
    data: params,
    params,
  });
}

// SearchTerm报表-投放搜索词为关键词
export async function createKeywords(params: API.IParams) {
  return request('/api/gd/management/st/add/keyword', {
    method: 'POST',
    data: params,
  });
}

// SearchTerm报表-投放词联想
export async function getKeywordTextAssociate(params: API.IParams) {
  return request('/api/gd/management/st/like/keyword-text', {
    data: params,
    params,
  });
}

// SearchTerm报表-搜索词联想
export async function getQueryKeywordAssociate(params: API.IParams) {
  return request('/api/gd/management/st/like/keyword-query', {
    data: params,
    params,
  });
}

// 操作记录-获取列表
export async function queryOperationRecords(params: API.IParams) {
  return request('/api/gd/management/behavior/list', {
    data: params,
    params,
  });
}


// 数据分析-统计数据
export async function queryAnalysisStatistic(params: API.IParams) {
  const { targetType } = params;
  const urlDict = {
    campaign: '/api/gd/management/campaign-analysis/tofu',
    group: '/api/gd/management/group-analysis/tofu',
    ad: '/api/gd/management/product-analysis/tofu',
    // keyword: '/api/gd/management/keyword-analysis/tofu',
    keyword: '/api/gd/management/campaign-analysis/tofu',
    targeting: '/api/gd/management/target-analysis/tofu',
  };
  return request(urlDict[targetType], {
    data: params,
    params,
  });
}

// 数据分析-折线图
export async function queryAnalysisPolyline(params: API.IParams) {
  const { targetType } = params;
  const urlDict = {
    campaign: '/api/gd/management/campaign-analysis/polyline',
    group: '/api/gd/management/group-analysis/polyline',
    ad: '/api/gd/management/product-analysis/polyline',
    // keyword: '/api/gd/management/keyword-analysis/polyline',
    keyword: '/api/gd/management/campaign-analysis/polyline',
    targeting: '/api/gd/management/target-analysis/polyline',
  };
  return request(urlDict[targetType], {
    data: params,
    params,
  });
}

// 数据分析-表格数据
export async function queryAnalysisTable(params: API.IParams) {
  const { targetType } = params;
  const urlDict = {
    campaign: '/api/gd/management/campaign-analysis/list',
    group: '/api/gd/management/group-analysis/list',
    ad: '/api/gd/management/product-analysis/list',
    // keyword: '/api/gd/management/keyword-analysis/list',
    keyword: '/api/gd/management/campaign-analysis/list',
    targeting: '/api/gd/management/target-analysis/list',
  };
  return request(urlDict[targetType], {
    data: params,
    params,
  });
}
