import React from 'react';
import LazyLoad from 'react-lazy-load';
import defaultImage from '@/assets/stamp.png';
import styles from './index.less';
import classnames from 'classnames';
import { Typography } from 'antd';
const { Paragraph } = Typography;
import { Iconfont } from '@/utils/utils';

interface IColumnOrderProps{
  item: API.IParams;
  className?: string;
}
const ColumnOrderInfo: React.FC<IColumnOrderProps> = ({ item, className }) => {   
  return (
    <div className={classnames({ [styles.single_orderInfo]: true }, 
      { [`${className}`]: className !== undefined })}>
      <div className={styles.img}>
        <LazyLoad height={'100%'} width={'100%'} offsetVertical={100}>
          <img src={item.imgLink} onError={(e) => { 
            e.target.onerror = null;e.target.src = `${defaultImage}` ; 
          }} />
        </LazyLoad>
      </div> 
      <div className={styles.column_img_right}>
        <div className={styles.link_part}>
          <Paragraph title={item.title} ellipsis className={styles.typography}>
            <Iconfont className={styles.icon_link} type="icon-lianjie"/>
            <a onClick={(e) => e.stopPropagation()} href={item.titleLink} target="_blank" rel="noreferrer">
              <span>{item.title}</span>
            </a>
          </Paragraph>
        </div>
        <div className={styles.asin_sku}>
          {item.asin}
        </div>
      </div>
    </div>
  );
};
export default ColumnOrderInfo;
