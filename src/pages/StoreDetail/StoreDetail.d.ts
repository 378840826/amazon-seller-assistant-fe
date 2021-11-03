declare namespace StoreDetail {
  interface IData {
    totalSales: number;
    totalOrderQuantity: number;
    totalSalesQuantity: number;
    cumulativelyOnSaleAsin: number;
    avgEachAsinOrder: number;
    grossProfit: number;
    grossProfitRate: number;
    salesQuantityExceptOrderQuantity: number;
    avgSellingPrice: number;
    avgCustomerPrice: number;
    preferentialOrderQuantity: number;
    associateSales: number;
    pageView: number;
    session: number;
    pageViewExceptSession: number;
    conversionsRate: number;
    returnQuantity: number;
    returnRate: number;
    b2bSales: number;
    b2bSalesProportion: number;
    b2bOrderQuantity: number;
    b2bSalesQuantity: number;
    b2bSalesQuantityExceptOrderQuantity: number;
    b2bAvgSellingPrice: number;
    b2bAvgCustomerPrice: number;
    adSales: number;
    adSalesProportion: number;
    naturalSales: number;
    naturalSalesProportion: number;
    adOrderQuantity: number;
    adOrderQuantityProportion: number;
    naturalOrderQuantity: number;
    naturalOrderQuantityProportion: number;
    cpc: number;
    cpa: number;
    cpm: number;
    spend: number;
    acos: number;
    compositeAcos: number;
    roas: number;
    compositeRoas: number;
    impressions: number;
    clicks: number;
    ctr: number;
    adConversionsRate: number;
  }

  // 折线图数据
  interface IPolylineData {
    [key: string]: { value: number; time: string }[];
  }

  // 统计周期
  type PeriodType = 'DAY' | 'WEEK' | 'MONTH';

  // 数据源
  type DataOrigin = '' | 'fba' | 'fbm' | 'b2b';
}
