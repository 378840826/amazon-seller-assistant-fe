import { Response, Request } from 'express';

export default {
  'GET /api/shop/list': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        token: 'test-token-1',
        data: [
          {
            id: 1,
            site: 'US',
            shopName: 'storeName1',
            sellerId: 'sellerId001',
            token: 'token001',
            switch: true,
            currency: '$',
            tokenInvalid: true,
            timezone: '时区1',
          },
          {
            id: 2,
            site: 'UK',
            shopName: 'name2',
            sellerId: 'sellerId002',
            token: 'token002',
            switch: true,
            currency: '￥',
            tokenInvalid: true,
            timezone: '时区2',
          },
        ],
      });
    }, 1000);
  },

  'GET /api/adshop/list': {
    code: 200,
    data: [
      {
        id: 3,
        site: 'US',
        shopName: 'ppcStore1',
        sellerId: 'sellerId003',
        token: 'token001',
        switch: true,
        currency: '$',
        tokenInvalid: true,
        timezone: '时区1',
        createdTime: '2020-01-01',
      },
      {
        id: 4,
        site: 'UK',
        shopName: 'ppcStore2',
        sellerId: 'sellerId002',
        token: 'token002',
        switch: true,
        currency: '￥',
        tokenInvalid: true,
        timezone: '时区2',
        createdTime: '2020-01-01',
      },
    ],
  },
};
