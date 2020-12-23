import React, { useRef, useEffect, useState } from 'react';
import styles from './index.less';
import './index.css';
import { storageKeys } from '@/utils/huang';
import { storage } from '@/utils/utils';
import { 
  handleMapBarCoordinates,
  sumBarHeight,
  sumBarY,
  geDateFields,
} from './function';
import { useDispatch, useSelector } from 'dva';
import echarts from 'echarts';
import Update from './components/UpdateComponent';
import DefinedCalendar from '@/components/DefinedCalendar';
import { lineConfig, notShowConfig } from './config';
import { Spin } from 'antd';
// eslint-disable-next-line
const mapJson = require('./map.json') as any;
interface IMapOptionsType {
  xAxis: any[]; /* eslint-disable-line */
  yAxis: any[]; /* eslint-disable-line */
  grid: any[]; /* eslint-disable-line */
  series: any[]; /* eslint-disable-line */
}

const { asinDsellDateRange } = storageKeys;
const AsinBase: React.FC = () => {
  const dispatch = useDispatch();
  const current = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const StoreId = current.id;
  const currentAsin = useSelector((state: AsinDsell.IASin) => state.asinGlobal.asin);
  const mapRef = useRef('') as React.MutableRefObject<any>; // eslint-disable-line
  const [salesBar] = useState<boolean>(true); // 销量柱
  const [repertoryBar] = useState<boolean>(true); // 库存柱
  const [update, setUpdate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [calendar, setCalendar] = useState<string>(storage.get(`${asinDsellDateRange}_dc_itemKey`) || '7');
  const [chCondition, setChCondition] = useState<boolean>(false); // 专门用于控制请求的
  
  useEffect(() => {
    setLoading(true);
    if (Number(StoreId) <= -1) {
      return;
    }

    new Promise((resolve, reject) => {
      dispatch({
        type: 'districtSell/getDSellInit',
        resolve,
        reject,
        payload: {
          asin: currentAsin,
          ...geDateFields(calendar, asinDsellDateRange),
          headersParams: {
            StoreId,
          },
        },
      });
    }).then(datas => {
      setLoading(false);
      const { data } = datas as {
        data: {
          updateTime: string;
          maxQuantity: string;
          salesInventory: {
            state: string;
            sales: string;
            quantity: string;
          }[];
        };
      };
      const salesInventory = data.salesInventory; // 数据
      // const salesInventory = barData; // 数据
      const maxStockNumber = data.maxQuantity; // 最大数量
      setUpdate(data.updateTime);

      const myChart = echarts.init(mapRef.current);
      myChart.hideLoading();
      
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
      const option = {
        // backgroundColor: 'pink',
        tooltip: {
          trigger: 'item',
          pading: 0,
          show: true,
          backgroundColor: 'transparent',
          formatter(params: AsinDsell.ITooltipType) {
            const { seriesName } = params;
            let html = '';
            let sales = '';
            let repertory = '';

            for (let i = 0; i < salesInventory.length; i++) {
              const item = salesInventory[i];
              if (item.state === seriesName) {
                sales = item.sales;
                repertory = item.quantity as string;
                break;
              }
            }

            html = `<div class="map_tootip">
              <p>${seriesName || 'xx'}</p>
              <p class="sales">
                <span class="icon"></span> 
                销量：
                <span class="text">${ sales || '-' }</span>
                </p>
              <p class="inventory">
                <span class="icon"></span> 
                库存：
                <span class="text">${ repertory || '-' }</span>
              </p>
            </div>`;
            return html;
          },
        },
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
        xAxis: [] as any, // eslint-disable-line
        yAxis: [] as any, // eslint-disable-line
        grid: [] as any, // eslint-disable-line
        series: lineConfig(salesInventory),
      };

      salesInventory.forEach((dataItem, i) => {
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
      myChart.setOption(option as {}, true);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [dispatch, current, StoreId, currentAsin, mapRef, calendar, chCondition]);

  // 日历的回调
  const calendarCb = (dates: DefinedCalendar.IChangeParams) => {
    setCalendar(dates.selectItemKey);
    setChCondition(!chCondition);
  };

  return (
    <div className={styles.box}>
      <Spin spinning={loading}>
        <main className={styles.main}>
          <header>
            <Update update={update} />
            <div>
              <DefinedCalendar style={{
                width: 280,
              }} 
              change={calendarCb} 
              storageKey={asinDsellDateRange}
              itemKey={storage.get(`${asinDsellDateRange}_dc_itemKey`) || '7'}
              />

            </div>
          </header>
          <div ref={mapRef} style={
            {
              width: 1500,
              height: 700,
              margin: '0 auto',
            }
          }></div>
          <div className={styles.map_rows}>
            <p className={styles.repertory}>
              <span className={styles.icon} style={
                {
                  backgroundColor: repertoryBar ? '#ffc175' : '#ccc',
                }
              }></span>
              库存
            </p>
            <p className={styles.sales}>
              <span className={styles.icon} style={
                {
                  backgroundColor: salesBar ? '#49b5ff' : '#ccc',
                }
              }></span>
              销量
            </p>
          </div>
        </main>
      </Spin>
    </div>
  );
};

export default AsinBase;
