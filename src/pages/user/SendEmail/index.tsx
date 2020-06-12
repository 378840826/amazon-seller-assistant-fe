import React, { useState, useRef } from 'react';
import { message, Form, Button, Input, Col, Row } from 'antd';
import { connect } from 'dva';
import logo from '@/assets/logoWhite.png';
import { validate } from '@/utils/utils';
import { IConnectProps } from '@/models/connect';
import loginBanner from '@/assets/loginBanner.png';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './index.less';
let newDate = new Date().getTime();
const layout = {
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};


const SendEmail: React.FC<IConnectProps> = function ({ dispatch }) {
  let imgUrl = `/api/system/user/code?random=${newDate}`;
  const [loading, setLoading] = useState(false);
  const refImg = useRef<HTMLImageElement>(null);

  const [codeFeedback, setCodeFeedback] = useState<{
    validateStatus: '' | 'error' | 'success' | 'warning' | 'validating' | undefined;
    errorMsg: null | string;
}>({ validateStatus: 'success', errorMsg: null });

  const onChangePic = () => {
    const target = refImg.current;
    newDate = new Date().getTime();
    imgUrl = `/api/system/user/code?random=${newDate}`;
    target && target.setAttribute('src', imgUrl);
  };

  const onCodeChange = () => {
    setCodeFeedback({
      validateStatus: '',
      errorMsg: null,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    const params = {
      email: values.email,
      code: values.captcha,
      random: newDate,
    };
    if (values.captcha.trim() !== ''){
      setLoading(true);
      dispatch({
        type: 'user/sendForgetEmail',
        payload: params,
        callback: (res: { code: number; message: string }) => {
          if (res.code === 200){
            message.success(res.message);
          } else {
            onChangePic();
            if (res.message.match(/验证码/)){
              setCodeFeedback({ validateStatus: 'error', errorMsg: res.message });
            } else {
              message.error(res.message);
            }
          }
          setLoading(false);
        },
      });
    }
    
    
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
                <Form
                  {...layout}
                  name="basic"
                  onFinish={onFinish}
                  className="__form_cover"

                >
                  <Form.Item name="email" rules={[
                    () => ({
                      validator: (rule, value) => new Promise((resolve, reject) => {
                        if (!value){
                          reject('邮箱不能为空');
                          return;
                        }
                        if (value){
                          if (!validate.email.test(value)){
                            reject('邮箱格式不正确');
                            return;
                          }
                          dispatch({
                            type: 'user/existEmail',
                            payload: {
                              email: value,
                            },
                            callback: (res: { data: { exist: boolean } }) => {
                              if (!res.data.exist){
                                reject('邮箱不存在'); 
                              }
                              resolve();
                            },
                          });
                        }  
                      }),
                    
                    }),
                  ]}
                  >
                    <Input placeholder="请输入注册邮箱" autoComplete="off"/>
                  </Form.Item>
                  <Form.Item className="imgCode" 
                    validateStatus={codeFeedback.validateStatus}
                    help={codeFeedback.errorMsg}
                  >
                    <Row gutter={8}>
                      <Col span={14}>
                        <Form.Item
                          name="captcha"
                          noStyle
                          rules={[{ required: true, message: '验证码不能为空' }]}
                        >
                          <Input placeholder="请输入验证码" onChange={onCodeChange}/>
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <div className="imgCodeWrapper">
                          <img src={imgUrl} alt="验证码" onClick={onChangePic} ref={refImg}/>
                        </div>
                      </Col>
                    </Row>
                  </Form.Item>
                  <Form.Item {...tailLayout}>
                    <Button htmlType="submit" type="primary" loading={loading}>发送链接</Button>
                  </Form.Item>
                </Form>
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
export default connect()(SendEmail);
