import { Response, Request } from 'express';

export default {
  'GET /api/system/member/info': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          memberLevel: '高级VIP',
          validPeriod: 1,
          functionalSurplus: [
            {
              functionName: '绑定店铺',
              frequency: 1,
            },
            {
              functionName: '广告授权店铺',
              frequency: 2,
            },
            {
              functionName: '子账号',
              frequency: 3,
            }, {
              functionName: '智能调价',
              frequency: 4,
            }, {
              functionName: 'ASIN总览报表导出',
              frequency: 5,
            }, {
              functionName: 'ASIN动态监控',
              frequency: 6,
            }, {
              functionName: '跟卖监控',
              frequency: 7,
            }, {
              functionName: 'Review监控',
              frequency: 8,
            }, {
              functionName: '自动邮件',
              frequency: 9,
            }, {
              functionName: '补货计划导出',
              frequency: 10,
            }, {
              functionName: 'PPC托管',
              frequency: 11,
            },
          ],
          paymentRecords: [
            {
              paymentTime: '2020-10-31 08:08:08',
              orderNo: '202010310808080001',
              orderInfo: '购买VIP一年',
              paymentMethod: '微信支付',
              paymentAmount: 2999,
            },
            {
              paymentTime: '2020-10-31 08:08:09',
              orderNo: '202010310808080002',
              orderInfo: '续费VIP一年',
              paymentMethod: '微信支付',
              paymentAmount: 2999,
            },
          ],
        },
      });
    }, 500);
  },

  'GET /api/system/member/qr-code': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          advancePaymentInfo: {
            codeUrl: 'https://www.darkroom.cc/',
            orderId: '101',
          },
        },
      });
    }, 500);
  },

  // 续费信息
  'GET /api/system/member/vip-renewal': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          memberLevel: '高级VIP',
          validPeriod: 8,
          vipList: [
            // {
            //   id: 1,
            //   memberLevel: 'VIP',
            //   typeOfFee: '1',
            //   originalPrice: '299',
            //   currentPrice: '299',
            // },
            // {
            //   id: 2,
            //   memberLevel: 'VIP',
            //   typeOfFee: '2',
            //   originalPrice: '2999',
            //   currentPrice: '3588',
            // },
          ],
          'seniorVipList': [
            {
              id: 3,
              memberLevel: '高级VIP',
              typeOfFee: '1',
              originalPrice: '499',
              currentPrice: '499',
            },
            {
              id: 4,
              memberLevel: '高级VIP',
              typeOfFee: '2',
              originalPrice: '5988',
              currentPrice: '4999',
            },
          ],
          'extremeVipList': [
            // {
            //   id: 5,
            //   memberLevel: '至尊VIP',
            //   typeOfFee: '1',
            //   originalPrice: '999',
            //   currentPrice: '999',
            // },
            // {
            //   id: 6,
            //   memberLevel: '至尊VIP',
            //   typeOfFee: '2',
            //   originalPrice: '9999',
            //   currentPrice: '11988',
            // },
          ],
        },
      });
    }, 500);
  },

  // 升级信息
  'GET /api/system/member/vip-upgrade': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          memberLevel: '普通会员',
          typeOfFee: null,
          validPeriod: 10,
          price: '0',
          vipList: [
            {
              id: 1,
              memberLevel: 'VIP',
              typeOfFee: '1',
              originalPrice: '299',
              currentPrice: '299',
            },
            {
              id: 2,
              memberLevel: 'VIP',
              typeOfFee: '2',
              originalPrice: '2999',
              currentPrice: '3588',
            },
          ],
          'seniorVipList': [
            {
              id: 3,
              memberLevel: '高级VIP',
              typeOfFee: '1',
              originalPrice: '499',
              currentPrice: '499',
            },
            {
              id: 4,
              memberLevel: '高级VIP',
              typeOfFee: '2',
              originalPrice: '5988',
              currentPrice: '4999',
            },
          ],
          'extremeVipList': [
            {
              id: 5,
              memberLevel: '至尊VIP',
              typeOfFee: '1',
              originalPrice: '999',
              currentPrice: '999',
            },
            {
              id: 6,
              memberLevel: '至尊VIP',
              typeOfFee: '2',
              originalPrice: '11988',
              currentPrice: '9999',
            },
          ],
        },
      });
    }, 500);
  },

  // 支付状态
  'GET /api/system/member/pay-status': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          payStatus: false,
        },
      });
    }, 500);
  },
};

