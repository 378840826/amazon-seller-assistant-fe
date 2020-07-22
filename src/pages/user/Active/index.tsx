import React, { useState, useLayoutEffect, useEffect } from 'react';
import { getUrlParam } from '@/utils/utils';
import activeEmail from '@/assets/activeEmail.png';
import styles from './index.less';
import { connect } from 'dva';
import { history } from 'umi';
import { IConnectProps } from '@/models/connect';

const uuid = getUrlParam('uuid');
const email = getUrlParam('email');

const Active: React.FC<IConnectProps> = function ({ dispatch }) {
  const [success, setSuccess] = useState(false);
  const [count, setCount] = useState(3);
  useLayoutEffect(() => {
    dispatch({
      type: 'user/activeEmail',
      payload: {
        uuid: uuid,
        email: email,
      },
      callback: (res: { code: number }) => {
        if (res){
          res.code === 200 && setSuccess(true);
        }
      },
    });
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount( count => count - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (count === 1){
    history.push('/');
  }
  return (
    <>
      {success && 
      <div className={styles.activeContainer}>
        <div className={styles.activeFont}>
          <img src={activeEmail} alt="激活"/>
          <span>激活成功！</span>
        </div>
        <div className={styles.countdown}>
          <span className={styles.time}>{count}秒</span>
          <span>后自动跳转AZ助手首页</span>
        </div>
      </div>
      }
      {!success && 
        <div className={styles.failed}>激活失败！</div>
      }
    </>
    
  
  );
};

export default connect()(Active);
