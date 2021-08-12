/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 17:03:33
 * @LastEditTime: 2021-04-23 16:31:50
 */
import React, { useState } from 'react';
import styles from './index.less';
import GoodsImg from '@/pages/components/GoodsImg';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { Link } from 'umi';
import { asinPandectBaseRouter } from '@/utils/routes';
import InputEditBox from '@/pages/fba/components/InputEditBox';
import { 
  Table,
  message,
} from 'antd';
import Lebal from './label';

interface IProps {
  dispose: boolean;
  verify: boolean;
  site: API.Site;
  data: Shipment.IProductList[];
  updateDeclared: (newNumber: number, index: number) => void;
  delProduct: (id: string) => void; // 删除商品
}

interface ILabelType {
  modalvisible: boolean;
  recordData: Shipment.IProductList;  
}

const Product: React.FC<IProps> = props => {
  const {
    site,
    data,
    updateDeclared,
    delProduct,
  } = props;

  const [lebalModalData, setLabelModalData] = useState<ILabelType>({
    modalvisible: false,
    recordData: {
      id: '-1',
      url: '',
      itemName: '',
      asin1: '',
      sku: '',
      sellerSku: '',
      fnsku: '',
      declareNum: 0,
      issuedNum: 0,
      receiveNum: 0,
      mskuState: '',
    },   
  });

  const columns = [
    {
      title: <>
        图片
        <span className="secondary-text">/</span>
        标题
        <span className="secondary-text">/</span>
        ASIN
        <span className="secondary-text">/</span>
        SKU
      </>,
      key: 'sss',
      dataIndex: 'name',
      align: 'center',
      width: 380,
      className: styles.productCol,
      render(val: string, record: Shipment.IProductList) {
        const { 
          itemName,
          asin1,
          sku,
          url,
        } = record;
        return <div className={styles.productCol}>
          <GoodsImg src={url} alt="商品" width={40}/>
          <div className={styles.details}>
            <a href={getAmazonAsinUrl(val, site)} 
              className={styles.title}
              target="_blank"
              rel="noreferrer"
              title={itemName}
            >
              <Iconfont type="icon-lianjie" className={styles.linkIcon}/>{itemName}</a>
            <footer>
              <Link 
                to={`${asinPandectBaseRouter}?asin=${asin1}`} 
                className={styles.asin}>{asin1}
              </Link>
              <span className={styles.sku}>{sku}</span>
            </footer>
          </div>
        </div>;
      },
    },
    {
      title: <>
        MSKU
        <span className="secondary-text">/</span>
        FnSKU
      </>,
      key: 'sellerSku',
      dataIndex: 'sellerSku',
      align: 'left',
      width: 230,
      render(val: string, { fnsku }: Shipment.IProductList) {
        return <div>
          <p>{val}</p>
          <p>{fnsku}</p>
        </div>;
      },
    },
    {
      title: '申报量',
      key: 'declareNum',
      dataIndex: 'declareNum',
      align: 'center',
      render(val: number, _: {}, index: number ) {
        return <InputEditBox 
          value={String(val)} 
          chagneCallback={(val) => updateDeclared(val as number, index)} 
        />;
      },
    },
    {
      title: '已发量',
      key: 'issuedNum',
      dataIndex: 'issuedNum',
      align: 'center',
    },
    {
      title: '已收量',
      key: 'receiveNum',
      dataIndex: 'receiveNum',
      align: 'center',
    },
    {
      title: '状态',
      key: 'mskuState',
      dataIndex: 'mskuState',
      align: 'center',
    },
    {
      title: '操作',
      key: 'handle',
      align: 'center',
      dataIndex: 'id',
      width: 100,
      render: (id: string, record: Shipment.IProductList ) => (
        <>
          <span className={styles.handleCol} onClick={() => {
            setLabelModalData({ modalvisible: true, recordData: record }); 
          }}>打印标签</span>
          <span className={styles.handleCol} onClick={() => message.warning('功能未开放')}>创建加工单</span>
          <span className={styles.handleCol} onClick={() => delProduct(id)}>删除</span>
        </>
      ),
    },
  ];

  const productConfig = {
    pagination: false as false,
    columns: columns as [],
    dataSource: data as [],
    className: styles.productTable,
    scroll: {
      y: 316,
    },
  };
  
  return <>
    <Table {...productConfig}/>
    <Lebal site={site} data={data} modalData={lebalModalData} onCancle={() => {
      lebalModalData.modalvisible = false; setLabelModalData({ ...lebalModalData });
    }}></Lebal>
  </>;
};

export default Product;
