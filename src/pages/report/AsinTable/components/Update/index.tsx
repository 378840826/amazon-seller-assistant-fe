import React, { useEffect, useState } from 'react';
import styles from './index.less';

interface IProps {
  update: string;
  style?: React.CSSProperties;
}

const Update: React.FC<IProps> = props => {
  const {
    update = '',
    style,
  } = props;

  const [date, setDate] = useState<string>('');
  const [area, setArea] = useState<string>('');

  useEffect(() => {
    if (update && update.indexOf('(')) {
      const str = update.replace(')', '');
      const arr = str.split('(') ;

      setDate(arr[0]);
      setArea(arr[1]);
    }
  }, [update]);

  return <div className={styles.updateBox} style={style}>
    <p className={styles.export}>
      本月剩余可导出次数：
      <span className={styles.exportTime}>{0}次</span>
    </p>
    <span>更新时间</span>
    <span className={styles.secondary}>（每天凌晨更新）：</span>
    <span>{date}</span>
    <span className={styles.secondary}>（{area}）</span>
  </div>;
};

export default Update;
