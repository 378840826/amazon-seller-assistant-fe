/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-22 11:48:22
 * @LastEditTime: 2021-04-23 16:03:01
 */
import Mock from 'mockjs';

const random = Mock.Random;

export default {
  'POST /api/mws/shipment/entity/list': Mock.mock({
    code: 200,
    data: {
      page: {
        current: 2,
        size: 50,
        total: 999,
        page: 40,
        records: [
          {
            'id': '1427518284523413506',
            'shipmentState': 'WORKING',
            'mwsShipmentId': 'FBA16CG5GXTW',
            'shipmentName': 'FBA（08/16/21 23:30 PM) -1',
            'shipmentId': '2021081714301427518074967597058',
            'invoiceId': '',
            'countryCode': 'US',
            'storeName': 'EnPoint',
            'destinationFulfillmentCenterId': 'TEB9',
            'shippingType': '物流名称- 测试',
            'shippingId': '1111111',
            'trackingId': '222222222222',
            'casesRequired': '原厂包装',
            'labelingType': '卖家',
            'packageLabelType': '未上传',
            'referenceId': '同步中',
            'mskuNum': 1,
            'declareNum': '17',
            'issuedNum': '0',
            'receivedNum': '0',
            'disparityNum': '17',
            'userId': '1272878051107381250',
            'userName': '测试',
            'gmtCreate': '2021-08-25T20:45:11+08:00',
            'receivingTime': null,
            'gmtModified': '2021-08-26T12:41:02+08:00',
            'isGenerateInvoice': false,
            'zipUrl': null,
          },
          {
            'id|1-9999': 1,
            'shipmentState|1': ['working', 'shipped', 'receiving'],
            'mwsShipmentId|1-30': '',
            'shipmentName|1-20': '',
            'shipmentId|1-20': '',
            'invoiceId|1-20': '',
            'countryCode|1-20': '',
            'storeName|1-20': '',
            'destinationFulfillmentCenterId|1-20': '',
            'shippingType': '海派',
            'shippingId|1-20': '',
            'trackingId|1-20': '',
            'casesRequired|1-20': '',
            'labelingType|1-20': '',
            'packageLabelType|1-20': '',
            'referenceId|1-20': '',
            'mskuNum|1-9999': 1,
            'declareNum|1-9999': 1,
            'issuedNum|1-9999': 1,
            'receivedNum|1-9999': 1,
            'disparityNum|1-9999': 1,
            'userId|1-99': '',
            'userName': random.cname(),
            'gmtCreate': random.datetime(),
            'receivingTime': random.datetime(),
            'gmtModified': random.datetime(),
          },
        ],
      },
    },
  }),

  'POST /api/mws/shipment/plan/update/state': Mock.mock({
    code: Math.random() > 0.5 ? 200 : 500,
    message: '成功或者失败',
  }),

  'POST /api/mws/shipment/plan/update/itemList': Mock.mock({
    code: 200,
    message: '成功',
  }),

  'POST /api/mws/shipment/plan/getTransportContent': Mock.mock({
    code: Math.random() > 0.5 ? 200 : 200,
    message: '成功或者失败',
    'data|20': [
      {
        'id|1-9999': 1,
        'amazonReferenceId|1-10': 1,
      },
    ],
  }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'GET /api/mws/shipment/plan/get/itemList': (_: Request, res: any) => {
    setTimeout(() => {
      res.send(Mock.mock({
        code: 200,
        data: {
          'isGenerateInvoice': true,
          'shipmentStatus|1': 'working',
          'mwsShipmentId': 'ShipmentID',
          'shipmentName|1-10': '',
          'shipmentId|1-10': '',
          'invoiceId': 'FH79214112',
          'countryCode': 'US-美国',
          'storeName': 'Shopname1',
          'warehouseDe': 'FBA',
          'destinationFulfillmentCenterId': 'YTQE',
          'shippingType': '海派',
          'shippingId|1-9999': 1,
          'trackingId|1-9999': 1,
          'areCasesRequired': '原厂包装',
          'labelingType': '原厂',
          'addressLine1': '广东省广州市红风创意园8栋101',
          'referenceId|1-10': '',
          'mskuNum|1-9999': 1,
          'declareNum|1-9999': 1,
          'issuedNum|1-9999': 1,
          'receivedNum|1-9999': 1,
          'disparityNum|1-9999': 1,
          'userId|1-9999': 1,
          'userName': random.cname(),
          'gmtCreate': random.datetime(),
          'receivingTime': random.datetime(),
          'gmtModified': random.datetime(),
          'txtUrl': random.url(),
          'productItemVos|72': [
            {
              'id|1-9999': 1, 
              'url': random.url(), 
              'itemName': random.paragraph(), 
              'asin1|10': '', 
              'sku|10': '', 
              'sellerSku|10': '', 
              'fnsku|10': '', 
              'declareNum|1-1000': 1, 
              'disparityNum|1-1000': 1, 
              'issuedNum|1-1000': 1, 
              'receiveNum|1-1000': 1, 
              'locationNo|1-10': [random.cname()],
              'mskuState': 'working',
            },
          ],
          'shipmentModifies|1-100': [
            {
              'userId|1-10000': 1,
              'username': random.cname(),
              'gmtCreate': random.datetime(),
              'modifyText': random.paragraph(),
            },
          ],
        },
      }));
    }, 1000);
  },

  'POST /api/mws/shipment/entity/generate/invoice': Mock.mock({
    code: 200,
    data: [
      {
        id: '1427518284523413506',
        invoiceId: '新的发货单号',
      },
    ],
  }),

  
  'POST /api/mws/shipment/plan/packageLabels/upload': {
    code: 200,
    data: '/new-url',
    message: '成功',
  },
};
