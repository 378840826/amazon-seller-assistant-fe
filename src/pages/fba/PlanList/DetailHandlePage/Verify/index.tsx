/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 14:41:31
 * @LastEditTime: 2021-05-19 11:48:26
 * 
 * 核实页面 
 */
import React from 'react';
import styles from './index.less';
import GoodsImg from '@/pages/components/GoodsImg';
import { Iconfont } from '@/utils/utils';
import { useDispatch, history } from 'umi';
import { asinPandectBaseRouter } from '@/utils/routes';
import InputEditBox from '@/pages/fba/components/InputEditBox';
import { Table } from 'antd';
import Print from './Print';

interface IProps {
  id: string;
  data: planList.IVerifyProductRecord[];
  theadData: planList.IPlanDetail|null;
  changeVerifyNum: (newValue: number, id: string) => void;
  shopId?: string;
  areCasesRequired?: boolean;
}


interface IData extends planList.IPlanDetail{
  modifys: planList.ILog[];
  products: planList.IProductList[];
}

const Verify: React.FC<IProps> = props => {

  const dispatch = useDispatch();
  // 跳转到新窗口
  const toAsin = function(asin: string) {
    dispatch({
      type: 'global/setCurrentShop',
      payload: {
        id: props.shopId,
      },
    });

    setTimeout(() => {
      history.push(`${asinPandectBaseRouter}?asin=${asin}`);
    }, 10);
  };

  const { data = [], theadData, changeVerifyNum } = props;
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
      render(
        val: string, 
        record: { 
          url: string; 
          itemName: string; 
          asin1: string; 
          sellerSku: string; 
          itemNameNa: string;
        }
      ) {
        const { 
          itemName,
          itemNameNa,
          asin1,
          sellerSku,
          url,
        } = record;
        return <div className={styles.productCol}>
          <GoodsImg src={url} alt="商品" width={40}/>
          <div className={styles.details}>
            <a 
            // href={getAmazonAsinUrl(asin1, site)} 
              className={styles.title}
              target="_blank"
              rel="noreferrer"
              title={itemName}
            >
              <Iconfont type="icon-lianjie" className={styles.linkIcon}/>{itemName}</a>
            <p>{itemNameNa}</p>
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
    },
    {
      title: '国内仓可发量',
      key: 'verifyNum',
      dataIndex: 'verifyNum',
      align: 'center',
      width: 100,
      render(val: string, record: { id: string }) {
        console.log('recore', record);
        return <InputEditBox value={val} chagneCallback={v => changeVerifyNum(v, record.id)} />;
      },
    },
    {
      title: '库存缺口',
      key: 'disparityNum',
      dataIndex: 'disparityNum',
      align: 'center',
      width: 100,
    },
    {
      title: '库位号',
      key: 'result',
      dataIndex: 'result',
      align: 'center',
      width: 200,
      render(result: planList.IKuWeiInfo[]) {
        return <div>
          {result && result.map((item, index) => {
            return <p key={index}>
              {item.warehouseName}{item.locationNo}
              {index > 0 && result.length !== index + 1 && '、'}
            </p>;
          })}
        </div>;
      },
    },
  ];


  const productConfig = {
    pagination: false as false,
    columns: columns as [],
    rowSelection: {
      selectedRowKeys: [],
    },
    rowKey: (record: { id: string }) => record.id,
    dataSource: data as [],
    className: styles.productTable,
    scroll: {
      y: 316,
    },
  };

  return <>
    <header className={styles.header}>
      <span className={styles.text}>商品明细</span>
      <Print product={data} theadData={theadData} areCasesRequired={props.areCasesRequired}/>
    </header>
    <Table {...productConfig}/>
  </>;
};


export default Verify;
