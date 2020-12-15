/**
 * 会员购买协议
 */
import React from 'react';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';

const Success: React.FC = () => {
  return (
    <div className={styles.successPage}>
      <span>
        <Iconfont type="icon-duigou" className={styles.successIcon} />
      </span>
      支付成功！
    </div>
  );
};

export default Success;
