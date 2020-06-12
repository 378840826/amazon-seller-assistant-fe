import React from 'react';
import { history } from 'umi';
import { Form, Input, Button, message } from 'antd'; 
import { connect } from 'dva';
import { IConnectProps } from '@/models/connect';
import { getUrlParam, validate } from '@/utils/utils';
import styles from './index.less';
import GlobalFooter from '@/components/GlobalFooter';
import logo from '@/assets/logo.png';
import { Store } from 'antd/lib/form/interface';
const layout = {
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};
const uuid = getUrlParam('uuid');
const PasswordReset: React.FC<IConnectProps> = ({ dispatch }) => {

  
  const onFinish = (values: Store) => {
    const password = values.confirmPassword;
    dispatch({
      type: 'user/resetPwd',
      payload: {
        uuid: uuid,
        password: password,
      },
      callback: (res: {code: number; message: string}) => {
        if (res.code === 200){
          message.success(res.message);
          setTimeout(() => {
            history.push('/users/login');
          }, 3000);
        } else {
          message.error(res.message);
        }
        
      },
    });
    
  };
    
  return (
    <div className={styles.container}>
      <div className={styles.logoForm}>
        <img src={logo} alt="图片"/>
        <div className={styles.formContainer}>
          <div className={styles.form}>
            <div className={styles.title}>设置新密码</div>
            <div className={styles.formMargin}>
              <Form
                {...layout}
                name="basic"
                onFinish={onFinish}
                className="__form_cover"
              >
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '新密码不为空' },
                    { pattern: validate.password, message: '新密码格式不正确' }]}
                >
                  <Input.Password placeholder="请输入新密码" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[{ required: true, message: '确认密码不为空' },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('两次密码输入不一致');
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="请确认密码" />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit" >提交</Button>
                </Form.Item>
              </Form>
            </div>
           
          </div>
        </div>
      </div>
        
      <GlobalFooter className="__global_footer"/>
    </div>
  );
};

export default connect()(PasswordReset);
