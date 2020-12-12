/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-07-22 14:10:52
 * @LastEditors: Please set LastEditors
 * @FilePath: \amzics-react\src\pages\asinPandect\Order\AsinOrder.d.ts
 */ 
declare namespace AsinOrder {
  // dva 仓库中拿出来的选中店铺
  interface IGlobalAsinTYpe {
    asinGlobal: {
      asin: string;
    };
  }

  // dva state
  interface IStateType {
    initData: {};
    doufuSelectColor: string[];
    dfCheckedTypes: string[];
  }
  // dva state
  interface IDFChecke {
    asinOrder: IStateType;
  }

  interface IPageType {
    current: number;
    size: number;
    total: number;
  }

  interface ITotalType {
    sales?: number;
    orderQuantity?: number;
    salesQuantity?: number;
    couponOrderQuantity?: number;
    avgPrice?: number;
    pct?: number;
    salesQuantityDivOrderQuantity?: number;
    sessions?: number;
    takeRates?: number;
    pageView?: number;
    pageViewsDivSessions?: number;
    relatedSalesFrequency?: number;
  }

  interface ITableResType {
    data: {
      page: {
        current: number;
        size: number;
        total: number;
        records: [];
      };
      total: ITotalType;
    };
  }

  interface IDouFuListTyep {
    show: boolean;
    label: string;
    value: string;
    data: number;
    lastData: number;
    ratio: number;
  }

  interface ILineChartsDataType {
    polylineX: string[];
      sales: string[];
      salesQuantity: string[];
      couponOrderQuantity: string[];
      pct: string[];
      salesQuantityDivOrderQuantity: string[];
      session: string[];
      takeRates: string[];
      pageViews: string[];
      pageViewsDivSessions: string[];
      relatedSalesFrequency: string[];
      avgPrice: string[];
      orderQuantity: string[];
  }

  interface ILineChartData {
    thisPeriod: ILineChartsDataType;
    firstHalf: ILineChartsDataType;
    firstWeekOrMonthHalf: ILineChartsDataType;
    skuThisPeriods: {
      sku: string;
      thisPeriod: ILineChartsDataType;
    };
  }

  interface ILineChartProps {
    ishc: boolean;
    isweekMonth: boolean;
    datas: ILineChartData;
    weekOrMonth: string;
    skus: string[];
  }

  interface ILineChartsTooltip {
    seriesName: string;
    value: string;
    axisValue: string;
    color: string;
    dataIndex: number;
    weekMonthXData: string[];
  }
}
