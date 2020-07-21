import React from 'react';
import styles from './index.less';


interface IProps {
  hint?: string;
  className?: string;
}


const TableNotData: React.FC<IProps> = (props) => {
  return (
    <div className={`${styles.table_not_data} ${props.className}`}>
      <img src={require('@/assets/notFind.png')} alt="空数据图片"/>
      <p className="hint">{ props.hint || '默认文本'}</p>
    </div>
  );
};

export default TableNotData;