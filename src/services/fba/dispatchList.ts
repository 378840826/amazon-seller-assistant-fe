/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-20 10:21:59
 * @LastEditTime: 2021-04-21 17:34:47
 * 
 * 发货单列表
 */
import request from '@/utils/request';

// 发货单列表
export async function getDispatchList(data: API.IParams) {
  return request('/api/mws/invoice/list', {
    method: 'POST',
    data,
  });
}

// 站点下拉列表
export async function getSites() {
  return request('/api/mws/shipment/marketplace/list');
}

// 修改配货、发货、作废
export async function updateDispatch(data: API.IParams) {
  return request('/api/mws/invoice/update/state', {
    method: 'POST',
    data,
  });
}

// 发货单详情
export async function getInvoiceDetail(params: API.IParams) {
  return request('/api/mws/invoice/entity', {
    params,
  });
}
