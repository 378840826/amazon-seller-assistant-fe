/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-08-10 09:05:26
 * @FilePath: \amzics-react\src\pages\asinPandect\B2B\function.ts
 */

import moment from 'moment';
import { isFillField } from '@/utils/huang';

/**
 * 后端的字段转成中文显示
 * 或将中文转换成英文
 * @param value 
 * @param toChs 
 */
export function handleChiese(value: string, flag = false): string {
  if (flag) {
    switch (value) {
    case 'B2B订单量':
      return 'orderQuantity';
    case 'B2B销量':
      return 'salesQuantity';
    case 'B2B销量/订单量':
      return 'salesQuantityDivOrderQuantity';
    case 'B2B销售额':
      return 'sales';
    case 'B2B平均售价':
      return 'avgPrice';
    case 'B2B平均客单价':
      return 'pct';
    case 'B2B销售额占比':
      return 'percentageB2bSales';
    default:
      return '';
    }
  }

  switch (value) {
  case 'orderQuantity':
    return 'B2B订单量';
  case 'salesQuantity':
    return 'B2B销量';
  case 'salesQuantityDivOrderQuantity':
    return 'B2B销量/订单量';
  case 'sales':
    return 'B2B销售额';
  case 'avgPrice':
    return 'B2B平均售价';
  case 'pct':
    return 'B2B平均客单价';
  case 'percentageB2bSales':
    return 'B2B销售额占比';
  default:
    return '';
  }
}

// 各个指标的符号
export function lineChartSymbol(type: string, value = '', symbol = '', fillNumber = 0) {  // eslint-disable-line
  switch (type) {
  case 'orderQuantity':
    return parseFloat(value).toFixed(fillNumber);
  case 'salesQuantity':
    return parseFloat(value).toFixed(fillNumber);
  case 'session':
    return parseFloat(value).toFixed(fillNumber);
  case 'couponOrderQuantity':
    return parseFloat(value).toFixed(fillNumber);
  case 'relatedSalesFrequency':
    return parseFloat(value).toFixed(fillNumber);
  case 'pageViews':
    return parseFloat(value).toFixed(fillNumber);
  case 'pageViewsDivSessions':
    return parseFloat(value).toFixed(fillNumber);
  case 'salesQuantityDivOrderQuantity':
    return parseFloat(value).toFixed(fillNumber);
  case 'sales':
    return symbol + (parseFloat(value).toFixed(fillNumber));
  case 'avgPrice':
    return symbol + (parseFloat(value).toFixed(fillNumber));
  case 'pct':
    return symbol + (parseFloat(value).toFixed(fillNumber));
  case 'takeRates':
    return `${parseFloat(value).toFixed(fillNumber)}%`;
  case 'percentageB2bSales':
    return `${parseFloat(value).toFixed(fillNumber)}%`;
  default:
    return '';
  }
}

// 折线图series数据项的配置
export function lineChartConfig(name = '', data: string[] = [], yAxisIndex = 0) {
  return {
    name,
    type: 'line',
    data: data,
    symbol: 'none',
    smooth: false,
    yAxisIndex,
    splitLine: {
      show: true,
    },
  };
}


// 调周期转换成后端需要的字段
export function handleRange(type: string): string {
  switch (type) {
  case '7':
    return '6';
  case '30':
    return '7';
  case '60':
    return '8';
  case '90':
    return '9';
  case '180':
    return '10';
  case '365':
    return '11';
  case 'year':
    return '12';
  case 'lastYear':
    return '13';
  default: 
    return '6';
  }
}


