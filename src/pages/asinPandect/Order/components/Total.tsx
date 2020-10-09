import React from 'react';
import { isEmptyObj } from '@/utils/huang';

interface IProps {
  obj: AsinOrder.ITotalType;
  symbol: string;
  req: {}; // 请求参数
}

const Total: React.FC<IProps> = (props) => {
  const {
    obj = {},
    symbol = '',
  } = props;
  const {
    sales, // 销售额
    orderQuantity, // 订单量
    salesQuantity, // 销量
    couponOrderQuantity, // 销量
    avgPrice, // 平均售价量
    pct, // 客单量
    salesQuantityDivOrderQuantity, // 销量/订单量
    sessions, // 销量/订单量
    takeRates, // 转化率
    pageView, // pageView
    pageViewsDivSessions, // PageView/Session
    relatedSalesFrequency, // 关联销售次数
  } = obj as AsinOrder.ITotalType;
  if (!isEmptyObj(obj)) {
    return (
      <tr>
        <td align="center" style={{
          color: '#222',
        }}>总计</td>
        <td align="right">{symbol}{sales}</td>
        <td align="center">{orderQuantity}</td>
        <td align="center">{salesQuantity}</td>
        <td align="center">{couponOrderQuantity}</td>
        <td align="right">{symbol}{avgPrice}</td>
        <td align="right">{symbol}{pct}</td>
        <td align="center">{salesQuantityDivOrderQuantity}</td>
        <td align="center">{sessions}</td>
        <td align="center">{takeRates}%</td>
        <td align="center">{pageView}</td>
        <td align="center">{pageViewsDivSessions}</td>
        <td align="center">
          {relatedSalesFrequency || ''}
        </td>
      </tr>
    );
  }
  return <tr><td></td></tr>;
};


export default Total;
