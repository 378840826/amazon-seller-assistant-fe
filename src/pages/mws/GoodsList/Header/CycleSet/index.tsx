import React, { useState, useRef, useEffect } from 'react';
import { Input } from 'antd';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import { strToUnsignedIntStr } from '@/utils/utils';
import styles from './index.less';

interface IProps {
  cycle: string;
  handleSetCycle: Function;
}

const CycleSet: React.FC<IProps> = props => {
  const { cycle, handleSetCycle } = props;
  const [value, setValue] = useState<string>(cycle);
  const [editable, setEditable] = useState<boolean>(false);
  const inputEl = useRef<Input>(null);

  useEffect(() => {
    setValue(cycle);
  }, [cycle]);

  const handelClickEdit = () => {
    setEditable(true);
  };

  const handelClickCancel = () => {
    setEditable(false);
  };

  const handelInput = (event: { target: { value: string } }) => {
    const { target: { value } } = event;
    setValue(strToUnsignedIntStr(value));
  };

  const handelConfirm = () => {
    if (value !== String(cycle)) {
      handleSetCycle(value);
    }
    setEditable(false);
  };

  return (
    <>
      {
        editable
          ?
          <div className={styles.editableContainer}>
            <Input
              ref={inputEl}
              maxLength={3}
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
          <div className={styles.container}>
            <span className={styles.cycle}>
              补货天数:&nbsp;{cycle}
            </span>
            <span className={styles.editableBtn} title="修改" onClick={handelClickEdit}>
              <Iconfont type="icon-xiugai" />
            </span>
          </div>
      }
      <div
        className={styles.tishi}
        title="可设定补货天数为n天，系统会预估库存是否可满足未来n天的销售，若不足，系统会自动提示"
      >
        <Iconfont type="icon-tishi2" />
      </div>
    </>
  );
};

export default CycleSet;
