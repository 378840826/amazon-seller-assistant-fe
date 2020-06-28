import React from 'react';
import { Tooltip } from 'antd';
import Avatar from './AvatarDropdown';
import { Link } from 'umi';
import { Iconfont } from '@/utils/utils';
import weixin from '../../assets/weixin.png';
import styles from './index.less';


const GlobalHeaderRight: React.FC = () => {
  const img = (
    <div>
      <img src={weixin} />
      <div style={{ textAlign: 'center', marginTop: 5, color: '#666' }}>扫码关注微信公众号</div>
    </div>
  );
  
  return (
    <div className={styles.right}>
      <Tooltip placement="bottom" title={img} overlayClassName={styles.__index_tooltip}>
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
