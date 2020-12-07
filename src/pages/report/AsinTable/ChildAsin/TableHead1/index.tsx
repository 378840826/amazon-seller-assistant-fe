import React, { useState } from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
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

const TableHead: React.FC<IProps> = props => {
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
  const [ratioSort, setSubSort] = useState<boolean|string>(''); // 第二栏的环比
  const [proportionSort, setProportionSort] = useState<boolean|string>(''); // 第二栏的占比

  // 排序回调
  const mainCallback = () => {
    mainSort === '' ? callback(titleparams, false) : callback(titleparams, mainSort as boolean);
    mainSort === '' ? setMainSort(true) : setMainSort(!mainSort);
  };

  // 环比排序回调
  const ratioCallback = () => {
    ratioSort === '' ? callback(subtitle, false) : callback(subtitle, ratioSort as boolean);
    ratioSort === '' ? setSubSort(true) : setSubSort(!ratioSort);
  };

  // 占比排序回调
  const proportionCallback = () => {
    proportionSort === '' ? callback(proportion, false) : callback(proportion, proportionSort as boolean);
    proportionSort === '' ? setProportionSort(true) : setProportionSort(!proportionSort);
  };

  return (
    <div className={styles.tableHead} style={{
      width: width ? width : 'auto',
    }}>
      <p className={classnames(
        styles.title,
        titleparams === order ? styles.sorted : ''
      )} 
      title="点击排序"
      onClick={mainCallback}
      >
        {title}
        {
          hint ? <Tooltip title={hint}>
            <QuestionCircleOutlined className={styles.hint}/></Tooltip>
            : null
        }
        <Iconfont 
          type="icon-xiangxiajiantou" 
          className={`${styles.sort} ${mainSort === false ? styles.active : ''}`}
          style={{
            display: titleparams === order ? 'inline-block' : 'none',
          }}
        />
      </p> 
      <p 
        className={styles.subTitle}
        onClick={() => subtitle }
        title="点击排序"
      >
        <span className={classnames(
          styles.text,
          subtitle === order ? styles.sorted : ''
        )} style={{
          display: visible ? 'inline-block' : 'none',
        }} onClick={ratioCallback}>
          环比
          <Iconfont 
            type="icon-xiangxiajiantou" 
            className={`${styles.sort} ${ratioSort === false ? styles.active : ''}`}
            style={{
              display: subtitle === order ? 'inline-block' : 'none',
            }}
          />
        </span>
        <span className={classnames(
          styles.text,
          proportion === order ? styles.sorted : ''
        )} style={{
          width: visible ? '50%' : '100%',
        }} onClick={proportionCallback}>
          占比
          <Iconfont 
            type="icon-xiangxiajiantou" 
            className={`${styles.sort} ${proportionSort === false ? styles.active : ''}`}
            style={{
              display: proportion === order ? 'inline-block' : 'none',
            }}
          />
        </span>
      </p>
    </div>
  );
};

export default TableHead;
