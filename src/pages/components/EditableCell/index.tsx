import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import styles from './index.less';

interface IProps {
  inputValue: string;
  prefix?: React.ReactNode | string;
  formatValueFun?: (value: string) => string;
  maxLength: number;
  confirmCallback: {
    (value: string): void;
  };
}

const EditableCell: React.FC<IProps> = (props) => {
  const { inputValue, prefix, confirmCallback, maxLength, formatValueFun } = props;
  const [value, setValue] = useState<string>(inputValue);
  const [editable, setEditable] = useState<boolean>(false);
  const inputEl = useRef<Input>(null);

  useEffect(() => {
    if (inputEl.current) {
      inputEl.current.focus();
    }
  }, [editable]);

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
          ref={inputEl}
          maxLength={maxLength}
          className={styles.Input}
          value={value}
          onChange={handelInput}
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
      <div className={styles.cell}>
        <div className={styles.cellValue}>
          {prefix}{inputValue}
        </div>
        <Iconfont
          className={styles.editableBtn}
          type="icon-xiugai"
          title="修改"
          onClick={handelClickEdit}
        />
      </div>
  );
};

export default EditableCell;
