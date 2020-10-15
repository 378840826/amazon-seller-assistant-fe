/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-08 16:57:08
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-09-12 17:41:44
 * @FilePath: \amzics-react\mock\message.ts
 * 
 * // 消息中心
 */ 
import Mock from 'mockjs';

const random = Mock.Random;

export default {
  // 全部消息
  'GET /api/mws/review/reviews/all': Mock.mock({
    code: 200,
    data: {
      'total|999-99999': 1,
      'current|1-99': 1,
      size: () => {
        const num = Math.ceil( Math.random() * (3 - 1));
        switch (num) {
        case 1:
          return 20;
        case 2:
          return 50;
        case 3: 
          return 100;
        default:
          break;
        }
      },
      // size: 50,
      'pages|1-99999': 1,
      'records|20-100': [
        // review
        {
          type: 'review', 
          gmtCreate: random.date(), // 提醒时间
          'asin|10': '', // asin
          'asinUrl': 'http://wwww.baidu.com', // asinUrl
          'star|1-5': 0, // 星级
          reviewTime: random.date(), // 评论时间
          'reviewContent|1000-20001': '', // 评论内容
          'reviewLink': 'http://wwww.baidu.com', // 评论链接
          'reviewerName|5-40': '', // 用户笔名
          reviewerLink: 'http://www.baidu.com', // 评价者链接
          'id|1-9999999': 1, // review状态的id,
          'handled|1': true, // 是否已经处理, true表示已处理,false表示未处理
        },
        
        // 库存
        {},

        // 广告
        {},

        // 跟卖
        {
          type: 'followUp',
          id: 12345,
          'asin|10': '', // asin
          'followSellerQuantity|0-2': 1, // 跟卖者数量,  有值则表示按 : "发现*个跟卖者" 消息格式提示
          'buyboxOccupied|1': true, // Buybox是否被占领, 为true 则按照 Buybox被跟卖者占领 消息格式提示
          'followMonitorHistoryId|1-99999999': 1, // 跟卖历史列表Id, 用于点击详情跳转
          'catchTime': random.time(), // 时间
          'catchDate': random.date(), // 日期
          'followSellers|0-5': [
            {
              'sellerName|1-20': '', 
              'sellerLinK': 'http://wwww.baidu.com', 
              'sellerId|1-200000': 1, 
              'fulfillmentChannel': 'FBM', 
              'price|1-20000': 1, 
              'shippingFee|1-20000': 1, 
            },
          ],
        },
      ],
    },
  }),

  // 获取review提醒
  'GET /api/mws/review/remind/list': Mock.mock({
    code: 200,
    data: {
      'total|999-99999': 1,
      'current|1-99': 1,
      size: () => {
        const num = Math.ceil( Math.random() * (3 - 1));
        switch (num) {
        case 1:
          return 20;
        case 2:
          return 50;
        case 3: 
          return 100;
        default:
          break;
        }
      },
      // size: 50,
      'pages|1-99999': 1,
      'records|1-20': [
        {
          gmtCreate: random.date(), // 提醒时间
          'asin|10': '', // asin
          'asinUrl': 'http://wwww.baidu.com', // asinUrl
          'star|1-5': 1, // 星级
          reviewTime: random.date(), // 评论时间
          'reviewContent|10-5500': '', // 评论内容
          'reviewLink': 'http://wwww.baidu.com', // 评论链接
          'reviewerName|5-40': '', // 用户笔名
          reviewerLink: 'http://www.baidu.com', // 评价者链接
          'id|1-9999999': 1, // review状态的id,
          'handled|1': true, // 是否已经处理, true表示已处理,false表示未处理
        },
      ],
    },
  }),

  // 获取跟卖消息
  'GET /api/mws/follow/remind/list': Mock.mock({
    code: 200,
    data: {
      'total|999-99999': 1,
      'current|1-99': 1,
      size: () => {
        const num = Math.ceil( Math.random() * (3 - 1));
        switch (num) {
        case 1:
          return 20;
        case 2:
          return 50;
        case 3: 
          return 100;
        default:
          break;
        }
      },
      // size: 50,
      'pages|1-99999': 1,
      'records|1-50': [
        {
          type: 'followUp',
          id: 12345,
          'asin|10': '', // asin
          'followSellerQuantity|0-2': 1, // 跟卖者数量,  有值则表示按 : "发现*个跟卖者" 消息格式提示
          'buyboxOccupied|1': true, // Buybox是否被占领, 为true 则按照 Buybox被跟卖者占领 消息格式提示
          'followMonitorHistoryId|1-99999999': 1, // 跟卖历史列表Id, 用于点击详情跳转
          'catchTime': random.time(), // 时间
          'catchDate': random.date(), // 日期
          'followSellers|0-5': [
            {
              'sellerName|1-20': '', 
              'sellerLinK': 'http://wwww.baidu.com', 
              'sellerId|1-200000': 1, 
              'fulfillmentChannel': 'FBM', 
              'price|1-20000': 1,
              'shippingFee|1-20000': 1, 
            },
          ],
        },
      ],
    },
  }),
};
