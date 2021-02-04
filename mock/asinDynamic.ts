import { delay } from 'roadhog-api-doc';
import Mock from 'mockjs';
import json from './data.js';
const random = Mock.Random;

const listData = {
  'id|+1': 2003,
  monitoringSwitch: random.boolean(),
  updateTime: '2020-11-22 09:09:09',
  monitoringNumber: 39,
  currentRanking: 87,
  lastRanking: 98,
  rise: random.boolean(),
  image: random.image(),
  title: '就是独领风骚的肌肤两地分居的身份风急浪大封建势力的开发建设',
  titleLink: 'https://www.baidu.com',
  asin: 'hfjskdjf',
  brandName: 'apple juice',
  sellerName: 'ranking in your eyes',
  'deliveryMethod|1': ['FBA', 'FBM', 'Amazon'],
  price: 89,
  priceChange: -2,
  categoryName: 'apple is my favorite food',
  ranking: 8,
  rankingChange: 10,
  reviewAvgStar: 5.0,
  reviewScoreChange: 23,
  reviewCount: 99,
  reviewCountChange: 877,
  usedNewSellNum: 100,
  variantNum: 33,
  dateFirstListed: '2093-93-90 23:34:35',
  acKeyword: 'apple air',
  relatedKeywords: 'apple mac',
};
const proxy = {
  //asin动态汇总列表
  'POST /api/mws/asin-dynamic/summary-list': Mock.mock({
    code: 200,
    data: {
      updateTime: random.date(),
      page: {
        total: 400,
        current: 2,
        'size|1': [20, 50, 100],
        pages: 200,
        
        'records|1-20': [
          {
            collectionTime: random.date(),
            productInfo: {
              imgLink: random.image(),
              title: random.sentence(1, 100),
              titleLink: 'https://www.baidu.com',
              asin: 'abc2019',
            },
            'skuList|1-10': ['ascfjdkfj'],
            changeInfo: 'changeInfo返回的detail的值',
            'oldValue|1-10': [random.image()],
            'newValue': '我是新值',
            'changeType': 'changeImage',
            /* 'changeType|1':['changeTitle','changeImage','changeDeal','changeCoupon',
            'changeStock','changeAc','changeBuybox','changeSerllerQt','changeFulc',
            'changeNR','changeBS','changeAddItem','changeBP','changeCategory','changeQA',
            'changeProm','changeDescription','changeEBCImg','changeVideo','changeReview',
            'changeVariants','changeBundle','changeFBT'
          ] */
          },
        ],
      },
      
    },
  }),
  //asin动态监控设定列表
  'GET /api/mws/asin-dynamic/monitoring-settings/list': Mock.mock({
    code: 200,
    data: {
      total: 9999,
      current: 20,
      'size|1': [20, 50, 100],
      pages: 200,
      'records|1-20': [
        {
          'monitoringSwitch': random.boolean(),
          'updateTime': random.date(),
          'productInfo': {
            asin: 'asinxxxx',
            imgLink: random.image(),
            title: random.sentence(),
            titleLink: 'https://www.baidu.com',
            'fulfillmentChannel|1': ['FBA', 'FBM', 'Amazon'],
            price: 20,
          },
          monitoringNumber: random.integer(),
        },
      ],
    },
  }),
  //asin或者title模糊匹配
  'GET /api/mws/asin-dynamic/monitoring-settings/search': Mock.mock({
    code: 200,
    'data': [{
      asin: 'xiongyang wo wangji',
      title: 'miss you in the before',
    }, {
      asin: 'haha',
      title: 'i am in the sea',
    }],
  }),
  //添加asin
  'POST /api/mws/asin-dynamic/monitoring-settings/add-asin': Mock.mock({
    code: 200,
    message: '添加失败',
  }),
  //监控开关
  'POST /api/mws/asin-dynamic/monitoring-settings/switch': Mock.mock({
    code: 200,
    message: '不允许，正在开始中',
  }),
  //asin动态页面的变化数据
  'POST /api/mws/asin-dynamic/list': Mock.mock({
    code: 200,
    data: {
      total: 200,
      current: 20,
      'size|1': [20, 50, 100],
      'pages': 100,
      'records|1-20': [{
        collectionTime: random.date(),
        changeInfo: '图片等等的变化',
        'changeType': 'changeImage',
        'oldValue|1-10': [random.image()],
        'newValue': '我是新值',
        'id|+1': 0,
        remarks: 'aaa',
      }],
    },
  }),
  //
  'GET /api/mws/asin-overview/getAsinOrSku': Mock.mock({
    code: 200,
    data: {
      asin: '123989jjj',
    },
  }),
  'GET /api/mws/asin-overview/asin-list': Mock.mock({
    code: 200,
    data: [],
  }),
  //
  'POST /api/mws/asin-dynamic/polyline-list': Mock.mock(() => {
    return json.data1;
  }),
  /* 'POST /api/mws/asin-dynamic/polyline-list': Mock.mock({
    code: 200,
    data: {
      polylineResult: {},
      categoryRanking: {},
      listingChangeVo: [],
      'updateTime': '2019-10-01',
    },
  }), */
  //备注修改
  'POST /api/mws/asin-dynamic/list/update-remarks': Mock.mock({
    code: 200,
    message: '修改成功',
  }),
  //============搜索排名监控==============
  'POST /api/mws/search-ranking/monitoring-settings/list': Mock.mock({
    code: 200,
    data: {
      remainingTasksNumber: 39,
      page: {
        total: 200,
        current: 89,
        size: 20,
        pages: 888,
        'asc': random.boolean(),
        'order|1': ['updateTime', 'naturalRanking', 'advertisingRanking'],
        'records|1-20': [{
          'id|+1': 0,
          monitoringSwitch: random.boolean(),
          updateTime: random.date(),
          monitoringNumber: 90,
          productInfo: {
            imgLink: random.image(),
            title: random.sentence(),
            titleLink: 'https://www.baidu.com',
            asin: 'fjkdsfj',
          },
          'skuInfo|1-5': [{
            sku: 'asin1,asin2',
            'skuStatus|1': ['Inactive', 'Incompleted', 'deleted', ''],
          }],
          keyword: random.title(),
          searchVolume: random.integer(),
          searchResultsNumber: random.integer(),
          naturalRankingData: {
            ranking: 10,
            pages: 3,
            rankingChange: 2,
          },
          advertisingRankingData: {
            ranking: 10,
            pages: 3,
            rankingChange: 2,
          },
          isAc: random.boolean(),
          onceIsAc: random.boolean(),
          ratio: random.integer(),
        }],
      },
    },
  }),
  'GET /api/mws/search-ranking/monitoring-settings/frequency': Mock.mock({
    code: 200,
    data: {
      frequency: 1,
    },
  }),
  'GET /api/mws/search-ranking/monitoring-settings/frequency-update': Mock.mock({
    code: 200,
    message: '修改成功',
  }),
  'GET /api/mws/search-ranking/monitoring-settings/asin-list': Mock.mock({
    code: 400,
    data: {
      asinList: ['apple', 'banana', 'juice'],
    },
  }),
  'POST /api/mws/search-ranking/monitoring-settings/asin-update': Mock.mock({
    code: 200,
    message: '修改成功',
  }),
  'POST /api/mws/search-ranking/monitoring-settings/natural-data': Mock.mock({
    code: 200,
    data: [['2020-01-02', 10, 2, true], ['2020-01-03', 10, 2, false], ['2020-01-04', 10, 2, true], ['2020-01-05', 10, 2, false], ['2020-01-06', 10, 2, true]],
  }),
  'POST /api/mws/search-ranking/monitoring-settings/advertising-data': Mock.mock({
    code: 200,
    data: [['2020-01-02', 10, 2], ['2020-01-03', 10, 2], ['2020-01-04', 10, 2], ['2020-01-05', 10, 2], ['2020-01-06', 10, 2]],
  }),
  'POST /api/mws/search-ranking/monitoring-settings/update-status': Mock.mock({
    code: 200,
    message: '修改成功',
  }),
  'GET /api/mws/search-ranking/monitoring-settings/search-product': Mock.mock({
    code: 200,
    'data|1000-3000': [{
      imgLink: random.image(),
      title: random.title(),
      'asin|+1': 100,
      titleLink: 'https://www.baidu.com',
      'skuInfo|1-3': [{
        sku: 'apple in the kitchen',
        'skuStatus|1': ['Inactive', 'Incompleted', 'deleted', ''],
      }],
    }],
  }),
  'POST /api/mws/search-ranking/monitoring-settings/search-keyword': Mock.mock({
    code: 200,
    data: {
      keywordList: ['asin', 'fdskfjdkfjdsf', 'fjdksfjdslkfjds', 'fjkdsfjkdsjf'],
    },
  }),
  'GET /api/mws/search-ranking/monitoring-settings/add': Mock.mock({
    code: 200,
    message: '成功',
  }),
  //监控设定频率按钮
  'GET /api/mws/competitive-products/monitoring-settings/frequency': Mock.mock({
    code: 200,
    data: {
      frequency: 7,
    },
  }),
  //监控频率修改
  'GET /api/mws/competitive-products/monitoring-settings/frequency-update': Mock.mock({
    code: 200,
    message: '成功',
  }),

  //竞品监控列表
  'POST /api/mws/competitive-products/monitoring-settings/list': Mock.mock({
    code: 200,
    data: {
      page: {
        total: random.integer(),
        current: 1,
        size: 20,
        pages: 200,
        order: '',
        asc: '',
        'records|1-30': [listData],
      },
      myProductData: {
        /*  ...listData,
        pullTime: '2020-01-22',
        lastPullTime: '2020-01-21', */
      },
    },
  }),
  //ac关键词列表
  'POST /api/mws/competitive-products/monitoring-settings/ac-data': Mock.mock({
    code: 200,
    data: [['2020-01-05', '我是否i收到福建省地方哦福建省地方就是的'],
      ['2020-01-05', '我是否i收到福建省地方哦福建省地方就是的'],
      ['2020-01-05', '我是否i收到福建省地方哦福建省地方就是的'],
    ],
  }),
  //价格折线图
  'POST /api/mws/competitive-products/monitoring-settings/price-data': Mock.mock({
    code: 200,
    data: [['2020-01-01', 15], ['2020-01-02', ''], ['2020-01-03', ''], ['2020-01-04', 0], ['2020-01-05', 6]],
  }),
  //排名曲线图
  'POST /api/mws/competitive-products/monitoring-settings/ranking-data': Mock.mock({
    code: 200,
    data: [['2020-01-01', 15], ['2020-01-02', 0], ['2020-01-03', 15], ['2020-01-04', 0], ['2020-01-05', 6]],
  }),
  //review评分折线图
  'POST /api/mws/competitive-products/monitoring-settings/score-data': Mock.mock({
    code: 200,
    data: [['2020-01-01', 15], ['2020-01-02', 0], ['2020-01-03', 15], ['2020-01-04', 0], ['2020-01-05', 6]],
  }),
  //review数折线图
  'POST /api/mws/competitive-products/monitoring-settings/count-data': Mock.mock({
    code: 200,
    data: [['2020-01-01', 15], ['2020-01-02', 0], ['2020-01-03', 15], ['2020-01-04', 0], ['2020-01-05', 6]],
  }),
  //修改任务状态
  'POST /api/mws/competitive-products/monitoring-settings/update-status': Mock.mock({
    code: 200,
    message: '修改成功',
  }),
  'POST /api/mws/competitive-products/monitoring-settings/suggest-asin': Mock.mock({
    code: 200,
    'data|1-20': [{
      image: random.image(),
      title: 'apple in your',
      titleLink: 'https://www.baidu.com',
      'asin|+1': 1001,
      price: 89,
      reviewAvgStar: '4.5',
      reviewCount: 8,
      ranking: 3,
    }],
  }),
  'POST /api/mws/competitive-products/monitoring-settings/add-asin': Mock.mock({
    code: 200,
    message: '成功',
  }),
};
export default delay(proxy, 100);
