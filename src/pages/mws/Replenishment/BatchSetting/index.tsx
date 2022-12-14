/**
 * 批量设置的弹窗，区别于单个sku设置，可单独保存某一项数据
 */

import React, { useState, useEffect } from 'react';
import { Store } from 'redux';
import { IConnectState } from '@/models/connect';
import { settingType } from '@/models/replenishment';
import { Radio, Input, Button, Form, Checkbox, Spin } from 'antd';
import { useSelector, useDispatch } from 'umi';
import { strToNaturalNumStr, requestFeedback } from '@/utils/utils';
import styles from './index.less';

const { Item: FormItem } = Form;

const validateMessages = {
  required: '${label} 是必填项!',
};

const BatchSetting: React.FC = () => {
  const dispatch = useDispatch();
  const page = useSelector((state: IConnectState) => state.replenishment);
  const currentShopId = useSelector((state: IConnectState) => state.global.shop.current.id);
  const loadingEffects = useSelector((state: IConnectState) => state.loading.effects);
  const getSkuLoading = loadingEffects['replenishment/fetchSettingRecord'];
  const saveLoading = loadingEffects['replenishment/batchSet'] || loadingEffects['replenishment/batchSetSingle'];
  const { labels: allLabels, setting } = page;
  const [form] = Form.useForm();
  // 显示状态和内容
  const { record } = setting;
  
  // 日销量固定还是公式
  const [salesType, setSalesType] = useState<number>(record.avgDailySalesRules);
  // 百分比是否等于 100
  const [percentError, setPercentError] = useState<boolean>(false);
  // form 初始值增加 labelIds 用于 labels 设置传参
  const initialValues = Object.assign({}, record, {
    labelIds: record.labels?.map((label) => {
      return label.id;
    }),
  });

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
      type: 'replenishment/switchBatchSettingVisible',
      payload: { visible: false },
    });
  };

  // 保存单个设置
  const handleSaveSingle = (type: settingType) => {
    let values;
    const periodFields = [
      'shoppingList',
      'purchaseLeadTime',
      'qualityInspection',
      'firstPass',
      'safeDays',
    ];
    switch (type) {
    // 备货周期
    case 'period':
      // 有字段填写错误不给提交
      if (
        form.getFieldsError(periodFields).some(item => item.errors.length)
      ) {
        return;
      }
      values = form.getFieldsValue(periodFields);
      break;
    // 物流方式
    case 'shipping':
      values = form.getFieldsValue(['shippingMethods']);
      break;
    // 标签
    case 'label':
      values = form.getFieldsValue(['labelIds']);
      break;
    // sku停发状态
    case 'status':
      values = form.getFieldsValue(['skuStatus']);
      break;
    // 日销量规则
    case 'rule':
      values = form.getFieldsValue([
        'avgDailySalesRules',
        'fixedSales',
        'weightCount7sales',
        'weightCount15sales',
        'weightCount30sales',
        'weightCount60sales',
        'weightCount90sales',
      ]);
      // 动态日销量相加必须等于 100
      if (
        salesType === 2 &&
        Number(values.weightCount7sales) +
        Number(values.weightCount15sales) +
        Number(values.weightCount30sales) +
        Number(values.weightCount60sales) +
        Number(values.weightCount90sales) !== 100
      ) {
        setPercentError(true);
        return;
      } else if (salesType === 1) {
        // 固定日销量不能为空
        const fixedSales = form.getFieldValue('fixedSales');
        if (['', undefined, null].includes(fixedSales)) {
          return;
        }
      }
      break;
    default:
      return;
    }
    dispatch({
      type: 'replenishment/batchSetSingle',
      payload: {
        settingType: type,
        ...values,
        headersParams: { StoreId: currentShopId },
      },
      callback: (code: number, message: string) => {
        requestFeedback(code, message);
        handleClose();
        setPercentError(false);
      },
    });
  };

  // 保存全部设置
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
      type: 'replenishment/batchSet',
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
    <div className={styles.numFormItemContainer}>
      <FormItem
        name={name}
        label={label}
        getValueFromEvent={e => strToNaturalNumStr(e.target.value)}
        rules={[{ required: true }]}
      >
        <Input maxLength={4} />
      </FormItem>
      天
    </div>
  );
  
  // 生成单个保存按钮
  const getSaveBtn = (settingType: settingType) => (
    <Button
      ghost
      type="primary"
      className={styles.saveBtn}
      onClick={() => handleSaveSingle(settingType)}
      loading={saveLoading}
    >保存</Button>
  );

  return (
    <div className={styles.Setting}>
      <Spin spinning={getSkuLoading === undefined ? false : getSkuLoading}>
        <Form
          form={form}
          onFinish={handleFinish}
          validateMessages={validateMessages}
          initialValues={initialValues}
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
            { getSaveBtn('period') }
          </div>
          <div className={styles.settingItem}>
            <span className={styles.title}>物流方式：</span>
            <div className={styles.content}>
              <FormItem name="shippingMethods">
                <Checkbox.Group options={shippingMethodsAllOption} />
              </FormItem>
            </div>
            { getSaveBtn('shipping') }
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
            { getSaveBtn('label') }
          </div>
          <div className={styles.settingItem}>
            <span className={styles.title}>停发：</span>
            <div className={styles.content}>
              <FormItem name="skuStatus">
                <Radio.Group options={skuStatusOption} />
              </FormItem>
            </div>
            { getSaveBtn('status') }
          </div>
          <div className={styles.settingItemSales}>
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
                        rules={[{
                          required: form.getFieldValue('avgDailySalesRules') === 1,
                          message: '请填写日销量',
                        }]}
                      >
                        <Input maxLength={10} />
                      </FormItem>
                    </div>
                    :
                    <div className={styles.salesComputeContainer}>
                      7天日均 X {getPercentFormItem('weightCount7sales')} +
                      15天日均 X {getPercentFormItem('weightCount15sales')} +
                      30天日均 X {getPercentFormItem('weightCount30sales')} +
                      60天日均 X {getPercentFormItem('weightCount60sales')} +
                      90天日均 X {getPercentFormItem('weightCount90sales')}
                      {
                        percentError
                          ? <div className={styles.errorText}>各个百分比的和要等于100%</div>
                          : null
                      }
                    </div>
                }
              </div>
            </div>
            { getSaveBtn('rule') }
          </div>
          <div className={styles.btnContainer}>
            <Button onClick={handleClose}>取消</Button>
            <Button type="primary" htmlType="submit" loading={saveLoading}>保存全部</Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default BatchSetting;
