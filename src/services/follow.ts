/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-08-14 11:08:49
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\services\follow.ts
 */

import request from '@/utils/request';

// 跟卖监控 - 列表
export async function getMonitorList(data: { current: number; size: number}) {
  return request('/api/mws/follow/monitor/list', {
    data,
    params: {
      current: data.current,
      size: data.size,
    },
  });
}

// 跟卖监控 - 搜索框联想列表
export async function getFollowComplete(data: { keyword: string}) {
  return request('/api/mws/follow/asin-complete', {
    data,
    params: {
      keyword: data.keyword,
    },
  });
}

// 跟卖监控 - 搜索框添加
export async function getFollowAddasin(data: { keyword: string}) {
  return request.post('/api/mws/follow/monitor/add-asin', {
    data,
    params: {
      keyword: data.keyword,
    },
  });
}

// 提醒设定-查询
export async function getFollowRemind(data: {}) {
  return request('/api/mws/follow/monitor/reminder', {
    data,
  });
}

// 提醒设定-修改
export async function updateFollowRemind(data: { keyword: string}) {
  return request.post('/api/mws/follow/monitor/reminder-setting', {
    data,
    params: {
      keyword: data.keyword,
    },
  });
}

// 频率设定-查询
export async function getFrequency(data: {}) {
  return request('/api/mws/follow/monitor/frequency', {
    data,
  });
}

// 频率设定-修改
export async function updateFrequency(data: { keyword: string}) {
  return request.post('/api/mws/follow/monitor/frequency-setting', {
    data,
  });
}

// 监控开关
export async function updateMonitorSwitch(data: { keyword: string}) {
  return request.post('/api/mws/follow/monitor/switch', {
    data,
  });
}

// 跟卖历史列表
export async function getHistoryList(params: {}) {
  return request('/api/mws/follow/history/list', {
    params,
    data: params,
  });
}

// 跟卖历史列表
export async function getFollowList(params: {}) {
  return request('/api/mws/follow/seller/list', {
    params,
    data: params,
  });
}
