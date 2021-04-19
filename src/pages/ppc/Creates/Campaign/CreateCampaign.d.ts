/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-07 17:44:11
 */
declare namespace CreateCampaign {
  import { CheckboxValueType } from 'antd/lib/checkbox/Group';

  // 广告活动类型
  type ICampaignType = 'sponsoredProducts' | 'sd' | 'sb'; // 商品广告 展示广告 品牌广告

  // 营销模式
  type IManagementMode = 'standard' | 'ai'; // 标准模式 智能托管

  // 投放方式 auto(SP) manual(SP) classProduct(SD)
  type putMathod = 'auto' | 'manual' | 'classProduct'

  interface ICallbackDataType {
    value: string;
    oneSelect: string;
    twoSelect?: string;
    threeSelect?: string;
  }

  interface IProductAwaitType {
    asin: string;
    sku: string;
    title: string;
    price: number;
    reviewNum: number|null;
    reviewStars: number|null;
    imgUrl: string;
    sellable: number|null;
    ranking: number|null;
    isChecked: boolean;
    id: string;
  }
  
  interface IThiningDataType {
    classId: number;
    classText: string;
  }

  // 细化分类的回调
  interface IThiningConfirmCallback {
    classText: string;
    classId: string;
    checkedBrands: CheckboxValueType[];
    priceLessThan: string;
    priceGreaterThan: string;
    reviewRatingLessThan: number;
    reviewRatingGreaterThan: number;
  }

  interface IKeywords {
    keywordText: string;
    matchType: string;
    bid: number;
  }

  // 建议分类（左边表格）
  interface ISuggestClassType {
    categoryName: string;
    categoryId: string;
    isChecked: boolean;
    path?: string;
    id: string;
  }
  
  // 已选的分类（右边表格）
  interface ISuggestedClassType extends ISuggestClassType {
    bid: number;
    brandId?: string;
    brandName?: string;
    priceLessThan?: string; // 价格min
    priceGreaterThan?: string; // 价格max
    reviewRatingLessThan?: number; // 评化max
    reviewRatingGreaterThan?: number; // 评分max
  }
}
