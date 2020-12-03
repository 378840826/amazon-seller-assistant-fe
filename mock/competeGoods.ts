import Mock from 'mockjs';

const r = Mock.Random;

export default {
  'GET /api/cp1': Mock.mock({
    code: 200,
    data: {
      'title|10-200': '',
      'asin': 'B00IG34VFS',
      'sku|15': '',
      link: r.url(),
      imgLink: r.image(),
      'recommend|2': [
        {
          imgUrl: r.image(),
          'title|20-100': '',
          'asin|12': '',
          'brand|5-30': '',
          'reviewNum|1-999': 1,
          'reviewScope|1-5': 1,
          'categoryRank|1-9999': 1,
          'sellerName|1-30': '',
          'price|1-9998': 1,
          fulfillmentChannel: 'fbm',
        },
      ],
      'chosen|2': [
        {
          imgUrl: r.image(),
          'title|20-100': '',
          'asin': 'B01FHCDWDW',
          'brand|5-30': '',
          'reviewNum|1-999': 1,
          'reviewScope|1-5': 1,
          'categoryRank|1-9999': 1,
          'sellerName|1-30': '',
          'price|1-9998': 1,
          fulfillmentChannel: 'fbm',
        },
      ],
    },
  }),
};
