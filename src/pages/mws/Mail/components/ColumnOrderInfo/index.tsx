import React from 'react';
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
      <div>
        {info.map((item, index) => {
          return (
            <div key={index} className={styles.single_orderInfo}>
              <div className={styles.img}>
                <img src={item.imgLink}/>
              </div> 
              <div className={styles.column_img_right}>
                <div className={styles.link_part}>
                  <a onClick={(e) => e.stopPropagation()} href={item.titleLink} target="_blank" rel="noreferrer">
                    <Paragraph ellipsis className={styles.typography}>
                      <Iconfont className={styles.icon_link} type="icon-lianjie"/>
                      <span>{item.title}</span>
                    </Paragraph>
                    
                  </a>
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
