import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import './global.less';
import echarts from 'echarts';
import { isEmptyObj } from '@/utils/huang';
import moment from 'moment';
import {
  useSelector,
  useDispatch,
} from 'umi';
import {
  handleChiese,
  handleLineCahrtTooltip,
  lineChartConfig,
  lineChartSymbol,
  tooltipPosition,
} from '../../function';

/**
 * option.series[0] 同期数据1
 * option.series[1] 同期数据2
 * 
 * option.series[2] 上年同期的日期数据X轴数据
 * option.series[3] 上年同期的数据1
 * option.series[4] 上年同期的数据2
 * 
 * option.series[5] 上月(周)的X轴数据
 * option.series[6] 上月(周)是期数据1
 * option.series[7] 上月(周)是期数据2
 * 
 * sku
 * option.series[8] SKU1 X轴数据
 * option.series[9] SKU1 X轴数据的数据1
 * option.series[10] SKU1 X轴数据的数据2
 */
const LineChart: React.FC<AsinOrder.ILineChartProps> = (props) => {
  const {
    datas,
    ishc, // 是否显示上年同期数据
    isweekMonth = true, // 是否显示上月(周)同期数据
    weekOrMonth = '', // 周或者月
    skus, // 所有选中的SKU
  } = props;

  const dispatch = useDispatch();
  const refLineCharts = useRef<HTMLDivElement >(null);
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  // 已选中的豆腐块
  const selectDouFu = useSelector((state: AsinOrder.IDFChecke) => state.asinOrder.dfCheckedTypes);
  const colors = useSelector((state: AsinOrder.IDFChecke) => state.asinOrder.doufuSelectColor);
  const { currency } = currentShop;

  useEffect(() => {
    if (refLineCharts && !isEmptyObj(datas) ) {
      const myChart = echarts.init(refLineCharts.current as HTMLDivElement);
      let weekMonthXData: string[] = [];
      let yLeftName = ''; // Y轴左边的名字
      let yRightName = ''; // Y轴左边的名字

      const {
        polylineX, // 本期的X轴数据
      } = datas.thisPeriod; // 本期数据
      
      myChart.off('legendselectchanged'); // 防止重复绑定事件

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
          '#759FFF',
          '#FF6F00',
          '#0CE0DE',
          '#F784FE',
          '#0CB4E0',
          '#9E84FE',
          '#059B43',
          '#F28108',
          '#CB43E5',
          '#6CDEC6',
          '#ADCE4B',
          '#DEAF52',
        ],
        tooltip: {
          trigger: 'axis',
          padding: 0,
          position(pos: number[], params:{}, dom: any, rect: {}, size: { contentSize: number[]; viewSize: number[]}) { // eslint-disable-line
            return tooltipPosition(pos, size, { minY: 80 });
          },
          backgroundColor: 'transparent',
          formatter(params: AsinOrder.ILineChartsTooltip[]) {
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
          top: 24,
          itemGap: 16,
        },
        grid: {
          left: 25,
          top: 80,
          right: 25,
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
              color: '#888',
            },
            fontSize: 12,
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
              color: '#888',
              interval: true,
              formatter(val: string) {
                return lineChartSymbol(selectDouFu[0], val, currency, 0);
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
              color: '#888',
              interval: true,
              formatter(val: string) {
                return lineChartSymbol(selectDouFu[1], val, currency, 0);
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

      // SKU数据
      const skuIndexs: {
        index: number;
        sku: string;
        key: string;
      }[] = [];
      if (skus.length > 0) {
        const { skuThisPeriods } = datas;
        if (Array.isArray(skuThisPeriods) && skuThisPeriods.length > 0) {
          skuThisPeriods.forEach(item => {
            skuIndexs.push({
              sku: item.sku,
              index: option.series.length,
              key: selectDouFu[0],
            });
            option.series.push(
              lineChartConfig(
                `${yLeftName}-SKU-${item.sku}`, 
                item.thisPeriod[selectDouFu[0]]
              )
            );
            skuIndexs.push({
              sku: item.sku,
              index: option.series.length,
              key: selectDouFu[1],
            });
            option.series.push(
              lineChartConfig(
                `${yRightName}-SKU-${item.sku}`, 
                item.thisPeriod[selectDouFu[1]]
              )
            );
          });
        }
      } else {
        skuIndexs.forEach( item => {
          option.series[item.index].data = [];
        });
      }

      myChart.on('legendselectchanged', (params: {name: string; selected: {}} ) => {
        const label = handleChiese(params.name, true);
        const flag = params.selected[params.name];

        if (label === '') {
          return;
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

        skuIndexs.forEach(item => {
          if (item.key === label) {
            const { skuThisPeriods } = datas;
            if (flag && Array.isArray(skuThisPeriods) && skuThisPeriods.length > 0) {
              skuThisPeriods.forEach(i => {
                if (i.sku === item.sku) {
                  option.series[item.index].data = i.thisPeriod[label] as [];
                }
              });
            } else {
              option.series[item.index].data = [];
            }
          }
        });


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
    skus,
    colors,
    dispatch,
  ]);

  return (
    <div className={`${styles.lineCharts}`} ref={refLineCharts}>
    </div>);
};

export default LineChart;
