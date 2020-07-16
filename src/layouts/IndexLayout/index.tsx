/**
 * 首页布局
 */

import React from 'react';
import logo from '@/assets/logo.png';
import { connect } from 'umi';
import IndexRightContent from '@/components/GlobalHeader/IndexRightContent';
import { Layout } from 'antd';
import { IConnectProps, IConnectState } from '@/models/connect';
import styles from './index.less';
import MenuCom from './components/Menu';

const { Header, Content } = Layout;


interface IProps extends IConnectProps {
  menu?: boolean;
}

interface IState extends IConnectState {
  isReady?: boolean;
}

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
            <MenuCom/>
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
