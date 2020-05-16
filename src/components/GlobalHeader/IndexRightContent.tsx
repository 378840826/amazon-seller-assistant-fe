import React from 'react';
import { Tooltip } from 'antd';
import Avatar from './AvatarDropdown';
import Link from 'umi/link';
import { Iconfont } from '@/utils/utils';
import weixin from '../../assets/weixin.png';
import styles from './index.less';


const GlobalHeaderRight: React.FC = () => {
  const img = (
    <div>
      <img src={weixin} />
      <div style={{ textAlign: 'center', marginTop: 5 }}>扫码关注微信公众号</div>
    </div>
  );
  
  return (
    <div className={styles.right}>
      <Tooltip placement="bottom" title={img} overlayStyle={{ background: '#fff' }}>
        <Iconfont type="icon-gongzhonghaoguanli" className={styles.weixin} />
      </Tooltip>
      <Avatar />
      <Link
        to="/mws/overview"
        style={{ color: '#666', marginLeft: 50, marginRight: 5, fontSize: 16 }}
      >
        进入系统
      </Link>
      <Iconfont type="icon-xiangyoujiantou" style={{ color: '#999', fontSize: 16 }} />
    </div>
  );
};

export default GlobalHeaderRight;
