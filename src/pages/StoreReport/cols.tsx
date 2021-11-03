/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 全部列
 */
import React from 'react';
import { Link } from 'umi';
import { Space } from 'antd';
import classnames from 'classnames';
import { ColumnProps } from 'antd/es/table';
import { SortOrder } from 'antd/es/table/interface';
import Rate from '@/components/Rate';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Dispatch } from 'dva';
import GoodsIcon from '../components/GoodsIcon';
import { strToMinusMoneyStr } from '@/utils/utils';
import { renderTdNumValue } from './utils';
import styles from './index.less';

// 表格空数据占位符
const nullPlaceholder = '—';

// 表格中可以为空的字段
export const renderCouldNullTd = (value: any) => {
  return value === null ? nullPlaceholder : value;
};

export const getColumns = (params: {
  dispatch: Dispatch;
  /** 自定义列数据 */
  customCols: { [key: string]: boolean };
  /** 排序字段 */
  sort: string;
  /** 排序升序/降序 */
  order: SortOrder;
  /** 环比开关 */
  ratioSwitchChecked: boolean;
  /** 合计数据 */
  totalRowData: StoreReport.IStoreReport;
}) => {
  const {
    dispatch,
    customCols,
    sort,
    order,
    ratioSwitchChecked,
    totalRowData,
  } = params;

  // 排序图标
  function renderSortIcon(targetOrder: SortOrder) {
    return (
      <span className="ant-table-column-sorter ant-table-column-sorter-full">
        <span className="ant-table-column-sorter-inner">
          <CaretUpOutlined
            className={`anticon anticon-caret-up ant-table-column-sorter-up
            ${targetOrder === 'ascend' ? 'active' : ''}`}
          />
          <CaretDownOutlined
            className={`anticon anticon-caret-down ant-table-column-sorter-down
            ${targetOrder === 'descend' ? 'active' : ''}`}
          />
        </span>
      </span>
    );
  }

  // 排序
  function handleSort (dataIndex: string) {
    let newOrder = 'descend';
    // 如果已排序，且排序的字段没变，则反向排序
    if (order && dataIndex === sort) {
      newOrder = order === 'ascend' ? 'descend' : 'ascend';
    }
    dispatch({
      type: 'storeReport/sortList',
      payload: { sort: dataIndex, order: newOrder },
    });
  }

  // 双表头，根据环比开关显示
  function renderTwoThContent(params: {
    title: string; dataIndex: string; align?: 'center' | 'right'; hint?: string;
  }) {
    const { title, dataIndex, align, hint } = params;
    // 环比 key
    const ringRatioDataIndex = `${dataIndex}RingRatio`;
    const mainSort = sort === dataIndex ? order : null;
    const ringRatioSort = sort === ringRatioDataIndex ? order : null;
    return (
      <div className={classnames(styles.thTwoChild, align === 'right' && styles.textRight)}>
        <div
          className={
            classnames('ant-table-column-sorters', ratioSwitchChecked && styles.borderBottom)
          }
          onClick={() => handleSort(dataIndex)}
        >
          <span>
            {title}
            { hint && GoodsIcon.question(hint) }
          </span>
          { renderSortIcon(mainSort) }
        </div>
        {
          ratioSwitchChecked && 
          <div className="ant-table-column-sorters" onClick={() => handleSort(ringRatioDataIndex)}>
            <span>环比</span>
            { renderSortIcon(ringRatioSort) }
          </div>
        }
      </div>
    );
  }

  // 三表头，根据环比开关显示
  function renderThreeThContent(params: {
    title: string; dataIndex: string; align?: 'center' | 'right'; hint?: string;
  }) {
    const { title, dataIndex, hint, align } = params;
    // 环比 key
    const ringRatioDataIndex = `${dataIndex}RingRatio`;
    // 占比 key
    const proportionDataIndex = `${dataIndex}Proportion`;
    // 排序
    const mainSort = sort === dataIndex ? order : null;
    const ringRatioSort = sort === ringRatioDataIndex ? order : null;
    const proportionSort = sort === proportionDataIndex ? order : null;
    return (
      <div className={styles.thThreeChild}>
        <div className="ant-table-column-sorters" onClick={() => handleSort(dataIndex)}>
          <span>
            {title}
            { hint && GoodsIcon.question(hint) }
          </span>
          { renderSortIcon(mainSort) }
        </div>
        <div className={classnames(styles.threeChildren, align === 'right' && styles.textRight)}>
          {
            ratioSwitchChecked && 
            <div className="ant-table-column-sorters" onClick={() => handleSort(ringRatioDataIndex)}>
              <span>环比</span>
              { renderSortIcon(ringRatioSort) }
            </div>
          }
          <div className="ant-table-column-sorters" onClick={() => handleSort(proportionDataIndex)}>
            <span>占比</span>
            { renderSortIcon(proportionSort) }
          </div>
        </div>
      </div>
    );
  }

  // 双字段 TD。根据环比开关控制是否显示环比值
  function renderTwoTdContent(params: {
    dataIndex: string;
    record: StoreReport.IStoreReport;
    valueType?: '$' | '%';
    align?: 'center' | 'right';
  }
  ) {
    const { dataIndex, record, valueType } = params;
    // 环比 key
    const ringRatioDataIndex = `${dataIndex}RingRatio`;
    const value = record[dataIndex];
    const prefix = valueType === '$' ? record.currency || '' : '';
    const suffix = valueType === '%' ? '%' : '';
    // 合计行没有环比
    if (record.storeName === '合计') {
      return renderTdNumValue({ value, prefix, suffix });
    }
    const ringRatio = record[ringRatioDataIndex];
    return (
      <Space direction="vertical">
        <div>{ renderTdNumValue({ value, prefix, suffix }) }</div>
        {
          ratioSwitchChecked && (
            ![null, undefined, NaN, ''].includes(ringRatio)
              // eslint-disable-next-line new-cap
              ? Rate({ value: ringRatio, decimals: 2, showArrow: false })
              : '—'
          )
        }
      </Space>
    );
  }

  // 三字段 TD 。根据环比开关控制是否显示环比值
  function renderThreeTdContent(params: {
      dataIndex: string;
      record: StoreReport.IStoreReport;
      valueType?: '$' | '%';
      align?: 'center' | 'right';
    }
  ) {
    const { dataIndex, record, valueType, align } = params;
    // 环比 key
    const ringRatioDataIndex = `${dataIndex}RingRatio`;
    // 占比 key
    const proportionDataIndex = `${dataIndex}Proportion`;
    const ringRatio = record[ringRatioDataIndex];
    const proportion = record[proportionDataIndex];
    const value = record[dataIndex];
    const prefix = valueType === '$' ? record.currency || '' : '';
    const suffix = valueType === '%' ? '%' : '';
    // 合计行没有环比
    if (record.storeName === '合计') {
      return (
        <Space direction="vertical" className={styles.threeTdSpace}>
          <div>{ renderTdNumValue({ value, prefix, suffix }) }</div>
          <div className={classnames(styles.threeChildren, align === 'right' && styles.textRight)}>
            { strToMinusMoneyStr(String(proportion)) }%
          </div>
        </Space>
      );
    }
    return (
      <Space direction="vertical" className={styles.threeTdSpace}>
        <div>{ renderTdNumValue({ value, prefix, suffix }) }</div>
        <div className={classnames(styles.threeChildren, align === 'right' && styles.textRight)}>
          {
            ratioSwitchChecked && (
              ![null, undefined, NaN, ''].includes(ringRatio)
                // eslint-disable-next-line new-cap
                ? Rate({ value: ringRatio, decimals: 2, showArrow: false })
                : '—'
            )
          }
          <span>{ renderTdNumValue({ value: proportion, suffix: '%' }) }</span>
        </div>
      </Space>
    );
  }

  // 获取单个列配置(多表头+多数据的)
  function getColCustomizedItem(params: {
    title: string;
    dataIndex: string;
    // align 默认为 center，valueType 为 $ 时， align默认为 right
    align?: 'center' | 'right';
    valueType?: '$' | '%';
    // 默认为 2
    colNum?: 1 | 2 | 3;
    // 表头的 问号 提示 
    hint?: string;
    // 默认 90
    width?: number;
  }) {
    const { title, dataIndex, align, valueType, hint, colNum, width = 90 } = params;
    const targetColNum = colNum || 2;
    let targetAlign = align || 'center';
    // 货币默认显示在 right
    if (!align && valueType === '$') {
      targetAlign = 'right';
    }
    // 合计数据
    const prefix = valueType === '$' ? totalRowData.currency || '' : '';
    const suffix = valueType === '%' ? '%' : '';
    const total = renderTdNumValue({ value: totalRowData[dataIndex], prefix, suffix });
    const renderTh = {
      '2': renderTwoThContent,
      '3': renderThreeThContent,
    };
    const renderTd = {
      '2': renderTwoTdContent,
      '3': renderThreeTdContent,
    };
    return {
      title: renderTh[targetColNum]({ title, dataIndex, align: targetAlign, hint }), 
      align: targetAlign,
      dataIndex,
      key: dataIndex,
      width,
      children: [
        {
          title: total,
          dataIndex,
          width,
          align: targetAlign,
          render: (_: number, record: StoreReport.IStoreReport, index: number) => {
            if (index === 0) {
              return (
                <>
                  {/* 避免表头的合计单元格因长度太长导致换行， 在第一行加上一个隐藏的合计数据 */}
                  <div className={styles.hide}>{total}!</div>
                  { renderTd[targetColNum]({ dataIndex, record, valueType, align: targetAlign }) }
                </>
              );
            }
            return renderTd[targetColNum]({ dataIndex, record, valueType, align: targetAlign });
          },
        },
      ] as any,
    };
  }

  // 全部列
  const columns: ColumnProps<StoreReport.IStoreReport>[] = [
    { 
      title: '站点', 
      align: 'center', 
      dataIndex: 'marketplace',
      fixed: 'left',
      width: 40,
      children: [
        {
          dataIndex: 'marketplace',
          width: 40,
          fixed: 'left',
          render: (val: string) => (
            <div className={styles.marketplaceCol}>
              <i className={classnames(styles.flag, styles[`flag-${val}`])} />
              {val}
            </div>
          ),
        },
      ] as any,
    },
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      fixed: 'left',
      width: 130,
      children: [
        {
          title: '合计',
          dataIndex: 'storeName',
          width: 130,
          align: 'left',
          fixed: 'left',
          render: (val: string, record: StoreReport.IStoreReport) => {
            const url = `/overview/shop/detail?storeId=${record.storeId}`;
            return <Link to={url}>{ val }</Link>;
          },
        },
      ] as any,
    },
    getColCustomizedItem({ title: '总销售额', dataIndex: 'totalSales', valueType: '$' }),
    getColCustomizedItem({ title: '总订单量', dataIndex: 'totalOrderQuantity' }),
    getColCustomizedItem({ title: '总销量', dataIndex: 'totalSalesQuantity' }),
    getColCustomizedItem({
      title: '累计在售ASIN',
      dataIndex: 'cumulativelyOnSaleAsin',
      hint: '周期内曾经Active的ASIN数量',
      width: 140,
    }),
    getColCustomizedItem({
      title: '平均每ASIN订单',
      dataIndex: 'avgEachAsinOrder',
      hint: '=总订单量/累计在售ASIN数量',
      width: 150,
    }),
    getColCustomizedItem({
      title: '销售毛利',
      dataIndex: 'grossProfit',
      valueType: '$',
      hint: '=总销售额-促销成本-产品成本',
      width: 110,
    }),
    getColCustomizedItem({
      title: '销售毛利率',
      dataIndex: 'grossProfitRate',
      valueType: '%',
      hint: '=毛利/总销售额*100%',
      width: 120,
    }),
    getColCustomizedItem({
      title: '销量/订单量', dataIndex: 'salesQuantityExceptOrderQuantity', width: 104,
    }),
    getColCustomizedItem({ title: '平均售价', dataIndex: 'avgSellingPrice', valueType: '$' }),
    getColCustomizedItem({ title: '平均客单价', dataIndex: 'avgCustomerPrice', valueType: '$', width: 104 }),
    getColCustomizedItem({
      title: '优惠订单', dataIndex: 'preferentialOrderQuantity', hint: '有优惠折扣的订单量', width: 104,
    }),
    getColCustomizedItem({
      title: '关联销售',
      dataIndex: 'associateSales',
      hint: '订单包含多个ASIN的订单量',
      width: 104,
    }),
    getColCustomizedItem({ title: 'PageView', dataIndex: 'pageView', width: 100 }),
    getColCustomizedItem({ title: 'Session', dataIndex: 'session' }),
    getColCustomizedItem({ title: 'PageView/Session', dataIndex: 'pageViewExceptSession', width: 146 }),
    getColCustomizedItem({ title: '转化率', dataIndex: 'conversionsRate', valueType: '%' }),
    getColCustomizedItem({ title: 'B2B销售额', dataIndex: 'b2bSales', colNum: 3, valueType: '$', width: 120 }),
    getColCustomizedItem({ title: 'B2B订单量', dataIndex: 'b2bOrderQuantity', width: 100 }),
    getColCustomizedItem({ title: 'B2B销量', dataIndex: 'b2bSalesQuantity' }),
    getColCustomizedItem({ title: 'B2B平均售价', dataIndex: 'b2bAvgSellingPrice', valueType: '$', width: 110 }),
    getColCustomizedItem({
      title: 'B2B平均客单价', dataIndex: 'b2bAvgCustomerPrice', valueType: '$', width: 130,
    }),
    getColCustomizedItem({
      title: 'B2B销量/订单量', dataIndex: 'b2bSalesQuantityExceptOrderQuantity', width: 130,
    }),
    getColCustomizedItem({ title: '退货量', dataIndex: 'returnQuantity' }),
    getColCustomizedItem({ title: '退货率', dataIndex: 'returnRate', valueType: '%' }),
    getColCustomizedItem({
      title: '广告销售额', dataIndex: 'adSales', valueType: '$', colNum: 3, width: 130,
    }),
    getColCustomizedItem({
      title: '自然销售额',
      dataIndex: 'naturalSales',
      valueType: '$',
      colNum: 3,
      hint: '自然销售额=总销售额-广告销售额',
      width: 130,
    }),
    getColCustomizedItem({ title: '广告订单量', dataIndex: 'adOrderQuantity', colNum: 3, width: 130 }),
    getColCustomizedItem({
      title: '自然订单量',
      dataIndex: 'naturalOrderQuantity',
      colNum: 3,
      hint: '自然订单量=总订单量-广告订单量',
      width: 130,
    }),
    getColCustomizedItem({ title: 'CPC', dataIndex: 'cpc', valueType: '$' }),
    getColCustomizedItem({ title: 'CPA', dataIndex: 'cpa', valueType: '$', hint: '=Spend/广告订单量' }),
    getColCustomizedItem({
      title: 'CPM', dataIndex: 'cpm', valueType: '$', hint: '=Spend/(Impressions/1000)',
    }),
    getColCustomizedItem({ title: 'Spend', dataIndex: 'spend', valueType: '$' }),
    getColCustomizedItem({ title: 'ACoS', dataIndex: 'acos', valueType: '%' }),
    getColCustomizedItem({ title: '综合ACoS', dataIndex: 'compositeAcos', valueType: '%' }),
    getColCustomizedItem({ title: 'RoAS', dataIndex: 'roas', hint: '=广告销售额/Spend' }),
    getColCustomizedItem({ title: '综合RoAS', dataIndex: 'compositeRoas', hint: '=总销售额/Spend', width: 110 }),
    getColCustomizedItem({ title: 'Impressions', dataIndex: 'impressions', width: 110 }),
    getColCustomizedItem({ title: 'Clicks', dataIndex: 'clicks' }),
    getColCustomizedItem({ title: 'CTR', dataIndex: 'ctr', valueType: '%' }),
    getColCustomizedItem({
      title: '广告转化率', dataIndex: 'adConversionsRate', valueType: '%', width: 110,
    }),
    {
      title: '操作',
      align: 'center', 
      fixed: 'right',
      children: [
        {
          width: 40,
          align: 'center',
          fixed: 'right',
          render: (_: undefined, record: StoreReport.IStoreReport) => {
            const url = `/overview/shop/detail?storeId=${record.storeId}`;
            return <Link className={styles.detailBtn} to={url}>详情</Link>;
          },
        },
      ] as any,
    },
  ];

  // 按自定义列返回数据
  const cols: ColumnProps<StoreReport.IStoreReport>[] = [];
  columns.forEach(col => {
    !col.key && cols.push(col);
    if (customCols[col.key || '']) {
      cols.push(col);
    }
  });
  
  return cols;
};
