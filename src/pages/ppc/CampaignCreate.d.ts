/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-12-31 11:24:15
 */
declare namespace CampaignCreate {
  interface IProductSelect {
    asin: string;
    sku: string;
    title: string;
    price: string;
    reviewNum: string;
    reviewStars: string;
    imgUrl: string;
    sellable: string;
    ranking: string;
  }
  
  interface IKeyword {
    keywordText: string;
    matchType: string;
    suggested?: number;
    rangeStart?: number;
    rangeEnd?: number;
    bid?: number;
    /** 临时的 id ，用于判断唯一性 */
    id?: string;
  }
}
