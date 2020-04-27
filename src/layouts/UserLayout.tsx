
import React from 'react';
import { Layout } from 'antd';

const { Header, Content } = Layout;

const UserLayout: React.FC = props => {
  return (
    <Layout>
      <Header>User 布局</Header>
      <Content>{props.children}</Content>
    </Layout>
  );
};

export default UserLayout;
