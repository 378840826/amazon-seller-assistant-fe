declare namespace AsinBase {
  interface IAsinGlobal {
    asinGlobal: {
      asin: string;
    };
  }
  interface IReturnReason {
    returnQuantity: number;
    reason: string;
    proportion: string;
  }

  interface IProductAsinSkuVo {
    sku: string;
    price: number;
    priceCny: number;
    cost: number;
    costCny: number;
    freight: number;
    freightCny: number;
    commission: number;
    commissionCny: number;
    fbaFee: number;
    fbaFeeCny: number;
    promotionFee: number;
    promotionFeePer: number;
    storageFee: number;
    storageFeeCny: number;
    otherFee: number;
    otherFeeCny: number;
    profit: number;
    profitMargin: number;
    totalCost: number;
    costPer: number;
    freightPer: number;
    promotionFeePer: number;
    storageFeePer: number;
    otherFeePer: number;
    fbaFeePer: number;
    commissionPer: number;
}

  interface IInitResponse {
    updateTime: string;
    title: string;
    url: string;
    brandName: string;
    reviewScore: number;
    reviewCount: number;
    answerQuestionNum: number;
    isAc: boolean;
    isBs: boolean;
    idAdd: boolean;
    isCoupon: boolean;
    isPrime: boolean;
    isPromotion: boolean;
    isNr: boolean;
    isBuyBox: boolean;
    price: number;
    dealType: string;
    dealPrice: number;
    sellerName: string;
    fulfillmentChannel: string;
    openDate: string;
    usedNewSellNum: string;
    productImageVos: {
      isMain: boolean;
      img: string;
    }[];
    
    ranking: {
      categoryId: string;
      categoryName: string;
      categoryRanking: number;
      isTopCategory: boolean;
    }[];
    skus: [];
    productAsinSkuVo: IProductAsinSkuVo;
  }
}
