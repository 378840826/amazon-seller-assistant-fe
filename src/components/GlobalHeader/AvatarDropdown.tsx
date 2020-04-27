import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import { Iconfont } from '@/utils/utils';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { IConnectProps, IConnectState } from '@/models/connect';
import { ICurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const { Item: MenuItem, Divider: MenuDivider } = Menu;

export interface IGlobalHeaderRightProps extends IConnectProps {
  currentUser?: ICurrentUser;
}

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
          <UserOutlined className={styles.menuIcon} />
          个人中心
        </MenuItem>
        <MenuDivider />
        <MenuItem key="message" className={styles.menuItem}>
          <SettingOutlined className={styles.menuIcon} />
          消息中心
        </MenuItem>
        <MenuDivider />
        <MenuItem key="logout" className={styles.menuItem}>
          <LogoutOutlined className={styles.menuIcon} />
          退出登录
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
