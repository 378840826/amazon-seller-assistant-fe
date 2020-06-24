/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-03 15:33:11
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-22 19:11:22
 * @FilePath: \amzics-react\src\services\commentMonitor.ts
 * 监控评价模块API
 */ 
import request from '@/utils/request';

export async function getCommentList( data: { current: number; size: number } ) {
  return request.post<API.ICommentMonitorList>( `/api/mws/review/reviews`, {
    params: {
      current: data.current,
      size: data.size,
      order: data.order,
      asc: data.asc,
    },
    data,
    headers: {
      StoreId: '1261140381664944130',
    },
  });
}

// 评价监控列表下载
export async function downloadCommentTable( data: { current: number; size: number }) {
  return request.post('/api/mws/review/reviews/download/', {
    responseType: 'blob',
    params: {
      current: data.current,
      size: data.size,
    },
    headers: {
      StoreId: '1261140381664944130',
    },
    data,
  });
}

// 评价监控列表 - 标记已处理
export async function signHandle(id: string) {
  return request.post(`/api/mws/review/handle/${id}`);
}


// 监控评论设定列表
export async function commentMonitorSettingsList(params: {}) {
  return request(`/api/mws/review/monitoring-settings/list`, {
    params,
    headers: {
      StoreId: '1261140381664944130',
    },
  });
}

// 获取建议ASIN  (搜索下拉框)
export async function getSearchAsinList(asin: string) {
  return request('/api/mws/review/monitoring-settings/search/', {
    params: { asin },
    headers: {
      StoreId: '1261140381664944130',
    },
  });
}

// 监控列表设定 - 添加一条设定
export async function addMonitorSetting(asin: string) {
  return request.post('/api/mws/review/monitoring-settings/add-asin', {
    params: { asin },
    headers: {
      StoreId: '1261140381664944130',
    },
  });
}

// 提醒星级设置获取
export async function getreviewRemindStar(data: {}) {
  return request('/api/mws/review/reviews/list', {
    data,
    headers: {
      StoreId: '1261140381664944130',
    },
  });
}

// 提醒星级设置修改
export async function setreviewRemindStar(data: {}) {
  return request.post('/api/mws/review/reviews/setting', {
    data,
    headers: {
      StoreId: '1261140381664944130',
    },
  });
}

// 监控评论设定列表 - 监控开关
export async function setcommentMonitorSettingsSwitch(params: {}) {
  return request.post(`/api/mws/review/monitoring-settings/switch`, {
    params,
    headers: {
      StoreId: '1261140381664944130',
    },
  });
}


export async function Test(data: any) {
  return request('/api/system/user/login', {
    method: 'POST',
    data,
  });
}
