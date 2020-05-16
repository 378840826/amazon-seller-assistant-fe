/**
 * 全局对象，api 接口的数据类型
 */

declare namespace API {
  interface IUnreadNotices {
    reviewRemindCount: number;
    stockRemindCount: number;
  }

  interface ICurrentUser {
    id: number;
    username: string;
    email: string;
    phone: string;
    isMainAccount: boolean;
  }

  interface IShop {
    id: number;
    site: string;
    shopName: string;
    sellerId: string;
    token: string;
    switch: boolean;
    currency: string;
    tokenInvalid: boolean;
    timezone: string;
  }
}
