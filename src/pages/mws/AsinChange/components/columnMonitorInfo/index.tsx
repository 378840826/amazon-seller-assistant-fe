import React from 'react';
import LazyLoad from 'react-lazy-load';
import defaultImage from '@/assets/stamp.png';
import styles from './index.less';
import { Typography } from 'antd';
const { Paragraph } = Typography;
import { Iconfont } from '@/utils/utils';

interface IColumnOrderProps{
  item: API.IParams;
}
const ColumnOrderInfo: React.FC<IColumnOrderProps> = ({ item }) => {   
  return (
    <div className={styles.single_orderInfo}>
      <div className={styles.img}>
        <LazyLoad height={'100%'} width={'100%'} offsetVertical={100}>
          <img src={item.imgLink} onError={(e) => { 
            e.target.onerror = null;e.target.src = `${defaultImage}` ; 
          }} />
        </LazyLoad>
      </div> 
      <div className={styles.column_img_right}>
        <div className={styles.link_part}>
          <Paragraph ellipsis={{ rows: 2 }} className={styles.typography}>
            <Iconfont className={styles.icon_link} type="icon-lianjie"/>
            <a onClick={(e) => e.stopPropagation()} href={item.titleLink} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          </Paragraph>
          
          
        </div>
        <div className={styles.asin_sku}>
          <span className={styles.asin}>{item.asin}</span>
          <div className={styles.price_method}>
            {item.price === '' ? 
              <div className="null_bar"></div> : 
              <div className={styles.price}>${item.price}</div>} 
            {item.fulfillmentChannel === '' ? 
              <div className="null_bar"></div> : 
              <div className={styles[item.fulfillmentChannel]}>{item.fulfillmentChannel}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ColumnOrderInfo;