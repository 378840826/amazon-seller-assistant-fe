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
    bindAdStore: boolean;
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

  // 广告管理
  type AdState = 'enabled' | 'paused' | 'archived';
  type GroupType = 'keyword' | 'targeting';
  type CamType = 'sb' | 'sp' | 'sd';
  type AdKeywordMatchType = 'exact' | 'phrase' | 'broad';
  type AdNegativeKeywordMatchType = 'negativeExact' | 'negativePhrase';
  /** 手动manual，自动auto，分类/商品T00020，受众T00030 */
  type CamTargetType = 'manual' | 'auto' | 'T00020' | 'T00030';
  // 广告管理-广告活动
  interface IAdCampaign {
    id: string;
    name: string;
    state: AdState;
    portfolioId: number;
    portfolioName: string;
    groupCount?: number;
    adType: CamType;
    targetingType: string;
    dailyBudget: number;
    negativeTargetCount?: number;
    impressions: number;
    clicks: number;
    spend: number;
    acos: number;
    roas: number;
    ctr: number;
    cpc: number;
    cpa: number;
    sales: number;
    orderNum: number;
    conversionsRate: number;
    biddingStrategy: string;
    biddingPlacementTop: number;
    biddingPlacementProductPage: number;
    createdTime: string;
    startTime: string;
    endTime: string;
  }

  // 广告管理-广告活动分组
  interface IPortfolio {
    id: string;
    name: string;
  }

  // 广告管理-广告组
  interface IAdGroup {
    id: string;
    name: string;
    camId: string;
    camName: string;
    camState: AdState;
    camType: CamType;
    campaignTargetType: CamTargetType;
    groupType: GroupType;
    state: AdState;
    negativeTargetCount?: number;
    targetCount: number;
    productCount: number;
    defaultBid: number;
    budgetLimit: number;
    impressions: number;
    clicks: number;
    spend: number;
    acos: number;
    roas: number;
    ctr: number;
    cpc: number;
    cpa: number;
    sales: number;
    orderNum: number;
    conversionsRate: number;
    createdTime: string;
    startTime: string;
    endTime: string;
  }

  // 广告管理-广告组-自动广告组target
  interface IAdAutoGroupTarget {
    id: string;
    state: AdState;
    bid: number;
    recommendBid: number;
    recommendBidStart: number;
    recommendBidEnd: number;
    target: string;
    impressions: number;
    clicks: number;
    spend: number;
    acos: number;
    roas: number;
    ctr: number;
    cpc: number;
    cpa: number;
    sales: number;
    orderNum: number;
    conversionsRate: number;
  }

  // 广告管理-广告
  interface IAd {
    id: string;
    // name: string;
    camId: string;
    camName: string;
    camState: AdState;
    camType: CamType;
    groupId: string;
    groupName: string;
    groupType: GroupType;
    state: string;
    qualification: string;
    qualificationMessage: string;
    asin: string;
    sku: string;
    title: string;
    img: string;
    addTime: string;
    impressions: number;
    clicks: number;
    spend: number;
    acos: number;
    roas: number;
    ctr: number;
    cpc: number;
    cpa: number;
    sales: number;
    orderNum: number;
    conversionsRate: number;
    campaignTargetType: CamTargetType;
  }

  // 广告管理-Targeting/关键词
  interface IAdTargeting {
    id: string;
    keywordName: string;
    camId: string;
    camName: string;
    camState: AdState;
    camType: CamType;
    groupId: string;
    groupName: string;
    groupType: GroupType;
    state: string;
    targeting: string;
    expression?: string;
    matchType: AdKeywordMatchType;
    suggested: number;
    rangeStart: number;
    rangeEnd: number;
    bid: number;
    addTime: string;
    campaignTargetType: CamTargetType;
    impressions: number;
    clicks: number;
    spend: number;
    acos: number;
    roas: number;
    ctr: number;
    cpc: number;
    cpa: number;
    sales: number;
    orderNum: number;
    conversionsRate: number;
    // 涨跌幅比例
    impressionsRatio: number;
    clicksRatio: number;
    spendRatio: number;
    acosRatio: number;
    roasRatio: number;
    ctrRatio: number;
    cpcRatio: number;
    cpaRatio: number;
    salesRatio: number;
    orderNumRatio: number;
    conversionsRateRatio: number;
  }

  // 否定Targeting
  interface IAdNegativeTargeting {
    neTargetId: string;
    targetText: string;
    addTime: string;
  }

  // 否定关键词
  interface IAdNegativeKeyword {
    neKeywordId: string;
    keywordText: string;
    matchType: AdNegativeKeywordMatchType;
    addTime: string;
  }

  // 广告管理-SearchTerm
  interface IAdSearchTerm {
    id: string;
    camId: string;
    camName: string;
    camState: AdState;
    camType: CamType;
    campaignTargetType: CamTargetType;
    groupId: string;
    groupName: string;
    groupType: GroupType;
    groupBid: number;
    /** searchTerm 类型 true: asin false: 关键词 */
    queryKeywordType: boolean;
    matchType: AdKeywordMatchType;
    keywordText: string;
    keywordId: string;
    deliveryStatus: 'alreadyLive' | 'noAlready';
    queryKeyword: string;
    existQueryKeyword?: {
      keyword: string;
      exist: boolean;
    }[];
    // 搜索词的竞价
    queryKeywordBid: number;
    impressions: number;
    clicks: number;
    spend: number;
    acos: number;
    roas: number;
    ctr: number;
    cpc: number;
    cpa: number;
    sales: number;
    orderNum: number;
    conversionsRate: number;
  }

  // 广告管理-操作记录
  interface IAdOperationRecord {
    id: string;
    behaviorDate: string;
    objectType: string;
    objectInfo: string;
    behaviorInfo: string;
    oldValue: string;
    newValue: string;
    behaviorExecutor: string;
  }

  // 广告管理-数据分析-折线图
  interface IAdChartsPolylineCell {
    value: number;
    time: string;
  }

  interface IAdChartsPolyline {
    impressions?: IAdChartsPolylineCell[];
    clicks?: IAdChartsPolylineCell[];
    spend?: IAdChartsPolylineCell[];
    acos?: IAdChartsPolylineCell[];
    roas?: IAdChartsPolylineCell[];
    ctr?: IAdChartsPolylineCell[];
    cpc?: IAdChartsPolylineCell[];
    cpa?: IAdChartsPolylineCell[];
    sales?: IAdChartsPolylineCell[];
    orderNum?: IAdChartsPolylineCell[];
    conversionsRate?: IAdChartsPolylineCell[];
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
    roleList: Array<string>;
    state: boolean;
  }
}
