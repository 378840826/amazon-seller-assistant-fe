import request from '@/utils/request';

export async function queryKanbanData(params: API.IParams) {
  return request('/api/mws/kanban', {
    data: params,
    params,
  });
}

// 添加跟卖监控
export async function addCompetitorMonitor(params: API.IParams) {
  return request('/api/mws/follow/monitor/add-asin', {
    method: 'POST',
    data: params,
  });
}
