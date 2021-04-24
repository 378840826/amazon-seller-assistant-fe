export interface ISimpleGroup {
  id: string;
  name: string;
  defaultBid: number;
}

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

export interface IBrand {
  brandId: string;
  brandName: string;
}

export interface IComputedBidParams {
  type: 'value' | 'suggest' | 'suggestMax' | 'suggestMin';
  unit: 'currency' | 'percent';
  operator: '+' | '-';
  exprValue: number;
  price?: number;
}


export interface IKeyword {
  keywordText: string;
  matchType?: API.AdKeywordMatchType;
  suggested?: number;
  suggestedMin?: number;
  suggestedMax?: number;
  bid?: number;
  /** 临时的 id ，用于判断唯一性 */
  id?: string;
}
