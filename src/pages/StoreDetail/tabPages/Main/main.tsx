/**
 * 整体表现
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import DataBlock from '../../DataBlock';
import { groups } from '../../CustomBlock';
import { renderTdNumValue, renderTdNumValue as renderValue } from '@/pages/StoreReport/utils';
import { Button, Checkbox, Radio, Spin, Tabs } from 'antd';
import Charts from '../../Charts';
import MyTable from '../../Table';
import {
  moneyFormatNames,
  percentageFormatNames,
  AssignmentKeyName,
  multiDataOrigin,
} from '../../utils';
import styles from './main.less';
import { ColumnProps } from 'antd/es/table';

const { TabPane } = Tabs;

// 问号提示
const queryDict = {
  'PageView': '需要按天导入Business Report',
  'Session': '需要按天导入Business Report',
  '转化率': '转化率=订单量/Session',
  '优惠订单': '有优惠折扣的订单量',
  '关联销售': '本商品和其他商品一起购买的订单量',
};

// 整体表现包括 总体销售表现 和 总体流量转化
const tofuNameList = [...groups.总体销售表现, ...groups.总体流量转化];

const Page: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { currency, id: currentShopId } = currentShop;
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
    mainData: { tofu, tofuChecked, colors, table, polyline, dataOriginSelectorVisible },
  } = pageData;
  const { records, total, current, size } = table;
  // 显示图 or 表
  const [chartType, setChartType] = useState<'chart' | 'table'>('chart');
  // 统计周期
  const [periodType, setPeriodType] = useState<StoreDetail.PeriodType>('DAY');
  // 上年同期是否显示
  const [previousYear, setPreviousYear] = useState<boolean>(true);
  // 上月同期是否显示
  const [previousMonth, setPreviousMonth] = useState<boolean>(false);
  // 上周同期是否显示
  const [previousWeek, setPreviousWeek] = useState<boolean>(false);
  // 多源字段的数据源
  const [dataOrigin, setDataOrigin] = useState<StoreDetail.DataOrigin>('');
  // 导出按钮 loading
  const [downloadBtnLoading, setDownloadBtnLoading] = useState<boolean>(false);

  // 切换豆腐块/切换统计周期/切换数据源 刷新折线图
  useEffect(() => {
    if (searchParams.cycle || searchParams.timeMethod) {
      dispatch({
        type: 'storeDetail/fetchMainPolyline',
        payload: {
          ...searchParams,
          dataOrigin,
          periodType,
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tofuChecked, periodType, dataOrigin]);

  // 切换统计周期后刷新表格
  useEffect(() => {
    if (searchParams.cycle || searchParams.timeMethod) {
      dispatch({
        type: 'storeDetail/fetchMainTable',
        payload: {
          size,
          current: 1,
          periodType,
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodType]);

  // 查询条件改变，刷新豆腐块数据、折线图、表格
  useEffect(() => {
    if (searchParams.cycle || searchParams.timeMethod) {
      // 折线图
      dispatch({
        type: 'storeDetail/fetchMainPolyline',
        payload: {
          ...searchParams,
          periodType,
        },
      });
      // 豆腐块
      dispatch({
        type: 'storeDetail/fetchMainTofu',
        payload: { headersParams },
      });
      // 表格
      dispatch({
        type: 'storeDetail/fetchMainTable',
        payload: {
          size,
          current: 1,
          periodType,
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 折线图数据
  const chartDataSource = useMemo(() => {
    const 本期 = polyline.本期;
    const 上年同期 = polyline.上年同期;
    const 上月同期 = polyline.上月同期;
    const 上周同期 = polyline.上周同期;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r: any = { 本期 };
    previousYear && (r.上年同期 = 上年同期);
    previousMonth && (r.上月同期 = 上月同期);
    previousWeek && (r.上周同期 = 上周同期);
    return r;
  }, [previousYear, previousWeek, previousMonth, polyline]);

  // 豆腐块 active 数据切换
  function handleBlockCheckedChange(name: string) {
    dispatch({
      type: 'storeDetail/updateMainTofuChecked',
      payload: name,
    });
  }

  // 表格翻页
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleTableChange(params: any) {
    console.log('handleTableChange', params);
    dispatch({
      type: 'storeDetail/fetchMainTable',
      payload: {
        ...params,
        periodType,
      },
    });
  }

  // 统计周期类型切换
  function handlePeriodTypeChange(value: StoreDetail.PeriodType) {
    setPeriodType(value);
  }

  // 数据源选择
  function handleDataOriginChange(value: StoreDetail.DataOrigin) {
    setDataOrigin(value);
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
            searchParams.timeMethod === 'week' &&
            <Checkbox
              onChange={() => setPreviousWeek(!previousWeek)}
              checked={previousWeek}
            >
              上周同期
            </Checkbox>
          }
          {
            searchParams.timeMethod === 'month' &&
            <Checkbox
              onChange={() => setPreviousMonth(!previousMonth)}
              checked={previousMonth}
            >
              上月同期
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
      <div className={styles.dateToobar}>
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
      dataIndex: 'time',
      width: 100,
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
    },
    { 
      title: '总销量', 
      align: 'center', 
      dataIndex: AssignmentKeyName['总销量'],
      width: 90,
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
    },
    { 
      title: '关联销售', 
      align: 'center', 
      dataIndex: AssignmentKeyName['关联销售'],
      width: 90,
    },
    { 
      title: 'PageView', 
      align: 'center', 
      // eslint-disable-next-line dot-notation
      dataIndex: AssignmentKeyName['PageView'],
      width: 90,
    },
    { 
      title: 'Session', 
      align: 'center', 
      // eslint-disable-next-line dot-notation
      dataIndex: AssignmentKeyName['Session'],
      width: 90,
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
      <Spin spinning={loading.tofu}>
        <div className={styles.tofuContainer}>
          {
            tofuNameList.map(name => {
              const key = AssignmentKeyName.getkey(name);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              let value: any = tofu[key];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              let previousValue: any = tofu[`${key}Previous`];
              if (moneyFormatNames.includes(name)) {
                value = renderValue({ value, prefix: currency });
                previousValue = renderValue({ value: previousValue, prefix: currency });
              } else if (percentageFormatNames.includes(name)) {
                value = renderValue({ value, suffix: '%' });
                previousValue = renderValue({ value: previousValue, suffix: '%' });
              } else {
                value = renderValue({ value });
                previousValue = renderValue({ value: previousValue });
              }
              const ratioValue = tofu[`${key}RingRatio`];
              const checked = tofuChecked.includes(name);
              const color = colors[tofuChecked.indexOf(name)];
              return (customBlock[name] &&
                <DataBlock
                  key={key}
                  checked={checked}
                  name={name}
                  value={value}
                  previous={previousValue}
                  ratio={ratioValue}
                  hint={queryDict[name]}
                  clickCallback={() => handleBlockCheckedChange(name)}
                  color={color}
                />
              );
            })
          }
        </div>
      </Spin>
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
                dataSource={chartDataSource}
                dataTypes={tofuChecked}
                currency={currency}
                loading={loading.polyline}
                colors={colors}
              />
              {
                tofuChecked.some(name => multiDataOrigin.includes(name)) &&
                dataOriginSelectorVisible &&
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
              <MyTable
                dataSource={records}
                columns={columns}
                total={total}
                current={current}
                size={size}
                onChange={handleTableChange}
                loading={loading.table}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Page;
