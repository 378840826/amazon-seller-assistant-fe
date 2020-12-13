import React from 'react';
import { isEmptyObj } from '@/utils/huang';
import ShowData from '@/components/ShowData';

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
    couponOrderQuantity, // 优惠订单量
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
        <td align="right"><ShowData value={sales} isCurrency/></td>
        <td align="center"><ShowData value={orderQuantity} fillNumber={0}/></td>
        <td align="center"><ShowData value={salesQuantity} fillNumber={0}/></td>
        <td align="center"><ShowData value={couponOrderQuantity} fillNumber={0}/></td>
        <td align="right"><ShowData value={avgPrice} isCurrency/></td>
        <td align="right"><ShowData value={pct} isCurrency/></td>
        <td align="center"><ShowData value={salesQuantityDivOrderQuantity} /></td>
        <td align="center"><ShowData value={sessions} fillNumber={0}/></td>
        <td align="center">
          <ShowData value={takeRates} fillNumber={2}/>
          { takeRates === '' || takeRates === null ? '' : '%'}
        </td>
        <td align="center"><ShowData value={pageView} fillNumber={0}/></td>
        <td align="center"><ShowData value={pageViewsDivSessions} fillNumber={2}/></td>
        <td align="center">
          <ShowData value={relatedSalesFrequency} fillNumber={0}/>
        </td>
      </tr>
    );
  }
  return <tr><td></td></tr>;
};


export default Total;
