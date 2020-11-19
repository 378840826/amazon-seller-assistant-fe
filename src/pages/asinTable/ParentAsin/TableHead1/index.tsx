/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-15 17:17:25
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinTable\ParentAsin\TableHead1\index.tsx
 * 
 * 表头组件，这个组件是有占比的，TableHead是没有占比的
 */
import React, { useState } from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';


interface IProps {
  title: string;
  titleparams: string;
  subtitle: string;
  order: string;
  width?: number;
  callback: (order: string, sort: boolean) => void;
}

const TableHead: React.FC<IProps> = props => {
  const {
    title,
    titleparams, // 第一栏后端参数
    subtitle, // 占比后端参数
    order, // 正序和降序
    width,
    callback,
  } = props;

  // 排序字段   true:升序,false:降序
  const [mainSort, setMainSort] = useState<boolean|string>(''); // 第一栏的
  const [subSort, setSubSort] = useState<boolean|string>(''); // 第二栏的

  // 排序回调
  const mainCallback = () => {
    mainSort === '' ? callback(titleparams, false) : callback(titleparams, mainSort as boolean);
    mainSort === '' ? setMainSort(true) : setMainSort(!mainSort);
  };

  // 排序回调
  const subCallback = () => {
    subSort === '' ? callback(subtitle, false) : callback(subtitle, subSort as boolean);
    subSort === '' ? setSubSort(true) : setSubSort(!subSort);
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
        <Iconfont 
          type="icon-xiangxiajiantou" 
          className={`${styles.sort} ${mainSort === false ? styles.active : ''}`}
          style={{
            display: titleparams === order ? 'inline-block' : 'none',
          }}
        />
      </p> 
      <p 
        className={classnames(
          styles.subTitle,
          subtitle === order ? styles.sorted : ''
        )}
        title="点击排序"
        onClick={subCallback}
      >
        占比
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
