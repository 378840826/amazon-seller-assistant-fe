import React from 'react';
import LazyLoad from 'react-lazy-load';
import defaultImage from '@/assets/stamp.png';
import styles from './index.less';
import classnames from 'classnames';
import ShowData from '@/components/ShowData';
import { Typography } from 'antd';
const { Paragraph } = Typography;
import { Iconfont } from '@/utils/utils';

interface IColumnOrderProps{
  item: API.IParams;
  className?: string;
}
const ColumnOrderInfo: React.FC<IColumnOrderProps> = ({ item, className }) => {   
  console.log('item:', item);
  return (
    <div className={classnames({ [styles.single_orderInfo]: true }, 
      { [`${className}`]: className !== undefined })}>
      <div className={styles.img}>
        <LazyLoad height={'100%'} width={'100%'} offsetVertical={100}>
          <img src={item.image === '' ? defaultImage : item.image} onError={(e) => { 
            e.target.onerror = null;e.target.src = `${defaultImage}` ; 
          }} />
        </LazyLoad>
      </div> 
      <div className={styles.column_img_right}>
        <div className={styles.link_part}>
          <Paragraph title={item.title} ellipsis className={styles.typography}>
            <Iconfont className={styles.icon_link} type="icon-lianjie"/>
            <a 
              href={item.titleLink ? item.titleLink : `javascript:void(0);`} 
              target={item.titleLink ? '_blank' : '_self'}
              rel="noreferrer">
              { item.title === '' ? <div className="null_bar"></div> : <span>{item.title}</span>} 
            </a>
          </Paragraph>
        </div>
        <div className={styles.asin_sku}>
          {item.asin === '' ? <div className="null_bar"></div> : <span className={styles.__asin}>{item.asin}</span>}
          <div>
            <span className={styles.__star}>
              <ShowData fillNumber={0} value={item.reviewAvgStar}/>
            </span>
            <span className={styles.__count}>
              (<ShowData fillNumber={0} value={item.reviewCount}/>)
            </span>
            
          </div>
          <span className={styles.__price}><ShowData isCurrency isMoney value={item.price}/></span>
        </div>
      </div>
    </div>
  );
};
export default ColumnOrderInfo;
