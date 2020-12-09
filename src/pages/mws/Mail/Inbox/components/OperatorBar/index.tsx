import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
interface IOperatorBar {
  rowListUpdate: (type: string) => void;
}
const OperatorBar: React.FC<IOperatorBar > = ({ rowListUpdate }) => {
  return (
    <div className={styles.operatorBar_container}>
      <span className={styles.all_buttons_font}>批量标记：</span>
      <Button className={styles.__button} onClick={() => rowListUpdate('replied-true') }>已回复</Button>
      <Button className={styles.__button} onClick={() => rowListUpdate('replied-false') }>未回复</Button>
      <Button className={styles.__button} onClick={() => rowListUpdate('read-true') }>已读</Button>
      <Button className={styles.__button} onClick={() => rowListUpdate('read-false') }>未读</Button>
    </div>
  );
};
export default OperatorBar;
