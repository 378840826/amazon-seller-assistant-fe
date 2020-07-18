/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-18 16:52:53
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-22 22:11:57
 * @FilePath: \amzics-react\src\pages\mws\comment\Settings\CommentSettings.d.ts
 */ 
declare namespace CommectMonitor {
  interface ISearChProps {
    reset?: boolean;
    callback: () => void;
  }

  // 当前店铺信息
  interface ICurrentShopType {
    currency: string;
    id?: string;
  }

  interface IConnectType {
    commectSettings: {
      datas: {
        code: number;
        msg: string;
        data: {
          records: [];
          size: number;
          current: number;
          total: number;
          code: number;
          msg: string;
        };
      };
    };
  }

  interface IGlobalType {
    global: {
      shop: {
        current: {
          id: string;
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
