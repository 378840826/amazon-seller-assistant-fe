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
    topAccount: boolean;
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

  interface IStoreList{
    sellerId: string;
    storeName: string;
    marketplace: string;
  }

  interface IStore{
    sellerId: string;
    marketplace: string;
  }
  interface IUserList{
    id: string;
    username: string;
    email: string;
    stores: Array<IStore>;
  }
}
