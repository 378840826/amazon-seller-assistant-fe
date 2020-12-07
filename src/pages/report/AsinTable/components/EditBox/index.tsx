import React, { useState, useRef } from 'react';
import { Input, message } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

interface IProps {
  inputValue: string;
  maxLength: number;
  confirmCallback: {
    (value: string): Promise<boolean>;
  };
  cancelCallback?: () => void; // 点击X的回调
  placeholder?: string; // 输入框placeholder
}

const EditableCell: React.FC<IProps> = (props) => {
  const { 
    inputValue,
    confirmCallback,
    maxLength,
    cancelCallback,
  } = props;
  const [value, setValue] = useState<string>(inputValue);
  const inputEl = useRef<Input>(null);

  const handelClickCancel = () => {
    cancelCallback ? cancelCallback() : null;
  };

  const handelInput = (event: { target: { value: string } }) => {
    const { target: { value } } = event;
    setValue(value);
  };

  const handelConfirm = () => {
    if (value === '') {
      message.error('偏好名称不能为空！');
      return;
    }
    const result = confirmCallback(value);
    result.then(res => {
      if (res) {
        setValue('');
      }
    });
  };

  // 阻止回车提交
  const preventEnterDefault = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      return false;
    }
  };

  return (
    <div className={styles.editableContainer}>
      <Input
        ref={inputEl}
        maxLength={maxLength}
        className={styles.Input}
        value={value}
        defaultValue={inputValue}
        onChange={handelInput}
        name="editBox"
        placeholder="输入偏好名称"
        onKeyDown={preventEnterDefault}
      />
      <div className={styles.btns}>
        <span
          className={classnames(styles.btn, styles.cancel)}
          onClick={handelClickCancel}
        ></span>
        <span
          className={classnames(styles.btn, styles.confirm)}
          onClick={handelConfirm}
        ></span>
      </div>
    </div>

  );
};

export default EditableCell;
