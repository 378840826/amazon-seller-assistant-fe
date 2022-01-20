import { Response, Request } from 'express';


const getRandom = (n = 100) => Math.floor(Math.random() * n);

export default {
  // 豆腐块和基础数据
  'POST /api/mws/sales/market/tofu': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        'data': {
          'updateTime': '2022-01-01 12:12:12(北京)',
          'currentTime': new Date().getTime(),
          'dataTofuCubes': {
            'totalSales': 83913019,
            'totalSalesRingRatio': 9.1,
            'totalOrderQuantity': 33272,
            'totalOrderQuantityRingRatio': -1,
            'totalSalesQuantity': 36745,
            'totalSalesQuantityRingRatio': -2,
            'adSales': 1114347,
            'adSalesRingRatio': 10.1,
            'adOrderQuantity': 12345,
            'adOrderQuantityRingRatio': 125,
            'adSpend': 10605,
            'adSpendRingRatio': 21,
          },
          'currencyRates': [
            {
              'currency': '$',
              'name': '美元',
              'rate': 6.2134,
              'updatetime': '2022-01-10',
            },
            {
              'currency': 'CS$',
              'name': '加元',
              'rate': 8.2341,
              'updatetime': '2022-01-10',
            },
            {
              'currency': '￥',
              'name': '日元',
              'rate': 8.3451,
              'updatetime': '2022-01-10',
            },
            {
              'currency': '$',
              'name': '欧元',
              'rate': 8.3451,
              'updatetime': '2022-01-10',
            },
            {
              'currency': '$',
              'name': '英镑',
              'rate': 8.3451,
              'updatetime': '2022-01-10',
            },
          ],
        },
      });
    }, 500);
  },

  // 折线图和地图
  'POST /api/mws/sales/market/graph': (req: Request, res: Response) => {
    const { body: { attributes, method, startTime, endTime } } = req;
    const start = new Date(startTime as string);
    const end = new Date(endTime as string);
    const ms = end.getTime() - start.getTime();
    let length = 0;
    switch (method) {
    case 'DAY':
      length = ms / 86400000;
      break;
    case 'WEEK':
      length = ms / 86400000 / 7;
      break;
    case 'MONTH':
      length = ms / 86400000 / 30;
      break;
    default:
      length = 4;
      break;
    }
    if (!length) {
      length = 365;
    }
    const lengthArr = (new Array(~~length)).fill('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr: any[] = Array.isArray(attributes) ? attributes : [attributes];
    const polylineX = lengthArr.map((_, i) => `2021-02-0${i + 1}`);
    const polylineXFirstHalf = lengthArr.map((_, i) => `2020-02-0${i + 1}`);
    const polylineXFirstWeekOrMonthHalf = lengthArr.map((_, i) => `2021-01-0${i + 1}`);
    const thisPeriod = { polylineX };
    const firstHalf = { polylineX: polylineXFirstHalf };
    const firstWeekOrMonthHalf = { polylineX: polylineXFirstWeekOrMonthHalf };
    arr.forEach(key => {
      thisPeriod[key] = lengthArr.map(() => getRandom());
      firstHalf[key] = lengthArr.map(() => getRandom(1500));
      firstWeekOrMonthHalf[key] = lengthArr.map(() => getRandom(1000000000));
    });
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          lineChart: {
            thisPeriod,
            firstHalf,
            firstWeekOrMonthHalf,
          },
          mapHistogram: [
            {
              marketplace: 'US',
              totalSales: 0,
              totalOrderQuantity: 1345,
              totalSalesQuantity: 13333,
              adSales: 34324.13,
              adOrderQuantity: 4356,
              adSpend: 6543,
            },
            {
              marketplace: 'UK',
              totalSales: 24,
              totalOrderQuantity: 1245,
              totalSalesQuantity: 13333,
              adSales: 34324.13,
              adOrderQuantity: 4356,
              adSpend: 6543,
            },
            {
              marketplace: 'JP',
              totalSales: 23423.1,
              totalOrderQuantity: 1234,
              totalSalesQuantity: 13333,
              adSales: 34324.13,
              adOrderQuantity: 4356,
              adSpend: 6543,
            },
            {
              marketplace: 'CA',
              totalSales: null,
              totalOrderQuantity: 22345,
              totalSalesQuantity: 13333,
              adSales: 34324.13,
              adOrderQuantity: 4356,
              adSpend: 6543,
            },
            {
              marketplace: 'ES',
              totalSales: 23253.1,
              totalOrderQuantity: 12345,
              totalSalesQuantity: 13333,
              adSales: 34324.13,
              adOrderQuantity: 4356,
              adSpend: 6543,
            },
            {
              marketplace: 'IT',
              totalSales: 23423.1,
              totalOrderQuantity: 12345,
              totalSalesQuantity: 13333,
              adSales: 34324.13,
              adOrderQuantity: 4356,
              adSpend: 6543,
            },
            {
              marketplace: 'FR',
              totalSales: 34253.1,
              totalOrderQuantity: 12345,
              totalSalesQuantity: 13333,
              adSales: 34324.13,
              adOrderQuantity: 4356,
              adSpend: 6543,
            },
            {
              marketplace: 'DE',
              totalSales: 9253.1,
              totalOrderQuantity: 12345,
              totalSalesQuantity: 13333,
              adSales: 34324.13,
              adOrderQuantity: 4356,
              adSpend: 6543,
            },
          ],
        },
      });
    }, 500);
  },
};
