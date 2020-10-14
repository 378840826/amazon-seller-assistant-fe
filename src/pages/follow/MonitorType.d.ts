declare namespace MonitorType {
  interface IMontorRowProduct {
    asin: string;
    fulfillmentChannel: string;
    price: number;
    title: string;
    imgUrl: string;
    followMonitorId: string;
  }

  interface IMonitorDataSource {
    monitorSwitch: boolean;
    updateTime: string;
    productInfo: IMontorRowProduct;
    monitorCount: number;
  }

  interface IMonitorInitResponse {
    records: IMonitorDataSource[];
    total: number;
    current: number;
    size: number;
  }

  interface IHistoryRecordsType {
    snapshotTime: string;
  }

  interface IHistoryTableType {
    code: number;
    data: {
      productInfo: IMontorRowProduct;
      page: {
        records: IHistoryRecordsType[];
        total: number;
        current: number;
        size: number;
      };
    };
  }

  interface IFollowTableType {
    code: number;
    data: {
      productInfo: IMontorRowProduct;
      page: {
        records: IHistoryRecordsType[];
        total: number;
        current: number;
        size: number;
      };
    };
  }
}
