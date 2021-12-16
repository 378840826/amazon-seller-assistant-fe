/**
 * 折线图
 *  销售额用柱状图，但数据量太多时，也用折线图
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import ReactDOMServer from 'react-dom/server';
import { AssignmentKeyName } from '../../utils';
import { moneyFormatNames, percentageFormatNames, showBarNames } from '../../config';

import { day } from '@/utils/utils';
import styles from './index.less';

interface IProps {
  // 折线数据
  dataSource: {
    [key: string]: StoreDetail.IPolylineData;
  };
  // dataTypes = tofuChecked
  dataTypes: string[];
  currency: string;
  loading?: boolean;
  colors: string[];
  style?: React.CSSProperties;
}

// 上年同期的颜色
const firstHalfClolrs = ['#6FE09C', '#FE8484'];
// 上周/月同期的颜色
const firstWeekOrMonthHalfColors = ['#759FFF', '#0CE0DE'];
// 销售额超过此数据量时，不用柱状图改用用折线图
const barMaxLength = 60;

const Charts: React.FC<IProps> = props => {
  const { dataSource, dataTypes, currency, loading, colors, style } = props;
  const { firstHalf, firstWeekOrMonthHalf, thisPeriod } = dataSource;
  const showKeys = Object.keys(thisPeriod).filter(key => key !== 'polylineX' && key);

  // 获取 X 时间轴的配置
  function getXAxisOption() {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: 'category' as any,
      axisLine: {
        lineStyle: { color: '#d9d9d9' },
      },
      axisTick: {
        lineStyle: { color: '#c1c1c1' },
        inside: true,
      },
      axisLabel: { color: '#666' },
      // data: thisPeriod.polylineX,
      data: thisPeriod.polylineX.map(item => {
        return day.getNowFormatTime('MM-DD', new Date(item));
      }),
    };
  }

  // 获取 Y 轴的配置 一个或两个 Y 轴
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
    showKeys.forEach((key, index) => {
      // 格式化 y 轴的数值,货币或百分比
      const name = AssignmentKeyName.getName(key);
      const formatter = (value: number, index: number) => {
        // 每 3 位加逗号
        let formatterResult = value.toLocaleString();
        // 超过 1000 转换为 K
        if (value >= 1000) {
          formatterResult = `${(value / 1000).toLocaleString()}K`;
        }
        if (moneyFormatNames.includes(name)) {
          formatterResult = `${currency}${formatterResult}`;
        } else if (percentageFormatNames.includes(name)) {
          formatterResult = `${formatterResult}%`;
        }
        // 给 Y 轴坐标第一个标签加上对应的颜色
        if (index === 0) {
          // eslint-disable-next-line prefer-template
          return '{' + 'colorStyle' + '|' + formatterResult + '}';
        }
        return formatterResult;
      };
      // 坐标标签的颜色
      const colorIndex = dataTypes.findIndex(n => n === name);
      yAxisList[index] = {
        ...yAxisItem,
        position: index ? 'right' : 'left',
        axisLabel: {
          rich: {
            colorStyle: { color: colors[colorIndex] },
          },
          formatter,
          color: '#666',
        },
      };
    });
    return yAxisList;
  }

  // 获取折线配置
  function getSeriesOption() {
    const getOption = (datas: StoreDetail.IPolylineData, colors: string[]) => {
      const keys = Object.keys(datas).filter(key => key !== 'polylineX' && key);
      const arr: echarts.EChartOption.Series[] = [];
      keys.forEach((key, index) => {
        const name = AssignmentKeyName.getName(key);
        if (!dataTypes.includes(name)) {
          return;
        }
        const colorIndex = dataTypes.findIndex(n => n === name);
        const options = {
          name,
          data: datas[key],
          type: 'line',
          smooth: true,
          yAxisIndex: index,
          color: colors[colorIndex],
        };
        // 以下情况显示柱状图
        const showBar = (showBarNames.includes(name) && thisPeriod.polylineX.length < barMaxLength);
        // || (datas[key] && datas[key].length === 1);
        if (showBar) {
          Object.assign(options, {
            type: 'bar',
            barWidth: '20%',
            barMaxWidth: 20,
          });
        }
        arr.push(options);
      });
      return arr;
    };
    const series: echarts.EChartOption.Series[] = [];
    series.push(...getOption(thisPeriod, colors));
    firstHalf && series.push(...getOption(firstHalf, firstHalfClolrs));
    firstWeekOrMonthHalf && series.push(
      ...getOption(firstWeekOrMonthHalf, firstWeekOrMonthHalfColors)
    );
    return series;
  }

  // 货币或百分比显示。 每 3 位加逗号、金额和百分比保留两位小数
  function getFormatterValue(name: string, value?: unknown, currency?: string) {
    let result;
    const floatLocalValue = Number(value).toLocaleString(
      undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    );
    if (name && moneyFormatNames.includes(name)) {
      result = `${currency}${floatLocalValue}`;
    } else if (name && percentageFormatNames.includes(name)) {
      result = `${floatLocalValue}%`;
    } else {
      result = Number(value).toLocaleString();
    }
    return result;
  }

  const seriesOption = getSeriesOption();

  // 折线图配置
  const reactEchartsConfig = {
    onChartReady: (e: echarts.ECharts) => {
      window.addEventListener('resize', function () {
        e.resize();
      });
    },
    notMerge: true,
    option: {
      grid: {
        top: 30,
        bottom: 30,
        left: 0,
        right: 0,
        containLabel: true,
      },
      // 图例
      legend: {
        left: 'center',
        bottom: 0,
        itemGap: 40,
        textStyle: { color: '#666', fontSize: 14 }, 
      },
      // 提示框
      tooltip: {
        trigger: 'axis',
        textStyle: { lineHeight: 24 },
        // 设置白底和阴影
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0px 3px 13px 0px rgba(231, 231, 231, 0.75);',
        // 自定义格式
        formatter: (params) => {
          let paramsList: echarts.EChartOption.Tooltip.Format[] = [];
          if (params instanceof Array){
            paramsList = [...params];
          } else {
            paramsList = [params];
          }
          /**
           * 因日期的原因无法区分 params 中的数据是属于哪个日期，只能从原始数据中去获取
           *  1.因为用的是同一个 x 轴，为什么没用多个 x 轴来区分，因为多个 x 轴会导致柱状图时图柱重叠
           *  2.因为 x 轴的格式被修改成 MM-DD，已经不再对应原始数据中的日期
           */
          const index = paramsList[0].dataIndex as number;
          const thisPeriodTime = thisPeriod.polylineX[index];
          const firstHalfTime = firstHalf && firstHalf.polylineX[index];
          const firstWeekOrMonthHalfTime = firstWeekOrMonthHalf && 
          firstWeekOrMonthHalf.polylineX[index];
          const allData = {};
          // 本期，需要从源数据中获取，因为无法通过 seriesName 和 axisValue 来确定在 paramsList 中的位置
          allData[thisPeriodTime] = showKeys.map(k => {
            const name = AssignmentKeyName.getName(k);
            const colorIndex = dataTypes.findIndex(n => n === name);
            return {
              seriesName: name,
              value: thisPeriod[k][index],
              color: colors[colorIndex],
            };
          });
          // 上年同期，需要从源数据中获取，因为无法通过 seriesName 和 axisValue 来确定在 paramsList 中的位置
          firstHalfTime && (allData[firstHalfTime] = showKeys.map(k => {
            const name = AssignmentKeyName.getName(k);
            const colorIndex = dataTypes.findIndex(n => n === name);
            return {
              seriesName: name,
              value: firstHalf[k][index],
              color: firstHalfClolrs[colorIndex],
            };
          }));
          // 上周/月同期，需要从源数据中获取，因为无法通过 seriesName 和 axisValue 来确定在 paramsList 中的位置
          firstWeekOrMonthHalfTime && (allData[firstWeekOrMonthHalfTime] = showKeys.map(k => {
            const name = AssignmentKeyName.getName(k);
            const colorIndex = dataTypes.findIndex(n => n === name);
            return {
              seriesName: name,
              value: firstWeekOrMonthHalf[k][index],
              color: firstWeekOrMonthHalfColors[colorIndex],
            };
          }));
          return ReactDOMServer.renderToStaticMarkup(
            <div className={styles.tooltipContainer}>
              {
                // 按日期分组
                Object.keys(allData).map(time => (
                  <div className={styles.tooltipGroup} key={time}>
                    <div className={styles.tooltipTime}>{time}</div>
                    {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      allData[time].map((item: any, i: number) => {
                        return (
                          <div key={i}>
                            <div className={styles.tooltipItem}>
                              <span className={styles.marker} style={{ background: item.color }} />
                              <span className={styles.tooltipTitle}>{item.seriesName}：</span>
                              { getFormatterValue(item.seriesName as string, item.value, currency) }
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                ))
              }
            </div>
          );
        },
      },
      xAxis: getXAxisOption(),
      yAxis: getYAxisOption(),
      series: seriesOption,
      color: colors,
    } as echarts.EChartOption,
    style: { width: '100%', height: '400px', ...style },
    loadingOption: { color: colors[0] },
    showLoading: loading,
  };
  
  return (
    seriesOption.some(item => item.data?.length)
      ? <ReactEcharts {...reactEchartsConfig}/>
      : (
        <div className={styles.notDataContainer} style={{ ...style }}>
          <div>
            {
              showKeys.map(key => (
                <span key={key} className={styles.notDataName}>
                  { AssignmentKeyName.getName(key) }
                </span>)
              )
            }
            周期内无数据
          </div>
        </div>
      )
  );
};

export default Charts;
