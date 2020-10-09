import React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Iconfont } from '@/utils/utils';
import I1 from '@/assets/index/i2.png';
import { IConnectState, IConnectProps } from '@/models/connect';
import { IUserModelState } from '@/models/user';
import styl from '../AD/index.less';
import styles from '../../index.less';

interface ICenterConnectProps extends IConnectProps {
  user: IUserModelState;
}
const ASIN: React.FC<ICenterConnectProps> = function( { user } ){
  const id = user.currentUser.id;
  return (
    <div className={styl.AD}>
      <div className={styl.left}>
        <div className={styl.title}>ASIN动态</div>
        <div className={styl.contentContainer}>
          <div className={styl.content}>1、ASIN历史变化点滴全纪录，帮你轻松复盘；</div>
          <div className={styl.content}>2、变体拆分前后效果对比，拆合不再迷茫；</div>
          <div className={styl.content}>3、针对竞争对手调价，紧随市场脚步。</div>
        </div>  
        {id === -1 && 
        <div className={styles.unLogin}>
          <Link className={[styles.regButton, styles.buttons].join(' ')} to="/users/login">
            <div className={styles.font}>免费注册</div>
            <div className={styles.icon}>
              <Iconfont className={styles.iconfont} type="icon-2"/>
            </div>
          </Link>
        </div>
        }
              
        {
          id !== -1 && 
          <div className={styles.logined}>
            <Link to="/product" className={[styles.loginedButton, styles.buttons].join(' ')}>
              <div className={styles.font}>立即体验</div>
              <div className={styles.icon}>
                <Iconfont className={styles.iconfont} type="icon-2"/>
              </div>
            </Link>
          </div>
        }
      </div>
      <div className={styl.right}>
        <img src={I1} alt="图片"/>
      </div>
    </div>
  );
};

export default connect(({ user }: IConnectState) => ({
  user,
}))(ASIN);
