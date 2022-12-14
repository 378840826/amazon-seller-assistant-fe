import React from 'react';
import styles from './index.less';
import commonStyles from '../commonStyles.less';
import { moneyFormat } from '@/utils/huang';
import { getlistingStatus } from '../config';
import { colsWidth } from './config';
import classnames from 'classnames';

// 组件
import { Link } from 'umi';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import TableHeadMain from '../components/TableHeadMain';
import TableHeadTwo from '../components/TableHeadTwo';
import Deliver from '../components/Deliver';
import Empty from '../components/Empty';
import ShowData from '@/components/ShowData';

import Summary from './Summary';
import {
  Tooltip,
  Table,
  Dropdown,
  Menu,
  message,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

/**
 * 每列的宽度用class来设置, 要不然不准确
 * 
 */


export const parentAsinCols = (props: AsinTable.IParentAsinColsProps) => {
  const {
    currency, // 货币符号
    order = '', // 正序或倒序
    sortCallback,
    parentCustomcol,
    site,
  } = props;

  // 自定义列
  const selectCustomCol: string[] = []; // 当前选中的自定义列
  const other: string[] = ['childAsin']; // 这些列不在自定义列中

  // parentCustomcol是Object[],需要转换一下
  for (const key in parentCustomcol) {
    const item = parentCustomcol[key];
    selectCustomCol.push(...item);
  }
  selectCustomCol.push(...other);
 
  // 子asin
  const childasinCol = {
    width: colsWidth.asin,
    title: <span className={styles.text}>子ASIN</span>,
    align: 'center',
    dataIndex: 'childAsin',
    className: styles.childAsinCol,
    fixed: 'left',
  };

  // sku
  const skuCol = {
    width: colsWidth.sku,
    title: <span className={styles.text}>MSKU</span>,
    align: 'center',
    dataIndex: 'sku',
    className: styles.skuCol,
    fixed: 'left',
  };

  // 总销售额
  const totalSalesCol = {
    className: classnames(
      styles.totalSales,
      commonStyles.tdTextRight,
    ),
    title: <TableHeadMain
      title="总销售额"
      titleparams="totalSales"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'totalSales',
    align: 'right',
  };

  // 总订单量
  const totalOrderQuantityCol = {
    className: styles.totalOrderQuantity,
    title: <TableHeadMain
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
    className: styles.totalSalesQuantity,
    title: <TableHeadMain
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
    className: styles.replyReviewRate,
    title: <TableHeadMain
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
    className: classnames(
      styles.profit,
      commonStyles.tdTextRight,
    ),
    title: <TableHeadMain
      title="利润"
      titleparams="profit"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'profit',
    align: 'right',
    
  };

  // 利润率
  const profitRateCol = {
    className: styles.profitRate,
    title: <TableHeadMain
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
    className: styles.salesQuantityExceptOrderQuantity,
    title: <TableHeadMain
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
    className: classnames(
      styles.avgSellingPrice,
      commonStyles.tdTextRight,
    ),
    title: <TableHeadMain
      title="平均售价"
      titleparams="avgSellingPrice"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'avgSellingPrice',
    align: 'right',
  };

  // 平均客单价
  const avgCustomerPriceCol = {
    className: classnames(
      styles.avgCustomerPrice,
      commonStyles.tdTextRight,
    ),
    title: <TableHeadMain
      title="平均客单价"
      titleparams="avgCustomerPrice"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'avgCustomerPrice',
    align: 'right',
  };
  
  // 优惠订单
  const preferentialOrderQuantityCol = {
    className: styles.preferentialOrderQuantity,
    title: <TableHeadMain
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
    className: styles.associateSales,
    title: <TableHeadMain
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
    className: styles.pageView,
    title: <TableHeadMain
      title="PageView"
      titleparams="pageView"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'pageView',
    align: 'center',
  };

  // Session
  const sessionCol = {
    className: styles.session,
    title: <TableHeadMain
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
    className: styles.pageViewExceptSession,
    title: <TableHeadMain
      title="PageView/Session"
      titleparams="pageViewExceptSession"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'pageViewExceptSession',
    align: 'center',
  };

  // 转化率
  const conversionsRateCol = {
    className: styles.conversionsRate,
    title: <TableHeadMain
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
    className: styles.returnQuantity,
    title: <TableHeadMain
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
    className: styles.returnRate,
    title: <TableHeadMain
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
    className: styles.b2bSales,
    title: <TableHeadTwo
      title="B2B销售额"
      titleparams="b2bSales"
      subtitle="b2bSalesProportion"
      proportion="b2bSalesProportion"
      callback={sortCallback}
      order={order}
      visible={false}
    />,
    dataIndex: 'b2bSales',
    align: 'center',
  };
  
  // B2B销量
  const b2bSalesQuantity = {
    className: styles.b2bSalesQuantity,
    title: <TableHeadMain
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
    className: styles.b2bOrderQuantity,
    title: <TableHeadMain
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
    className: styles.b2bSalesQuantityExceptOrderQuantity,
    title: <TableHeadMain
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
    className: classnames(
      styles.b2bAvgSellingPrice,
      commonStyles.tdTextRight,
    ),
    title: <TableHeadMain
      title="B2B平均售价"
      titleparams="b2bAvgSellingPrice"
      callback={sortCallback}
      order={order}
    />,
    dataIndex: 'b2bAvgSellingPrice',
    align: 'right',
  };
  
  // B2B平均客单价
  const b2bAvgCustomerPriceCol = {
    className: classnames(
      styles.b2bAvgCustomerPrice,
      commonStyles.tdTextRight,
    ),
    title: <TableHeadMain
      title="B2B平均客单价"
      titleparams="b2bAvgCustomerPrice"
      callback={sortCallback}
      order={order}
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
      { ...avgCustomerPriceCol },
      { ...preferentialOrderQuantityCol },
      { ...associateSalesCol },
      { ...pageViewCol },
      { ...sessionCol },
      { ...pageViewExceptSessionCol },
      { ...conversionsRateCol },
      { ...returnQuantityCol },
      { ...returnRateCol },
      { ...b2bSalesCol },
      { ...b2bOrderQuantityCol },
      { ...b2bSalesQuantity },
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
      className: styles.childTable,
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
              <img src={imgUrl} className={imgUrl === null ? 'none' : '' }/>
              <Iconfont type="icon-anzhizhushoubiaoqiantubiao1" className={classnames(
                imgUrl === null ? '' : 'none',
                styles.imgFont
              ) } />
              <div className={styles.details}>
                <a href={getAmazonAsinUrl(asin, site)} 
                  className={styles.title}
                  target="_blank"
                  rel="noreferrer"
                  title={title}
                >
                  <Iconfont type="icon-lianjie" className={styles.linkIcon}/>
                  {title}
                </a>
                <footer>
                  <div>
                    <Dropdown 
                      overlay={
                        <Menu>
                          <Menu.Item key="toGoodlist" >
                            <Link to={`/product/list?asin=${asin}`} target="_self">商品列表</Link>
                          </Menu.Item>
                          <Menu.Item key="toASINview">
                            <Link to={`/asin/order?asin=${asin}`} target="_self">订单解读</Link>
                          </Menu.Item>
                          <Menu.Item key="toOrderview">
                            <Link to={`/dynamic/asin-overview?asin=${asin}`} target="_self">ASIN动态汇总</Link>
                          </Menu.Item>
                          <Menu.Item>
                            <CopyToClipboard 
                              onCopy={() => {
                                message.success('复制成功'); 
                              }}
                              text={asin}
                            >
                              <span>复制ASIN编号</span>
                            </CopyToClipboard>
                          </Menu.Item>
                        </Menu>
                      }                                            
                    >
                      <a onClick={e => e.preventDefault()} className={styles.title}>
                        {asin} 
                      </a>
                    </Dropdown>
                  </div>
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
                    <span className={styles.price}>
                      {item.price ? currency + item.price : <Empty /> }
                    </span>
                  </p>
                  <p className={commonStyles.footer}>
                    <span>库存：{item.sellable ? item.sellable : <Empty /> }</span>
                    <Deliver method={item.fulfillmentChannel} style={{
                      'float': 'right',
                      width: 30,
                      textAlign: 'right',
                    }}/>
                    <span className={classnames(
                      commonStyles.status, 
                      getlistingStatus(item.listingStatus) === '在售' ? commonStyles.normal : commonStyles.other
                    )}>
                      {getlistingStatus(item.listingStatus)}
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
              <p><ShowData value={val} isCurrency isMoney /></p>
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
              <p>{val === null ? <Empty /> : `${moneyFormat(val, 2, ',', '.', true)}%` }</p>
            </>;
          },
        },
        {
          ...profitCol,
          render(val: number) {
            return <>
              <p><ShowData value={val} isCurrency isMoney /></p>
            </>;
          },
        },
        {
          ...profitRateCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : `${moneyFormat(val, 2, ',', '.', true)}%` }</p>
            </>;
          },
        },
        {
          ...salesQuantityExceptOrderQuantityCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', true) }</p>
            </>;
          },
        },
        {
          ...avgSellingPriceCol,
          render(val: number) {
            return <>
              <p><ShowData value={val} isCurrency isMoney /></p>
            </>;
          },
        },
        {
          ...avgCustomerPriceCol,
          render(val: number) {
            return <>
              <p><ShowData value={val} isCurrency isMoney /></p>
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
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', true) }</p>
            </>;
          },
        },
        {
          ...conversionsRateCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : `${moneyFormat(val, 2, ',', '.', true)}%` }</p>
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
              <p>{val === null ? <Empty /> : `${moneyFormat(val, 2, ',', '.', true)}%` }</p>
            </>;
          },
        },
        {
          ...b2bSalesCol,
          render(val: number, row: AsinTable.IParentChildAsin) {
            return <>
              <p><ShowData value={val} isCurrency isMoney /></p>
              <p>{moneyFormat(row.b2bSalesProportion, 2, ',', '.', true)}%</p>
            </>;
          },
        },
        {
          // ...b2bSalesQuantity,
          ...b2bOrderQuantityCol,
          render(val: number) {
            return <>
              <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', false) }</p>
            </>;
          },
        },
        {
          // ...b2bOrderQuantityCol,
          ...b2bSalesQuantity,
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
              <p><ShowData value={val} isCurrency isMoney /></p>
            </>;
          },
        },
        {
          ...b2bAvgCustomerPriceCol,
          render(val: number) {
            return <>
              <p><ShowData value={val} isCurrency isMoney /></p>
            </>;
          },
        },
      ] as {
        dataIndex: string;
        render: any; // eslint-disable-line
      }[],
      summary: () => <Summary total={total} parentCustomcol={parentCustomcol}/>,
    };
    
    // 自定义列的
    const newColumns = [];
    for (let i = 0; i < tableConfig.columns.length; i++) {
      const item = tableConfig.columns[i];
      if (selectCustomCol.indexOf(item.dataIndex) !== -1) {
        newColumns.push(item);
      }
    }

    tableConfig.columns = newColumns;
    return <Table {...tableConfig} pagination={false}></Table>;
  };

  const col = [
    {
      dataIndex: 'parentAsin',
      title: '父ASIN',
      align: 'center',
      width: selectCustomCol.length === 0 ? '100%' : 100, // 自定义列只有一行了
      fixed: 'left',
      render(value: string) {
        return value;
      },
      className: styles.parentAsinCol,
    },
    {
      dataIndex: 'parentAsin',
      title: <Table {...headTable}/>,
      align: 'center',
      className: styles.mainTd,
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
