import React from 'react';
import styles from './index.less';
interface IOperatorBar {
  rowListUpdate: (type: string) => void;
}
const OperatorBar: React.FC<IOperatorBar > = ({ rowListUpdate }) => {
  return (
    <div className={styles.operatorBar_container}>
      <span className={styles.all_buttons_font}>批量标记：</span>
      <button onClick={() => rowListUpdate('replied-true') }>已回复</button>
      <button onClick={() => rowListUpdate('replied-false') }>未回复</button>
      <button onClick={() => rowListUpdate('read-true') }>已读</button>
      <button onClick={() => rowListUpdate('read-false') }>未读</button>
    </div>
  );
};
export default OperatorBar;
