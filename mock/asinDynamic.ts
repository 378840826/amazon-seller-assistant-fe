import { delay } from 'roadhog-api-doc';
import Mock from 'mockjs';
import json from './data.js';
const random = Mock.Random;
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
  'GET /api/mws/search-ranking/monitoring-settings/search-keyword': Mock.mock({
    code: 200,
    data: {
      keywordList: ['asin', 'fdskfjdkfjdsf', 'fjdksfjdslkfjds', 'fjkdsfjkdsjf'],
    },
  }),
  'GET /api/mws/search-ranking/monitoring-settings/add': Mock.mock({
    code: 200,
    message: '成功',
  }),
};
export default delay(proxy, 3000);
