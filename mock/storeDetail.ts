import { Response, Request } from 'express';

const getRandom = (n = 100) => Math.floor(Math.random() * n);

function getTag(length?: number) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const len = length || Math.random() * 16;
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

const line = (req: Request, res: Response) => {
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
      },
    });
  }, 500);
};

export default {
  // sku asin 豆腐块
  'POST /api/mws/store-report/tofu': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          // updateTime: '2020-12-08 16:41:25 (太平洋时间)',
          skuInfoTofu: {
            totalSku: 123456,
            activeSku: 23456,
            inactiveSku: 23456,
            fbaActiveSku: 23456,
            fbaInactiveSku: 23456,
            fbmActiveSku: 23456,
            fbmInactiveSku: 23456,
          },
          asinInfoTofu: {
            totalAsin: 223456,
            buyboxAsin: 3456,
            notBuyboxAsin: 23456,
            dynamicSalesRate: '36%',
            quantityOnSale: 23456,
            newProductQuantity: 600,
          },
        },
      });
    }, 500);
  },

  // 整体表现-豆腐块
  'POST /api/mws/store-report/overall-performance/tofu': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          totalSales: 9999999.8,
          totalSalesLast: 21,
          totalSalesRingRatio: 22334,
          totalOrderQuantity: 44,
          totalOrderQuantityLast: 43,
          totalOrderQuantityRingRatio: -55,
          totalSalesQuantity: 66,
          totalSalesQuantityRingRatio: 77,
          cumulativelyOnSaleAsin: 88,
          cumulativelyOnSaleAsinRingRatio: null,
          avgEachAsinOrder: 10,
          avgEachAsinOrderRingRatio: 11,
          grossProfit: 12,
          grossProfitRingRatio: 13,
          grossProfitRate: 14,
          grossProfitRateRingRatio: 15,
          salesQuantityExceptOrderQuantity: 16,
          salesQuantityExceptOrderQuantityRingRatio: 17,
          avgSellingPrice: null,
          avgSellingPriceLast: 18,
          avgSellingPriceRingRatio: 19,
          avgCustomerPrice: 20,
          avgCustomerPriceRingRatio: 21,
          preferentialOrderQuantity: 22,
          preferentialOrderQuantityRingRatio: 23,
          associateSales: 24,
          associateSalesRingRatio: 25,
          pageView: 26,
          pageViewLast: 260,
          pageViewRingRatio: 27,
          session: 28,
          sessionRingRatio: 29,
          pageViewExceptSession: 30,
          pageViewExceptSessionRingRatio: 31,
          conversionsRate: 32,
          conversionsRateRingRatio: 33,
          returnQuantity: 34,
          returnQuantityRingRatio: 35,
          returnRate: 36,
          returnRateRingRatio: 37,
          b2bSales: 38,
          b2bSalesLast: 388,
          b2bSalesRingRatio: -39,
          b2bSalesProportion: 40,
          b2bOrderQuantity: 41,
          b2bOrderQuantityRingRatio: 42,
          b2bSalesQuantity: 43,
          b2bSalesQuantityRingRatio: 44,
          b2bSalesQuantityExceptOrderQuantity: 45,
          b2bSalesQuantityExceptOrderQuantityRingRatio: 46,
          b2bAvgSellingPrice: 47,
          b2bAvgSellingPriceRingRatio: 48,
          b2bAvgCustomerPrice: 49,
          b2bAvgCustomerPriceRingRatio: 50,
          adSales: 51,
          adSalesRingRatio: 521,
          adSalesProportion: 53,
          naturalSales: 54,
          naturalSalesRingRatio: 55,
          naturalSalesProportion: 56,
          adOrderQuantity: 57.1,
          adOrderQuantityRingRatio: 58,
          adOrderQuantityProportion: 59,
          naturalOrderQuantity: 60,
          naturalOrderQuantityRingRatio: 61,
          naturalOrderQuantityProportion: 62,
          cpc: 63,
          cpcRingRatio: 64,
          cpa: 65,
          cpaRingRatio: 66,
          cpm: 67,
          cpmRingRatio: 68,
          spend: 69,
          spendRingRatio: 70,
          acos: 71,
          acosRingRatio: 72,
          compositeAcos: 73,
          compositeAcosRingRatio: 74,
          roas: 75,
          roasRingRatio: 76,
          compositeRoas: 77,
          compositeRoasRingRatio: 78,
          impressions: 79,
          impressionsRingRatio: 80,
          clicks: 81,
          clicksRingRatio: 82,
          ctr: 83,
          ctrRingRatio: 84,
          adConversionsRate: 85,
          adConversionsRateRingRatio: 86,
        },
      });
    }, 500);
  },

  // 整体表现-折线图
  'POST /api/mws/store-report/overall-performance': line,

  // 整体表现-表格
  'POST /api/mws/store-report/overall-performance/page': (req: Request, res: Response) => {
    const { body: { size, current } } = req;
    const item = {
      totalSales: 2222222,
      totalOrderQuantity: 4222224,
      totalSalesQuantity: 6222226,
      cumulativelyOnSaleAsin: 88,
      avgEachAsinOrder: 10,
      grossProfit: 12,
      grossProfitRate: 14,
      salesQuantityExceptOrderQuantity: 16,
      avgSellingPrice: 18,
      avgCustomerPrice: 20,
      preferentialOrderQuantity: 22,
      associateSales: 24,
      pageView: 26,
      session: 28,
      pageViewExceptSession: 30,
      conversionsRate: 32,
      returnQuantity: 34,
      returnRate: 36,
      b2bSales: 38,
      b2bSalesProportion: 40,
      b2bOrderQuantity: 41,
      b2bSalesQuantity: 43,
      b2bSalesQuantityExceptOrderQuantity: 45,
      b2bAvgSellingPrice: 47,
      b2bAvgCustomerPrice: 49,
      adSales: 51,
      adSalesProportion: 53,
      naturalSales: 54,
      naturalSalesProportion: 56,
      adOrderQuantity: 57.1,
      adOrderQuantityProportion: 59,
      naturalOrderQuantity: 60,
      naturalOrderQuantityProportion: 62,
      cpc: 63,
      cpa: 65,
      cpm: 67,
      spend: 69,
      acos: 71,
      compositeAcos: 73,
      roas: 75,
      compositeRoas: 77,
      impressions: 79,
      clicks: 81,
      ctr: 83,
      adConversionsRate: 85,
    };
    const records = (new Array(10)).fill('').map((_: '', i: number) => {
      return {
        ...item,
        cycleDate: `2021-02-${i} - 2021-02-${i}`,
      };
    });
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          total: 10010,
          size,
          current,
          records,
        },
      });
    }, 500);
  },

  // B2B-豆腐块
  'POST /api/mws/store-report/b2b-sale/tofu': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          b2bSales: 88888.1,
          b2bSalesLast: 38898,
          b2bSalesRingRatio: 52.1,
          b2bOrderQuantity: 41,
          b2bOrderQuantityLast: 41,
          b2bOrderQuantityRingRatio: -1200,
          b2bSalesQuantity: 43,
          b2bSalesQuantityLast: 4333,
          b2bSalesQuantityRingRatio: 44,
          b2bSalesQuantityExceptOrderQuantity: 45,
          b2bSalesQuantityExceptOrderQuantityRingRatio: 46,
          b2bAvgSellingPrice: 47,
          b2bAvgSellingPriceRingRatio: 48,
          b2bAvgCustomerPrice: 49,
          b2bAvgCustomerPriceRingRatio: 50,
          b2bSalesProportion: null,
          b2bSalesProportionLast: 4000,
          b2bSalesProportionRingRatio: 40,
        },
      });
    }, 500);
  },

  // B2B-折线图
  'POST /api/mws/store-report/b2b-sale': line,

  // B2B-表格
  'POST /api/mws/store-report/b2b-sale/page': (req: Request, res: Response) => {
    const { body: { size, current } } = req;
    const item = {
      b2bSales: 38.1,
      b2bSalesProportion: 40,
      b2bOrderQuantity: 41,
      b2bSalesQuantity: 43,
      b2bSalesQuantityExceptOrderQuantity: 45,
      b2bAvgSellingPrice: 47,
      b2bAvgCustomerPrice: 49,
    };
    const records = (new Array(10)).fill('').map((_: '', i: number) => {
      return {
        ...item,
        cycleDate: `2021-02-${i} - 2021-02-${i}`,
      };
    });
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          total: 10010,
          size,
          current,
          records,
        },
      });
    }, 500);
  }, 

  // 退货分析全部数据
  'POST /api/mws/store-report/return-analysis': (_: Request, res: Response) => {
    const lineChart = {
      thisPeriod: {
        polylineX: (new Array(10)).fill('').map((_, i) => `2022-02-0${i}`),
        returnQuantity: (new Array(10)).fill('').map(() => getRandom(1000)),
        returnRate: (new Array(10)).fill('').map(() => getRandom()),
      },
    };
    const reasonArr = [
      'APPAREL_STYLE',
      'APPAREL_TOO_LARGE',
      'APPAREL_TOO_SMALL',
      'DAMAGED_BY_CARRIER',
      'DAMAGED_BY_FC',
      'DEFECTIVE',
      'DID_NOT_LIKE_FABRIC',
      'FOUND_BETTER_PRICE',
      'MISORDERED',
      'MISSED_ESTIMATED_DELIVERY',
      'MISSING_PARTS',
      'NEVER_ARRIVED',
      'NOT_AS_DESCRIBED',
      'NOT_COMPATIBLE',
      'NO_REASON_GIVEN',
      'ORDERED_WRONG_ITEM',
      'QUALITY_UNACCEPTABLE',
      'SWITCHEROO',
      'UNAUTHORIZED_PURCHASE',
      'UNDELIVERABLE_FAILED_DELIVERY_ATTEMPTS',
      'UNDELIVERABLE_INSUFFICIENT_ADDRESS',
      'UNDELIVERABLE_REFUSED',
      'UNDELIVERABLE_UNKNOWN',
      'UNWANTED_ITEM',
    ];
    const returnReasons = [{
      returnReason: reasonArr[0],
      returnQuantity: 505,
      proportion: 50.5,
      returnAmount: 5050.3,
    }];
    for (let i = 2; i <= reasonArr.length - 1; i++) {
      returnReasons.push({
        returnReason: reasonArr[i],
        returnQuantity: i,
        proportion: i,
        returnAmount: i,
      });
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          tofuBlocData: {
            returnQuantity: 1,
            lastReturnQuantity: 2,
            returnQuantityRatio: 3,
            returnRate: 4,
            lastReturnRate: 5,
            returnRateRatio: 6,
          },
          lineChart,
          returnReasons,
        },
      });
    }, 500);
  },

  // 广告表现-豆腐块
  'POST /api/mws/store-report/ad/tofu': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          adSales: 88888.1,
          adSalesLast: 38898,
          adSalesRingRatio: 52.1,
          adSalesProportion: 20,
          naturalSales: 888889.1,
          naturalSalesLast: 188889.1,
          naturalSalesRingRatio: 12.3,
          naturalSalesProportion: 80,
          adOrderQuantity: 41,
          adOrderQuantityLast: 41,
          adOrderQuantityRingRatio: -1200,
          adOrderQuantityProportion: 38,
          naturalOrderQuantity: 998,
          naturalOrderQuantityLast: 998,
          naturalOrderQuantityRingRatio: 9.98,
          naturalOrderQuantityProportion: 62,
          cpc: 63,
          cpcLast: 62,
          cpcRingRatio: 64,
          cpa: 65,
          cpaLast: 65,
          cpaRingRatio: 66,
          cpm: 67,
          cpmLast: 67,
          cpmRingRatio: 68,
          spend: 69,
          spendLast: 69,
          spendRingRatio: 70,
          acos: 71,
          acosLast: 71,
          acosRingRatio: 72,
          compositeAcos: 73,
          compositeAcosLast: 73,
          compositeAcosRingRatio: 74,
          roas: 75,
          roasLast: 75,
          roasRingRatio: 76,
          compositeRoas: 77,
          compositeRoasLast: 77,
          compositeRoasRingRatio: 78,
          impressions: 79,
          impressionsLast: 79,
          impressionsRingRatio: 80,
          clicks: 81,
          clicksLast: 81,
          clicksRingRatio: 82,
          ctr: 83,
          ctrLast: 83,
          ctrRingRatio: 84,
          adConversionsRate: 85,
          adConversionsRateLast: 85,
          adConversionsRateRingRatio: 86,
        },
      });
    }, 500);
  },

  // 广告表现-折线图
  'POST /api/mws/store-report/ad': line,

  // 广告表现-表格
  'POST /api/mws/store-report/ad/page': (req: Request, res: Response) => {
    const { body: { size, current } } = req;
    const item = {
      adSales: 51.1,
      adSalesRingRatio: null,
      adSalesProportion: null,
      naturalSales: 54,
      naturalSalesRingRatio: 55,
      naturalSalesProportion: 56,
      adOrderQuantity: 57,
      adOrderQuantityRingRatio: 58,
      adOrderQuantityProportion: 59,
      naturalOrderQuantity: 60,
      naturalOrderQuantityRingRatio: 61,
      naturalOrderQuantityProportion: 62,
      cpc: 63,
      cpcRingRatio: 64,
      cpa: 65,
      cpaRingRatio: 66,
      cpm: 67,
      cpmRingRatio: 68,
      spend: 69,
      spendRingRatio: 70,
      acos: 71,
      acosRingRatio: 72,
      compositeAcos: 73,
      compositeAcosRingRatio: 74,
      roas: 75,
      roasRingRatio: 76,
      compositeRoas: 77,
      compositeRoasRingRatio: 78,
      impressions: 79,
      impressionsRingRatio: 80,
      clicks: 81,
      clicksRingRatio: 82,
      ctr: 83,
      ctrRingRatio: 84,
      adConversionsRate: 85,
      adConversionsRateRingRatio: 86,
    };
    const records = (new Array(10)).fill('').map((_: '', i: number) => {
      return {
        ...item,
        cycleDate: `2021-02-${i} - 2021-02-${i}`,
      };
    });
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          total: 10010,
          size,
          current,
          records,
        },
      });
    }, 500);
  },

  // 广告表现-各渠道数据
  'POST /api/mws/store-report/ad/channel': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: [
          {
            channel: 'SP',
            adSales: 88888.1,
            adSalesRingRatio: 52.1,
            adOrderQuantity: 41,
            adOrderQuantityRingRatio: -12,
            spend: 69,
            spendRingRatio: 70,
            acos: 71,
            acosRingRatio: 72,
          }, {
            channel: 'SD',
            adSales: 8345.1,
            adSalesRingRatio: 2.1,
            adOrderQuantity: 41,
            adOrderQuantityRingRatio: -12,
            spend: 69,
            spendRingRatio: 70,
            acos: 71,
            acosRingRatio: 72,
          }, {
            channel: 'SB',
            adSales: 8345.1,
            adSalesRingRatio: 2.1,
            adOrderQuantity: 41,
            adOrderQuantityRingRatio: -12,
            spend: 69,
            spendRingRatio: 70,
            acos: 71,
            acosRingRatio: 72,
          }, {
            channel: 'DSP',
            adSales: 8345.1,
            adSalesRingRatio: 2.1,
            adOrderQuantity: 41,
            adOrderQuantityRingRatio: -12,
            spend: 69,
            spendRingRatio: 70,
            acos: 71,
            acosRingRatio: 72,
          },
        ],
      });
    }, 500);
  },

  // 产品线-柱状图
  'POST /api/mws/store-report/product-line/histogram': (_: Request, res: Response) => {
    const r = [{
      tag: '标签标签标签标签标签',
      value: Math.random() * 100000000,
      proportion: Math.random() * 10,
    }];
    const r1 = [{
      tag: getTag(),
      value: Math.random() * 100,
      proportion: Math.random() * 10,
    }];
    const r2 = [{
      tag: getTag(),
      value: Math.random() * 100,
      proportion: Math.random() * 10,
    }];
    for (let i = 0; i < 10; i++) {
      r.push({
        tag: getTag(),
        value: Math.random() * 100,
        proportion: Math.random() * 10,
      });  
      r2.push({
        tag: getTag(),
        value: Math.random() * 100,
        proportion: Math.random() * 10,
      }); 
    }
    for (let i = 0; i < 5; i++) {
      r1.push({
        tag: getTag(5),
        value: Math.random() * 100,
        proportion: Math.random() * 10,
      }); 
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          main: {
            sales: r,
            orderQuantity: r1,
            profit: r2,
          },
          flow: {
            conversionsRate: r1,
            pageView: r,
            session: r2,
          },
          ad: {
            adSales: r2,
            adOrderQuantity: r1,
            spend: r,
          },
        },
      });
    }, 500);
  },

  // 产品线-表格
  'POST /api/mws/store-report/product-line/page': (req: Request, res: Response) => {
    const { body: { size, current } } = req;
    const item = {
      tag: '标签标签标签标签标签',
      sales: 32423434.1,
      orderQuantity: 57555,
      salesQuantity: 353245,
      cumulativelyOnSaleAsin: 58,
      averageDailySalesQuantity: 345,
      profit: 82345326.2,
      returnQuantity: 86,
      returnRate: 5.2,
      pageView: 12,
      session: 86,
      conversionsRate: 11.1,
      adSales: 1342456,
      adOrderQuantity: 8645,
      spend: 346676.9,
    };
    const records = (new Array(20)).fill('').map(() => {
      return {
        ...item,
        tag: getTag(),
      };
    });
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          total: 10010,
          size,
          current,
          records,
        },
      });
    }, 500);
  },

  // 产品线-表格
  'POST /api/mws/store-report/product-line/tag': (req: Request, res: Response) => {
    // const { body: { tag } } = req;
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          sales: [
            {
              asin: 'B000000000',
              img: '',
              proportion: 35,
              value: 35011,
            }, {
              asin: 'B000000001',
              img: '',
              proportion: 33,
              value: 31011,
            }, {
              asin: 'B000000002',
              img: '',
              proportion: 32,
              value: 31011,
            },
          ],
          orderQuantity: {},
          profit: {},
        },
      });
    }, 500);
  },

  // 地区销售
  'POST /api/mws/store-report/regional': (req: Request, res: Response) => {
    // const { body: { tag } } = req;
    setTimeout(() => {
      res.send({
        code: 200,
        data: [
          {
            'state': 'Indiana',
            'quantity': '2',
            'sales': '5',
          },
          {
            'state': 'Kentucky',
            'quantity': '1',
            'sales': '1',
          },
          {
            'state': 'California',
            'quantity': '8',
            'sales': '13',
          },
          {
            'state': 'Florida',
            'quantity': '1',
            'sales': '5',
          },
          {
            'state': 'New Jersey',
            'quantity': '1',
            'sales': '1',
          },
          {
            'state': 'Virginia',
            'quantity': '1',
            'sales': '1',
          },
          {
            'state': 'North Carolina',
            'quantity': null,
            'sales': '1',
          },
          {
            'state': 'New York',
            'quantity': null,
            'sales': '3',
          },
          {
            'state': 'Ms',
            'quantity': null,
            'sales': '1',
          },
          {
            'state': 'Tennessee',
            'quantity': null,
            'sales': '4',
          },
          {
            'state': 'Oklahoma',
            'quantity': null,
            'sales': '1',
          },
          {
            'state': 'Alabama',
            'quantity': null,
            'sales': '1',
          },
          {
            'state': 'South Carolina',
            'quantity': null,
            'sales': '1',
          },
          {
            'state': 'Utah',
            'quantity': null,
            'sales': '2',
          },
          {
            'state': 'Massachusetts',
            'quantity': null,
            'sales': '1',
          },
          {
            'state': 'Illinois',
            'quantity': null,
            'sales': '2',
          },
          {
            'state': 'Texas',
            'quantity': null,
            'sales': '14',
          },
          {
            'state': 'Ohio',
            'quantity': null,
            'sales': '1',
          },
          {
            'state': 'Washington',
            'quantity': '1',
            'sales': null,
          },
          {
            'state': 'Nevada',
            'quantity': '5',
            'sales': null,
          },
          {
            'state': 'Arizona',
            'quantity': '14',
            'sales': null,
          },
        ],
      });
    }, 500);
  },
};
