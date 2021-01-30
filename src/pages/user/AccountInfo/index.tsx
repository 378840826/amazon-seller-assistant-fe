import React, { useState } from 'react';
import { Form, Button, Input, message } from 'antd'; 
import logo from '@/assets/logo.png';
import styles from './index.less';
import GlobalFooter from '@/components/GlobalFooter';
import { validate } from '@/utils/utils';
import { useDispatch } from 'umi';
import { regEmail } from '../Login';
import { Iconfont } from '@/utils/utils';
import RegSuc from '../Login/components/regSuccess';

const layout = {
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};

let emailSite = '';
const status = {
  email: '',
  password: '',
  rememberMe: false,
};

const AccountInfo = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false, //提交按钮是否处于loading状态
    active: true, //是否处于激活状态
  });

  const onResentEmail = () => {
    dispatch({
      type: 'user/resentEmail',
      payload: {
        email: status.email,
      },
    });
  };

  const close = () => {
    setState((state) => ({
      ...state,
      active: false,
    }));
  };

  const onFinish = (value: {email: string; password: string}) => {
    Object.assign(status, { ...value });
    dispatch({
      type: 'user/login',
      payload: {
        email: value.email,
        password: value.password,
        rememberMe: false,
      },
      callback: (res: {code: number; data: {action: string};message: string }) => {
        const m: RegExpMatchArray | null = value.email.match(regEmail);
        if (m?.length){
          emailSite = `http://www.mail.${ m[0].substr(1)}`;
        }
        if (res.code === 402){ //注册了 但未激活
          setState((state) => ({
            ...state,
            loading: false,
            active: true,
          }));
          return;
        }
        if (res.code === 200){
          if (res.data.action === 'register'){ //注册
            setState((state) => ({
              ...state,
              loading: false,
              active: true,
            }));
            return;
          }
        }
        message.error(res.message);
        setState((state) => ({
          ...state,
          loading: false,
        }));
      },
    });
  };
  return (

    <div className={styles.container}>
      <div className={styles.containerWrap}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="logo" />
        </div>
        <div className={styles.mainContainer_wrap}>
          <div className={styles.mainContainer} >
            <div className={styles.account_info}>
              <div className={styles.title}>填写账号信息</div>
              <Form
                {...layout}
                name="basic"
                onFinish={onFinish}
                className={styles.__form}
              >
                <Form.Item name="email" validateTrigger={['onBlur', 'onFocus']} rules={[
                  { message: '', validateTrigger: 'onFocus' },
                  () => ({
                    validator: (rule, value) => new Promise((resolve, reject) => {
                      if (!value || !(value.trim())){
                        reject('邮箱不能为空');
                        return;
                      }
                      if (value){
                        if (!validate.email.test(value)){
                          reject('邮箱格式不正确');
                          return;
                        }
                      }
                      dispatch({
                        type: 'user/existEmail',
                        payload: {
                          email: value.trim(),
                        },
                        callback: (res: { data: { exist: boolean } }) => {
                          if (res.data.exist){
                            reject('邮箱已存在'); 
                          }
                          resolve();
                        },
                      });
                    }),
                    validateTrigger: 'onBlur',
                  }),
                ]}>
                  <Input placeholder="请输入邮箱" autoComplete="off"/>
                </Form.Item>
                <Form.Item name="password" validateTrigger={['onBlur', 'onFocus']} rules={[
                  { required: true, message: '密码不能为空', validateTrigger: 'onBlur' },
                  { pattern: validate.password, message: '密码格式不正确', validateTrigger: 'onBlur' },
                  { message: '', validateTrigger: 'onFocus' },
                ]}>
                  <Input.Password placeholder="请输入密码"/>
                </Form.Item>
                <div className={styles.tips}>已有账号请登录后，前往个人中心进行微信绑定</div>
                <Form.Item {...tailLayout}>
                  <Button 
                    className={styles.__button}
                    htmlType="submit" 
                    type="primary" 
                    loading={state.loading}>提交</Button>
                </Form.Item>
              </Form>
            </div>
            {state.active && 
           <div className={styles.__active}>
             <div className={styles.icon_close_wrapper}>
               <Iconfont onClick={() => close()} className={styles.icon_close} type="icon-cuo"/>
             </div>
             <RegSuc emailSite={emailSite} onResentEmail={onResentEmail}/>
           </div>
            } 
          </div>
        </div>
        <GlobalFooter/>
      </div>

    </div>
  );
}
;
export default AccountInfo;
