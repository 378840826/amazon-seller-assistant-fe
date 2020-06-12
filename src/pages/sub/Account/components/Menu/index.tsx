import React from 'react';
import StoreList from '../StoreList';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import styles from './index.less';

const Menu = (stores: Array<API.IStore>, menuCallback: Function) => {
  const checkedIdList = stores.map(item => item.sellerId);
  const checkboxChange = (selectedLists: CheckboxValueType[]) => {
    menuCallback(selectedLists);
  };
  return (
 
    <div className={styles.menu_list}>
      <StoreList checkedList={checkedIdList} checkboxChange={checkboxChange} span={12}/>
    </div>
    
  
  );
};

export default Menu;
