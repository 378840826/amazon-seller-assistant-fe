/**
 * 未开发模块的占位提示组件
 */

import React from 'react';

const UncompletedPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      height: 'calc(100vh - 140px)',
    }}>
      <div style={{
        position: 'absolute',
        top: '30%',
        fontSize: '22px',
      }}>
        功能正在开发中
      </div>
    </div>
  );

};

export default UncompletedPage;
