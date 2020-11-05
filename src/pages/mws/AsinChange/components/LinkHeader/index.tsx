import React from 'react';
import { Link } from 'umi';
import { Menu } from 'antd';
const menuList = [
  { key: 'asin-overview', name: 'ASIN动态汇总', url: '/dynamic/asin-overview' }, 
  { key: 'asin-monitor', name: '监控设定', url: '/dynamic/asin-monitor' },
];
const LinkHeader = () => {
  const current = location.pathname === '/dynamic/asin-overview' ? 'asin-overview' : 'asin-monitor';
  return (
    <div>
      <Menu selectedKeys={[current]} mode="horizontal">
        { menuList.map((item) => {
          return (
            <Menu.Item key={item.key}>
              <Link to={item.url}>{item.name}</Link> 
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  );
};
export default LinkHeader;
