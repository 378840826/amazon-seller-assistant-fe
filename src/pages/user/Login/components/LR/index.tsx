import React from 'react';
import { connect } from 'dva';
import { IConnectProps } from '@/models/connect';
import { Form, Button, Input, Checkbox } from 'antd';
import { validate } from '@/utils/utils';

import styles from './index.less';


interface ILRConnectProps extends IConnectProps{
  onClickLR: Function;
  loginLoading: boolean;
  feedbackPwdMessage: string;
  onPwdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPwdFocus: () => void;
}
const LR: React.FC<ILRConnectProps> = ({ onClickLR, loginLoading, 
  feedbackPwdMessage, onPwdChange, onPwdFocus }) => {
 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    console.log(values);
    if (values.password.trim() !== ''){
      onClickLR(values);
    }
  };
 

  const layout = {
    wrapperCol: { span: 24 },
  };
  const tailLayout = {
    wrapperCol: { span: 24 },
  };
  return (
    <div className={styles.login_register}>
      <Form
        {...layout}
        name="basic"
        onFinish={onFinish}
        initialValues={{ rememberMe: false }}
        className="__form_cover"
      >
        <Form.Item className="__email" name="email" validateTrigger={['onBlur', 'onFocus']} rules={[{ required: true, message: '邮箱不能为空', validateTrigger: 'onBlur' },
          { pattern: validate.email, message: '邮箱格式不正确', validateTrigger: 'onBlur' },
          { message: '', validateTrigger: 'onFocus' }]}>
          <Input placeholder="请输入邮箱" autoComplete="off"/>
        </Form.Item>
        <Form.Item className="__password" name="password" validateStatus={feedbackPwdMessage ? 'error' : 'success'} help={feedbackPwdMessage}>
          <Input.Password placeholder="请输入密码" onFocus={onPwdFocus} onBlur={onPwdChange}/>
        </Form.Item>
        <Form.Item className="__remember_forgot">
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox>7天自动登录</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="/users/send-email">
          忘记密码
          </a>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button htmlType="submit" type="primary" loading={loginLoading}>登录 / 注册 </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect( )(LR);
