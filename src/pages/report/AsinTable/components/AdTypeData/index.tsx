import React from 'react';
import styles from './index.less';

interface IProps {
  start: number;
  pause: number;
  pigeonhole: number;
}

const adTypeData: React.FC<IProps> = (props) => {
  const {
    start,
    pause,
    pigeonhole,
  } = props;

  return (
    <>
      <span className={styles.start}>{start}</span>
      <span className={styles.symbol}>/</span>
      <span className={styles.pause}>{pause}</span>
      <span className={styles.symbol}>/</span>
      <span className={styles.pigeonhole}>{pigeonhole}</span>
    </>
  );
};

export default adTypeData;
