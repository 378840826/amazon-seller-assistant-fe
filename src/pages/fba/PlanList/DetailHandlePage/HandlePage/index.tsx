/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-09 11:31:55
 * @LastEditTime: 2021-05-17 15:29:24
 */
import React from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Table } from 'antd';
import GoodsImg from '@/pages/components/GoodsImg';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { useDispatch, history } from 'umi';
import { asinPandectBaseRouter } from '@/utils/routes';
import AsyncEditBox from '../../../components/AsyncEditBox';

interface IProps {
  site: API.Site;
  data: planList.IHandlePageRecord[];
  changeShipmentName: (val: string, mwsShipmentId: string) => void;
}

const DisposePage: React.FC<IProps> = props => {
  const { data, changeShipmentName } = props;
  const dispatch = useDispatch();

  // 跳转到新窗口
  const toAsin = function(asin: string, shopId: string) {
    dispatch({
      type: 'global/setCurrentShop',
      payload: {
        id: shopId,
      },
    });

    setTimeout(() => {
      history.push(`${asinPandectBaseRouter}?asin=${asin}`);
    }, 10);
  };

  const columns = [
    { 
      title: 'ShipmentID',
      dataIndex: 'mwsShipmentId', 
      key: 'mwsShipmentId', 
      align: 'center', 
      width: 350, 
      className: styles.oneColumn,
    },
    { 
      title: 'Shipment名称', 
      dataIndex: 'shipmentName',
      key: 'shipmentName',
      width: 120,
      render(val: string, record: { mwsShipmentId: string }) {
        return <AsyncEditBox 
          onOk={(newVal) => {
            changeShipmentName(newVal, record.mwsShipmentId);
            return Promise.resolve(true);
          }} 
          value={val}
          maxLength={100}
          style={{ padding: 0 }}
        />;
      },
    },
    { 
      title: '产品种类', 
      dataIndex: 'productCategory', 
      key: 'productCategory',
      width: 100,
      align: 'center',
    },
    { 
      title: '申报量', 
      dataIndex: 'declareNum', 
      key: 'declareNum',
      width: 100,
      align: 'center',
    },
    { 
      title: '亚马逊仓库代码', 
      dataIndex: 'destinationFulfillmentCenterId', 
      key: 'destinationFulfillmentCenterId',
      width: 150,
    },
  ];

  const expandedRowRender = (props: planList.IHandlePageRecord) => {
    const columns = [
      { 
        title: '图片/标题/ASIN/SKU',
        dataIndex: 'itemName', 
        key: 'itemName', 
        align: 'center', 
        width: 350,
        className: styles.oneColumn,
        render(title: string, record: { 
          asin1: string;
          sku: string;
          site: string;
          url: string;
          storeId: string;
        }) {
          const { 
            asin1,
            sku,
            site,
            url,
            storeId,
          } = record;
          return <div className={styles.productCol}>
            <GoodsImg src={url} alt="商品" width={40}/>
            <div className={styles.details}>
              <a
                href={getAmazonAsinUrl(record.asin1, site as API.Site)} 
                className={styles.title}
                title={title}
              >
                <Iconfont type="icon-lianjie" className={styles.linkIcon}/>{title}</a>
              <footer>
                <span 
                  onClick={() => toAsin(asin1, storeId)}
                  className={styles.asin}>{asin1} 
                </span>
                <span className={styles.sku}>{sku}</span>
              </footer>
            </div>
          </div>; 
        },
      },
      { 
        title: 'MSKU/FnSKU', 
        dataIndex: 'sellerSku', 
        key: 'sellerSku', 
        width: 200,
        render(val: string, { fnsku }: { fnsku: string}) {
          return <>
            <p>{val}</p>
            <p>{fnsku}</p>
          </>;
        },
      },
      {
        title: '数量',
        key: 'available',
        dataIndex: 'available',
      },
    ];

    return <Table columns={columns as []} expandable={{
    }} dataSource={props.products as []} 
    pagination={false} 
    rowKey={(record: { sellerSku: string}) => record.sellerSku} 
    />;
  };


  return <div className={styles.box}>
    <Table
      className={classnames(styles.table, 'components-table-demo-nested')}
      columns={columns as []}
      rowClassName={styles.tow}
      expandable={{
        expandedRowRender: expandedRowRender,
        expandIconColumnIndex: 5,
        indentSize: 0,
      }}
      dataSource={data}
      scroll={{
        y: 316,
        x: 'max-content',
      }}
      pagination={false}
      rowKey={(record: { mwsShipmentId: string}) => record.mwsShipmentId}
      expandIcon= {({ expanded, onExpand, record }) =>
        expanded ? (
          <div className={classnames(
            styles.showCol,
            styles.active
          )} onClick={e => onExpand(record, e)}>
            收起
            <Iconfont type="icon-zhankai" className={styles.arrow}/>
          </div>
        ) : (
          <div className={styles.showCol} onClick={e => onExpand(record, e)}>
            展开
            <Iconfont type="icon-zhankai" className={styles.arrow}/>
          </div>
        )}
    />
  </div>;
};

export default DisposePage;
