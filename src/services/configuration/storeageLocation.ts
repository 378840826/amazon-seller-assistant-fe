/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:48:36
 * @LastEditTime: 2021-04-26 16:39:56
 */

import request from '@/utils/request';

// 库位列表
export async function getStoreageLocationList(params: API.IParams) {
  return request('/api/mws/shipment/location/list', {
    params,
  });
}

// 创建库位
export async function addStorageLocation(data: API.IParams) {
  return request('/api/mws/shipment/location/create', {
    method: 'POST',
    data,
  });
}

// 修改库位
export async function updateStorageLocation(data: API.IParams) {
  return request('/api/mws/shipment/location/update', {
    method: 'POST',
    data,
  });
}

// 删除库位号
export async function deleteStorageLocation(data: API.IParams) {
  return request('/api/mws/shipment/location/delete', {
    method: 'POST',
    data,
  });
}

