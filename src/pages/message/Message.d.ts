declare namespace Message {
  interface IGlobalNotCount {
    global: {
      unreadNotices: {
        reviewRemindCount: number;
        stockRemindCount: number;
        allUnReadCount: number;
        followUnReadCount: number;
      };
    };
  }
  interface IResponseType {
    code: number;
    data: {
      records: [];
      current: number;
      total: number;
      size: number;
      msg: string;
    };
  }

  // 评论消息
  interface IReviewData {
    type: string;
    asin: string;
    asinUrl: string;
    star: number;
    reviewTime: string;
    reviewerName: string;
    reviewContent: string;
    reviewLink: string;
    gmtCreate: string;
    handled: boolean;
    id: number;
  }

  // 跟卖监控数据
  interface IFollowDataType {
    asin: string;
    followSellerQuantity: number;
    buyboxOccupied: boolean;
    catchDate: string;
    catchTime: string;
    id: string;
    followMonitorHistoryId: string;
    followSellers: {
      sellerName: string;
      sellerLink: string;
      sellerId: string;
      fulfillmentChannel: string;
      price: string;
      shippingFee: number;
    }[];
  }

  interface IAllMessage {
    type: string;
    review: IReviewData;
    follow: IFollowDataType;
  }
  
  interface IStateType {
    messageModel: {
      allMessage: {
        code: number;
        records: [];
        size: number;
        current: number;
        total: number;
      };
      reviewMessage: {
        code: number;
        records: [];
        size: number;
        current: number;
        total: number;
      };
      followMessage: {
        records: [];
        size: number;
        current: number;
        total: number;
      };
    };
  }

  interface IReviewDataType {
    code: number;
    data: {
      records: {}[];
      current: number;
      total: number;
      size: number;
      msg: string;
    };
  }

  interface IGlobalCurrent {
    global: {
      shop: {
        current: {
          id: string|number;
        };
      };
    };
  }
}
