/**
 * 数据分析弹窗
 */
import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useDispatch, useSelector } from 'umi';
import { Radio, Menu, Spin, Table, Modal, Button, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import ReactEcharts from 'echarts-for-react';
import PeriodDatePicker from '@/pages/components/PeriodDatePicker';
import Rate from '@/components/Rate';
import PathCrumbs from '../PathCrumbs';
import { requestErrorFeedback, storage, getDateCycleParam, objToQueryString } from '@/utils/utils';
import {
  nameDict,
  getFormatterValue,
  getMenuShowValue,
  colors,
  downloadUrl,
  actionTypes,
  localStorageKeys,
} from './utils';
import { getRangeDate as getTimezoneDateRange } from '@/utils/huang';
import classnames from 'classnames';
import styles from './index.less';

const { SubMenu } = Menu;

interface IProps {
  type: 'campaign' | 'group' | 'ad' | 'keyword' | 'targeting';
  visible: boolean;
  onCancel: () => void;
  /** 需要的 campaign */
  campaignId: string;
  campaignName: string;
  groupId?: string;
  groupName?: string;
  adId?: string;
  adName?: string;
  keywordId?: string;
  keywordName?: string;
  targetId?: string;
  targetName?: string;
}

const DataChartModal: React.FC<IProps> = function(props) {
  const dispatch = useDispatch();
  const {
    type,
    campaignId,
    campaignName,
    groupId,
    groupName,
    adId,
    adName,
    keywordId,
    keywordName,
    targetId,
    targetName,
    visible,
    onCancel,
  } = props;
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = {
    chart: loadingEffect[actionTypes.getPolylineData],
    table: loadingEffect[actionTypes.getTableData],
    catalogue: loadingEffect[actionTypes.getStatisticData],
  };
  // 店铺
  const {
    id: currentShopId,
    currency,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  // 折线图数据
  const [chartData, setChartData] = useState<API.IAdChartsPolyline>({});
  // 表格数据
  const [tableState, setTableState] = useState({
    records: [],
    total: 0,
    size: 20,
    current: 1,
  });
  // 左侧统计数据
  const [statisticState, setStatisticState] = useState<{[key: string]: number}>({});
  // 菜单选中的项目（图表显示的数据项目）
  const [menuSelectedKeys, setMenuSelectedKeys] = useState(['sales', 'spend']);
  // 显示图 or 表
  const [chartType, setChartType] = useState<'chart' | 'table'>('chart');
  // 统计周期
  const [periodType, setPeriodType] = useState<'DAY' | 'WEEK' | 'MONTH'>('DAY');
  // 默认选中的日期 key
  const defaultSelectedKey = storage.get(localStorageKeys[type]) || '30';
  // 日期范围
  const [dateRange, setDateRange] = useState(getTimezoneDateRange(defaultSelectedKey, false));
  // 下载按钮 loading
  const [downloadBtnLoading, setDownloadBtnLoading] = useState<boolean>(false);
  // 广告路径
  const nameList = [campaignName, groupName, adName, keywordName, targetName];

  // 获取左侧菜单统计数据
  function getStatisticData(cycle?: string) {
    dispatch({
      type: actionTypes.getStatisticData,
      targetType: type,
      payload: {
        headersParams: { StoreId: currentShopId },
        cycle: cycle || defaultSelectedKey,
        camId: campaignId,
        groupId,
        adId,
        keywordId,
        targetId,
      },
      callback: (code: number, msg: string, data: { [key: string]: number}) => {
        requestErrorFeedback(code, msg);
        setStatisticState(data);
      },
    });
  }

  // 获取折线图数据
  function getPolylineData(params?: {[key: string]: string}) {
    dispatch({
      type: actionTypes.getPolylineData,
      targetType: type,
      payload: {
        headersParams: { StoreId: currentShopId },
        statisticalMethod: periodType,
        startTime: dateRange.start,
        endTime: dateRange.end,
        camId: campaignId,
        groupId,
        adId,
        keywordId,
        targetId,
        dispAttribute: menuSelectedKeys,
        ...params,
      },
      callback: (code: number, msg: string, data: API.IAdChartsPolyline) => {
        requestErrorFeedback(code, msg);
        Object.keys(data).forEach(key => {
          !data[key] && delete data[key];
        });
        setChartData(data);
      },
    });
  }

  // 获取表格数据
  function getTableData(params?: {[key: string]: string | number | undefined}) {
    dispatch({
      type: actionTypes.getTableData,
      targetType: type,
      payload: {
        headersParams: { StoreId: currentShopId },
        statisticalMethod: periodType,
        startTime: dateRange.start,
        endTime: dateRange.end,
        camId: campaignId,
        groupId,
        adId,
        keywordId,
        targetId,
        dispAttribute: menuSelectedKeys,
        size: 20,
        current: 1,
        ...params,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (code: number, msg: string, data: any) => {
        requestErrorFeedback(code, msg);
        setTableState(data);
      },
    });
  }
  
  useEffect(() => {
    if (campaignId) {
      getStatisticData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, groupId, adId, keywordId, targetId]);

  useEffect(() => {
    if (campaignId) {
      getPolylineData();
      getTableData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodType, menuSelectedKeys, campaignId, groupId, adId, keywordId, targetId]);

  // 选中数据菜单
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleMenuSelect(e: any) {
    const { selectedKeys } = e;
    // 最多两项
    if (selectedKeys.length > 2) {
      selectedKeys.shift();
    }
    setMenuSelectedKeys(selectedKeys);
  }

  // 取消选中
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleMenuDeselect(e: any) {
    const { key, selectedKeys } = e;
    // 至少保留一项
    if (selectedKeys.length === 0) {
      setMenuSelectedKeys([key]);
    } else {
      setMenuSelectedKeys(selectedKeys);
    }
  }

  // 日期 change
  function handleDateRangeChange(dates: { start: string; end: string; selectedKey: string}) {
    const { start, end, selectedKey } = dates;
    storage.set(localStorageKeys[type], selectedKey);
    setDateRange({ start, end });
    getStatisticData(getDateCycleParam(selectedKey));
    getPolylineData({ startTime: start, endTime: end });
    getTableData({ size: tableState.size });
  }

  // 获取下载链接
  function getDownloadUrl() {
    const qs = objToQueryString({
      statisticalMethod: periodType,
      startTime: dateRange.start,
      endTime: dateRange.end,
      camId: campaignId,
      groupId: groupId || '',
      adId: adId || '',
      keywordId: keywordId || '',
      targetId: targetId || '',
    });
    return `${downloadUrl[type]}?${qs}`;
  }

  // 模拟 a 标签下载
  const download = (blobUrl: string) => {
    const a = document.createElement('a');
    const dict = {
      DAY: '日',
      WEEK: '周',
      MONTH: '月',
    };
    const path = nameList.filter(item => item && item);
    // eslint-disable-next-line max-len
    a.download = `${path[path.length - 1]}_${dict[periodType]}报表_${dateRange.start}-${dateRange.end}.xlsx`;
    a.href = blobUrl;
    a.click();
  };

  // 下载表格
  function handleDownload() {
    setDownloadBtnLoading(true);
    const url = getDownloadUrl();
    fetch(url, {
      method: 'GET',
      headers: new Headers({
        StoreId: currentShopId,
      }),
    })
      .catch(err => {
        message.error('下载失败，请稍后再试！');
        return err;
      })
      .then(res => res.blob())
      .then(data => {
        const blobUrl = window.URL.createObjectURL(data);
        download(blobUrl);
        setDownloadBtnLoading(false);
      })
      .catch(err => {
        console.error('下载数据分析表格发生错误', err);
        setDownloadBtnLoading(false);
      });
  }

  // 获取 eCharts Series 折线配置
  function getSeriesOption() {
    const series: echarts.EChartOption.SeriesLine[] = [];
    Object.keys(chartData).map((key, index) => {
      const itemData = chartData[key];
      series.push({
        name: nameDict[key],
        data: itemData.map((item: API.IAdChartsPolylineCell) => item.value),
        type: 'line',
        smooth: true,
        yAxisIndex: index,
      });
    });
    return series;
  }

  // 获取 X 时间轴的配置
  function getXAxisOption() {
    const list = chartData[menuSelectedKeys[0]];
    const data = list?.map((item: API.IAdChartsPolylineCell) => {
      return item.time;
    });
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: 'category' as any,
      axisLine: {
        lineStyle: { color: '#ccc' },
      },
      axisTick: {
        lineStyle: { color: '#ccc' },
        inside: true,
      },
      axisLabel: { color: '#666' },
      boundaryGap: false,
      data,
    };
  }

  // 获取一个或两个 Y 轴的配置
  function getYAxisOption() {
    const yAxisItem: echarts.EChartOption.YAxis = {
      name: '',
      type: 'value',
      position: 'left',
      splitLine: {
        // 横向虚线
        lineStyle: { type: 'dotted', color: '#c1c1c1' },
      },
      // 不显示 y 轴线和刻度线
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#555',
      },
    };
    // 赋初始值避免报错
    const yAxisList: echarts.EChartOption.YAxis[] = [yAxisItem];
    // 两个 y 轴
    Object.keys(chartData).forEach((key, index) => {
      const currencyKeys = ['sales', 'cpc', 'cpa', 'spend'];
      const percentKeys = ['acos', 'ctr', 'conversionsRate'];
      // 格式化 y 轴的数值,货币或百分比
      const formatter = (value: number) => {
        let formatterResult = `${value}`;
        if (currencyKeys.includes(key)) {
          formatterResult = `${currency}${value}`;
        } else if (percentKeys.includes(key)) {
          formatterResult = `${value}%`;
        }
        return formatterResult;
      };
      yAxisList[index] = {
        ...yAxisItem,
        position: index ? 'right' : 'left',
        axisLabel: {
          formatter,
          color: '#555',
        },
      };
    });
    return yAxisList;
  }

  // 折线图配置
  const reactEchartsConfig = {
    notMerge: true,
    option: {
      grid: {
        top: 30,
        right: 70,
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          color: '#333',
          lineHeight: 24,
        },
        // 设置白底和阴影
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0px 3px 13px 0px rgba(231, 231, 231, 0.75);',
        // tooltip 自定义格式
        formatter: params => {
          let paramsList = [];
          if (params instanceof Array){
            paramsList = [...params];
          } else {
            paramsList = [params];
          }
          const time = params[0].axisValue;
          return ReactDOMServer.renderToStaticMarkup(
            <div className={styles.tooltipContainer}>
              <div className={styles.tooltipTime}>{time}</div>
              {
                paramsList.map(item => {
                  return (
                    <div key={item.seriesName}>
                      <div className={styles.tooltipItem}>
                        <span className={styles.marker} style={{ background: item.color }}></span>
                        <span className={styles.tooltipTitle}>{item.seriesName}：</span>
                        { getFormatterValue(item.seriesName, item.value, currency) }
                      </div>
                    </div>
                  );
                })
              }
            </div>
          );
        },
      },
      legend: {
        left: 'center',
        bottom: 0,
        itemGap: 40,
        textStyle: { color: '#666', fontSize: 14 }, 
      },
      xAxis: getXAxisOption(),
      yAxis: getYAxisOption(),
      series: getSeriesOption(),
      color: colors,
    } as echarts.EChartOption,
    style: { width: '100%', height: '530px' },
    loadingOption: { color: colors[0] },
    showLoading: loading.chart,
  };

  // 表格分页器配置
  const paginationProps = {
    current: tableState.current,
    pageSize: tableState.size,
    total: tableState.total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => (<>共 {total} 个</>),
    onChange: (current: number, size?: number) => {
      getTableData({ current: size === tableState.size ? current : 1, size });
    },
  };

  // 表格列
  const columns: ColumnProps<API.IAdCampaign>[] = [
    {
      title: '日期',
      dataIndex: 'statisticTime',
      fixed: 'left',
      align: 'center',
      width: 100,
    }, {
      title: '销售额',
      dataIndex: 'sales',
      align: 'right',
      width: 120,
      render: value => <>{currency}{value}</>,
    }, {
      title: '订单量',
      dataIndex: 'orderNum',
      align: 'center',
      width: 70,
    }, {
      title: 'CPC',
      dataIndex: 'cpc',
      align: 'right',
      width: 60,
      render: value => <>{currency}{value}</>,
    }, {
      title: 'CPA',
      dataIndex: 'cpa',
      align: 'right',
      width: 60,
      render: value => <>{currency}{value}</>,
    }, {
      title: 'Spend',
      dataIndex: 'spend',
      align: 'center',
      width: 80,
    }, {
      title: 'ACoS',
      dataIndex: 'acos',
      align: 'center',
      width: 50,
      render: value => <>{value}%</>,
    }, {
      title: 'RoAS',
      dataIndex: 'roas',
      align: 'center',
      width: 60,
    }, {
      title: 'Impressions',
      dataIndex: 'impressions',
      align: 'center',
      width: 90,
    }, {
      title: 'Clicks',
      dataIndex: 'clicks',
      align: 'center',
      width: 70,
    }, {
      title: 'CTR',
      dataIndex: 'ctr',
      align: 'center',
      width: 60,
      render: value => <>{value}%</>,
    }, {
      title: '转化率',
      dataIndex: 'conversionsRate',
      align: 'center',
      width: 60,
      render: value => <>{value}%</>,
    },
  ];

  // 渲染图或表
  function renderChartOrTable() {
    return {
      chart: <ReactEcharts {...reactEchartsConfig} />,
      table: (
        <div className={styles.tableContainer}>
          <Table
            loading={loading.table}
            columns={columns}
            scroll={{ x: 'max-content', y: '430px', scrollToFirstRowOnChange: true }}
            rowKey="statisticTime"
            dataSource={tableState.records}
            locale={{ emptyText: '没有找到相关数据' }}
            pagination={{ ...paginationProps, size: 'default' }}
          />
        </div>
      ),
    }[chartType];
  }

  // 获取对应的折线颜色的上边线
  function gitActiveLine(key: string) {
    const index = menuSelectedKeys.indexOf(key);
    const color = colors[index];
    return (
      color ? <div className={styles.activeLine} style={{ background: color }}></div> : ''
    );
  }

  // 左侧菜单列表
  const menuList = [
    {
      title: '销售表现',
      key: '销售表现',
      list: [
        {
          name: '销售额',
          key: 'sales',
          value: getMenuShowValue(statisticState.sales, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfSales, currency),
          chainRatio: <Rate value={statisticState.salesRatio} decimals={2} />,
        }, {
          name: '订单量',
          key: 'orderNum',
          value: getMenuShowValue(statisticState.orderNum, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfOrderNum, currency),
          chainRatio: <Rate value={statisticState.orderNumRatio} decimals={2} />,
        },
      ],
    }, {
      title: '投入回报',
      key: '投入回报',
      list: [
        {
          name: 'CPC',
          key: 'cpc',
          value: getMenuShowValue(statisticState.cpc, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfCpc, currency),
          chainRatio: <Rate value={statisticState.cpcRatio} decimals={2} />,
        }, {
          name: 'CPA',
          key: 'cpa',
          value: getMenuShowValue(statisticState.cpa, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfCpa, currency),
          chainRatio: <Rate value={statisticState.cpaRatio} decimals={2} />,
        }, {
          name: 'ACoS',
          key: 'acos',
          value: getMenuShowValue(statisticState.acos, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfAcos, currency),
          chainRatio: <Rate value={statisticState.acosRatio} decimals={2} />,
        }, {
          name: 'Spend',
          key: 'spend',
          value: getMenuShowValue(statisticState.spend, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfSpend, currency),
          chainRatio: <Rate value={statisticState.spendRatio} decimals={2} />,
        }, {
          name: 'RoAS',
          key: 'roas',
          value: getMenuShowValue(statisticState.roas, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfRoas, currency),
          chainRatio: <Rate value={statisticState.roasRatio} decimals={2} />,
        },
      ],
    }, {
      title: '流量转化',
      key: '流量转化',
      list: [
        {
          name: 'Impressions',
          key: 'impressions',
          value: getMenuShowValue(statisticState.impressions, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfImpressions, currency),
          chainRatio: <Rate value={statisticState.impressionsRatio} decimals={2} />,
        }, {
          name: 'Clicks',
          key: 'clicks',
          value: getMenuShowValue(statisticState.clicks, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfClicks, currency),
          chainRatio: <Rate value={statisticState.clicksRatio} decimals={2} />,
        }, {
          name: 'CTR',
          key: 'ctr',
          value: getMenuShowValue(statisticState.ctr, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfCtr, currency),
          chainRatio: <Rate value={statisticState.ctrRatio} decimals={2} />,
        }, {
          name: '转化率',
          key: 'conversionsRate',
          value: getMenuShowValue(statisticState.conversionsRate, currency),
          lastCycleValue: getMenuShowValue(statisticState.firstHalfConversionsRate, currency),
          chainRatio: <Rate value={statisticState.conversionsRateRatio} decimals={2} />,
        },
      ],
    },
  ];

  return (
    <Modal
      visible={visible}
      width={1330}
      keyboard={false}
      footer={false}
      maskClosable={false}
      className={styles.Modal}
      onCancel={onCancel}
    >
      <PathCrumbs nameList={nameList} />
      <div className={styles.container}>
        <Spin spinning={loading.catalogue}>
          <div className={classnames(styles.catalogue, 'h-scroll')}>
            <Menu
              multiple
              className={styles.Menu}
              onSelect={handleMenuSelect}
              onDeselect={handleMenuDeselect}
              selectedKeys={menuSelectedKeys}
              defaultOpenKeys={['销售表现', '投入回报', '流量转化']}
              mode="inline"
            >
              {
                menuList.map(subMenu => (
                  <SubMenu key={subMenu.key} title={subMenu.title}>
                    {
                      subMenu.list.map(menu => (
                        <Menu.Item key={menu.key} disabled={loading.chart}>
                          { gitActiveLine(menu.key) }
                          <div className={styles.catalogueItem}>
                            <div>
                              <div className={styles.name}>{menu.name}</div>
                              <div className={styles.value}>{menu.value}</div>
                            </div>
                            <div>
                              <div>
                                上期：
                                <span className={styles.lastCycleValue}>{menu.lastCycleValue}</span>
                              </div>
                              <div>环比：{menu.chainRatio}</div>
                            </div>
                          </div>
                        </Menu.Item>
                      ))
                    }
                  </SubMenu>
                ))
              }
            </Menu>
          </div>
        </Spin>
        <div className={styles.charts}>
          <div className={styles.toolbar}>
            <div>
              <Radio.Group
                options={[
                  { label: '图', value: 'chart' },
                  { label: '表', value: 'table' },
                ]}
                onChange={e => setChartType(e.target.value)}
                value={chartType}
                optionType="button"
                buttonStyle="solid"
              />
            </div>
            <div className={styles.dateToobar}>
              <div>
                统计周期：
                <Radio.Group
                  options={[
                    { label: '日', value: 'DAY' },
                    { label: '周', value: 'WEEK' },
                    { label: '月', value: 'MONTH' },
                  ]}
                  onChange={e => setPeriodType(e.target.value)}
                  value={periodType}
                  optionType="button"
                  buttonStyle="solid"
                />
              </div>
              <div>
                <PeriodDatePicker
                  defaultSelectedKey={String(defaultSelectedKey)}
                  onChange={handleDateRangeChange}
                />
              </div>
              {
                chartType === 'table'
                  ? <Button onClick={handleDownload} loading={downloadBtnLoading}>下载</Button>
                  : null
              }
            </div>
          </div>
          { renderChartOrTable() }
        </div>
      </div>
    </Modal>
  );
};

export default DataChartModal;
