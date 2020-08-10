import React, { useEffect, useRef } from 'react';
import {
  useSelector,
  useDispatch,
} from 'umi';
import echarts from 'echarts';
import moment from 'moment';

import { isEmptyObj } from '@/utils/huang';
import {
  handleChiese,
  lineChartSymbol,
  lineChartConfig,
  handleLineCahrtTooltip,
} from '../../function';
import './global.less';

const LineChart: React.FC<AsinB2B.ILineChartProps> = (props) => {
  const {
    datas,
    ishc, // 是否显示上年同期数据
    isweekMonth = true, // 是否显示上月(周)同期数据
    weekOrMonth = '', // 周或者月
  } = props;

  const dispatch = useDispatch();
  const refLineCharts = useRef<HTMLDivElement >(null);
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  // 已选中的豆腐块
  const selectDouFu = useSelector((state: AsinB2B.IDFChecke) => state.asinB2B.dfCheckedTypes);
  const colors = useSelector((state: AsinB2B.IDFChecke) => state.asinB2B.doufuSelectColor);
  const { currency } = currentShop;
  const maxLength = 2;
  // const [yLeftName, setYleftName] = useState<string>('');
  // const [yRightName, setYrightName] = useState<string>('');
  
  useEffect(() => {
    if (refLineCharts && !isEmptyObj(datas) ) {
      const myChart = echarts.init(refLineCharts.current as HTMLDivElement);
      let weekMonthXData: string[] = [];
      let yLeftName = ''; // Y轴左边的名字
      let yRightName = ''; // Y轴左边的名字

      const {
        polylineX, // 本期的X轴数据
      } = datas.thisPeriod; // 本期数据

      if (datas.firstWeekOrMonthHalf) {
        weekMonthXData = datas.firstWeekOrMonthHalf.polylineX;
      }
      
      yLeftName = handleChiese(selectDouFu[0]);
      yRightName = handleChiese(selectDouFu[1]);

      // eslint-disable-next-line
      let option: any = {
        backgroundColor: '#fff',
        color: [
          colors[0],
          colors[1],
          '#6FE09C',
          '#FE8484',
          '#1C00F0',
          '#0ABCCB',
          '#B79B03',
          '#FF0505',
          '#9305E3',
          '#08EDBC',
          '#F55D03',
          '#52E3E8',
          '#276F08',
          '#D8F06C',
          '#E85D7C',
          '#D146F2',
        ],
        tooltip: {
          trigger: 'axis',
          padding: 0,
          backgroundColor: 'transparent',
          formatter(params: AsinB2B.ILineChartsTooltip[]) {
            return handleLineCahrtTooltip({
              param: params,
              lastYearXData: datas.firstHalf.polylineX,
              weekMonthXData,
              symbol: currency,
            });
          },
        },
        legend: {
          data: [yLeftName, yRightName],
          left: 15,
          top: 5,
        },
        grid: {
          left: 25,
          top: 60,
          right: 50,
          bottom: 20,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#ccc',
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#333',
            },
            formatter(val: string) {
              return moment(Number(val)).format('MM-DD');
            },
          },
          data: polylineX,
        },
        yAxis: [
          {
            type: 'value',
            position: 'left',
            splitNumber: 8,
            nameGap: 9999,
            boundaryGap: false,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#ccc', // 字体颜色
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#999',
              interval: true,
              formatter(val: string) {
                return lineChartSymbol(selectDouFu[0], val, currency);
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E4EBF0',
                type: 'dashed',
              },
            },
          }, 
          {
            type: 'value',
            position: 'right',
            splitNumber: 8,
            nameGap: 9999,
            boundaryGap: false,
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#999',
              interval: true,
              formatter(val: string) {
                return lineChartSymbol(selectDouFu[1], val, currency);
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#ccc', // 字体颜色
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E4EBF0',
                type: 'dashed',
              },
            },
          }],
        series: [],
      };

      const benqi = {};
      benqi[selectDouFu[0]] = option.series.length;
      option.series.push(lineChartConfig(yLeftName, datas.thisPeriod[selectDouFu[0]]));
      benqi[selectDouFu[1]] = option.series.length;
      option.series.push(lineChartConfig(yRightName, datas.thisPeriod[selectDouFu[1]], 1));


      // 是否显示上年同期数据
      const lastYearObj = {};
      if (ishc) {
        lastYearObj[selectDouFu[0]] = option.series.length;
        option.series.push(lineChartConfig(`上年同期${yLeftName}`, datas.firstHalf[selectDouFu[0]]));
        lastYearObj[selectDouFu[1]] = option.series.length;
        option.series.push(lineChartConfig(`上年同期${yRightName}`, datas.firstHalf[selectDouFu[1]]));
      } else {
        for (const key in lastYearObj) {
          option.series[lastYearObj[key]].data = [];
        }
      }

      // 是否显示上月(周)同期数据
      const weekMonthIndexs = {};
      if (isweekMonth) {
        let text = '';
        if (weekOrMonth === 'week') {
          text = '周';
        } else if (weekOrMonth === 'month') {
          text = '月';
        }
        
        weekMonthIndexs[selectDouFu[0]] = option.series.length;
        option.series.push(
          lineChartConfig(`上${text}同期${yLeftName}`,
            datas.firstWeekOrMonthHalf[selectDouFu[0]]
          )
        );
        weekMonthIndexs[selectDouFu[1]] = option.series.length;
        option.series.push(
          lineChartConfig(`上${text}同期${yRightName}`,
            datas.firstWeekOrMonthHalf[selectDouFu[1]]
          )
        );
      } else {
        for (const key in weekMonthIndexs) {
          option.series[weekMonthIndexs[key]].data = [];
        }
      }

      myChart.on('legendselectchanged', (params: {name: string; selected: {}} ) => {
        const label = handleChiese(params.name, true);
        const flag = params.selected[params.name];

        if (label === '') {
          return;
        }

        if (selectDouFu.length >= maxLength) {
          if (selectDouFu.indexOf(label) > -1) {
            const index = selectDouFu.indexOf(label);
            const newColor = colors.splice(index, 1)[0];
            colors.push(newColor);
          } else {
            const newColor = colors.shift();
            colors.push(newColor as string);
          }

          dispatch({
            type: 'AsinB2B/changeColor',
            payload: {
              colors,
            },
          });
        }

        for (const key in lastYearObj) {
          if (label === key) {
            const value = lastYearObj[key];
            if (flag) {
              let index = 0;
              for (const i in lastYearObj) {
                if (value > lastYearObj[i]) {
                  index = 0;
                } else {
                  index = 1;
                }
              }
              option.series[value].data = datas.firstHalf[selectDouFu[index]];
            } else {
              option.series[value].data = [];
            }
          }
        }

        for (const key in weekMonthIndexs) {
          if (label === key) {
            const value = weekMonthIndexs[key];
            if (flag) {
              let index = 0;
              for (const i in weekMonthIndexs) {
                if (value > weekMonthIndexs[i]) {
                  index = 0;
                } else {
                  index = 1;
                }
              }
              option.series[value].data = datas.firstWeekOrMonthHalf[selectDouFu[index]];
            } else {
              option.series[value].data = [];
            }
          }
        }

        myChart.setOption(option as {});
      });
      myChart.setOption(option as {}, true);

      window.addEventListener('resize', function () {
        myChart.resize();
      });
    }
  }, [
    refLineCharts,
    datas,
    currency,
    selectDouFu,
    ishc,
    isweekMonth,
    weekOrMonth,
    colors,
    dispatch,
  ]);

  return (
    <div ref={refLineCharts} style={{
      height: 500,
    }}></div>
  );
};

export default LineChart;
