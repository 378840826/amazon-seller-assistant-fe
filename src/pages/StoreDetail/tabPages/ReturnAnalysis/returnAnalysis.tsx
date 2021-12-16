/**
 * 退货分析
 * 只有两个数据，豆腐块的交互当做开关处理
 */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import { renderTdNumValue, renderTdNumValue as renderValue } from '@/pages/StoreReport/utils';
import { Radio, Table } from 'antd';
import Charts from '../../components/Charts';
import ReactEcharts from 'echarts-for-react';
import { AssignmentKeyName } from '../../utils';
import { ColumnProps } from 'antd/es/table';
import { groups } from '../../components/CustomBlock';
import styles from './returnAnalysis.less';
import commonStyles from '../tabPageCommon.less';
import Tofu from '../../components/Tofu';
import { requestErrorFeedback } from '@/utils/utils';

// 豆腐块字段
const tofuNameList = groups.退货;

const Page: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['storeDetail/fetchReturnAnalysis'];
  const pageData = useSelector((state: IConnectState) => state.storeDetail);
  const {
    customBlock,
    searchParams,
    returnAnalysisData: { tofu, tofuChecked, table, polyline },
    showCurrency: currency,
  } = pageData;
  
  const { records } = table;
  // 统计周期
  const [periodType, setPeriodType] = useState<StoreDetail.PeriodType>('DAY');

  // 查询条件改变，刷新豆腐块数据、折线图、表格
  useEffect(() => {
    if (searchParams.startTime && searchParams.endTime) {
      // 豆腐块，折线图，表格，饼图
      dispatch({
        type: 'storeDetail/fetchReturnAnalysis',
        payload: {
          ...searchParams,
          method: periodType,
          headersParams,
        },
        callback: requestErrorFeedback,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 豆腐块 active 数据切换，刷新折线图
  function handleBlockCheckedChange(name: string, checked: boolean) {
    dispatch({
      type: 'storeDetail/updateReturnTofuChecked',
      payload: { name, checked },
    });
  }

  // 统计周期类型切换
  function handlePeriodTypeChange(value: StoreDetail.PeriodType) {
    setPeriodType(value);
    dispatch({
      type: 'storeDetail/fetchReturnAnalysis',
      payload: {
        ...searchParams,
        method: value,
        headersParams,
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

  // 特殊处理
  function getChartTypeAndColor() {
    const dataTypes = Object.keys(tofuChecked).filter(key => tofuChecked[key].checked);
    const colors = dataTypes.map(name => tofuChecked[name].color);
    return { dataTypes, colors };
  }

  // 饼图配置
  const pieConfig = {
    onChartReady: (e: echarts.ECharts) => {
      window.addEventListener('resize', function () {
        e.resize();
      });
    },
    showLoading: loading,
    option: {
      color: ['#6EB9FF', '#F8E285', '#F68C9E', '#8AEBA6', '#759FFF',
        '#0CE0DE', '#FFC175', '#A299FF', '#E185FC', '#41E8B5'],
      tooltip: {
        trigger: 'item',
        formatter: (params: echarts.EChartOption.Tooltip.Format) => {
          return `${params.name}: ${params.value}%`;
        },
      },
      legend: {
        orient: 'vertical',
        top: 'middle',
        right: 0,
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 14,
        formatter: function (name) {
          const r = records.find(item => item[AssignmentKeyName.getkey('退款原因')] === name) || {};
          const label = r[AssignmentKeyName.getkey('退款原因')];
          const value = r[AssignmentKeyName.getkey('占比')];
          return `${label}: ${renderValue({ value, suffix: '%' })}`;
        },
      },
      series: [
        {
          type: 'pie',
          width: '70%',
          center: ['40%', '50%'],
          radius: ['50%', '70%'],
          label: {
            show: false,
          },
          data: records.map((item, index) => {
            // 显示 10 个
            if (index < 10) {
              return {
                name: item[AssignmentKeyName.getkey('退款原因')],
                // value: renderValue({ value: item.returnReasonProportion, suffix: '%' }),
                value: item[AssignmentKeyName.getkey('占比')],
              };
            }
          }),
        },
      ],
    } as echarts.EChartOption,
  };

  // 表格列
  const columns: ColumnProps<StoreDetail.IData>[] = [
    { 
      title: '排名', 
      align: 'center', 
      width: 40,
      fixed: 'left',
      // 没有返回排名字段，返回的数组是按退货量排名的
      render: (_, __, index) => index + 1,
    },
    { 
      title: '退款原因',
      align: 'center', 
      dataIndex: AssignmentKeyName['退款原因'],
      width: 110,
    },
    { 
      title: (
        <>
          <div>退货量</div>
          <div className={commonStyles.secondary}>(占比)</div>
        </>
      ), 
      align: 'center', 
      dataIndex: AssignmentKeyName['退货量'],
      width: 80,
      render: (value: number, record: StoreDetail.IData) => (
        <>
          <div>{ value }</div>
          <div className={commonStyles.secondary}>
            { renderTdNumValue({ value: record.proportion, suffix: '%' }) }
          </div>
        </>
      ),
    },
    { 
      title: '退款金额',
      align: 'right', 
      dataIndex: AssignmentKeyName['退款金额'],
      width: 100,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
  ];

  return (
    <div className={styles.container}>
      <Tofu
        containerClassName={styles.tofuContainer}
        data={tofu}
        nameList={tofuNameList}
        checkedNames={tofuChecked}
        customBlock={customBlock}
        loading={loading}
        currency={currency}
        onClick={(name, checked) => handleBlockCheckedChange(name, checked)}
      />
      <div className={styles.lineChartContainer}>
        { renderTabsToolbar() }
        <Charts
          dataSource={polyline}
          currency={currency}
          loading={loading}
          style={{ height: 424 }}
          { ... getChartTypeAndColor() }
        />
      </div>
      <div>
        <div className={styles.title}>退款原因</div>
        <div className={styles.tableAndPieContainer}>
          <div className={styles.pieChartContainer}>
            {
              (records && records.length)
                ? <ReactEcharts {...pieConfig} />
                : <div className={styles.pieNotData}>周期内无数据</div>
            }
          </div>
          <div className={styles.tableContainer}>
            <Table
              rowKey={AssignmentKeyName['退款原因']}
              dataSource={records}
              loading={loading}
              columns={columns}
              scroll={{ y: 220 }}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
