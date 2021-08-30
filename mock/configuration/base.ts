/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:56:43
 * @LastEditTime: 2021-02-20 15:40:30
 */
import Mock from 'mockjs';

export default {
  'GET /api/mws/shipment/store/list': Mock.mock({
    code: 200,
    'data|1-100': [{
      'id|1-20': '',
      'storeName|1-30': '',
    }],
  }),
};

