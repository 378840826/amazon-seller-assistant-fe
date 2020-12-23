/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-07-09 11:05:55
 * @FilePath: \amzics-react\src\pages\asinPandect\ReturnProduct\function.ts
 */
import { moneyFormat } from '@/utils/huang';
import moment from 'moment';
import { storage } from '@/utils/utils';

/**
 * 处理折线图tooltip提示
 * @param datas echarts返回的数据
 */
export function handleTooltip(datas: ReturnProduct.ITooltip[]) {
  if (Array.isArray(datas)) {
    const { axisValueLabel } = datas[0];
    const date = moment(axisValueLabel).format('YYYY-MM-DD');
    
    if (datas[0] && datas[1]) {
      const { seriesName: s1, data: d1, color: c1 } = datas[0] || {};
      const { seriesName: s2, data: d2, color: c2 } = datas[1] || {};
      console.log(moneyFormat(d2, 2));

      return `<div class="echarts-line-tooltip">
        <p class="title">${date}</p>
        <p class="detail">
          <span class="icon" style="background-color:${c1}"></span>
          ${s1}：
          <span class="money">${moneyFormat(d1)}</span>
        </p>
        <p class="detail">
          <span class="icon" style="background-color:${c2}"></span>
          ${s2}：
          <span class="money">${moneyFormat(d2, 2)}%</span>
        </p>
      </div>`;
    } else if (datas[0]) {
      const { seriesName: s1, data: d1, color: c1 } = datas[0] || {};
      return `<div class="echarts-line-tooltip">
        <p class="title">${date}</p>
        <p class="detail">
          <span class="icon" style="background-color:${c1}"></span>
          ${s1}：
          <span class="money">${moneyFormat(d1)}</span>
        </p>
      </div>`;
    } else if (datas[1]) {
      const { seriesName: s2, data: d2, color: c2 } = datas[1] || {};
      return `<div class="echarts-line-tooltip">
        <p class="title">${date}</p>
        <p class="detail">
          <span class="icon" style="background-color:${c2}"></span>
          ${s2}：
          <span class="money">${moneyFormat(d2, 2)}%</span>
        </p>
      </div>`;
    }
  }
  return '数据错误！';
}

/**
 * 将日期参数转换成后端想要的参数
 * 周期类型：{1代表最近7天，2代表最近30天，3代表最近60天，4代表最近90天，5代表最近180天，6代表最近365天，7代表今年，8代表上年}
 * 
 * 按月/周查看传dateStart dateEnd
 */
export function geDateFields(val: string, key: string) {
  const newVal = Number(val);
  const result = {
    cycle: 0,
  };
  if (isNaN(newVal)) {
    if (val === 'year') {
      result.cycle = 7;
      return result;
    } else if (val === 'lastYear') {
      result.cycle = 8;
      return result;
    }
    const {
      startDate,
      endDate,
    } = storage.get(`${key}_date`);
    return {
      startTime: startDate,
      endTime: endDate,
    };
  } 
  switch (newVal) {
  case 7:
    result.cycle = 1;
    break;
  case 30:
    result.cycle = 2;
    break;
  case 60:
    result.cycle = 3;
    break;
  case 90:
    result.cycle = 4;
    break;
  case 180:
    result.cycle = 5;
    break;
  case 365:
    result.cycle = 6;
    break;
  default: 
    //
  }
  return result;
}
