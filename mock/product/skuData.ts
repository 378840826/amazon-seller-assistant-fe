/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-26 17:34:32
 * @LastEditTime: 2021-03-04 16:09:52
 */
import Mock from 'mockjs';
const r = Mock.Random;

export default {
  'GET /api/mws/shipment/sku/product/msku/list': Mock.mock({
    code: 200,
    'data|3-100': [
      {
        'sellerSku|10-15': '',
        'asin1|1-999': 1,
        'storeId|10': '',
      },
    ],
  }),

  'GET /api/mws/shipment/sku/product/list': Mock.mock({
    code: 200,
    data: {
      page: {
        current: 2,
        size: 20,
        total: 9999,
        pages: 111, 
        'records|20': [
          {
            'id|1-999': '',
            'userId|1-9199': '',
            'username': r.cname(),
            'locationNos|1-10': [
              {
                'id|1-999': 1,
                'locationNo': 'A-12-2-3', 
                'warehouseName': '中国广西南宁横县市', 
              },
            ],
            'imageUrl': r.image('42x42'),
            'pimageUrl': r.image('42x42'),
            'sku|10-12': '',
            'nameNa|1-10': '',
            'nameUs|1-10': '',
            'category': '品类',
            'customsCode|6': 0,
            'salesman': r.cname(),
            'state': '在售',
            'packingLong|0-1000': 0,
            'packingWide|0-1000': 0,
            'packingHigh|0-1000': 0,
            'packingType': 'inch',
            'packingWeight|1-100': 1,          
            'packingWeightType': 'pound',          
            'commodityLong|1-100': 1,          
            'commodityWide|1-100': 1,          
            'commodityHigh|1-100': 1,          
            'commodityType': 'inch',          
            'commodityWeight|1-100': 1,          
            'commodityWeightType': 'pound', 
            'packingMaterial': '金属', 
            'isFragile｜1': true, 
            'purchasingCost|1-999': 1, 
            'packagingCost|1-999': 1, 
            'price|1-999': 1, 
            'mskus|1-10': [
              {
                'sellerSku|10': '', 
                'asin1': 'asinasinasin', 
                'storeName': 'storeName', 
                'marketplace': 'UP', 
              },
            ],
            gmtCreate: '2021-03-02 12:00:53',
            gmtModified: '2021-03-02 12:00:53',
          },
        ],
      },
    },
  }),

  'POST /api/mws/shipment/sku/product/create': {
    code: 200,
    message: '成功',
  },
};

