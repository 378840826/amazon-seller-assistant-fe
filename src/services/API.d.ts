/**
 * 全局对象，api 接口的数据类型
 */

declare namespace API {
  // 目前 TS 版本中，此处的 IParams 类型,若是在 models 中的生成器中调用, TS 没有类型检查
  interface IParams {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
  
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

  type fulfillmentChannel = 'FBA' | 'FBM' | '';
  type listingStatus = 'Active' | 'Inactive ' | 'Incomplete' | 'Remove ';
  interface IGoodsRanking {
    categoryId: string;
    categoryName: string;
    categoryRanking: number;
    isTopCategory: false;
  }

  interface IGoods {
    title: string;
    id: string;
    sku: string;
    asin: string;
    url: string;
    fulfillmentChannel: fulfillmentChannel;
    sellable: number;
    price: number;
    postage: number;
    competingCount: number;
    reviewScore: number;
    reviewCount: number;
    commission: number;
    fbaFee: number;
    cost: number;
    freight: number;
    minPrice: number;
    maxPrice: number;
    dayOrder7Count: number;
    dayOrder7Ratio: number;
    dayOrder30Count: number;
    dayOrder30Ratio: number;
    ruleId: string;
    ruleName: string;
    adjustSwitch: boolean;
    acKeyword: string;
    acUrl: string;
    groupId: string;
    groupName: string;
    ranking: IGoodsRanking[];
    listingStatus: listingStatus;
    profitMargin: number;
    profit: number;
    openDate: string;
    sellableDays: number;
    inbound: number;
    imgUrl: string;
    idAdd: boolean;
    isAc: boolean;
    isBs: boolean;
    isNr: boolean;
    isPrime: boolean;
    isPromotion: boolean;
    isCoupon: boolean;
    usedNewSellNum: number;
    isBuyBox: boolean;
    addOnItem: string;
    bsCategory: string;
    nrCategory: string;
    specialOffersProductPromotions: string;
    coupon: string;
    sellerName: string;
  }

  interface IGroup {
    id: string;
    groupName: string;
  }
}
