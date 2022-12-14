import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { QuestionCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import {
  Tooltip,
} from 'antd';

interface IProps {
  title: string;
  titleparams: string;
  subtitle: string;
  proportion: string;
  visible: boolean;
  order: string;
  width?: number;
  hint?: string;
  callback: (order: string, sort: boolean) => void;
}

const TableHeadTwo: React.FC<IProps> = props => {
  const {
    title,
    titleparams, // 第一栏后端参数
    subtitle, // 环比后端参数
    proportion, // 占比后端参数
    visible, // 是否显示环比
    order, // 正序和降序
    width,
    hint, // ？号图标的提示，有的话就显示出来
    callback,
  } = props;

  // 排序字段   true:升序,false:降序
  const [mainSort, setMainSort] = useState<boolean|string>(''); // 第一栏的
  const [subSort, setSubSort] = useState<boolean|string>(''); // 第二栏的环比
  const [subProportionSort, setSubProportionSort] = useState<boolean|string>(''); // 第二栏的占比

  // 点击其它字段排序后，默认回到初始化状态
  useEffect(() => {
    if (order === '' || order === null) {
      return;
    }

    if (order !== titleparams) {
      setMainSort('');
    }

    if (order !== subtitle) {
      setSubSort('');
    }

    if (order !== proportion) {
      setSubProportionSort('');
    }
  }, [order, titleparams, subtitle, proportion]);

  // 第一栏排序回调
  const mainCallback = () => {
    // 升序
    if (mainSort === '') {
      callback(titleparams, false);
      setMainSort(false);
    } else if (mainSort === false) {
      callback(titleparams, !mainSort as boolean);
      setMainSort(!mainSort);
    }

    // 已经是倒序的话，取消排序
    if (mainSort === true) {
      setMainSort('');
      callback('', true);  
    }
  };

  // 第二栏环比排序回调
  const ratioCallback = () => {
    // 升序
    if (subSort === '') {
      callback(subtitle, false);
      setSubSort(false);
    } else if (subSort === false) {
      callback(subtitle, !subSort as boolean);
      setSubSort(!subSort);
    }

    // 已经是倒序的话，取消排序
    if (subSort === true) {
      setSubSort('');
      callback('', true);  
    }
  };

  // 第二栏占比排序回调
  const proportionCallback = () => {
    // 升序
    if (subProportionSort === '') {
      callback(proportion, false);
      setSubProportionSort(false);
    } else if (subProportionSort === false){
      callback(proportion, !subProportionSort as boolean);
      setSubProportionSort(!subProportionSort);
    }

    // 已经是倒序的话，取消排序
    if (subProportionSort === true) {
      setSubProportionSort('');
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
          }}
          className={classnames( styles.subTitle, styles.ratio)}
          title="点击排序"
          onClick={ratioCallback}
        >
          环比 
          <span className={styles.sortIcons}>
            <CaretUpOutlined className={classnames(styles.subIcon, subtitle === order && subSort ? styles.sorted : '')}/>
            <CaretDownOutlined className={classnames(styles.subIcon, subtitle === order && subSort === false ? styles.sorted : '')}/>
          </span>
        </p>
        <p 
          className={classnames( styles.subTitle, visible ? '' : styles.hideRatio)}
          title="点击排序"
          onClick={proportionCallback}
        >
          占比 
          <span className={styles.sortIcons}>
            <CaretUpOutlined className={classnames(styles.subIcon, proportion === order && subProportionSort ? styles.sorted : '')}/>
            <CaretDownOutlined className={classnames(styles.subIcon, proportion === order && subProportionSort === false ? styles.sorted : '')}/>
          </span>
        </p>
      </div>
    </div>
  );
};

export default TableHeadTwo;
