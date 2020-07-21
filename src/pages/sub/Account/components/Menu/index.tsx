import React from 'react';
import StoreList from '../StoreList';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import styles from './index.less';

const Menu = (checkedIndexList: number[], menuCallback: Function) => {
  const checkboxChange = (selectedLists: CheckboxValueType[]) => {
    menuCallback(selectedLists);
  };
  return (
 
    <div className={styles.menu_list}>
      <StoreList checkedList={checkedIndexList} checkboxChange={checkboxChange} span={12}/>
    </div>
    
  
  );
};

export default Menu;
