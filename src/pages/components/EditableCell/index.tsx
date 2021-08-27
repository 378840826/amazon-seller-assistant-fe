import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import styles from './index.less';

interface IProps {
  inputValue: string;
  // 前缀和后缀
  prefix?: React.ReactNode | string;
  suffix?: React.ReactNode | string;
  // 输入框输入内容约束
  formatValueFun?: (value: string) => string;
  maxLength: number;
  confirmCallback: {
    (value: string): void;
  };
  // 编辑按钮是否默认隐藏 hover 时候再显示
  ghostEditBtn?: boolean;
}

const EditableCell: React.FC<IProps> = (props) => {
  const { 
    inputValue, prefix, suffix, confirmCallback, maxLength, formatValueFun, ghostEditBtn,
  } = props;
  const [value, setValue] = useState<string>(inputValue);
  const [editable, setEditable] = useState<boolean>(false);
  const inputEl = useRef<Input>(null);

  useEffect(() => {
    if (inputEl.current) {
      inputEl.current.focus();
    }
  }, [editable]);

  // 因为有些数据可以用除了这个组件之外的地方修改
  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  const handelClickEdit = () => {
    setEditable(true); 
  };

  const handelClickCancel = () => {
    setEditable(false);
  };

  const handelInput = (event: { target: { value: string } }) => {
    const { target: { value } } = event;
    const newValue = formatValueFun ? formatValueFun(value) : value;
    setValue(newValue);
  };

  const handelConfirm = () => {
    if (value !== inputValue) {
      confirmCallback(value);
    }
    setEditable(false);
  };

  return (
    editable
      ? 
      <div className={styles.editableContainer}>
        <Input
          prefix={prefix}
          suffix={suffix}
          ref={inputEl}
          maxLength={maxLength}
          className={styles.Input}
          value={value}
          defaultValue={inputValue}
          onChange={handelInput}
          onKeyUp={(e) => {
            switch (e.key) {
            case 'Enter':
              handelConfirm();             
              break;
            case 'Escape':
              handelClickCancel();             
              break;
            default:
              break;
            }
          }}
        />
        <div className={styles.btns}>
          <button
            className={classnames(styles.btn, styles.cancel)}
            onClick={handelClickCancel}
          ></button>
          <button
            className={classnames(styles.btn, styles.confirm)}
            onClick={handelConfirm}
          ></button>
        </div>
      </div>
      : 
      <div className={styles.cell} onClick={handelClickEdit} title="点击修改">
        <div className={styles.cellValue}>
          {prefix}{inputValue}{suffix}
        </div>
        <Iconfont
          className={classnames(styles.editableBtn, ghostEditBtn ? styles.ghostEditBtn : '')}
          type="icon-xiugai"
        />
      </div>
  );
};

export default EditableCell;
