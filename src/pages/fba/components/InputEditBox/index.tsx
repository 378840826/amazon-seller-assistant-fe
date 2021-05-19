/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-08 11:08:01
 * @LastEditTime: 2021-03-17 19:10:26
 * 
 * 数字编辑框
 * 
 * 失去焦点就隐藏编辑框恢复初始
 * 
 */

import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { Iconfont, strToNaturalNumStr } from '@/utils/utils';
import classnames from 'classnames';
import { Input } from 'antd';

interface IProps {
  className?: string;
  value: string; // 值
  chagneCallback: (val: number) => void; // 回调: 例修改调用的数据，判断值是否满足条件等
}

export default (props: IProps) => {
  const { value, chagneCallback } = props;

  const [visible, setVisible] = useState<boolean>(true); // 默认编辑框显隐
  const [editValue, setEditValue] = useState<string>(value); // 编辑框的值
  const [showValue, setShowValue] = useState<string>(value); // 默认显示的值

  const InputRef = useRef<Input>(null);


  useEffect(() => {
    setShowValue(value);
    setEditValue(value);
  }, [value]);


  // 点击编辑
  const clickEdit = () => {
    setVisible(false);
    setTimeout(() => {
      if (InputRef.current) {
        InputRef.current.focus();
      }
    }, 100);
  };

  // 离开编辑框时
  const overInput = () => {
    // if (typeof editValue === 'string' && editValue.trim() === '') {
    //   setEditValue(showValue);
    //   return;
    // }
    chagneCallback(Number(editValue));
    setShowValue(editValue);
    setVisible(true);
  };

  return <div className={
    classnames(
      styles.box,
    )
  }>
    <div onClick={clickEdit} className={classnames(
      styles.editBox,
      'async-default-text',
      visible ? '' : 'none',
    )}>
      {showValue}
      <Iconfont 
        type="icon-xiugai" 
        className={classnames(styles.editIcon, 'h-default-icon')}
      />
    </div>

    <div className={classnames(
      styles.editInputBox, 
      'async-editbox-input',
      visible ? 'none' : ''
    )}
    >
      <Input 
        value={editValue} 
        ref={InputRef}
        size="small"
        className={classnames(
          styles.input,
          'h-scroll',
        )}
        onChange={e => setEditValue(strToNaturalNumStr(e.target.value))}
        onPressEnter={overInput}
        onBlur={overInput}
        autoFocus={ true}
      />
    </div>
  </div>;
};
