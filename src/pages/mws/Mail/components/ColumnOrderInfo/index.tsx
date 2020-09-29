import React from 'react';
import LazyLoad from 'react-lazy-load';
import defaultImage from '@/assets/stamp.png';
import styles from './index.less';
import { Typography } from 'antd';
const { Paragraph } = Typography;
import { Iconfont } from '@/utils/utils';

interface IColumnOrderProps{
  info: API.IParams[];
}
const ColumnOrderInfo: React.FC<IColumnOrderProps> = ({ info }) => {

  if (info.length > 0){
    return (
      <div className={styles.info_sum}>
        {info.map((item, index) => {
          return (
            <div key={index} className={styles.single_orderInfo}>
              <div className={styles.img}>
                <LazyLoad height={'100%'} width={'100%'} offsetVertical={100}>
                  <img src={item.imgLink} onError={(e) => { 
                    e.target.onerror = null;e.target.src = `${defaultImage}` ; 
                  }} />
                </LazyLoad>
              </div> 
              <div className={styles.column_img_right}>
                <div className={styles.link_part}>
                  <Paragraph ellipsis className={styles.typography}>
                    <Iconfont className={styles.icon_link} type="icon-lianjie"/>
                    <a onClick={(e) => e.stopPropagation()} href={item.titleLink} target="_blank" rel="noreferrer">
                      <span>{item.title}</span>
                    </a>
                  </Paragraph>
                    
                 
                </div>
                <div className={styles.asin_sku}>
                  <span className={styles.asin}>{item.asin}</span>
                  <span className={styles.sku}>{item.sku}</span>
                </div>
                
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (<div className="null_bar"></div>);
};
export default ColumnOrderInfo;
