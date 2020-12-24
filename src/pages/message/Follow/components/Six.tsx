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
    <div className={`${styles.six} ${styles.common}`}>
      <span className={styles.leftName}>Buybox被跟卖者占领</span>
      <div className={styles.gather}>
        <p className={styles.seller} 
          title={
            data.followSellers[0] 
            && data.followSellers[0].sellerName
          }
        >
          <span className={styles.gatherText}>卖家：</span>
          {data.followSellers[0] && data.followSellers[0].sellerName}
        </p>
        <p className={styles.id}>
          <span className={styles.gatherText}>ID：</span>
          {data.followSellers[0].sellerId}
        </p>
        <p className={styles.method}>FBA</p>
        <p className={styles.price}>
          <span className={styles.gatherText}>价格：</span>
          <ShowData value={data.followSellers[0].price} isCurrency/>
        </p>
        <p className={styles.freight}>
          <span className={styles.text}>运费：</span>
          {
            data.followSellers[0] 
            && data.followSellers[0].shippingFee ? 
              <ShowData value={data.followSellers[0].shippingFee} isCurrency />  
              : <ShowData value={0} isCurrency />
          }
        </p>
      </div>
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
  );
};

export default Five;
