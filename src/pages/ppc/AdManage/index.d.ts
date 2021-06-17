/* 当前选中的广告活动和广告组信息 */
export interface ITreeSelectedInfo {
  /** 菜单树选中的 key，格式定义为 广告活动类型-广告活动开启状态-广告活动id-广告组id */
  key: string;
  campaignType?: API.CamType;
  campaignState?: API.AdState;
  campaignId?: string;
  campaignName?: string;
  groupId?: string;
  groupName?: string;
  groupType: 'keyword' | 'target' | '';
  targetingType: API.CamTargetType | '';
}

/** 广告组简要信息 */
export interface ISimpleGroup {
  id: string;
  name: string;
  defaultBid: number;
}

/** 分类Targeting */
export interface ICategoryTargeting {
  categoryId: string;
  categoryName: string;
  path: string;
  brandId?: string;
  brandName?: string;
  priceLessThan: string;
  priceGreaterThan: string;
  reviewRatingLessThan: string;
  reviewRatingGreaterThan: string;
  bid?: number;
  suggested?: number;
  rangeStart?: number;
  rangeEnd?: number;
  /** 临时的 id ，用于判断唯一性 */
  id?: string;
}

/** 商品Targeting */
export interface IGoodsTargeting {
  title: string;
  imgUrl: string;
  asin: string;
  reviewScore: number | null;
  reviewCount: number | null;
  price: number | null;
  bid?: number;
  /** 临时的 id ，用于判断唯一性 */
  id?: string;
}

/** 品牌 */
export interface IBrand {
  brandId: string;
  brandName: string;
}

/** 计算竞价公式的参数 */
export interface IComputedBidParams {
  type: 'value' | 'suggest' | 'suggestMax' | 'suggestMin';
  unit: 'currency' | 'percent';
  operator: '+' | '-';
  exprValue: number;
  price?: number;
}

/** 关键词 */
export interface IKeyword {
  keywordText: string;
  matchType?: API.AdKeywordMatchType;
  suggested?: number;
  rangeStart?: number;
  rangeEnd?: number;
  bid?: number;
  /** 临时的 id ，用于判断唯一性 */
  id?: string;
}

/** 否定关键词 */
export interface INegativeKeyword {
  keywordText: string;
  clicks?: string;
  orders?: string;
  conversionsRate?: string;
  matchType?: API.AdKeywordMatchType;
  suggested?: number;
  rangeStart?: number;
  rangeEnd?: number;
  bid?: number;
  /** 临时的 id ，用于判断唯一性 */
  id?: string;
  /** 添加否定关键词时，返回的错误信息 */
  failMsg?: string;
}
