declare namespace AsinTable {
  import { 
    IAsinTableState,
    ConnectProps,
  } from 'umi';

  interface IDvaState extends ConnectProps {
    asinTable: IAsinTableState;
  }

  interface ISkuinfo {
    price: number;
    sku: string;
    sellable: string;
    listingStatus: string;
    fulfillmentChannel: string;
  }

  interface IChildSummaryType {
    totalSales: number;
    totalOrderQuantity: number;
    totalSalesQuantity: number;
    replyReviewRate: number;
    profit: number;
    profitRate: number;
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
    b2bOrderQuantity: number;
    b2bSalesQuantity: number;
    b2bSalesQuantityExceptOrderQuantity: number;
    b2bAvgSellingPrice: number;
    b2bAvgCustomerPrice: number;
    adSales: number;
    skuAdSales: number;
    naturalSales: number;
    adOrderQuantity: number;
    skuAdOrderQuantity: number;
    naturalOrderQuantity: number;
    cpc: number;
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

  interface IChildResocds {
    imgUrl: string;
    title: string;
    asin: string;
    categoryRanking: number;
    categoryName: string;
    totalSalesRingRatio: number;
    totalOrderQuantityRingRatio: number;
    totalSalesQuantityRingRatio: number;
    replyReviewRateRingRatio: number;
    profitRingRatio: number;
    profitRateRingRatio: number;
    salesQuantityExceptOrderQuantityRingRatio: number;
    avgSellingPriceRingRatio: number;
    avgCustomerPriceRingRatio: number;
    preferentialOrderQuantityRingRatio: number;
    associateSalesRingRatio: number;
    pageViewRingRatio: number;
    sessionRingRatio: number;
    pageViewExceptSessionRingRatio: number;
    conversionsRateRingRatio: number;
    returnQuantityRingRatio: number;
    returnRateRingRatio: number;
    b2bSalesRingRatio: number;
    b2bOrderQuantityRingRatio: number;
    b2bSalesQuantityRingRatio: number;
    b2bSalesQuantityExceptOrderQuantityRingRatio: number;
    b2bAvgSellingPriceRingRatio: number;
    b2bAvgCustomerPriceRingRatio: number;
    adSalesRingRatio: number;
    skuAdSalesRingRatio: number;
    naturalSalesRingRatio: number;
    adOrderQuantityRingRatio: number;
    skuAdOrderQuantityRingRatio: number;
    naturalOrderQuantityRingRatio: number;
    cpcRingRatio: number;
    spendRingRatio: number;
    acosRingRatio: number;
    compositeAcosRingRatio: number;
    roasRingRatio: number;
    compositeRoasRingRatio: number;
    impressionsRingRatio: number;
    clicksRingRatio: number;
    ctrRingRatio: number;
    adConversionsRateRingRatio: number;
  }

  interface IParentResocds {
    parentAsin: string;
    childAsinInfo: {
      imgUrl: string;
      asin: sring;
      title: sring;
      categoryName: sring;
      categoryRanking: number;
      asin: sring;
      totalSales: number;
      totalOrderQuantity: number;
      totalSalesQuantity: number;
      replyReviewRate: number;
      profit: number;
      profitRate: number;
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
      b2bSalesQuantity: number;
      b2bOrderQuantity: number;
      b2bSalesQuantityExceptOrderQuantity: number;
      b2bAvgSellingPrice: number;
      b2bAvgCustomerPrice: number;
      skuInfo: {
        sku: string;
        sellable: string;
        fulfillmentChannel: string;
        price: string;
        listingStatus: string;
      }[];
    }[];
    parentAsinSubTotal: {
      totalSales: string;
      totalOrderQuantity: string;
      totalSalesQuantity: string;
      replyReviewRate: string;
      profit: string;
      profitRate: string;
      salesQuantityExceptOrderQuantity: string;
      avgSellingPrice: string;
      avgCustomerPrice: string;
      preferentialOrderQuantity: string;
      associateSales: string;
      pageView: string;
      session: string;
      pageViewExceptSession: string;
      conversionsRate: string;
      returnQuantity: string;
      returnRate: string;
      b2bSales: string;
      b2bSalesProportion: string;
      b2bSalesQuantity: string;
      b2bOrderQuantity: string;
      b2bSalesQuantityExceptOrderQuantity: string;
      b2bAvgSellingPrice: string;
      b2bAvgCustomerPrice: string;
    };
  }

  interface IParentInitListType {
    costAndFreightStatus: string;
    updateTime: string;
    page: {
      total: number;
      pages: number;
      current: number;
      size: number;
      records: IParentResocds[];
    };
  }

  interface ITableValues {
    total: number;
    pages: number;
    current: number;
    size: number;
    records: IChildResocds[];
    order: string;
    asc: boolean;
  }

  interface IChildAsinInitValues {
    updateTime: string;
    costAndFreightStatus: string;
    totalIndicators: IChildSummaryType;
    page: ITableValues;
  }

  interface IChildRsType {
    imgUrl: string;
    title: string;
    asin: string;
    sku: string;
    price: string;
    categoryName: string;
    categoryRanking: number;
    associateSalesTimes: number;
  }
  
  interface IChildAsinColsProps {
    ratio: boolean;
    currency: string;
    order: string;
    marketplace: string;
    parentCol?: {};
    childCustomcol: string[];
    site: 'US' | 'CA' | 'UK' | 'DE' | 'FR' | 'ES' | 'IT';
    sortCallback: (order: string, sort: boolean) => void;
  }

  type IDefineType = 'int'|'decimal'|'grade'|'other'; // 限定是 int(整) 小数(decimal) 评分(grade) other占位
  interface IFieldsType {
    headText?: string; // 标题
    label?: string | React.ReactNode; // 文本
    field?: string; // 后端的字段
    percent?: boolean; // 该列是否有百分比（%）
    defineType: IDefineType; 
  }

  interface IParentAsinColsProps {
    currency: string;
    order: string;
    parentCol?: {};
    parentCustomcol: string[];
    sortCallback: (order: string, sort: boolean) => void;
  }

  interface IFiltrateList {
    label: string;
    min: string;
    max: string;
  }

  interface IParentChildTotal {
    totalSales: number;
    totalOrderQuantity: number;
    totalSalesQuantity: number;
    replyReviewRate: number;
    profit: number;
    profitRate: number;
    salesQuantityExceptOrderQuantity: number;
    avgSellingPrice: number.number;
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
    b2bSalesQuantity: number;
    b2bOrderQuantity: number;
    b2bSalesQuantityExceptOrderQuantity: number;
    b2bAvgSellingPrice: number;
    b2bAvgCustomerPrice: number;
  }

  // 父ASIN - 子ASIN的数据
  interface IParentChildAsin {
    imgUrl: string;
    title: string;
    asin: string;
    skuInfo: {
      sku: string;
      sellable: string;
      fulfillmentChannel: string;
      price: number;
      listingStatus: string;
    }[];
    categoryName: string;
    categoryRanking: number;
    totalSales: number;
    totalOrderQuantity: number;
    totalSalesQuantity: number;
    replyReviewRate: number;
    profit: number;
    profitRate: number;
    salesQuantityExceptOrderQuantity: number;
    avgSellingPrice: number.number;
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
    b2bSalesQuantity: number;
    b2bOrderQuantity: number;
    b2bSalesQuantityExceptOrderQuantity: number;
    b2bAvgSellingPrice: number;
    b2bAvgCustomerPrice: number;
  }
}
