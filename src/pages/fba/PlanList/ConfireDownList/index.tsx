/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-07 11:02:53
 * @LastEditTime: 2021-05-13 11:44:38
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

interface IProps {
  val: string;
  onConfirm: (newValue: string) => Promise<boolean>;
  dataList: string[];
}

const { Option } = Select;
const ConfireDownList: React.FC<IProps> = props => {
  const {
    val,
    onConfirm,
    dataList,
  } = props;

  const [value, setValue] = useState<string>(val);
  const [visible, setVisible] = useState<boolean>(false); // 修改后，显示边框和确认按钮
  const [loading, setLoading] = useState<boolean>(false); // 修改后，确认loading


  // 选中下拉框后的处理
  const onSelect = function(val: string) {
    setVisible(true);
    setValue(val);
  };


  const handelConfirm = function() {
    setLoading(true);
    onConfirm(value).then(isSuccess => {
      if (isSuccess) {
        setVisible(false);
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
      {dataList.map((item, index) => {
        return <Option value={item} key={index}>{item}</Option>;
      })}
    </Select>
    <div className={classnames(styles.btns, visible ? styles.selectActive : 'none' )}>
      <button
        className={classnames(styles.btn, styles.cancel)}
        onClick={() => {
          setVisible(false);
          setValue(val);
        }}
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
