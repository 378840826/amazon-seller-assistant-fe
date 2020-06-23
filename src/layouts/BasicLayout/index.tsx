/**
 * 功能页布局
 */
import React, { useEffect } from 'react';
import logo from '@/assets/logo.png';
import { Link, useDispatch, useSelector } from 'umi';
import RightContent from '@/components/GlobalHeader/RightContent';
import { Layout, Menu, Dropdown } from 'antd';
import { IConnectState } from '@/models/connect';
import navigation from './navigation';
import styles from './index.less';

const { Header, Content } = Layout;
const { Item: MenuItem } = Menu;

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

const renderBreadcrumbs = () => {
  const { title } = getSelectedMenu();
  return (
    <div className={styles.title}>
      {title}
    </div>
  );
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

const renderNavigation = () => {
  return (
    <Menu
      mode="horizontal"
      selectedKeys={getSelectedKeys()}
      className={styles.Menu}
    >
      {
        navigation.map(item => {
          const titlePathname = item.menu[0].path;
          if (item.visible === false) {
            return;
          }
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

const BasicLayout: React.FC = props => {
  const dispatch = useDispatch();
  const isShowPageTitle = useSelector((state: IConnectState) => state.global.isShowPageTitle);

  useEffect(() => {
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'global/fetchUnreadNotices',
    });

    // 登录接口(暂时)
    // dispatch({
    //   type: 'orderList/test',
    //   payload: {
    //     data: {
    //       email: '10086@qq.com',
    //       password: 'hello2020',
    //       rememberMe: true,
    //     },
    //   },
    // });
  }, [dispatch]);
  
  return (
    <Layout>
      <Header className={styles.Header}>
        <a href="/">
          <img src={logo} alt="logo" className={styles.logo} />
        </a>
        { renderNavigation() }
        <RightContent />
      </Header>
      <Content className={styles.Content}>
        {
          isShowPageTitle
            ?
            <div className={styles.breadcrumbs}>
              { renderBreadcrumbs() }
            </div>
            :
            null
        }
        { props.children }
      </Content>
    </Layout>
  );
};

export default BasicLayout;
