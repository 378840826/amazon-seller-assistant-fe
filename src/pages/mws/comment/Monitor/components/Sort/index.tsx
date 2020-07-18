
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import {
  Tooltip,
} from 'antd';

const Sort: React.FC<CommectMonitor.IOrderType> = (props) => {
  const {
    title = '标题', // 显示的文字
    value = '', // 排序值
    orderValue = '', // 用于显示哪个组件排序(和标题比较)、配合state
    callback, // 点击的回调
    isTabBoolean = false, // 返回值是否转换成布尔值、true就是asc，false就是desc
    tip = '点击排序', // 鼠标移动上去的提示文字
    defaultSort = 'desc', // 默认第一次点击的排序
  } = props;
  const [currentOrder, setCurrentOrder] = useState('');
  let classNames = '';
    
  useEffect(() => {
    if (value !== orderValue) {
      setCurrentOrder('');
    }
  }, [value, orderValue]);
  
  if (currentOrder === '') {
    classNames = styles.not;
  } else if (currentOrder === 'desc') {
    classNames = styles.asc;
  } else {
    classNames = styles.desc;
  }
 
  const orderer = () => {
    let order: boolean|string = '';
    console.log('...', defaultSort);
    
    if (defaultSort === 'desc') {
      if (currentOrder === 'desc') {
        setCurrentOrder('asc');
        order = 'asc';
        classNames = styles.desc;
      } else {
        setCurrentOrder('desc');
        order = 'desc';
        classNames = styles.asc;
      }
    } else {
      if (currentOrder === 'asc') {
        setCurrentOrder('desc');
        order = 'desc';
        classNames = styles.asc;
      } else {
        setCurrentOrder('asc');
        order = 'asc';
        classNames = styles.desc;
      }
    }
  
    if (isTabBoolean) {
      order = order === 'asc' ? true : false;
    }
  
    callback ? callback({
      value,
      order,
    }) : null;
  };
  
  
  return (
    <Tooltip title={tip}>
      <div className={`${ styles.sort_components }`} onClick={orderer}>
        <span>{title}</span>
        <div className={`
          ${styles.sort_icon} 
          ${classNames}
          ${defaultSort === 'asc' ? styles.desc : '' }
        `}
        >
          <Iconfont type="icon-xiangxiajiantou" />
        </div>
      </div>
    </Tooltip>
  );
};

export default Sort;
