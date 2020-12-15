import React from 'react';
import { Menu, Spin, Badge } from 'antd';
import { Iconfont } from '@/utils/utils';
import { history, connect } from 'umi';
import { IConnectProps, IConnectState } from '@/models/connect';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface IGlobalHeaderRightProps extends IConnectProps {
  currentUser: API.ICurrentUser;
  unreadNotices: API.IUnreadNotices;
}

const { Item: MenuItem } = Menu;

const munuIcon = function(type: string): React.ReactElement {
  return (
    <Iconfont type={type} className={styles.menuIcon} />
  );
};

class AvatarDropdown extends React.Component<IGlobalHeaderRightProps> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMenuClick = ({ key }: any) => {
    if (key === '/logout') {
      this.props.dispatch({
        type: 'user/logout',
      });
      return;
    }
    history.push(key);
  };

  render() {
    const { currentUser, unreadNotices } = this.props;

    // 全部未读消息数量
    const unreadCount = Object.values(unreadNotices).reduce(
      (a, b) => (a + b)
    );

    const Avatar = unreadCount
      ?
      <span className={styles.avatarContainer}>
        <Iconfont type="icon-gerenzhongxin2" style={{ fontSize: 20, cursor: 'pointer' }} />
        <Badge color="red" className={styles.badge} />
      </span>
      :
      <Iconfont type="icon-gerenzhongxin2" style={{ fontSize: 20, cursor: 'pointer' }} />;

    const menuHeaderDropdown = (
      <Menu className={styles.headerMenu} selectedKeys={[]} onClick={this.onMenuClick}>
        <MenuItem key="/center" className={styles.menuItem}>
          { munuIcon('icon-gerenzhongxin2') }
          <span className={styles.menuName}>个人中心</span>
        </MenuItem>
        <MenuItem key="/vip/membership" className={styles.menuItem}>
          {munuIcon('icon-huiyuan')}
          <span className={styles.menuName}>我的会员</span>
        </MenuItem>
        <MenuItem key="/shop/list" className={styles.menuItem}>
          { munuIcon('icon-dianpuguanli1') }
          <span className={styles.menuName}>店铺管理</span>
        </MenuItem>
        <MenuItem key="/ppc/shop" className={styles.menuItem}>
          { munuIcon('icon-fuwushouquan') }
          <span className={styles.menuName}>广告授权</span>
        </MenuItem>
        <MenuItem key="/message" className={styles.menuItem}>
          { munuIcon('icon-xiaoxi') }
          <span className={styles.menuName}>
            { unreadCount ? <Badge color="red" className={styles.badge} /> : null }
            消息中心
          </span>
        </MenuItem>
        {currentUser.topAccount &&
            <MenuItem key="/sub-account" className={styles.menuItem}>
              { munuIcon('icon-guanlizhongxin') }
              <span className={styles.menuName}>子账号管理</span>
            </MenuItem>
        }        
        <MenuItem key="/logout" className={styles.menuItem}>
          { munuIcon('icon-tuichu') }
          <span className={styles.menuName}>
            注销
            <span className={styles.username}>{currentUser.username}</span>
          </span>
        </MenuItem>
      </Menu>
    );
    return currentUser && currentUser.id !== -1 ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        {Avatar}
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 3,
          marginRight: 3,
        }}
      />
    );
  }
}

export default connect(({ user, global }: IConnectState) => ({
  currentUser: user.currentUser,
  unreadNotices: global.unreadNotices,
}))(AvatarDropdown);
