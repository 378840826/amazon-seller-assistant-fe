import React from 'react';
import styles from './index.less';
interface ICrumbCom{
  remainingTasksNumber: number | string;
}
const CrumbCom: React.FC<ICrumbCom> = ({ remainingTasksNumber }) => {
  return (
    <div className={styles.bread}>
      <div className={styles.left}>关键词搜索排名监控</div>
      <div className={styles.right}>剩余可添加任务：
        <span className={styles.number}>{remainingTasksNumber === '' ? 0 : remainingTasksNumber}个</span>
      </div>
    </div>
  );
};
export default CrumbCom;
