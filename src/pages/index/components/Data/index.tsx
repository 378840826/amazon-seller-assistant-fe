import React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Iconfont } from '@/utils/utils';
import I1 from '@/assets/index/i1.png';
import { IConnectState, IConnectProps } from '@/models/connect';
import { IUserModelState } from '@/models/user';
import styl from '../AD/index.less';
import styles from '../../index.less';

interface ICenterConnectProps extends IConnectProps {
  user: IUserModelState;
}
const Data: React.FC<ICenterConnectProps> = function( { user } ){
  const id = user.currentUser.id;
  return (
    <div className={styl.data_wrap}>
      <div className={styl.left}>
        <div className={styl.title}>数据大盘</div>
        <div className={styl.contentContainer}>                            
          <div className={styl.content}>1、对接亚马逊官方接口，安全值得信赖； </div>
          <div className={styl.content}>2、多店铺数据全范围展示，您的江山一览无遗；</div>
          <div className={styl.content}>3、自动化报表，精准及时，从Excel中解放双手。</div>
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
      <div className={styl.data_unique}>
        <img src={I1} alt="图片"/>
      </div>
    </div>
  );
};

export default connect(({ user }: IConnectState) => ({
  user,
}))(Data);
