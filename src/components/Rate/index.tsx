/**
 * >=0 时 显示绿色、上升箭头
 * <= 时 显示红色、下降箭头
 */

import React from 'react';
import styles from './index.less';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { moneyFormat } from '@/utils/huang';

interface IProps {
  value: number;
  symbol?: string; // 符号 默认%
  decimals?: number; // 保留小数位
  showArrow?: boolean; // 是否显示箭头
}

const Rate: React.FC<IProps> = (props) => {
  const {
    value = 0,
    symbol = '%',
    showArrow = true,
    decimals,
  } = props;
  return (
    <>
      {
        value >= 0 ? <span className={styles.up}>
          {
            decimals ? (moneyFormat(value, decimals) + symbol) : (value + symbol)
          }
          <ArrowUpOutlined 
            className={styles.up} 
            style={{
              marginLeft: 2,
              display: showArrow ? 'inline-block' : 'none',
            }}
          />
        </span>
          : <span className={styles.down}>
            {
              decimals ? (moneyFormat(value, decimals) + symbol) : (value + symbol)
            }
            <ArrowDownOutlined 
              className={styles.down} 
              style={{
                marginLeft: 2,
                display: showArrow ? 'inline-block' : 'none',
              }}
            />
          </span>
      }
    </>
  );
};

export default Rate;
