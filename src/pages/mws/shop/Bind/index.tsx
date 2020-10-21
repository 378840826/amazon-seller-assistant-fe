import React, { useState } from 'react';
import { Link, useDispatch, useSelector, history } from 'umi';
import { Store } from 'redux';
import { copyText } from '@/utils/utils';
import {
  Steps,
  Button,
  Form,
  Input,
  Checkbox,
  Col,
  Row,
  Typography,
  message,
} from 'antd';
import { IConnectState } from '@/models/connect';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import step2 from '@/assets/step2.png';
import step3America from '@/assets/step3-America.png';
import step3Europe from '@/assets/step3-Europe.png';
import step4 from '@/assets/step4.png';
import step5 from '@/assets/step5.png';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';

const { Step } = Steps;
const { Group: CheckboxGroup } = Checkbox;
const { Item: FormItem } = Form;
const { Paragraph, Text } = Typography;

const ShopBind: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [disabledNext, setDisabledNext] = useState<boolean>(false);
  const [siteType, setSiteType] = useState<string>('northAmerica');
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const loadingEffect = useSelector((state: IConnectState) => state.loading);
  const submitLoading = loadingEffect.effects['global/bindShop'];

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNorthAmericaChange = (value: CheckboxValueType[]) => {
    if (value.length !== 0) {
      form.setFieldsValue({ europe: [], asiaPacific: [] });
      setSiteType('northAmerica');
      setDisabledNext(false);
    } else {
      setDisabledNext(true);
    }
  };

  const handleEuropeChange = (value: CheckboxValueType[]) => {
    if (value.length !== 0) {
      form.setFieldsValue({ northAmerica: [], asiaPacific: [] });
      setSiteType('europe');
      setDisabledNext(false);
    } else {
      setDisabledNext(true);
    }
  };

  const handleAsiaPacificChange = (value: CheckboxValueType[]) => {
    if (value.length !== 0) {
      form.setFieldsValue({ northAmerica: [], europe: [] });
      setSiteType('asiaPacific');
      setDisabledNext(false);
    } else {
      setDisabledNext(true);
    }
  };

  const handleFinish = (values: { [key: string]: Store }) => {
    dispatch({
      type: 'global/bindShop',
      payload: { ...values },
      callback: (msg: string) => {
        history.push('./list');
        message.success(msg);
      },
    });
  };

  const steps = [
    {
      title: 'Step1',
      content: (
        <div>
          <div className={styles.stepTitle}>
            <i></i>选择站点
          </div>
          <div className={styles.stepContent}>
            <FormItem name="northAmerica" label="北美">
              <CheckboxGroup onChange={handleNorthAmericaChange} name="northAmerica">
                <Checkbox value="US">US美国</Checkbox>
                <Checkbox value="CA">CA加拿大</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem name="europe" label="欧洲">
              <CheckboxGroup onChange={handleEuropeChange}>
                <Checkbox value="UK">UK英国</Checkbox>
                <Checkbox value="DE">DE德国</Checkbox>
                <Checkbox value="FR">FR法国</Checkbox>
                <Checkbox value="ES">ES西班牙</Checkbox>
                <Checkbox value="IT">IT意大利</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem name="asiaPacific" label="亚太">
              <CheckboxGroup onChange={handleAsiaPacificChange} name="asiaPacific">
                <Checkbox value="JP">JP日本</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </div>
        </div>
      ),
    },
    {
      title: 'Step2',
      northAmerica: (
        <div>
          <div className={styles.stepTitle}>
            <i></i>登录卖家平台
          </div>
          <div className={styles.stepContent}>
            <Paragraph>
              1. 请在常用电脑上登录卖家平台，右上角<Text type="danger">Settings</Text>，点击<Text type="danger">User Permissions</Text>；
              <br />
              2. 进入页面找到<Text type="danger">Third party developer and apps</Text>，点击<Text type="danger">Visit Manage Your Apps</Text>；
              <br />
              3. 进入页面后，点击左上角<Text type="danger">Authorize new Developer</Text>按钮，开始MWS服务授权。
              <br />
              注意：只有专业卖家 ( Pro Merchant )可以使用MWS的服务。
            </Paragraph>
            <Paragraph>
              <span className={styles.siteName}>美国</span>：
              <a href="https://sellercentral.amazon.com/gp/mws/registration/register.html" target="_blank" rel="noopener noreferrer">
                https://sellercentral.amazon.com/gp/mws/registration/register.html
              </a>
              <br />
              <span className={styles.siteName}>加拿大</span>：
              <a href="https://sellercentral.amazon.ca/gp/mws/registration/register.html" target="_blank" rel="noopener noreferrer">
                https://sellercentral.amazon.ca/gp/mws/registration/register.html
              </a>
            </Paragraph>
            <img src={step2} alt="示例图"/>
          </div>
        </div>
      ),
      europe: (
        <div>
          <div className={styles.stepTitle}>
            <i></i>登录卖家平台
          </div>
          <div className={styles.stepContent}>
            <Paragraph>
              1. 请在常用电脑上登录卖家平台，右上角<Text type="danger">Settings</Text>，点击<Text type="danger">User Permissions</Text>；
              <br />
              2. 进入页面找到<Text type="danger">Third party developer and apps</Text>，点击<Text type="danger">Visit Manage Your Apps</Text>；
              <br />
              3. 进入页面后，点击左上角<Text type="danger">Authorize new Developer</Text>按钮，开始MWS服务授权。
              <br />
              注意：只有专业卖家 ( Pro Merchant )可以使用MWS的服务。
            </Paragraph>
            <Paragraph>
              <span className={styles.siteName}>德国</span>：
              <a href="https://sellercentral.amazon.de/gp/mws/registration/register.html" target="_blank" rel="noopener noreferrer">
                https://sellercentral.amazon.de/gp/mws/registration/register.html
              </a>
              <br />
              <span className={styles.siteName}>法国</span>：
              <a href="https://sellercentral.amazon.fr/gp/mws/registration/register.html" target="_blank" rel="noopener noreferrer">
                https://sellercentral.amazon.fr/gp/mws/registration/register.html
              </a>
              <br />
              <span className={styles.siteName}>英国</span>：
              <a href="https://sellercentral.amazon.co.uk/gp/mws/registration/register.html" target="_blank" rel="noopener noreferrer">
                https://sellercentral.amazon.co.uk/gp/mws/registration/register.html
              </a>
              <br />
              <span className={styles.siteName}>西班牙</span>：
              <a href="https://sellercentral.amazon.es/gp/mws/registration/register.html" target="_blank" rel="noopener noreferrer">
                https://sellercentral.amazon.es/gp/mws/registration/register.html
              </a>
              <br />
              <span className={styles.siteName}>意大利</span>：
              <a href="https://sellercentral.amazon.it/gp/mws/registration/register.html" target="_blank" rel="noopener noreferrer">
                https://sellercentral.amazon.it/gp/mws/registration/register.html
              </a>
            </Paragraph>
            <img src={step2} alt="示例图" />
          </div>
        </div>
      ),
      asiaPacific: (
        <div>
          <div className={styles.stepTitle}>
            <i></i>登录卖家平台
          </div>
          <div className={styles.stepContent}>
            <Paragraph>
              1. 请在常用电脑上登录卖家平台，右上角<Text type="danger">Settings</Text>，点击<Text type="danger">User Permissions</Text>；
              <br />
              2. 进入页面找到<Text type="danger">Third party developer and apps</Text>，点击<Text type="danger">Visit Manage Your Apps</Text>； 
              <br />
              3. 进入页面后，点击左上角<Text type="danger">Authorize new Developer</Text>按钮，开始MWS服务授权。
              <br />
              注意：只有专业卖家 ( Pro Merchant )可以使用MWS的服务。
            </Paragraph>
            <Paragraph>
              <span className={styles.siteName}>日本</span>：
              <a href="https://sellercentral.amazon.co.jp/gp/mws/registration/register.html" target="_blank" rel="noopener noreferrer">
                https://sellercentral.amazon.co.jp/gp/mws/registration/register.html
              </a>
            </Paragraph>
            <img src={step2} alt="示例图" />
          </div>
        </div>
      ),
    },
    {
      title: 'Step3',
      northAmerica: (
        <div>
          <div className={styles.stepTitle}>
            <i></i>填写开发者名称和编号，许可开发者接入
          </div>
          <div className={styles.stepContent}>
            <Paragraph>
              选择 I want to use an application to access my Amazon seller account with MWS.
              输入开发商名称和编号；点击 Next，接受许可协议，然后再点击Next。
            </Paragraph>
            <div>
              <div className={styles.title}>北美：</div>
              <Row gutter={[40, 40]}>
                <Col span="10">
                  开发者名称：Amzics
                  <Button size="small" className={styles.copyBtn} onClick={() => copyText('Amzics')}>复制</Button>
                </Col>
                <Col span="10">
                  开发者编号：8647-4588-2175
                  <Button size="small" className={styles.copyBtn} onClick={() => copyText('8647-4588-2175')}>复制</Button>
                </Col>
              </Row>
            </div>
            <img src={step3America} alt="示例图" />
          </div>
        </div>
      ),
      europe: (
        <div>
          <div className={styles.stepTitle}>
            <i></i>填写开发者名称和编号，许可开发者接入
          </div>
          <div className={styles.stepContent}>
            <Paragraph>
              选择 I want to use an application to access my Amazon seller account with MWS.
              输入开发商名称和编号；点击 Next，接受许可协议，然后再点击Next。
            </Paragraph>
            <div>
              <div className={styles.title}>欧洲：</div>
              <Row gutter={[40, 40]}>
                <Col span="10">
                  开发者名称：Amzics
                  <Button size="small" className={styles.copyBtn} onClick={() => copyText('Amzics')}>复制</Button>
                </Col>
                <Col span="10">
                  开发者编号：0691-2399-7238
                  <Button size="small" className={styles.copyBtn} onClick={() => copyText('0691-2399-7238')}>复制</Button>
                </Col>
              </Row>
            </div>
            <img src={step3Europe} alt="示例图" />
          </div>
        </div>
      ),
      asiaPacific: (
        <div>
          <div className={styles.stepTitle}>
            <i></i>填写开发者名称和编号，许可开发者接入
          </div>
          <div className={styles.stepContent}>
            <Paragraph>
              选择 I want to use an application to access my Amazon seller account with MWS.
              输入开发商名称和编号；点击 Next，接受许可协议，然后再点击Next。
            </Paragraph>
            <div>
              <div className={styles.title}>日本：</div>
              <Row gutter={[40, 40]}>
                <Col span="10">
                  开发者名称：Amzics
                  <Button size="small" className={styles.copyBtn} onClick={() => copyText('Amzics')}>复制</Button>
                </Col>
                <Col span="10">
                  开发者编号：3926-2991-4727
                  <Button size="small" className={styles.copyBtn} onClick={() => copyText('3926-2991-4727')}>复制</Button>
                </Col>
              </Row>
            </div>
            <img src={step3Europe} alt="示例图" />
          </div>
        </div>
      ),
    },
    {
      title: 'Step4',
      content: (
        <div>
          <div className={styles.stepTitle}>
            <i></i>复制 Seller ID 和 MWS Auth Token
          </div>
          <div className={styles.stepContent}>
            <img src={step4} alt="示例图" />
          </div>
        </div>
      ),
    },
    {
      title: 'Step5',
      content: (
        <div>
          <div className={styles.stepTitle}>
            <i></i>填写 Seller ID 和 MWS Auth Token
          </div>
          <div className={styles.stepContent}>
            <Paragraph>
              绑定后可在导航栏搜索和切换各站点的所有店铺
            </Paragraph>
            <img src={step5} alt="示例图" />
            <div className={styles.inputContainer}>
              <FormItem
                name="storeName"
                label="店铺名称"
                rules={[{ required: true, message: '请输入店铺名称' }]}
                labelCol={{ span: 5 }}
              >
                <Input maxLength={20} />
              </FormItem>
              <FormItem
                name="sellerId"
                label="Seller ID"
                rules={[{ required: true, message: '请输入Seller ID' }]}
                labelCol={{ span: 5 }}
              >
                <Input />
              </FormItem>
              <FormItem
                name="token"
                label="MWS Auth Token"
                rules={[{ required: true, message: '请输入MWS Auth Token' }]}
                labelCol={{ span: 5 }}
              >
                <Input />
              </FormItem>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/shop/list">店铺管理</Link>
        <Iconfont type="icon-zhankai-copy" className={styles.icon} />
        <span>绑定店铺</span>
      </div>
      <div className={styles.stepContainer}>
        <Form
          form={form}
          onFinish={handleFinish}
          className={styles.Form}
          labelAlign="left"
          initialValues={{
            northAmerica: ['US'],
          }}
        >
          <Steps current={currentStep}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className={styles.stepsContent}>
            {/* 隐藏的步骤 1 用于 Form 提交时获取站点值 */}
            <div className={styles.hide}>
              {steps[0].content}
            </div>
            {steps[currentStep].content || steps[currentStep][siteType]}
          </div>
          <div className={styles.stepsActionBtns}>
            {currentStep > 0 && (
              <Button className={styles.prevBtn} onClick={prev}>上一步</Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit" loading={submitLoading}>验证</Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" disabled={disabledNext} onClick={next}>下一步</Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ShopBind;
