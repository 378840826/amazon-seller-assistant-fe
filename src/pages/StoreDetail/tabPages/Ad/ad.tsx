/**
 * 广告表现
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Checkbox, Collapse, Radio, Spin, Table, Tabs } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { IConnectState } from '@/models/connect';
import { renderTdNumValue, renderTdNumValue as renderValue } from '@/pages/StoreReport/utils';
import { requestErrorFeedback } from '@/utils/utils';
import { ColumnProps } from 'antd/es/table';
import Charts from '../../components/Charts';
import { groups } from '../../components/CustomBlock';
import MyTable from '../../components/Table';
import Tofu from '../../components/Tofu';
import { AssignmentKeyName } from '../../utils';
import commonStyles from '../tabPageCommon.less';
import TableNotData from '@/components/TableNotData';
import Rate from '@/components/Rate';
import { showPreviousPeriodKey } from '../../config';
import styles from './ad.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const Page: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    tofu: loadingEffect['storeDetail/fetchAdTofu'],
    polyline: loadingEffect['storeDetail/fetchAdPolyline'],
    table: loadingEffect['storeDetail/fetchAdTable'],
  };
  const pageData = useSelector((state: IConnectState) => state.storeDetail);
  const {
    customBlock,
    searchParams,
    adData: { tofu, tofuChecked, colors, table, polyline, channel },
    showCurrency: currency,
  } = pageData;

  const { records, total, current, size } = table;

  // 显示图 or 表
  const [chartType, setChartType] = useState<'chart' | 'table'>('chart');
  // 统计周期
  const [periodType, setPeriodType] = useState<StoreDetail.PeriodType>('DAY');
  // 上年同期是否显示
  const [previousYear, setPreviousYear] = useState<boolean>(true);
  // 上X同期是否显示
  const [showPrevious, setShowPrevious] = useState<boolean>(false);

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
  }, [showPrevious, previousYear, polyline]);

  // 查询条件改变，刷新豆腐块数据、折线图、表格
  useEffect(() => {
    if (searchParams.startTime && searchParams.endTime) {
      // 折线图
      dispatch({
        type: 'storeDetail/fetchAdPolyline',
        payload: {
          ...searchParams,
          method: periodType,
        },
        callback: requestErrorFeedback,
      });
      // 豆腐块
      dispatch({
        type: 'storeDetail/fetchAdTofu',
        payload: { headersParams },
        callback: requestErrorFeedback,
      });
      // 表格
      dispatch({
        type: 'storeDetail/fetchAdTable',
        payload: {
          ...searchParams,
          size,
          current: 1,
          method: periodType,
        },
        callback: requestErrorFeedback,
      });
      // 各渠道数据
      dispatch({
        type: 'storeDetail/fetchAdChannel',
        payload: {
          ...searchParams,
          method: periodType,
        },
        callback: requestErrorFeedback,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 豆腐块 active 数据切换，刷新折线图
  function handleBlockCheckedChange(name: string) {
    dispatch({
      type: 'storeDetail/updateAdTofuChecked',
      payload: name,
    });
    dispatch({
      type: 'storeDetail/fetchAdPolyline',
      payload: {
        ...searchParams,
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
      type: 'storeDetail/fetchAdTable',
      payload: {
        size,
        current: 1,
        method: value,
      },
      callback: requestErrorFeedback,
    });
    // 折线图
    dispatch({
      type: 'storeDetail/fetchAdPolyline',
      payload: {
        ...searchParams,
        method: value,
      },
      callback: requestErrorFeedback,
    });
  }

  // 表格翻页
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleTableChange(params: any) {
    dispatch({
      type: 'storeDetail/fetchAdTable',
      payload: {
        ...params,
        method: periodType,
      },
      callback: requestErrorFeedback,
    });
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
              上同期
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
      </div>
    );
  }

  // 静态圆环图
  function getStaticDoughnut(data: {name: string; value: number}[]) {
    const config = {
      option: {
        color: ['#6EB9FF', '#F8E285'],
        legend: {
          orient: 'vertical',
          top: 'middle',
          left: 80,
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 10,
          textStyle: {
            color: '#555',
            rich: {
              valueStyle: {
                color: '#222',
                lineHeight: 10,
              },
            },
          },
          formatter: function (name) {
            const valueNum = data.find(item => item.name === name)?.value;
            const value = renderValue({ value: valueNum, suffix: '%' });
            // eslint-disable-next-line prefer-template
            return name + '{' + 'valueStyle' + '|' + ': ' + value + '}';
          },
        },
        series: [
          {
            type: 'pie',
            center: [40, '50%'],
            radius: [24, 34],
            label: { show: false },
            silent: true,
            data,
          },
        ],
      } as echarts.EChartOption,
      style: {
        width: '100%',
        height: '100%',
      },
    };
    return <ReactEcharts {...config} />;
  }

  // 动态圆环图
  function getDoughnut(data: {name: string; value: number}[]) {
    const config = {
      option: {
        color: ['#6EB9FF', '#F8E285', '#F68C9E', '#8AEBA6'],
        tooltip: {
          trigger: 'item',
          formatter: (param: echarts.EChartOption.Tooltip.Format) => {
            const { name, value } = param;
            return `${name}: ${renderValue({ value: Number(value), suffix: '%' })}`;
          },
        },
        legend: {
          orient: 'vertical',
          top: 'middle',
          left: '50%',
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 10,
          textStyle: {
            color: '#555',
            rich: {
              valueStyle: {
                color: '#222',
                lineHeight: 10,
              },
            },
          },
          formatter: function (name) {
            const valueNum = data.find(item => item.name === name)?.value;
            const value = renderValue({ value: valueNum, suffix: '%' });
            // eslint-disable-next-line prefer-template
            return name + '{' + 'valueStyle' + '|' + ': ' + value + '}';
          },
        },
        series: [
          {
            type: 'pie',
            center: ['30%', '50%'],
            radius: [44, 64],
            label: { show: false },
            data,
          },
        ],
      } as echarts.EChartOption,
      style: {
        width: '100%',
        height: '100%',
      },
    };
    return <ReactEcharts {...config} />;
  }

  // 表格列
  const columns: ColumnProps<StoreDetail.IData>[] = [
    { 
      title: '周期', 
      align: 'center', 
      dataIndex: 'cycleDate',
      width: 100,
      fixed: 'left',
      render: value => <div className={commonStyles.nowrap}>{value}</div>,
    },
    {
      title: (
        <>
          <div>广告销售额</div>
          <div className={commonStyles.secondary}>(占比)</div>
        </>
      ), 
      align: 'right', 
      dataIndex: AssignmentKeyName['广告销售额'],
      width: 80,
      render: (value: number, record: StoreDetail.IData) => (
        <>
          <div>{ value }</div>
          <div className={commonStyles.secondary}>
            { 
              renderTdNumValue({
                value: record[`${AssignmentKeyName['广告销售额']}Proportion`], suffix: '%' }
              )
            }
          </div>
        </>
      ),
    },
    {
      title: (
        <>
          <div>自然销售额</div>
          <div className={commonStyles.secondary}>(占比)</div>
        </>
      ), 
      align: 'right', 
      dataIndex: AssignmentKeyName['自然销售额'],
      width: 80,
      render: (value: number, record: StoreDetail.IData) => (
        <>
          <div>{ value }</div>
          <div className={commonStyles.secondary}>
            { 
              renderTdNumValue({
                value: record[`${AssignmentKeyName['自然销售额']}Proportion`], suffix: '%' }
              )
            }
          </div>
        </>
      ),
    },
    {
      title: (
        <>
          <div>广告订单量</div>
          <div className={commonStyles.secondary}>(占比)</div>
        </>
      ), 
      align: 'center', 
      dataIndex: AssignmentKeyName['广告订单量'],
      width: 80,
      render: (value: number, record: StoreDetail.IData) => (
        <>
          <div>{ value }</div>
          <div className={commonStyles.secondary}>
            { 
              renderTdNumValue({
                value: record[`${AssignmentKeyName['广告订单量']}Proportion`], suffix: '%' }
              )
            }
          </div>
        </>
      ),
    },
    {
      title: (
        <>
          <div>自然订单量</div>
          <div className={commonStyles.secondary}>(占比)</div>
        </>
      ), 
      align: 'center', 
      dataIndex: AssignmentKeyName['自然订单量'],
      width: 80,
      render: (value: number, record: StoreDetail.IData) => (
        <>
          <div>{ value }</div>
          <div className={commonStyles.secondary}>
            { 
              renderTdNumValue({
                value: record[`${AssignmentKeyName['自然订单量']}Proportion`], suffix: '%' }
              )
            }
          </div>
        </>
      ),
    },
    {
      title: 'CPC',
      dataIndex: AssignmentKeyName.getkey('CPC'),
      align: 'right', 
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    {
      title: 'CPA',
      dataIndex: AssignmentKeyName.getkey('CPA'),
      align: 'right', 
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    {
      title: 'CPM',
      dataIndex: AssignmentKeyName.getkey('CPM'),
      align: 'right', 
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    {
      title: 'Spend',
      dataIndex: AssignmentKeyName.getkey('Spend'),
      align: 'right', 
      width: 80,
      render: value => renderTdNumValue({ value, prefix: currency }),
    },
    {
      title: 'ACoS',
      dataIndex: AssignmentKeyName.getkey('ACoS'),
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value, suffix: '%' }),
    },
    {
      title: '综合ACoS',
      dataIndex: AssignmentKeyName.getkey('综合ACoS'),
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value, suffix: '%' }),
    },
    {
      title: 'RoAS',
      dataIndex: AssignmentKeyName.getkey('RoAS'),
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value, isFraction: true }),
    },
    {
      title: '综合RoAS',
      dataIndex: AssignmentKeyName.getkey('综合RoAS'),
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value, isFraction: true }),
    },
    {
      title: 'Impressions',
      dataIndex: AssignmentKeyName.getkey('Impressions'),
      align: 'center', 
      width: 90,
      render: value => renderTdNumValue({ value }),
    },
    {
      title: 'Clicks',
      dataIndex: AssignmentKeyName.getkey('Clicks'),
      align: 'center', 
      width: 80,
      render: value => renderTdNumValue({ value }),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Collapse defaultActiveKey={['销售表现', '投入回报', '流量转化']} ghost>
          <Panel header="销售表现" key="销售表现">
            <div className={styles.doughnutContainer}>
              <div>
                {
                  getStaticDoughnut([
                    {
                      name: '广告销售额',
                      value: tofu[AssignmentKeyName.getkey('广告销售额占比')],
                    }, {
                      name: '自然销售额',
                      value: tofu[AssignmentKeyName.getkey('自然销售额占比')],
                    }, 
                  ])
                }
              </div>
              <div>
                {
                  getStaticDoughnut([
                    {
                      name: '广告订单量',
                      value: tofu[AssignmentKeyName.getkey('广告订单量占比')],
                    }, {
                      name: '自然订单量',
                      value: tofu[AssignmentKeyName.getkey('自然订单量占比')],
                    }, 
                  ])
                }
              </div>
            </div>
            <Tofu
              data={tofu}
              nameList={groups.广告销售表现}
              checkedNames={tofuChecked}
              customBlock={customBlock}
              colors={colors}
              loading={loading.tofu}
              currency={currency}
              onClick={(name) => handleBlockCheckedChange(name)}
            />
          </Panel>
          <Panel header="投入回报" key="投入回报">
            <Tofu
              data={tofu}
              nameList={groups.广告投入回报}
              checkedNames={tofuChecked}
              customBlock={customBlock}
              colors={colors}
              loading={loading.tofu}
              currency={currency}
              onClick={(name) => handleBlockCheckedChange(name)}
            />
          </Panel>
          <Panel header="流量转化" key="流量转化">
            <Tofu
              data={tofu}
              nameList={groups.广告流量转化}
              checkedNames={tofuChecked}
              customBlock={customBlock}
              colors={colors}
              loading={loading.tofu}
              currency={currency}
              onClick={(name) => handleBlockCheckedChange(name)}
            />
          </Panel>
        </Collapse>
        <div className={styles.chartsContainer}>
          <div className={styles.toolbar}>
            <Tabs
              defaultActiveKey={chartType}
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
      </div>
      <div className={styles.right}>
        <div>
          <div className={styles.title}>各渠道表现</div>
          <div>
            <Table
              className={styles.channelTable}
              columns={[
                { 
                  title: '渠道', 
                  align: 'center', 
                  dataIndex: 'channel',
                  width: 40,
                }, {
                  title: (
                    <>
                      <div>广告销售额</div>
                      <div className={commonStyles.secondary}>(环比)</div>
                    </>
                  ), 
                  align: 'right',
                  dataIndex: AssignmentKeyName['广告销售额'],
                  width: 100,
                  render: (value: number, record) => (
                    <>
                      <div>{ renderTdNumValue({ value, prefix: currency }) }</div>
                      <div>
                        { <Rate value={record[AssignmentKeyName['广告销售额环比']]} decimals={2} /> }
                      </div>
                    </>
                  ),
                }, {
                  title: (
                    <>
                      <div>广告订单量</div>
                      <div className={commonStyles.secondary}>(环比)</div>
                    </>
                  ), 
                  align: 'center',
                  dataIndex: AssignmentKeyName['广告订单量'],
                  width: 80,
                  render: (value: number, record) => (
                    <>
                      <div>{ renderTdNumValue({ value }) }</div>
                      <div>
                        { <Rate value={record[AssignmentKeyName['广告订单量环比']]} decimals={2} /> }
                      </div>
                    </>
                  ),
                }, {
                  title: (
                    <>
                      <div>Spend</div>
                      <div className={commonStyles.secondary}>(环比)</div>
                    </>
                  ), 
                  align: 'right',
                  dataIndex: AssignmentKeyName.getkey('Spend'),
                  width: 80,
                  render: (value: number, record) => (
                    <>
                      <div>{ renderTdNumValue({ value, prefix: currency }) }</div>
                      <div>
                        {<Rate value={record[AssignmentKeyName.getkey('Spend环比')]} decimals={2} />}
                      </div>
                    </>
                  ),
                }, {
                  title: (
                    <>
                      <div>ACoS</div>
                      <div className={commonStyles.secondary}>(环比)</div>
                    </>
                  ), 
                  align: 'center',
                  dataIndex: AssignmentKeyName.getkey('ACoS'),
                  width: 80,
                  render: (value: number, record) => (
                    <>
                      <div>{ value }</div>
                      <div>
                        {<Rate value={record[AssignmentKeyName.getkey('ACoS环比')]} decimals={2} />}
                      </div>
                    </>
                  ),
                },
              ]}
              rowKey="channel"
              dataSource={channel}
              locale={{ emptyText: <TableNotData style={{ padding: 40 }} hint="没有找到相关数据" /> }}
              pagination={false}
            /> 
          </div>
        </div>
        <div>
          <div className={styles.title}>广告销售额</div>
          <div className={styles.pieContainer}>
            {
              getDoughnut(
                channel.map(
                  item => ({ name: item.channel, value: item[AssignmentKeyName['广告销售额']] })
                )
              )
            }
          </div>
        </div>
        <div>
          <div className={styles.title}>广告订单量</div>
          <div className={styles.pieContainer}>
            {
              getDoughnut(
                channel.map(
                  item => ({ name: item.channel, value: item[AssignmentKeyName['广告订单量']] })
                )
              )
            }
          </div>
        </div>
        <div>
          <div className={styles.title}>Spend</div>
          <div className={styles.pieContainer}>
            {
              getDoughnut(
                channel.map(
                  item => ({ name: item.channel, value: item[AssignmentKeyName.getkey('Spend')] })
                )
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
