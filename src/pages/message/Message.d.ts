declare namespace Message {
  interface IGlobalNotCount {
    global: {
      unreadNotices: {
        reviewRemindCount: number;
        stockRemindCount: number;
        allUnReadCount: number;
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


  interface IStateType {
    messageModel: {
      allMessage: {
        code: number;
        data: {
          records: [];
          size: number;
          current: number;
          total: number;
        };
      };
      reviewMessage: {
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
