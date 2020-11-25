import React, { useState, useRef, useEffect } from 'react';
import { Input, Button } from 'antd';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import styles from './index.less';

interface IProps {
  tokenInvalid: boolean;
  inputValue: string;
  maxLength: number;
  confirmCallback: {
    (value: string): void;
  };
}

const EditableCell: React.FC<IProps> = props => {
  const { inputValue, confirmCallback, maxLength, tokenInvalid } = props;
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
    setValue(value);
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
      <div className={styles.cell}>
        <div>{inputValue}</div>
        <Button size="small" className={styles.editableBtn} onClick={handelClickEdit}>
          更新
        </Button>
        {
          tokenInvalid
            ? <span className={styles.hint}><Iconfont type="icon-duigou1" />已过期</span>
            : null
        }
        
      </div>
  );
};

export default EditableCell;
