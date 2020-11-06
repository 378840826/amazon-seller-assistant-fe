/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-11-28 10:53:56
 */
import request from '@/utils/request';

// 调价规则列表
export function getHistoryList(params: API.IParams){
  return request('/api/mws/nrule/adjust/history', {
    params,
    data: params,
  });
}

// 调价规则列表
export function getRuleList(params: API.IParams){
  return request('/api/mws/nrule/adjust/history/rules', {
    params,
    data: params,
  });
}

// 调价规则列表
export function getHistoryConditions(params: API.IParams){
  return request('/api/mws/nrule/adjust/history/conditions', {
    params,
    data: params,
  });
}
