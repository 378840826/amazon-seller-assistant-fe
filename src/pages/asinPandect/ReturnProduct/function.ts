/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-07-09 11:05:55
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinPandect\returnProduct\function.ts
 */
import { moneyFormat } from '@/utils/huang';
import moment from 'moment';

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
          <span class="money">${moneyFormat(d2)}%</span>
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
          <span class="money">${moneyFormat(d2)}%</span>
        </p>
      </div>`;
    }
  }
  return '数据错误！';
}
