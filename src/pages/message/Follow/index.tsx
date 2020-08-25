import React from 'react';
import styles from './index.less';
import FiveComponent from './components/Five';
import SixComponent from './components/Six';
import Outer from './components/Other';
import { getAmazonAsinUrl } from '@/utils/utils';
import {
  useSelector,
} from 'umi';


interface IProps {
  data: Message.IFollowDataType;
}

const Follow: React.FC<IProps> = (props) => {
  const {
    data,
  } = props;

  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  return <div className={styles.follow}>
    <div className={styles.oneRow}>
      <p>
        <span className={styles.text}>ASIN：</span>
        <a 
          href={`${getAmazonAsinUrl(data?.asin || '', currentShop.marketplace)}`}
          target="_blank"
          rel="noreferrer"
        >{data.asin}</a>
      </p>
      <p>
        <span className={styles.text}>时间：</span>
        <span>{data.catchTime}</span>
      </p>
    </div>
    {
      
      // eslint-disable-next-line
      data.followSellerQuantity >= 1 
        ? 
        <FiveComponent // 情况5(当跟卖者数量达到若干个)
          data={data} 
          key={data.id} 
          currency={currentShop.currency}
        />
        : 
        data.buyboxOccupied 
          ? <SixComponent // 情况6(当buybox卖家不是我)
            data={data} 
            key={data.id} 
            currency={currentShop.currency}
          /> 
          : <Outer data={data} key={data.id} currency={currentShop.currency} />
    }
  </div>;
};

export default Follow;
