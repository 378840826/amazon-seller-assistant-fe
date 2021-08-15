/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 11:02:53
 * @LastEditTime: 2021-05-13 11:44:38
 * 
 * 带确定取消的下拉选择
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Select,
  Spin,
} from 'antd';

interface IProps {
  val: string;
  onConfirm: (newValue: string) => Promise<boolean>;
  dataList: string[];
  /** Select 下拉框样式 */
  selectStyle?: React.CSSProperties;
}

const { Option } = Select;
const ConfireDownList: React.FC<IProps> = props => {
  const {
    val: initialValue,
    onConfirm,
    dataList,
    selectStyle,
  } = props;

  const [value, setValue] = useState<string>(initialValue);
  const [prevValue, setPrevValue] = useState<string>(initialValue); // 用于连续修改后的取消
  const [visible, setVisible] = useState<boolean>(false); // 修改后，显示边框和确认按钮
  const [loading, setLoading] = useState<boolean>(false); // 修改后，确认loading

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // 选中下拉框后的处理
  function onSelect(selectValue: string) {
    setVisible(true);
    setValue(selectValue);
  }

  // 确定修改
  function handelConfirm() {
    setLoading(true);
    onConfirm(value).then(isSuccess => {
      if (isSuccess) {
        setVisible(false);
        setLoading(false);
        setPrevValue(value);
      } else {
        setLoading(false);
      }
    });
  }

  // 取消修改
  function handelCancel() {
    setVisible(false);
    setValue(prevValue);
  }

  return (
    <div className={styles.box}>
      <Select 
        value={value}
        onSelect={v => onSelect(v)}
        className={classnames(visible ? styles.selectActive : '' )}
        style={selectStyle}
      >
        {
          dataList.map(
            (item, index) => <Option value={item} key={index}>{item}</Option>
          )
        }
      </Select>
      <div className={classnames(styles.btns, visible ? '' : 'none' )}>
        <button
          className={classnames(styles.btn, styles.cancel)}
          onClick={handelCancel}
        />
        <button
          className={classnames(styles.btn, styles.confirm, loading && styles.loading)}
          onClick={handelConfirm}
        >
          { loading && <Spin size="small" />}
        </button>
      </div>
    </div>
  );
};

export default ConfireDownList;
