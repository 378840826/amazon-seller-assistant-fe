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
