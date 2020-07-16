import React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Iconfont } from '@/utils/utils';
import I1 from '@/assets/index/i4.png';
import { IConnectState, IConnectProps } from '@/models/connect';
import { IUserModelState } from '@/models/user';
import styl from './index.less';
import styles from '../../index.less';

interface ICenterConnectProps extends IConnectProps {
  user: IUserModelState;
}
const AD: React.FC<ICenterConnectProps> = function( { user } ){
  const id = user.currentUser.id;
  return (
    <div className={styl.AD}>
      <div className={styl.left}>
        <div className={styl.title}>智能广告</div>
        <div className={styl.contentContainer}>
          <div className={styl.content}>1、强大的数据整合能力，图形化的友好界面； </div>
          <div className={styl.content}>2、自动化的广告管理，安全放心的成本控制，</div>
          <div className={styl.content}>3、由此出发，您的亚马逊广告营销将一路通畅</div>
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
            <Link to="/users/login" className={[styles.loginedButton, styles.buttons].join(' ')}>
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
}))(AD);
