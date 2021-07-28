/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 17:03:33
 * @LastEditTime: 2021-04-22 11:31:05
 */
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import GoodsImg from '@/pages/components/GoodsImg';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { Link } from 'umi';
import { asinPandectBaseRouter } from '@/utils/routes';
import { 
  message,
  Table,
} from 'antd';

interface IParams {
  // dispose: boolean;
  // verify: boolean;
  site: API.Site;
  data: DispatchList.IProductVos[]|null; // 商品明细 ， null是未请求的初始值，不管加载后，是否有值，都返回数组
}

const ProductCol: React.FC<IParams> = props => {
  const {
    site,
    data,
  } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DispatchList.IProductVos[]>(data || []);

  useEffect(() => {
    Array.isArray(data) && (
      setLoading(false),
      setDataSource(data)
    );
  }, [data]);
  
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
      key: 'itemName',
      dataIndex: 'itemName',
      align: 'center',
      width: 380,
      className: styles.productCol,
      render(val: string, record: DispatchList.IProductVos) {
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
      width: 130,
      render(val: string, { fnsku }: DispatchList.IProductVos) {
        return <div>
          <p>{val}</p>
          <p>{fnsku}</p>
        </div>;
      },
    },
    {
      title: '已发量',
      key: 'issuedNum',
      dataIndex: 'issuedNum',
      align: 'center',
      width: 100,
    },
    {
      title: '已收量',
      key: 'receiveNum',
      dataIndex: 'receiveNum',
      align: 'center',
      width: 100,
    },
    {
      title: '差异量',
      key: 'disparityNum',
      dataIndex: 'disparityNum',
      align: 'center',
      width: 100,
    },
    {
      title: '库位号',
      key: 'locationNo',
      dataIndex: 'locationNo',
      align: 'center',
      width: 200,
    },
    {
      title: '操作',
      key: 'handle',
      align: 'center',
      dataIndex: 'name',
      width: 100,
      render() {
        return (
          <span className={styles.handleCol} onClick={() => message.warning('功能未开放')}>
            打印标签
          </span>
        );
      },
    },
  ];

  const productConfig = {
    rowKey: (record: {id: string}) => record.id,
    pagination: false as false,
    columns: columns as [],
    dataSource: dataSource,
    loading: loading,
    className: styles.productTable,
    scroll: {
      y: 316,
    },
  };
  
  return <Table {...productConfig}/>;
};

export default ProductCol;
