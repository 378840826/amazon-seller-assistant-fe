/**
 * 数据分析目标的层级路径， 广告活动》广告组》广告/关键词 等
 * 用于数据分析弹窗
 */
import React from 'react';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';

interface IProps {
  /** 按 [广告活动, 广告组, 广告/关键词等] 的顺序 */
  nameList: Array<string | undefined>;
}

const PathCrumbs: React.FC<IProps> = props => {
  const { nameList } = props;

  return (
    <div className={styles.container}>
      {
        nameList.map(item => (
          item && <span key={item}>
            {item}<Iconfont type="icon-zhankai" className={styles.separator} />
          </span>
        ))
      }
      数据分析
    </div>
  );
};

export default PathCrumbs;
