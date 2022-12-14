import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { moneyFormat } from '@/utils/huang';
import classnames from 'classnames';


interface IProps {
  data: AsinTable.IChildSummaryType|null;
  childCustomcol: {};
}
import Empty from '../../components/Empty';
import ShowData from '@/components/ShowData';

const Summary: React.FC<IProps> = (props) => {
  const {
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
  
  // eslint-disable-next-line
  const selectCustomCol: string[] = []; // 当前选中的自定义列
  const other = ['productCol', 'handle']; // 这些列不在自定义列中
  // childCustomcol是Object[],需要转换一下
  for (const key in childCustomcol) {
    const item = childCustomcol[key];
    selectCustomCol.push(...item);
  }
  selectCustomCol.push(...other);

  // eslint-disable-next-line
  const [skuasin, setSkukAsin] = useState<string>(''); // SKU、父ASIN这两列是否隐藏了

  // eslint-disable-next-line
  useEffect(() => { 
    /**
     * 有3种情况
     * SKU隐藏
     * 父ASIN隐藏
     * 或两列都隐藏
     */

    if (selectCustomCol.indexOf('skuInfo') === -1 && selectCustomCol.indexOf('parentAsin') === -1) {
      // 两列都隐藏了
      setSkukAsin('all');
    } else if (selectCustomCol.indexOf('skuInfo') === -1) {
      // sku列隐藏了
      setSkukAsin('sku');
    } else if (selectCustomCol.indexOf('parentAsin') === -1) {
      // 父ASIN列隐藏了
      setSkukAsin('asin');
    } else {
      setSkukAsin('');
    }
  }, [selectCustomCol, childCustomcol]);


  const summary = [
    {
      dataIndex: 'productCol',
      component: <td className={classnames(
        styles.title, 
        styles.productColSummary,
        skuasin === 'all' ? 'ant-table-cell-fix-left-last' : ''
      )} key="0">合计</td>,
      fixed: 'left',
    },
    {
      dataIndex: 'skuInfo',
      component: <td className={classnames(
        styles.title, 
        styles.skuInfoSummary,
        skuasin === 'asin' ? 'ant-table-cell-fix-left-last' : ''
      )} style={{
        left: (skuasin === 'asin') ? (230) : (skuasin === '' ? 230 : '') , // eslint-disable-line
      }} key="1"></td>,
      fixed: 'left',
    },
    {
      dataIndex: 'parentAsin',
      component: <td className={classnames(
        styles.title, 
        styles.parentAsinSummary,
        skuasin === 'sku' || skuasin === '' ? 'ant-table-cell-fix-left-last' : ''
      )} style={{
        left: skuasin === 'sku' ? 230 : (skuasin === '' ? 430 : ''), // eslint-disable-line
      }} key="2"></td>,
      fixed: 'left',
    },
    {
      dataIndex: 'reviewNum',
      component: <td className={styles.title} key="3"></td>,
    },
    {
      dataIndex: 'reviewScore',
      component: <td className={styles.title} key="4"></td>,
    },
    {
      dataIndex: 'totalSales',
      component: <td className={styles.right} key="5">
        <ShowData value={totalSales} isCurrency isMoney/>
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
        {replyReviewRate !== null ? `${moneyFormat(replyReviewRate, 2, ',', '.', true)}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'profit',
      component: <td className={styles.right} key="9">
        <ShowData value={profit} isCurrency isMoney/>
      </td>,
    },
    {
      dataIndex: 'profitRate',
      component: <td className={styles.center} key="10">
        {profitRate !== null ? `${moneyFormat(profitRate, 2, ',', '.', true)}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'salesQuantityExceptOrderQuantity',
      component: <td className={styles.center} key="11">
        {salesQuantityExceptOrderQuantity !== null ? 
          `${moneyFormat(salesQuantityExceptOrderQuantity, 2, ',', '.', true)}` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'avgSellingPrice',
      component: <td className={styles.right} key="12">
        <ShowData value={avgSellingPrice} isCurrency isMoney/>
      </td>,
    },
    {
      dataIndex: 'avgCustomerPrice',
      component: <td className={styles.right} key="13">
        <ShowData value={avgCustomerPrice} isCurrency isMoney/>
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
        {pageViewExceptSession !== null ? moneyFormat(pageViewExceptSession, 2, ',', '.', true) : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'conversionsRate',
      component: <td className={styles.center} key="19">
        {conversionsRate !== null ? `${moneyFormat(conversionsRate, 2, ',', '.', true)}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'returnQuantity',
      component: <td className={styles.center} key="20">
        {returnQuantity !== null ? returnQuantity : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'returnRate',
      component: <td className={styles.center} key="21">
        {returnRate !== null ? `${moneyFormat(returnRate, 2, ',', '.', true)}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'b2bSales',
      component: <td className={styles.center} key="22">
        <ShowData value={b2bSales} isCurrency isMoney/>
      </td>,
    },
    {
      dataIndex: 'b2bOrderQuantity',
      component: <td className={styles.center} key="23">
        {b2bOrderQuantity !== null ? b2bOrderQuantity : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'b2bSalesQuantity',
      component: <td className={styles.center} key="24">
        {b2bSalesQuantity !== null ? b2bSalesQuantity : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'b2bSalesQuantityExceptOrderQuantity',
      component: <td className={styles.center} key="25">
        {
          b2bSalesQuantityExceptOrderQuantity !== null ? 
            moneyFormat(b2bSalesQuantityExceptOrderQuantity, 2, ',', '.', true) : <Empty/>
        }
      </td>,
    },
    {
      dataIndex: 'b2bAvgSellingPrice',
      component: <td className={styles.right} key="26">
        <ShowData value={b2bAvgSellingPrice} isCurrency isMoney/> 
      </td>,
    },
    {
      dataIndex: 'b2bAvgCustomerPrice',
      component: <td className={styles.right} key="27">
        <ShowData value={b2bAvgCustomerPrice} isCurrency isMoney/> 
      </td>,
    },
    {
      dataIndex: 'adAsinAdTypeStatistics',
      component: <td key="28"></td>,
    },
    {
      dataIndex: 'adSales',
      component: <td className={styles.right} key="29">
        <ShowData value={adSales} isCurrency isMoney/> 
      </td>,
    },
    {
      dataIndex: 'skuAdSales',
      component: <td className={styles.center} key="30">
        <ShowData value={skuAdSales} isCurrency isMoney/>  
      </td>,
    },
    {
      dataIndex: 'naturalSales',
      component: <td className={styles.center} key="31">
        <ShowData value={naturalSales} isCurrency isMoney/>  
      </td>,
    },
    {
      dataIndex: 'adOrderQuantity',
      component: <td className={styles.center} key="32">
        {adOrderQuantity !== null ? adOrderQuantity : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'skuAdOrderQuantity',
      component: <td className={styles.center} key="33">
        {skuAdOrderQuantity !== null ? skuAdOrderQuantity : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'naturalOrderQuantity',
      component: <td className={styles.center} key="34">
        {naturalOrderQuantity !== null ? naturalOrderQuantity : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'cpc',
      component: <td className={styles.center} key="35">
        <ShowData value={cpc} isCurrency isMoney/> 
      </td>,
    },
    {
      dataIndex: 'spend',
      component: <td className={styles.right} key="36">
        <ShowData value={spend} isCurrency isMoney/> 
      </td>,
    },
    {
      dataIndex: 'acos',
      component: <td className={styles.center} key="37">
        {acos !== null ? `${moneyFormat(acos, 2, ',', '.', true)}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'compositeAcos',
      component: <td className={styles.center} key="38">
        {compositeAcos !== null ? `${moneyFormat(compositeAcos, 2, ',', '.', true)}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'roas',
      component: <td className={styles.center} key="39">
        {roas !== null ? moneyFormat(roas, 2, ',', '.', true) : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'compositeRoas',
      component: <td className={styles.center} key="40">
        {compositeRoas !== null ? moneyFormat(compositeRoas, 2, ',', '.', true) : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'impressions',
      component: <td className={styles.center} key="41">
        {impressions !== null ? impressions : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'clicks',
      component: <td className={styles.center} key="42">
        {clicks !== null ? clicks : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'ctr',
      component: <td className={styles.center} key="43">
        {ctr !== null ? `${moneyFormat(ctr, 2, ',', '.', true)}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'adConversionsRate',
      component: <td className={styles.center} key="44">
        {adConversionsRate !== null ? `${moneyFormat(adConversionsRate, 2, ',', '.', true)}%` : <Empty/>}
      </td>,
    },
    {
      dataIndex: 'handle',
      component: <td className={classnames(styles.title, styles.handleFixed, 'ant-table-cell-fix-right ant-table-cell-fix-right-first')} key="45"></td>,
    },
  ];

  // 自定义列
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
