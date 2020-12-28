import React, { useState } from 'react';
// import { history } from 'umi';
import { Tabs, message } from 'antd';
import { connect } from 'dva';
import { validate } from '@/utils/utils';
import logo from '@/assets/logoWhite.png';
import { IConnectProps } from '@/models/connect';
import { ILogin } from '@/services/user';
import loginBanner from '@/assets/LRBanner.png';
import WeChat from './components/WeChat';
import Captcha from './components/Captcha';
import RegSuc from './components/regSuccess';
import LR from './components/LR';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './index.less';

const status = {
  email: '',
  password: '',
  rememberMe: false,
  code: '',
};
let emailSite = '';
const regEmail = /@(\w)+((\.\w+)+)$/;
const tabBarStyle = {
  fontSize: '16px',
};

const Login: React.FC<IConnectProps> = function ({ dispatch }) {
  const { TabPane } = Tabs;
  const [show, setShow] = useState(false);//验证码弹出框展示与否
  const [loginLoading, setLoginLoading] = useState(false);//登录注册按钮的loading判断
  const [codeLoading, setCodeLoading] = useState(false);//发送验证码的loading判断
  const [active, setActive] = useState('');//有邮箱site，则是未激活
  const [regSuccess, setRegSuccess] = useState(false);//注册成功的判断
  const [feedbackMessage, setFdMessage] = useState('');//验证码相关的错误的信息(验证码返回字段中有验证码相关字段)
  const [feedbackPwdMessage, setFeedbackPwdMessage] = useState('');//密码相关的错误信息
 

  //登录注册事件
  const loginRegister = () => {
    
    const sendParams: ILogin = {
      email: '',
      password: '',
      rememberMe: false,
    };
    Object.keys(status).forEach((key) => {
      if (status[key]){
        sendParams[key] = status[key];
      }
    });
    dispatch({
      type: 'user/login',
      payload: sendParams,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (res: any) => {
        const m: RegExpMatchArray | null = sendParams.email.match(regEmail);
        if (m?.length){
          emailSite = `http://www.mail.${ m[0].substr(1)}`;
        }
        setLoginLoading(false);
        setCodeLoading(false);
        if (res.code === 402){
          //注册了但未激活
          setShow(false);//验证码弹出框展示与否
          setActive(emailSite);
          return;
        }

        if (res.code === 200){
          //注册
          if (res.data.action === 'register'){
            setRegSuccess(true);
          } else {
            //登录成功
            dispatch({
              type: 'user/saveCurrentUser',
              payload: res.data.user,
              callback: () => {
                // history.push('/');
                // 如果是登录失效后再次登录，需要请求前面因登录失效没有拿到的店铺列表等数据
                window.location.href = '/';
              },
            });
          }
          return;
        }

        if (res.message){
          //如果是验证码错误
          if (/验证码/.test(res.message)){
            setFdMessage(res.message);
          } else {
            setShow(false);
            if (/密码/.test(res.message)){
              setFeedbackPwdMessage(res.message);
            } else {
              message.error(res.message);
            }
          } 
        }      
      },
    });
  };
 
  const onClickLR = (values: { email: string }) => {
    Object.assign(status, values, { email: values.email.trim() });
    setLoginLoading(true);
    dispatch({
      type: 'user/preLogin',
      payload: {
        username: status.email,
      },
      callback: (res: { code: number; data: { code: boolean } }) => {
        if (res.code === 200 && res.data.code ){
          setLoginLoading(false);
          setShow(true);
        } else {
          Object.assign(status, { code: '' });
          loginRegister();
        }
      },
    });
  };
  const getCaptcha = (code: string) => {
    setCodeLoading(true);
    Object.assign(status, { code: code });
    loginRegister();
  };
  const onClose = () => {
    setShow(false);
    setCodeLoading(false);
    setFdMessage('');
  };

  const onBlurCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.trim() === ''){
      setFdMessage('验证码不能为空');
    }
  };
  const onCodeChange = () => {
    setFdMessage('');
  };
  const onPwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === ''){
      setFeedbackPwdMessage('密码不能为空');
      return;
    }
    if ( !(validate.password.test(val))){
      setFeedbackPwdMessage('长度在6~16，至少包含字母、数字、和英文符号中的两种');
      return;
    }
    setFeedbackPwdMessage('');
  };

  const onPwdFocus = () => {
    setFeedbackPwdMessage('');
  };

  const onResentEmail = () => {
    dispatch({
      type: 'user/resentEmail',
      payload: {
        email: status.email,
      },
    });
  };


  return (
    <div className={styles.container}>
      <div className={styles.containerWrap}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="logo" />
        </div>
        <div className={styles.mainContainer}>
          <div className={styles.tipWhite}>
            <div className={styles.whiteContainer}>
              <div className={styles.imgContainer}>
                <img src={loginBanner} alt="图片"/>
              </div>
              <div className={styles.formContainer}>
                {!regSuccess && 
                  <div className={styles.noRegSuc}>
                    <Tabs defaultActiveKey="2" className="__login_tabs" tabBarStyle={tabBarStyle}>
                      <TabPane tab="微信登录" key="1"> 
                        <WeChat/>
                      </TabPane>
                      <TabPane tab="账号登录" key="2">
                        <LR 
                          onClickLR={onClickLR} 
                          onPwdChange={onPwdChange} 
                          onPwdFocus={onPwdFocus}
                          feedbackPwdMessage={feedbackPwdMessage} 
                          loginLoading={loginLoading}
                        />
                        <div className={styles.activeContainer}>
                          {active && 
                          <div className={styles.activeWrapper}>
                            账号未激活，请前往<a href={active} rel="noopener noreferrer" target="_blank">邮箱激活</a>
                          </div>}
                        </div>
                      </TabPane>
                    </Tabs>
                    {show && <Captcha getCaptcha={getCaptcha} codeLoading={codeLoading} 
                      feedbackMessage={feedbackMessage} onCodeChange={onCodeChange}
                      onBlurCodeChange={onBlurCodeChange}
                      onClose={onClose}/>}
                  </div>
                }

                {regSuccess && 
                  <RegSuc emailSite={emailSite} onResentEmail={onResentEmail}/>
                }
              </div>
            </div>
            <div className={styles.tip}>建议使用Chrome，Firefox，360等浏览器</div>
          </div>

        </div>
        <GlobalFooter className="__globalFooter"/>
      </div>

    </div>
  );
};
export default connect()(Login);
