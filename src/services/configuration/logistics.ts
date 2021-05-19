/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:48:36
 * @LastEditTime: 2021-05-17 10:29:13
 */

import request from '@/utils/request';

// 物流列表
export async function getLogisticsList(params: API.IParams) {
  return request('/api/mws/shipment/shipping/list', {
    params,
  });
}

// 添加物流方式
export async function addLogistics(data: API.IParams) {
  return request('/api/mws/shipment/shipping/create', {
    method: 'POST',
    data,
  });
}

// 修改物流开关
export async function setLogisticsState(data: API.IParams) {
  return request('/api/mws/shipment/location/update/state', {
    method: 'POST',
    data,
  });
}


// 修改物流信息
export async function updateLogistics(data: API.IParams) {
  return request('/api/mws/shipment/shipping/update', {
    method: 'POST',
    data,
  });
}

// 删除物流
export async function deleteLogistics(data: API.IParams) {
  return request('/api/mws/shipment/shipping/delete', {
    method: 'POST',
    data,
  });
}
