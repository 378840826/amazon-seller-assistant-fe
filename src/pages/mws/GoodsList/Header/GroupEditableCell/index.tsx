import React, { useState, useRef, useEffect } from 'react';
import { Input, Modal } from 'antd';
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
  deleteCallback: {
    (): void;
  };
}

const { confirm } = Modal;

const EditableCell: React.FC<IProps> = props => {
  const { inputValue, prefix, confirmCallback, deleteCallback, maxLength } = props;
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

  const handelClickDelte = () => {
    confirm({
      content: '删除分组，组内商品恢复未分组状态，确定删除？',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      maskClosable: true,
      onOk() {
        deleteCallback();
      },
    });
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
          defaultValue={inputValue}
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
        <div onClick={handelClickEdit} title="点击修改" className={styles.editCell}>
          <span className={styles.cellValue}>
            {prefix}{inputValue}
          </span>
          <Iconfont className={styles.editableBtn} type="icon-xiugai" />
        </div>
        <Iconfont
          className={styles.deleteBtn}
          type="icon-cuo"
          title="删除"
          onClick={handelClickDelte}
        />
      </div>
  );
};

export default EditableCell;
