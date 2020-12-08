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
  visible: boolean;
  order: string;
  width?: number;
  hint?: string;
  align?: 'left' | 'center' | 'right';
  callback: (order: string, sort: boolean) => void;
}

const TableHead: React.FC<IProps> = props => {
  const {
    title,
    titleparams, // 第一栏后端参数
    subtitle, // 环比后端参数
    visible, // 是否显示环比
    order, // 排序字段
    width,
    hint, // ？号图标的提示，有的话就显示出来
    align = 'center', // 文本对齐
    callback,
  } = props;

  // 排序字段   true:升序,false:降序
  const [mainSort, setMainSort] = useState<boolean|string>(''); // 第一栏的
  const [subSort, setSubSort] = useState<boolean|string>(''); // 第二栏的环比

  // 排序回调
  const mainCallback = () => {
    mainSort === '' ? callback(titleparams, false) : callback(titleparams, mainSort as boolean);
    mainSort === '' ? setMainSort(true) : setMainSort(!mainSort);
  };

  // 环比排序回调
  const ratioCallback = () => {
    subSort === '' ? callback(subtitle, false) : callback(subtitle, subSort as boolean);
    subSort === '' ? setSubSort(true) : setSubSort(!subSort);
  };

  return (
    <div className={styles.tableHead} style={{
      width: width ? width : 'auto',
    }}>
      <p className={classnames(
        styles.title,
        visible ? '' : styles.notShowTwo,
        titleparams === order ? styles.sorted : ''
      )} 
      title="点击排序"
      onClick={mainCallback}
      style={{
        textAlign: align,
      }}
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
        style={{
          display: visible ? 'block' : 'none',
        }}
        className={classnames(
          styles.subTitle,
          subtitle === order ? styles.sorted : ''
        )}
        title="点击排序"
        onClick={ratioCallback}
      >
        环比 
        <Iconfont
          type="icon-xiangxiajiantou" 
          className={`${styles.sort} ${subSort === false ? styles.active : ''}`}
          style={{
            display: subtitle === order ? 'inline-block' : 'none',
          }}
        />
      </p>
    </div>
  );
};

export default TableHead;
