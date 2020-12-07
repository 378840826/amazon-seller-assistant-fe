import React from 'react';
import styles from './../commonStyles.less';
import { moneyFormat } from '@/utils/huang';
import classnames from 'classnames';

// 组件
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { Link } from 'umi';
import TableHeadMain from '../components/TableHeadMain';
import TableHeadTwo from '../components/TableHeadTwo';
import Deliver from '../components/Deliver';
import Empty from '../components/Empty';
import Rate from '@/components/Rate';
import AdTypeData from '../components/AdTypeData';
import RelatedSales from './RelatedSales';
import { getlistingStatus } from '../config';
import { Tooltip } from 'antd';


export const childAsinCols = (props: AsinTable.IChildAsinColsProps) => {
  const {
    ratio = false, // 环比开关
    currency, // 货币符号
    order = '', // 正序或倒序
    sortCallback,
    childCustomcol,
    site,
  } = props;


  let currentAsin = '';
  const callback = (val: string) => {
    return new Promise(resolve => {
      if (val === currentAsin || currentAsin === '') {
        resolve(true);
      } else {
        resolve(false);
      }
      currentAsin = val;
    });
  };

  // const two = 80; // 2个字的列宽度
  const three = 95; // 3个字的列宽度、Spend、Clicks
  const four = 90; // 4个字的列宽度
  const five = 98; // 5个字的列宽度
  const outer1 = 110; // PageView、 B2B订单量、综合ACoS、综合RoAS
  const outer2 = 100; // Session、B2B销量
  const outer3 = 110; // PageView/Session , 本SKU广告销售额、本SKU广告订单量
  // B2B销量/订单量、B2B平均客单价、自然销售额、自然订单量
  const outer4 = 115; 
  const outer5 = 110; // B2B平均售价、
  const outer6 = 85; // CPC、ACoS、RoAS
  const outer7 = 125; // Impressions
  const outer8 = 112; // B2B销售额

  const columns = [
    {
      dataIndex: 'productCol',
      title: '商品信息',
      align: 'center',
      width: 230,
      fixed: 'left',
      render(val: string, { 
        imgUrl, 
        title, 
        asin, 
        categoryRanking, 
        categoryName,
      }: AsinTable.IChildResocds) {
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
              <Iconfont type="icon-lianjie" className={styles.linkIcon}/>{title}</a>
            <footer>
              <Link to={`/asin/base?asin=${asin}`} className={styles.title}>{asin}</Link>
              <Tooltip title={`大类排名：#${categoryRanking} ${categoryName}`}>
                <span>#{categoryRanking}</span>
              </Tooltip>
            </footer>
          </div>
        </div>;
      },
    },
    {
      dataIndex: 'skuInfo',
      title: 'SKU',
      align: 'center',
      width: 200,
      fixed: 'left',
      render(list: AsinTable.ISkuinfo[]) {
        return <div className={styles.skuListCol}>
          {list.map((item, i) => {
            return <div className={styles.skuItem} key={i}>
              <p className={styles.skus}>
                <span>{item.sku}</span>
                <span className={styles.price}>{item.price ? currency + item.price : ''}</span>
              </p>
              <p className={styles.footer}>
                <span>库存：{item.sellable}</span>
                <Deliver method={item.fulfillmentChannel} style={{
                  'float': 'right',
                  width: 30,
                  textAlign: 'right',
                }}/>
                <span className={classnames(
                  styles.status, 
                  getlistingStatus(item.listingStatus) === '在售' ? styles.normal : styles.other
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
      dataIndex: 'parentAsin',
      title: '父ASIN',
      align: 'center',
      width: 110,
      fixed: 'left',
      render(val: number) {
        return <p className={styles.parentAsinCol}>{val ? val : <Empty />}</p>;
      },
    },
    {
      dataIndex: 'reviewNum',
      title: <TableHeadMain
        title="Review"
        titleparams="reviewNum"
        callback={sortCallback}
        order={order}
      />,
      align: 'center',
      width: 80,
    },
    {
      dataIndex: 'reviewScore',
      title: <TableHeadMain
        title="评分"
        titleparams="reviewScore"
        callback={sortCallback}
        order={order}
      />,
      align: 'center',
      width: 80,
      render(val: number) {
        return moneyFormat(val, 1, ',', '.', true);
      },
    },
    {
      dataIndex: 'totalSales',
      title: <TableHeadMain
        title="总销售额"
        titleparams="totalSales"
        subtitle="totalSalesRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="right"
        subalign="right"
      />,
      align: 'right',
      width: 100,
      className: styles.tdTextRight,
      render(val: number, { totalSalesRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={totalSalesRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'totalOrderQuantity',
      title: <TableHeadMain 
        title="总订单量" 
        titleparams="totalOrderQuantity"
        subtitle="totalOrderQuantityRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: four,
      render(val: number, { totalOrderQuantityRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : val }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={totalOrderQuantityRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'totalSalesQuantity',
      title: <TableHeadMain 
        title="总销量" 
        titleparams="totalSalesQuantity"
        subtitle="totalSalesQuantityRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: three,
      render(val: number, { totalSalesQuantityRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : val }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={totalSalesQuantityRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'replyReviewRate',
      title: <TableHeadMain 
        title="回评率"
        titleparams="replyReviewRate"
        subtitle="replyReviewRateRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        hint="回评率=周期内新增Review数/订单量，需在评论监控添加ASIN"
      />,
      align: 'center',
      width: 110,
      render(val: number, { replyReviewRateRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : `${ moneyFormat(val, 2, ',', '.', true)}%` }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={replyReviewRateRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'profit',
      title: <TableHeadMain 
        title="利润"
        titleparams="profit"
        subtitle="profitRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="right"
        subalign="right"
      />,
      align: 'right',
      className: styles.tdTextRight,
      width: four,
      render(val: number, { profitRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={profitRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'profitRate',
      title: <TableHeadMain 
        title="利润率"
        titleparams="profitRate"
        subtitle="profitRateRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="center"
      />,
      align: 'center',
      width: three,
      render(val: number, { profitRateRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : `${ moneyFormat(val, 2, ',', '.', true)}%` }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={profitRateRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'salesQuantityExceptOrderQuantity',
      title: <TableHeadMain 
        title="销量/订单量"
        titleparams="salesQuantityExceptOrderQuantity"
        subtitle="salesQuantityExceptOrderQuantityRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: 130,
      render(val: number, { salesQuantityExceptOrderQuantityRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : `${ moneyFormat(val, 2, ',', '.', true)}` }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={salesQuantityExceptOrderQuantityRingRatio} 
              decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'avgSellingPrice',
      title: <TableHeadMain 
        title="平均售价"
        titleparams="avgSellingPrice"
        subtitle="avgSellingPriceRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="right"
        subalign="right"
      />,
      align: 'right',
      width: four,
      className: styles.tdTextRight,
      render(val: number, { avgSellingPriceRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={avgSellingPriceRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'avgCustomerPrice',
      title: <TableHeadMain 
        title="平均客单价"
        titleparams="avgCustomerPrice"
        subtitle="avgCustomerPriceRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="right"
        subalign="right"
      />,
      align: 'right',
      width: five,
      className: styles.tdTextRight,
      render(val: number, { avgCustomerPriceRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={avgCustomerPriceRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
  
    {
      dataIndex: 'preferentialOrderQuantity',
      title: <TableHeadMain 
        title="优惠订单"
        titleparams="preferentialOrderQuantity"
        subtitle="preferentialOrderQuantityRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        hint="有优惠折扣的订单量"
      />,
      align: 'center',
      width: 110,
      render(val: number, { preferentialOrderQuantityRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : val }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={preferentialOrderQuantityRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'associateSales',
      title: <TableHeadMain 
        title="关联销售"
        titleparams="associateSales"
        subtitle="associateSalesRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        hint="本商品和其他商品一起购买的订单量"
      />,
      align: 'center',
      width: 125,
      render(val: number, { associateSalesRingRatio, asin }: AsinTable.IChildResocds) {
        return <div>
          <p>{val}</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={associateSalesRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
          <RelatedSales callback={callback} asin={asin} />
        </div>;
      },
    },
    {
      dataIndex: 'pageView',
      title: <TableHeadMain 
        title="PageView"
        titleparams="pageView"
        subtitle="pageViewRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: outer1,
      render(val: number, { pageViewRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : val }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={pageViewRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'session',
      title: <TableHeadMain 
        title="Session"
        titleparams="session"
        subtitle="sessionRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: outer2,
      render(val: number, { sessionRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : val }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={sessionRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'pageViewExceptSession',
      title: <TableHeadMain 
        title="PageView/Session"
        titleparams="pageViewExceptSession"
        subtitle="pageViewExceptSessionRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: outer3,
      render(val: number, { pageViewExceptSessionRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : moneyFormat(val, 2, ',', '.', true) }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={pageViewExceptSessionRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'conversionsRate',
      title: <TableHeadMain 
        title="转化率"
        titleparams="conversionsRate"
        subtitle="conversionsRateRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: three,
      render(val: number, { conversionsRateRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : `${moneyFormat(val, 2, ',', '.', true)}%` }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={conversionsRateRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'returnQuantity',
      title: <TableHeadMain 
        title="退货量"
        titleparams="returnQuantity"
        subtitle="returnQuantityRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: three,
      render(val: number, { returnQuantityRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : `${val}` }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={returnQuantityRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'returnRate',
      title: <TableHeadMain 
        title="退货率"
        titleparams="returnRate"
        subtitle="returnRateRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: three,
      render(val: number, { returnRateRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : `${moneyFormat(val, 2, ',', '.', true)}%` }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={returnRateRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'b2bSales',
      title: <TableHeadTwo
        title="B2B销售额"
        titleparams="b2bSales"
        subtitle="b2bSalesRingRatio"
        proportion="b2bSalesProportion"
        callback={sortCallback}
        order={order}
        visible={ratio}
        width={100}
      />,
      align: 'center',
      width: outer8,
      render(val: number, { b2bSalesRingRatio, b2bSalesProportion }: AsinTable.IChildResocds) {
        return (
          <div className={styles.haveProportion}>
            <p>
              {
                val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
              }
            </p>
            <p>
              <span style={{
                display: ratio ? 'block' : 'none',
              }} className={styles.num}>
                <Rate value={b2bSalesRingRatio} decimals={2} showArrow={false} ></Rate>
              </span>
              <span className={styles.num} style={{
                width: ratio ? '50%' : '100%',
              }}>{b2bSalesProportion === null ? <Empty /> : `${moneyFormat(b2bSalesProportion, 2, ',', '.', true)}%`}</span>
            </p>
          </div>
        );
      },
    },
    {
      dataIndex: 'b2bOrderQuantity',
      title: <TableHeadMain 
        title="B2B订单量"
        titleparams="b2bOrderQuantity"
        subtitle="b2bOrderQuantityRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: outer1,
      render(val: number, { b2bOrderQuantityRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : `${val}` }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={b2bOrderQuantityRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'b2bSalesQuantity',
      title: <TableHeadMain 
        title="B2B销量"
        titleparams="b2bSalesQuantity"
        subtitle="b2bSalesQuantityRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: outer2,
      render(val: number, { b2bSalesQuantityRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : `${val}` }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={b2bSalesQuantityRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'b2bSalesQuantityExceptOrderQuantity',
      title: <TableHeadMain 
        title="B2B销量/订单量"
        titleparams="b2bSalesQuantityExceptOrderQuantity"
        subtitle="b2bSalesQuantityExceptOrderQuantityRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: outer4,
      render(val: number, { 
        b2bSalesQuantityExceptOrderQuantityRingRatio }: AsinTable.IChildResocds
      ) {
        return <>
          <p>{val === null ? <Empty /> : `${moneyFormat(val, 2, ',', '.', true)}` }</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={b2bSalesQuantityExceptOrderQuantityRingRatio} 
              decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'b2bAvgSellingPrice',
      title: <TableHeadMain 
        title="B2B平均售价"
        titleparams="b2bAvgSellingPrice"
        subtitle="b2bAvgSellingPriceRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="right"
        subalign="right"
      />,
      align: 'right',
      width: outer5,
      className: styles.tdTextRight,
      render(val: number, { b2bAvgSellingPriceRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={b2bAvgSellingPriceRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'b2bAvgCustomerPrice',
      title: <TableHeadMain 
        title="B2B平均客单价" 
        titleparams="b2bAvgCustomerPrice"
        subtitle="b2bAvgCustomerPriceRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="right"
        subalign="right"
      />,
      align: 'right',
      width: outer4,
      className: styles.tdTextRight,
      render(val: number, { b2bAvgCustomerPriceRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={b2bAvgCustomerPriceRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'adAsinAdTypeStatistics',
      title: <div className={styles.adType}>
        <p>广告组类型</p>
        <p>
          <span className={styles.text1}>(</span>
          <span style={{
            color: '#0083ff',
          }}>开启</span>
          <span className={styles.text2}>/</span>
          <span style={{
            color: '#ff5958',
          }}>暂停</span>
          <span className={styles.text2}>/</span>
          <span style={{
            color: '#555',
          }}>归档</span>
          <span className={styles.text1}>)</span>
        </p>
      </div>,
      align: 'left',
      width: 210,
      render(data: { 
        adType: number; 
        archivedQuantity: number; 
        pausedQuantity: number; 
        enabledQuantity: number; 
      }[]|null) {
        if (data === null) {
          return <div className={styles.adType}><Empty /></div>;
        }
        return <div className={styles.adType}>
          {
            data.map((item, i) => {
              return <p key={i}>
                {item.adType}：
                <AdTypeData 
                  start={item.enabledQuantity} 
                  pause={item.pausedQuantity} 
                  pigeonhole={item.archivedQuantity} 
                />
              </p>;
            })
          }
        </div>;
      },
    },
    {
      dataIndex: 'adSales',
      title: <TableHeadMain 
        title="广告销售额" 
        titleparams="adSales"
        subtitle="adSalesRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="right"
        subalign="right"
      />,
      align: 'right',
      width: five,
      className: styles.tdTextRight,
      render(val: number, { adSalesRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={adSalesRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'skuAdSales',
      title: <TableHeadTwo 
        title="本SKU广告销售额"
        proportion="skuAdSalesProportion"
        titleparams="skuAdSales"
        subtitle="skuAdSalesRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        width={130}
      />,
      align: 'center',
      width: 142,
      render(val: number, { skuAdSalesRingRatio, skuAdSalesProportion }: AsinTable.IChildResocds) {
        return (
          <div className={styles.haveProportion}>
            <p>
              {
                val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
              }
            </p>
            <p>
              <span style={{
                display: ratio ? 'block' : 'none',
              }} className={styles.num}>
                <Rate value={skuAdSalesRingRatio} decimals={2} showArrow={false} ></Rate>
              </span>
              <span className={styles.num} style={{
                width: ratio ? '50%' : '100%',
              }}>{skuAdSalesProportion === null ? <Empty /> : `${moneyFormat(skuAdSalesProportion, 2, ',', '.', true)}%`}</span>
            </p>
          </div>
        );
      },
    },
    {
      dataIndex: 'naturalSales',
      title: <TableHeadTwo 
        title="自然销售额"
        proportion="naturalSalesProportion"
        titleparams="naturalSales"
        subtitle="naturalSalesRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        width={100}
      />,
      align: 'center',
      width: 112,
      render(val: number, { 
        naturalSalesRingRatio, naturalSalesProportion,
      }: AsinTable.IChildResocds) {
        return (
          <div className={styles.haveProportion}>
            <p>
              {
                val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
              }
            </p>
            <p>
              <span style={{
                display: ratio ? 'block' : 'none',
              }} className={styles.num}>
                <Rate value={naturalSalesRingRatio} decimals={2} showArrow={false} ></Rate>
              </span>
              <span className={styles.num} style={{
                width: ratio ? '50%' : '100%',
              }}>{naturalSalesProportion === null ? <Empty /> : 
                  `${moneyFormat(naturalSalesProportion, 2, ',', '.', true)}%`}
              </span>
            </p>
          </div>
        );
      },
    },
    {
      dataIndex: 'adOrderQuantity',
      title: <TableHeadMain 
        title="广告订单量"
        titleparams="adOrderQuantity"
        subtitle="adOrderQuantityRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
      />,
      align: 'center',
      width: five,
      render(val: number, { adOrderQuantityRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>{val === null ? <Empty /> : val}</p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={adOrderQuantityRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'skuAdOrderQuantity',
      title: <TableHeadTwo 
        title="本SKU广告订单量"
        titleparams="skuAdOrderQuantity"
        subtitle="skuAdOrderQuantityRingRatio"
        proportion="skuAdOrderQuantityProportion"
        callback={sortCallback}
        order={order}
        visible={ratio}
        width={130}
      />,
      align: 'center',
      width: 142,
      render(val: number, { 
        skuAdOrderQuantityRingRatio, skuAdOrderQuantityProportion,
      }: AsinTable.IChildResocds) {
        return (
          <div className={styles.haveProportion}>
            <p>
              {
                val !== null ? val : <Empty />
              }
            </p>
            <p>
              <span style={{
                display: ratio ? 'block' : 'none',
              }} className={styles.num}>
                <Rate value={skuAdOrderQuantityRingRatio} decimals={2} showArrow={false} ></Rate>
              </span>
              <span className={styles.num} style={{
                width: ratio ? '50%' : '100%',
              }}>
                {skuAdOrderQuantityProportion === null ? <Empty /> : 
                  `${moneyFormat(skuAdOrderQuantityProportion, 2, ',', '.', true)}%`}
              </span>
            </p>
          </div>
        );
      },
    },
    {
      dataIndex: 'naturalOrderQuantity',
      title: <TableHeadTwo
        title="自然订单量"
        titleparams="naturalOrderQuantity"
        subtitle="naturalOrderQuantityRingRatio"
        proportion="naturalOrderQuantityProportion"
        callback={sortCallback}
        order={order}
        visible={ratio}
        width={100}
      />,
      align: 'center',
      width: 112,
      render(val: number, { 
        naturalOrderQuantityRingRatio, naturalOrderQuantityProportion,
      }: AsinTable.IChildResocds) {
        return (
          <div className={styles.haveProportion}>
            <p>
              {
                val !== null ? val : <Empty />
              }
            </p>
            <p>
              <span style={{
                display: ratio ? 'block' : 'none',
              }} className={styles.num}>
                <Rate value={naturalOrderQuantityRingRatio} decimals={2} showArrow={false} ></Rate>
              </span>
              <span className={styles.num} style={{
                width: ratio ? '50%' : '100%',
              }}>{naturalOrderQuantityProportion === null ? <Empty /> : 
                  `${moneyFormat(naturalOrderQuantityProportion, 2, ',', '.', true)}%`}
              </span>
            </p>
          </div>
        );
      },
    },
    {
      dataIndex: 'cpc',
      title: <TableHeadMain 
        title="CPC"
        titleparams="cpc"
        subtitle="cpcRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="right"
        subalign="right"
      />,
      align: 'right',
      width: outer6,
      className: styles.tdTextRight,
      render(val: number, { cpcRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={cpcRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'spend',
      title: <TableHeadMain 
        title="Spend"
        titleparams="spend"
        subtitle="spendRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="right"
        subalign="right"
      />,
      align: 'right',
      width: three,
      className: styles.tdTextRight,
      render(val: number, { spendRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? currency + moneyFormat(val, 2, ',', '.', true) : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={spendRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'acos',
      title: <TableHeadMain 
        title="ACoS"
        titleparams="acos"
        subtitle="acosRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="center"
      />,
      align: 'center',
      width: outer6,
      render(val: number, { acosRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? `${moneyFormat(val, 2, ',', '.', true)}%` : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={acosRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'compositeAcos',
      title: <TableHeadMain 
        title="综合ACoS"
        titleparams="compositeAcos"
        subtitle="compositeAcosRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="center"
      />,
      align: 'center',
      width: outer1,
      render(val: number, { compositeAcosRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? `${moneyFormat(val, 2, ',', '.', true)}%` : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={compositeAcosRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'roas',
      title: <TableHeadMain 
        title="RoAS"
        titleparams="roas"
        subtitle="roasRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="center"
      />,
      align: 'center',
      width: outer6,
      render(val: number, { roasRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? moneyFormat(val, 2, ',', '.', true) : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={roasRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'compositeRoas',
      title: <TableHeadMain 
        title="综合RoAS"
        titleparams="compositeRoas"
        subtitle="compositeRoasRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="center"
      />,
      align: 'center',
      width: outer1,
      render(val: number, { compositeRoasRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? `${moneyFormat(val, 2, ',', '.', true)}` : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={compositeRoasRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'impressions',
      title: <TableHeadMain 
        title="Impressions"
        titleparams="impressions"
        subtitle="impressionsRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="center"
      />,
      align: 'center',
      width: outer7,
      render(val: number, { impressionsRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? val : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={impressionsRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'clicks',
      title: <TableHeadMain 
        title="Clicks"
        titleparams="clicks"
        subtitle="clicksRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="center"
      />,
      align: 'center',
      width: three,
      render(val: number, { clicksRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? val : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={clicksRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'ctr',
      title: <TableHeadMain 
        title="CTR"
        titleparams="ctr"
        subtitle="ctrRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="center"
      />,
      align: 'center',
      width: outer6,
      render(val: number, { ctrRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? `${moneyFormat(val, 2, ',', '.', true)}%` : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={ctrRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'adConversionsRate',
      title: <TableHeadMain 
        title="广告转化率"
        titleparams="adConversionsRate"
        subtitle="adConversionsRateRingRatio"
        callback={sortCallback}
        order={order}
        visible={ratio}
        align="center"
      />,
      align: 'center',
      width: five,
      render(val: number, { adConversionsRateRingRatio }: AsinTable.IChildResocds) {
        return <>
          <p>
            {
              val !== null ? `${moneyFormat(val, 2, ',', '.', true)}%` : <Empty />
            }
          </p>
          <p style={{
            display: ratio ? 'block' : 'none',
          }}>
            <Rate value={adConversionsRateRingRatio} decimals={2} showArrow={false} ></Rate>
          </p>
        </>;
      },
    },
    {
      dataIndex: 'handle',
      title: '操作',
      align: 'center',
      width: 75,
      fixed: 'right',
      className: styles.handleCol,
      render() {
        return <Link
          target="_blank"
          className={styles.handleLink}
          to={{
            pathname: '/asin/base',
            search: '?asin=B00GIGAUA0',
          }}>数据分析</Link>;
      },
    },
  ];

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
  for (let i = 0; i < columns.length; i++){
    const items = columns[i];
    // -1 就是没有，没有就应该隐藏
    if (selectCustomCol.indexOf(items.dataIndex) !== -1) {
      newColumns.push(items);
    }
  }
  // console.log(newColumns, 'newArr');
  return newColumns;
};
