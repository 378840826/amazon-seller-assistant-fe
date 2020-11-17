import React from 'react';
import LazyLoad from 'react-lazy-load';
import { Link } from 'umi';
import defaultImage from '@/assets/stamp.png';
import { Dropdown } from 'antd';
import styles from './index.less';

interface IRenderValue{
  text: API.IParams;
  record: API.IParams;
}
const showImg = (item: string) => {
  return (
    <div className={styles.bigImgContainer}>
      <img src={item} onError={(e) => {
        e.target.onerror = null;e.target.src = `${defaultImage}`;
      }}/>
    </div>
  );
};
const RenderValue: React.FC<IRenderValue> = ({ text, record }) => {
  if (Array.isArray(text)){
    if (record.changeType === 'changeEBCImg' || record.changeType === 'changeImage'){
      return (<div className={styles.imgsContainer}>
        {text.map( (item, index) => {
          return (
            <Dropdown key={index} overlay={showImg(item)} placement="bottomCenter">
              <div className={styles.imgContainer}>
                <LazyLoad height={'100%'} width={'100%'} offsetVertical={100}>
                  <img src={item} onError={(e) => { 
                    e.target.onerror = null;e.target.src = `${defaultImage}` ; 
                  }} />
                </LazyLoad>
              </div>
            </Dropdown>
          );
        })}
      </div>);
    }
    return (
      <>
        {text.map((item, index) => {
          return (
            <div key={index}>{item}</div>
          ) ;
        })}
      </>
    );
    
  }
  return (
    <div className={styles.gap}>{text}</div>
  );
  
};
export default RenderValue;
