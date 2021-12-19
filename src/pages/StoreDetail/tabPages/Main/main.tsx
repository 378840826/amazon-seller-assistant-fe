/**
 * 整体表现
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import { groups } from '../../components/CustomBlock';
import { renderTdNumValue } from '@/pages/StoreReport/utils';
import { Button, Checkbox, Radio, Spin, Tabs } from 'antd';
import Charts from '../../components/Charts';
import MyTable from '../../components/Table';
import Tofu from '../../components/Tofu';
import { AssignmentKeyName } from '../../utils';
import { multiDataOrigin, showPreviousPeriodKey } from '../../config';
import styles from './main.less';
import commonStyles from '../tabPageCommon.less';
import { ColumnProps } from 'antd/es/table';
import { requestErrorFeedback } from '@/utils/utils';

const { TabPane } = Tabs;

// 整体表现包括 总体销售表现 和 总体流量转化
const tofuNameList = [...groups.总体销售表现, ...groups.总体流量转化];

const Page: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    tofu: loadingEffect['storeDetail/fetchMainTofu'],
    polyline: loadingEffect['storeDetail/fetchMainPolyline'],
    table: loadingEffect['storeDetail/fetchMainTable'],
  };
  const pageData = useSelector((state: IConnectState) => state.storeDetail);
  const {
    customBlock,
    searchParams,
    mainData: { tofu, tofuChecked, colors, table, polyline },
    showCurrency: currency,
  } = pageData;
  const { records, total, current, size } = table;
  // 显示图 or 表
  const [chartType, setChartType] = useState<'chart' | 'table'>('chart');
  // 统计周期
  const [periodType, setPeriodType] = useState<StoreDetail.PeriodType>('DAY');
  // 上年同期是否显示
  const [previousYear, setPreviousYear] = useState<boolean>(false);
  // 上期是否显示
  const [showPrevious, setShowPrevious] = useState<boolean>(false);
  // 多源字段的数据源
  const [dataOrigin, setDataOrigin] = useState<StoreDetail.DataOrigin>('');
  // 导出按钮 loading
  const [downloadBtnLoading, setDownloadBtnLoading] = useState<boolean>(false);

  // 查询条件改变，刷新豆腐块数据、折线图、表格
  useEffect(() => {
    if (searchParams.startTime && searchParams.endTime) {
      // 折线图
      dispatch({
        type: 'storeDetail/fetchMainPolyline',
        payload: {
          ...searchParams,
          method: periodType,
          dataOrigin,
        },
        callback: requestErrorFeedback,
      });
      // 豆腐块
      dispatch({
        type: 'storeDetail/fetchMainTofu',
        payload: { headersParams },
        callback: requestErrorFeedback,
      });
      // 表格
      dispatch({
        type: 'storeDetail/fetchMainTable',
        payload: {
          ...searchParams,
          headersParams,
          size,
          current: 1,
          method: periodType,
        },
        callback: requestErrorFeedback,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 折线图数据
  const chartDataSource = useMemo(() => {
    // 本期
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r: any = { thisPeriod: polyline.thisPeriod };
    // 上年同期
    previousYear && (r.firstHalf = polyline.firstHalf);
    // 上期（周，两周，月，季）（追加了最近 X 天也显示上期）
    showPrevious && (r.firstWeekOrMonthHalf = polyline.firstWeekOrMonthHalf);
    return r;
  }, [previousYear, showPrevious, polyline]);

  // 豆腐块 active 数据切换
  function handleBlockCheckedChange(name: string) {
    dispatch({
      type: 'storeDetail/updateMainTofuChecked',
      payload: name,
    });
    // 折线图
    dispatch({
      type: 'storeDetail/fetchMainPolyline',
      payload: {
        ...searchParams,
        dataOrigin,
        method: periodType,
      },
      callback: requestErrorFeedback,
    });
  }

  // 表格翻页
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleTableChange(params: any) {
    dispatch({
      type: 'storeDetail/fetchMainTable',
      payload: {
        ...searchParams,
        ...params,
        headersParams,
        method: periodType,
      },
      callback: requestErrorFeedback,
    });
  }

  // 统计周期类型切换，刷新折线图、表格
  function handlePeriodTypeChange(value: StoreDetail.PeriodType) {
    setPeriodType(value);
    // 表格
    dispatch({
      type: 'storeDetail/fetchMainTable',
      payload: {
        ...searchParams,
        headersParams,
        size,
        current: 1,
        method: value,
      },
      callback: requestErrorFeedback,
    });
    // 折线图
    dispatch({
      type: 'storeDetail/fetchMainPolyline',
      payload: {
        ...searchParams,
        dataOrigin,
        method: value,
      },
      callback: requestErrorFeedback,
    });
  }

  // 数据源选择，刷新折线图
  function handleDataOriginChange(value: StoreDetail.DataOrigin) {
    setDataOrigin(value);
    // 折线图
    dispatch({
      type: 'storeDetail/fetchMainPolyline',
      payload: {
        ...searchParams,
        dataOrigin: value,
        method: periodType,
      },
      callback: requestErrorFeedback,
    });
  }

  // 导出列表
  function handleDownload() {
    setDownloadBtnLoading(true);
    console.log('导出');
  }

  // 渲染折线图同期数据选择复选框
  function renderPeriodCheckbox() {
    if (chartType === 'chart') {
      return (
        <div>
          {
            showPreviousPeriodKey.includes(searchParams.timeMethod) &&
            <Checkbox
              onChange={() => setShowPrevious(!showPrevious)}
              checked={showPrevious}
            >
              上期
            </Checkbox>
          }
          <Checkbox
            onChange={() => setPreviousYear(!previousYear)}
            checked={previousYear}
          >
            上年同期
          </Checkbox>
        </div>
      );
    }
  }

  // 渲染图表右侧工具栏
  function renderTabsToolbar() {
    return (
      <div className={commonStyles.chartsToobar}>
        { renderPeriodCheckbox() }
        <div>
          统计周期：
          <Radio.Group
            options={[
              { label: '日', value: 'DAY' },
              { label: '周', value: 'WEEK' },
              { label: '月', value: 'MONTH' },
            ]}
            onChange={e => handlePeriodTypeChange(e.target.value)}
            value={periodType}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
        {
          chartType === 'table'
            ? 
            <Button 
              onClick={handleDownload}
              loading={downloadBtnLoading}
              disabled={!records?.length}
            >导出</Button>
            : null
        }
      </div>
    );
  }

  // 表格列
  const columns: ColumnProps<StoreDetail.IData>[] = [
    { 
      title: '周期', 
      align: 'center', 
      dataIndex: 'cycleDate',
      fixed: 'left',
      width: 160,
      render: value => <div className={commonStyles.nowrap}>{value}</div>,
    },
    { 
      title: '总销售额', 
      align: 'right', 
      dataIndex: AssignmentKeyName['总销售额'],
      width: 110,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '总订单量', 
      align: 'center', 
      dataIndex: AssignmentKeyName['总订单量'],
      width: 90,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: '总销量', 
      align: 'center', 
      dataIndex: AssignmentKeyName['总销量'],
      width: 90,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: '平均客单价', 
      align: 'right', 
      dataIndex: AssignmentKeyName['平均客单价'],
      width: 90,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '平均售价', 
      align: 'right', 
      dataIndex: AssignmentKeyName['平均售价'],
      width: 90,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '销量/订单量', 
      align: 'center', 
      dataIndex: AssignmentKeyName['销量/订单量'],
      width: 100,
    },
    { 
      title: '优惠订单', 
      align: 'center', 
      dataIndex: AssignmentKeyName['优惠订单'],
      width: 90,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: '关联销售', 
      align: 'center', 
      dataIndex: AssignmentKeyName['关联销售'],
      width: 90,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: 'PageView', 
      align: 'center', 
      // eslint-disable-next-line dot-notation
      dataIndex: AssignmentKeyName['PageView'],
      width: 90,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: 'Session', 
      align: 'center', 
      // eslint-disable-next-line dot-notation
      dataIndex: AssignmentKeyName['Session'],
      width: 90,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: 'PageView/Session', 
      align: 'center', 
      dataIndex: AssignmentKeyName['PageView/Session'],
      width: 120,
    },
    { 
      title: '转化率', 
      align: 'center', 
      dataIndex: AssignmentKeyName['转化率'],
      width: 90,
      render: value => renderTdNumValue({ value, suffix: '%' }),
    },
  ];

  return (
    <>
      <Tofu
        data={tofu}
        nameList={tofuNameList}
        checkedNames={tofuChecked}
        customBlock={customBlock}
        colors={colors}
        loading={loading.tofu}
        currency={currency}
        onClick={(name) => handleBlockCheckedChange(name)}
      />
      <div className={styles.chartsContainer}>
        <div className={styles.toolbar}>
          <Tabs
            defaultActiveKey="chart"
            onChange={(key) => setChartType(key as 'chart' | 'table')}
            className={styles.Tabs}
            tabBarExtraContent={{
              right: renderTabsToolbar(),
            }}
          >
            <TabPane
              key="chart"
              // 显示表格时(此时看不到折线图)，刷新折线图时，loading tab 标签，避免无效操作错觉
              tab={<Spin spinning={chartType === 'table' && loading.polyline}>图</Spin>}
            >
              <Charts
                dataOrigin={dataOrigin}
                dataSource={chartDataSource}
                dataTypes={tofuChecked}
                currency={currency}
                loading={loading.polyline}
                colors={colors}
              />
              {
                tofuChecked.some(name => multiDataOrigin.includes(name)) &&
                <Radio.Group
                  className={styles.RadioGroup}
                  options={[
                    { label: '总体', value: '' },
                    { label: 'FBA', value: 'fba' },
                    { label: 'FBM', value: 'fbm' },
                    { label: 'B2B', value: 'b2b' },
                  ]}
                  onChange={e => handleDataOriginChange(e.target.value)}
                  value={dataOrigin}
                />
              }
            </TabPane>
            <TabPane tab="表" key="table">
              <div className={styles.tableContainer}>
                <MyTable
                  dataSource={records}
                  columns={columns}
                  total={total}
                  current={current}
                  size={size}
                  onChange={handleTableChange}
                  loading={loading.table}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Page;
