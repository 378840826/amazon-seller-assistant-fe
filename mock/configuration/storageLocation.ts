/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:56:43
 * @LastEditTime: 2021-02-24 15:40:48
 * 
 * 仓库地址
 */
import Mock from 'mockjs';
const r = Mock.Random;
const code = Math.floor(Math.random() * 10) > -1 ? 200 : 500; 

export default {
  'GET /api/mws/shipment/location/list': Mock.mock({
    code: 200,
    'data': {
      page: {
        'records|1-20': [
          {
            'id|1-99999': 1,
            'userId': 1,
            'username': r.cname(),
            'warehouseId': r.string(),
            'locationNo': 'B-12-2-3',
            'gmtCreate': r.date('yyyy-MM-dd HH:mm:ss'),
            'gmtModified': r.date('yyyy-MM-dd HH:mm:ss'), 
            'state': 'enabled',
            'sku|1-10': ['a'],
            'total|1-99999': 1,
            'isCustomize|1': true,
            'skus|1-5': ['skuskusku'],
          },
        ],
        current: 2,
        size: 50,
        'pages|1-9999': 1,
      },
    },
  }),

  'POST /api/mws/shipment/location/create': Mock.mock({
    code,
    message: '创建..',
  }),

  'POST /api/mws/shipment/location/update': Mock.mock({
    code,
    message: '修改..',
  }),

  'POST /api/mws/shipment/location/delete': Mock.mock({
    code,
    message: '删除..',
  }),
};

