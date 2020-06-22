/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-18 16:52:53
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-19 09:38:22
 * @FilePath: \amzics-react_am_10\src\pages\mws\comment\Settings\CommentSettings.d.ts
 */ 
declare namespace CommectMonitor {
  interface ISearChProps {
    callback: () => void;
  }

  interface IConnectType {
    commectSettings: {
      datas: {
        code: number;
        data: {
          records: [];
          size: number;
          current: number;
          total: number;
        };
      };
    };
  }

  
  interface IRowDataType {
    productInfo: {
      asin: string;
      imgLink: string;
      title: string;
      titleLink: string;
      price: number;
      fulfillmentChannel: string;
    };
    monitoringNumber: number;
    reviewScore: number;
    reviewNum: number;
  }
}
