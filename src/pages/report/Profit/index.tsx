/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-06 11:32:11
 * @LastEditTime: 2021-05-07 15:45:10
 * 
 * 利润表 - 子ASIN
 */
import React, { useState } from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import Shop from './Shop';
import ChildAsin from './ChildAsin';

const { TabPane } = Tabs;
const Profit: React.FC = () => {
  const [nav, setNav] = useState<'shop'|'asin'>('shop'); // 店铺或者子ASIN
  return <div className={styles.box}>
    <Tabs activeKey={nav} onChange={key => setNav(key as 'shop'|'asin')}>
      <TabPane tab="店铺" key="shop" className={styles.shopTag}>
        <Shop nav={nav}/>
      </TabPane>
      <TabPane tab="子ASIN" key="asin">
        <ChildAsin nav={nav}/>
      </TabPane>
    </Tabs>
    
  </div>;
};

export default Profit;
