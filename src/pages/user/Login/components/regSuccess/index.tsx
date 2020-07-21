import React, { useState } from 'react';
import { IConnectProps } from '@/models/connect';
import activeEmail from '@/assets/activeEmail.png';
import styles from './index.less';

interface IRegConnectProps extends IConnectProps{
  emailSite: string;
  onResentEmail: Function;
}
const RegSuc: React.FC<IRegConnectProps> = ({ emailSite, onResentEmail }) => {
  const [number, setNumber] = useState(120);
  const [countDown, setCountDown] = useState(false);
 

  const onResent = () => {
    onResentEmail();
    setCountDown(true);
    const timer = setInterval(() => {
      setNumber((number) => {
        if (number === 0){
          clearInterval(timer);
          setCountDown(false);
          return number;
        }
        return number - 1;

      });
    }, 1000);
  };
  
  
  return (
    <div className={styles.regSuccess}>
      <div className={styles.info}>
        <img src={activeEmail} alt="激活"/>
        <div className={styles.emailInfo}>
          注册成功，请<a href={emailSite} rel="noopener noreferrer" target="_blank">前往邮箱</a>进行激活  
        </div>                
      </div>
      <div className={styles.send}>
      没有收到验证邮件？ 
        {!countDown && 
          <span className={styles.resent} onClick={onResent}>重新发送</span>
        }

        {countDown && 
        <span className={styles.countDown}> {number}秒后重新发送 </span>
        }
        
      </div>
    </div>
  );
};
export default RegSuc;
