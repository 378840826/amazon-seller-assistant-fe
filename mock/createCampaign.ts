import Mock from 'mockjs';


const r = Mock.Random;

 
export default {
  'GET /api/gd/searchProduct': Mock.mock({
    code: 200,
    data: {
      'records|4': [
        {
          'asin|10': '',
          'sku|8-14': '',
          'title|1-256': '',
          'price|1-999996': 0,
          'reviewNum|1-999997': 0,
          'reviewStars|0-5': 0,
          'imgUrl': r.image('46X46'),
          'sellable|1-999998': 0,
          'ranking|1-999999': 0,
        },
      ],
    },
  }),

  'GET /api/ad/target/suggestedBrands': Mock.mock({
    code: 200,
    data: {
      'records|4': [
        {
          'brandId|1-9999': 0,
          'brandName|1-25': '',
        },
      ],
    },
  }),
};
