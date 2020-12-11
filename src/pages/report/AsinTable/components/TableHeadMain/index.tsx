import React, { useState } from 'react';
import styles from './index.less';
import { QuestionCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import {
  Tooltip,
} from 'antd';

interface IProps {
  title: string;
  titleparams: string;
  subtitle?: string;
  visible?: boolean;
  order: string;
  width?: number;
  hint?: string;
  align?: 'left' | 'center' | 'right';
  subalign?: 'left' | 'center' | 'right';
  callback: (order: string, sort: boolean) => void;
}

const TableHead: React.FC<IProps> = props => {
  const {
    title,
    titleparams, // 第一栏后端参数
    subtitle = '', // 环比后端参数
    visible = false, // 是否显示环比
    order, // 排序字段
    width,
    hint, // ？号图标的提示，有的话就显示出来
    align = 'center', // 文本对齐
    subalign = 'center', // 文本对齐
    callback,
  } = props;

  // 排序字段   true:升序,false:降序
  const [mainSort, setMainSort] = useState<boolean|string>(''); // 第一栏的
  const [subSort, setSubSort] = useState<boolean|string>(''); // 第二栏的环比

  // 排序回调
  const mainCallback = () => {
    // 升序
    if (mainSort === '') {
      callback(titleparams, false);
      setMainSort(false);
    } else {
      callback(titleparams, !mainSort as boolean);
      setMainSort(!mainSort);
    }

    // 已经是倒序的话，取消排序
    if (mainSort === true) {
      setMainSort('');
      callback('', true);  
    }
  };

  // 环比排序回调
  const ratioCallback = () => {
    // 升序
    if (subSort === '') {
      callback(subtitle, false);
      setSubSort(false);
    } else {
      callback(subtitle, !subSort as boolean);
      setSubSort(!subSort);
    }

    // 已经是倒序的话，取消排序
    if (subSort === true) {
      setSubSort('');
      callback('', true);  
    }
  };

  return (
    <div className={styles.tableHead} style={{
      width: width ? width : 'auto',
    }}>
      <div className={classnames(styles.oneLayout )} >
        <p className={classnames(
          styles.title,
          visible ? '' : styles.notShowTwo,
        )} 
        title="点击排序"
        onClick={mainCallback}
        style={{
          textAlign: align,
        }}
        >
          <span className={styles.oneText}>{title}</span>
          {
            hint ? <Tooltip title={hint}>
              <QuestionCircleOutlined className={styles.hint}/></Tooltip>
              : null
          }
          <span className={styles.sortIcons}>
            <CaretUpOutlined className={classnames(styles.titleIcon, titleparams === order && mainSort ? styles.sorted : '')}/>
            <CaretDownOutlined className={classnames(styles.titleIcon, titleparams === order && mainSort === false ? styles.sorted : '')}/>
          </span>
        </p>
      </div>
      <div className={styles.twoLayout}>
        <p 
          style={{
            display: visible ? 'inline-flex' : 'none',
            textAlign: subalign,
          }}
          className={classnames( styles.subTitle)}
          title="点击排序"
          onClick={ratioCallback}
        >
          环比 
          <span className={styles.sortIcons}>
            <CaretUpOutlined className={classnames(styles.subIcon, subtitle === order && subSort ? styles.sorted : '')}/>
            <CaretDownOutlined className={classnames(styles.subIcon, subtitle === order && subSort === false ? styles.sorted : '')}/>
          </span>
        </p>
      </div>
    </div>
  );
};

export default TableHead;
