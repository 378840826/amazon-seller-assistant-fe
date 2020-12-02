/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-11-28 11:15:10
 */
declare namespace RuleHistory {
  interface IRecord {
    adjustTime: string;
    title: string;
    link: string;
    imgLink: string;
    asin: string;
    sku: string;
    fulfillmentChannel: string;
    maxPrice: number;
    minPrice: number;
    ruleName: string;
    ruleId: string;
    triggerCondition: string;
    oldPrice: string;
    newPirce: string;
    priceChange: string;
    triggerPriceVos: {
      sellerName: string;
      price: number;
      fulfillmentChannel: string;
      shipping: number;
      sellerLink: string;
      sellerId: string;
      targetType: string;
    }[];
  }
}
