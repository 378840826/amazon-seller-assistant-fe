import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { Iconfont } from '@/utils/utils';
import styles from './common.less';

interface IProps {
  data: Message.IFollowDataType;
  currency: string;
}

// 情况1 2 3 4
const Outer: React.FC<IProps> = (props) => {
  const {
    data,
    currency,
  } = props;

  const [visible, setSivible] = useState<boolean>(true);
  const [showText, setShowText] = useState<string>('展开');

  const handleVisible = () => {
    setSivible(!visible);
  };

  useEffect(() => {
    visible === true ? setShowText('展开') : setShowText('收起');
  }, [visible]);

  return (
    // 跟卖者大于1时，显示跟卖者1 跟卖者2  .... 否则显示跟卖者
    <div className={`${styles.other} ${styles.common}`}>
      <div className={styles.gatherBox} style={{
        height: visible ? 20 : 'auto',
      }}>
        {
          data.followSellers.map((item, i) => {
            return <div className={styles.gather} key={i}>
              <span className={styles.leftName}>
                {data.followSellers.length === 1 ? '跟卖者' : `跟卖者${i + 1}`}
              </span>
              <p className={styles.seller} title={item.sellerName}>
                <span className={styles.gatherText}>卖家：</span>
                {item.sellerName}
              </p>
              <p className={styles.id}>
                <span className={styles.gatherText}>ID：</span>
                {item.sellerId}
              </p>
              <p className={styles.method}>FBA</p>
              <p className={styles.price}>
                <span className={styles.gatherText}>价格：</span>
                {currency}{item.price}
              </p>
              <p className={styles.freight}>
                <span className={styles.text}>运费：</span>
                {
                  currency + (
                    item.shippingFee ? item.shippingFee : '0'
                  ) 
                }
              </p>
            </div>;
          })
        }
      </div>
      <div className={styles.right}>
        {
          data.followSellers.length > 1 ? <span 
            className={styles.show}
            onClick={handleVisible}
          >
            {showText}<Iconfont 
              type="icon-zhankai"
              style={{
                marginLeft: 7,
              }}
              className={
                `${styles.icon} ${visible ? '' : 'active' }`
              }/>
          </span> : ''
        }
        <p className={styles.dates}>
          <Link to={{
            pathname: '/follow/list',
            search: `?id=${data.followMonitorHistoryId}`,
          }} className={styles.details}>
            详情
            <Iconfont type="icon-zhankai-copy" style={{
              marginLeft: 7,
              color: '#999',
            }}/>
          </Link>
          <span className={styles.date}>{data.catchDate}</span>
        </p>
      </div>
    </div>
  );
};

export default Outer;