/**
 * 折线图
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import ReactDOMServer from 'react-dom/server';
import {
  AssignmentKeyName,
  moneyFormatNames,
  percentageFormatNames,
} from '../utils';
import styles from './index.less';

interface IProps {
  // 折线数据
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource: any;
  // tofuChecked
  dataTypes: string[];
  currency: string;
  loading?: boolean;
  colors: string[];
  style?: React.CSSProperties;
}

const Charts: React.FC<IProps> = props => {
  const { dataSource, dataTypes, currency, loading, colors, style } = props;
  const { 本期, 上年同期, 上月同期, 上周同期 } = dataSource;
  const 上期 = 上月同期 || 上周同期;
  const 上年同期的颜色 = ['#6FE09C', '#FE8484'];
  const 上期的颜色 = ['#759FFF', '#0CE0DE'];

  // 获取 X 时间轴的配置
  function getXAxisOption() {
    const list = 本期[AssignmentKeyName.getkey(dataTypes[0])];
    const data = list?.map((item: API.IAdChartsPolylineCell) => {
      return item.time;
    });
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
      data,
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
    Object.keys(本期).forEach((key, index) => {
      // 格式化 y 轴的数值,货币或百分比
      const name = AssignmentKeyName.getName(key);
      const formatter = (value: number) => {
        let formatterResult = `${value}`;
        if (moneyFormatNames.includes(name)) {
          formatterResult = `${currency}${value}`;
        } else if (percentageFormatNames.includes(name)) {
          formatterResult = `${value}%`;
        }
        return formatterResult;
      };
      yAxisList[index] = {
        ...yAxisItem,
        position: index ? 'right' : 'left',
        axisLabel: {
          formatter,
          color: '#666',
        },
      };
    });
    return yAxisList;
  }

  // 获取折线配置
  function getSeriesOption() {
    const getOption = (data: StoreDetail.IPolylineData, colors?: string[]) => {
      return Object.keys(data).map((key, index) => {
        const itemData = data[key];
        const name = AssignmentKeyName.getName(key);
        const options = {
          name,
          data: itemData.map((item: API.IAdChartsPolylineCell) => item.value),
          type: 'line',
          smooth: true,
          yAxisIndex: index,
          color: colors && colors[index],
        };
        if (['总销售额'].includes(name)) {
          Object.assign(options, {
            type: 'bar',
            barWidth: '20%',
            barMaxWidth: 20,
          });
        }
        return options;
      });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const series: any = [];
    series.push(...getOption(本期));
    上年同期 && series.push(...getOption(上年同期, 上年同期的颜色));
    上期 && series.push(...getOption(上期, 上期的颜色));
    return series;
  }

  // 货币或百分比显示
  function getFormatterValue(name: string, value?: unknown, currency?: string) {
    let result = value;
    if (name && moneyFormatNames.includes(name)) {
      result = `${currency}${value}`;
    } else if (name && percentageFormatNames.includes(name)) {
      result = `${value}%`;
    }
    return result;
  }

  // 折线图配置
  const reactEchartsConfig = {
    notMerge: true,
    option: {
      // padding
      grid: {
        top: 30,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params) => {
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
                        { getFormatterValue(item.seriesName as string, item.value, currency) }
                      </div>
                    </div>
                  );
                })
              }
            </div>
          );
        },
      },
      xAxis: getXAxisOption(),
      yAxis: getYAxisOption(),
      series: getSeriesOption(),
      color: colors,
    } as echarts.EChartOption,
    style: { width: '100%', height: '400px', ...style },
    loadingOption: { color: colors[0] },
    showLoading: loading,
  };

  return <ReactEcharts {...reactEchartsConfig} />;
};

export default Charts;
