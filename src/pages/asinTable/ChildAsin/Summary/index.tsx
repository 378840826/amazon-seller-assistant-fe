import React from 'react';
import styles from './index.less';
import { moneyFormat } from '@/utils/huang';


interface IProps {
  symbol: string;
  data: AsinTable.IChildSummaryType|null;
  childCustomcol: {};
}
import Empty from '../../components/Empty';

const Summary: React.FC<IProps> = (props) => {
  const {
    symbol = '',
    data = {},
    childCustomcol,
  } = props;
  if (data === null) {
    return <tr>
      <td></td>
    </tr>;
  }
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
    b2bOrderQuantity,
    b2bSalesQuantity,
    b2bSalesQuantityExceptOrderQuantity,
    b2bAvgSellingPrice,
    b2bAvgCustomerPrice,
    adSales,
    skuAdSales,
    naturalSales,
    adOrderQuantity,
    skuAdOrderQuantity,
    naturalOrderQuantity,
    cpc,
    spend,
    acos,
    compositeAcos,
    roas,
    compositeRoas,
    impressions,
    clicks,
    ctr,
    adConversionsRate,
  } = data as AsinTable.IChildSummaryType;


  const summary = [
    {
      dataIndex: 'productCol',
      component: <td className={styles.title} key="0"></td>,
    },
    {
      dataIndex: 'skuInfo',
      component: <td className={styles.title} key="1"></td>,
    },
    {
      dataIndex: 'parentAsin',
      component: <td className={styles.title} key="2"></td>,
    },
    {
      dataIndex: 'reviewNum',
      component: <td className={styles.title} key="3"></td>,
    },
    {
      dataIndex: 'reviewScore',
      component: <td className={styles.title} key="4">合计</td>,
    },
    {
      dataIndex: 'totalSales',
      component: <td className={styles.right} key="5">
        {totalSales !== null ? symbol + moneyFormat(totalSales, 2, ',', '.', false) : <Empty/>} 
      </td>,
    },
    {
      dataIndex: 'totalOrderQuantity',
      component: <td className={styles.center} key="6">
        {totalOrderQuantity !== null ? totalOrderQuantity : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'totalSalesQuantity',
      component: <td className={styles.center} key="7">
        {totalSalesQuantity !== null ? totalSalesQuantity : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'replyReviewRate',
      component: <td className={styles.center} key="8">
        {replyReviewRate !== null ? `${replyReviewRate}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'profit',
      component: <td className={styles.right} key="9">
        {profit !== null ? symbol + moneyFormat(profit, 2, ',', '.', false) : <Empty/>} 
      </td>,
    },
    {
      dataIndex: 'profitRate',
      component: <td className={styles.center} key="10">
        {profitRate !== null ? `${profitRate}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'salesQuantityExceptOrderQuantity',
      component: <td className={styles.center} key="11">
        {salesQuantityExceptOrderQuantity !== null ? 
          `${salesQuantityExceptOrderQuantity}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'avgSellingPrice',
      component: <td className={styles.right} key="12">
        {avgSellingPrice !== null ? symbol + moneyFormat(avgSellingPrice, 2, ',', '.', false) : <Empty/>} 
      </td>,
    },
    {
      dataIndex: 'avgCustomerPrice',
      component: <td className={styles.right} key="13">
        {avgCustomerPrice !== null ? symbol + moneyFormat(avgCustomerPrice, 2, ',', '.', false) : <Empty/>} 
      </td>,
    },
    {
      dataIndex: 'preferentialOrderQuantity',
      component: <td className={styles.center} key="14">
        {preferentialOrderQuantity !== null ? preferentialOrderQuantity : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'associateSales',
      component: <td className={styles.center} key="15">
        {associateSales !== null ? associateSales : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'pageView',
      component: <td className={styles.center} key="16">
        {pageView !== null ? pageView : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'session',
      component: <td className={styles.center} key="17">
        {session !== null ? session : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'pageViewExceptSession',
      component: <td className={styles.center} key="18">
        {pageViewExceptSession !== null ? pageViewExceptSession : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'conversionsRate',
      component: <td className={styles.center} key="19">
        {conversionsRate !== null ? `${conversionsRate}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'handle',
      component: <td className={styles.title} key="46">handle</td>,
    },
  ];


  <tr className={styles.summary}>
    
    <td className={styles.center}>{returnQuantity !== null ? returnQuantity : <Empty/>}</td>
    <td className={styles.center}>{returnRate !== null ? `${returnRate}%` : <Empty/>}</td>
    <td className={styles.center}>
      {b2bSales !== null ? symbol + moneyFormat(b2bSales, 2, ',', '.', false) : <Empty/>} 
    </td>
    <td className={styles.center}>{b2bOrderQuantity !== null ? b2bOrderQuantity : <Empty/>}</td>
    <td className={styles.center}>{b2bSalesQuantity !== null ? b2bSalesQuantity : <Empty/>}</td>
    <td className={styles.center}>
      {
        b2bSalesQuantityExceptOrderQuantity !== null ? 
          b2bSalesQuantityExceptOrderQuantity : <Empty/>
      }
    </td>
    <td className={styles.right}>
      {b2bAvgSellingPrice !== null ? symbol + moneyFormat(b2bAvgSellingPrice, 2, ',', '.', false) : <Empty/>} 
    </td>
    <td className={styles.right}>
      {b2bAvgCustomerPrice !== null ? symbol + moneyFormat(b2bAvgCustomerPrice, 2, ',', '.', false) : <Empty/>} 
    </td>
    <td></td>
    <td className={styles.right}>
      {adSales !== null ? symbol + moneyFormat(adSales, 2, ',', '.', false) : <Empty/>} 
    </td>
    <td className={styles.center}>
      {skuAdSales !== null ? symbol + moneyFormat(skuAdSales, 2, ',', '.', false) : <Empty/>} 
    </td>
    <td className={styles.center}>
      {naturalSales !== null ? symbol + moneyFormat(naturalSales, 2, ',', '.', false) : <Empty/>} 
    </td>
    <td className={styles.center}>{adOrderQuantity !== null ? adOrderQuantity : <Empty/>}</td>
    <td className={styles.center}>{skuAdOrderQuantity !== null ? skuAdOrderQuantity : <Empty/>}</td>
    <td className={styles.center}>
      {naturalOrderQuantity !== null ? naturalOrderQuantity : <Empty/>}
    </td>
    <td className={styles.center}>
      {cpc !== null ? symbol + moneyFormat(cpc, 2, ',', '.', false) : <Empty/>} 
    </td>
    <td className={styles.center}>
      {spend !== null ? symbol + moneyFormat(spend, 2, ',', '.', false) : <Empty/>} 
    </td>
    <td className={styles.right}>{acos !== null ? acos : <Empty/>}</td>
    <td className={styles.right}>{compositeAcos !== null ? compositeAcos : <Empty/>}</td>
    <td className={styles.right}>{roas !== null ? roas : <Empty/>}</td>
    <td className={styles.right}>{compositeRoas !== null ? compositeRoas : <Empty/>}</td>
    <td className={styles.right}>{impressions !== null ? impressions : <Empty/>}</td>
    <td className={styles.right}>{clicks !== null ? clicks : <Empty/>}</td>
    <td className={styles.right}>{ctr !== null ? `${ctr}%` : <Empty/>}</td>
    <td className={styles.right}>
      {adConversionsRate !== null ? `${adConversionsRate}%` : <Empty/>}
    </td>
  </tr>;


  // 自定义列
  const selectCustomCol: string[] = []; // 当前选中的自定义列
  const other = ['productCol', 'handle']; // 这些列不在自定义列中
  // childCustomcol是Object[],需要转换一下
  for (const key in childCustomcol) {
    const item = childCustomcol[key];
    selectCustomCol.push(...item);
  }
  selectCustomCol.push(...other);

  const newColumns = [];
  for (let i = 0; i < summary.length; i++){
    const items = summary[i];
    // -1 就是没有，没有就应该隐藏
    if (selectCustomCol.indexOf(items.dataIndex) !== -1) {
      newColumns.push(items.component);
    }
  }

  return <tr>
    {[...newColumns]}
  </tr>;
};


export default Summary;
