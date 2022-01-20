/**
 * 世界地图
 */
import React, { useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import worldJson from 'echarts/map/json/world.json';
import ReactDOMServer from 'react-dom/server';
import { marketplaceToChineseDict } from '@/utils/utils';
import { IMapSiteData } from '@/models/salesOverview';
import { AssignmentKeyName, getFormatterValue } from '../../utils';
import styles from './index.less';

interface IProps {
  dataTypes: string[];
  data: IMapSiteData[];
  currency: string;
  colors: string[];
}

// // 状图在地图上的坐标, 地图宽度固定为 1400*700 时适用
// const barMapCoordinatesDict = {
//   US: { bottom: 500, left: 290 },
//   CA: { bottom: 630, left: 300 },
//   UK: { bottom: 610, left: 670 },
//   ES: { bottom: 526, left: 674 },
//   IT: { bottom: 526, left: 746 },
//   FR: { bottom: 560, left: 700 },
//   DE: { bottom: 586, left: 724 },
//   JP: { bottom: 510, left: 1230 },
// };

// 状图在地图上的坐标
const barMapCoordinatesDict = {
  US: { bottom: '63%', left: '21%' },
  CA: { bottom: '75%', left: '18%' },
  UK: { bottom: '77%', left: '48%' },
  ES: { bottom: '66%', left: '48.1%' },
  IT: { bottom: '66%', left: '53.4%' },
  FR: { bottom: '70%', left: '50%' },
  DE: { bottom: '73%', left: '51.8%' },
  JP: { bottom: '64%', left: '87.6%' },
};

// 全部站点
const marketplaceArr = Object.keys(barMapCoordinatesDict) as API.Site[];

// 空数据，用于 echatrs 的数据合并，更新配置时，echarts 是合并旧数据，而非替换旧数据
const defaultData = marketplaceArr.map(marketplace => ({
  name: marketplaceToChineseDict[marketplace],
  marketplace,
  [AssignmentKeyName['总销售额']]: null,
  [AssignmentKeyName['总订单量']]: null,
  [AssignmentKeyName['总销量']]: null,
  [AssignmentKeyName['广告销售额']]: null,
  [AssignmentKeyName['广告订单量']]: null,
  [AssignmentKeyName['广告花费']]: null,
}));

// 浏览器视口宽度
const windowWidth = window.innerWidth;
// 地图容器宽度
const containerWidth = windowWidth - 400 - 60 - 70;
// 柱状图的最大高度和最小高度限制，1920屏幕下60合适。 32 约等于 1920 / 60
const barMaxHeight = Math.floor(windowWidth / 32);
const barMinHeight = 4;
// 每组柱状图（一个站点）的宽度 1920屏幕下80合适。 24 = 1920 / 80
const barGroupWidth = Math.floor(windowWidth / 80);


const WorldMap: React.FC<IProps> = props => {
  const { data, dataTypes, currency, colors } = props;
  const uniqueDataTypes = Array.from(new Set(dataTypes));

  const histogramData = useMemo(() => {
    // 后端返回的可能不完整的数据
    const resData = data.map(item => ({
      name: marketplaceToChineseDict[item.marketplace],
      ...item,
    }));
    const resMarketplaceArr = data.map(item => item.marketplace);
    // 完整的空数据中，替换后端返回的数据，组成完整的数据，避免更新echarts时合并数据后有旧数据
    // 在增加‘勾选店铺’功能后需要优化，否则未勾选的店铺将显示空数据而不是不显示
    return defaultData.map((item, i) => {
      if (resMarketplaceArr.includes(item.marketplace)) {
        return resData.find(r => r.marketplace === item.marketplace) || defaultData[i];
      }
      return defaultData[i];
    });
  }, [data]);

  // 找出相同字段的最大值
  function getMaxData(key: string) {
    // 增加一个 0 避免为空时返回 -Infinity
    const values: number[] = [0];
    histogramData.forEach(item => {
      // 非空push
      item[key] && values.push(item[key]);
    });
    return Math.max(...values);
  }

  // 获取一个站点的柱状图的总高度（对比最大值占比比较高的那个数据，再乘以柱状图最大高度
  function getGridHeight(siteData: IMapSiteData) {
    // 分别找出两个数据占相应最大数据值的百分比
    const [name1, name2] = dataTypes;
    const [key1, key2] = [AssignmentKeyName.getkey(name1), AssignmentKeyName.getkey(name2)];
    const [value1, value2] = [siteData[key1], siteData[key2]];
    const [maxValue1, maxValue2] = [getMaxData(key1), getMaxData(key2)];
    const [ratio1, ratio2] = [value1 / maxValue1, value2 / maxValue2];
    const [height1, height2] = [(ratio1 || 0) * barMaxHeight, (ratio2 || 0) * barMaxHeight];
    return Math.ceil(Math.max(height1, height2));
  }

  // 获取柱状图单个柱子高度
  function getBarHeight(value: string | number | null, maxValue: number) {
    // 无数据时不显示
    if ([0, null, '', '0', undefined].includes(value)) {
      return 0;
    }
    // 当前值和最大值的比值
    const proportion = Number(value) / maxValue;
    let height = Math.floor(barMaxHeight * proportion);
    // 有数据时高度不能低于最小值
    if (height < barMinHeight) {
      height = barMinHeight;
    }
    return height;
  }

  // 柱状图配置
  function getHistogramOptions() {
    const xAxis: echarts.EChartOption.XAxis[] = [];
    const yAxis: echarts.EChartOption.YAxis[] = [];
    const grid: echarts.EChartOption.Grid[] = [];
    const series: echarts.EChartOption.Series[] = [];
    histogramData.forEach((item, index) => {
      const id = String(index);
      const marketplace = item.marketplace;
      const { bottom, left } = barMapCoordinatesDict[marketplace];
      xAxis.push({
        id,
        gridIndex: index,
        type: 'category',
        show: false,
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        axisLine: { show: false },
        z: 100,
      });
      yAxis.push({
        id,
        gridIndex: index,
        // Y轴高度和最大的柱状图柱子高度齐平（也就是让 barMaxHeight 真正等于最大高度）
        max: 'dataMax',
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        axisLine: { show: false },
        z: 100,
      });
      grid.push({
        id,
        width: barGroupWidth,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        height: getGridHeight(item as any),
        bottom,
        left,
        z: 100,
      });
      series.push({
        id,
        name: marketplace,
        type: 'bar',
        barMaxWidth: 12,
        barCategoryGap: '20%',
        xAxisIndex: index,
        yAxisIndex: index,
        data: uniqueDataTypes.map(name => {
          const key = AssignmentKeyName.getkey(name);
          return getBarHeight(item[key], getMaxData(key));
        }),
        itemStyle: {
          normal: {
            color(params: { dataIndex: number}) {
              return colors[params.dataIndex];
            },
          },
        },
        z: 100,
      });
    });
    return {
      xAxis,
      yAxis,
      grid,
      series,
    };
  }
 
  function getConfig() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const option: any = {
      series: [
        // 地图
        {
          name: '销售大盘',
          type: 'map',
          map: 'world',
          label: {
            show: false,
          },
          nameMap: {
            'United Kingdom': '英国',
            'Italy': '意大利',
            'Japan': '日本',
            'Canada': '加拿大',
            'United States': '美国',
            'Germany': '德国',
            'France': '法国',
            'Spain': '西班牙',
          },
          left: 0,
          right: 0,
          itemStyle: {
            borderColor: '#c5c5c5',
            areaColor: '#f8f8f8',
            borderWidth: 1,
          },
          // 高亮时
          emphasis: {
            itemStyle: {
              borderColor: '#49B5FF',
              areaColor: '#deebf8',
              borderWidth: 1,
            },
            label: {
              color: '#0083ff',
            },
          },
          // data: histogramData.map(item => ({ ...item, selected: true })),
          data: histogramData,
        },
      ],
      tooltip: {
        trigger: 'item',
        show: true,
        formatter(params: echarts.EChartOption.Tooltip.Format) {
          if (params.seriesType === 'bar') {
            // 柱状图
            return ReactDOMServer.renderToStaticMarkup(
              <div className={styles.tooltipContainer}>
                <div className={styles.marketplaceName}>
                  {marketplaceToChineseDict[params.seriesName || '']}
                </div>
                {
                  uniqueDataTypes.map((name, index) => {
                    const site = histogramData.find(item => item.marketplace === params.seriesName);
                    const valueNum = site && site[AssignmentKeyName.getkey(name)];
                    const color = colors[index];
                    return (
                      <div className={styles.tooltipItem} key={name}>
                        <span className={styles.marker} style={{ background: color }} />
                        <span className={styles.tooltipTitle}>{name}：</span>
                        { getFormatterValue(name, valueNum, currency) }
                      </div>
                    );
                  })
                }
              </div>
            );
          } else if (params.seriesType === 'map') {
            // 地图，站点国家才响应
            if (marketplaceArr.includes(params.data?.marketplace)) {
              return ReactDOMServer.renderToStaticMarkup(
                <div className={styles.tooltipContainer}>
                  <div className={styles.marketplaceName}>{params.data.name}</div>
                  {
                    uniqueDataTypes.map((name, index) => {
                      const valueNum = params.data[AssignmentKeyName.getkey(name)];
                      const color = colors[index];
                      return (
                        <div className={styles.tooltipItem} key={name}>
                          <span className={styles.marker} style={{ background: color }} />
                          <span className={styles.tooltipTitle}>{name}：</span>
                          { getFormatterValue(name, valueNum, currency) }
                        </div>
                      );
                    })
                  }
                </div>
              );
            }
          }
        },
      },
      // 待删除
      xAxis: [],
      yAxis: [],
      grid: [],
    };
    const histogramOptions = getHistogramOptions();
    option.xAxis?.push(...histogramOptions.xAxis);
    option.yAxis?.push(...histogramOptions.yAxis);
    option.grid?.push(...histogramOptions.grid);
    option.series?.push(...histogramOptions.series);
    const config = {
      onChartReady: (e: echarts.ECharts) => {
        window.addEventListener('resize', function () {
          e.resize();
        });
      },
      style: { width: containerWidth, height: containerWidth / 1.75, margin: '0 auto' },
      option,
    };
    return config;
  }
    
  // 注册json地图
  echarts.registerMap('world', worldJson);

  return (
    <div>
      <ReactEcharts {...getConfig()}/>
    </div>
  );
};

export default WorldMap;
