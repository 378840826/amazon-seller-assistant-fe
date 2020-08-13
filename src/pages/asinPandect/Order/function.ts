/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-07-24 14:48:07
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinPandect\Order\function.ts
 */ 
import moment from 'moment';

/**
 * 处理豆腐块的数据
 * data: 类型的数据
 * lastData: 类型的上期数据
 * ratio: 环比的数据
 */
// eslint-disable-next-line
export function handleDouFu(arr: AsinOrder.IDouFuListTyep[], data: any = {}) {
  arr.forEach(item => {
    const type = item.label;
    switch (type) {
    case '销售额':
      item.data = data.sales;
      item.lastData = data.previousSales;
      item.ratio = data.ratioSales;
      break;
    case '订单量':
      item.data = data.orderQuantity;
      item.lastData = data.previousOrderQuantity;
      item.ratio = data.ratioOrderQuantity;
      break;
    case '销量':
      item.data = data.salesQuantity;
      item.lastData = data.previousSalesQuantity;
      item.ratio = data.ratioSalesQuantity;
      break;
    case 'Session':
      item.data = data.sessions;
      item.lastData = data.previousSession;
      item.ratio = data.ratioSession;
      break;
    case '转化率':
      item.data = data.takeRates;
      item.lastData = data.previousTakeRates;
      item.ratio = data.ratioTakeRates;
      break;
    case '优惠订单':
      item.data = data.couponOrderQuantity;
      item.lastData = data.previousCouponOrderQuantity;
      item.ratio = data.ratioCouponOrderQuantity;
      break;
    case '平均售价':
      item.data = data.avgPrice;
      item.lastData = data.previousAvgPrice;
      item.ratio = data.ratioAvgPrice;
      break;
    case '平均客单价':
      item.data = data.pct;
      item.lastData = data.previousPct;
      item.ratio = data.ratioPct;
      break;
    case '销量/订单量':
      item.data = data.salesQuantityDivOrderQuantity;
      item.lastData = data.previousSalesQuantityDivOrderQuantity;
      item.ratio = data.ratioSalesQuantityDivOrderQuantity;
      break;
    case '关联销售':
      item.data = data.relatedSalesFrequency;
      item.lastData = data.previousRelatedSalesFrequency;
      item.ratio = data.ratioRelatedSalesFrequency;
      break;
    case 'PageView':
      item.data = data.pageViews;
      item.lastData = data.previousPageViews;
      item.ratio = data.ratioPageViews;
      break;
    case 'PageView/Session':
      item.data = data.pageViewsDivSessions;
      item.lastData = data.previousPageViewsDivSessions;
      item.ratio = data.ratioPageViewsDivSessions;
      break;
    default:
      // 
    }
  });
  return arr;
}

/**
 * 后端的字段转成中文显示
 * 或将中文转换成英文
 * @param value 
 * @param toChs 
 */
export function handleChiese(value: string, flag = false): string {
  if (flag) {
    switch (value) {
    case '订单量':
      return 'orderQuantity';
    case '销量':
      return 'salesQuantity';
    case 'Session':
      return 'session';
    case '优惠订单':
      return 'couponOrderQuantity';
    case '关联销售':
      return 'relatedSalesFrequency';
    case 'PageView':
      return 'pageViews';
    case 'PageView/Session':
      return 'pageViewsDivSessions';
    case '销量/订单量':
      return 'salesQuantityDivOrderQuantity';
    case '销量额':
      return 'sales';
    case '平均售价':
      return 'avgPrice';
    case '平均客单价':
      return 'pct';
    case '转化率':
      return 'takeRates';
    default:
      return '';
    }
  }

  switch (value) {
  case 'orderQuantity':
    return '订单量';
  case 'salesQuantity':
    return '销量';
  case 'session':
    return 'Session';
  case 'couponOrderQuantity':
    return '优惠订单';
  case 'relatedSalesFrequency':
    return '关联销售';
  case 'pageViews':
    return 'PageView';
  case 'pageViewsDivSessions':
    return 'PageView/Session';
  case 'salesQuantityDivOrderQuantity':
    return '销量/订单量';
  case 'sales':
    return '销量额';
  case 'avgPrice':
    return '平均售价';
  case 'pct':
    return '平均客单价';
  case 'takeRates':
    return '转化率';
  default:
    return '';
  }
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

// 各个指标的符号
export function lineChartSymbol(type: string, value = '', symbol = '') {
  switch (type) {
  case 'orderQuantity':
    return value;
  case 'salesQuantity':
    return value;
  case 'session':
    return value;
  case 'couponOrderQuantity':
    return value;
  case 'relatedSalesFrequency':
    return value;
  case 'pageViews':
    return value;
  case 'pageViewsDivSessions':
    return value;
  case 'salesQuantityDivOrderQuantity':
    return value;
  case 'sales':
    return symbol + value;
  case 'avgPrice':
    return symbol + value;
  case 'pct':
    return symbol + value;
  case 'takeRates':
    return `${value}%`;
  default:
    return '';
  }
}

export function handleLineCahrtTooltip(params: {
  param: AsinOrder.ILineChartsTooltip[]; 
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
    html3 = '',
    temsku = '';
  param.forEach(item => {
    const seriesName = item.seriesName;
    const color = item.color;
    
    if (seriesName.indexOf('上年同期') !== -1){
      const name = seriesName.substr(4);
      const english = handleChiese(name, true);
      const value = lineChartSymbol(english, item.value, symbol);
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
      const value = lineChartSymbol(english, item.value, symbol);
      let date = weekMonthXData[dataIndex];
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
      if (seriesName.indexOf('-SKU-') !== -1) {
        const arr = seriesName.split('-SKU-');
        const name = arr[0];
        const english = handleChiese(name, true);
        const value = lineChartSymbol(english, item.value, symbol);
        if (temsku === '') {
          html1 += `<p class="sku-title">${arr[1]}</p>`;
          temsku = arr[1];
        } else {
          if (temsku !== arr[1]) {
            html1 += `<p class="sku-title">${arr[1]}</p>`;
            temsku = arr[1];
          }
        }
        html1 += `
        <p class="data">
          <i class="icon" style="background-color: ${color}"></i>
            ${name}：
            <span class="number">${value || '-'}</span>
        </p>`;
      } else {
        const english = handleChiese(item.seriesName, true);
        const value = lineChartSymbol(english, item.value, symbol);
        html1 += `
        <p class="data">
          <i class="icon" style="background-color: ${color}"></i>
            ${seriesName}：
            <span class="number">${value}</span>
        </p>`;
      }
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
  
  return `<div class="asin-order-line-charts-tooltip">
    ${html1}
    ${html2}
    ${html3}
  </div>`;
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

// 豆腐默认的数据
export const douFuDefaultList = [
  {
    label: '销售额',
    value: 'sales',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: '订单量',
    value: 'orderQuantity',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: '销量',
    value: 'salesQuantity',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: '关联销售',
    value: 'relatedSalesFrequency',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: 'Session',
    value: 'sessions',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: '转化率',
    value: 'takeRates',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: '平均售价',
    value: 'avgPrice',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: '平均客单价',
    value: 'pct',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: '销量/订单量',
    value: 'salesQuantityDivOrderQuantity',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: '优惠订单',
    value: 'couponOrderQuantity',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: 'PageView',
    value: 'pageViews',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
  {
    label: 'PageView/Session',
    value: 'pageViewsDivSessions',
    show: true,
    data: 0,
    lastData: 0,
    ratio: 0,
  },
];
