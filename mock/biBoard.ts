import { Response, Request } from 'express';

export default {
  'GET /api/mws/kanban': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          // 现有库存预计可售
          fisKanban: [
            {
              asin: 'B000000000',
              sku: 'sku-MMMMMMMMMMMMMMMMM',
              img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
              availableDays: 5,
            },
            {
              asin: 'B000000001',
              sku: 'sku-MMMMMMMMMMMMMMMMM',
              img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
              availableDays: 5,
            },
            {
              asin: 'B000000002',
              sku: 'sku-MMMMMMMMMMMMMMMMM',
              img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
              availableDays: 5,
            },
            {
              asin: 'B000000003',
              sku: 'sku-MMMMMMMMMMMMMMMMM',
              img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
              availableDays: 5,
            },
            {
              asin: 'B000000004',
              sku: 'sku-MMMMMMMMMMMMMMMMM',
              img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
              availableDays: 5,
            },
          ],
          // 智能调价
          ajKanban: [
            {
              ruleName: '调价规则名称调价规则名称',
              ajFrequency: 23,
            },
            {
              ruleName: '调价规则名称调价规则名称调价规则名称调价规则名称',
              ajFrequency: 23,
            },
            {
              ruleName: '调价规则名称调价规则名称1',
              ajFrequency: 23,
            },
            {
              ruleName: '调价规则名称调价规则名称2',
              ajFrequency: 23,
            },
            {
              ruleName: '调价规则名称调价规则名称3',
              ajFrequency: 23,
            },
          ],
          // 跟卖监控
          followKanban: {
            monitoringCount: 50,
            followAsinCount: 10,
            followAsinNotJoninBuyboxAj: 5,
            buyboxLostAsinCount: 4,
            buyboxLostAsinNotJoninBuyboxAj: 3,
          },
          // 购物车占比
          buyboxPercentageKanban: {
            buyboxPercentage: [
              {
                asin: 'B000000000',
                sku: 'sku00sku00sku00sku00',
                img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
                isJoinFollowMonitoring: false,
                buyboxPercentage: 90,
              },
              {
                asin: 'B000000001',
                sku: 'sku00sku00sku00sku00',
                img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
                isJoinFollowMonitoring: true,
                buyboxPercentage: 90,
              },
              {
                asin: 'B000000002',
                sku: 'sku00sku00sku00sku00',
                img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
                isJoinFollowMonitoring: true,
                buyboxPercentage: 90,
              },
              {
                asin: 'B000000003',
                sku: 'sku00sku00sku00sku00',
                img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
                isJoinFollowMonitoring: false,
                buyboxPercentage: 90,
              },
              {
                asin: 'B000000004',
                sku: 'sku00sku00sku00sku00',
                img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
                isJoinFollowMonitoring: false,
                buyboxPercentage: 90,
              },
            ],
            lastTime: '2020-10-20',
          },
          // 邮件
          mailKanban: {
            unMailNumber: 50,
            urgentMailTimeLeftHours: 2,
            urgentMailTimeLeftMinute: 30,
          },
          // Review
          reviewKanban: {
            oneStar: 11,
            oneStarUnanswered: 1,
            twoStar: 22,
            twoStarUnanswered: 2,
            threeStar: 33,
            threeStarUnanswered: 3,
            fourStar: 44,
            fourStarUnanswered: 4,
            fiveStar: 55,
            fiveStarUnanswered: 5,
          },
          // Feedback
          feedbackKanban: {
            oneStar: 1,
            twoStar: 2,
            threeStar: 3,
          },
          // Amazon's Choice 关键词
          acKeywordKanban: {
            asinInfos: [
              {
                asin: 'B000000000',
                sku: 'sku00sku00sku00sku00',
                img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
                addKeyword: 'add-keyword',
                titleNotIncluded: ['keyword', 'keyword1'],
                bpNotIncluded: ['keyword2', 'keyword3'],
                descriptionNotIncluded: ['keyword4', 'keyword1'],
              },
              {
                asin: 'B000000002',
                sku: 'sku00sku00sku00sku00',
                img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
                addKeyword: 'add-keyword',
                titleNotIncluded: ['keyword', 'keyword1'],
                bpNotIncluded: ['keyword2', 'keyword3'],
                descriptionNotIncluded: ['keyword4', 'keyword1'],
              },
              {
                asin: 'B000000003',
                sku: 'sku00sku00sku00sku00',
                img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
                addKeyword: 'add-keyword',
                titleNotIncluded: ['keyword', 'keyword1'],
                bpNotIncluded: ['keyword2', 'keyword3'],
                descriptionNotIncluded: ['keyword4', 'keyword1'],
              },
              {
                asin: 'B000000004',
                sku: 'sku00sku00sku00sku00',
                img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
                addKeyword: 'add-keyword',
                titleNotIncluded: ['keyword', 'keyword1'],
                bpNotIncluded: ['keyword2', 'keyword3'],
                descriptionNotIncluded: ['keyword4', 'keyword1'],
              },
              {
                asin: 'B000000001',
                sku: 'sku00sku00sku00sku00',
                img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
                addKeyword: 'add-keyword',
                titleNotIncluded: ['keyword', 'keyword1'],
                bpNotIncluded: ['keyword2', 'keyword3'],
                descriptionNotIncluded: ['keyword4', 'keyword1'],
              },
            ],
            lastTime: '2020-10-20',
          },
          // 广告关键词表现
          adKeywordKanban: [
            {
              adCampaignsName: '广告系列1',
              adGroupName: '广告组1',
              acos: 23.23,
              keyword: 'keyword',
            },
            {
              adCampaignsName: '广告系列1',
              adGroupName: '广告组1',
              acos: 23.23,
              keyword: 'keyword1',
            },
            {
              adCampaignsName: '广告系列1',
              adGroupName: '广告组1',
              acos: 23.23,
              keyword: 'keyword2',
            },
            {
              adCampaignsName: '广告系列1',
              adGroupName: '广告组1',
              acos: 23.23,
              keyword: 'keyword3',
            },
            {
              adCampaignsName: '广告系列1',
              adGroupName: '广告组1',
              acos: 23.23,
              keyword: 'keyword4',
            },
          ],
          // 广告 Ineligible 原因
          adIneligibleKanban: [
            {
              asin: 'B000000000',
              sku: 'sku00sku00sku00sku00',
              img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
              Ineligible: 'INELIGIBLE_PRODUCT_COST',
            },
            {
              asin: 'B000000001',
              sku: 'sku00sku00sku00sku00',
              img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
              Ineligible: 'INELIGIBLE_PRODUCT_COST',
            },
            {
              asin: 'B000000002',
              sku: 'sku00sku00sku00sku00',
              img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
              Ineligible: 'INELIGIBLE_PRODUCT_COST',
            },
            {
              asin: 'B000000003',
              sku: 'sku00sku00sku00sku00',
              img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
              Ineligible: 'INELIGIBLE_PRODUCT_COST',
            },
            {
              asin: 'B000000004',
              sku: 'sku00sku00sku00sku00',
              img: 'https://images-na.ssl-images-amazon.com/images/I/41tnCfqTCJL.jpg',
              Ineligible: 'INELIGIBLE_PRODUCT_COST',
            },
          ],
        },
      });
    }, 500);
  },  
};
