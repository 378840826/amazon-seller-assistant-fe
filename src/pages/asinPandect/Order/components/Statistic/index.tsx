/*
  统计周期
 */ 
import React, { useState } from 'react';
import styles from './index.less';

interface IProps {
  cb?: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
  value: string;
}

const Statistic: React.FC<IProps> = (props) => {
  const {
    cb,
    style,
    className,
    value,
  } = props;
  const [current, setCurrent] = useState<string>(value || 'day'); // 选中

  const list = [
    { value: 'DAY', text: '日' },
    { value: 'WEEK', text: '周' },
    { value: 'MONTH', text: '月' },
  ];

  // 改变时
  const clickItem = (value: string) => {
    setCurrent(value);
    cb ? cb(value) : null;
  };

  return (
    <div className={`${styles.stbox} ${className} clearfix`} style={style}>
      <span>统计周期：</span>
      <ul>
        {
          list.map(({ value, text }, i) => {
            return <li className={ current === value ? styles.active : ''} 
              key={i}
              onClick={ () => clickItem(value) }
            >
              {text}
            </li>;
          })
        }
      </ul>
    </div>
  );
};

export default Statistic;
