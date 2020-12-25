import React, { useState } from 'react';
import styles from './index.less';
import {
  Popover,
  Spin,
  Tooltip,
} from 'antd';
import { useSelector, useDispatch } from 'umi';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { getCalendarFields } from '../config';
import { storageKeys } from '@/utils/huang';
import { storage } from '@/utils/utils';
import GoodsImg from '@/pages/components/GoodsImg';

const { adinTableCalendar } = storageKeys;
interface IProps {
  asin: string;
  callback: (asin: string) => void;
}

const Demo: React.FC<IProps> = (props) => {
  const {
    asin,
  } = props;
  const dispatch = useDispatch();
 
  const {
    id: StoreId,
    sellerId,
    currency,
    marketplace,
  } = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // 加载完
  const [data, setData] = useState<AsinTable.IChildRsType[]>([]);

  const clickDetail = () => {
    setLoading(true);
    setVisible(!visible);
    new Promise((resolve, reject) => {
      dispatch(({
        type: 'asinTable/getChildRs',
        payload: {
          asin,
          sellerId,
          marketplace,
          headersParams: {
            StoreId,
          },
          ...getCalendarFields(storage.get(`${adinTableCalendar}_dc_itemKey`) || '7', adinTableCalendar),
        },
        resolve,
        reject,
      }));
    }).then(datas => {
      setLoading(false);
      const {
        data: {
          records,
        },
      } = datas as {
        data: {
          records: AsinTable.IChildRsType[];
        };
      };
      setData(records);
    });
  };
  return <Popover
    content={
      <div className={styles.contentBox} key={Math.random()}>
        <Spin spinning={loading} className={styles.loading}></Spin>
        <div className={styles.listBox}>
          {
            data.map((item, i) => {
              return <div key={i} className={styles.item}>
                <span className={styles.num}>{i + 1}</span>
                <GoodsImg src={item.imgUrl} alt="商品" className={styles.productImg} width={50}/>
                <div className={styles.details}>
                  <a href={getAmazonAsinUrl(asin, marketplace)} 
                    className={styles.title}
                    target="_blank" rel="noreferrer"
                  >
                    <Iconfont type="icon-lianjie" className={styles.icon} />
                    {item.title}
                  </a>
                  <p className={styles.p}>
                    <a href={getAmazonAsinUrl(asin, marketplace)} 
                      className={styles.asin}
                      target="_blank" rel="noreferrer"
                    >{item.asin}</a>
                    <span className={styles.price}>{item.price ? currency + item.price : ''}</span>
                  </p>
                  <p className={styles.p}>
                    <span className={styles.sku}>{item.sku}</span>
                    <span>{item.associateSalesTimes || 0} 次</span>
                  </p>
                  <Tooltip 
                    title={`大类排名：#${
                      item.categoryRanking ? item.categoryRanking : ''
                    } ${item.categoryName ? item.categoryName : ''}`} 
                    placement="bottomLeft">
                    <span className={styles.ranking}>#{item.categoryRanking}</span> 
                    {item.categoryName}
                  </Tooltip>
                </div>
              </div>;
            })
          }
          {
            loading === false && data.length === 0 ? <h2 className={styles.notTable}>无关联销售订单</h2> : ''
          }
        </div>
      </div>
    }
    title={`${asin}关联销售详情`}
    trigger="click"
    visible={visible}
    placement="left"
    overlayClassName={styles.relatedSalesBox}
    destroyTooltipOnHide
    arrowPointAtCenter
    onVisibleChange={visible => setVisible(visible)}
  >
    <span onClick={clickDetail} className={`
      ${styles.showRsText}
      ${visible ? styles.active : ''}
    `}>详情</span>
  </Popover>;
};


export default Demo;
