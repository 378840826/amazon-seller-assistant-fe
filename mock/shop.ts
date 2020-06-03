import { Response, Request } from 'express';

export default {
  'GET /api/mws/store/list': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          records: [
            {
              id: '1',
              storeName: 'store-name-1',
              marketplace: 'US',
              sellerId: 'sellerId-1',
              token: 'amzn.mws.ecb25605-138b-62fb-56e6-83652c2b0d35',
              autoPrice: false,
              timezone: 'America/ Los_Angeles',
              currency: '$',
              tokenInvalid: false,
            }, {
              id: '2',
              storeName: 'store-name-store-name-2',
              marketplace: 'UK',
              sellerId: 'sellerId-2',
              token: 'amzn.mws.ecb25605-138b-62fb-56e6-83652c2b0d35-2',
              autoPrice: true,
              timezone: 'America/ Los_Angeles',
              currency: '£',
              tokenInvalid: true,
            }, {
              id: '3',
              storeName: 'store-3',
              marketplace: 'US',
              sellerId: 'sellerId-3',
              token: 'amzn.mws.ecb25605-138b-62fb-56e6-83652c2b0d35-3',
              autoPrice: true,
              timezone: 'America/ Los_Angeles',
              currency: '￥',
              tokenInvalid: false,
            },
          ],
        },
      });
    }, 800);
  },

  'GET /api/adshop/list': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          records: [
            {
              id: '10',
              storeName: 'ppc-store-1',
              marketplace: 'US',
              sellerId: 'sellerId-1',
              token: 'token-1',
              autoPrice: false,
              timezone: 'America/ Los_Angeles',
              currency: '$',
              tokenInvalid: false,
            }, {
              id: '20',
              storeName: 'ppc-store-2',
              marketplace: 'UK',
              sellerId: 'sellerId-20',
              token: 'token-2',
              autoPrice: true,
              timezone: 'America/ Los_Angeles',
              currency: '£',
              tokenInvalid: true,
            }, {
              id: '30',
              storeName: 'ppc-store-3',
              marketplace: 'US',
              sellerId: 'sellerId-30',
              token: 'token-3',
              autoPrice: true,
              timezone: 'America/ Los_Angeles',
              currency: '￥',
              tokenInvalid: false,
            },
          ],
        },
      });
    }, 500);
  },

  'GET /api/mws/store/modify/auto-price': (_: Request, res: Response) => {
    setTimeout(() => {
      res.header({
        Token: 'cccc',
      });
      res.send({
        code: 200,
        message: 'message',
      });
    }, 600);
  },

  'GET /api/mws/store/unbind': (_: Request, res: Response) => {
    setTimeout(() => {
      res.header({
        Token: 'cccc',
      });
      res.send({
        code: 200,
        message: '解绑成功',
      });
    }, 600);
  },

  'POST /api/mws/store/modify/name': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '修改成功',
      });
    }, 1000);
  },

  'POST /api/mws/store/modify/token': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '更新成功',
      });
    }, 800);
  },

  'POST /api/mws/store/bind': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '绑定成功',
      });
    }, 800);
  },
};
