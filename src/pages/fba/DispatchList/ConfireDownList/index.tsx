/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 11:02:53
 * @LastEditTime: 2021-03-17 14:18:50
 * 
 * 核实库存
 */
import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Select,
  Spin,
} from 'antd';
import { logisticMethods } from '../../config';

interface IProps {
  val: string;
  onConfirm: () => Promise<boolean>;
}

const { Option } = Select;
const ConfireDownList: React.FC<IProps> = props => {
  const {
    val,
    onConfirm,
  } = props;

  const [value, setValue] = useState<string>(val);
  const [visible, setVisible] = useState<boolean>(false); // 修改后，显示边框和确认按钮
  const [loading, setLoading] = useState<boolean>(false); // 修改后，确认loading
  const [changeValue, setChangeValue] = useState<string>(value); // 保存修改前的值，如果失败恢复


  // 选中下拉框后的处理
  const onSelect = function(val: string) {
    setVisible(true);
    setValue(val);
  };


  const handelConfirm = function() {
    console.log(changeValue, 'changeValue');
    setLoading(true);
    onConfirm().then(isSuccess => {
      if (isSuccess) {
        setVisible(false);
        setChangeValue(val);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };
  

  return <div className={styles.box}>
    <Select 
      value={value}
      onSelect={val => onSelect(val)}
      className={classnames(visible ? styles.selectActive : '' )}
    >
      {logisticMethods.map((item, index) => {
        return <Option value={item.value} key={index}>{item.label}</Option>;
      })}
    </Select>
    <div className={classnames(styles.btns, visible ? styles.selectActive : 'none' )}>
      <button
        className={classnames(styles.btn, styles.cancel)}
        onClick={() => setVisible(false)}
      ></button>
      <button
        className={classnames(styles.btn, styles.confirm, loading && styles.loading)}
        onClick={handelConfirm}
      >
        { loading && <Spin size="small" />}
      </button>
    </div>
  </div>;
};

export default ConfireDownList;
