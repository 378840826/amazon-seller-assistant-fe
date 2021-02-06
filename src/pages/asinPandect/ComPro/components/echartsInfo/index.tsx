import React, { useState } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import classnames from 'classnames';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import { IConnectState, IConnectProps } from '@/models/connect';
import { Iconfont, day } from '@/utils/utils';
import { Modal } from 'antd';


interface IEchartsInfo extends IConnectProps{
  StoreId: string;
  id: string;
  category: string;
  currency: string;
}
let echartsReact: ReactEcharts | null;


const categoryObj = {
  price: '价格',
  ranking: '大类排名',
  score: '评分',
  count: 'Review',
};

const EchartsInfo: React.FC<IEchartsInfo> = ({ 
  StoreId, 
  currency,
  id, 
  category,
  dispatch }) => {

  //共同的echarts配置
  const option: echarts.EChartOption = {
    title: {
      text: '',
    },
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 20,
      containLabel: true,
    },
    color: ['#49B5FF'],
    tooltip: { //展示数据
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'cross', // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: param => {
        const time = param[0].axisValue;
        const date = moment(time).format('YYYY-MM-DD');
        let html = `<span style="margin-right:15px;">${date}</span>${day.getWeek(time)}<br/>`;
        if (param instanceof Array){
          param.forEach((item) => {
            if (item.data[1] === '') {
              return; 
            }
            html += `${item.marker}<span>${categoryObj[item.seriesName as string]}:</span>`;
            if ('price'.includes(item.seriesName as string)){
              html += `${currency}${item.data[1]}<br/>`;
            } else {
              html += `${item.data[1]}<br/>`;
            }
          });
        }
        return html;
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
          const texts = moment(new Date(value)).format('YYYY-MM-DD');
          return texts;
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
  const [state, setState] = useState({
    visible: false,
    cycle: 3, //默认选中3天
    category, //当前点钟的分类
  });

  const handleCancel = () => {
    setState((state) => ({
      ...state,
      visible: false,
    }));
  };

  const sendAjax = (chart: echarts.ECharts, cycle: number, category: string) => {
    if (!id) {
      chart.hideLoading();
      return;
    }
    dispatch({
      type: 'comPro/getEcharts',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
          cycle,
          id,
        },
      },
      category,
      callback: (res: {code: number;data: API.IParams[]}) => {
        const options: echarts.EChartOption = {};
        if (res.code === 200){
          const series = {
            name: category,
            type: 'line',
            data: res.data,
          };
          Object.assign(options, option, { series: series });
        }
        chart.setOption(options);
        chart.hideLoading();
      },
    });
  };

  const onCycleChange = (value: number) => {
    setState((state) => ({
      ...state,
      cycle: value,
    }));
    const echartsInstance = (echartsReact as ReactEcharts).getEchartsInstance();
    sendAjax(echartsInstance, value, state.category) ;
  };

  //打开折线图
  const onOpenCharts = () => {
    console.log('dakai');
    setState((state) => ({
      ...state,
      visible: true,
    }));
  };

  const onChange = (item: string) => {
    if (item === state.category) {
      return; 
    }
    setState((state) => ({
      ...state,
      category: item,
    }));
    const echartsInstance = (echartsReact as ReactEcharts).getEchartsInstance();
    sendAjax(echartsInstance, state.cycle, item) ;
  };

  const loadingOption: () => echarts.EChartsLoadingOption = () => {
    return {
      color: '#49b5ff',
    };
  };

  const getOption = () => {
    return option;
  };

  const onChartReady = (chart: echarts.ECharts) => {
    sendAjax(chart, state.cycle, state.category);
  };
  return (
    <>
      <Iconfont type="icon-zhexiantongji" onClick={onOpenCharts} className={styles.arrow}/>
      <Modal
        centered
        closable={true}
        visible={state.visible}
        footer={null}
        width={1016}
        onCancel={handleCancel}
        destroyOnClose={true}
        className={styles.modalWrapper}
      >
        <div className={styles.title_checkbox}>
          
          <div className={styles.__ul_select}>
            <ul className={styles.left}>
              {Object.keys(categoryObj).map((item, index) => {
                return (
                  <li 
                    key={index} 
                    onClick={() => onChange(item)}
                    className={classnames({ [styles.active]: state.category === item })}>
                    {categoryObj[item]}
                  </li>
                );
              })}
            </ul>
            <ul className={styles.right}>{[3, 7, 30].map((item) => {
              return (
                <li key={item} onClick={() => onCycleChange(item)} className={item === state.cycle ? styles.active : ''}>{item}天</li>
              );
            })}</ul>
          </div>
        </div>
        {state.visible && 
        <ReactEcharts
          style={{ height: '419px' }}
          option={getOption()}
          onChartReady={onChartReady}
          loadingOption={loadingOption()}
          showLoading={true}
          ref={(e) => { 
            echartsReact = e; 
          }}
        />
        }
      </Modal>
    </>
    
      
  );
};
export default connect(({ global }: IConnectState) => ({
  StoreId: global.shop.current.id,
  currency: global.shop.current.currency,
}))(EchartsInfo);
