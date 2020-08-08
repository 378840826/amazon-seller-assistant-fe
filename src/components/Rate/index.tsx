/**
 * >=0 时 显示绿色、上升箭头
 * <= 时 显示红色、下降箭头
 */

import React from 'react';
import styles from './index.less';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface IProps {
  value: number;
  symbol?: string; // 符号 默认%
}

const Rate: React.FC<IProps> = (props) => {
  const {
    value = 0,
    symbol = '%',
  } = props;
  return (
    <>
      {
        value >= 0 ? <span className={styles.up}>
          { value }{symbol}
          <ArrowUpOutlined 
            className={styles.up} 
            style={{ marginLeft: 2 }}
          />
        </span>
          : <span className={styles.down}>
            { value }{symbol}
            <ArrowDownOutlined 
              className={styles.down} 
              style={{ marginLeft: 2 }}
            />
          </span>
      }
    </>
  );
};

export default Rate;
