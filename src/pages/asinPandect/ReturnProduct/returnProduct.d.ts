/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-07-11 15:49:38
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinPandect\returnProduct\returnProduct.d.ts
 */

declare namespace ReturnProduct {
  interface IAsinGlobal {
    asinGlobal: {
      asin: string;
    };
  }

  interface ITooltip {
    axisValueLabel: string;
    seriesName: string;
    data: number;
    color: string;
  } 

  interface IPieTextType {
    percent: number;
    name: string;
  }

  interface IReturnInfo {
    returnQuantity: number;
    lastReturnQuantity: number;
    returnQuantityRatio: string;
    returnRate: number;
    lastReturnRate: number;
    returnRateRatio: string;
  }

  interface ILineChartData {
    dateTime: string;
    returnQuantity: number;
    returnRate: number;
  }

  interface IReturnReason {
    returnQuantity: number;
    reason: string;
    proportion: string;
  }

  interface IResponseType {
    data?: {
      updateTime: string;
    };
    updateTime: string;
    returnInfos: IReturnInfo;
    lineChartDatas: ILineChartData[];
    returnReasons: IReturnReason[];
  }

  interface IEchartsParams {
    name: string;
    selected: {
      '退货量': boolean;
      '退货率': boolean;
    };
  }
}
