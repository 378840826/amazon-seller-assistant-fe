import React, { useState } from 'react';
import { Modal } from 'antd';
import { useDispatch } from 'umi';
import { day } from '@/utils/utils';
import classnames from 'classnames';
import { Iconfont } from '@/utils/utils';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import styles from './index.less';
const myLabel = {
  show: 'true',
  position: 'inside',
  formatter: '{b}',
  color: '#fff',
  borderColor: '#fff',
};
interface IEchartsInfo{
  StoreId: string;
  id: number;
  item: IItem | string;
  type: string;
}
interface IItem{
  ranking: number;
  rankingChange: number;
  pages: number | string;
}
let echartsReact: ReactEcharts | null;

const EchartsInfo: React.FC<IEchartsInfo> = ({
  StoreId,
  id,
  item,
  type,

}) => {
  const dispatch = useDispatch(); 
  const [state, setState] = useState({
    visible: false,
    cycle: 3, //默认选中3天
    showLoading: false, //是否显示echarts loading
  });

  //共同的echarts配置
  const option: echarts.EChartOption = {
    title: {
      text: '',
    },
    color: ['#49B5FF', '#ffc279'],
    grid: {
      top: 45,
      left: 30,
      right: 30,
      bottom: 20,
      containLabel: true,
    },
    tooltip: { //展示数据
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'cross', // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: (params) => {
        const time = params[0].axisValue;
        const date = moment(time).format('YYYY-MM-DD');
        const week = day.getWeek(time);
        let htmlOuter = `<span>${date}&nbsp;&nbsp;${week}</span><br/>`;
        if (params instanceof Array){
          params.map(item => {
            if (item.seriesType === 'line'){
              htmlOuter += `<div style="text-align:left">${item.marker}
                              <span>排名：${item.data[1]}</span></div>
                            <div style="text-align:left;padding-left:21px;">
                            <span>页数：${item.data[2]}</span></div>
              `;
            }
          });
        }
        return htmlOuter;
      },

    },
    xAxis: {
      type: 'time',
      axisLine: {
        lineStyle: {
          color: '#ccc', //左边线的颜色
        },
      },
      axisLabel: {
        color: '#999',
        fontSize: 12,
        formatter: function (value: string) {
          // 格式化成年-月-日
          const date = new Date(value);
          const texts = [date.getFullYear(), (date.getMonth() + 1), date.getDate()];
          return texts.join('-');
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#ccc', 
        },
      },
      axisLabel: {
        color: '#555',
      },
      splitLine: { //网格线
        lineStyle: {
          type: 'dotted', //设置网格线类型 dotted：虚线   solid:实线
          color: '#c1c1c1',
        },
      },
    },
    series: [],
  };

  const showModal = () => {
    setState((state) => ({
      ...state,
      visible: true,
    }));
  };

  const getOption = () => {
    return option;
  };


  const sendAjax = (chart: echarts.ECharts, cycle: number) => {
    if (!id){
      setState(state => ({
        ...state,
        showLoading: false,
      }));
    } else {
      setState(state => ({
        ...state,
        showLoading: true,
      }));
    
      dispatch({
        type: type === 'natural' ? 'dynamic/msGetNaturalData' : 'dynamic/msGetAd',
        payload: {
          data: {
            headersParams: {
              StoreId,
            },
            cycle: cycle,
            id,
          },
        },
        callback: (res: {code: number; data: API.IParams[]; scatter: API.IParams[]}) => {
          const options: echarts.EChartOption = {};
          if (res.code === 200){
            const series1 = {
              name: '搜索结果排名',
              type: 'line',
              data: res.data,
            };
            const series2 = {
              type: 'scatter',
              symbolSize: 50,
              symbol: 'pin',
              data: res.scatter === undefined ? [] : res.scatter,
              label: {
                normal: myLabel,
                emphasis: myLabel,
              },
              animation: false,
            };
            type === 'natural' ? Object.assign(options, option, { series: [series1, series2] })
              :
              Object.assign(options, option, { series: [series1] });
 
          }
          chart.setOption(options);
          setState(state => ({
            ...state,
            showLoading: false,
          }));
        },
      });
    }
  };
  const onChartReady = (chart: echarts.ECharts) => {
    sendAjax(chart, state.cycle);
  };

  const handleCancel = () => {
    setState(state => ({
      ...state,
      visible: false,
    }));
  };

  //切换 3/7/30天
  const onCycleChange = (cycle: number) => {
    if (cycle !== state.cycle){
      setState((state) => ({
        ...state,
        cycle,
      }));
      const echartsInstance = (echartsReact as ReactEcharts).getEchartsInstance();
      sendAjax(echartsInstance, cycle) ;
    }
  };

  const loadingOption: () => echarts.EChartsLoadingOption = () => {
    return {
      color: '#49b5ff',
    };
  };
  return (
    <>
      <div className={styles.__echarts_info}>
        <div className={styles.container}>
          { item === '' ? <>
            <div className="null_bar"></div>
            <span><Iconfont onClick={showModal} className={classnames(styles.zhexiantu, 'zhexiantu')} type="icon-zhexiantongji"/></span>
          </>
            :
            <>
              <div>
                <span className={styles.rank}>{(item as IItem).ranking}</span>
                {(item as IItem).rankingChange === 0 ? <span className={styles.change0}>0</span>
                  : <span className={(item as IItem).rankingChange > 0 ? styles.up : styles.down}>
                    <span className={styles.rankingChange}>
                      {Math.abs((item as IItem).rankingChange)}
                    </span>
                    <Iconfont type="icon-xiajiang" className={styles.arrow} />
                    
                  </span>}
                <span><Iconfont onClick={showModal} className={classnames(styles.zhexiantu, 'zhexiantu')} type="icon-zhexiantongji"/></span>
              </div>
              {(item as IItem).pages === '' ? '' : <div className={styles.__pages}>第{(item as IItem).pages}页</div>}
            </>
          }
          
          
        </div>
      </div>
      <Modal 
        centered
        closable={true}
        visible={state.visible}
        width={1034}
        footer={null}
        destroyOnClose={true}
        onCancel={handleCancel}
        wrapClassName={styles.modalWrapper}
      >
        <div className={styles.title_checkbox}>
          <div className={styles.title_rank_font}>搜索结果排名</div>
          <div className={styles.__ul_select}>
            <ul>{[3, 7, 30].map((item) => {
              return (
                <li key={item} onClick={() => onCycleChange(item)} className={item === state.cycle ? styles.active : ''}>{item}天</li>
              );
            })}</ul>
          </div>
        </div>
        {
          state.visible && 
          <ReactEcharts
            style={{ height: '419px' }}
            option={getOption()}
            onChartReady={onChartReady}
            loadingOption={loadingOption()}
            showLoading={state.showLoading}
            ref={(e) => { 
              echartsReact = e; 
            }}
            
          />
        }
      </Modal>
    </>
    
  );
};
export default EchartsInfo;
