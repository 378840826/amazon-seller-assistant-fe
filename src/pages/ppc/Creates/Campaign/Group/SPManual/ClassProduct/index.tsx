/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-15 10:27:06
 * 
 * 分类/商品入口 
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import {
  Tabs,
  Form,
  Input,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import ClassifyComponent from './Classify';
import ProductComponent from './Product';

interface IProps {
  campaignType: CreateCampaign.ICampaignType; // 广告活动类型 sp sb 
  form: FormInstance;
  currency: API.Site;
  marketplace: string;
  storeId: string|number;
  putMathod: CreateCampaign.putMathod;
  /** 广告活动日预算 */
  campaignDailyBudget: string;
}

const { TabPane } = Tabs;
const ClassProduct: React.FC<IProps> = props => {
  const {
    form,
    currency,
    marketplace,
    storeId,
    putMathod,
    campaignType,
    campaignDailyBudget,
  } = props;
  
  const [twoNav, setTwoNav] = useState<'classify' |'product'>('classify'); // 


  useEffect(() => {
    form.setFieldsValue({
      other: {
        classProductType: twoNav,
      },
    });
  }, [form, twoNav]);

  return <div className={styles.box}>
    {/* 用来判断当前选中模块 */}
    <Form.Item name={['other', 'classProductType']} hidden>
      <Input />
    </Form.Item>
    <header className={styles.head}>
      <Tabs 
        activeKey={twoNav} 
        onChange={val => setTwoNav(val as 'classify' |'product')} 
        tabBarGutter={35}
      >
        <TabPane tab="分类" key="classify">
        </TabPane>
        <TabPane tab="商品" key="product">
        </TabPane>
      </Tabs>
    </header>
    
    {twoNav === 'classify' ? <ClassifyComponent
      campaignType={campaignType}
      currency={currency}
      form={form}
      marketplace={marketplace}
      storeId={storeId}
      putMathod={putMathod}
      campaignDailyBudget={campaignDailyBudget}
    /> : <ProductComponent
      campaignType={campaignType}
      currency={currency}
      form={form}
      marketplace={marketplace}
      storeId={storeId}
      putMathod={putMathod}
      campaignDailyBudget={campaignDailyBudget}
    /> }
  </div>;
};

export default ClassProduct;
