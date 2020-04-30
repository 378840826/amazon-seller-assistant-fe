import React from 'react';
import { Menu, Spin } from 'antd';
import { Iconfont } from '@/utils/utils';
import { ClickParam } from 'antd/es/menu';
import { connect } from 'dva';
import { router } from 'umi';
import { IConnectProps, IConnectState } from '@/models/connect';
import { ICurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const { Item: MenuItem, Divider: MenuDivider } = Menu;

export interface IGlobalHeaderRightProps extends IConnectProps {
  currentUser: ICurrentUser;
}

const munuIcon = function(type: string): React.ReactElement {
  return (
    <Iconfont type={type} className={styles.menuIcon} />
  );
};

<Iconfont type="icon-fuwushouquan" className={styles.menuIcon} />;

class AvatarDropdown extends React.Component<IGlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;
    if (key === 'logout') {
      console.log('退出登录');
      return;
    }
    router.push(`/${key}`);
  };

  render(): React.ReactNode {
    const { currentUser } = this.props;

    const menuHeaderDropdown: React.ReactElement = (
      <Menu className={styles.headerMenu} selectedKeys={[]} onClick={this.onMenuClick}>
        <MenuItem key="center" className={styles.menuItem}>
          { munuIcon('icon-gerenzhongxin2') }
          个人中心
        </MenuItem>
        <MenuDivider />
        <MenuItem key="shop" className={styles.menuItem}>
          { munuIcon('icon-gerenzhongxin2') }
          店铺管理
        </MenuItem>
        <MenuDivider />
        <MenuItem key="ad-shop" className={styles.menuItem}>
          { munuIcon('icon-fuwushouquan') }
          广告授权
        </MenuItem>
        <MenuDivider />
        <MenuItem key="message" className={styles.menuItem}>
          { munuIcon('icon-fuwushouquan') }
          消息中心
        </MenuItem>
        <MenuDivider />
        <MenuItem key="sub-account" className={styles.menuItem}>
          { munuIcon('icon-guanlizhongxin') }
          子账号管理
        </MenuItem>
        <MenuDivider />
        <MenuItem key="logout" className={styles.menuItem}>
          { munuIcon('icon-tuichu') }
          注销 {currentUser.username}
        </MenuItem>
      </Menu>
    );

    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <Iconfont type="icon-gerenzhongxin2" style={{ fontSize: 20, cursor: 'pointer' }} />
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }: IConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
