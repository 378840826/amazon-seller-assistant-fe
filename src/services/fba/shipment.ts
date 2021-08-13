/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-19 09:05:18
 * @LastEditTime: 2021-04-23 15:06:51
 * 
 * Shipment
 */

import request from '@/utils/request';

// 请求shipment列表
export async function getShipmentList(data: API.IParams) {
  return request('/api/mws/shipment/entity/list', {
    method: 'POST',
    data,
  });
}

// 修改shipment - 同步ReferenceID
export async function getRefereceid(data: API.IParams) {
  return request('/api/mws/shipment/plan/getTransportContent', {
    method: 'POST',
    data,
  });
}

// 修改shipment - 修改名称、物流方式、商品
export async function updateShipmentItem(data: API.IParams) {
  return request('/api/mws/shipment/plan/update/itemList', {
    method: 'POST',
    data,
  });
}

// 修改shipment - 批量标记出运或取消
export async function updateShipment(data: API.IParams) {
  return request('/api/mws/shipment/plan/update/state', {
    method: 'POST',
    data,
  });
}

// 生成发货单
export async function generateInvoice(data: API.IParams) {
  return request('/api/mws/shipment/entity/generate/invoice', {
    method: 'POST',
    data,
  });
}

// shipment详情
export async function getShipmentDetails(params: API.IParams) {
  return request('/api/mws/shipment/plan/get/itemList', {
    params,
  });
}

// 上传物流信息
export async function uploadLogisticisInfo(data: API.IParams) {
  return request('/api/mws/shipment/plan/putTransportContent', {
    method: 'POST',
    data,
  });
}

// 上传装箱清单文件
export async function uploadPackageFile(data: API.IParams) {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('packagesNum', data.packagesNum); 
  return request('/api/mws/shipment/plan/packageLabels/upload', {
    method: 'POST',
    data: formData,
  });
}
