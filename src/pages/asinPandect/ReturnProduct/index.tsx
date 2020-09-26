/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-07-30 09:47:27
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinPandect\ReturnProduct\index.tsx
 */ 

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './index.less';
import './global.less';
import UpdateComponents from './components/UpdateComponent';
import ReturnRatioComponent from './components/ReturnRatio';
import StatisticComponent from './components/Statistic';
import DefinedCalendar from '@/components/DefinedCalendar';
import Rate from '@/components/Rate';
import { storageKeys, isEmptyObj, getRangeDate } from '@/utils/huang';
import { storage } from '@/utils/utils';
import { handleTooltip } from './function';
import moment from 'moment';
import TableNotData from '@/components/TableNotData';
import {
  useSelector,
  useDispatch,
} from 'umi';
import {
  Table,
  Spin,
  message,
} from 'antd';
import echarts from 'echarts';


const { asinBrDateRange } = storageKeys;
let req = {}; // 请求参数
const ReturnProduct: React.FC = () => {
  const dispatch = useDispatch();
  // 折线图容器
  const chartLineRef = useRef('') as any; // eslint-disable-line
  // 饼图容器
  const charPietRef = useRef('') as React.MutableRefObject<any>; // eslint-disable-line
  // 选中店铺
  const current = useSelector((state: Global.IGlobalShopType) => state.global.shop.current); 
  const { currency } = current;
  const [returns, setReturns] = useState<boolean>(true); // 豆腐块退货量
  const [returnRate, setReturnRate] = useState<boolean>(true); // 豆腐块退货率
  const [statisCurrent, setStatisCurrent] = useState<string>('day'); // 统计周期
  const [res, setRes] = useState({} as ReturnProduct.IResponseType); // 初始化参数
  const [updateTime, setUpdateTime] = useState<string>(''); // 更新时间
  const [returnInfo, setReturnInfo] = useState({} as ReturnProduct.IReturnInfo); // 退货详情
  const [lineChartData, setLineChartData] = useState<ReturnProduct.ILineChartData[]>([]); // 折线图相关
  const [dataSource, setDataSource] = useState<ReturnProduct.IReturnReason[]>([]); // 退货详情
  const [loading, setLoading] = useState<boolean>(true); // loading
  const asin = useSelector((state: ReturnProduct.IAsinGlobal) => state.asinGlobal.asin );
  const { startDate, endDate } = storage.get(`asinBrDateRange_date`);
  const { start, end } = getRangeDate(7);


  // 初始化请求数据
  req = {
    headersParams: {
      StoreId: current.id,
    },
    dateStart: startDate || start,
    dateEnd: endDate || end,
    cycle: 1,
    statisticalMethods: statisCurrent,
    asin,
  };

  const requestBody = useCallback((params = {}) => {
    let payload = {};
    if (params) {
      payload = Object.assign({}, req, params);
    } else {
      payload = req;
    }
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'returnProduct/getReturnProductInitData',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      const { data } = datas as ReturnProduct.IResponseType;
      setRes(data as ReturnProduct.IResponseType);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      message.error(err);
      setLoading(false);
    });
  }, [dispatch]);

  // 请求数据
  useEffect(() => {
    if (Number(current.id) === -1) {
      return;
    }
    setLoading(true);
    requestBody();
  }, [requestBody, asin, current]);
  
  // 接收参数
  useEffect(() => {
    if (!isEmptyObj(res)) {
      setUpdateTime(res.updateTime);
      setReturnInfo(res.returnInfos);
      setLineChartData(res.lineChartDatas);
      setDataSource(res.returnReasons || []);
    }
  }, [res]);

  // 折线图渲染
  useEffect(() => {
    if (chartLineRef) {
      const xDate: string[] = []; // 日期
      let returnNums: number[] = []; // 退货量
      let returnRates: number[] = []; // 退货率
      let returnNumX = false; // 退货量X轴是否显示
      let returnReteX = false; //  退货率X车是否显示
      const selected = { '退货量': true, '退货率': true }; // 默认选中的图例
      lineChartData.forEach((item) => {
        xDate.push(item.dateTime);
        returnNums.push(item.returnQuantity);
        returnRates.push(parseFloat(String(item.returnRate)));
      });

      if (!returns) {
        returnNums = [];
        selected['退货量'] = false;
      } else {
        if (returnReteX === false) {
          returnNumX = true;
        }
      }
      if (!returnRate) {
        returnRates = [];
        selected['退货率'] = false;
      } else {
        if (returnNumX === false) {
          returnReteX = true;
        }
      }

      const option = {
        padding: 0,
        margin: 0,
        offset: {},
        legend: {
          data: ['退货量', '退货率'],
          left: 20,
          itemGap: 16,
          selected,
        },
        grid: {
          left: '70px',
          right: '70px',
        },
        tooltip: {
          trigger: 'axis',
          padding: 0,
          backgroundColor: 'transparent',
          formatter(params: ReturnProduct.ITooltip[]) {
            return handleTooltip(params);
          },
        },
        xAxis: [{
          type: 'category',
          data: xDate,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#ccc', // X轴颜色
            },
          },
          axisLabel: {
            color: '#999', // 字体颜色
            formatter(value: string) {
              return moment(value).format('MM-DD');
            },
          },
          axisTick: {
            inside: true,
            length: 10, // 线高度
          },
        }],
        yAxis: [{
          type: 'value',
          offset: 10,
          splitNumber: 6,
          axisLine: {
            show: false,
            lineStyle: {
              color: '#ccc', // 字体颜色
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: returnNumX,
            lineStyle: {
              color: '#c1c1c1',
              type: 'dashed',
            },
          },
          axisLabel: {
            color: '#999',
            showMinLabel: true, // 是否显示最小值 0
          },
        }, {
          type: 'value',
          position: 'right',
          offset: 10,
          splitNumber: 6,
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
            showMinLabel: true, // 是否显示最小值 0
            formatter(value: string) {
              return `${value}%`;
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#ccc', // 字体颜色
            },
          },
          splitLine: {
            show: returnReteX,
            lineStyle: {
              color: '#c1c1c1',
              type: 'dashed',
            },
          },
        }],
        series: [{
          name: '退货量',
          type: 'line',
          data: returnNums,
          smooth: false,
          color: '#49b5ff',
          symbol: 'none',
        }, 
        {
          name: '退货率',
          type: 'line',
          data: returnRates,
          symbolSize: 1,
          yAxisIndex: 1,
          symbol: 'none',
          color: '#ffc175',
          smooth: false,
          showSymbol: false,
        }],
      };

      const myChart = echarts.init(chartLineRef.current);
      myChart.hideLoading();
      myChart.setOption(option as {});

      // 折线图事件
      myChart.on('legendselectchanged', (params: ReturnProduct.IEchartsParams) => {
        if (params.name === '退货量') {
          setReturns(params.selected['退货量']);
        }
        if (params.name === '退货率') {
          setReturnRate(params.selected['退货率']);
        }
      });
      window.onresize = function(){
        myChart.resize();
      };
    }
  }, [chartLineRef, lineChartData, currency, returns, returnRate]);

  // 饼图渲染
  useEffect(() => {
    if (charPietRef) {
      const myChart = echarts.init(charPietRef.current);
      const data: {}[] = [];
      myChart.hideLoading();
      const length = dataSource.length;
      let pieValue = 0; // 饼图的占比

      if (length <= 3) {
        pieValue = 0.02;
      } else if (length <= 5) {
        pieValue = 0.1;
      } else if (length <= 7) {
        pieValue = 0.2;
      } else if (length <= 10) {
        pieValue = 0.2;
      } else {
        pieValue = 0.3;
      }

      dataSource.forEach(item => {
        data.push({
          value: item.returnQuantity,
          name: item.reason,
        }, {
          value: pieValue,
          name: '',
          itemStyle: {
            normal: {
              color: 'rgba(0, 0, 0, 0)',
              borderColor: 'rgba(0, 0, 0, 0)',
            },
          },
        });
      });

      const option = {
        color: [
          '#6eb9ff', 
          '#86e2e8',
          '#8aeba6',
          '#c5eb8a',
          '#f8e285',
          '#f68c9e',
          '#bd98f2',
        ],
        series: [
          {
            name: '',
            type: 'pie',
            height: 260,
            top: 30,
            radius: ['50%', '70%'],
            hoverAnimation: false,
            data,
            avoidLabelOverlap: false,
            labelLine: {
              normal: {
                length: 25,
                length2: 8,
                lineStyle: {
                  type: 'solid',
                  // color: '#d9d9d9',
                },
              },
            },
            z: 9999,
            label: {
              normal: {
                formatter: (params: ReturnProduct.IPieTextType) => {
                  let num = '';
                  if (params.name === ''){
                    return '';
                  }
                  
                  for (let i = 0; i < dataSource.length; i++) {
                    const item = dataSource[i];
                    if (params.name === item.reason) {
                      num = item.proportion;
                    }
                  }

                  return `{name|${params.name}：}{c|${ num }}`;
                },
                borderWidth: 0,
                borderRadius: 4,
                align: 'center',
                color: '#3494BD',
                rich: {
                  name: {
                    color: '#666',
                    fontSize: 12,
                    // width: 60,
                  },
                  c: {
                    fontWeight: 550,
                    color: '#333',
                    fontSize: 12,
                  },
                },
              },
            },
          },
        ],
      };
      myChart.setOption(option as {});
    }
  }, [charPietRef, dataSource]);

  const columns = [
    {
      title: '排名',
      dataIndex: 'number',
      align: 'center',
      width: '15%',
    },
    {
      title: '退款原因',
      dataIndex: 'reason',
      align: 'center',
      width: '35%',
    },
    {
      title: <ReturnRatioComponent />,
      dataIndex: 'returnQuantity',
      align: 'center',
      width: '25%',
      render(value: number, { proportion }: { proportion: string }) {
        return (
          <>
            {value}
            <span style={
              {
                color: '#999',
              }
            }>（{proportion}）</span>
          </>
        );
      },
    },
    {
      title: '退款金额',
      dataIndex: 'refundAmount',
      align: 'right',
      className: styles.monry,
      render(value: string) {
        if (value === '——') {
          return <span style={{
            color: '#ccc',
          }}>{value}</span>;
        }
        return value;
      },
    },
  ];

  let countKey = 0;
  const tableConfig = {
    dataSource: dataSource as [],
    columns: columns as [],
    scroll: {
      y: 250,
    },
    rowKey() {
      return countKey++;
    },
    locale: {
      emptyText: <TableNotData className={styles.notData} hint="周期内没有退货原因 ，请重新选择查询条件"/>,
    },

  };

  // 日历的回调
  const calendarCb = (dates: {}) => {
    requestBody(dates);
  };

  // 统计周期
  const statisticCb = (value: string) => {
    setStatisCurrent(value);
    requestBody({ statisticalMethods: value });
  };

  // 点击豆腐块退货量
  const handleReturns = () => {
    setReturns(!returns);
  };

  // 点击豆腐块退货率
  const handleReturnRate = () => {
    setReturnRate(!returnRate);
  };
  
  return (
    <div className={styles.ra_box}>
      <Spin spinning={loading}>
        <header className={`toolbar ${styles.head}`}>
          <UpdateComponents style={
            {
              padding: 20,
            }
          } update={updateTime}/>
          <DefinedCalendar 
            change={calendarCb} 
            storageKey={asinBrDateRange} 
            style={
              {
                width: 280,
                margin: 20,
              }
            }
          />
        </header>
        <div className={styles.chartLine}>
          <div className={styles.layout_left}>
            <div className={`
              ${styles.common} 
              ${styles.one} 
              ${returns ? styles.selected : ''} `}
            onClick={handleReturns}
            >
              <div className="">
                <p className={styles.bold}>{returnInfo.returnQuantity || 0}</p>
                <p className={styles.text}>退货量</p>
              </div>
              <div className={styles.up}>
                <p className="num">
                  <span className={styles.text}>上期：</span>
                  <span className={styles.num}>{returnInfo.lastReturnQuantity || 0}</span>
                </p>
                <p className={styles.ratio}>
                  <span className={styles.text}>环比：</span>
                  <Rate value={ parseFloat(returnInfo.returnQuantityRatio) } decimals={2}/>
                </p>
              </div>
            </div>
            <div 
              className={`${styles.common} 
              ${returnRate ? styles.rate : ''}`}
              onClick={handleReturnRate}
            >
              <div className="">
                <p className={styles.bold}>{returnInfo.returnRate}</p>
                <p className={styles.text}>退货率</p>
              </div>
              <div className={styles.up}>
                <p className="num">
                  <span className={styles.text}>上期：</span>
                  <span className={styles.num}>{returnInfo.lastReturnRate}</span>
                </p>
                <p className={styles.ratio}>
                  <span className={styles.text}>环比：</span>
                  <Rate value={ parseFloat(returnInfo.returnRateRatio) } decimals={2} />
                </p>
              </div>
            </div>
          </div>
          <div className={styles.right_chart}>
            <StatisticComponent cb={statisticCb} 
              value={statisCurrent}
              style={
                {
                  position: 'absolute',
                  right: 20,
                  zIndex: 5,
                }
              }/>
            <div ref={chartLineRef} className={styles.chartLineBox}></div>
          </div>
        </div>
        <div className={`${styles.reason} clearfix`}>
          <header>退货原因</header>
          <main>
            <div className={styles.charts} ref={charPietRef}>
            </div>
            <div className={styles.table}>
              <Table pagination={false} bordered {...tableConfig} size="middle" />
            </div>
          </main>
        </div>
      </Spin>
    </div>
  );
};

export default ReturnProduct;
