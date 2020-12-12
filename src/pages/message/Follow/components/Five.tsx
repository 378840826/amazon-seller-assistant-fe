import React from 'react';
import { Link } from 'umi';
import { Iconfont } from '@/utils/utils';
import styles from './common.less';
import { competitorListRouter } from '@/utils/routes';
import ShowData from '@/components/ShowData';

interface IProps {
  data: Message.IFollowDataType;
}

// 情况5
const Five: React.FC<IProps> = (props) => {
  const {
    data,
  } = props;

  return (
    <div className={`${styles.five} ${styles.common}`}>
      <span className={styles.leftName}>发现{data.followSellerQuantity}个跟卖者</span>
      <p className={styles.freight}>
        <span className={styles.text}>运费：</span>
        {
          data.followSellers[0] 
          && data.followSellers[0].shippingFee ? 
            <ShowData value={data.followSellers[0].shippingFee} isCurrency />  
            : <ShowData value={0} isCurrency />
        }
      </p>
      <p className={styles.details}>
        <Link to={{
          pathname: competitorListRouter,
          search: `?id=${data.followMonitorHistoryId}`,
        }} className={styles.details}>
          详情
          <Iconfont type="icon-zhankai-copy" className={styles.icon} style={{
            marginLeft: 7,
            color: '#c1c1c1',
          }}/>
        </Link>
        <span className={styles.date}>{data.catchDate}</span>
      </p>
    </div>
  );
};

export default Five;
