/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:48:36
 * @LastEditTime: 2021-02-20 14:49:40
 */

import request from '@/utils/request';

// 请求店铺列表
export async function getShops(params: API.IParams) {
  return request('/api/mws/shipment/store/list', {
    params,
  });
}
