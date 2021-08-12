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

  'POST /api/gd/ad/group/suggestedKeywords': Mock.mock({
    code: 200,
    data: {
      'keywords': ['FBA', 'FBM', 'Amazon'],
    },
  }),

  
  'POST /api/gd/ad/group/suggestedCategories': Mock.mock({
    code: 200,
    data: {
      'categories|4': [{
        'categoryId|10': '',
        'categoryName|2-20': '',
        'path|20-30': '',
      }],
    },
  }),

  'POST /api/gd/ad/group/suggestedAsins': Mock.mock({
    code: 200,
    data: {
      'records|4': [{
        'asin|10': '',
        'sku|8-14': '',
        'title|1-256': '',
        'price|1-999996': 0,
        'reviewNum|1-999997': 0,
        'reviewStars|0-5': 0,
        'imgUrl': r.image('46X46'),
        'sellable|1-999998': 0,
        'ranking|1-999999': 0,
      }],
    },
  }),

  'POST /api/gd/ad/campaign/create': Mock.mock({
    code: 200,
    message: '创建成功',
  }),

  'POST /api/gd/ad/group/create': Mock.mock({
    code: 200,
    message: '创建成功',
  }),

  'GET /api/gd/ad/campaign/simpleList': Mock.mock({
    code: 200,
    'data|10': [{
      'name|10-30': '',
      'campaignId|8-14': '',
      'campaignType': 'sp',
      'targetingType|1': ['auto', 'manual'],
      // 'targetingType|1': ['auto'],
      'dailyBudget|2-20': 10,
      'budget|2-20': 10,
    }],
  }),
};
