/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-05-29 10:29:40
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-07-06 15:05:19
 * @FilePath: \amzics-react\src\services\orderList.ts
 * 订单列表API
 */ 
import request from '@/utils/request';

export async function getOrderLists(params: { headersParams: {} }) {
  return request('/api/mws/order/list', {
    params,
    data: { headersParams: params.headersParams },
  });
}

// eslint-disable-next-line
export async function Test(data: any) {
  return request('/api/system/user/login', {
    method: 'POST',
    data,
  });
}
