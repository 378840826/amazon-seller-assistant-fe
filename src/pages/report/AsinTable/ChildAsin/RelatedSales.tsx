import React, { useState, useEffect } from 'react';
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
  const childControlRSASIN = useSelector(
    (state: AsinTable.IDvaState) => state.asinTable.childControlRSASIN
  );
  const {
    id: StoreId,
    sellerId,
    currency,
    marketplace,
  } = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // 加载完
  const [data, setData] = useState<AsinTable.IChildRsType[]>([]);

  useEffect(() => {
    if (childControlRSASIN === asin) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [childControlRSASIN, asin]);

  const clickDetail = () => {
    dispatch({
      type: 'asinTable/changechildControlRSASIN',
      payload: asin,
    });

    setLoading(true);
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
          ...getCalendarFields(storage.get(adinTableCalendar), adinTableCalendar),
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


  useEffect(() => {
    document.addEventListener('click', () => {
      setVisible(false);
    });
  }, [visible]);

  const content = () => {
    return <div className={styles.contentBox}>
      <Spin spinning={loading} className={styles.loading}></Spin>
      <div className={styles.listBox}>
        {
          data.map((item, i) => {
            return <div key={i} className={styles.item}>
              <span className={styles.num}>{i + 1}</span>
              <img src={item.imgUrl} alt="" className={styles.productImg}/>
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
                  <span>{item.sku}</span>
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
          loading === false && data.length === 0 ? <h2 className={styles.notTable}>暂无关联销售数据</h2> : ''
        }
      </div>
    </div>;
  };
  
  return <div onClick={e => e.nativeEvent.stopImmediatePropagation()} >
    <span className="none">{asin}</span> {/* 这个没起显示作用，主要是为了解决bug，勿删除 */}
    <Popover
      content={content() as JSX.Element}
      title={`${asin}关联销售详情`}
      trigger="click"
      visible={visible}
      placement="left"
      overlayClassName={styles.relatedSalesBox}
      destroyTooltipOnHide
    >
      <span onClick={clickDetail} className={`
        ${styles.showRsText}
        ${visible ? styles.active : ''}
      `}>详情</span>
    </Popover>
  </div>;
};


export default Demo;
