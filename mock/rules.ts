import Mock from 'mockjs';


const r = Mock.Random;

export default {
  
  'GET /api/mws/nrule/adjust/history/rules': Mock.mock({
    status: 200,
    data: {
      'records|1-20': [{
        id: r.integer(),
        type: 'sell',
        name: r.string(),
        description: r.string(),
        timing: '14:20',
        productCount: r.integer(),
        system: r.boolean(),
        updateTime: '2020-11-25 10:30:27',
      }],
    },
  }),


  // nrule/setting/compete
  'GET /api/rule/setting/compete': Mock.mock({
    code: 200,
    'data': {
      'name|1-50': '',
      'description|1-150': '',
      'condition|1-10': {
        competePrice: 'min',
        action: 'down',
        unit: 'value',
        'value|1-999': 1,
      },
      safe: {
        'stockLeValue|1-888': 1,
        stockLeAction: 'max',
        gtMaxAction: 'max',
        ltMinAction: 'unchange',
      },
      'timing': '20',
    },
  }),

  // 竞品规则设定修改或添加
  'POST /api/nrule/setting/compete': Mock.mock({
    code: 200,
    msg: '设定成功',
  }),

  // buybox规则设定查询
  'GET /api/nrule/setting/buybox': Mock.mock({
    code: 200,
    'data': {
      'name|1-51': '',
      'description|1-153': '',
      self: {
        only: {
          action: 'max',
        },
        'unonly|1-10': [{
          me: 'fbm',
          lowest: 'fbm',
          operator: 'eq',
          myPrice: 'max',
          action: 'unchange',
          actionOperator: 'down',
          unit: 'value',
          'value|1-9998': 1,
        }],
      },
      'other|1-10': [{
        me: 'fbm',
        buybox: 'fbm',
        action: 'down',
        unit: 'value',
        'value|1-998': 1,
      }],
      'nobody|1-10': [{
        me: 'fbm',
        lowest: 'fbm',
        operator: 'lt',
        myPrice: 'max',
        action: 'max',
        actionOperator: 'down',
        unit: 'value',
        'value|1-999': 1,
        timing: '30',
      }],
      competitor: {
        'power|1': false,
        scope: 'include',
        shipping: ['FBA'],
        'sellerId|1-10': [r.string()],
      },
      safe: {
        'stockLeValue|1-955': 1,
        stockLeAction: 'max',
        gtMaxAction: 'max',
        ltMinAction: 'unchange',
      },
      timing: '30',
    },
  }),

  // 销售表现规则设定查询
  'GET /api/nrule/setting/sell': Mock.mock({
    code: 200,
    'data': {
      'name|1-51': '',
      'description|1-153': '',
      'conditions|2': [{
        type: 'session',
        period: '30',
        operator: 'lt',
        operatorUnit: 'multiple',
        'basis|1-999': 1,
        // 'basis': '88-99',
        rateTrend: 'downHasZero',
        rateUnit: 'value',
        'rateBasis|1-999': 1,
        action: 'down',
        unit: 'value',
        'value|1-999': 1,
      }],
      safe: {
        'stockLeValue|1-955': 1,
        stockLeAction: 'max',
        gtMaxAction: 'max',
        ltMinAction: 'unchange',
      },
      timing: '13:20',
    },
  }),
};
