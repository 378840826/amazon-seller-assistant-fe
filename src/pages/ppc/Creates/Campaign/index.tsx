import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { 
  history, 
  ConnectProps, 
  useSelector,
  useDispatch,
} from 'umi';
import { ppcCampaginListRouter } from '@/utils/routes';
import { ICreateGampaignState } from '../models/campaign';
import moment from 'moment';


import { Iconfont } from '@/utils/utils';
import {
  Button,
  Steps,
  message,
  Popconfirm,
  Form,
} from 'antd';
import Group from './Group/';
import Pattern from './Pattern';
import Campaign from './Campaign';
import skip from '@/components/Skip';
import { ITimingInitValueType } from '../components/TimeSelectBox';

interface IPage extends ConnectProps {
  createCampagin: ICreateGampaignState;
}

let reqData: any = {}; // eslint-disable-line
const CampaignAdd = () => {
  const dispatch = useDispatch();
  // 自动广告组的按Targeting Group设置竞价数据
  const autoTargetGroupList = useSelector((state: IPage) => 
    state.createCampagin.autoTargetGroupList
  );
  const keywords = useSelector((state: IPage) => state.createCampagin.keywords);
  const selects = useSelector((state: IPage) => state.createCampagin.selectProduct);
  const classifys = useSelector((state: IPage) => state.createCampagin.classifys);
  const saveProducts = useSelector((state: IPage) => state.createCampagin.saveProducts);
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadingEffect = useSelector((state: any) => state.loading.effects);
  const loading = loadingEffect['createCampagin/createCampagin'];
  const { currency, timezone, marketplace } = currentShop;

  const [form] = Form.useForm();
  const [campaignForm] = Form.useForm(); // 广告活动的表单
  const [groupForm] = Form.useForm(); // 自动广告组的表单 -

  
  const [campaignType, setCampaignType] = useState<CreateCampaign.ICampaignType>('sponsoredProducts'); // 当前选中的广告活动类型
  const [stepIndex, setStepIndex] = useState<number>(0); // 当前步骤
  const [pattern, setPattern] = useState<CreateCampaign.IManagementMode>('standard'); // 营销模式
  const [putMathod, setPutMathod] = useState<CreateCampaign.putMathod>('auto'); // 广告活动投放方式(SP SD)
  const [autoGroupBidType, setAutoGroupBidType] = useState<string>('auto'); // 自动广告组的竞价方式

  // SD类型 投放方式设置
  useEffect(() => {
    campaignType === 'sd' && setPutMathod('classProduct');
  }, [campaignType]);

  // 表单字段变化
  const valuesChange = (values: any) => { // eslint-disable-line
    // 第二步
    if (values.managementMode) {
      setPattern(values.managementMode);
    }

    // 投放方式(SP)
    if (values.outer && values.outer.putMathod) {
      setPutMathod(values.outer.putMathod);
    }

    // 投放方式(SD)
    if (values.outer && values.outer.sdPutMathod) {
      setPutMathod(values.outer.sdPutMathod);
    }

    // 广告组设置 （第四步） 
    if (stepIndex === 3) {
      const groupData = groupForm.getFieldsValue(); // 自动广告组的数组

      if (groupData.other && groupData.other.bidType) {
        setAutoGroupBidType(groupData.other.bidType);
      }
    }
  };

  // 获取广告组定时选中数据
  const getTimingData = (values: ITimingInitValueType) => {
    reqData.activeTime = values;
  };


  // 下一步或者保存
  // 发送给后端的数据
  reqData.headersParams = {
    StoreId: currentShop.id,
  };
  reqData.targetingType = campaignType === 'sponsoredProducts' ? putMathod : null; // 手动或自动
  reqData.timezone = timezone; //
  reqData.marketingScenario = null; // 营销场景,目前都为null
  const nextStep = () => {
    const data = form.getFieldsValue();
    const campaignData = campaignForm.getFieldsValue();
    const groupData = groupForm.getFieldsValue();
    reqData.managementMode = pattern;

    // 选择广告活动的类型（第一步）
    if (stepIndex === 0) {
      // 选中展示广告时，将模式改回标准模式
      if (campaignType === 'sd' && data.managementMode === 'ai' ) {
        setPattern('standard');
        form.setFieldsValue({
          managementMode: 'standard',
        });
      }
      reqData = {};
      reqData.campaignType = campaignType;
    }

    if (stepIndex === 1) {
      reqData.managementMode = pattern;
    }

    // 广告活动的下一步（第三步）
    if (stepIndex === 2) {
      // sd 广告活动的建议分类和商品需要 tactic 参数
      if (campaignType === 'sd') {
        reqData.tactic = campaignData.outer.sdPutMathod;
      }

      const name = campaignData.name;
      const dailyBudget = campaignData.dailyBudget;

      const startDate = campaignData.startDate.format('YYYY-MM-DD');
      let endDate = campaignData.endDate;
      const min = marketplace === 'JP' ? 200 : 1; // 日本站最小值200
      endDate = endDate ? endDate.format('YYYY-MM-DD') : undefined;

      if (!name || name.length < 0 || name > 128) {
        campaignForm.submit();
        return;
      }

      if (!dailyBudget || Number(dailyBudget) < min || Number(dailyBudget) > 1000000) {
        campaignForm.submit();
        return;
      }
      reqData.name = name;
      reqData.dailyBudget = campaignType === 'sponsoredProducts' ? dailyBudget : null;
      reqData.budget = campaignType === 'sd' ? dailyBudget : null;
      reqData.startDate = startDate;
      reqData.endDate = endDate;
      reqData.biddingStrategy = campaignData.biddingStrategy;
      reqData.biddingPlacementTop = campaignData.biddingPlacementTop;
      reqData.biddingPlacementProductPage = campaignData.biddingPlacementProductPage;
    }

    // 广告组的保存（第四步）
    if (stepIndex === 3) {
      const min = marketplace === 'JP' ? 2 : 0.02; // 日本站最小值200
      reqData.adGroup = Object.assign({}, reqData.adGroup, groupData);
      reqData.adGroup.productAds = selects;
      reqData.adGroup.campaignId = null;
      reqData.switch = groupData.switch;
      reqData.adGroup.startDate = groupData ? moment(groupData).format('YYYY-MM-DD') : '';
      groupData.endDate ? reqData.adGroup.endDate = moment(groupData.endDate).format('YYYY-MM-DD') : '';

      if (['', undefined, null].includes(reqData.adGroup.name)) {
        message.error('广告组名称不能为空！');
        return;
      }
      
      if (reqData.adGroup.name.length < 1 || reqData.adGroup.name.length > 255) {
        message.error('广告组名称长度不能小于1或者大于255位');
        return;
      }

      if (Array.isArray(reqData.adGroup.productAds) && reqData.adGroup.productAds.length === 0) {
        message.error('商品广告不能为空！');
        return;
      }
      
      // 自动广告组
      if (putMathod === 'auto') {
        reqData.adGroup.defaultBid = groupData.auto.defaultBid;
        const stringJSON = JSON.stringify(autoTargetGroupList);
        const list: any[] = JSON.parse(stringJSON);// eslint-disable-line
        list.forEach(item => {
          item.state = item.state ? 'enabled' : 'paused';
        });

        reqData.adGroup.autoTargetGroup = list;
      } else if (putMathod === 'manual' || putMathod === 'classProduct') {
        // 手动 | sd模式下的分类/商品
        const manualType = groupData.manualType;// 先查看当前选中的是哪一个分类下
        
        // 手动 关键词模式
        if ( manualType === 'keyword') { 
          if (keywords.length === 0) {
            message.error('请添加关键词！');
            return;
          }
          
          // 关键词
          reqData.adGroup.keywords = keywords;
        } else {
          // 手动 商品/分类
          // if (classifys.length === 0) {
          //   message.error('分类列表不能为空，请添加分类！');
          //   return;
          // }

          reqData.adGroup.targets = {
            categories: classifys,
            asins: saveProducts,
          };
        }
      }

      if (['', undefined, null].includes(reqData.adGroup.defaultBid)) {
        message.error('默认竞价不能为空！');
        return;
      }

      if (Number(reqData.adGroup.defaultBid) < min) {
        message.error(`默认竞价不能小于${min}`);
        return;
      }

      // 删除多余参数
      delete reqData.adGroup.auto;
      (putMathod !== 'manual' || groupData.manualType !== 'keyword') && delete reqData.adGroup.keywords;
      delete reqData.adGroup.manualType;
      delete reqData.adGroup.other;
      delete reqData.adGroup.bidType;
      delete reqData.adGroup.switch;
      delete reqData.adGroup.other;

      new Promise((resolve, reject) => {
        dispatch({
          type: 'createCampagin/createCampagin',
          resolve,
          reject,
          payload: {
            ...reqData,
            storeId: currentShop.id,
          },
        });
      }).then(datas => {
        const {
          code,
          message: msg,
        } = datas as {
          code: number;
          message: string;
        };

        if (code !== 200) {
          message.error(msg);
          return;
        }
        if ( msg === '创建成功') {
          skip({
            toPath: ppcCampaginListRouter,
            pageName: '广告活动列表',
          });
          return;
        } 
        message.success(msg);
      });
    }

    stepIndex < 3 ? setStepIndex(stepIndex + 1) : '';
  };

  return <div className={styles.campaignAddBox}>
    <div className={styles.campaignAdd}>
      <div className={styles.stepBox}>
        <Steps current={stepIndex}>
          <Steps.Step title="" />
          <Steps.Step title=""/>
          <Steps.Step title=""/>
          <Steps.Step title="" />
          <Steps.Step title=""/>
        </Steps>
        <span className={classnames(styles.common, styles.stepOne)}>选择广告类型</span>
        <span className={classnames(styles.common, styles.stepTwo, stepIndex <= 0 ? styles.notReach : '')}>管理模式设置</span>
        <span className={classnames(styles.common, styles.stepThree, stepIndex <= 1 ? styles.notReach : '')}>广告活动设置</span>
        <span className={classnames(styles.common, styles.stepFour, stepIndex <= 2 ? styles.notReach : '')}>广告组设置</span>
        <span className={classnames(styles.common, styles.stepFive, stepIndex <= 3 ? styles.notReach : '')}>创建完成</span>
      </div>

      {/* 选择广告活动类型 */}
      <div className={classnames(styles.campaignTypeBox, stepIndex === 0 ? '' : 'none')}>
        <div className={classnames(
          styles.typeItem,
          styles.productItem,
          campaignType === 'sponsoredProducts' ? styles.active : ''
        )} onClick={() => setCampaignType('sponsoredProducts')}>
          <Iconfont className={classnames(styles.imgIcon, styles.productIcon)} type="icon-xianxinggouwudaitubiao"/>
          <div>
            <p className={styles.title}>Sponsored Product</p>
            <p className={styles.subtitle}>（商品广告）</p>
          </div>
        </div>

        <div className={classnames(
          styles.typeItem, 
          styles.showItem,
          campaignType === 'sd' ? styles.active : ''
        )} onClick={() => setCampaignType('sd')}>
          <Iconfont className={classnames(styles.imgIcon, styles.showIcon)} type="icon-xianxingdianshangshujutubiao"/>
          <div>
            <p className={styles.title}>Sponsored Display</p>
            <p className={styles.subtitle}>（展示广告）</p>
          </div>
        </div>
        <div className={classnames(
          styles.typeItem, 
          styles.brandAd,
          campaignType === 'sb' ? styles.active : ''
        )} title="暂时无法创建品牌广告">
          <Iconfont className={styles.imgIcon} type="icon-xianxingbaoguotubiao"/>
          <div>
            <p className={styles.title}>Sponsored Brand</p>
            <p className={styles.subtitle}>（品牌广告）</p>
          </div>
        </div>
      </div>

      {/*广告活动的营销模式选择 */}
      <div className={classnames(
        styles.spsdsbBox,
        stepIndex === 1 ? '' : 'none',
      )}>
        <Form form={form} onValuesChange={valuesChange} name="campaignAdd">
          <Pattern campaignType={campaignType} pattern={pattern} />
        </Form>
      </div>

      {/* 广告活动设置 */}
      <div className={classnames(
        styles.campaignBox,
        stepIndex === 2 ? '' : 'none',
      )}>
        <Form form={campaignForm} 
          onValuesChange={valuesChange} 
          colon={false} 
          labelAlign="left" 
          name="campaignAdd1"
        >
          <Campaign 
            // startData={startData} 
            form={campaignForm}
            campaignType={campaignType}
            pattern={pattern} 
            currency={currency}
            timezone={timezone}
            marketplace={marketplace}
          />
        </Form>
      </div>

      {/* 广告组设置 */}
      <div className={classnames(
        styles.autogroupBox,
        stepIndex === 3 ? '' : 'none',
      )}>
        <Form form={groupForm} 
          onValuesChange={valuesChange} 
          colon={false} 
          labelAlign="left" 
          name="atuoGroupForm"
          initialValues={{
            switch: true,
            other: {
              bidType: 'auto',
            },
          }}
        >
          <Group 
            autoGroupBidType={autoGroupBidType} 
            putMathod={putMathod} 
            form={groupForm}
            getTimingData={getTimingData}
            campaignType={campaignType}
            stepIndex={stepIndex}/>
          
        </Form>
      </div>

      <footer className={styles.btns}>
        <Popconfirm 
          title="您确定要取消创建吗？" 
          onConfirm={() => history.push(ppcCampaginListRouter)}
          overlayClassName={styles.cancelTooltip}
        >
          <Button>取消</Button>
        </Popconfirm>
        <Button 
          onClick={() => setStepIndex(stepIndex - 1)}
          className={classnames(stepIndex === 0 ? 'none' : '')}
        >
          上一步
        </Button>
        <Button 
          type="primary" 
          onClick={nextStep}
          loading={loading}
        >
          {stepIndex === 3 ? '保存' : '下一步'}
        </Button>
      </footer>
    </div>
  </div>;
};

export default CampaignAdd;
