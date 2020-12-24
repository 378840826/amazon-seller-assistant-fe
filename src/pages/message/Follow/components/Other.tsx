import React, { useState, useEffect } from 'react';
import { Link } from 'umi';
import { Iconfont } from '@/utils/utils';
import styles from './common.less';
import { competitorListRouter } from '@/utils/routes';
import ShowData from '@/components/ShowData';


interface IProps {
  data: Message.IFollowDataType;
}

// 情况1 2 3 4
const Outer: React.FC<IProps> = (props) => {
  const {
    data,
  } = props;

  const [visible, setSivible] = useState<boolean>(true);
  const [showtext, setShowText] = useState<string>('展开');

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
                <ShowData value={item.price} isCurrency/>
              </p>
              <p className={styles.freight}>
                <span className={styles.text}>运费：</span>
                <ShowData value={item.shippingFee} isCurrency/>
              </p>
            </div>;
          })
        }
      </div>
      <div className={styles.right}>
        {
          data.followSellers.length > 1 ? <span 
            className={`${styles.show} ${showtext === '收起' ? 'primaryTextColor' : ''}`}
            onClick={handleVisible}
          >
            {showtext}<Iconfont 
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
            pathname: competitorListRouter,
            search: `?id=${data.followMonitorHistoryId}`,
          }} className={styles.details}>
            详情
            <Iconfont type="icon-zhankai" className={styles.icon} />
          </Link>
          <span className={styles.date}>{data.catchDate}</span>
        </p>
      </div>
    </div>
  );
};

export default Outer;
