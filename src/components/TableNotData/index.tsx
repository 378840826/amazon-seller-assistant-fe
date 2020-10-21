import React from 'react';
import styles from './index.less';


interface IProps {
  style?: React.CSSProperties;
  hint?: string;
  className?: string;
}


const TableNotData: React.FC<IProps> = (props) => {
  return (
    <div className={`${styles.table_not_data} ${props.className}`} style={props.style}>
      <img src={require('@/assets/notFind.png')} alt=""/>
      <p className={styles.hint}>{ props.hint || '默认文本'}</p>
    </div>
  );
};

export default TableNotData;
