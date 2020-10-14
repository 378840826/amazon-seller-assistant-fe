import React from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Tabs } from 'antd';
import { Iconfont } from '@/utils/utils';
import { IConnectState, IConnectProps } from '@/models/connect';
import { IUserModelState } from '@/models/user';
import ReactWOW from 'react-wow';
import mac from '@/assets/index/mac.png';
import qr from '@/assets/index/qr.png';
import AD from './components/AD';
import ASIN from './components/Asin';
import Price from './components/Price';
import Data from './components/Data';
import PayRule from './components/PayRule';
import Faq from './components/Faq';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './index.less';

const { TabPane } = Tabs;
interface ICenterConnectProps extends IConnectProps {
  user: IUserModelState;
}


const Home: React.FC<ICenterConnectProps> = function( { user } ) {
  const id = user.currentUser.id;
  return (
  
    <div className={styles.homeContainer} id="home">
      <ReactWOW animation="fadeIn" >
        <div className={styles.grey}>
          <div className={styles.w}>
            <div className={styles.part1}>
              <div className={styles.left}>
                <div className={styles.title}>AZ智能助手</div>
                <div className={styles.desc}>
            提供强大的智能调价，智能广告功能，是亚马逊卖家的高端店铺管家                        
                </div>
                {id < 0 && 
                <div className={styles.unLogin}>
                  <Link className={[styles.regButton, styles.buttons].join(' ')} to="/users/login">
                    <div className={styles.font}>免费注册</div>
                    <div className={styles.icon}>
                      <Iconfont className={styles.iconfont} type="icon-2"/>
                    </div>
                  </Link>
                  <Link to="/users/login" className={[styles.loginButton, styles.buttons].join(' ')}>
                    <div className={styles.font}>登录</div>
                    <div className={styles.icon}>
                      <Iconfont className={styles.iconfont} type="icon-2"/>
                    </div>
                  </Link>
                </div>
                }
              
                {
                  id > 0 && 
                <div className={styles.logined}>
                  <Link to="/overview" className={[styles.loginedButton, styles.buttons].join(' ')}>
                    <div className={styles.font}>立即体验</div>
                    <div className={styles.icon}>
                      <Iconfont className={styles.iconfont} type="icon-2"/>
                    </div>
                  </Link>
                </div>
                }
              
                <div className={styles.qr}>
                  <img src={qr} alt="二维码"/>
                  <div>扫码关注龙骐大数据</div>
                </div>
              
              
              </div>
              <div className={styles.right}>
                <img className={styles.mac} src={mac} alt="图片"/>
              </div>
            </div>
          </div>
        </div>
      </ReactWOW >
      <ReactWOW animation="fadeIn" >
        <div className={styles.white} id="fun">
          <div className={styles.w1}>
            <div className={styles.part2}>
              <div className={styles.intro}>功能介绍</div>
              <Tabs className="__index_tabs" defaultActiveKey="1" >
                <TabPane className={styles.__index_tabPane} tab="数据大盘" key="1">
                  <Data/>
                </TabPane>
                <TabPane className={styles.__index_tabPane} tab="ASIN动态" key="2">
                  <ASIN/>
                </TabPane>
                <TabPane className={styles.__index_tabPane} tab="智能调价" key="3">
                  <Price/>
                </TabPane>
                <TabPane className={styles.__index_tabPane} tab="智能广告" key="4">
                  <AD/>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </ReactWOW>
      <ReactWOW animation="fadeIn" >
        <div className={styles.grey} id="pay">
          <div className={styles.w}>
            <div className={styles.part3}>
              <PayRule/>
            </div>
          </div>
        </div>
      </ReactWOW>
      <div className={styles.white} id="fqa">
        <div className={styles.w}>
          <div className={styles.part4}>
            <Faq/>
          </div>
        </div>
      </div>
      <div className={styles.grey}>
        <GlobalFooter className={[styles.w, styles.__index].join(' ')}/>
      </div>
    </div>
  );
};

export default connect(({ user }: IConnectState) => ({
  user,
}))(Home);
