import React, { useState, useEffect } from 'react';
import { Store } from 'redux';
import { IConnectState } from '@/models/connect';
import { Radio, Input, Button, Form, Checkbox, Spin } from 'antd';
import { useSelector, useDispatch } from 'umi';
import { strToNaturalNumStr, requestFeedback } from '@/utils/utils';
import styles from './index.less';

const { Item: FormItem } = Form;

const validateMessages = {
  required: '${label} 是必填项!',
};

const Setting: React.FC = () => {
  const dispatch = useDispatch();
  const page = useSelector((state: IConnectState) => state.replenishment);
  const currentShopId = useSelector((state: IConnectState) => state.global.shop.current.id);
  const loadingEffects = useSelector((state: IConnectState) => state.loading.effects);
  const saveLoading = loadingEffects['replenishment/setRule'];
  const getSkuLoading = loadingEffects['replenishment/fetchSkuSetting'];
  const { labels: allLabels, setting } = page;

  // 显示状态和内容
  const { record } = setting;
  // 日销量固定还是公式
  const [salesType, setSalesType] = useState<number>(record.avgDailySalesRules);
  // 百分比是否等于 100
  const [percentError, setPercentError] = useState<boolean>(false);
  // 增加 labelIds 用于 labels 设置传参
  if (record.labels) {
    record.labelIds = record.labels.map((label) => {
      return label.id;
    });
  }
  // record 更新时更新 salesType, (暂时先这样)
  useEffect(() => {
    setSalesType(record.avgDailySalesRules);
  }, [record]);

  // 物流方式
  const shippingMethodsAllOption = [
    { label: '空运', value: 'byAir' },
    { label: '海运', value: 'seaTransport' },
    { label: '空派', value: 'airPie' },
    { label: '海派', value: 'seaPie' },
  ];

  // 停发状态
  const skuStatusOption = [
    { label: '否', value: 'normal' },
    { label: '是', value: 'stop' },
  ];

  // 标签
  const labelsOption = allLabels.map((label) => {
    const { id, labelName } = label;
    return { value: id, label: labelName };
  });

  // 关闭弹窗
  const handleClose = () => {
    dispatch({
      type: 'replenishment/switchSettingVisible',
      payload: {
        visible: false,
        record: {},
        checked: {
          dataRange: 1,
          currentPageSkus: [],
        },
      },
    });
  };

  // 保存设置
  const handleFinish = ( values: { [key: string]: Store }) => {
    // 动态日销量相加必须等于 100
    const { 
      weightCount7sales,
      weightCount15sales,
      weightCount30sales,
      weightCount60sales,
      weightCount90sales,
    } = values;
    const sales7 = Number(weightCount7sales);
    const sales15 = Number(weightCount15sales);
    const sales30 = Number(weightCount30sales);
    const sales60 = Number(weightCount60sales);
    const sales90 = Number(weightCount90sales);
    if (
      salesType === 2 &&
      sales7 + 
      sales15 +
      sales30 +
      sales60 +
      sales90 !== 100
    ) {
      setPercentError(true);
      return;
    }    
    dispatch({
      type: 'replenishment/setRule',
      payload: {
        ...values,
        // number
        weightCount7sales: sales7,
        weightCount15sales: sales15,
        weightCount30sales: sales30,
        weightCount60sales: sales60,
        weightCount90sales: sales90,
        headersParams: { StoreId: currentShopId },
      },
      callback: (code: number, message: string) => {
        requestFeedback(code, message);
        handleClose();
        setPercentError(false);
      },
    });
  };

  // 生成填写百分比的 input
  const getPercentFormItem = (name: string) => (
    <FormItem
      name={name}
      getValueFromEvent={e => strToNaturalNumStr(e.target.value)}
    >
      <Input suffix={<span className={styles.secondary}>%</span>} maxLength={3} />
    </FormItem>
  );

  // 生成填写备货周期的 input 自然数
  const geNaturalNumFormItem = (name: string, label: string) => (
    <FormItem
      name={name}
      label={label}
      getValueFromEvent={e => strToNaturalNumStr(e.target.value)}
      rules={[{ required: true }]}
    >
      <Input suffix="天" maxLength={4} />
    </FormItem> 
  );
  
  return (
    <div className={styles.Setting}>
      {
        getSkuLoading 
          ?
          <div className={styles.loading}>
            <Spin /> 
          </div>
          :
          <Form
            onFinish={handleFinish}
            validateMessages={validateMessages}
            initialValues={record}
          >
            <div className={styles.settingItem}>
              <span className={styles.title}>备货周期：</span>
              <div className={styles.content}>
                { geNaturalNumFormItem('shoppingList', '采购计划') }
                { geNaturalNumFormItem('purchaseLeadTime', '采购交期') }
                { geNaturalNumFormItem('qualityInspection', '质检') }
                { geNaturalNumFormItem('firstPass', '头程') }
                { geNaturalNumFormItem('safeDays', '安全期') }
              </div>
            </div>
            <div className={styles.settingItem}>
              <span className={styles.title}>物流方式：</span>
              <div className={styles.content}>
                <FormItem name="shippingMethods">
                  <Checkbox.Group options={shippingMethodsAllOption} />
                </FormItem>
              </div>
            </div>
            <div className={styles.settingItem}>
              <span className={styles.title}>标签：</span>
              <div className={styles.content}>
                {
                  allLabels.length
                    ?
                    <FormItem name="labelIds">
                      <Checkbox.Group options={labelsOption} />
                    </FormItem>
                    : 
                    <FormItem name="labelIds">
                      无
                    </FormItem>
                }
              </div>
            </div>
            <div className={styles.settingItem}>
              <span className={styles.title}>停发：</span>
              <div className={styles.content}>
                <FormItem name="skuStatus">
                  <Radio.Group options={skuStatusOption} />
                </FormItem>
              </div>
            </div>
            <div>
              <span className={styles.title}>日销量：</span>
              <div className={styles.content}>
                <FormItem name="avgDailySalesRules">
                  <Radio.Group onChange={e => setSalesType(e.target.value)} value={salesType}>
                    <Radio value={1}>固定日销量</Radio>
                    <Radio value={2}>动态日销量</Radio>
                  </Radio.Group>
                </FormItem>
                <div className={styles.salesContainer}>
                  {
                    salesType === 1
                      ?
                      <div className={styles.salesFixedContainer}>
                        <FormItem
                          name="fixedSales"
                          getValueFromEvent={e => strToNaturalNumStr(e.target.value)}
                        >
                          <Input maxLength={10} />
                        </FormItem>
                      </div>
                      :
                      <div className={styles.salesComputeContainer}>
                        7天日均 X { getPercentFormItem('weightCount7sales') } +
                        15天日均 X { getPercentFormItem('weightCount15sales') } +
                        30天日均 X { getPercentFormItem('weightCount30sales') } +
                        60天日均 X { getPercentFormItem('weightCount60sales') } +
                        90天日均 X { getPercentFormItem('weightCount90sales') }
                        {
                          percentError
                            ? <div className={styles.errorText}>各个百分比的和要等于100%</div>
                            : null
                        }
                      </div>
                  }
                </div>
              </div>
            </div>
            <div className={styles.settingItem}>
              <span className={styles.title}></span>
              <div className={styles.content}>
                <div className={styles.btnContainer}>
                  <Button onClick={handleClose}>取消</Button>
                  <Button type="primary" htmlType="submit" loading={saveLoading}>保存</Button>
                </div>
              </div>
            </div>
          </Form>
      }
    </div>
  );
};

export default Setting;
