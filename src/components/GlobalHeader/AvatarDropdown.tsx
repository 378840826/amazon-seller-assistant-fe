import React from 'react';
import { Menu, Spin, Badge } from 'antd';
import { Iconfont } from '@/utils/utils';
import { ClickParam } from 'antd/es/menu';
import { history, connect } from 'umi';
import { IConnectProps, IConnectState } from '@/models/connect';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface IGlobalHeaderRightProps extends IConnectProps {
  currentUser: API.ICurrentUser;
  unreadNotices: API.IUnreadNotices;
}

const { Item: MenuItem, Divider: MenuDivider } = Menu;

const munuIcon = function(type: string): React.ReactElement {
  return (
    <Iconfont type={type} className={styles.menuIcon} />
  );
};

class AvatarDropdown extends React.Component<IGlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;
    if (key === '/logout') {
      console.log('退出登录');
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
        <MenuItem key="center" className={styles.menuItem}>
          { munuIcon('icon-gerenzhongxin2') }
          个人中心
        </MenuItem>
        <MenuDivider />
        <MenuItem key="/mws/shop" className={styles.menuItem}>
          { munuIcon('icon-gerenzhongxin2') }
          店铺管理
        </MenuItem>
        <MenuDivider />
        <MenuItem key="/ppc/shop" className={styles.menuItem}>
          { munuIcon('icon-fuwushouquan') }
          广告授权
        </MenuItem>
        <MenuDivider />
        <MenuItem key="/message" className={styles.menuItem}>
          { munuIcon('icon-xiaoxi') }
          { unreadCount ? <Badge color="red" className={styles.badge} /> : null }
          消息中心
        </MenuItem>
        <MenuDivider />
        <MenuItem key="/sub-account" className={styles.menuItem}>
          { munuIcon('icon-guanlizhongxin') }
          子账号管理
        </MenuItem>
        <MenuDivider />
        <MenuItem key="/logout" className={styles.menuItem}>
          { munuIcon('icon-tuichu') }
          注销 <span className={styles.username}>{currentUser.username}</span>
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
