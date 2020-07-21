import React from 'react';
import { IConnectProps } from '@/models/connect';
import wechatLogo from '@/assets/weixin.png';
import styles from './index.less';

const WeChat: React.FC<IConnectProps> = () => {
  return (
    <div className={styles.wechat}>
      <img src={wechatLogo} alt="微信"/>
    </div>
  );
};
export default WeChat;
