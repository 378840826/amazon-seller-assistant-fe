import React from 'react';
import styles from './index.less';
import commonStyles from '../commonStyles.less';
import { moneyFormat } from '@/utils/huang';
import { getProductStatus } from '../config';

// 组件
import { Iconfont } from '@/utils/utils';
import notImg from '@/assets/stamp.png';
import TableHead from './TableHead';
import TableHead1 from './TableHead1';
import Deliver from '../components/Deliver';
import Empty from '../components/Empty';

import Summary from './Summary';
import {
  Tooltip,
  Table,
} from 'antd';


export const parentAsinCols = (props: AsinTable.IParentAsinColsProps) => {
  const {
    currency, // 货币符号
    order = '', // 正序或倒序
    sortCallback,
    parentCustomcol,
  } = props;

  const two = 80; // 2个字的列宽度
  const three = 95; // 3个字的列宽度、Spend、Clicks
  const four = 105; // 4个字的列宽度
  const outer1 = 110; // B2B销量
  const outer2 = 120; // B2B订单量
  const outer3 = 150; //  , 本SKU广告销售额、本SKU广告订单量
  // B2B销量/订单量、PageView/Session、B2B平均客单价、自然销售额、自然订单量
  const outer4 = 125; 
  const outer5 = 130; // B2B平均售价、


  // 自定义列
  const selectCustomCol: string[] = []; // 当前选中的自定义列
  const other: string[] = []; // 这些列不在自定义列中

  // parentCustomcol是Object[],需要转换一下
  for (const key in parentCustomcol) {
    const item = parentCustomcol[key];
    selectCustomCol.push(...item);
  }
  selectCustomCol.push(...other);
 

  // 子asin
  const childasinCol = {
    width: 198,
    title: '子ASIN',
    align: 'center',
    dataIndex: 'childAsin',
    className: styles.childAsinCol,
  };

  const style = {
    'float': 'right',
  };

  // sku
  const skuCol = {
    width: 186,
    title: 'SKU',
    align: 'center',
    dataIndex: 'sku',
    className: styles.skuCol,
  };

  // 总销售额
  const totalSalesCol = {
    width: four,
    title: <TableHead
      title="总销售额"
      titleparams="totalSales"
      callback={sortCallback}
      order={order}
      style={style as React.CSSProperties}
    />,
    dataIndex: 'totalSales',
    align: 'right',
  };

  // 总订单量
  const totalOrderQuantityCol = {
    width: four,
    title: <TableHead
      title="总订单量"
      titleparams="totalOrderQuantity"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'totalOrderQuantity',
    align: 'center',
  };

  // 总销量
  const totalSalesQuantityCol = {
    width: three,
    title: <TableHead
      title="总销量"
      titleparams="totalSalesQuantity"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'totalSalesQuantity',
    align: 'center',
  };

  // 回评率
  const replyReviewRateCol = {
    width: four + 5,
    title: <TableHead
      title="回评率"
      titleparams="replyReviewRate"
      callback={sortCallback}
      order={order}
      hint="回评率=周期内新增Review数/订单量，需在评论监控添加ASIN"
    />,
    dataIndex: 'replyReviewRate',
    align: 'center',
  };

  // 利润
  const profitCol = {
    width: 100,
    title: <TableHead
      title="利润"
      titleparams="profit"
      callback={sortCallback}
      order={order}
      style={style as React.CSSProperties}
    />,
    dataIndex: 'profit',
    align: 'right',
  };

  // 利润率
  const profitRateCol = {
    width: three,
    title: <TableHead
      title="利润率"
      titleparams="profitRate"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'profitRate',
    align: 'center',
  };

  // 销量/订单量
  const salesQuantityExceptOrderQuantityCol = {
    width: outer4,
    title: <TableHead
      title="销量/订单量"
      titleparams="salesQuantityExceptOrderQuantity"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'salesQuantityExceptOrderQuantity',
    align: 'center',
  };
  
  // 平均售价
  const avgSellingPriceCol = {
    width: four,
    title: <TableHead
      title="平均售价"
      titleparams="avgSellingPrice"
      callback={sortCallback}
      order={order}
      style={style as React.CSSProperties}
    />,
    dataIndex: 'avgSellingPrice',
    align: 'right',
  };
  
  // 优惠订单
  const preferentialOrderQuantityCol = {
    width: four + 15,
    title: <TableHead
      title="优惠订单"
      titleparams="preferentialOrderQuantity"
      callback={sortCallback}
      order={order}
      hint="有优惠折扣的订单量"
    />,
    dataIndex: 'preferentialOrderQuantity',
    align: 'center',
  };

  // 关联销售
  const associateSalesCol = {
    width: four + 15,
    title: <TableHead
      title="关联销售"
      titleparams="associateSales"
      callback={sortCallback}
      order={order}
      hint="本商品和其他商品一起购买的订单量"
    />,
    dataIndex: 'associateSales',
    align: 'center',
  };

  // PageView
  const pageViewCol = {
    width: two,
    title: <TableHead
      title="PV"
      titleparams="pageView"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'pageView',
    align: 'center',
  };

  // Session
  const sessionCol = {
    width: four,
    title: <TableHead
      title="Session"
      titleparams="session"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'session',
    align: 'center',
  };

  // PageView/Session
  const pageViewExceptSessionCol = {
    width: outer4,
    title: <TableHead
      title="PV/Session"
      titleparams="pageViewExceptSession"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'pageViewExceptSession',
    align: 'center',
  };

  // 转化率
  const conversionsRateCol = {
    width: four,
    title: <TableHead
      title="转化率"
      titleparams="conversionsRate"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'conversionsRate',
    align: 'center',
  };
  
  // 退货量
  const returnQuantityCol = {
    width: four,
    title: <TableHead
      title="退货量"
      titleparams="returnQuantity"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'returnQuantity',
    align: 'center',
  };
  
  // 退货率
  const returnRateCol = {
    width: three,
    title: <TableHead
      title="退货率"
      titleparams="returnRate"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'returnRate',
    align: 'center',
  };
  
  // B2B销售额
  const b2bSalesCol = {
    width: outer2,
    title: <TableHead1
      title="B2B销售额"
      titleparams="b2bSales"
      subtitle="b2bSalesProportion"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'b2bSales',
    align: 'center',
  };
  
  // B2B销量
  const b2bSalesQuantity = {
    width: outer1,
    title: <TableHead
      title="B2B销量"
      titleparams="b2bSalesQuantity"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'b2bSalesQuantity',
    align: 'center',
  };
  
  // B2B订单量
  const b2bOrderQuantityCol = {
    width: outer2,
    title: <TableHead
      title="B2B订单量"
      titleparams="b2bOrderQuantity"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'b2bOrderQuantity',
    align: 'center',
  };
  
  // B2B销量/订单量
  const b2bSalesQuantityExceptOrderQuantityCol = {
    width: outer3,
    title: <TableHead
      title="B2B销量/订单量"
      titleparams="b2bSalesQuantityExceptOrderQuantity"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'b2bSalesQuantityExceptOrderQuantity',
    align: 'center',
  };
  
  // B2B平均售价
  const b2bAvgSellingPriceCol = {
    width: outer5,
    title: <TableHead
      title="B2B平均售价"
      titleparams="b2bAvgSellingPrice"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'b2bAvgSellingPrice',
    align: 'center',
  };
  
  // B2B平均客单价
  const b2bAvgCustomerPriceCol = {
    width: 150,
    title: <TableHead
      title="B2B平均客单价"
      titleparams="b2bAvgCustomerPrice"
      callback={sortCallback}
      order={order}
      style={style as React.CSSProperties}
    />,
    dataIndex: 'b2bAvgCustomerPrice',
    align: 'right',
  };
  
  const headTable = {
    showHeader: true,
    dataSource: [],
    columns: [
      { ...childasinCol },

      { ...skuCol },

      { ...totalSalesCol },

      { ...totalOrderQuantityCol },

      { ...totalSalesQuantityCol },

      { ...replyReviewRateCol },
      { ...profitCol },
      { ...profitRateCol },
      { ...salesQuantityExceptOrderQuantityCol },
      { ...avgSellingPriceCol },
      { ...preferentialOrderQuantityCol },
      { ...associateSalesCol },
      { ...pageViewCol },
      { ...sessionCol },
      { ...pageViewExceptSessionCol },
      { ...conversionsRateCol },
      { ...returnQuantityCol },
      { ...returnRateCol },
      { ...b2bSalesCol },
      { ...b2bSalesQuantity },
      { ...b2bOrderQuantityCol },
      { ...b2bSalesQuantityExceptOrderQuantityCol },
      { ...b2bAvgSellingPriceCol },
      { ...b2bAvgCustomerPriceCol },
    ] as {}[],
    className: styles.headTable,
  };

  // 自定义列
  const newColumns = [];
  for (let i = 0; i < headTable.columns.length; i++){
    const items = headTable.columns[i] as {
      dataIndex: string;
    };
    // -1 就是没有，没有就应该隐藏
    const dataIndex = items.dataIndex;
    if (selectCustomCol.indexOf(dataIndex) !== -1 ) {
      newColumns.push(items);
    }
  }

  headTable.columns = newColumns;

  let count = 0;
  const table = (dataSource: [], total: AsinTable.IParentChildTotal) => {
    // 子ASIN的表格
    const tableConfig = {
      showHeader: false,
      dataSource,
      rowClassName: styles.childRowAsin,
      rowKey: () => count++,
      columns: [
        {
          ...childasinCol,
          render(val: string, row: AsinTable.IParentChildAsin) {
            const {
              imgUrl,
              title,
              asin,
              categoryName,
              categoryRanking,
            } = row;
            
            return <div className={styles.productCol}>
              <img src={imgUrl || notImg}/>
              <div className={styles.details}>
                <a href="" 
                  className={styles.title}
                  target="_blank"
                  title={title}
                >
                  <Iconfont type="icon-lianjie" className={styles.linkIcon}/>
                  {title}
                </a>
                <footer>
                  <span>{asin}</span>
                  <Tooltip title={`大类排名：#${categoryRanking} ${categoryName}`}>
                    <span>#{categoryRanking}</span>
                  </Tooltip>
                </footer>
              </div>
            </div>;
          },
        },

        {
          ...skuCol,
          render(val: string, row: AsinTable.IParentChildAsin) {
            const {
              skuInfo,
            } = row;
            if (!skuInfo) {
              return '';
            }
            return <div className={commonStyles.skuListCol}>
              {skuInfo.map((item, i) => {
                return <div className={commonStyles.skuItem} key={i}>
                  <p className={commonStyles.skus}>
                    <span>{item.sku}</span>
                    <span>{item.price ? currency + item.price : <Empty /> }</span>
                  </p>
                  <p className={commonStyles.footer}>
                    <span>库存：{item.sellable ? item.sellable : <Empty /> }</span>
                    <Deliver method={item.fulfillmentChannel} style={{
                      'float': 'right',
                    }}/>
                    <span className={commonStyles.status}>
                      {getProductStatus(item.listingStatus)}
                    </span>
                  </p>
                </div>;
              })}
            </div>;
          },
        },

        {
          ...totalSalesCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : currency + moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...totalOrderQuantityCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...totalSalesQuantityCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : val }</p>
            </>;
          },
        },
        {
          ...replyReviewRateCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : `${val}%` }</p>
            </>;
          },
        },
        {
          ...profitCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : currency + moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...profitRateCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : `${val}%` }</p>
            </>;
          },
        },
        {
          ...salesQuantityExceptOrderQuantityCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : val }</p>
            </>;
          },
        },
        {
          ...avgSellingPriceCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : currency + moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...preferentialOrderQuantityCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...associateSalesCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...pageViewCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...sessionCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...pageViewExceptSessionCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...conversionsRateCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : `${val}%` }</p>
            </>;
          },
        },
        {
          ...returnQuantityCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...returnRateCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : `${val}%` }</p>
            </>;
          },
        },
        {
          ...b2bSalesCol,
          render(val: number, row: AsinTable.IParentChildAsin) {
            return <>
              <p>{val === null ? <Empty /> : currency + moneyFormat(val, 2, ',', '.', false) }</p>
              <p>{row.b2bSalesProportion}%</p>
            </>;
          },
        },
        {
          ...b2bSalesQuantity,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...b2bOrderQuantityCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...b2bSalesQuantityExceptOrderQuantityCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : val }</p>
            </>;
          },
        },
        {
          ...b2bAvgSellingPriceCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : currency + moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          ...b2bAvgCustomerPriceCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : currency + moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
      ] as {}[],
      summary: () => <Summary currency={currency} total={total}/>,
    };
    return <Table {...tableConfig} pagination={false}></Table>;
  };

  const col = [
    {
      dataIndex: 'parentAsin',
      title: '父SKU',
      align: 'center',
      width: 140,
      render(value: string) {
        return value;
      },
      className: styles.aaaa,
    },
    {
      dataIndex: 'parentAsin',
      title: <Table {...headTable}/>,
      align: 'center',
      render(
        value: string, 
        row: {
          childAsinInfo: []; 
          parentAsinSubTotal: AsinTable.IParentChildTotal;
        }
      ) {
        return table(row.childAsinInfo, row.parentAsinSubTotal);
      },
    },
  ];
  
  return col;
};
