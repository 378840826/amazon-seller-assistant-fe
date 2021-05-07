/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-10 17:30:50
 * @LastEditTime: 2021-04-30 11:48:13
 * 
 * 一个费用中包含其它费用
 */
import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Popover } from 'antd';

interface IProps {
  defaultValue: number;
  freeList: {label: string; value: number}[];
}

const OtherFree: React.FC<IProps> = props => {
  const { defaultValue, freeList } = props;
  const [visible, setVisible] = useState<boolean>(false);

  return <Popover 
    visible={visible}
    onVisibleChange={v => setVisible(v)}
    placement="right"
    content={<div className={styles.otherFreeBox}>
      {freeList.map((item, index) => {
        const value = item.value;
        return <div key={index}>
          <span className={styles.text}>{item.label}：</span>
          <span className={styles.value}>
            {
              value === undefined 
              || value === null ? 
                <span className={styles.secondaryText}>—</span> 
                : value 
            }
          </span>
        </div>; 
      })}
    </div>}
  >
    <span className={classnames(visible ? styles.btnText : styles.linkText)}>
      {
        defaultValue === undefined 
        || defaultValue === null ? 
          <span className={styles.secondaryText}>—</span> 
          : defaultValue 
      }
    </span>
  </Popover>;
};

export default OtherFree;
