// 总结栏
import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { moneyFormat } from '@/utils/huang';
import Empty from '../components/Empty';

interface IProps {
  currency: string;
  total: AsinTable.IParentChildTotal;
}
export default (props: IProps) => {
  const {
    currency,
    total,
  } = props;
  const {
    totalSales,
    totalOrderQuantity,
    totalSalesQuantity,
    replyReviewRate,
    profit,
    profitRate,
    salesQuantityExceptOrderQuantity,
    avgSellingPrice,
    preferentialOrderQuantity,
    associateSales,
    pageView,
    session,
    pageViewExceptSession,
    conversionsRate,
    returnQuantity,
    returnRate,
    b2bSales,
    b2bSalesProportion,
    b2bSalesQuantity,
    b2bOrderQuantity,
    b2bSalesQuantityExceptOrderQuantity,
    b2bAvgSellingPrice,
    b2bAvgCustomerPrice,
  } = total;
  
  return <tr className={styles.summary}>
    <td className={classnames(styles.base)}></td>
    <td className={classnames(styles.base)} align="right">小计</td>
    <td className={classnames(styles.base)} align="right">
      {totalSales === null ? <Empty /> : currency + moneyFormat(totalSales, 2, ',', '.', false) }
    </td>
    <td className={classnames(styles.base)} align="center">
      {totalOrderQuantity === null ? <Empty /> : moneyFormat(totalOrderQuantity, 2, ',', '.', false) }
    </td>
    <td className={classnames(styles.base)} align="center">
      {totalSalesQuantity === null ? <Empty /> : moneyFormat(totalSalesQuantity, 2, ',', '.', false) }
    </td>
    <td className={classnames(styles.base)} align="center">
      {replyReviewRate === null ? <Empty /> : `${moneyFormat(replyReviewRate, 2, ',', '.', false)}%`}
    </td>
    <td className={classnames(styles.base)} align="right">
      {profit === null ? <Empty /> : currency + moneyFormat(profit, 2, ',', '.', false) }
    </td>
    <td className={classnames(styles.base)} align="center">
      {profitRate === null ? <Empty /> : `${moneyFormat(profitRate, 2, ',', '.', false)}%`}
    </td>
    <td className={classnames(styles.base)} align="center">
      {salesQuantityExceptOrderQuantity === null ? <Empty /> : salesQuantityExceptOrderQuantity}
    </td>
    <td className={classnames(styles.base)} align="right">
      {avgSellingPrice === null ? <Empty /> : currency + moneyFormat(avgSellingPrice, 2, ',', '.', false) }
    </td>
    <td className={classnames(styles.base)} align="center">
      {preferentialOrderQuantity === null ? <Empty /> : moneyFormat(preferentialOrderQuantity, 2, ',', '.', false)}
    </td>
    <td className={classnames(styles.base)} align="center">
      {associateSales === null ? <Empty /> : moneyFormat(associateSales, 2, ',', '.', false)}
    </td>
    <td className={classnames(styles.base)} align="center">
      {pageView === null ? <Empty /> : moneyFormat(pageView, 2, ',', '.', false)}
    </td>
    <td className={classnames(styles.base)} align="center">
      {session === null ? <Empty /> : moneyFormat(session, 2, ',', '.', false)}
    </td>
    <td className={classnames(styles.base)} align="center">
      {pageViewExceptSession === null ? <Empty /> : moneyFormat(pageViewExceptSession, 2, ',', '.', false)}
    </td>
    <td className={classnames(styles.base)} align="center">
      {conversionsRate === null ? <Empty /> : `${moneyFormat(conversionsRate, 2, ',', '.', false)}%`}
    </td>
    <td className={classnames(styles.base)} align="center">
      {returnQuantity === null ? <Empty /> : moneyFormat(returnQuantity, 2, ',', '.', false)}
    </td>
    <td className={classnames(styles.base)} align="center">
      {returnRate === null ? <Empty /> : `${moneyFormat(returnRate, 2, ',', '.', false)}%`}
    </td>
    <td className={classnames(styles.base)} align="center">
      <p>{b2bSales === null ? <Empty /> : currency + moneyFormat(b2bSales, 2, ',', '.', false) }</p>
      <p>{b2bSalesProportion === null ? <Empty /> : `${moneyFormat(b2bSalesProportion, 2, ',', '.', false)}%`}</p>
    </td>
    <td className={classnames(styles.base)} align="center">
      {b2bSalesQuantity === null ? <Empty /> : `${moneyFormat(b2bSalesQuantity, 2, ',', '.', false)}`}
    </td>
    <td className={classnames(styles.base)} align="center">
      {b2bOrderQuantity === null ? <Empty /> : `${moneyFormat(b2bOrderQuantity, 2, ',', '.', false)}`}
    </td>
    <td className={classnames(styles.base)} align="center">
      {b2bSalesQuantityExceptOrderQuantity === null ? <Empty /> : `${moneyFormat(b2bSalesQuantityExceptOrderQuantity, 2, ',', '.', false)}`}
    </td>
    <td className={classnames(styles.base)} align="center">
      {b2bAvgSellingPrice === null ? <Empty /> : `${moneyFormat(b2bAvgSellingPrice, 2, ',', '.', false)}`}
    </td>
    <td className={classnames(styles.base)} align="right">
      {b2bAvgCustomerPrice === null ? <Empty /> : currency + moneyFormat(b2bAvgCustomerPrice, 2, ',', '.', false) }
    </td>
  </tr>;
};
