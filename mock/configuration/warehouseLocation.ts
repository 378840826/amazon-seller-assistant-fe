/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:56:43
 * @LastEditTime: 2021-02-23 17:16:11
 * 
 * 仓库地址
 */
import Mock from 'mockjs';
const r = Mock.Random;
const code = Math.floor(Math.random() * 10) > -1 ? 200 : 500; 

export default {
  'POST /api/mws/shipment/warehouse/create': Mock.mock({
    code,
    message: '创建..',
  }),

  'GET /api/mws/shipment/warehouse/list': Mock.mock({
    code: 200,
    'data|1-20': [
      {
        'id|1-99999': 1,
        'userId': 1,
        'stores|1-20': [
          {
            'marketplace': 'veniam',
            'storeName': 'Lorem ',
            'id': 'elit nulla',
          },
        ],
        'name|1-30': '',
        'type': '国外自营仓',
        'countryCode': r.region(),
        'stateOrProvinceCode': r.city(),
        'districtOrCounty': r.county(),
        'addressLine1': r.cparagraph(1, 10),
        'postalCode': r.zip(),
        'gmtCreate': r.date('yyyy-MM-dd HH:mm:ss'),
        'gmtModified': r.date('yyyy-MM-dd HH:mm:ss'), 
        'state': 'enabled',
        'username': r.cname(),
        'addressLine2': null,
      },
    ],
  }),

  'POST /api/mws/shipment/warehouse/update/state': Mock.mock({
    code,
    message: '修改仓库开关',
  }),
};

