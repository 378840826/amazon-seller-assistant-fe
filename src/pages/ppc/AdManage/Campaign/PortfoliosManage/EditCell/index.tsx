/**
 * Portfolios 管理的编辑框
 */
import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import styles from './index.less';

interface IProps {
  inputValue: string;
  prefix?: React.ReactNode | string;
  maxLength: number;
  confirmCallback: {
    (value: string): void;
  };
}

const EditableCell: React.FC<IProps> = props => {
  const { inputValue, prefix, confirmCallback, maxLength } = props;
  const [value, setValue] = useState<string>(inputValue);
  const [editable, setEditable] = useState<boolean>(false);
  const inputEl = useRef<Input>(null);

  useEffect(() => {
    if (inputEl.current) {
      inputEl.current.focus();
    }
  }, [editable]);

  // 输入
  function handelInput(event: { target: { value: string } }) {
    const { target: { value } } = event;
    setValue(value);
  }

  // 确认修改
  function handelConfirm() {
    if (value !== inputValue) {
      confirmCallback(value);
    }
    setEditable(false);
  }

  // 取消
  function handelClickCancel() {
    setEditable(false);
  }

  return (
    editable
      ?
      <div className={styles.editableContainer}>
        <Input
          prefix={prefix}
          ref={inputEl}
          maxLength={maxLength}
          className={styles.Input}
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
      <div onClick={() => setEditable(true)} title="点击修改" className={styles.editCell}>
        <span className={styles.cellValue}>
          {prefix}{inputValue}
        </span>
        <Iconfont className={styles.editableBtn} type="icon-xiugai" />
      </div>
  );
};

export default EditableCell;
