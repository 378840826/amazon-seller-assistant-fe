/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-03-16 10:13:51
 * @LastEditTime: 2021-04-23 17:12:30
 */
import Mock from 'mockjs';

const random = Mock.Random;

export default {
  'POST /api/mws/shipment/list': Mock.mock({
    code: 200,
    data: {
      total: 1000,
      pages: 50,
      current: 2,
      size: 50,
      'records|20': [{
        'id|1-999999': 1, 
        'userName': random.cname(),
        'declareSum|1-999': 1, 
        'verifySum|1-999': 1, 
        'disparitySum|1-999': 1, 
        'pstate|1': ['未处理', '已处理'], 
        'shipmentId|1-999': 1, 
        'mwsShipmentId': ['33333333333333333', '4444444444'],
        'invoiceId': ['1111111', '22222222222222222222'],
        'countryCode': 'US',
        'storeId|1-999': 1, 
        'storeName': random.string(), 
        'warehouseDe': random.string(),
        'shippingType|1': ['海运', '空运', '海派', '空派'],
        'remarkText': random.string(),
        'gmtCreate': random.datetime(),
        'gmtModified': random.datetime(),
        'verifyType': random.boolean,
        'state': random.boolean,
      }],
    },
  }),

  'POST /api/mws/shipment/plan/state': Mock.mock({
    code: Math.random() > 0.2 ? 200 : 500,
    message: random.string(),
  }),

  'GET /api/mws/shipment/product/list': Mock.mock({
    code: 200,
    'data|1-999': [
      {
        'url': random.url(),
        'itemName|1-200': '',
        'asin1|10-12': '',
        'sellerSku|10-12': '',
        'sku|10-12': '',
        'fnsku|10-12': '',
        'available|1-9999': 1,
        'price|1-9999': 1,
      },
    ],
  }),

  'POST /api/mws/shipment/destination/warehouse/list': Mock.mock({
    code: 200,
    'data|1-200': [
      {
        'id|1-10': '',
        'name|1-10': '',
        'addressLine1|1-10': '',
        'type|1-10': '',
      },
    ],
  }),
  'GET /api/mws/shipment/start/warehouse/list': Mock.mock({
    code: 200,
    'data|1-200': [
      {
        'id|1-10': '',
        'name|1-10': '',
        'addressLine1|1-10': '',
        'type|1-10': '',
      },
    ],
  }),

  'GET /api/mws/shipment/get/shipping': Mock.mock({
    code: 200,
    'data': ['空运', '海运', '海派', '空派'],
  }),

  'POST /api/mws/shipment/create': Mock.mock({
    code: Math.random() > 0.2 ? 200 : 500,
    message: random.string(),
  }),
  
  'GET /api/mws/shipment/plan': Mock.mock({
    code: 200,
    data: {
      'id|1-100000': 0,
      'userName': random.cname(),
      'shipmentId|1-10': '',
      'mwsShipmentId': ['33333333333333333', '4444444444'],
      'invoiceId': ['1111111', '22222222222222222222'],
      'countryCode|2': '',
      'storeName|1-20': '',
      'warehouseDe|1-20': '',
      'shippingType': 'FBA',
      'labelingType|1-20': '',
      'addressLine1|1-20': '',
      'gmtCreate': random.datetime(),
      'gmtModified': random.datetime(),
      'areCasesRequired|1': true,
      'verifyType|1': true,
      'state|1': true,
    },
  }),
};
