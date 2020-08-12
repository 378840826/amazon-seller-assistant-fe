// 自定义列

import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { DownOutlined } from '@ant-design/icons';
import { storage } from '@/utils/utils';
import { 
  CheckboxValueType,
  CheckboxOptionType,
} from 'antd/lib/checkbox/Group';

import {
  Dropdown,
  Checkbox,
  Button,
} from 'antd';

interface ISelectListType extends CheckboxOptionType{
  show: boolean;
}

interface IProps {
  listStyle?: React.CSSProperties; // 复选框列表
  btnStyle?: React.CSSProperties; // 显示框的style
  showName?: string; // 显示文本  默认“自定义列”
  selectList: AsinOrder.IDouFuListTyep[]; 
  trigger?: Array<'click'|'hover'|'contextMenu'>; // 触发方式
  storageKey?: string; // 是否本地记录 记录名 `${storageKey}_checkbox_downlist
  cb?: (selectList: AsinOrder.IDouFuListTyep[]) => void; // 点击选中的回调
}

const CheckboxDownList: React.FC<IProps> = (props) => {
  const { 
    listStyle,
    btnStyle,
    showName = '自定义列',
    selectList = [],
    trigger = ['click'],
    storageKey,
    cb, 
  } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [defaultValue, setDefaultValue] = useState<string[]>([]); // 默认选中

  // 点击复选框的回调
  const onChange = (checkedValues: CheckboxValueType[]) => { 
    checkedValues = [...new Set(checkedValues)];
    const newList = selectList;
    for (let j = 0; j < newList.length; j++) {
      const childItem = newList[j];
      childItem.show = false;

      for (let i = 0; i < checkedValues.length; i++) {
        const item = checkedValues[i]; // 复制框选中项
        if (item === childItem.value) {
          childItem.show = true;
        } 
      }
    }

    storage.set(`${storageKey}_checkbox_downlist`, newList);
    cb ? cb(newList) : ''; 
  };

  // 初始化选中
  useEffect(() => {
    if (selectList.length > 0) {
      if (storageKey) {
        // 使用localStorage记录
        const localList = storage.get(`${storageKey}_checkbox_downlist`); // 获取是否记录

        // 已记录
        if (localList) {
          // 筛选默认选中项
          localList.forEach((item: ISelectListType) => {
            if (item.show) {
              defaultValue.push(item.value as string);
            }
          });
        } else {
          // 首次加载
          storage.set(`${storageKey}_checkbox_downlist`, selectList);
        }
      } else {
        // 未使用localStorage记录
        // 筛选默认选中项
        selectList.forEach(item => {
          if (item.show === true) {
            defaultValue.push(item.value as string);
          }
        });
      }
      setDefaultValue([...new Set(defaultValue)]);
    }
  }, [selectList]); // eslint-disable-line

  const menu = (
    <div style={listStyle}>
      <Checkbox.Group 
        options={selectList} 
        defaultValue={defaultValue}
        className={styles.menus}
        onChange={onChange}
      ></Checkbox.Group>
    </div>
  );
  const commectFlag = () => {
    setVisible(!visible);
  };

  return (
    <div className={styles.selectDownList}>
      <Dropdown 
        overlay={menu}
        trigger={trigger}
        onVisibleChange={commectFlag}
        className={styles.menu}
        visible={visible} >
        <Button style={btnStyle}>
          {showName} 
          <DownOutlined 
            className={`
              ${styles.icon}
              ${visible ? styles.select_icon : ''} 
            `}
          />
        </Button>
      </Dropdown>
    </div>
  );
};

export default CheckboxDownList;
