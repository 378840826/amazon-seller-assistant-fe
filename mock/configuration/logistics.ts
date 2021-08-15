/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:56:43
 * @LastEditTime: 2021-04-27 10:36:54
 * 
 * 仓库地址
 */
import Mock from 'mockjs';
const r = Mock.Random;
const code = Math.floor(Math.random() * 10) > -1 ? 200 : 500; 

export default {
  'POST /api/mws/shipment/shipping/create': Mock.mock({
    code,
    message: '创建..',
  }),

  'GET /api/mws/shipment/shipping/list': Mock.mock({
    code: 200,
    'data|1-20': [
      {
        'id|1-99999': 1,
        'userId': 1,
        'username': r.cname(),
        'name': r.string(),
        'providerName': '申通快递',
        'forwarderName': r.region(),
        'countryCode': r.city(),
        'chargeType': r.county(),
        'volumeWeight': r.cparagraph(1, 10),
        'postalCode': r.zip(),
        'gmtCreate': r.date('yyyy-MM-dd HH:mm:ss'),
        'gmtModified': r.date('yyyy-MM-dd HH:mm:ss'), 
        'state': 'enabled',
      },
    ],
  }),

  'POST /api/mws/shipment/shipping/delete': Mock.mock({
    code,
    message: '删除物流',
  }),

  'POST /api/mws/shipment/location/update/state': Mock.mock({
    code,
    message: '修改物流开关',
  }),
  
  'POST /api/mws/shipment/shipping/update': Mock.mock({
    code,
    message: '修改物流信息',
  }),
};

