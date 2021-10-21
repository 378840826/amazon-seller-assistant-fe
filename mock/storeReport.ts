import { Response, Request } from 'express';

export default {
  'GET /api/mws/store-report/list': (_: Request, res: Response) => {
    const item = {
      storeId: '11',
      storeName: '店铺名称11',
      marketplace: 'US',
      currency: '$',
      totalSales: 22,
      totalSalesRingRatio: 33,
      totalOrderQuantity: 44,
      totalOrderQuantityRingRatio: 55,
      totalSalesQuantity: 66,
      totalSalesQuantityRingRatio: 77,
      cumulativelyOnSaleAsin: 88,
      cumulativelyOnSaleAsinRingRatio: 99,
      avgEachAsinOrder: 10,
      avgEachAsinOrderRingRatio: 11,
      grossProfit: 12,
      grossProfitRingRatio: 13,
      grossProfitRate: 14,
      grossProfitRateRingRatio: 15,
      salesQuantityExceptOrderQuantity: 16,
      salesQuantityExceptOrderQuantityRingRatio: 17,
      avgSellingPrice: 18,
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
    };
    const list = (new Array(10)).fill('').map((_: '', i: number) => {
      return {
        ...item,
        storeId: `1${i}`,
      };
    });
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          updateTime: '2020-12-08 16:41:25 (太平洋时间)',
          totalIndicators: {
            totalSales: null,
            totalOrderQuantity: 20040447,
            totalSalesQuantity: 63639373,
            cumulativelyOnSaleAsin: 1159255,
            avgEachAsinOrder: 57634600,
            grossProfit: 96874269,
            grossProfitRate: 57230697,
            salesQuantityExceptOrderQuantity: 92638200,
            avgSellingPrice: 68655677,
            avgCustomerPrice: 22140687,
            preferentialOrderQuantity: 15786600,
            associateSales: 15996324,
            pageView: 14243328,
            session: 70018582,
            pageViewExceptSession: 95895823,
            conversionsRate: 98386123,
            returnQuantity: 4774117,
            returnRate: 7255567,
            b2bSales: 50905631,
            b2bOrderQuantity: 47257802,
            b2bSalesQuantity: 81902072,
            b2bSalesQuantityExceptOrderQuantity: 23301645,
            b2bAvgSellingPrice: 55013518,
            b2bAvgCustomerPrice: 38542242,
            adSales: 10010,
            naturalSales: 28997948,
            adOrderQuantity: 3840339,
            naturalOrderQuantity: 79600436,
            cpc: 23576279,
            cpa: 1177102,
            cpm: 92920124,
            spend: 16486197,
            acos: 89263204,
            compositeAcos: 2333,
            roas: 28730637,
            compositeRoas: 34348928,
            impressions: 18850725,
            clicks: 70027571,
            ctr: 94792112,
            adConversionsRate: 100,
            // 占比合计
            b2bSalesProportion: 111111,
            adSalesProportion: 10086,
            naturalSalesProportion: 33333,
            adOrderQuantityProportion: 44444,
            naturalOrderQuantityProportion: 55555,
          },
          storeDatas: [
            {
              storeId: '1',
              storeName: '店铺名称1',
              marketplace: 'JP',
              currency: '￥',
              totalSales: null,
              totalSalesRingRatio: -3.1,
              totalOrderQuantity: 4,
              totalOrderQuantityRingRatio: 5,
              totalSalesQuantity: 6,
              totalSalesQuantityRingRatio: 7,
              cumulativelyOnSaleAsin: 8,
              cumulativelyOnSaleAsinRingRatio: 9,
              avgEachAsinOrder: 10,
              avgEachAsinOrderRingRatio: 11,
              grossProfit: 12,
              grossProfitRingRatio: 13,
              grossProfitRate: 14,
              grossProfitRateRingRatio: 15,
              salesQuantityExceptOrderQuantity: 16,
              salesQuantityExceptOrderQuantityRingRatio: 17,
              avgSellingPrice: 18,
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
              returnRate: null,
              returnRateRingRatio: null,
              b2bSales: 38,
              b2bSalesRingRatio: 39,
              b2bSalesProportion: 40.4,
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
            },
            ...list,
          ],
        },
      });
    }, 500);
  },

  // 地区、站点、店铺
  'POST /api/mws/profit/store/screen': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          marketplaceList: ['FR', 'US', 'JP', 'ES', 'IT', 'DE', 'CA', 'UK'],
          regionList: [
            { region: 'EU', chinesRegion: '欧洲' },
            { region: 'NA', chinesRegion: '北美' },
            { region: 'AS', chinesRegion: '亚太' },
          ], 
          storeNameList: [
            'Segbeauty', 'Sandbox_EnpointSandbox_Enpoint', 'Segarty', 'Droking', 'Suream', 'EnPoint', 'DROK',
          ],
        },
      });
    }, 500);
  },
};
