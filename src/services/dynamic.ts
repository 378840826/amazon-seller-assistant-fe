import request from '@/utils/request';
//asin动态汇总列表
export function getSummaryList(params: API.IParams){
  return request('/api/mws/asin-dynamic/summary-list', {
    method: 'POST',
    ...params,
  });
}
//asin动态监控设定列表
export function getMonitoringSettingsList(params: API.IParams){
  return request('/api/mws/asin-dynamic/monitoring-settings/list', {
    method: 'GET',
    ...params,
  });
}
//asin或者title模糊匹配
export function getMonitorSettingsSearch(params: API.IParams){
  return request('/api/mws/asin-dynamic/monitoring-settings/search', {
    method: 'GET',
    ...params,
  });
}
//添加asin
export function addAsin(params: API.IParams){
  return request('/api/mws/asin-dynamic/monitoring-settings/add-asin', {
    method: 'POST',
    ...params,
  });
}

//监控开关
export function setSwitch(params: API.IParams){
  return request('/api/mws/asin-dynamic/monitoring-settings/switch', {
    method: 'POST',
    ...params,
  });
}
//asin动态页面的变化数据 => 表格
export function getDynamicList(params: API.IParams){
  return request('/api/mws/asin-dynamic/list', {
    method: 'POST',
    ...params,
  });
}
//asin动态页面的折现图相关数据 折线图
export function getPolyLineList(params: API.IParams){
  return request('/api/mws/asin-dynamic/polyline-list', {
    method: 'POST',
    ...params,
  });
}
//备注修改
export function updateRemarks(params: API.IParams){
  return request('/api/mws/asin-dynamic/list/update-remarks', {
    method: 'POST',
    ...params,
  });
}
//===================关键词搜索排名监控==================
//关键词搜索排名监控列表
export function msGetList(params: API.IParams){
  console.log('params:', params);
  const asc = params.params.asc;
  let order = params.params.order;
  if (order === 'advertisingRankingData'){
    order = 'advertisingRanking';
  } else if (order === 'naturalRankingData'){
    order = 'naturalRanking';
  }
  params.params.asc = asc === 'ascend' ? true : false;
  params.params.order = [undefined, null].includes(asc) ? '' : order;
  
  return request('/api/mws/search-ranking/monitoring-settings/list', {
    method: 'POST',
    ...params,
  });
}
//修改任务状态
export function msUpdateStatus(params: API.IParams){
  return request('/api/mws/search-ranking/monitoring-settings/update-status', {
    method: 'POST',
    ...params,
  });
}
//监控设定频率按钮
export function msFrequency(params: API.IParams){
  return request('/api/mws/search-ranking/monitoring-settings/frequency', {
    method: 'GET',
    ...params,
  });
}
//监控频率修改
export function msFrequencyUpdate(params: API.IParams){
  return request('/api/mws/search-ranking/monitoring-settings/frequency-update', {
    method: 'GET',
    ...params,
  });
}
//竞品按钮
export function msGetAsinList(params: API.IParams){
  return request('/api/mws/search-ranking/monitoring-settings/asin-list', {
    method: 'GET',
    ...params,
  });
}
//修改竞品列表
export function msAsinUpdate(params: API.IParams){
  return request('/api/mws/search-ranking/monitoring-settings/asin-update', {
    method: 'POST',
    ...params,
  });
}
//自然排名折线图
export function msGetNaturalData(params: API.IParams){
  return request('/api/mws/search-ranking/monitoring-settings/natural-data', {
    method: 'POST',
    ...params,
  });
}
//广告排名折线图
export function msGetAd(params: API.IParams){
  return request('/api/mws/search-ranking/monitoring-settings/advertising-data', {
    method: 'POST',
    ...params,
  });
}
//添加监控任务的搜索商品
export function msSearchProduct(params: API.IParams){
  return request('/api/mws/search-ranking/monitoring-settings/search-product', {
    method: 'GET',
    ...params,
  });
}
//添加监控任务的建议关键词搜索
export function msSearchKeyword(params: API.IParams){
  return request('/api/mws/search-ranking/monitoring-settings/search-keyword', {
    method: 'POST',
    ...params,
  });
}
//添加监控
export function msMonitorAdd(params: API.IParams){
  return request('/api/mws/search-ranking/monitoring-settings/add', {
    method: 'POST',
    ...params,
  });
}

//竞品监控列表
export function cpMsList(params: API.IParams){
  return request('/api/mws/competitive-products/monitoring-settings/list', {
    method: 'POST',
    ...params,
  });
}

//监控设定频率按钮
export function cpMsFrequency(params: API.IParams){
  return request('/api/mws/competitive-products/monitoring-settings/frequency', {
    method: 'GET',
    ...params,
  });
}

//监控频率修改
export function cpMsFreUpdate(params: API.IParams){
  return request('/api/mws/competitive-products/monitoring-settings/frequency-update', {
    method: 'GET',
    ...params,
  });
}
//
export function getACList(params: API.IParams){
  return request('/api/mws/competitive-products/monitoring-settings/ac-data', {
    method: 'POST',
    ...params,
  });
}
//获取各条折线图
export function getEcharts(params: API.IParams, category: string){
  return request(`/api/mws/competitive-products/monitoring-settings/${category}-data`, {
    method: 'POST',
    ...params,
  });
}
//修改任务状态
export function updateStatus(params: API.IParams){
  return request(`/api/mws/competitive-products/monitoring-settings/update-status`, {
    method: 'POST',
    ...params,
  });
}
//建议竞品
export function suggestAsin(params: API.IParams){
  return request(`/api/mws/competitive-products/monitoring-settings/suggest-asin`, {
    method: 'POST',
    ...params,
  });
}

//添加asin
export function cpAsin(params: API.IParams){
  return request(`/api/mws/competitive-products/monitoring-settings/add-asin`, {
    method: 'POST',
    ...params,
  });
}
//导出
export function exportForm(params: API.IParams){
  //?size=20&current=1&order=&asc=false
  const query = params.params;
  let url = ``;

  if (query){
    url += `?`;
    Object.keys(query).forEach(item => url += `${item}=${query[item]}&`);
    url = url.substr(0, url.length - 1);
  }
  
  fetch(`/api/mws/competitive-products/monitoring-settings/export${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'StoreId': params.StoreId,
    },
    body: JSON.stringify(params.data),
  }).then((response) => {
    return response;
  });
}
