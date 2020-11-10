declare namespace CompetingGoods {
  interface ICompetingOneData {
    imgUrl: string;
    title: string;
    asin: string;
    brand: string;
    reviewNum: number;
    reviewScope: number;
    categoryRank: number;
    categoryName: string;
    sellerName: string;
    price: number;
    fulfillmentChannel: string;
    sellerId: string;
    sellerLink: string;
    shipping: string;
  }


  // 初始化
  interface IInitValues {
    title: string;
    asin: string;
    sku: string;
    link: string;
    imgLink: string;
    recommend: ICompetingOneData[];
    chosen: ICompetingOneData[];
  }

  // 搜索asin
  interface ISearchAsinInfo {
    title: string;
    brand_name: string; // eslint-disable-line
    seller_name: string; // eslint-disable-line
    delivery_method: string; // eslint-disable-line
    asin: string;
    price: string;
    pictures: string;
    categoryRank: number; // 大类排名
    rankingName: number; // 大类排名名称 
    // 运费
    shipping_fee: number;  // eslint-disable-line
    review_info: { // eslint-disable-line
      // review 
      review_count: number; // eslint-disable-line
      // 评文化建设
      review_avg_star: string;// eslint-disable-line
    };
    large_category: {// eslint-disable-line
      name: string;
      ranking: string;
      link: string;
    }[];
    // 发货方式
    prdelivery_methodice: string; // eslint-disable-line
  }
}
