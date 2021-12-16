/**
 * B2B销售
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import { groups } from '../../components/CustomBlock';
import { renderTdNumValue } from '@/pages/StoreReport/utils';
import { Checkbox, Radio } from 'antd';
import Charts from '../../components/Charts';
import MyTable from '../../components/Table';
import Tofu from '../../components/Tofu';
import { AssignmentKeyName } from '../../utils';
import styles from './b2b.less';
import commonStyles from '../tabPageCommon.less';
import { ColumnProps } from 'antd/es/table';
import { requestErrorFeedback } from '@/utils/utils';
import { showPreviousPeriodKey } from '../../config';

// 豆腐块字段
const tofuNameList = groups.B2B销售;

const Page: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    tofu: loadingEffect['storeDetail/fetchB2bTofu'],
    polyline: loadingEffect['storeDetail/fetchB2bPolyline'],
    table: loadingEffect['storeDetail/fetchB2bTable'],
  };
  const pageData = useSelector((state: IConnectState) => state.storeDetail);
  const {
    customBlock,
    searchParams,
    b2bData: { tofu, tofuChecked, colors, table, polyline },
    showCurrency: currency,
  } = pageData;
  const { records, total, current, size } = table;
  // 统计周期
  const [periodType, setPeriodType] = useState<StoreDetail.PeriodType>('DAY');
  // 上年同期是否显示
  const [previousYear, setPreviousYear] = useState<boolean>(true);
  // 上X同期是否显示
  const [showPrevious, setShowPrevious] = useState<boolean>(false);

  // 查询条件改变，刷新豆腐块数据、折线图、表格
  useEffect(() => {
    if (searchParams.startTime && searchParams.endTime) {
      // 折线图
      dispatch({
        type: 'storeDetail/fetchB2bPolyline',
        payload: {
          ...searchParams,
          method: periodType,
        },
        callback: requestErrorFeedback,
      });
      // 豆腐块
      dispatch({
        type: 'storeDetail/fetchB2bTofu',
        payload: { headersParams },
        callback: requestErrorFeedback,
      });
      // 表格
      dispatch({
        type: 'storeDetail/fetchB2bTable',
        payload: {
          ...searchParams,
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
    // 上期（周，两周，月，季）
    showPrevious && (r.firstWeekOrMonthHalf = polyline.firstWeekOrMonthHalf);
    return r;
  }, [previousYear, showPrevious, polyline]);

  // 豆腐块 active 数据切换，刷新折线图
  function handleBlockCheckedChange(name: string) {
    dispatch({
      type: 'storeDetail/updateB2bTofuChecked',
      payload: name,
    });
    dispatch({
      type: 'storeDetail/fetchB2bPolyline',
      payload: {
        ...searchParams,
        method: periodType,
      },
      callback: requestErrorFeedback,
    });
  }

  // 表格翻页
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleTableChange(params: any) {
    dispatch({
      type: 'storeDetail/fetchB2bTable',
      payload: {
        ...searchParams,
        ...params,
        method: periodType,
      },
      callback: requestErrorFeedback,
    });
  }

  // 统计周期类型切换，刷新折线图、表格
  function handlePeriodTypeChange(value: StoreDetail.PeriodType) {
    setPeriodType(value);
    // 折线图
    dispatch({
      type: 'storeDetail/fetchB2bPolyline',
      payload: {
        ...searchParams,
        method: value,
      },
      callback: requestErrorFeedback,
    });
    // 表格
    dispatch({
      type: 'storeDetail/fetchB2bTable',
      payload: {
        ...searchParams,
        size,
        current: 1,
        method: value,
      },
      callback: requestErrorFeedback,
    });
  }

  // 渲染折线图同期数据选择复选框
  function renderPeriodCheckbox() {
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
      width: 100,
      render: value => <div className={commonStyles.nowrap}>{value}</div>,
    },
    { 
      title: (
        <>
          <div>B2B销售额</div>
          <div className={commonStyles.secondary}>(占比)</div>
        </>
      ), 
      align: 'right', 
      dataIndex: AssignmentKeyName['B2B销售额'],
      width: 110,
      render: (value: number, record: StoreDetail.IData) => (
        <>
          <div>{ renderTdNumValue({ value, prefix: currency }) }</div>
          <div className={commonStyles.secondary}>
            { renderTdNumValue({ value: record.b2bSalesProportion, suffix: '%' }) }
          </div>
        </>
      ),
    },
    { 
      title: 'B2B订单量', 
      align: 'center', 
      dataIndex: AssignmentKeyName['B2B订单量'],
      width: 80,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: 'B2B销量', 
      align: 'center', 
      dataIndex: AssignmentKeyName['B2B销量'],
      width: 90,
      render: value => renderTdNumValue({ value }),
    },
    { 
      title: 'B2B平均客单价', 
      align: 'right', 
      dataIndex: AssignmentKeyName['B2B平均客单价'],
      width: 94,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: 'B2B平均售价', 
      align: 'right', 
      dataIndex: AssignmentKeyName['B2B平均售价'],
      width: 90,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: 'B2B销量/订单量', 
      align: 'center', 
      dataIndex: AssignmentKeyName['B2B销量/订单量'],
      width: 100,
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
        <div className={styles.chartContainer}>
          { renderTabsToolbar() }
          <Charts
            dataSource={chartDataSource}
            dataTypes={tofuChecked}
            currency={currency}
            loading={loading.polyline}
            colors={colors}
            style={{ height: 424 }}
          />
        </div>
        <div className={styles.tableContainer}>
          <MyTable
            dataSource={records}
            columns={columns}
            total={total}
            current={current}
            size={size}
            onChange={handleTableChange}
            loading={loading.table}
            scroll={{ y: 370 }}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
