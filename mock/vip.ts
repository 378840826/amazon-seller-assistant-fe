import { Response, Request } from 'express';

export default {
  'GET /api/mws/vip/my': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          level: 2,
          isBilledAnnually: true,
          remainDays: 365,
          residue: {
            mwsShop: 1,
            ppcShop: 2,
            subAccount: 3,
            reprice: 4,
            asinReport: 5,
            asinMonitor: 6,
            competitorMonitor: 7,
            reviewMonitor: 8,
            autoMail: 9,
            replenishmentExport: 10,
            ppcTrusteeship: 11,
          },
          paymentHistory: [
            {
              time: '2020-10-31 08:08:08',
              orderId: '202010310808080001',
              orderDetail: '购买vip一年',
              payment: '微信支付',
              cost: 2999,
            },
            {
              time: '2020-10-31 08:08:09',
              orderId: '202010310808080002',
              orderDetail: '续费vip一年',
              payment: '微信支付',
              cost: 2999,
            },
          ],
        },
      });
    }, 500);
  },

  'GET /api/mws/vip/renew-url': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: 'https://www.darkroom.cc/',
      });
    }, 500);
  },
};

