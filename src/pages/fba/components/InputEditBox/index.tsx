/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-08 11:08:01
 * @LastEditTime: 2021-03-17 19:10:26
 * 
 * 编辑框
 * 
 * 失去焦点就隐藏编辑框恢复初始
 * 
 */

import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import { Input } from 'antd';

interface IFormat {
  /** 输入框格式化方法 */
  converterFun: (v: string) => string;
  /** 输入框失焦时的值检查 */
  valueRule: {
    min?: string;
    max?: string;
    required?: boolean;
  };
}

interface IProps {
  /** 输入格式限制 */
  format?: IFormat;
  /** 内容最大显示宽度(不包括标记图标) */
  maxWidth?: string | number;
  maxLength?: number;
  className?: string;
  value: string; // 值
  chagneCallback: (val: number | string) => void; // 回调: 例修改调用的数据，判断值是否满足条件等
}

export default (props: IProps) => {
  const { value, chagneCallback, maxWidth: maxwindth, format, maxLength } = props;
  const { converterFun, valueRule } = format || {} as IFormat;

  const [visible, setVisible] = useState<boolean>(true); // 默认编辑框显隐
  const [editValue, setEditValue] = useState<string>(value); // 编辑框的值

  const InputRef = useRef<Input>(null);

  useEffect(() => {
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
    const { min, max, required } = valueRule || {};
    let v = editValue;
    if (required && min && editValue < min) {
      v = min;
      setEditValue(v);
    }
    if (max && editValue > max) {
      v = max;
      setEditValue(v);
    }
    chagneCallback(v);
    setVisible(true);
  };

  return <div className={styles.box}>
    <div onClick={clickEdit} className={classnames(
      styles.editBox,
      'async-default-text',
      visible ? '' : 'none',
    )}>
      <span className={styles.showValue} style={{ maxWidth: maxwindth }}>{editValue}</span>
      <Iconfont type="icon-xiugai" className={classnames(styles.editIcon, 'h-default-icon')} />
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
        onChange={e => setEditValue(converterFun ? converterFun(e.target.value) : e.target.value)}
        maxLength={maxLength || 50}
        onPressEnter={overInput}
        onBlur={overInput}
        autoFocus={ true}
      />
    </div>
  </div>;
};
