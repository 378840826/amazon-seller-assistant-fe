import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { Iconfont, strToMoneyStr, strToNaturalNumStr } from '@/utils/utils';
import classnames from 'classnames';
import {
  Input,
  message,
} from 'antd';
import ShowData from '@/components/ShowData';

interface IProps {
  style?: React.CSSProperties;
  className?: string;
  value: string; // 值
  currency: string;
  chagneCallback: (val: number) => Promise<boolean>; // 方便 修改之前的
  marketplace: API.Site;
}

export default (props: IProps) => {
  const {
    value,
    style,
    className,
    currency = '$',
    chagneCallback,
    marketplace,
  } = props;

  const [visible, setVisible] = useState<boolean>(true); // 默认编辑框显隐
  const [editValue, setEditValue] = useState<string>(value); // 编辑框的值
  const [showValue, setShowValue] = useState<string>(value); // 默认显示的值

  const boxRef = useRef(null);

  message.config({
    maxCount: 1,
  });

  useEffect(() => {
    setShowValue(value);
    setEditValue(value);
  }, [value]);


  // 点击编辑
  const clickEdit = () => {
    setVisible(false);
  };

  // 离开编辑框时
  const overInput = () => {
    if (editValue.trim() === '') {
      setEditValue(showValue);
      return;
    }

    chagneCallback(Number(editValue)).then(isSuccess => {
      if (isSuccess) {
        setShowValue(editValue);
        setVisible(true);
      }
    });
  };

  return <div className={
    classnames(
      styles.box,
      className, 
    )
  } style={style} ref={boxRef}>
    <div onClick={clickEdit} className={classnames(
      styles.editBox,
      'async-default-text',
      visible ? '' : 'none',
    )}>
      <ShowData value={showValue} isCurrency fillNumber={marketplace === 'JP' ? 0 : 2}/>
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
        size="small"
        prefix={currency}
        className={classnames(
          styles.input,
          'h-scroll',
        )}
        onChange={e => setEditValue(marketplace === 'JP' ? strToNaturalNumStr(e.target.value) : strToMoneyStr(e.target.value))}
        onPressEnter={overInput}
        onBlur={overInput}
      />
    </div>
  </div>;
};
