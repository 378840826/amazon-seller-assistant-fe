declare namespace AsinB2B {
  // dva state
  interface IStateType {
    initData: {};
    doufuSelectColor: string[];
    dfCheckedTypes: string[];
  }

  // dva state
  interface IDFChecke {
    asinB2B: IStateType;
  }

  interface IDouFuListTyep {
    show: boolean;
    label: string;
    value: string;
    data: number;
    lastData: number;
    ratio: number;
  }

  interface ILineChartProps {
    ishc: boolean;
    isweekMonth: boolean;
    datas: ILineChartData;
    weekOrMonth: string;
  }

  interface IGlobalAsinType {
    asinGlobal: {
      asin: string;
    };
  }

  interface ILineChartsTooltip {
    seriesName: string;
    value: string;
    axisValue: string;
    color: string;
    dataIndex: number;
    weekMonthXData: string[];
  }

  interface ILineChartData {
    thisPeriod: {
      polylineX: string[];
    };
    firstHalf: {
      polylineX: string[];
    };
    firstWeekOrMonthHalf: {
      polylineX: string[];
    };
  }

  interface IResponse {
    data: {
      lineChart: ILineChartData;
      updateTime: string;
      tofuBlocData: {};
    };
  }
}
