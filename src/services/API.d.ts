/**
 * 全局对象，api 接口的数据类型
 */

declare namespace API {
  // 目前 TS 版本中，此处的 IParams 类型,若是在 models 中的生成器中调用, TS 没有类型检查
  interface IParams {
    [key: string]: unknown;
  }
  
  interface IUnreadNotices {
    reviewRemindCount: number;
    stockRemindCount: number;
    allUnReadCount: number;
  }

  interface ICurrentUser {
    id: number;
    username: string;
    email: string;
    phone: string;
    isMainAccount: boolean;
  }

  interface IShop {
    id: string;
    storeName: string;
    marketplace: string;
    sellerId: string;
    token: string;
    autoPrice: boolean;
    timezone: string;
    currency: string;
    tokenInvalid: boolean;
  }
}
