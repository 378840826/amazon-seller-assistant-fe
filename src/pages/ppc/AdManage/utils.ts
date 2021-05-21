import { ColumnProps } from 'antd/es/table';
import { message } from 'antd';
import { getDateCycleParam, getShowPrice } from '@/utils/utils';
import { add, divide, minus, times } from '@/utils/precisionNumber';
import { ICategoryTargeting, IComputedBidParams, IGoodsTargeting, IKeyword, INegativeKeyword } from './index.d';

// 判断是否归档状态
export const isArchived: (state: string) => boolean = (state: string) => state === 'archived';

// 投放方式字典
export const targetingTypeDict = {
  manual: '手动',
  auto: '自动',
  T00020: '分类/商品',
  T00030: '受众',
};

// 获取跳转到指定广告活动或广告组的 url （或其他url，指定baseUrl）
export function getAssignUrl(params: {
  baseUrl?: string;
  campaignType: 'sp' | 'sb' | 'sd';
  campaignState: API.AdState;
  campaignId: string;
  campaignName: string;
  groupId?: string;
  groupName?: string;
  tab?: 'campaign' | 'group' | 'ad' | 'keyword' | 'targeting'| 'negativeKeyword' | 'negativeTargeting' | 'searchTerm' | 'history';
  // 跳转广告组时，区分关键词广告组和商品/分类广告组，以此来确定 targeting 标签是“关键词”还是“分类/商品投放”(否定targeting同理)
  groupType?: API.GroupType;
}) {
  const {
    baseUrl,
    campaignType,
    campaignState,
    campaignId,
    campaignName,
    groupId,
    groupName,
    tab,
    groupType,
  } = params;
  // eslint-disable-next-line max-len
  let url = `${baseUrl || '/ppc/manage'}?campaignType=${campaignType}&campaignState=${campaignState}&campaignId=${campaignId}&campaignName=${campaignName}`;
  if (groupId && groupName) {
    url = `${url}&groupId=${groupId}&groupName=${groupName}${groupType ? `&groupType=${groupType}` : '' }`;
  }
  if (tab) {
    url = `${url}&tab=${tab}`;
  }
  return encodeURI(url);
}

// 判断是否有效的关键词/targeting竞价，并返回最低竞价（日本站>=2，其他>=0.02）
export function isValidTargetingBid(bid: number, marketplace: API.Site): [boolean, number] {
  let minBid = 0.02;
  if (marketplace === 'JP') {
    minBid = 2;
  }
  return [bid >= minBid, minBid];
}

// 获取列配置(判断是否需要广告活动或广告组列)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTableColumns(allColumns: ColumnProps<any>[], cam: boolean, group: boolean) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: ColumnProps<any>[] = [];
  allColumns.forEach(item => {
    let flag = true;
    if (!cam && item.title === '广告活动') {
      flag = false;
    }
    if (!group && item.title === '广告组') {
      flag = false;
    }
    flag && result.push(item);
  });
  return result;
}

// 从日期固定周期选择器的参数生成请求所需的 filtrateParams
export function getDefinedCalendarFiltrateParams(dates: DefinedCalendar.IChangeParams) {
  const { dateStart, dateEnd, selectItemKey } = dates;
  const timeMethodDict = {
    week: 'WEEK',
    month: 'MONTH',
    quarter: 'SEASON',
  };
  let filtrateParams;
  // 按周月季周期
  if (['week', 'month', 'quarter'].includes(selectItemKey)) {
    filtrateParams = {
      startTime: dateStart,
      endTime: dateEnd,
      cycle: '',
      timeMethod: timeMethodDict[selectItemKey],
    };
  } else {
    // 按最近X天
    filtrateParams = {
      startTime: '',
      endTime: '',
      cycle: getDateCycleParam(selectItemKey),
      timeMethod: '',
    };
  }
  return filtrateParams;
}

// 生成包含的临时 id 的 关键词
export function createIdKeyword(keyword: INegativeKeyword): INegativeKeyword;
export function createIdKeyword(keyword: IKeyword): IKeyword;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createIdKeyword(keyword: any): any {
  const { keywordText, matchType } = keyword;
  return ({
    ...keyword,
    id: `${keywordText}-${matchType}`,
  });
}

// 生成包含的临时 id 的 targeting
export function createIdTargeting(targeting: ICategoryTargeting): ICategoryTargeting;
export function createIdTargeting(targeting: IGoodsTargeting): IGoodsTargeting;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createIdTargeting(targeting: any): any {
  const {
    categoryId,
    brandId,
    asin,
    priceGreaterThan,
    priceLessThan,
    reviewRatingGreaterThan,
    reviewRatingLessThan,
  } = targeting;
  return ({
    ...targeting,
    // eslint-disable-next-line max-len
    id: `${categoryId}-${brandId}-${asin}-${priceGreaterThan}-${priceLessThan}-${reviewRatingGreaterThan}-${reviewRatingLessThan}`,
  });
}

// 按公式计算竞价
function getComputedBid(params: IComputedBidParams, record: API.IAdTargeting) {
  let result = 0;
  const { type, unit, operator, exprValue } = params;
  const opDict = {
    '+': add,
    '-': minus,
  };
  // 建议竞价/最高/最低建议竞价
  const baseValue = record[type];
  if (unit === 'percent') {
    result = opDict[operator](baseValue, times(baseValue, divide(exprValue, 100)));
  } else if (unit === 'currency') {
    result = opDict[operator](baseValue, exprValue);
  }
  return result;
}

// 获取 关键词/targeting 批量设置竞价按公式修改的结果,并返回修改后的全部关键词/targeting
export function getBidExprVlaue(
  params: {
    marketplace: API.Site;
    /**计算公式表达式的参数 （可由 BatchSetBid 组件的的 callback 返回） */
    exprParams: IComputedBidParams;
    /**已选的 关键词/targeting的 id 集合 */
    checkedIds: string[];
    /**所有的 关键词/targeting 数组 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    records: any;
  }
) {
  const { marketplace, exprParams, checkedIds, records } = params;
  const { type, unit, operator, exprValue, price } = exprParams;
  const data = [];
  const minValue = marketplace === 'JP' ? 2 : 0.02;
  // 值类型
  if (type === 'value' && price) {
    if (price < minValue) {
      message.error(`竞价不能低于${minValue}`);
      return;
    }
    for (let index = 0; index < checkedIds.length; index++) {
      data.push({
        id: checkedIds[index],
        bid: getShowPrice(price),
      });
    }
  } else {
    // 计算类型
    for (let index = 0; index < checkedIds.length; index++) {
      const id = checkedIds[index];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const record = records.find((item: any) => item.id === id);
      const bid = getComputedBid({
        type,
        operator,
        unit,
        exprValue,
      }, record);
      if (bid < minValue) {
        message.error(`竞价不能低于${minValue}`);
        return;
      }
      data.push({
        id,
        bid: getShowPrice(bid),
      });
    }
  }
  return data;
}