export function handleLineCahrtTooltip(params: {
  param: AsinB2B.ILineChartsTooltip[]; 
  lastYearXData: string[]; // 
  weekMonthXData: string[];
  symbol: string;
}): string {
  const {
    param = [], // 数据
    lastYearXData = [], // 上年同期X轴的数据
    weekMonthXData = [], // 上月或上周的同期数据
    symbol, // 货币
  } = params;
  const data1 = param[0]; // 同期第一个数据
  const axisValue = Number(data1.axisValue);
  const xDate = moment(axisValue).format('YYYY-MM-DD'); // X轴的日期
  const dataIndex = data1.dataIndex; // 当前鼠标移动到哪一个值上
  // console.log(param);

  let html1 = '',
    html2 = '',
    html3 = '';
  param.forEach(item => {
    const seriesName = item.seriesName;
    const color = item.color;
    let fillNumber = 0; // 填充位数
    
    if (seriesName.indexOf('上年同期') !== -1){
      const name = seriesName.substr(4);
      const english = handleChiese(name, true);
      fillNumber = isFillField(name) ? 2 : 0;
      const value = lineChartSymbol(english, item.value, symbol, fillNumber);
      let date = lastYearXData[dataIndex];
      date = moment(Number(date)).format('YYYY-MM-DD');

      if (date === '1970-01-01') {
        return;
      }
      if (html2 === '') {
        html2 += `<p class="title">${date}</p>`;
      }
      html2 += `<p class="data">
        <i class="icon" style="background-color: ${color}"></i>
          ${name}：
          <span class="number">${value}</span>
      </p>`;
    } else if (
      seriesName.indexOf('上月同期') !== -1 
      || seriesName.indexOf('上周同期') !== -1 
    ) {
      const name = seriesName.substr(4);
      const english = handleChiese(name, true);
      fillNumber = isFillField(name) ? 2 : 0;
      const value = lineChartSymbol(english, item.value, symbol, fillNumber);
      let date = weekMonthXData[dataIndex];
      console.log('else if', name);
      date = moment(Number(date)).format('YYYY-MM-DD');
      if (date === '1970-01-01' || date === 'Invalid date') {
        return;
      }
      if (html3 === '') {
        html3 += `<p class="title">${date}</p>`;
      }
      html3 += `
        <p class="data">
          <i class="icon" style="background-color: ${color}"></i>
            ${name}：
            <span class="number">${value}</span>
        </p>`;
    } else {
      if (html1 === '') {
        html1 += `<p class="title">${xDate}</p>`;
      }

      const english = handleChiese(seriesName, true);
      fillNumber = isFillField(seriesName) ? 2 : 0;
      const value = lineChartSymbol(english, item.value, symbol, fillNumber);
      html1 += `
      <p class="data">
        <i class="icon" style="background-color: ${color}"></i>
          ${seriesName}：
          <span class="number">${value}</span>
      </p>`;
    }
  });

  if (html1 !== '') {
    html1 = `<div class="layout-div layout-div1">${html1}</div>`;
  }
  if (html2 !== '') {
    html2 = `<div class="layout-div layout-div2">${html2}</div>`;
  }

  if (html3 !== '') {
    html3 = `<div class="layout-div layout-div3">${html3}</div>`;
  }

  return `<div class="asin-b2b-line-charts-tooltip">
    ${html1}
    ${html2}
    ${html3}
  </div>`;
}


/**
 * 处理豆腐块的数据
 * data: 类型的数据
 * lastData: 类型的上期数据
 * ratio: 环比的数据
 */
// eslint-disable-next-line
export function handleDouFu(arr: AsinB2B.IDouFuListTyep[], data: any = {}) {
  arr.forEach(item => {
    const type = item.label;
    switch (type) {
    case 'B2B销售额':
      item.data = data.sales;
      item.lastData = data.previousSales;
      item.ratio = data.ratioSales;
      break;
    case 'B2B订单量':
      item.data = data.orderQuantity;
      item.lastData = data.previousOrderQuantity;
      item.ratio = data.ratioOrderQuantity;
      break;
    case 'B2B销量':
      item.data = data.salesQuantity;
      item.lastData = data.previousSalesQuantity;
      item.ratio = data.ratioSalesQuantity;
      break;
    case 'B2B平均售价':
      item.data = data.avgPrice;
      item.lastData = data.previousAvgPrice;
      item.ratio = data.ratioAvgPrice;
      break;
    case 'B2B平均客单价':
      item.data = data.pct;
      item.lastData = data.previousPct;
      item.ratio = data.ratioPct;
      break;
    case 'B2B销量/订单量':
      item.data = data.salesQuantityDivOrderQuantity;
      item.lastData = data.previousSalesQuantityDivOrderQuantity;
      item.ratio = data.ratioSalesQuantityDivOrderQuantity;
      break;
    case 'B2B销售额占比':
      item.data = data.percentageB2bSales;
      item.lastData = data.previousPercentageB2bSales;
      item.ratio = data.ratioPercentageB2bSales;
      break;
    default:
      // 
    }
  });
  return arr;
}

// 将echarts tooltip的提示框入限制在容器内
export function tooltipPosition(// eslint-disable-line
  pos: number[], // tooltip的pos参数
  sizes: { // tooltip的size参数
    viewSize: number[];
    contentSize: number[];
  },
  restrict: {
    minX?: number; // 限定X轴坐标最小值(预留，逻辑没写)
    minY?: number; // 限定Y轴坐标最小值
    maxX?: number; // 限定X轴坐标最大值(预留，逻辑没写)
    maxY?: number; // 限定Y轴坐标最大值
  } = {},
) {
  
  const mouseX = pos[0]; // 鼠标在容器X轴坐标
  const mouseY = pos[1]; // 鼠标在容器Y轴坐标
  const tooltipWidth = sizes.contentSize[0]; // 提示框宽度
  const tooltipHeight = sizes.contentSize[1]; // 提示框高度
  const boxWidth = sizes.viewSize[0]; // 容器宽度
  const boxHeight = sizes.viewSize[1]; // 容器高度
  let x = 0, y = 0; // 返回值的坐标

  const {
    minX = 0,
    minY = 0,
    maxX = boxWidth,
    maxY = boxHeight,
  } = restrict as {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  
  
  if (mouseX > (boxWidth - tooltipWidth)) {
    x = mouseX - tooltipWidth;
  } else {
    x = mouseX;

    if (x <= minX) {
      x = minX;
    }

    if (x >= maxX) {
      x = maxX;
    }
  }

  if (mouseY > (boxHeight - tooltipHeight)) {
    y = mouseY - tooltipHeight;
  } else {
    y = mouseY - (tooltipHeight / 2);

    if ( y <= minY) {
      y = minY;
    }
    
    if ( y >= maxY) {
      y = maxY;
    }
  }
  return [x, y];
}
