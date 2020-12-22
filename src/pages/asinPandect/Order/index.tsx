import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './index.less';
import UpdateComponent from './components/UpdateComponent';
import PageViewSession from './components/PageViewSession';
import PageView from './components/PageView';
import DefinedCalendar from '@/components/DefinedCalendar';
import CheckboxDownList from '@/components/CheckboxDownList';
import TableNotData from '@/components/TableNotData';
import Statistic from './components/Statistic';
import Total from './components/Total';
import DouFu from './components/Doufu';
import LineChartsComponent from './components/LineChart';
import { storageKeys, toIndexFixed } from '@/utils/huang';
import { handleDouFu, handleRange, tooltipPosition, douFuDefaultList } from './function';
import { storage } from '@/utils/utils';
import echarts from 'echarts';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import ShowData from '@/components/ShowData';

import { 
  Table, 
  Button,
  Checkbox,
  Spin,
  message,
} from 'antd';
import {
  useDispatch,
  useSelector,
} from 'umi';

const { 
  asinOrderDateRange,
  asinOrderCheckbox,
} = storageKeys;

const Order: React.FC = () => {
  const dispatch = useDispatch();

  const [chCondition, setChCondition] = useState<boolean>(false); // 专门用于控制请求的
  const current = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const StoreId = current.id;
  const localDataCols = storage.get(`${asinOrderCheckbox}_checkbox_downlist`); // 自定义数据
  const [dataSource, setDataSource] = useState<[]>([]); // 表格配置
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const { currency, id: shopId } = currentShop;
  const currentAsin = useSelector((state: AsinOrder.IGlobalAsinTYpe) => state.asinGlobal.asin);
  const refBarCharts = useRef<HTMLDivElement >(null);

  const [statistic, setStatistic] = useState<string>('DAY'); // 周期统计
  const [homochronousvisible, setHomochronousvisible] = useState<boolean>(true); // 上月同期和上周同期显示
  const [homochronous, setHomochronous] = useState<'week'|'month'>('week'); // 是上月同期还是上周同期 true月 false周
  const [showWeekMonth, setShowWeekMonth] = useState<boolean>(false); // 是否勾选出上月(周)同期数据
  const [lcLoading, setLcLoading] = useState<boolean>(true); // 折线图loading

  const [aggregate, setAggregate] = useState<AsinOrder.ITotalType>();
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [pcurrent, setPcurrent] = useState<number>(1);
  const [size, setSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);

  // 默认选中的周期
  const localDateType = storage.get(`${asinOrderDateRange}_date_checked`);
  const [dateRangeItem, setDateRangeItem] = useState<string>(localDateType || '7'); // 选中
  
  // 自定义数据及豆腐块
  const [selectList, setSelectList] = useState<AsinOrder.IDouFuListTyep[]>(
    localDataCols || douFuDefaultList  
  );
  // 选中的豆腐块
  const attributes = useSelector((state: AsinOrder.IDFChecke) => state.asinOrder.dfCheckedTypes);

  const [update, setUpdate] = useState<string>('');
  // 折线图所有数据
  const [lineChartData, setLineChartData] = useState<AsinOrder.ILineChartData|null>(null);
  // 分时统计直柱图数据
  const [barData, setBarData] = useState<number[]>([]);
  // 折线图相关的SKU
  const [lineSkus, setLineSkus] = useState<string[]>([]);
  // 选中的SKU
  const [checkedSkus, setCheckedSkus] = useState<string[]>([]);
  // 折线图是否显示上年同期数据
  const [ishc, setIshc] = useState<boolean>(false);

  const handleReq = () => {
    // eslint-disable-next-line
    const req: any = {
      asin: currentAsin,
      method: statistic,
      attributes,
      skus: checkedSkus,
      headersParams: {
        StoreId,
      },
    };
    if (dateRangeItem === 'week' || dateRangeItem === 'month') {
      req.timeMethod = dateRangeItem.toUpperCase();
      const { startDate, endDate } = storage.get(`${asinOrderDateRange}_date`);
      req.startTime = startDate;
      req.endTime = endDate;
    } else {
      const type = String(dateRangeItem);
      const cycle = handleRange(type);
      req.cycle = cycle;
    }
    return req;
  };

  // 判断当前是否为按月/周查看
  const judgeWeekMonth = () => {
    if (dateRangeItem === 'week' || dateRangeItem === 'month') {
      setHomochronousvisible(true);
      setHomochronous(dateRangeItem);
    } else {
      setHomochronousvisible(false);
    }
  };

  // 直柱图
  useEffect(() => {
    if (refBarCharts && barData.length > 0) {
      const myChart = echarts.init(refBarCharts.current as HTMLDivElement);
      const option = {
        grid: {
          top: 28,
          right: 50,
          left: 20,
          bottom: 20,
          containLabel: true,
        },
        color: ['#49B5FF'],
        tooltip: {
          show: true,
          trigger: 'axis',
          backgroundColor: '#fff',
          textStyle: {
            color: '#666',
          },
          position(pos: number[], params:{}, dom: any, rect: {}, size: { contentSize: number[]; viewSize: number[]}) { // eslint-disable-line
            return tooltipPosition(pos, size);
          },
          formatter(datas: {}) {
            const { data } = datas[0];
            return `订单量占比： <span class="asin-order-bar-tooltip">${data}%</span>`;
          },
          extraCssText: `box-shadow: 0 1px 10px 0 rgba(231, 231, 231, 0.75); 
            padding: 10px 20px;
            border: 1px solid #eee`,
        },
        legend: {
          show: false,
          top: 0,
          left: 0,
        },
        xAxis: {
          type: 'category',
          data: [
            '00:01 - 02:00',
            '02:01 - 04:00',
            '04:01 - 06:00',
            '06:01 - 08:00',
            '08:01 - 10:00',
            '10:01 - 12:00',
            '12:01 - 14:00',
            '14:01 - 16:00',
            '16:01 - 18:00',
            '18:01 - 20:00',
            '20:01 - 22:00',
            '22:01 - 24:00',
          ],
          axisLabel: {
            color: '#888',
            rotate: -35,
            fontSize: 12,
            margin: 12,         
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#C1C1C1', // 线条颜色
            },
          },
        },
        yAxis: {
          type: 'value',
          splitNumber: 10, // 10条分割线
          axisLine: {
            lineStyle: {
              color: '#C1C1C1', // 线条颜色
            },
          },
          axisLabel: {
            color: '#888', // 字体颜色
            formatter: `{value} %`,
          },
          // max: 100, // 最大值
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#E4EBF0',
            },
          },
          axisTick: {
            show: false,
          },
        },
        series: [{
          data: barData,
          type: 'bar',
          width: 20,
          barWidth: '20px',
        }],
      };
      myChart.setOption(option as {}, true);
      window.addEventListener('resize', function () {
        myChart.resize();
      });
    }
  }, [refBarCharts, barData, currency]);


  // 表格数据请求
  const getTableData = useCallback((params = {}) => {
    if (Number(shopId) === -1) {
      return;
    }
    setTableLoading(true);
    // 表格数据
    new Promise((resolve, reject) => {
      let payload = handleReq();
      payload = Object.assign(payload, {
        current: pcurrent,
        size,
      }, params);

      dispatch({
        type: 'asinOrder/getInitData',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      const { data } = datas as AsinOrder.ITableResType;
      setTableLoading(false);
      const {
        page,
        total,
      } = data;
      setDataSource(page.records); // 表格数据
      setAggregate(total); // 表格总结栏
      const totals = page.total;
      setTotal(totals);
    }).catch(err => {
      setTableLoading(false);
      console.error(err);
    });
  }, [dispatch, shopId, dateRangeItem, statistic, currentAsin, chCondition]);  // eslint-disable-line

  // 折线图的数据请求
  const changeLineChart = (params = {}) => {
    let payload = handleReq();
    payload = Object.assign({}, payload, params);
    setLcLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'asinOrder/getLineCartsData',
        payload,
        resolve,
        reject,
      });
    }).then(datas => {
      setLcLoading(false);
      const {
        data,
      } = datas as {
        data: AsinOrder.ILineChartData;
      };
      setLineChartData(data);
      judgeWeekMonth();
    }).catch(err => {
      console.error(err);
      setLcLoading(false);
    });
  };

  useEffect(() => {
    getTableData({
      current: pcurrent,
      size,
    });
  }, [shopId, getTableData, pcurrent, size]);

  // 初始化请求
  useEffect(() => {
    if (Number(shopId) === -1) {
      return;
    }
    
    setLcLoading(true);
    // 初始化豆腐块、折线图、 分页数据
    new Promise((resolve, reject) => {
      if (Number(StoreId) <= -1) {
        return;
      }
      const payload = handleReq();
      dispatch({
        type: 'asinOrder/getAsinOrderInit',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      setLcLoading(false);
      setLcLoading(false);
      const { data } = datas as {
        data: {
          updateTime: string;
          tofuBlocData: {};
          skus: string[];
          lineChart: {};
        };
      };

      judgeWeekMonth();
      setSelectList([...handleDouFu(selectList, data.tofuBlocData)]); // 豆腐块数据
      setLineSkus([...data.skus]);
      setUpdate(data.updateTime);
      setLineChartData(data.lineChart as AsinOrder.ILineChartData);
    }).catch( err => {
      console.error(err);
    });

    new Promise((resolve, reject) => {
      dispatch({
        type: 'asinOrder/getBarData',
        payload: handleReq(),
        resolve,
        reject,
      });
    }).then(datas => {
      const { data } = datas as {
        data: {orderQuantityPercentage: number}[];
      };
      const newArray: number[] = [];
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          newArray.push(item.orderQuantityPercentage);
        });
        setBarData([...newArray]);
      } else {
        console.error(data);
      }
    });

  }, [// eslint-disable-line
    dispatch,
    shopId,
    dateRangeItem,
    chCondition, 
    currentAsin, 
    StoreId,
  ]); 
  //, currentAsin, dateRangeItem, chCondition  

  // 更新豆腐块显隐
  const customColData = (data: AsinOrder.IDouFuListTyep[]) => {
    setSelectList([...data]);
  };
  
  // 改变折线图（点击豆腐块）
  const handleDouFuCb = (attributes: string[]) => {
    changeLineChart({ attributes });
  };

  const columns = [
    {
      title: '统计时间',
      dataIndex: 'historyTime',
      align: 'center',
      render(value: string) {
        if (value === null) {
          return <span style={{
            color: '#888',
          }}>—</span>;
        }
        return <span style={{
          whiteSpace: 'nowrap',
        }}>{value}</span>;
      },
    },
    {
      title: '销售额',
      dataIndex: 'sales',
      align: 'right',
      render(value: number) {
        return <ShowData value={value} isCurrency/>;
      },
    },
    {
      title: '订单量',
      dataIndex: 'orderQuantity',
      align: 'center',
      render(value: string) {
        if (value === null) {
          return <span style={{
            color: '#888',
          }}>—</span>;
        }
        return value;
      },
    },
    {
      title: '销量',
      dataIndex: 'salesQuantity',
      align: 'center',
      render(value: string) {
        if (value === null) {
          return <span style={{
            color: '#888',
          }}>—</span>;
        }
        return value;
      },
    },
    {
      title: '优惠订单',
      dataIndex: 'couponOrderQuantity',
      align: 'center',
      render(value: string) {
        if (value === null) {
          return <span style={{
            color: '#888',
          }}>—</span>;
        }
        return value;
      },
    },
    {
      title: '平均售价',
      dataIndex: 'avgPrice',
      align: 'right',
      render(value: number) {
        return <ShowData value={value} isCurrency />;
      },
    },
    {
      title: '平均客单价',
      dataIndex: 'pct',
      align: 'right',
      render(value: number) {
        return <ShowData value={value} isCurrency />;
      },
    },
    {
      title: '销量/订单量',
      dataIndex: 'salesQuantityDivOrderQuantity',
      align: 'center',
      render(value: string) {
        return <ShowData value={value}/>;
      },
    },
    {
      title: 'Session',
      dataIndex: 'sessions',
      align: 'center',
      render(value: string) {
        return <ShowData value={value} fillNumber={0}/>;
      },
    },
    {
      title: '转化率',
      dataIndex: 'takeRates',
      align: 'center',
      render(value: number) {
        if (value === null) {
          return <span style={{
            color: '#888',
          }}>—</span>;
        }
        return `${toIndexFixed(value)}%`;
      },
    },
    {
      title: 'PageView',
      dataIndex: 'pageView',
      align: 'center',
      render(value: string) {
        return <ShowData value={value} fillNumber={0}/>;
      },
    },
    {
      title: 'PageView/Session',
      dataIndex: 'pageViewsDivSessions',
      align: 'center',
      width: 140,
      render(value: string) {
        return <ShowData value={value}/>;
      },
    },
    {
      title: <PageViewSession />,
      dataIndex: 'relatedSalesFrequency',
      align: 'center',
      width: 130,
      className: styles.pw,
      render(value: number, row: {historyTime: string}) {
        const req = {
          asin: currentAsin,
          method: statistic,
          historyTime: row.historyTime,
          StoreId,
        };
        
        return <div className={styles.pageView_session}>
          {value}
          <br />
          { Number(value) !== 0 ? <PageView num={value} req={req} symbol={current.currency} ></PageView> : ''}
        </div>;
      },
    },
  ];

  const pageConfig = {
    pageSizeOptions: ['20', '50', '100'],
    total,
    pageSize: size,
    current: pcurrent,
    showQuickJumper: true, // 快速跳转到某一页
    showTotal: (total: number) => `共 ${total} 个`,
    onChange(current: number, size: number | undefined){
      setPcurrent(current);
      setSize(size as number);
    },
    onShowSizeChange(current: number, size: number | undefined){
      console.log(current, size,);
    },
    className: 'h-page-small',
  };
  
  let keyCount = 0;
  const tableConfig = {
    dataSource: dataSource as [],
    columns: columns as [],
    rowKey() {
      return keyCount++;
    },
    locale: {
      emptyText: <TableNotData hint="周期内没有数据，请重新筛选条件"/>,
    },
    loading: tableLoading,
    summary: () => {
      if (dataSource.length === 0) {
        return;
      }

      return <Total 
        obj={ aggregate as AsinOrder.ITotalType} 
        symbol={currency}
        req={handleReq()}
      />;
    },
    scroll: {
      y: 618,
    },
    pagination: pageConfig,
  };

  // 统计周期回调
  const statisticCallback = (value: string) => {
    setStatistic(value);
    const params = {
      method: value,
      skus: checkedSkus,
    };
    changeLineChart(params);
  };
  
  // 折线图的SKU选中与取消
  const handleCheckedSku = (list: CheckboxValueType[]) => {
    setCheckedSkus([...list] as string[]);
    changeLineChart({
      skus: list,
    });
  };

  // 改变上年同期筛选框的回调
  const handleHc = () => {
    setIshc(!ishc);
  };

  // 周期的更改
  const handleRangeChange = (dates: DefinedCalendar.IChangeParams) => {
    setDateRangeItem(dates.selectItemKey);
    setChCondition(!chCondition); // why? 更改不同月份时，不会重新渲染dateRangeItem
  };

  // 导出数据导出
  const exportTable = () => {
    new Promise((resolve, reject) => {
      const payload = handleReq();
      
      dispatch({
        type: 'asinOrder/tableDownload',
        reject,
        resolve,
        payload,
      });
    }).then(res => { 
      const content = res as BlobPart;
      const blob = new Blob([content], {
        type: 'application/octet-stream;charset=utf-8',
      });
      // 导出：导出当前日期范围内的订单统计数据，Excel表格，
      // 文档名称：店铺_SKU/ASIN_起始日期_截止日期_每日/每周/每月订单解读，
      // 例如：DROK_SKU123_20170201-20180201每月订单解读；
      // 拼接导出名
      let type = '';

      switch (statistic) {
      case 'DAY':
        type = '每日';
        break;
      case 'WEEK':
        type = '每周';
        break;
      case 'MONTH':
        type = '每月';
        break;
      default: 
        //
      }
      const { startDate, endDate } = storage.get(`${asinOrderDateRange}_date`);
      const fileName = 
        `${current.storeName}_${currentAsin}_${startDate}_${endDate}${type}订单解读.xlsx`;
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    }).catch(err => {
      message.error(err.toString() || '导出错误！');
    });

  };

  return (
    <div className={styles.order}>
      <header className={styles.head}>
        <UpdateComponent update={update} />
        <div className={styles.head_right}>
          <CheckboxDownList 
            selectList={selectList}
            cb={customColData}
            btnStyle={{
              width: 116,
              marginRight: 15,
            }}
            listStyle={{
              width: 168,
              transform: 'translateX(-26px)',
            }}
            storageKey={asinOrderCheckbox}
            showName="自定义数据"
          />
         
          <DefinedCalendar 
            storageKey={asinOrderDateRange}
            className={styles.define}
            change={handleRangeChange}
          />
        </div>
      </header>
      <div className={styles.doufu}>
        <DouFu list={selectList} cb={handleDouFuCb} ></DouFu>
      </div>

      <main className={styles.echarts}>
        <div className={styles.lineCharts_box}>
          <Spin spinning={lcLoading}>
            <header>
              {
                // 应产品要求，只有勾选了销量额、销量、订单量的折线图时，才显示sku复选框
                attributes.indexOf('sales') > -1 || attributes.indexOf('orderQuantity') > -1 || attributes.indexOf('salesQuantity') > -1 ? <Checkbox.Group 
                  options={lineSkus}
                  value={checkedSkus}
                  onChange={handleCheckedSku}
                  style={{
                    margin: '5px 10px 0 0',
                  }}></Checkbox.Group> : ''
              }
              {
                homochronousvisible ? 
                  <Checkbox checked={showWeekMonth} 
                    onChange={() => setShowWeekMonth(!showWeekMonth)}
                  >
                    上{homochronous === 'week' ? '周' : '月'}
                    同期
                  </Checkbox> : ''
              }
              <Checkbox checked={ishc} onChange={handleHc}>上年同期</Checkbox>
              <Statistic value={statistic} style={{
                marginLeft: 30,
              }} cb={statisticCallback}/>
            </header>
            <LineChartsComponent
              datas={lineChartData as AsinOrder.ILineChartData}
              ishc={ishc} 
              isweekMonth={showWeekMonth}
              weekOrMonth={dateRangeItem}
              skus={checkedSkus}
            />
          </Spin>
        </div>
        <div className={styles.barCharts_box}>
          <header>
            <h2>分时统计</h2>
          </header>
          <div ref={refBarCharts} className={styles.barCharts}></div>
        </div>
      </main>
      <main className={styles.table}>
        <header className={styles.head}>
          <h2>列表</h2>
          <Button onClick={exportTable}>导出</Button>
        </header>
        <Table {...tableConfig}/>
      </main>
    </div>
  );
};


export default Order;
