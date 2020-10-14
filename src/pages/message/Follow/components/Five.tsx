import React from 'react';
import { Link } from 'umi';
import { Iconfont } from '@/utils/utils';
import styles from './common.less';

interface IProps {
  data: Message.IFollowDataType;
  currency: string;
}

// 情况5
const Five: React.FC<IProps> = (props) => {
  const {
    data,
    currency,
  } = props;

  return (
    <div className={`${styles.five} ${styles.common}`}>
      <span className={styles.leftName}>发现{data.followSellerQuantity}个跟卖者</span>
      <p className={styles.freight}>
        <span className={styles.text}>运费：</span>
        {
          currency + (
            data.followSellers[0] && data.followSellers[0].shippingFee ? data.followSellers[0].shippingFee : '0'
          ) 
        }
      </p>
      <p className={styles.details}>
        <Link to={{
          pathname: '/follow/list',
          search: `?id=${data.followMonitorHistoryId}`,
        }} className={styles.details}>
          详情
          <Iconfont type="icon-zhankai-copy" className={styles.icon} style={{
            marginLeft: 7,
            color: '#999',
          }}/>
        </Link>
        <span className={styles.date}>{data.catchDate}</span>
      </p>
    </div>
  );
};

export default Five;
