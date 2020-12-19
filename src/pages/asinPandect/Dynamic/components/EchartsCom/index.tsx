import React, { useRef } from 'react';
import { DatePicker, Form } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { Moment } from 'moment/moment';
import { day } from '@/utils/utils';
import styles from './index.less';
import { yAxisList } from '@/pages/mws/AsinChange/summary/components/operatorBar';


interface IEchartsCom{
  modifySendState: (params: API.IParams) => void;
  data: API.IParams;
  message?: string;
  chartLoading: boolean;
  currency: string;
}

const getPinColor = (shortName: string) => {
  const operaShortList = ['图片', '标题', 'Deal', '劵', '变体', 'Bun', 'BP', '促', '描述', 'EBC', '视频'];
  const adjustShortList = ['分类', 'AC', 'FBT', 'Add'];
  const feedbackShortList = ['Q&A', 'Review'];
  const relativeShortList = ['有货', '缺货', '库存不足', '预售', 'BS', 'NR'];
  const raceOperaShortList = ['卖家', 'FBA', 'FBM', 'Amazon', '卖家数']; 
  if (operaShortList.includes(shortName)){
    return { color: '#49B5FF' };
  }
  if (adjustShortList.includes(shortName)){
    return { color: '#FFC175' };
  }
  if (feedbackShortList.includes(shortName)){
    return { color: '#6FE09C' };
  }
  if (relativeShortList.includes(shortName)){
    return { color: '#FE8484' };
  }
  if (raceOperaShortList.includes(shortName)){
    return { color: '#759FFF' };
  }
  return { color: '#49B5FF' };
};

const rangeList = {
  '最近7天': [
    moment().subtract(6, 'day'),
    moment().endOf('day'),
  ],
  '最近14天': [
    moment().subtract(13, 'day'),
    moment().endOf('day'),
  ],
  '最近30天': [
    moment().subtract(29, 'day'),
    moment().endOf('day'),
  ],
  '最近60天': [
    moment().subtract(59, 'day'),
    moment().endOf('day'),
  ],
  '最近180天': [
    moment().subtract(179, 'day'),
    moment().endOf('day'),
  ],
  '最近365天': [
    moment().subtract(364, 'day'),
    moment().endOf('day'),
  ],
};
const myLabel = {
  show: 'true',
  position: 'inside',
  formatter: '{b}',
};

