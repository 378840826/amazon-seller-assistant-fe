/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-03 15:03:53
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-06 11:57:34
 * @FilePath: \amzics-react_am_10\mock\commentMonitor.ts
 * 
 * 监控评价模块
 */ 

import Mock from 'mockjs';

const random = Mock.Random;
 
export default {
  'GET /api/getCommonentList/': Mock.mock({
    code: 200,
    data: {
      'total|500-200': 1,
      'current|1-10': 1,
      // // 分页大小
      size: function() {
        const n = Math.floor(Math.random() * 3 + 1);
        if (n === 1) {
          return 20;
        } else if (n === 2) {
          return 50;
        } 
        return 100;
        
      },
      'pages|100-200': 1,
      'records|1-20': [
        {
          'id|1-999': 1,
          reviewTime: random.date('yyyy-mm-dd'), // 日期
          'star|1-5': Math.ceil(Math.random() * (5) + 1), // 星级
          reviewContent: random.upper(random.title(5, 200)), // 评论内容
          reviewLink: 'http://www.baidu.com', // 评论链接
          asin: 'B07KFBD82J',
          asinUrl: 'http://www.baidu.com', // 
          reviewerName: random.string(7, 10), // 用户笔名
          reviewerLink: 'http://www.baidu.com', // 评论人的url
          reviewScore: random.integer(1, 5), // 总评分
          reviewNum: random.natural(), // reviews数量
          'handled|1': true, // 是否已处理
          'hasOrder|1': false, // 是否有匹配的订单
          imgLink: random.image('80x80'),
          titleLink: random.upper(random.title(5, 200)), // 标题url
          starPart: [
            {
              'one|1-100': 1, // 1星占比	
              oneStarLink: 'http://www.baidu.com', //	1星评论链接
    
              'two|1-100': 1, // 2星占比	
              twoStarLink: 'http://www.baidu.com', //	2星评论链接
    
              'three|1-100': 1, // 3星占比	
              threeStarLink: 'http://www.baidu.com', //	3星评论链接
    
              'four|1-100': 1, // 4星占比	
              fourStarLink: 'http://www.baidu.com', //	4星评论链接
    
              'five|1-100': 1, // 5星占比	
              fiveStarLink: 'http://www.baidu.com', //	5星评论链接
            },
          ],
        },
      ],
    },
  }),
  
  'GET /api/mws/review/monitoring-settings/search/': Mock.mock({
    code: 200,
    'data|2-100': [
      {
        'asin|1-200': '',
        'title|1-200': '',
      },
    ],
  }),
};

