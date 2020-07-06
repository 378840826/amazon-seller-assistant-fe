import React, { useState, useRef } from 'react';
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
      onOk() {
        console.log('删除');
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
        <Iconfont
          className={styles.editableBtn}
          type="icon-xiugai"
          title="修改"
          onClick={handelClickEdit}
        />
        <div className={styles.cellValue}>
          {prefix}{inputValue}
        </div>
        <Iconfont
          className={styles.deleteBtn}
          type="icon-guanbi1"
          title="删除"
          onClick={handelClickDelte}
        />
      </div>
  );
};

export default EditableCell;
