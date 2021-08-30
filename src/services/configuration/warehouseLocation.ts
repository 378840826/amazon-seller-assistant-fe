/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:48:36
 * @LastEditTime: 2021-05-10 17:33:18
 */

import request from '@/utils/request';

// 仓库列表
export async function getWarehouseList(params: API.IParams) {
  return request('/api/mws/shipment/warehouse/list', {
    params,
  });
}

// 创建仓库
export async function addWarehouse(data: API.IParams) {
  return request('/api/mws/shipment/warehouse/create', {
    method: 'POST',
    data,
  });
}

// 修改仓库开关
export async function setWarehouseState(data: API.IParams) {
  return request('/api/mws/shipment/warehouse/update/state', {
    method: 'POST',
    data,
  });
}


// 修改仓库
export async function updateWarehouse(data: API.IParams) {
  return request('/api/mws/shipment/warehouse/update', {
    method: 'POST',
    data,
  });
}

// 删除仓库
export async function deleteWarehouse(params: API.IParams) {
  return request('/api/mws/shipment/warehouse/delete', {
    method: 'POST',
    params,
  });
}
