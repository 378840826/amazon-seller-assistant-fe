import { delay } from 'roadhog-api-doc';
import Mock from 'mockjs';
const random = Mock.Random;

const proxy = {
  //邮件未读数
  'GET /api/mws/mail-assistant/receive-list/unread-number': Mock.mock({
    code: 200,
    data: {
      unReadNumber: random.integer(),
    },
  }),
  //邮件发送统计列表
  'GET /api/mws/mail-assistant/statistical-list': Mock.mock({
    code: 200,
    data: {
      total: 2000,
      'size|1': [20, 50, 100],
      current: 10,
      pages: random.integer(),
      'records|1-20': [
        {
          statisticalTime: random.date(),
          totalNumber: random.integer(1, 1000),
          automaticNumber: random.integer(1, 1000),
          manualNumber: random.integer(1, 1000),
          successNumber: random.integer(1, 1000),
          automaticSuccessNumber: random.integer(1, 1000),
          manualSuccessNumber: random.integer(1, 1000),
          failNumber: random.integer(1, 1000),
          automaticFailNumber: random.integer(1, 1000),
          manualFailNumber: random.integer(1, 1000),
          sendingNowNumber: random.integer(1, 1000),
          sendingNowAutomaticNumber: random.integer(1, 1000),
          sendingNowManualNumber: random.integer(1, 1000),
        },
      ],
    },
  }),
  //修改已读/未读/已回复/未回复
  'POST /api/mws/mail-assistant/receive-list/update': Mock.mock({
    code: 200,
    message: '成功',
  }),
  //收件箱邮件列表
  'POST /api/mws/mail-assistant/receive-list/list': Mock.mock({
    code: 200,
    data: {
      total: random.integer(1, 10000),
      current: 1,
      'size|1': [20, 50, 100],
      pages: random.integer(1, 10000),
      'records|1-20': [{
        'id|+1': 10,
        'receivingTime': random.date(),
        'hasReplied|1': true,
        'productInfo|1-4': [{
          'orderId|+1': 0,
          'imgLink': random.image(),
          'titleLink': 'https://www.baidu.com',
          'title': random.sentence(1, 100),
          'asin': 'B08C11KH6F',
          'sku': 'skuskuC11KH6F',
        }],
        'email': random.email(),
        'subject': random.sentence(1, 100),
        'hasRead|1': true,
        'content': random.sentence(),
        'countDown': 32945000,
      }],
    },
  }),
  //回复页面
  'GET /api/mws/mail-assistant/receive-list/reply-page': Mock.mock({
    code: 200,
    data: {
      'mailContent|1-20': [{
        'type|1': ['customer', 'me'],
        'time': random.datetime(),
        // 'content': '<h1>标题名称</h1><br/>',
        'content': '我是一只小小小小鸟，&nbsp;想要飞啊飞，却怎么也飞不高，<br/>我寻寻觅觅寻寻觅觅，一个温暖的怀抱',
        'status|1': ['success', 'fail'],
      }],
      'orderInfo': {
        'purchaseDate': random.datetime(),
        'orderId': random.integer(),
        'orderStatus|1': ['Shipped', 'Shipping', 'Pending', 'Cancelled'],
        'shipServiceLevel': 'Unshipped(FBA)',
        'actuallyPaid': random.integer(),
        'isBusinessOrder': random.integer(),
        'orderDetails|1-10': [{
          title: random.sentence(),
          asin: 'fdskfjdksfj',
          sku: 'Bfkdjsfks',
          quantity: random.integer(),
          unitPrice: random.integer(),
          imgLink: random.image(),
          titleLink: 'https://www.baidu.com',
          price: random.integer(),
          itemPromotionDiscount: random.integer(),
          shippingPrice: random.integer(),
          shipPromotionDiscount: random.integer(),
          'deliverStatus|1': ['Shipping', 'Shipped', 'Pending', 'Cancelled'],
          courierNumber: random.word(10),
          subTotal: random.integer(),
        }],
      },
      
    },
  }),
  
  //收件箱 - 模版列表
  'GET /api/mws/mail-assistant/receive-list/template': Mock.mock({
    code: 200,
    'data|1-20': [{
      'templateSubject': random.sentence(1, 100),
      'templateName': random.sentence(1, 10),
      'templateType': random.word(),
      'templateId|+1': 1,
    }],
  }),
  //模板载入
  'GET /api/mws/mail-assistant/receive-list/template-load': Mock.mock({
    code: 200,
    'data': {
      'subject': random.sentence(1, 100),
      'content': random.sentence(1, 10000),
    },
  }),
  //邮件提交
  'POST /api/mws/mail-assistant/receive-list/mail-submit': Mock.mock({
    code: 200,
    message: '提交成功',
  }),
  //发件列表
  'POST /api/mws/mail-assistant/send-list/list': Mock.mock({
    code: 200,
    data: {
      total: 1000,
      current: 5,
      'size|1': [20, 50, 100],
      pages: random.integer(),
      'records|1-20': [{
        'id|+1': 1,
        'sendingTime': random.date(),
        'status|1': ['success', 'fail', 'sending'],
        'productInfo|1-4': [{
          'orderId|+1': 0,
          'imgLink': random.image(),
          'title': random.sentence(1, 100),
          'asin': random.title(15),
          'sku': random.title(10),
        }],
        'email': '9423u432@qq.com',
        'subject': random.sentence(1, 100),
        'content': random.sentence(1, 10000),
        'sendType|1': ['automatic', 'manual', 'all'],
      }],
    },
  }),
  // 发件列表 沟通记录（回复页面）
  'GET /api/mws/mail-assistant/send-list/reply-page': Mock.mock({
    code: 200,
    data: {
      'mailContent|1-20': [{
        'type|1': ['customer', 'me'],
        'time': random.datetime(),
        'content': random.sentence(),
        'status|1': ['success,fail'],
      }],
      'orderInfo': {
        'purchaseDate': random.datetime(),
        'orderId': random.integer(),
        'orderStatus|1': ['Shipped', 'Shipping', 'Pending', 'Cancelled'],
        'shipServiceLevel': 'Unshipped(FBA)',
        'actuallyPaid': random.integer(),
        'isBusinessOrder': random.integer(),
        'orderDetails|1-20': [{
          title: random.sentence(),
          asin: random.title(15),
          sku: random.title(15),
          quantity: random.integer(),
          unitPrice: random.integer(),
          imgLink: random.image(),
          titleLink: 'https://www.baidu.com',
          price: random.integer(),
          itemPromotionDiscount: random.integer(),
          shippingPrice: random.integer(),
          shipPromotionDiscount: random.integer(),
          deliverStatus: random.word(3, 5),
          courierNumber: random.word(10),
        }],
      },
      
    },
  }),
  //规则列表
  'GET /api/mws/mail-assistant/rule-list/list': Mock.mock({
    code: 200,
    'data|1-10': [{
      ruleName: random.word(10),
      'id|+1': 0,
      triggerTime: random.date(),
      mailTemplate: random.word(8),
      'status|1': true,
    }],
  }),
  //添加规则按钮
  'GET /api/mws/mail-assistant/rule-list/add': Mock.mock({
    code: 200,
    'data|1-10': [{
      'templateId|+1': 1,
      'templateName': random.title(10),
    }],
  }),
  //修改按钮
  'GET /api/mws/mail-assistant/rule-list/update': Mock.mock({
    code: 200,
    data: {
      ruleName: random.title(10),
      'orderStatus|1': ['Unshipped', 'shipping', 'shipped'],
      'time_number|': 30,
      start: '09:00',
      end: '10:00',
      templateList: [{
        templateName: random.word(9),
        'templateStatus|1': true,
        'templateId|+1': 0,
      }],
      'id+1': 0,
      'sendingStatus|1': ['continue sending', 'not sending'],
      'skuStatus': ['exclude', 'restrict'],
      'skuList|1-5': [
        'Hello',
        'Mock.js',
        '!',
      ],
    },
  }),
  //添加规则保存
  'POST /api/mws/mail-assistant/rule-list/add-rule': Mock.mock({
    code: 200,
    message: '成功',
  }),
  //修改规则保存
  'POST /api/mws/mail-assistant/rule-list/update-rule': Mock.mock({
    code: 200,
    message: '成功',
  }),
  //规则开关
  'POST /api/mws/mail-assistant/rule-list/rule-switch': Mock.mock({
    code: 200,
    message: '成功',
  }),
  //规则删除
  'GET /api/mws/mail-assistant/rule-list/rule-delete': Mock.mock({
    code: 200,
    message: '成功',
  }),
  //邮件模版管理 - 模版列表
  'GET /api/mws/mail-assistant/template-list/list': Mock.mock({
    code: 200,
    'data|1-10': [{
      'templateType|1': ['Review+Feedback邀请', '常见问题回复', 'Reveiew邀请', 'Feedback邀请'],
      'id|+1': 0,
      'templateName': random.word(1, 10),
      'templateSubject': random.sentence(1, 100),
      'status|1': false,
    }],
  }),
  //模板添加保存
  'POST /api/mws/mail-assistant/template-list/add': Mock.mock({
    code: 200,
    message: '成功',
  }),
  //修改按钮
  'GET /api/mws/mail-assistant/template-list/update': Mock.mock({
    code: 200,
    data: {
      id: random.integer(),
      'templateType|1': ['Review+Feedback邀请', '常见问题回复', 'Reveiew邀请', 'Feedback邀请'],
      templateName: random.word(9),
      templateSubject: random.sentence(1, 100),
      templateContent: random.sentence(),
    },
  }),
  //模板修改保存
  'POST /api/mws/mail-assistant/template-list/update-template': Mock.mock({
    code: 200,
    message: '成功',
  }),
  //模板开关
  'POST /api/mws/mail-assistant/template-list/template-switch': Mock.mock({
    code: 200,
    message: '成功',
  }),
  //模板删除
  'GET /api/mws/mail-assistant/template-list/delete': Mock.mock({
    code: 200,
    message: '成功',
  }),

};

export default delay(proxy, 3000);
