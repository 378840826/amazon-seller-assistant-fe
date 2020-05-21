/**
 * 首页布局
 */

import React from 'react';
import logo from '@/assets/logo.png';
import { Link, connect } from 'umi';
import IndexRightContent from '@/components/GlobalHeader/IndexRightContent';
import { Layout, Menu } from 'antd';
import { IConnectProps, IConnectState } from '@/models/connect';
import styles from './index.less';

const { Header, Content } = Layout;

interface IProps extends IConnectProps {
  menu?: boolean;
}

interface IState extends IConnectState {
  isReady?: boolean;
}

interface IMenuItemProps {
  href: string;
  name: string;
}

const menu: React.FC<IMenuItemProps[]> = menuList => {
  const selectedKeys = [menuList[0].href];
  return (
    <Menu mode="horizontal" defaultSelectedKeys={selectedKeys} style={{ flex: 1, fontSize: 16 }}>
      {
        menuList.map((item: IMenuItemProps) => {
          const { href, name } = item;
          return (
            <Menu.Item key={href} className={styles.menuItem}>
              <Link to={href}>{name}</Link>
            </Menu.Item>
          );
        })
      }
    </Menu>
  );
};

class BasicLayout extends React.Component<IProps, IState> {
  componentDidMount() {
    this.setState({
      isReady: true,
    });
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
  
  render() {
    const { children } = this.props;
    return (
      <Layout>
        <Header className={styles.Header}>
          <div className={styles.heardContainer}>
            <a href="/">
              <img src={logo} alt="logo" style={{ verticalAlign: 'sub' }} />
            </a>
            {
              menu([
                { href: '#home', name: '首页' },
                { href: '#fun', name: '功能' },
                { href: '#pay', name: '付费' },
                { href: '#fqa', name: 'FAQ' },
              ])
            }
            <IndexRightContent />
          </div>
        </Header>
        <Content>{children}</Content>
      </Layout>
    );
  }
}

export default connect(({ user, loading }: IConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(BasicLayout);
