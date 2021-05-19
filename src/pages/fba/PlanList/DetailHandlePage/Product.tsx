/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 17:03:33
 * @LastEditTime: 2021-05-18 13:40:19
 */
import React from 'react';
import styles from './index.less';
import GoodsImg from '@/pages/components/GoodsImg';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { useDispatch, history } from 'umi';
import { asinPandectBaseRouter } from '@/utils/routes';
import InputEditBox from '@/pages/fba/components/InputEditBox';
import { 
  Table,
} from 'antd';

interface IParams {
  dispose: boolean;
  verify: boolean;
  data: planList.IProductList[];
  changeShenBaoLiangCallback: (id: string, newValue: number) => void; // 修改申报量
  delProduct: (id: string) => void; // 删除商品
  shopId?: string;
  setBatchProduct: (selectRowKeys: string[]) => void;
}


const ProductCol = function(props: IParams) {
  const {
    verify,
    dispose,
    data,
    changeShenBaoLiangCallback,
    delProduct,
    shopId,
    setBatchProduct,
  } = props;
  const dispatch = useDispatch();


  // 应用可发量
  const appleVaild = function() {
    console.log('应用可发量');
    
  };

  // 跳转到新窗口
  const toAsin = function(asin: string) {
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
      title: <>
        图片
        <span className="secondary-text">/</span>
        标题
        <span className="secondary-text">/</span>
        ASIN
        <span className="secondary-text">/</span>
        SKU
      </>,
      key: 'asin1',
      dataIndex: 'asin1',
      align: 'center',
      width: 380,
      className: styles.productCol,
      render(
        val: string, 
        record: { url: string; itemName: string; asin1: string; sellerSku: string }
      ) {
        const { 
          itemName,
          asin1,
          sellerSku,
          url,
        } = record;
        return <div className={styles.productCol}>
          <GoodsImg src={url} alt="商品" width={40}/>
          <div className={styles.details}>
            <a href={getAmazonAsinUrl(asin1, 'UK')} 
              className={styles.title}
              target="_blank"
              rel="noreferrer"
              title={itemName}
            >
              <Iconfont type="icon-lianjie" className={styles.linkIcon}/>{itemName}</a>
            <footer>
              <span 
                onClick={() => toAsin(asin1)}
                className={styles.asin}>{asin1}
              </span>
              <span className={styles.sku}>{sellerSku}</span>
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
      render(val: string, record: { fnsku: string}) {
        return <>
          <p>{val}</p>
          <p>{record.fnsku}</p>
        </>;
      },
    },
    {
      title: '申报量',
      key: 'declareNum',
      dataIndex: 'declareNum',
      align: 'center',
      width: 100,
      render(val: string, { id }: planList.IProductList) {
        // 已处理的货件不能再修改申报量，其它情况下都可以申请
        return <div className={styles.applyCol}>
          {dispose ? val : <InputEditBox 
            value={String(val)}
            chagneCallback={val => changeShenBaoLiangCallback(id, val)} /> }
          {
            !dispose && verify && <p className={styles.apply} onClick={appleVaild}>应用可发量</p>
          }
        </div>;
      },
    },
    {
      title: '国内仓可发量',
      key: 'verifyNum',
      dataIndex: 'verifyNum',
      align: 'center',
      width: 100,
    },
    {
      title: '库存缺口',
      key: 'disparityNum',
      dataIndex: 'disparityNum',
      sorter: true,
      align: 'center',
      width: 100,
    },
  ];

  const handleCol = {
    title: '操作',
    key: 'id',
    align: 'center',
    dataIndex: 'id',
    width: 50,  
    render(id: string) {
      return <span className={styles.handleCol} onClick={() => delProduct(id)}>删除</span>;
    },
  };

  const productConfig = {
    pagination: false as false,
    columns: columns as [],
    rowSelection: verify ? {
      onChange (selectedRowKeys: any[]) { // eslint-disable-line
        setBatchProduct([...selectedRowKeys]);
      },
    } : undefined,
    rowKey: (record: { id: number}) => record.id,
    dataSource: data as [],
    className: styles.productTable,
    scroll: {
      y: 316,
    },
  };

  if (!(verify && dispose)) {
    columns.push(handleCol as any); // eslint-disable-line
  }

  return <Table {...productConfig}/>;
  
};

export default ProductCol;
