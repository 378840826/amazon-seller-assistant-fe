import React, { useState, useEffect } from 'react';
import styles from './index.less';

interface IUpdateProps {
  update: string;
}

const Update: React.FC<IUpdateProps> = (props) => {
  const {
    update,
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

  return <>
    <p className={styles.date}>
      <span>更新时间：</span>
      <span>{date}</span>
      <span>（{area}）</span>
    </p>
  </>;
};

export default Update;