const getName = (seriesName: string) => {
  const result = yAxisList.filter(item => item.value === seriesName);
  return result.length > 0 ? result[0].name : false;
};
const { RangePicker } = DatePicker;
const dateStart = moment().subtract(29, 'days').format('YYYY-MM-DD');
const dateEnd = moment().format('YYYY-MM-DD');
const EchartsCom: React.FC<IEchartsCom> = ({
  modifySendState,
  chartLoading,
  currency,
  data,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refEcharts = useRef<any>(null);
  const minCategoryList: string[] = [];
  const bigCategoryList: string[] = [];
  const [form] = Form.useForm();
  const range = {
    dateStart,
    dateEnd,
  };
 
  //日历
  const RangePickerProps: API.IParams = {
    ranges: rangeList,
    onChange: (dates: Moment[]): void => {
      range.dateStart = dates[0].format('YYYY-MM-DD');
      range.dateEnd = dates[1].format('YYYY-MM-DD');
    },
    onOpenChange: (open: boolean) => {
      if (range.dateStart === dateStart && range.dateEnd === dateEnd) {
        return; 
      }
      if (!open){
        modifySendState({ ...range });
        refEcharts.current.getEchartsInstance().dispatchAction({
          type: 'dataZoom',
          startValue: range.dateStart,
          endValue: range.dateEnd,
        });
      }
    },
  };

  const EventsDict = {
    'dataZoom': () => {
      if (refEcharts.current){
        const { startValue, endValue } = 
        refEcharts.current.getEchartsInstance().getOption().dataZoom[0];
        range.dateStart = moment(startValue).format('YYYY-MM-DD');
        range.dateEnd = moment(endValue).format('YYYY-MM-DD');
        modifySendState({ ...range });
        form.setFieldsValue({
          dateRange: [moment(range.dateStart), moment(range.dateEnd)],
        });
      }
    },
  };

 
  //设置echarts配置信息
  const getOption = () => {
    const yAxisIndexList: echarts.EChartOption.YAxis[] = [
      { //排名
        name: '',
        type: 'value',
        inverse: true,
        position: 'right',
        splitLine: { //网格线
          lineStyle: {
            type: 'dotted', //设置网格线类型 dotted：虚线   solid:实线
            color: '#c1c1c1',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#ccc',
          },
        },
        axisLabel: {
          color: '#555',
        },
        axisTick: {
          lineStyle: {
            color: '#ccc',
          },
        },
      }];
    //获取到曲线
    const getSeries = () => {
      const series = [];
      let changeVoIndex = 1;
      const { polylineResult, categoryRanking, listingChangeVo, polylineName } = data;
      if (categoryRanking !== undefined){
        const rankList = Object.keys(categoryRanking);
        //排名有就在右侧 索引0
        rankList.map((item) => {
          categoryRanking[item].map((detail: API.IParams) => {
            if (item === polylineName){
              changeVoIndex = 0; 
            }
            if (item === 'bigCategoryRanking'){
              bigCategoryList.push(detail.categoryName);
            } else if (item === 'smallCategoryRanking'){
              minCategoryList.push(detail.categoryName);
            }
            series.push({
              name: detail.categoryName,
              data: detail.categoryPolyline,
              type: 'line',
              connectNulls: true,
              yAxisIndex: 0,
            });
          });
        });
      }

      if (polylineResult !== undefined){
        const resultList = Object.keys(polylineResult);
        resultList.map((item, index) => {

          if (item === polylineName){
            changeVoIndex = Number(index + 1);
          }

          if (item === 'conversionRate'){
            yAxisIndexList[index + 1] = { //百分比
              name: '',
              type: 'value',
              position: index === 0 ? 'left' : 'right',
              axisLabel: {
                formatter: '{value} %',
                color: '#555',
              },
              axisLine: {
                lineStyle: {
                  color: '#ccc',
                },
              },
              splitLine: { //网格线
                lineStyle: {
                  type: 'dotted', //设置网格线类型 dotted：虚线   solid:实线
                },
              },
              axisTick: {
                lineStyle: {
                  color: '#ccc',
                },
              },
            };
          } else if (item === 'price'){
            yAxisIndexList[index + 1] = {
              name: '',
              type: 'value',
              position: index === 0 ? 'left' : 'right',
              axisLabel: {
                formatter: `${currency}{value}`,
                color: '#555',
              },
              axisLine: {
                lineStyle: {
                  color: '#ccc',
                },
              },
              splitLine: { //网格线
                lineStyle: {
                  type: 'dotted', //设置网格线类型 dotted：虚线   solid:实线
                },
              },
              axisTick: {
                lineStyle: {
                  color: '#ccc',
                },
              },
            };
          } else {
            yAxisIndexList[index + 1] = {
              name: '',
              type: 'value',
              position: index === 0 ? 'left' : 'right',
              axisLabel: {
                color: '#555',
              },
              axisLine: {
                lineStyle: {
                  color: '#ccc',
                },
              },
              splitLine: { //网格线
                lineStyle: {
                  type: 'dotted', //设置网格线类型 dotted：虚线   solid:实线
                },
              },
              axisTick: {
                lineStyle: {
                  color: '#ccc',
                },
              },
            };
          }

          series.push({
            name: getName(item),
            data: polylineResult[item],
            type: 'line',
            connectNulls: true,
            yAxisIndex: Number(index + 1),
          });
        });
       
      }
      if (listingChangeVo !== undefined){
        listingChangeVo.map((item: API.IParams) => {
          item.itemStyle = getPinColor(item.name);
        });
       
        //listingChangeVo导入
        listingChangeVo.length > 0 && series.push({
          symbolSize: 50,
          yAxisIndex: changeVoIndex,
          symbol: 'pin',
          data: listingChangeVo,
          type: 'scatter',
          label: {
            normal: myLabel,
            emphasis: myLabel,
          },
        });
      }
      return series;
    };
    const option: echarts.EChartOption = {
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
        },
        backgroundColor: '#fff',
        textStyle: {
          color: '#222',
          lineHeight: 24,
        },
        extraCssText: 'box-shadow: 0px 3px 13px 0px rgba(215, 215, 215, 0.75);',
        padding: [7, 14, 2, 14],
        // 价格单金额单位，转化率带百分比，排名带#号
        formatter: (params) => {
          const time = params[0].axisValue;
          const date = moment(time).format('YYYY-MM-DD');
          const week = day.getWeek(time);
          let htmlOuter = `<span style="color:#888;">${date}&nbsp;&nbsp;${week}</span><br/>`;
          if (params instanceof Array){
            let html = ``;
            let countBig = 0;
            let countSmall = 0;
            let countScatter = 0;
            let bigCateHtml = ``;//大类排名曲线
            let smallCateHtml = ``;//小类排名曲线
            let pinHtml = ``;

            params.forEach((item) => {
              if (bigCategoryList.indexOf(item.seriesName as string) > -1){
                countBig++;
              }
              if (minCategoryList.indexOf(item.seriesName as string) > -1){
                countSmall++;
              }
              if (item.seriesType === 'scatter'){
                countScatter++;
              }
            });

            if (countBig > 0){
              bigCateHtml = `<div style="padding-top:9px;padding-bottom:3px;">大类排名：</div>`;
            }
            if (countSmall > 0){
              smallCateHtml = `<div style="padding-top:9px;padding-bottom:3px;">小类排名：</div>`;
            }
            if (countScatter > 0){
              pinHtml = `<div style="padding-top:7px;">`;
            }
            
            params.forEach((item) => {
              if (item.seriesType === 'line'){
                if (/价格/.test(item.seriesName as string)){
                  html += `${item.marker}<span style="color:#222">${item.seriesName}:</span>`;
                  html += `<span style="color:#555">&nbsp;${item.data[1] === null ? '' : `${currency}${item.data[1]}`}</span><br/>`;
                } else if (/Session/.test(item.seriesName as string)){
                  html += `${item.marker}<span style="color:#222">${item.seriesName}:</span>`;
                  html += `<span style="color:#555">&nbsp;${item.data[1] === null ? '' : `${item.data[1]}%` }</span><br/>`;
                } else {
                  if (bigCategoryList.indexOf(item.seriesName as string) > -1){
                    bigCateHtml += `<div style="line-height:22px;">${item.marker}<span style="color:#FFAF4D">${item.data[1] === null ? '' : `#${item.data[1]}`} 
                    </span>&nbsp;&nbsp;<span style="color:#555">${item.seriesName}</span></div>`;
                  } else if (minCategoryList.indexOf(item.seriesName as string) > -1){
                    smallCateHtml += `<div style="line-height:22px;">${item.marker}<span style="color:#FFAF4D">${item.data[1] === null ? '' : `#${item.data[1]}`}
                    </span>&nbsp;&nbsp;<span style="color:#555">${item.seriesName}</span></div>`;
                  } else {
                    html += `${item.marker}<span>${item.seriesName}:</span>`;
                    html += `<span style="color:#555">${item.data[1] === null ? '' : item.data[1]}</span><br/>`;
                  }
                }
              } else if (item.seriesType === 'scatter'){
                if (item.value && item.value[2]){
                  pinHtml += `<span style="color:#555">
                  ${item.value[2]}</span><br/>`;
                }
                
              }
            });
            htmlOuter += html + bigCateHtml + smallCateHtml + pinHtml;
          }
          return htmlOuter;
        },
      },
      grid: {
        top: 87,
        left: 60,
        right: 60,
        bottom: 10,
        containLabel: true,
      },
      legend: {
        left: 60,
        top: 24,
        itemGap: 20,
        textStyle: { color: '#666', fontSize: 14 }, 
      }, 
      dataZoom: [
        {
          type: 'slider',
          realtime: true,
          show: true,
          startValue: new Date(dateStart),
          endValue: new Date(dateEnd),
        },
      ],
      xAxis: {
        type: 'time',
        splitLine: {
          show: false,
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#ccc',
          },
        },
        axisLabel: {
          color: '#999',
          fontSize: 12,
          formatter: function (value: string) {
            // 格式化成月-日
            const date = new Date(value);
            const texts = [(date.getMonth() + 1), date.getDate()];
            return texts.join('-');
          },
        },
        axisTick: {
          show: true,
          inside: true,
          lineStyle: {
            color: '#ccc',
          },
        },
      },
      
      yAxis: yAxisIndexList,
      color: ['#49B5FF', '#FFC175', '#6FE09C', '#FE8484', '#759FFF'],
      series: getSeries(),
    };
    return option;
  };
  const loadingOption: () => echarts.EChartsLoadingOption = () => {
    return {
      color: '#49b5ff',
    };
  };

  //echarts的属性
  const echartsProps = {
    ref: refEcharts,
    style: { width: '100%', height: '434px' },
    option: getOption(),
    notMerge: false,
    loadingOption: loadingOption(),
    showLoading: chartLoading,
    onEvents: EventsDict,
  };
 

  //
  const dateRangeInitial = {
    dateRange: [moment(dateStart), moment(dateEnd)],
  };
  return (
    <div className={styles.echarts_com}>
      <div className={styles.calendar_picker}>
        <Form 
          form={form}
          initialValues={dateRangeInitial}
        >
          <Form.Item name="dateRange">
            <RangePicker {...RangePickerProps}/>
          </Form.Item>
        </Form>
        
      </div>
      <ReactEcharts 
        {...echartsProps}
      />
    </div>
  );
};
export default EchartsCom;
