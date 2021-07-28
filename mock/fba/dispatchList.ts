/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-20 09:44:39
 * @LastEditTime: 2021-04-21 17:39:44
 * 
 * 发货单
 */
import Mock from 'mockjs';

const random = Mock.Random;

export default {
  'POST /api/mws/invoice/list': Mock.mock({
    code: 200,
    data: {
      page: {
        current: 2,
        size: 50,
        total: 1000,
        pages: 2,
        'records|5-20': [
          {
            'id|1-9999': 1,
            'state|1': ['待配货', '已配货', '已发货'],
            'invoiceId': 'FH79214112',
            'warehouse': '国内2号仓',
            'warehouseDe': 'FBA',
            'destinationFulfillmentCenterId': 'YTQE',
            'mwsShipmentId': 'ShipmentID',
            'countryCode': 'US-美国',
            'storeName': 'Shopname1',
            'mskuNum|1-9999': 1,
            'issuedNum|1-9999': 1,
            'receivedNum|1-9999': 1,
            'disparityNum|1-9999': 1,
            'printingState|1': ['已打印', '未打印'],
            'shippingType': '海派',
            'shippingId|1-9999': 1,
            'trackingId|1-9999': 1,
            'userId|1-9999': 1,
            'username': random.cname(),
            'gmtCreate': random.datetime(),
            'gmtModified': random.datetime(),
            'distributionTime': random.datetime(),
            'deliveryTime': random.datetime(),
            'remarkText|1-99': '',
          },
        ],
      },
    },
  }),

  'POST /api/mws/invoice/update/state': Mock.mock({
    code: Math.random() > 0.5 ? 200 : 500,
    message: '成功或者失败',
  }),

  'POST /api/mws/invoice/update': Mock.mock({
    code: 200,
    message: '修改成功',
  }),

  'GET /api/mws/invoice/entity': Mock.mock({
    code: 200,
    data: {
      'id|1-9999': 1, 
      'state|1': ['待配货', '已配货', '已发货'],
      'invoiceId': 'FH79214112',
      'warehouse': '国内2号仓',
      'warehouseDe': 'FBA',
      'destinationFulfillmentCenterId': 'YTQE',
      'mwsShipmentId|1-9999': 1,
      'countryCode': 'US-美国',
      'storeName': 'storeName-1',
      'shippingType': '海派',
      'shipmentId|1-9999': 1,
      'shippingId|1-9999': 1,
      'trackingId|1-9999': 1,
      'casesRequired': '原厂包装',
      'labelingType': '原厂',
      'warehouseName': '国内2号仓',
      'addressLine1': '广东省广州市红风创意园8栋101',
      'printingState': '已打印',
      'userName': random.cname(),
      'gmtCreate': random.datetime(),
      'gmtModified': random.datetime(),
      'estimatedTime': random.datetime(),
      'remarkText': random.datetime(),
      'productItemVos|1-20': [
        {
          'id|1-9999': 1, 
          'url': random.url(), 
          'itemName': random.paragraph(), 
          'asin1|10': '', 
          'sku|10': '', 
          'sellerSku|10': '', 
          'fnsku|10': '', 
          'issuedNum|1-1000': 1, 
          'receiveNum|1-1000': 1, 
          'disparityNum|1-1000': 1, 
          'locationNo|1-10': [random.cname()],
        },
      ],
      'shipmentModifies|1-20': [
        {
          'userId|1-10000': 1,
          'username': random.cname(),
          'gmtCreate': random.datetime(),
          'modifyText': random.paragraph(),
        },
      ],
    },
  }),
};
