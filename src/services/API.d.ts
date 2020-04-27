declare namespace API {
  // 返回数据
  interface IDataResponse {
    status: number;
    data: object;
  }
  // 返回操作反馈信息
  interface IMsgResponse {
    status: number;
    msg: string;
  }
}

interface IQueryCurrent extends API.IDataResponse {
  data: {
    name: string;
  };
}
