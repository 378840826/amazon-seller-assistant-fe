/**
 * 功能页布局
 */
import React from 'react';
import { connect } from 'dva';
import logo from '@/assets/logo.png';
import Link from 'umi/link';
import RightContent from '@/components/GlobalHeader/RightContent';
import { Layout, Menu, Dropdown } from 'antd';
import { IConnectProps, IConnectState } from '@/models/connect';
import navigation from './navigation';
import styles from './index.less';

const { Header, Content } = Layout;
const { Item: MenuItem } = Menu;

interface IProps extends IConnectProps {
  menu?: boolean;
}

interface ISubMenu {
  title: string;
  path: string;
}

// 获取下拉菜单
const getSubMenu = (subMenuArr: ISubMenu[]) => (
  <Menu selectable selectedKeys={[window.location.pathname]}>
    {
      subMenuArr.map(sub => (
        <MenuItem key={sub.path} className={styles.subMenu}>
          <Link to={sub.path}>{sub.title}</Link>
        </MenuItem>
      ))
    }
  </Menu>
);

const getSelectedMenu = () => {
  const locationPathname = window.location.pathname;
  const result = {
    path: '',
    title: '',
  };
  for (let index = 0; index < navigation.length; index++) {
    const { menu } = navigation[index];
    for (let index = 0; index < menu.length; index++) {
      const menuItem = menu[index];
      if (menuItem.path === locationPathname) {
        result.path = menuItem.path;
        result.title = menuItem.title;
      }
    }
  }
  return result;
};

const getSelectedKeys = () => {
  const locationPathname = window.location.pathname;
  let selectedKeys = [locationPathname];
  // 判断当前路由在哪个导航的下拉菜单中，高亮这个导航
  for (let index = 0; index < navigation.length; index++) {
    const { menu } = navigation[index];
    const include = menu.some(subMenuItem => subMenuItem.path === locationPathname);
    if (include) {
      selectedKeys = [menu[0].path];
      break;
    }
  }
  return selectedKeys;
};

class BasicLayout extends React.Component<IProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'global/fetchUnreadNotices',
      });
    }
  }

  renderBreadcrumbs = () => {
    const { title } = getSelectedMenu();
    return (
      <div className={styles.title}>
        {title}
      </div>
    );
  };

  renderNavigation = () => {
    return (
      <Menu
        mode="horizontal"
        selectedKeys={getSelectedKeys()}
        className={styles.Menu}
      >
        {
          navigation.map(item => {
            const titlePathname = item.menu[0].path;
            return (
              <MenuItem key={titlePathname} className={styles.MenuItem}>
                <Dropdown overlay={getSubMenu(item.menu)} placement="bottomCenter">
                  <Link to={titlePathname}>{item.title}</Link>
                </Dropdown>
              </MenuItem>
            );
          })
        }
      </Menu>
    );
  };
  
  render() {
    return (
      <Layout>
        <Header className={styles.Header}>
          <a href="/">
            <img src={logo} alt="logo" className={styles.logo} />
          </a>
          { this.renderNavigation() }
          <RightContent />
        </Header>
        <Content className={styles.Content}>
          <div className={styles.breadcrumbs}>
            { this.renderBreadcrumbs() }
          </div>
          {this.props.children}
        </Content>
      </Layout>
    );
  }
}

export default connect(({ user, loading }: IConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(BasicLayout);
