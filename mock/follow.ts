import Mock from 'mockjs';

const r = Mock.Random;

export default {
  'GET /api/mws/follow/asin-complete': Mock.mock({
    code: 200,
    'data|1-50': [
      {
        'asin|10': '',
        'title|5-200': '',
      },
    ],
  }),

  'POST /api/mws/follow/monitor/add-asin': Mock.mock({
    code: 200,
    'data|1-50': [
      {
        'asin|10': '',
        'title|5-200': '',
      },
    ],
  }),

  'GET /api/mws/follow/monitor/reminder': Mock.mock({
    code: 200,
    data: {
      'id|9-30': 0,
      'storeId|9-30': 0,
      'optFollowSeller|1': true,
      'optAmazon|1': true,
      'optFbaSeller|1': true,
      'optFbmSeller|1': true,
      'sellerIds|10-30': 0,
      'optFollowSellerQuantity|1': true,
      'followSellerQuantity|1-10': 0,
      'optBuyboxSellerNotMe|1': true,
    },
  }),

  'POST /api/mws/follow/monitor/reminder-setting': Mock.mock({
    code: 200,
    message: '成功',
  }),

  'POST /api/mws/follow/monitor/switch': Mock.mock({
    code: 200,
    message: '成功',
  }),

  'GET /api/mws/follow/monitor/frequency': Mock.mock({
    code: 200,
    data: {
      'id|9999-9999900': 1,
      'storeId|9999-9999900': 1,
      startTime: '13:00',
      endTime: '17:00',
      frequency: 180,
    },
  }),

  'POST /api/mws/follow/monitor/frequency-setting': Mock.mock({
    code: 200,
    message: '成功',
  }),

  'GET /api/mws/follow/monitor/list': Mock.mock({
    code: 200,
    data: {
      'total|1-5000': 1,
      'size': 20,
      'current|1-20': 1,
      pages: 1,
      'records|0-20': [
        {
          'id|9999-999999': 1,
          'monitorSwitch|1': true,
          'updateTime': new Date().toString(),
          productInfo: {
            asin: 'B15Q789YR',
            imgUrl: null,
            'title|1-200': '',
            'price|1-999992': 1,
            fulfillmentChannel: 'FBM',
          },
          'monitorCount|1-99999998': 1,
          'currentBuybox|1': true,
          'currentFollow|1': true,
        },
      ],
    },
  }),

  'GET /api/mws/follow/history/list': Mock.mock({
    code: 200,
    data: {
      page: {
        'total': 100,
        'size': 20,
        'current': 1,
        pages: 1,
        'records|40': [
          {
            'id|9999-999999': 1,
            'snapshotTime': new Date(),
            'followQuantity|1-999992': 1,
            'buyboxSeller|1-30': '',
            'buyboxSellerLink': r.url('http'),
            'buyboxSellerId|1-999991': 1,
            buyboxFulfillmentChannel: 'FAB',
            'buyboxPrice|1-9999991': 1,
          },
        ],
      },
      productInfo: {
        'asin|10': '',
        imgUrl: r.image('80x80'),
        'title|5-200': '',
        'price|1-9999994': 1,
        fulfillmentChannel: 'FBM',
        'followMonitorId|1-9999994': 1,
      },
    },
  }),

  'GET /api/mws/follow/seller/list': Mock.mock({
    code: 200,
    data: {
      productInfo: {
        'asin|10': '',
        imgUrl: r.image('80x80'),
        'title|5-200': '',
        'price|1-9999994': 1,
        fulfillmentChannel: 'FBM',
        'followMonitorId|1-9999994': 1,
      },
      page: {
        'total|1-500': 1,
        'size': 20,
        'current|1': 1,
        pages: 1,
        'records|40': [
          {
            'id|9999-999999': 1,
            'snapshotTime': new Date(),
            'sellerName|1-30': '',
            'sellerLink': r.url('http'),
            'sellerId|1-999991': 1,
            'price|1-999992': 1,
            fulfillmentChannel: 'FAB',
            'productType|1-9999991': 1,
          },
        ],
      },
    },
  }),
};
