import React, { useEffect, useState } from 'react';
import styles from './index.less';
import {
  Button,
  message,
} from 'antd';
import {
  useDispatch,
  Dispatch,
} from 'umi';

interface IProps {
  status: boolean;
  id: string;
}

const SignHandle: React.FC<IProps> = (props) => {
  const dispatch: Dispatch = useDispatch();
  const [btnStatus, setBtnStatus] = useState<boolean>(props.status || false);

  const handleCommect = () => {
    const id = props.id;
    new Promise((resolve, reject) => {
      dispatch({
        type: 'commentMonitor/signHandle',
        payload: {
          reject,
          resolve,
          id,
        },
      });
    }).then( datas => {
      const data = datas as {message: string};
      const msg = data.message;
      if (msg === '处理成功') {
        message.success(msg);
        setBtnStatus(true);
      } else {
        message.error(msg);
      }
    }).catch( err => {
      message.error(err || '未成功');
    });
  };

  return (
    <>
      <Button 
        className={`${styles.done} ${styles.common}`} 
        disabled={btnStatus}
        style={{ display: btnStatus ? 'block' : 'none' }}
      >
        已处理
      </Button>
      <Button
        className={`${styles.handle} ${styles.common}`}
        onClick={ handleCommect }
        style={{ display: btnStatus ? 'none' : 'block' }}
      >
        标志已处理
      </Button>
    </>
  );
};

export default SignHandle;
