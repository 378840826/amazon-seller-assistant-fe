/**
 * 功能页布局
 */

import React from 'react';
import { connect } from 'dva';
import logo from '../assets/logo.png';
import Link from 'umi/link';
import RightContent from '@/components/GlobalHeader/RightContent';
import { Layout, Menu } from 'antd';
import { IConnectProps, IConnectState } from '@/models/connect';
const { Header, Content } = Layout;
const { Item: MenuItem, SubMenu } = Menu;

export interface IRoute {
  path: string;
  title: string;
  name: string;
  children?: IRoute[];
}

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
    }
  }
  
  render() {
    const { children } = this.props; 
    return (
      <Layout>
        <Header style={{ display: 'flex' }}>
          <div>
            <img src={logo} alt="logo" />
          </div>
          <div>
            <Menu mode="horizontal">
              <MenuItem key="/">
                <Link to="/">首页</Link>
              </MenuItem>
              <MenuItem key="repricing">
                <Link to="/repricing">智能调价</Link>
              </MenuItem>
              <SubMenu
                onTitleClick={
                  (): void => {
                    console.log('onTitleClick');
                  }
                }
                title="商品管理"
              >
                <MenuItem key="setting:1">Option 1</MenuItem>
                <MenuItem key="setting:2">Option 2</MenuItem>
                <MenuItem key="setting:3">Option 3</MenuItem>
                <MenuItem key="setting:4">Option 4</MenuItem>
              </SubMenu>
            </Menu>          
          </div>
          <RightContent />
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
