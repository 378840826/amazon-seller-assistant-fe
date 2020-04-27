/*
  页面跳转时的页面 loading
*/
import React from 'react';
import { Spin } from 'antd';

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
const PageLoading: React.FC = function() {
  return (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      <Spin size="large" />
    </div>
  );
};

export default PageLoading;
