/**
 * 产品线
 */
import React, { useEffect, useState } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { Radio, Modal, Button } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import { renderTdNumValue, renderTdNumValue as renderValue } from '@/pages/StoreReport/utils';
import { requestErrorFeedback, toUrl } from '@/utils/utils';
import MyTable from '../../components/Table';
import MyIcon from '@/pages/components/GoodsIcon';
import commonStyles from '../tabPageCommon.less';
import styles from './productLine.less';

const titleDict = {
  sales: '销售额',
  orderQuantity: '订单量',
  profit: '利润',
  conversionsRate: '转化率',
  pageView: 'PageView',
  session: 'Session',
  adSales: '广告销售额',
  adOrderQuantity: '广告订单量',
  spend: 'Spend',
};

const Page: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    table: loadingEffect['storeDetail/fetchProductLineTable'],
    histogram: loadingEffect['storeDetail/fetchProductLineHistogram'],
  };
  const pageData = useSelector((state: IConnectState) => state.storeDetail);
  const {
    searchParams,
    productLineData: { pie, table, histogram },
    showCurrency: currency,
  } = pageData;
  const groups = {
    '总体': histogram.main,
    '流量': histogram.flow,
    '广告': histogram.ad,
  };
  const { records, total, current, size } = table;

  // 柱状图标签页
  const [showHistogramGroup, setShowHistogramGroup] = useState<string>('总体');
  // 饼图弹窗
  const [pieVisible, setPieVisible] = useState<boolean>(false);

  // 查询条件改变，刷新图、表格
  useEffect(() => {
    if (searchParams.startTime && searchParams.endTime) {
      dispatch({
        type: 'storeDetail/fetchProductLineHistogram',
        payload: {
          ...searchParams,
          headersParams,
        },
        callback: requestErrorFeedback,
      });
      dispatch({
        type: 'storeDetail/fetchProductLineTable',
        payload: {
          ...searchParams,
          size,
          current: 1,
          headersParams,
        },
        callback: requestErrorFeedback,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 点击标签弹窗
  function handleTagClick(tag: string) {
    console.log('handleTagClick', tag, pie);
    setPieVisible(true);
  }

  // 表格翻页
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleTableChange(params: any) {
    dispatch({
      type: 'storeDetail/fetchProductLineTable',
      payload: {
        ...searchParams,
        ...params,
        headersParams,
      },
      callback: requestErrorFeedback,
    });
  }

  // 获取柱状图
  function getHistogram(
    params: {
      data: { tag: string; value: number; proportion: number }[];
      color: string;
    }
  ) {
    const { data, color } = params;
    // 倒序，最大的排最上面
    const invertedData = [...data].reverse();
    return (
      <ReactEcharts
        onChartReady={(e: echarts.ECharts) => {
          window.addEventListener('resize', function () {
            e.resize();
          });
        }}
        style={{ width: '100%', height: '380px' }}
        option={{
          grid: {
            top: 0,
            bottom: 30,
            left: 6,
            right: 40,
            containLabel: true,
          },
          xAxis: {
            type: 'value',
            splitNumber: 10,
            splitLine: {
              lineStyle: {
                color: '#E4EBF0',
              },
            },
            axisLine: {
              lineStyle: { color: '#fff' },
            },
            axisTick: { show: false },
            axisLabel: { color: '#666' },
          },
          yAxis: {
            type: 'category',
            axisLine: {
              lineStyle: { color: '#d9d9d9' },
            },
            axisLabel: { show: false },
            data: invertedData.map(item => item.tag),
          },
          series: [
            {
              type: 'bar',
              barWidth: '16',
              itemStyle: {
                color: color,
              },
              label: {
                show: true,
                position: 'right',
                formatter: '{c}%',
                color: '#222',
              },
              data: invertedData.map(item => ({ value: Math.floor(item.proportion * 100) / 100 })),
            },
          ],
        }}
      />
    );
  }

  // 一个柱状图数据块
  function renderHistogram(
    params: {
      data: { tag: string; value: number; proportion: number }[];
      color: string;
      title: string;
    }
  ) {
    const { data, color, title } = params;
    return (
      data &&
      <div key={title}>
        <div className={styles.title}>{title}</div>
        <div className={styles.histogramItemContainer}>
          <div className={styles.labelContainer}>
            <div className={styles.tagContainer}>
              {
                data.map(item => (
                  <div key={item.tag} onClick={() => handleTagClick(item.tag)}>
                    {item.tag}
                  </div>
                ))
              }
            </div>
            <div className={styles.valueContainer}>
              {
                data.map(item => (
                  <div key={item.tag}>
                    {currency}{renderValue({ value: item.value })}
                  </div>
                ))
              }
            </div>
          </div>
          { getHistogram({ data, color }) }
        </div>
      </div>
    );
  }

  // 一组柱状图
  function renderHistogramGroup(
    data: {
      [key: string]: {
        tag: string;
        value: number;
        proportion: number;
    }[];
  }) {
    const colors = ['#49B5FF', '#FFC175', '#6FE09C'];
    return (
      data && Object.keys(data).map((key, i) => (
        renderHistogram({ data: data[key], color: colors[i], title: titleDict[key] })
      ))
    );
  }

  // 表格导出链接
  function getDownloadUrl() {
    const baseUrl = '/api/mws/store-report/product-line/export-excel';
    const params = toUrl(pageData.searchParams);
    return `${baseUrl}${params}`;
  }

  // 表格列
  const columns: ColumnProps<StoreDetail.IProductLineData>[] = [
    { 
      title: '标签',
      dataIndex: 'tag',
      align: 'center',
      fixed: 'left',
      width: 110,
    },
    { 
      title: '销售额', 
      dataIndex: 'sales',
      align: 'right', 
      width: 110,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '订单量', 
      dataIndex: 'orderQuantity',
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: '销量', 
      dataIndex: 'salesQuantity',
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: '累计在售ASIN数', 
      dataIndex: 'salesQuantity',
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: (
        <>
          <div>日均销量</div>
          <div className={commonStyles.secondary}>(每个ASIN)</div>
        </>
      ),
      dataIndex: 'averageDailySalesQuantity',
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: '利润', 
      dataIndex: 'profit',
      align: 'right', 
      width: 110,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '退货量', 
      dataIndex: 'returnQuantity',
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: '退货率', 
      dataIndex: 'returnRate',
      align: 'right', 
      width: 80,
      render: value => renderTdNumValue({ value, suffix: '%' }),
    },
    { 
      title: 'PageView', 
      dataIndex: 'pageView',
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: 'Session', 
      dataIndex: 'session',
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: '转化率', 
      dataIndex: 'conversionsRate',
      align: 'right', 
      width: 80,
      render: value => renderTdNumValue({ value, suffix: '%' }),
    },
    { 
      title: '广告销售额', 
      dataIndex: 'adSales',
      align: 'right', 
      width: 110,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '广告订单量', 
      dataIndex: 'adOrderQuantity',
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: 'Spend', 
      dataIndex: 'spend',
      align: 'right', 
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '操作', 
      align: 'center',
      fixed: 'right',
      width: 60,
      render: (_, record) => (
        <Link className={styles.detailBtn} to={`/report/asin-overview?tag=${record.tag}`}>详情</Link>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.radioContainer}>
        <Radio.Group
          value={showHistogramGroup}
          onChange={e => setShowHistogramGroup(e.target.value)}
          buttonStyle="solid"
        >
          {
            Object.keys(groups).map(key => (
              <Radio.Button key={key} value={key}>{key}</Radio.Button>
            ))
          }
        </Radio.Group>
      </div>
      <div className={styles.histogramContainer}>
        { renderHistogramGroup(groups[showHistogramGroup]) }
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.tableToolBar}>
          <div className={styles.title}>
            产品线
            {MyIcon.question(
              '需在商品管理列表为ASIN添加标签，若给同一ASIN添加多个标签，则该ASIN会纳入多个产品线的统计'
            )}
          </div>
          <Button>
            <a download href={getDownloadUrl()}>导出</a>
          </Button>
        </div>
        <MyTable
          rowKey="tag"
          dataSource={records}
          columns={columns}
          total={total}
          current={current}
          size={size}
          onChange={handleTableChange}
          loading={loading.table}
        />
      </div>
      <Modal
        visible={pieVisible}
        width={1160}
        keyboard={false}
        footer={false}
        className={styles.Modal}
        onCancel={() => setPieVisible(false)}
      >
        饼图弹窗还未设计
      </Modal>
    </div>
  );
};

export default Page;
