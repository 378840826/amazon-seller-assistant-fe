import { Response, Request } from 'express';

export default {
  // sku asin 豆腐块
  'GET /api/mws/store/detail/asinsku': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          updateTime: '2020-12-08 16:41:25 (太平洋时间)',
          sku: {
            skuTotal: 123456,
            activeSku: 23456,
            inactiveSku: 23456,
            fbaActiveSku: 23456,
            fbaInactiveSku: 23456,
            fbmActiveSku: 23456,
            fbmInactiveSku: 23456,
          },
          asin: {
            asinTotal: 223456,
            buyboxAsin: 3456,
            notBuyboxAsin: 23456,
            '动销率': '36%',
            '在售': 23456,
            '上新': 600,
          },
        },
      });
    }, 500);
  },

  // 整体表现-豆腐块
  'GET /api/mws/store/detail/main/tofu': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          totalSales: 22,
          totalSalesPrevious: 21,
          totalSalesRingRatio: 33,
          totalOrderQuantity: 44,
          totalOrderQuantityPrevious: 43,
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
          avgSellingPriceRingRatio: 19,
          avgCustomerPrice: 20,
          avgCustomerPriceRingRatio: 21,
          preferentialOrderQuantity: 22,
          preferentialOrderQuantityRingRatio: 23,
          associateSales: 24,
          associateSalesRingRatio: 25,
          pageView: 26,
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
          b2bSalesRingRatio: 39,
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
  'GET /api/mws/store/detail/main/polyline': (req: Request, res: Response) => {
    const { query: { dispAttribute } } = req;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr: any[] = Array.isArray(dispAttribute) ? dispAttribute : [dispAttribute];
    const getRandom = () => Math.floor(Math.random() * 100);
    const getRandom1 = () => Math.floor(Math.random() * 100);
    const getRandom2 = () => Math.floor(Math.random() * 100);
    const getRandom3 = () => Math.floor(Math.random() * 100);
    const getRandom4 = () => Math.floor(Math.random() * 1000);
    const getRandom5 = () => Math.floor(Math.random() * 1000);
    const list: {value: number; time: string}[] = [];
    const list1: {value: number; time: string}[] = [];
    const list2: {value: number; time: string}[] = [];
    const list3: {value: number; time: string}[] = [];
    const list4: {value: number; time: string}[] = [];
    const list5: {value: number; time: string}[] = [];
    // const length = Math.floor(Math.random() * 100);
    const length = 50;
    for (let i = 1; i < length + 1; i++) {
      list.push({
        value: getRandom(),
        time: `01-${i}`,
      });
      list1.push({
        value: getRandom1(),
        time: `01-${i}`,
      });
      list2.push({
        value: getRandom2(),
        time: `01-${i}`,
      });
      list3.push({
        value: getRandom3(),
        time: `01-${i}`,
      });
      list4.push({
        value: getRandom4(),
        time: `01-${i}`,
      });
      list5.push({
        value: getRandom5(),
        time: `01-${i}`,
      });
    }
    
    const 本期 = {};
    本期[arr[0]] = list;
    arr[1] && (本期[arr[1]] = list1);

    const 上年同期 = {};
    上年同期[arr[0]] = list2;
    arr[1] && (上年同期[arr[1]] = list3);

    const 上期 = {};
    上期[arr[0]] = list4;
    arr[1] && (上期[arr[1]] = list5);

    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          本期,
          上年同期,
          上月同期: 上期,
          上周同期: 上期,
        },
      });
    }, 500);
  },

  // 整体表现-表格
  'GET /api/mws/store/detail/main/table': (req: Request, res: Response) => {
    const { query: { size, current } } = req;
    const item = {
      totalSales: 22,
      totalOrderQuantity: 44,
      totalSalesQuantity: 66,
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
        time: `2021-02-${i}`,
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
};
