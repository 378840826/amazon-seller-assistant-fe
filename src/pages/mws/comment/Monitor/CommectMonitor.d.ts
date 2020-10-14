/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-13 15:03:11
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-09-15 09:47:40
 * @FilePath: \amzics-react\src\pages\mws\comment\Monitor\CommectMonitor.d.ts
 */ 

declare namespace CommectMonitor {
  import { Location } from 'umi';

  interface ILocation extends Location {
    query?: {
      asin: string; 
    };
  }

  interface IPageProps {
    commentTableData: ICommentMonitorState;
  }

  interface IRequestDataType {
    stars: number[];
    status: string;
    current: number;
    size: number;
    dateStart: string;
    dateEnd: string;
    asin?: string;
    headersParams: {
      StoreId: string|number;
    };
  }

  interface IMonitorToolProps {
    // 父组件的回调函数、接收子组件所有字段数据
    handleToolbar: (param: {}, type: string) => void;
    asin?: string;
  }

  // 表格行的数据类型
  interface IRowDataType {
    starPart: {
      one: number;
      oneStarLink: string;
      two: number;
      twoStarLink: string;
      three: number;
      threeStarLink: string;
      four: number;
      fourStarLink: string;
      five: number;
      fiveStarLink: string;
    };
    handled: boolean;
    hasOrder: boolean;
    reviewScore: string;
    reviewNum: number;
    asin: string;
    reviewerName: string;
  }

  // 工具栏的字段
  interface IMonitorToolBarFieldsType {
    stars: number[];
    status: string;
    asin: string;
    scopeMin: string;
    scopeMax: string;
    dateStart: string;
    dateEnd: string;
    reviewerName: string;
    reviewsNumMin: string;
    reviewsNumMax: string;
  }

  interface IOrderType {
    orderValue: string;
    value: string;
    title?: string;
    isTabBoolean?: boolean;
    tip?: string;
    defaultSort?: string;
    callback?: (param: {value: string; order: string|boolean}) => void;
  }
}
