import React from 'react';
import { Tooltip } from 'antd';
import Avatar from './AvatarDropdown';
import GlobalSearch from '../GlobalSearch';
import ShopSelector from '../ShopSelector';
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
      <ShopSelector />
      <div className={styles.GlobalSearchContainer}>
        <GlobalSearch />
      </div>
      <Tooltip placement="bottomRight" title={img} overlayClassName={styles.__index_tooltip}>
        <Iconfont type="icon-gongzhonghaoguanli" className={styles.weixin} />
      </Tooltip>
      <Avatar />
    </div>
  );
};

export default GlobalHeaderRight;
