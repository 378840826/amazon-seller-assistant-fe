/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-15 17:17:25
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinTable\ParentAsin\TableHead\index.tsx
 * 
 * 表头组件，这个组件是没有 占比的，TableHead1是有占比的
 */
import React, { useState } from 'react';
import styles from './index.less';
import { Iconfont } from '@/utils/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  Tooltip,
} from 'antd';

interface IProps {
  style?: React.CSSProperties;
  title: string;
  titleparams: string;
  order: string;
  width?: number;
  hint?: string;
  callback: (order: string, sort: boolean) => void;
}

const TableHead: React.FC<IProps> = props => {
  const {
    title,
    titleparams, // 后端参数
    order, // 正序和降序
    width,
    hint, // ？号图标的提示，有的话就显示出来 
    callback,
    style,
  } = props;

  // 排序字段   true:升序,false:降序
  const [mainSort, setMainSort] = useState<boolean|string>(''); // 第一栏的

  // 排序回调
  const mainCallback = () => {
    mainSort === '' ? callback(titleparams, false) : callback(titleparams, mainSort as boolean);
    mainSort === '' ? setMainSort(true) : setMainSort(!mainSort);
  };
  
  const istyle = {
    width: width ? width : 'auto',
    ...style,
  };
  
  return (
    <div className={styles.tableHead} style={istyle}>
      <p className={`${styles.title}`} 
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
    </div>
  );
};

export default TableHead;
