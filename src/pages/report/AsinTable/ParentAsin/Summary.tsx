// 总结栏
import React from 'react';
import styles from './index.less';
import commonStyles from '../commonStyles.less';
import classnames from 'classnames';
import { moneyFormat } from '@/utils/huang';
import Empty from '../components/Empty';
import { parentsprs } from './config';
import ShowData from '@/components/ShowData';

interface IProps {
  total: AsinTable.IParentChildTotal;
  parentCustomcol: {};
}
export default (props: IProps) => {
  const {
    total,
    parentCustomcol,
  } = props;

  // 自定义列
  const selectCustomCol: string[] = []; // 当前选中的自定义列
  const other: string[] = ['childAsin']; // 这些列不在自定义列中
  // childCustomcol是Object[],需要转换一下
  for (const key in parentCustomcol) {
    const item = parentCustomcol[key];
    selectCustomCol.push(...item);
  }
  selectCustomCol.push(...other);

  const {
    totalSales,
    totalOrderQuantity,
    totalSalesQuantity,
    replyReviewRate,
    profit,
    profitRate,
    salesQuantityExceptOrderQuantity,
    avgSellingPrice,
    avgCustomerPrice,
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

  const summary = [
    {
      dataIndex: 'childAsin',
      component: <td className={classnames(
        styles.base,
        styles.summaryChildAsin,
        selectCustomCol.indexOf('sku') === -1 ? 'ant-table-cell-fix-left-last' : '',
      )} key="0" >
        {selectCustomCol.indexOf(parentsprs[1]) === -1 ? <span className={styles.text}>小计</span> : ''}
      </td>,
    },
    {
      dataIndex: 'sku',
      component: <td className={classnames(
        styles.base,
        styles.summarySku,
        selectCustomCol.indexOf('sku') === -1 ? '' : 'ant-table-cell-fix-left-last',
      )} key="1">
        {selectCustomCol.indexOf(parentsprs[1]) > -1 ? <span className={styles.text}>小计</span> : ''}
      </td>,
    },
    {
      dataIndex: 'totalSales',
      component: <td className={classnames(styles.base, commonStyles.tdTextRight)} align="right" key="2">
        <ShowData value={totalSales} isCurrency isMoney />
      </td>,
    },
    {
      dataIndex: 'totalOrderQuantity',
      component: <td className={classnames(styles.base)} align="center" key="3">
        {totalOrderQuantity === null ? <Empty /> : moneyFormat(totalOrderQuantity, 2, ',', '.', false) }
      </td>,
    },
    {
      dataIndex: 'totalSalesQuantity',
      component: <td className={classnames(styles.base)} align="center" key="4">
        {totalSalesQuantity === null ? <Empty /> : moneyFormat(totalSalesQuantity, 2, ',', '.', false) }
      </td>,
    },
    {
      dataIndex: 'replyReviewRate',
      component: <td className={classnames(styles.base)} align="center" key="5">
        {replyReviewRate === null ? <Empty /> : `${moneyFormat(replyReviewRate, 2, ',', '.', true)}%`}
      </td>,
    },
    {
      dataIndex: 'profit',
      component: <td className={classnames(styles.base, commonStyles.tdTextRight)} align="right" key="6">
        <ShowData value={profit} isCurrency isMoney />
      </td>,
    },
    {
      dataIndex: 'profitRate',
      component: <td className={classnames(styles.base)} align="center" key="7">
        {profitRate === null ? <Empty /> : `${moneyFormat(profitRate, 2, ',', '.', true)}%`}
      </td>,
    },
    {
      dataIndex: 'salesQuantityExceptOrderQuantity',
      component: <td className={classnames(styles.base)} align="center" key="8">
        {salesQuantityExceptOrderQuantity === null ? <Empty /> : moneyFormat(salesQuantityExceptOrderQuantity, 2, ',', '.', true)}
      </td>,
    },
    {
      dataIndex: 'avgSellingPrice',
      component: <td className={classnames(styles.base, commonStyles.tdTextRight)} align="right" key="9">
        <ShowData value={avgSellingPrice} isCurrency isMoney />
      </td>,
    },
    {
      dataIndex: 'avgCustomerPrice',
      component: <td className={classnames(styles.base, commonStyles.tdTextRight,)} align="right" key="10">
        <ShowData value={avgCustomerPrice} isCurrency isMoney />
      </td>,
    },
    {
      dataIndex: 'preferentialOrderQuantity',
      component: <td className={classnames(styles.base)} align="center" key="11">
        {preferentialOrderQuantity === null ? <Empty /> : moneyFormat(preferentialOrderQuantity, 2, ',', '.', false)}
      </td>,
    },
    {
      dataIndex: 'associateSales',
      component: <td className={classnames(styles.base)} align="center" key="12">
        {associateSales === null ? <Empty /> : moneyFormat(associateSales, 2, ',', '.', false)}
      </td>,
    },
    {
      dataIndex: 'pageView',
      component: <td className={classnames(styles.base)} align="center" key="13">
        {pageView === null ? <Empty /> : moneyFormat(pageView, 2, ',', '.', false)}
      </td>,
    },
    {
      dataIndex: 'session',
      component: <td className={classnames(styles.base)} align="center" key="14">
        {session === null ? <Empty /> : moneyFormat(session, 2, ',', '.', false)}
      </td>,
    },
    {
      dataIndex: 'pageViewExceptSession',
      component: <td className={classnames(styles.base)} align="center" key="15">
        {pageViewExceptSession === null ? <Empty /> : moneyFormat(pageViewExceptSession, 2, ',', '.', true)}
      </td>,
    },
    {
      dataIndex: 'conversionsRate',
      component: <td className={classnames(styles.base)} align="center" key="16">
        {conversionsRate === null ? <Empty /> : `${moneyFormat(conversionsRate, 2, ',', '.', true)}%`}
      </td>,
    },
    {
      dataIndex: 'returnQuantity',
      component: <td className={classnames(styles.base)} align="center" key="17">
        {returnQuantity === null ? <Empty /> : moneyFormat(returnQuantity, 2, ',', '.', false)}
      </td>,
    },
    {
      dataIndex: 'returnRate',
      component: <td className={classnames(styles.base)} align="center" key="18">
        {returnRate === null ? <Empty /> : `${moneyFormat(returnRate, 2, ',', '.', true)}%`}
      </td>,
    },
    {
      dataIndex: 'b2bSales',
      component: <td className={classnames(styles.base)} align="center" key="19">
        <p>
          <ShowData value={b2bSales} isCurrency isMoney />
        </p>
        
        <p>{b2bSalesProportion === null ? <Empty /> : `${moneyFormat(b2bSalesProportion, 2, ',', '.', true)}%`}</p>
      </td>,
    },
    {
      dataIndex: 'b2bOrderQuantity',
      component: <td className={classnames(styles.base)} align="center" key="21">
        {b2bOrderQuantity === null ? <Empty /> : `${moneyFormat(b2bOrderQuantity, 2, ',', '.', false)}`}
      </td>,
    },
    {
      dataIndex: 'b2bSalesQuantity',
      component: <td className={classnames(styles.base)} align="center" key="20">
        {b2bSalesQuantity === null ? <Empty /> : `${moneyFormat(b2bSalesQuantity, 2, ',', '.', false)}`}
      </td>,
    },
    {
      dataIndex: 'b2bSalesQuantityExceptOrderQuantity',
      component: <td className={classnames(styles.base)} align="center" key="22">
        {b2bSalesQuantityExceptOrderQuantity === null ? <Empty /> : `${moneyFormat(b2bSalesQuantityExceptOrderQuantity, 2, ',', '.', true)}`}
      </td>,
    },
    {
      dataIndex: 'b2bAvgSellingPrice',
      component: <td className={classnames(styles.base, commonStyles.tdTextRight)} align="right" key="23">
        <ShowData value={b2bAvgSellingPrice} isCurrency isMoney />
      </td>,
    },
    {
      dataIndex: 'b2bAvgCustomerPrice',
      component: <td className={classnames(styles.base, commonStyles.tdTextRight,)} align="right" key="24">
        <ShowData value={b2bAvgCustomerPrice} isCurrency isMoney />
      </td>,
    },
  ];

  const newColumns = [];
  for (let i = 0; i < summary.length; i++){
    const items = summary[i];
    // -1 就是没有，没有就应该隐藏
    if (selectCustomCol.indexOf(items.dataIndex) !== -1) {
      newColumns.push(items.component);
    }
  }
  return <tr className={styles.summary}>{[...newColumns]}</tr>;
};
