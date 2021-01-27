import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Popover,
  Spin,
  Tooltip,
} from 'antd';
import { useSelector, useDispatch } from 'umi';
import { Iconfont, getAmazonAsinUrl } from '@/utils/utils';
import { storageKeys } from '@/utils/huang';
import { storage } from '@/utils/utils';
import GoodsImg from '@/pages/components/GoodsImg';
import { getCalendarFields } from '../config';

interface IProps {
  asin: string;
}

const { adinTableCalendar } = storageKeys;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AsinTable.IChildRsType[]>([]);

  const clickDetail = () => {
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

  const content = function() {
    return <div className={styles.contentBox}>
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
    </div>;
  };

  return (
    <Popover placement="left" 
      title={`${asin}关联销售详情`}
      content={content()} 
      trigger="click" 
      overlayClassName={styles.relatedSalesBox}
      autoAdjustOverflow
      visible={visible}
      onVisibleChange={v => setVisible(v)}
    >
      <span className={classnames(
        styles.showRsText,
        visible ? styles.active : '',
      )} onClick={clickDetail}>详情</span>
    </Popover>
  );
};
export default Demo;
