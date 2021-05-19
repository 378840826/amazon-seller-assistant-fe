/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-21 11:55:36
 * @LastEditTime: 2021-04-21 14:34:02
 */

import Mock from 'mockjs';

const random = Mock.Random;

export default {
  'GET /api/mws/shipment/marketplace/list': Mock.mock({
    code: 200,
    'data|1-100': [random.cname()],
  }),
};
