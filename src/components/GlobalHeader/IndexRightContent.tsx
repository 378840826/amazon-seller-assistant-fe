import React from 'react';
import { Tooltip } from 'antd';
import Avatar from './AvatarDropdown';
import { Link, connect } from 'umi';
import { Iconfont } from '@/utils/utils';
import { IConnectState, IConnectProps, IUserModelState } from '@/models/connect';
import weixin from '../../assets/index/qr.png';
import styles from './index.less';

interface ICenterConnectProps extends IConnectProps {
  user: IUserModelState;
}
const GlobalHeaderRight: React.FC<ICenterConnectProps> = ({ user }) => {
  const id = user.currentUser.id;
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
      {
        id > 0 && 
        <>
          <Avatar />
          <Link
            to="/overview/bi"
            className={styles.link_into}
            style={{ marginLeft: 50, marginRight: 5, fontSize: 16 }}
          >
        进入系统
            <Iconfont type="icon-xiangyoujiantou" style={{ fontSize: 16 }} />
          </Link>
        </>
      }
      
      
    </div>
  );
};

export default connect(({ user }: IConnectState) => ({
  user,
}))(GlobalHeaderRight);
