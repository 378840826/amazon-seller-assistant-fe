import React from 'react';
import defaultImage from '@/assets/default.svg';
import { Typography } from 'antd';
import ShowData from '@/components/ShowData';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';
interface IOrderDetail{
  key: number;
  item: API.IParams;
  bottom: string;
}
const { Paragraph } = Typography;

const OrderDetail: React.FC<IOrderDetail> = ({ item, key, bottom }) => {
  const contentStyle = {
    paddingTop: '20px',
    paddingBottom: bottom,
  };
  return (
    <div key={key}> 
      <div style={contentStyle}>
        <div className={styles.imgContainer}>
          <img src={item.imgLink} onError={(e) => { 
            e.target.onerror = null;e.target.src = `${defaultImage}` ; 
          }} />
        </div>
        
        <Paragraph title={item.title} className={styles.title_link} ellipsis={{ rows: 2 }}>
          <Iconfont className={styles.icon_link} type="icon-lianjie"/>
          <a href={item.titleLink} rel="noreferrer" target="_blank">
            {item.title}
          </a>
        </Paragraph>
     
        <div className={styles.same}>
          <div>{item.asin}</div>
          <div>{item.sku}</div>
          <div>数量：{item.quantity}</div>
          <div>
            单价: <ShowData value={item.unitPriceitem} isCurrency />
          </div>
                  
          <div className={styles.ellipsis}>
            <div style={{ width: '70px' }}>价格合计：</div>
            <Paragraph ellipsis>
              <ShowData value={item.price} isCurrency />
              <span>（优惠<ShowData value={item.itemPromotionDiscount} isCurrency />)</span>
            </Paragraph>
          </div>
          <div className={styles.ellipsis}>
            <div style={{ width: '60px' }}>配送费：</div>
            <Paragraph ellipsis>
              <ShowData value={item.shippingPrice} isCurrency />
              <span>（优惠<ShowData value={item.shipPromotionDiscount} isCurrency />)</span>
            </Paragraph>
          </div>
          <div className={styles.ellipsis}>
            <div style={{ width: '50px' }}>小计：</div>
            {item.subTotal === ''
              ? '' 
              : 
              <Paragraph ellipsis>
                <ShowData value={item.subTotal} isCurrency />
              </Paragraph>
            }
          </div>
          <div>发货状态：{item.deliverStatus}</div>
          <div className={styles.ellipsis}>
            <div style={{ width: '70px' }}>物流单号：</div>
            <Paragraph ellipsis>
              {item.courierNumber}
              {
                item.courierNumber !== '' ?
                  <span>({item.courierNumber})</span>
                  :
                  ''
              }
            </Paragraph>
            
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;
