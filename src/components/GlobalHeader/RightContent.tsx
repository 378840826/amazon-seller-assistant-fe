import React from 'react';
import { Tooltip } from 'antd';
import Avatar from './AvatarDropdown';
import GlobalSearch from '../GlobalSearch';
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
      <div className={styles.searchContainer}>
        <GlobalSearch />
      </div>
      <Tooltip placement="bottom" title={img} overlayStyle={{ background: '#fff' }}>
        <Iconfont type="icon-gongzhonghaoguanli" className={styles.weixin} />
      </Tooltip>
      <Avatar />
    </div>
  );
};

export default GlobalHeaderRight;
