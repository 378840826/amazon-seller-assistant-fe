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
    allUnReadCount: number;
    followUnReadCount: number;
  }

  interface ICurrentUser {
    id: number;
    username: string;
    email: string;
    phone: string;
    openId: string;
    topAccount: boolean;
    memberExpirationDate: string;
    memberExpired: boolean;
    memberFunctionalSurplus: { functionName: string; frequency: number }[];
  }

  export type Site = 'US' | 'CA' | 'UK' | 'DE' | 'FR' | 'ES' | 'IT' | 'JP';

  interface IShop {
    id: string;
    storeName: string;
    marketplace: Site;
    sellerId: string;
    token: string;
    autoPrice: boolean;
    timezone: string;
    currency: string;
    tokenInvalid: boolean;
    adAuthorize: boolean;
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

  interface IErrorReport {
    id: string;
    importTime: string;
    count: number;
    errorDesc: string;
  }

  interface IGroup {
    id: string;
    groupName: string;
  }

  interface IInventoryReplenishmentLabels {
    id: string;
    labelName: string;
  }

  interface IInventoryReplenishment {
    asin: string;
    sku: string;
    fnSku: string;
    sharedState: number;
    lastModifiedTime: string;
    skuStatus: string;
    newProduct: boolean;
    title: string;
    url: string;
    img: string;
    listingStatus: string;
    openDate: string;
    reviewScore: number;
    reviewCount: number;
    sellable: number;
    totalInventory: number;
    inTransitInventory: number;
    reservedAvailable: number;
    orderCount7day: number;
    orderCount30day: number;
    orderCount15day: number;
    orderCount7dayRatio: number;
    orderCount30dayRatio: number;
    orderCount15dayRatio: number;
    orderSevenNumRatioSub: number;
    orderFifteenNumRatioSub: number;
    orderThirtyNumRatioSub: number;
    orderSalesCount30day: number;
    orderSalesCount7day: number;
    orderSalesCount15day: number;
    orderSalesCount30dayRatio: number;
    orderSalesCount7dayRatio: number;
    orderSalesCount15dayRatio: number;
    salesSevenNumRatioSub: number;
    salesFifteenNumRatioSub: number;
    salesThirtyNumRatioSub: number;
    stockingCycle: number;
    firstPass: number;
    totalInventoryAvailableDays: number;
    availableDaysOfExistingInventory: number;
    estimatedOutOfStockTime: string;
    recommendedReplenishmentVolume: number;
    shippingMethodsList: string[];
    labels: ILabel[];
    // 用于设置
    labelIds?: string[];
  }

  interface IInventoryReplenishmentSetting {
    skuStatus: string;
    avgDailySalesRules: number;
    fixedSales: number;
    weightCount90sales: string;
    weightCount60sales: string;
    weightCount30sales: string;
    weightCount15sales: string;
    weightCount7sales: string;
    labels: IInventoryReplenishmentLabels[];
    shippingMethods: string[];
    safeDays: string;
    firstPass: string;
    qualityInspection: string;
    purchaseLeadTime: string;
    shoppingList: string;
    // 用于设置
    labelIds?: string[];
  }

  // BI 诊断(看板)
  interface IFisKanban {
    asin: string;
    sku: string;
    img: string;
    availableDays: number;
  }

  interface IAjKanban {
    ruleName: string;
    ajFrequency: number;
  }

  interface IFollowKanban {
    monitoringCount: number;
    followAsinCount: number;
    followAsinNotJoninBuyboxAj: number;
    buyboxLostAsinCount: number;
    buyboxLostAsinNotJoninBuyboxAj: number;
  }

  interface IBuyboxPercentage {
    asin: string;
    sku: string;
    img: string;
    isJoinFollowMonitoring: boolean;
    buyboxPercentage: number;
  }

  interface IBuyboxPercentageKanban {
    buyboxPercentage: IBuyboxPercentage[];
    lastTime: string;
    reportId: string;
  }

  interface IMailKanban {
    unMailNumber: number;
    urgentMailTimeLeftHours: number;
    urgentMailTimeLeftMinute: number;
  }

  interface IReviewKanban {
    oneStar: number;
    oneStarUnanswered: number;
    twoStar: number;
    twoStarUnanswered: number;
    threeStar: number;
    threeStarUnanswered: number;
    fourStar: number;
    fourStarUnanswered: number;
    fiveStar: number;
    fiveStarUnanswered: number;
  }

  interface IFeedbackKanban {
    oneStar: number;
    twoStar: number;
    threeStar: number;
  }

  interface IKanbanAsinInfos {
    asin: string;
    sku: string;
    img: string;
    addKeyword: string;
    titleNotIncluded: string[];
    bpNotIncluded: string[];
    descriptionNotIncluded: string[];
  }
  interface IAcKeywordKanban {
    asinInfos: IKanbanAsinInfos[];
    lastTime: string;
  }

  interface IAdKeywordKanban {
    adCampaignsName: string;
    adGroupName: string;
    acos: number;
    keyword: string;
  }

  interface IAdIneligibleKanban {
    asin: string;
    sku: string;
    img: string;
    Ineligible: string;
  }

  interface IBiBoard {
    fisKanban: IFisKanban[];
    ajKanban: IAjKanban[];
    followKanban: IFollowKanban;
    buyboxPercentageKanban: IBuyboxPercentageKanban;
    mailKanban: IMailKanban;
    reviewKanban: IReviewKanban;
    feedbackKanban: IFeedbackKanban;
    acKeywordKanban: IAcKeywordKanban;
    adKeywordKanban: IAdKeywordKanban[];
    adIneligibleKanban: IAdIneligibleKanban[];
  }

  interface ILabel {
    id: string;
    labelName: string;
  }

  interface ITransitDetails {
    shipmentId: string;
    shipmentName: string;
    createTime: string;
    updateTime: string;
    shippedQuantity: number;
    receivedQuantity: number;
    inTransitQuantity: number;
    destination: string;
    status: string;
    estimatedArrival: string;
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
