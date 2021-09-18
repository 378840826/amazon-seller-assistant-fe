/* eslint-disable new-cap */
import { ColumnProps } from 'antd/es/table';
import { message } from 'antd';
import moment, { Moment } from 'moment';
import { getDateCycleParam, getShowPrice, toThousands, numberToPercent } from '@/utils/utils';
import { add, divide, minus, times } from '@/utils/precisionNumber';
import { ICategoryTargeting, IComputedBidParams, IGoodsTargeting, IKeyword, INegativeKeyword } from './index.d';
import { Order } from '@/models/adManage';
import React from 'react';
import Rate from '@/components/Rate';

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
  targetingType?: API.CamTargetType;
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
    targetingType,
  } = params;
  // eslint-disable-next-line max-len
  let url = `${baseUrl || '/ppc/manage'}?campaignType=${'sp' || campaignType}&campaignState=${campaignState}&campaignId=${campaignId}&campaignName=${campaignName}&targetingType=${targetingType || ''}`;
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
      // 为空时后端接口要求传 null
      cycle: null,
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
  if (baseValue === null || baseValue === undefined || baseValue === '') {
    return null;
  }
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
      if (bid === null) {
        message.error('操作失败，建议竞价不正确！');
        return;
      }
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

/**
 * 判断广告组是否支持添加关键词/targeting
 * @param targetingType 广告活动targeting类型，为空字符串时表示菜单树还未选中广告活动或广告组,允许添加
 */
export function isOperableTargetingGroup(targetingType: API.CamTargetType | '') {
  let isOperable = false;
  // sp手动广告 和 sd商品广告才能添加targeting，才有建议targeting
  if (['manual', 'T00020', ''].includes(targetingType)) {
    isOperable = true;
  }
  return isOperable;
}

// 广告活动和广告组结束日期选择禁用今天以前的日期
export function disabledDate(currentDate: Moment) {
  return currentDate < moment().subtract(1, 'days');
}

/**
 * 获取广告表现统计数据表格列配置
 * 广告活动、广告组、广告、关键词、targeting、searchTerm
 * @param params.total 合计数据
 */
export function getStatisticsCols(
  params: {
    total: { [key: string]: number };
    sort: string;
    order: Order;
    marketplace: API.Site;
    currency: string;
  }
) {
  const { total, sort, order, marketplace, currency } = params;
  // 合计数据格式化
  const formatTotal = {
    impressions: toThousands(Number(total.impressions)),
    clicks: toThousands(Number(total.clicks)),
    spend: getShowPrice(total.spend, marketplace, currency),
    acos: numberToPercent(total.acos),
    roas: total.roas ? total.roas.toFixed(2) : '—',
    ctr: numberToPercent(total.ctr),
    cpc: getShowPrice(total.cpc, marketplace, currency),
    cpa: getShowPrice(total.cpa, marketplace, currency),
    sales: getShowPrice(total.sales, marketplace, currency, true),
    orderNum: toThousands(Number(total.orderNum)),
    conversionsRate: numberToPercent(total.conversionsRate),
  };
  return [
    {
      title: '销售额',
      dataIndex: 'sales',
      key: 'sales',
      align: 'right',
      sorter: true,
      sortOrder: sort === 'sales' ? order : null,
      children: [
        {
          title: formatTotal.sales,
          dataIndex: 'sales',
          width: 120,
          align: 'right',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.salesRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.salesRatio, decimals: 2 }));
            return React.createElement('div', null, getShowPrice(value, marketplace, currency), rate);
          },
        },
      ],
    }, {
      title: '订单量',
      dataIndex: 'orderNum',
      key: 'orderNum',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'orderNum' ? order : null,
      children: [
        {
          title: formatTotal.orderNum,
          dataIndex: 'orderNum',
          width: 80,
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.orderNumRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.orderNumRatio, decimals: 2 }));
            return React.createElement('div', null, value, rate);
          },
        },
      ],
    }, {
      title: 'CPC',
      dataIndex: 'cpc',
      key: 'cpc',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'cpc' ? order : null,
      children: [
        {
          title: formatTotal.cpc,
          dataIndex: 'cpc',
          width: 80,
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.cpcRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.cpcRatio, decimals: 2 }));
            return React.createElement('div', null, getShowPrice(value, marketplace, currency), rate);
          },
        },
      ],
    }, {
      title: 'CPA',
      dataIndex: 'cpa',
      key: 'cpa',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'cpa' ? order : null,
      children: [
        {
          title: formatTotal.cpa,
          dataIndex: 'cpa',
          width: 80,
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.cpaRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.cpaRatio, decimals: 2 }));
            return React.createElement('div', null, getShowPrice(value, marketplace, currency), rate);
          },
        },
      ],
    }, {
      title: 'Spend',
      dataIndex: 'spend',
      key: 'spend',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'spend' ? order : null,
      children: [
        {
          title: formatTotal.spend,
          dataIndex: 'spend',
          width: 90,
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.spendRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.spendRatio, decimals: 2 }));
            return React.createElement('div', null, getShowPrice(value, marketplace, currency), rate);
          },
        },
      ],
    }, {
      title: 'ACoS',
      dataIndex: 'acos',
      key: 'acos',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'acos' ? order : null,
      children: [
        {
          title: formatTotal.acos,
          dataIndex: 'acos',
          width: 80,
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.acosRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.acosRatio, decimals: 2 }));
            return React.createElement('div', null, numberToPercent(value), rate);
          },
        },
      ],
    }, {
      title: 'RoAS',
      dataIndex: 'roas',
      key: 'roas',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'roas' ? order : null,
      children: [
        {
          title: formatTotal.roas,
          dataIndex: 'roas',
          align: 'center',
          width: 80,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.roasRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.roasRatio, decimals: 2 }));
            return React.createElement('div', null, value ? value.toFixed(2) : '—', rate);
          },
        },
      ],
    }, {
      title: 'Impressions',
      dataIndex: 'impressions',
      key: 'impressions',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'impressions' ? order : null,
      children: [
        {
          title: formatTotal.impressions,
          dataIndex: 'impressions',
          align: 'center',
          width: 100,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.impressionsRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.impressionsRatio, decimals: 2 }),
            );
            return React.createElement('div', null, value, rate);
          },
        },
      ],
    }, {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'clicks' ? order : null,
      children: [
        {
          title: formatTotal.clicks,
          dataIndex: 'clicks',
          width: 80,
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.clicksRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.clicksRatio, decimals: 2 }));
            return React.createElement('div', null, value, rate);
          },
        },
      ],
    }, {
      title: 'CTR',
      dataIndex: 'ctr',
      key: 'ctr',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'ctr' ? order : null,
      children: [
        {
          title: formatTotal.ctr,
          dataIndex: 'ctr',
          width: 80,
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.ctrRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.ctrRatio, decimals: 2 }));
            return React.createElement('div', null, numberToPercent(value), rate);
          },
        },
      ],
    }, {
      title: '转化率',
      dataIndex: 'conversionsRate',
      key: 'conversionsRate',
      align: 'center',
      sorter: true,
      sortOrder: sort === 'conversionsRate' ? order : null,
      children: [
        {
          title: formatTotal.conversionsRate,
          dataIndex: 'conversionsRate',
          width: 80,
          align: 'center',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          render: (value: number, record: any) => {
            const rate = record.conversionsRateRatio !== undefined && 
            React.createElement(
              'div',
              null,
              Rate({ value: record.conversionsRateRatio, decimals: 2 }));
            return React.createElement('div', null, numberToPercent(value), rate);
          },
        },
      ],
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any;
}
