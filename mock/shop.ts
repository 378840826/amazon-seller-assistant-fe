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
              token: 'token-1',
              autoPrice: false,
              timezone: 'America/ Los_Angeles',
              currency: '$',
              tokenInvalid: false,
            }, {
              id: '2',
              storeName: 'store-name-2',
              marketplace: 'UK',
              sellerId: 'sellerId-2',
              token: 'token-2',
              autoPrice: true,
              timezone: 'America/ Los_Angeles',
              currency: '£',
              tokenInvalid: true,
            }, {
              id: '3',
              storeName: 'store-name-3',
              marketplace: 'US',
              sellerId: 'sellerId-3',
              token: 'token-3',
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
};
