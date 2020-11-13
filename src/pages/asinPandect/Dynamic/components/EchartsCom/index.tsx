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
          },
        },
        axisLabel: {
          color: '#999',
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
                color: '#999',
              },
              splitLine: { //网格线
                lineStyle: {
                  type: 'dotted', //设置网格线类型 dotted：虚线   solid:实线
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
                color: '#999',
              },
              splitLine: { //网格线
                lineStyle: {
                  type: 'dotted', //设置网格线类型 dotted：虚线   solid:实线
                },
              },
            };
          } else {
            yAxisIndexList[index + 1] = {
              name: '',
              type: 'value',
              position: index === 0 ? 'left' : 'right',
              axisLabel: {
                color: '#999',
              },
              splitLine: { //网格线
                lineStyle: {
                  type: 'dotted', //设置网格线类型 dotted：虚线   solid:实线
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
          lineHeight: 26,
        },
        extraCssText: 'box-shadow: 0px 3px 13px 0px rgba(215, 215, 215, 0.75);',
        padding: [10, 14, 3, 14],
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
            });

            if (countBig > 0){
              bigCateHtml = `<span style="line-height:32px;">大类排名：</span><br/>`;
            }
            if (countSmall > 0){
              smallCateHtml = `<span style="line-height:32px;">小类排名：</span><br/>`;
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
                    bigCateHtml += `${item.marker}<span style="color:#FFAF4D">${item.data[1] === null ? '' : `#${item.data[1]}`} 
                    </span>&nbsp;&nbsp;<span style="color:#555">${item.seriesName}</span><br/>`;
                  } else if (minCategoryList.indexOf(item.seriesName as string) > -1){
                    smallCateHtml += `${item.marker}<span style="color:#FFAF4D">${item.data[1] === null ? '' : `#${item.data[1]}`}
                    </span>&nbsp;&nbsp;<span style="color:#555">${item.seriesName}</span><br/>`;
                  } else {
                    html += `${item.marker}<span>${item.seriesName}:</span>`;
                    html += `<span style="color:#555">${item.data[1] === null ? '' : item.data[1]}</span><br/>`;
                  }
                }
              } else if (item.seriesType === 'scatter'){
                if (item.value && item.value[2]){
                  pinHtml += `<span style="width:50px;display:inline-block">${item.name}：
                    </span><span style="color:#555">
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
        top: 67,
        height: 347,
        left: 60,
        right: 60,
        containLabel: true,
      },
      legend: {
        left: 60,
        top: 24,
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
        axisLine: {
          lineStyle: {
            color: '#999', //左边线的颜色
          },
        },
        splitNumber: 0, //坐标分割的段数
        axisLabel: {
          color: '#999',
          fontSize: 12,
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
    style: { width: '100%', height: '414px' },
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
