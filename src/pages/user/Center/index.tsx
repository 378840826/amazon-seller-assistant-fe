import React, { useState } from 'react';
import { connect } from 'dva';
import { Form, Button, Input } from 'antd';
import { validate } from '@/utils/utils';
import styles from './index.less';
import { IConnectState, IConnectProps } from '@/models/connect';
import { IUserModelState } from '@/models/user';
import classnames from 'classnames';
import { Store } from 'antd/lib/form/interface';
interface ICenterConnectProps extends IConnectProps {
  user: IUserModelState;
}

const layout = {
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};
const redirectURI = `http://dev.workics.cn/api/system/user/bind-wechat`;

const Center: React.FC<ICenterConnectProps> = ({ user, dispatch }) => {
  const { id, username: curUsername, email, openId } = user.currentUser;

  const [reUserName, setReUserName] = useState(false);
  const [rePwd, setRePwd] = useState(false);

  const [loadings, setLoadings] = useState([false, false]);
  //用户名修改点击
  const onEditUserName = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (loadings[1]){
      return;
    }
    setReUserName(true);
    setRePwd(false);
  };

  //密码修改点击
  const onEditPwd = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (loadings[0]){
      return;
    }
    setRePwd(true);
    setReUserName(false);

  };
  const onCancelUserName = () => {
    setReUserName(false);
  };

  //用户点击确认按钮
  const onUserNameFinish = (values: Store) => {    
    setLoadings(() => {
      loadings[0] = true;
      return {
        ...loadings,
      };
    });

    dispatch({
      type: 'user/modifyUsername',
      payload: {
        username: values.username,
      },
      callback: (res: { code: number; message: React.SetStateAction<string> }) => {
        if (res.code === 200){
          dispatch({
            type: 'user/modifyCurrentUsername',
            payload: values.username,
          });
        }
        onCancelUserName();
        setLoadings(() => {
          loadings[0] = false;
          return {
            ...loadings,
          };
        });
      },
      
    });
  };
  

  const onPwdCancel = () => {
    setRePwd(false);
  };

  
  const onPwdFinish = (values: Store) => {
    setLoadings(() => {
      loadings[1] = true;
      return {
        ...loadings,
      };
    });
    
    dispatch({
      type: 'user/modifyPwd',
      payload: {
        password: values.confirm,
      },
    
      callback: (res: { code: number }) => {
        if (res && res.code === 200) {
          onPwdCancel();
        }
        setLoadings(() => {
          loadings[1] = false;
          return {
            ...loadings,
          };
        });
      },
    });
    
  };

  const buttonLoading0 = classnames({
    'buttonLoading': loadings[0],
  });

  const buttonLoading1 = classnames({
    'buttonLoading': loadings[1],
  });
  
  return (
   
    <div className={styles.center}>
      <div className={styles.container}>
        <p className={styles.title}>个人中心</p>
        <div className={styles.inputContainers}>
          <div className={styles.inputContainer}>
            <div className={styles.left}>用户名</div>
            <div className={styles.right}>
              <div className={styles.rightContainer}>
                {!reUserName &&
                  <div className={styles.noneFocus}>
                    <input type="text" defaultValue={curUsername} className={styles.inputNoBorder} readOnly />
                    <div className={ styles.editUserName} onClick={onEditUserName}>修改</div>
                  </div>
                }

                { reUserName && 
                  <div className={styles.onFocus}>
                    <Form 
                      {...layout} 
                      className="__form_cover"
                      initialValues = {
                        {
                          username: curUsername,
                        }
                      }
                      onFinish={onUserNameFinish}
                    >
                      <Form.Item name="username" className="__username"
                        validateTrigger={['onBlur', 'onFocus']}
                        rules={[{ message: '', validateTrigger: 'onFocus' },
                          () => ({
                            validator: (rule, value) => new Promise((resolve, reject) => {
                              if (!value){
                                reject('用户名不能为空');
                                return;
                              }
                              if (value){
                                if (!validate.username.test(value)){
                                  reject('长度4~16，支持字母、数字、下划线，不允许为纯数字');
                                  return;
                                }
                                dispatch({
                                  type: 'user/existUsername',
                                  payload: {
                                    username: value,
                                  },
                                  callback: (res: {data: {exist: boolean}}) => {
                                    if (res.data.exist){
                                      reject('用户名已存在');
                                    }
                                    resolve();
                                  },
                                });
                              }
                            },
                            ),
                            validateTrigger: 'onBlur',
                          }),
                        ]} >
                        <Input autoComplete="off" value = {curUsername} />
                      </Form.Item>
                      <Form.Item {...tailLayout}>
                        <Button htmlType="button" onClick={onCancelUserName} className={buttonLoading0} >取消</Button>
                        <Button htmlType="submit" type="primary" loading={loadings[0]}>保存</Button>
                      </Form.Item>
                    </Form>
                  </div>
                }

              </div>
            </div>
          </div>
          <div className={[styles.inputContainer, styles.emailInputContainer].join(' ')}>
            <div className={styles.left}>邮箱</div>
            <div className={styles.right}>
              <div className={styles.rightContainer}>
                <input className={styles.emailInput} type="text" value={email} readOnly />
              </div>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.left}>登录密码</div>
            <div className={styles.right}>
              <div className={styles.rightContainer}>
                {!rePwd &&
                  <div className={styles.noneFocus}>
                    <input type="text" style={{ color: '#666' }} className={styles.inputNoBorder} defaultValue="************" readOnly />
                    <div className={styles.editUserName} onClick={onEditPwd}>修改</div>
                  </div>
                }
                {rePwd && 
                <div className={styles.onFocus}>
                  <Form 
                    {...layout} 
                    className="__form_cover"
                    onFinish={onPwdFinish}
                  >
                    <Form.Item className="__disabled_password">
                      <Input autoComplete="off" defaultValue="************" readOnly/>
                    </Form.Item>
                    <Form.Item 
                      className="__password"
                      name="password"
                      validateTrigger={['onBlur', 'onFocus']}
                      rules={[{ required: true, message: '新密码不能为空', validateTrigger: 'onBlur' },
                        { pattern: validate.password, message: '新密码格式不正确', validateTrigger: 'onBlur' },
                        { message: '', validateTrigger: 'onFocus' }]}
                    >
                      <Input.Password placeholder="新密码，长度4~16之间，至少包含字母、数字和英文符号中的两种" autoComplete="off"/>
                    </Form.Item>
                    <Form.Item 
                      name="confirm"
                      className="__password_confirm"
                      validateTrigger={['onBlur', 'onFocus']}
                      dependencies={['password']}
                      rules={[{ required: true, message: '确认密码不能为空', validateTrigger: 'onBlur' },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject('两次密码输入不一致');
                          },
                          validateTrigger: 'onBlur',
                        }),
                        { message: '', validateTrigger: 'onFocus' },
                      ]}
                    >
                      <Input.Password placeholder="确认新密码" autoComplete="off"/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                      <Button htmlType="button" onClick={onPwdCancel} className={buttonLoading1}>取消</Button>
                      <Button htmlType="submit" type="primary" loading={loadings[1]}>保存</Button>
                    </Form.Item>
                  </Form>
                </div>
                }
              </div>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.left}>账号绑定</div>
            <div className={styles.right}>
              <div className={styles.rightContainer}>
                {openId ? 
                  <>
                    <input value="微信：已绑定" readOnly className={styles.inputNoBorder} />
                    <a href={`javascript:;`} className={styles.editUserName}>解绑</a>
                  </>
                  :
                  <>
                    <input value="微信：未绑定" readOnly className={styles.inputNoBorder} />
                    <a 
                      rel="noreferrer"
                      href={`https://open.weixin.qq.com/connect/qrconnect?appid=wxea22122e145d648c&redirect_uri=${redirectURI}&response_type=code&scope=snsapi_login&state=${id}#wechat_redirect`}
                      target="_blank" 
                      className={styles.editUserName}>绑定</a>
                  </>}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  );
};

export default connect(({ user }: IConnectState) => ({
  user,
}))(Center);
