/**
 * 用于广告管理列表中的 广告活动 和 广告组 的显示和修改
 * 点击名称跳转，点击编辑图标修改
 */
import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import styles from './index.less';

interface IProps {
  // 是否可编辑（归档的不能编辑）
  unchangeable?: boolean;
  inputValue: string;
  maxLength: number;
  href: string;
  confirmCallback: {
    (value: string): void;
  };
}

const EditableCell: React.FC<IProps> = (props) => {
  const { unchangeable, inputValue, href, confirmCallback, maxLength } = props;
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

  function handelClickEdit() {
    setEditable(true); 
  }

  function handelClickCancel() {
    setEditable(false);
  }

  function handelInput(event: { target: { value: string } }) {
    const { target: { value } } = event;
    setValue(value);
  }

  function handelConfirm() {
    if (value !== inputValue) {
      confirmCallback(value);
    }
    setEditable(false);
  }

  return (
    editable
      ? 
      <div className={styles.editableContainer}>
        <Input
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
      <div className={styles.cell}>
        <div className={styles.cellValue}>
          <a href={href}>{inputValue}</a>
        </div>
        {
          unchangeable
            ? null
            :
            <Iconfont
              className={styles.editableBtn}
              type="icon-xiugai"
              title="点击修改"
              onClick={handelClickEdit}
            />
        }

      </div>
  );
};

export default EditableCell;
