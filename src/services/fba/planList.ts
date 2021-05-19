/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-03-16 10:27:55
 * @LastEditTime: 2021-05-18 14:14:24
 */

import request from '@/utils/request';

// 货件计划列表
export async function getPlanList(data: API.IParams) {
  return request('/api/mws/shipment/list', {
    method: 'POST',
    data,
  });
}

// 货件计划作废
export async function updatePlan(data: API.IParams) {
  return request('/api/mws/shipment/plan/states', {
    method: 'POST',
    data,
    params: { aaa: 5555 },
  });
}

// 创建货件计划 - 获取站点下拉列表
export async function getSites(params: API.IParams) {
  return request('/api/mws/shipment/marketplace/list', {
    params,
  });
}

// 创建货件计划 - 获取目的仓库下拉列表
export async function getWarehouses(data: API.IParams) {
  return request('/api/mws/shipment/destination/warehouse/list', {
    method: 'POST',
    data,
  });
}


// 创建货件计划 - 获取物流方式下拉列表
export async function getLogistics() {
  return request('/api/mws/shipment/get/shipping');
}

// 创建货件计划 - 获取发货地址下列拉表
export async function getSpinAddress(params: API.IParams) {
  return request('/api/mws/shipment/start/warehouse/list', { params });
}

// 创建货件计划 - 获取商品列表
export async function getProductList(params: API.IParams) {
  return request('/api/mws/shipment/product/list', { params });
}


// 创建货件计划 - 获取商品列表
export async function addPlan(data: API.IParams) {
  return request('/api/mws/shipment/create', {
    method: 'POST',
    data,
  });
}

// 货件计划列表  - 详情
export async function getPlanDetail(params: API.IParams) {
  return request('/api/mws/shipment/plan', {
    params,
  });
}

// 货件计划列表  - 修改物流方式
export async function updateLogistics(data: API.IParams) {
  return request('/api/mws/shipment/plan/shipping', {
    method: 'POST',
    data,
  });
}

// 修改货件详情
export async function updateDetails(data: API.IParams) {
  return request('/api/mws/shipment/plan/update', {
    method: 'POST',
    data,
  });
}

// 核实货件计划详情
export async function planVerify(params: API.IParams) {
  return request('/api/mws/shipment/plan', {
    params,
  });
}

// 核实货件计划核实按钮
export async function planVerifySubmit(data: API.IParams) {
  return request('/api/mws/shipment/plan/verify/submit', {
    method: 'POST',
    data,
  });
}

// 撤销已核实货件
export async function untoVerify(data: API.IParams) {
  return request('/api/mws/shipment/plan/verify/cancel/submit', {
    method: 'POST',
    data,
  });
}

// 货件计划核实商品页面
export async function planVerifyPageInitData(params: API.IParams) {
  return request('/api/mws/shipment/plan/verify', {
    params,
  });
}


// 货件处理页面初始化接口
export async function planHandlePageInitData(params: API.IParams) {
  return request('/api/mws/shipment/plan/pretreatment', {
    params,
  });
}

// 已有的shipment列表  
export async function shipmentList(params: API.IParams) {
  return request('/api/mws/shipment/plan/shipment/list', {
    params,
  });
}

// 关联已有的shipment
export async function associatShipment(params: API.IParams) {
  return request('/api/mws/shipment/plan/update/product', {
    method: 'POST',
    params,
  });
}

// 确认生成Shipment
export async function createShipment(data: API.IParams) {
  return request('/api/mws/shipment/plan/generate/shipment', {
    method: 'POST',
    data,
  });
}
