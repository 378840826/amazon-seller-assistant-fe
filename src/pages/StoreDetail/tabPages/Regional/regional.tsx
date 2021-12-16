/**
 * 地区销售
 * 地图部分数据用的 @/pages/asinPandect/Dsell,  需要优化
 */
import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useDispatch, useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import ReactEcharts from 'echarts-for-react';
import { requestErrorFeedback } from '@/utils/utils';
import echarts from 'echarts';
import mapJson from '@/pages/asinPandect/Dsell/map.json';
import { lineConfig, notShowConfig } from '@/pages/asinPandect/Dsell/config';
import { handleMapBarCoordinates, sumBarHeight, sumBarY } from '@/pages/asinPandect/Dsell/function';
import styles from './regional.less';

const Page: React.FC = () => {
  const dispatch = useDispatch();
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;
  const headersParams = { StoreId: currentShopId };
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['storeDetail/fetchReturnAnalysis'];
  const pageData = useSelector((state: IConnectState) => state.storeDetail);
  const { searchParams, regionalData } = pageData;
  // 最大数量
  const maxStockNumber = Math.max(...regionalData.map(item => Number(item.quantity)));

  useEffect(() => {
    if (searchParams.startTime && searchParams.endTime) {
      dispatch({
        type: 'storeDetail/fetchRegional',
        payload: {
          ...searchParams,
          headersParams,
        },
        callback: requestErrorFeedback,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 注册本地地图数据
  echarts.registerMap('America', mapJson, {
    Alaska: { // 把阿拉斯加移到美国主大陆左下方
      left: -131,
      top: 25,
      width: 15,
    },
    Hawaii: {
      left: -110, // 夏威夷
      top: 28,
      width: 5,
    },
    'Puerto Rico': { // 波多黎各
      left: -76,
      top: 26,
      width: 2,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const option: any = {
    geo: {
      map: 'America',
      zoom: 1.25,
      top: 70,
      left: 100,
      roam: false,
      label: {
        show: true,
        fontSize: 13,
      },
      itemStyle: {
        normal: {
          borderColor: '#c5c5c5',
          areaColor: '#f8f8f8',
          borderWidth: 1,
          show: false,
        },
      },
      emphasis: {
        itemStyle: {
          borderColor: '#49B5FF',
          areaColor: '#deebf8',
          borderWidth: 2,
        },
        label: {
          color: '#0083ff',
        },
      },
      regions: notShowConfig,
    },
    tooltip: {
      trigger: 'item',
      pading: 0,
      show: true,
      backgroundColor: '#fff',
      extraCssText: 'box-shadow: 0px 3px 13px 0px rgba(231, 231, 231, 0.75);',
      formatter(params: AsinDsell.ITooltipType) {
        const { seriesName } = params;
        let sales = 0;
        let repertory = 0;
        for (let i = 0; i < regionalData.length; i++) {
          const item = regionalData[i];
          if (item.state === seriesName) {
            sales = item.sales;
            repertory = item.quantity;
            break;
          }
        }
        return ReactDOMServer.renderToStaticMarkup(
          <div className={styles.tooltipContainer}>
            <div className={styles.seriesName}>{seriesName || '—'}</div>
            <div>
              <i className={styles.salesIcon} /> 
              <span className={styles.title}>销量：</span>
              <span className={styles.value}>{ sales || '-' }</span>
            </div>
            <div>
              <i className={styles.inventoryIcon} /> 
              <span className={styles.title}>库存：</span>
              <span className={styles.value}>{ repertory || '-' }</span>
            </div>
          </div>
        );
      },
    },
    series: lineConfig(regionalData),
    xAxis: [],
    yAxis: [],
    grid: [],
  };

  regionalData.forEach((dataItem, i) => {
    const idx = i.toString();
    const inflationData = [];
    const type = dataItem.state;
    const { left = 0, top = 0 } = handleMapBarCoordinates(type);
    let barHeight = 0;
    // let barHeight1 = 0; // 只算了存库的高度，可能存在bug
    inflationData[0] = dataItem.sales;
    // inflationData[0] = 75;
    let a = Number(dataItem.sales);

    if (Number(dataItem.sales) < Number(dataItem.quantity)) {
      a = Number(dataItem.quantity);
    }

    barHeight = sumBarHeight(a, Number(maxStockNumber));
    inflationData[1] = dataItem.quantity;
    
    option.xAxis.push({
      id: idx,
      gridId: idx,
      type: 'category',
      name: type,
      nameLocation: 'middle',
      nameGap: 0,
      show: false,
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: '#555',
        },
      },
    });
    option.yAxis.push({
      id: idx,
      gridId: idx,
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      z: 100,
    });

    option.grid.push({
      id: idx,
      width: 24,
      height: barHeight,
      left, 
      top: sumBarY(barHeight, top),
      z: 100,
    });
    option.series.push({
      id: idx,
      name: type,
      type: 'bar',
      barGap: 0,
      barMinWidth: 12,
      xAxisId: idx,
      yAxisId: idx,
      barMinHeight: 0,
      data: [
        sumBarHeight(dataItem.sales, Number(maxStockNumber)), 
        sumBarHeight(dataItem.quantity, Number(maxStockNumber)),
      ],
      // z: 1000,
      itemStyle: {
        normal: {
          color(params: { dataIndex: number}) {
            // 柱状图每根柱子颜色
            const colorList = ['#49b5ff', '#ffc175'];
            return colorList[params.dataIndex];
          },
        },
      },
    });
  });

  const config = {
    onChartReady: (e: echarts.ECharts) => {
      window.addEventListener('resize', function () {
        e.resize();
      });
    },
    showLoading: loading,
    style: { width: 1500, height: 700, margin: '0 auto' },
    option,
  };

  return (
    <div className={styles.container}>
      <ReactEcharts { ...config } />
    </div>
  );
};

export default Page;
