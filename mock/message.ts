/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-08 16:57:08
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-10 11:49:06
 * @FilePath: \amzics-react_am_10\mock\message.ts
 * 
 * // 消息中心
 */ 
import Mock from 'mockjs';

const random = Mock.Random;

export default {
  // 全部消息
  'GET /API/api/mws/review/reviews/all': Mock.mock({
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
        // review
        {
          type: 'review', 
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
        
        // 库存
        {},

        // 广告
        {},

        // 跟卖
        {
          type: 'followUp',
        },
      ],
    },
  }),

  // 获取review提醒
  '/API/api/mws/review/remind/list': Mock.mock({
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
};
