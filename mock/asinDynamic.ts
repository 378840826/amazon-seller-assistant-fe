import { delay } from 'roadhog-api-doc';
import Mock from 'mockjs';
import json from './data.js';
const random = Mock.Random;
const proxy = {
  //asin动态汇总列表
  'POST /api/mws/asin-dynamic/summary-list': Mock.mock({
    code: 200,
    data: {
      total: 400,
      current: 2,
      'size|1': [20, 50, 100],
      pages: 200,
      updateTime: random.date(),
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
  //备注修改
  'POST /api/mws/asin-dynamic/list/update-remarks': Mock.mock({
    code: 200,
    message: '修改成功',
  }),
};
export default delay(proxy, 1000);
