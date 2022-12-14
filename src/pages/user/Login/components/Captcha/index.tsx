import React, { useRef } from 'react';
import { IConnectProps } from '@/models/connect';
import { Iconfont } from '@/utils/utils';
import { Form, Input, Row, Col, Button } from 'antd';
import styles from './index.less';

interface ICapConnectProps extends IConnectProps{
  getCaptcha: Function;
  codeLoading: boolean;
  onClose: () => void;
  feedbackMessage: string;
  onCodeChange: () => void;
  onBlurCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const layout = {
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};
let newDate = new Date().getTime();
const Captcha: React.FC<ICapConnectProps> = (
  { getCaptcha, codeLoading, onClose, feedbackMessage, onCodeChange, onBlurCodeChange }
) => {
  let imgUrl = `/api/system/user/code?random=${newDate}`;
  const refImg = useRef<HTMLImageElement>(null);

  const onChangePic = () => {
    const target = refImg.current;
    newDate = new Date().getTime();
    imgUrl = `/api/system/user/code?random=${newDate}`;
    target && target.setAttribute('src', imgUrl);
  };


  if (feedbackMessage && feedbackMessage !== '验证码不能为空'){
    onChangePic();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    if (values.captcha.trim() !== ''){
      getCaptcha(values.captcha, newDate);
    }
     
  };

  return (
    <div className={styles.captcha}>
      <div className={styles.container}>
        <div className={styles.iconfont}>
          <Iconfont type="icon-cuo" className={styles.close} onClick={onClose}/>
        </div>
        <div className={styles.formContainer}>
          <Form
            {...layout}
            name="login_basic"
            autoComplete="new-basic"
            onFinish={onFinish}
            className="__form_cover"
          >
            <Form.Item className="imgCode"
              validateStatus={feedbackMessage ? 'error' : 'success'}
              help={feedbackMessage}
            >
              <Row gutter={12}>
                <Col span={14}>
                  <Form.Item
                    name="captcha"
                    noStyle
                  >
                    <Input onFocus={onCodeChange} onBlur={onBlurCodeChange} autoComplete="off" placeholder="请输入验证码"/>
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <div className="imgCodeWrapper">
                    <img src={imgUrl} alt="验证码" onClick={onChangePic} ref={refImg}/>
                  </div>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item {...tailLayout} className="__button">
              <Button htmlType="submit" type="primary" loading={codeLoading}>确定</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default Captcha;
