import React, { useRef } from 'react';
import { Carousel } from 'antd';
import { Iconfont } from '@/utils/utils';
import OrderDetail from '../OrderDetail';
import styles from './index.less';
import { Typography } from 'antd';

const { Paragraph } = Typography;
interface IOrderInfo{
  info: API.IParams;
}
export const pathList = ['/mail/inbox', '/mail/reply', '/mail/no-reply'];
const OrderInfo: React.FC<IOrderInfo> = ({ info }) => {
  const slide = useRef<Carousel>(null);
  const orderDetails = Object.keys(info).length === 0 ? [] : info.orderDetails;
  const detailsLength = orderDetails.length;
  const carouselProps = {
    dots: detailsLength > 1 && detailsLength < 6 ? true : false, 
    showControl: detailsLength > 5 ? true : false,
  };
  const pathname = location.pathname;
  const height = pathList.indexOf(pathname) > -1 ? 'calc(100vh - 245px)' : 'calc(100vh - 200px)';

  const onPrevious = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    if (slide.current){
      slide.current.prev();
    }
  };
  const onNext = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    if (slide.current){
      slide.current.next();
    }
  };
  return (
    <div className={styles.orderInfo_overflow} style={{ height: height }}>
      <div className={styles.orderInfo}>
        <div className={styles.upper}>
          {
            carouselProps.showControl ?  
              <Iconfont className={styles.prev} 
                type="icon-xiangyoujiantou-copy" 
                onClick={(e) => onPrevious(e)}/>
              :
              ''
          }
          
          <Carousel 
            ref = {slide}
            className={styles.__carousel}
            {...carouselProps}
          >
            {
              orderDetails.map( (item: API.IParams, index: number) => {
                return (
                  <OrderDetail key={index} item={item} bottom={carouselProps.dots ? '40px' : '10px'}/>
                );
              })
            }
          </Carousel>
          {
            carouselProps.showControl ? 
              <Iconfont 
                className={styles.next} 
                type="icon-jiantou" 
                onClick={(e) => onNext(e)}/>
              :
              ''
          }
          
        </div>
        <div className={styles.down}>
          <Paragraph ellipsis>下单时间：{info.purchaseDate}</Paragraph>
          <Paragraph ellipsis>订单ID：{info.orderId}</Paragraph>
          <Paragraph ellipsis>订单状态：<span className={styles[info.orderStatus]}>
            {info.orderStatus}</span>
          </Paragraph>
          <Paragraph ellipsis>配送服务：{info.shipServiceLevel}</Paragraph>
          <Paragraph ellipsis>实付金额：<span 
            className={styles.red}>{info.actuallyPaid}</span>
          </Paragraph>
          { info.isBusinessOrder === '' ? 
            <p>B2B订单：</p> : <p>B2B订单：{info.isBusinessOrder ? `是` : `否`}</p>
          }
          
        </div>
      </div>
    </div>
    
  );
};
export default OrderInfo;
