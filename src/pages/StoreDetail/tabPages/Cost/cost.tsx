/**
 * 费用成本
 * 只有两个数据，豆腐块的交互当做开关处理
 */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import { renderTdNumValue } from '@/pages/StoreReport/utils';
import { Radio } from 'antd';
import Charts from '../../components/Charts';
import MyTable from '../../components/Table';
import Tofu from '../../components/Tofu';
import { AssignmentKeyName } from '../../utils';
import commonStyles from '../tabPageCommon.less';
import { ColumnProps } from 'antd/es/table';
import styles from './cost.less';
import { requestErrorFeedback } from '@/utils/utils';

// 豆腐块字段
const tofuNameList = ['毛利', '毛利率'];

const Page: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    tofu: loadingEffect['storeDetail/fetchCostTofu'],
    polyline: loadingEffect['storeDetail/fetchCostPolyline'],
    table: loadingEffect['storeDetail/fetchCostTable'],
  };
  const pageData = useSelector((state: IConnectState) => state.storeDetail);
  const {
    customBlock,
    searchParams,
    costData: { tofu, tofuChecked, colors, table, polyline },
    showCurrency: currency,
  } = pageData;
  const { records, total, current, size } = table;
  // 统计周期
  const [periodType, setPeriodType] = useState<StoreDetail.PeriodType>('DAY');

  // 查询条件改变，刷新豆腐块数据、折线图、表格
  useEffect(() => {
    if (searchParams.startTime && searchParams.endTime) {
      // 折线图
      dispatch({
        type: 'storeDetail/fetchCostPolyline',
        payload: {
          ...searchParams,
          method: periodType,
        },
        callback: requestErrorFeedback,
      });
      // 豆腐块
      dispatch({
        type: 'storeDetail/fetchCostTofu',
        payload: { headersParams },
        callback: requestErrorFeedback,
      });
      // 表格
      dispatch({
        type: 'storeDetail/fetchCostTable',
        payload: {
          size,
          current: 1,
          method: periodType,
        },
        callback: requestErrorFeedback,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 豆腐块 active 数据切换，刷新折线图
  function handleBlockCheckedChange(name: string, checked: boolean) {
    dispatch({
      type: 'storeDetail/updateCostTofuChecked',
      payload: { name, checked },
    });
    // 折线图
    dispatch({
      type: 'storeDetail/fetchCostPolyline',
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
      type: 'storeDetail/fetchCostTable',
      payload: {
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
      type: 'storeDetail/fetchCostPolyline',
      payload: {
        ...searchParams,
        method: periodType,
      },
      callback: requestErrorFeedback,
    });
    // 表格
    dispatch({
      type: 'storeDetail/fetchCostTable',
      payload: {
        size,
        current: 1,
        method: periodType,
      },
      callback: requestErrorFeedback,
    });
  }

  // 渲染图表右侧工具栏
  function renderTabsToolbar() {
    return (
      <div className={commonStyles.chartsToobar}>
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
      title: '日期', 
      align: 'center', 
      dataIndex: 'cycleDate',
      fixed: 'left',
      width: 120,
      render: value => <div className={commonStyles.nowrap}>{value}</div>,
    },
    { 
      title: '销售额',
      align: 'right', 
      dataIndex: AssignmentKeyName['总销售额'],
      width: 120,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '订单费用', 
      align: 'right', 
      dataIndex: AssignmentKeyName['订单费用'],
      width: 100,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '退货退款', 
      align: 'right', 
      dataIndex: AssignmentKeyName['退货退款'],
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '仓储费用', 
      align: 'right', 
      dataIndex: AssignmentKeyName['仓储费用'],
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '其他服务费',
      align: 'right', 
      dataIndex: AssignmentKeyName['其他服务费'],
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '促销费用',
      align: 'right', 
      dataIndex: AssignmentKeyName['促销费用'],
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '广告实际扣费',
      align: 'right', 
      dataIndex: AssignmentKeyName['广告实际扣费'],
      width: 90,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '评测费用',
      align: 'right', 
      dataIndex: AssignmentKeyName['评测费用'],
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: 'Eearly Reviewer',
      align: 'right', 
      dataIndex: AssignmentKeyName['Eearly Reviewer'],
      width: 110,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '成本',
      align: 'right', 
      dataIndex: AssignmentKeyName['成本'],
      width: 90,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '物流',
      align: 'right', 
      dataIndex: AssignmentKeyName['物流'],
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '运营',
      align: 'right', 
      dataIndex: AssignmentKeyName['运营'],
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '毛利',
      align: 'right', 
      dataIndex: AssignmentKeyName['毛利'],
      width: 100,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    { 
      title: '毛利率',
      align: 'center', 
      dataIndex: AssignmentKeyName['毛利率'],
      width: 60,
      render: value => renderTdNumValue({ value, suffix: '%' }),
    },
  ];

  // 特殊处理折线图的参数 dataTypes 和 colors
  function getChartTypeAndColor() {
    const dataTypes = Object.keys(tofuChecked).filter(key => tofuChecked[key].checked);
    const colors = dataTypes.map(name => tofuChecked[name].color);
    return { dataTypes, colors };
  }

  return (
    <div className={styles.container}>
      <Tofu
        data={tofu}
        nameList={tofuNameList}
        checkedNames={tofuChecked}
        customBlock={customBlock}
        colors={colors}
        loading={loading.tofu}
        currency={currency}
        onClick={(name, checked) => handleBlockCheckedChange(name, checked)}
      />
      <div className={styles.chartsContainer}>
        <div className={styles.chartContainer}>
          { renderTabsToolbar() }
          <Charts
            dataSource={polyline}
            // dataTypes={tofuChecked}
            currency={currency}
            loading={loading.polyline}
            // colors={colors}
            style={{ height: 424 }}
            { ...getChartTypeAndColor() }
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
    </div>
  );
};

export default Page;
