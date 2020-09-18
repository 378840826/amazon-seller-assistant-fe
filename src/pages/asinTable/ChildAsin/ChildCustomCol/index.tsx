import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { sprs, adSales, flux, b2b, refunds, adsSales, adsFluxs, adsPuts } from '../config';
import { useDispatch, useSelector } from 'umi';

// 组件
import {
  Checkbox,
  Form,
} from 'antd';


const { Item } = Form;
const ParentCustomCol: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const childCustomcol = useSelector(
    (state: AsinTable.IDvaState) => state.asinTable.childCustomcol
  );

  const skus = [
    { label: 'SKU', value: sprs[0] },
    { label: '父ASIN', value: sprs[1] },
    { label: 'Review', value: sprs[2] },
    { label: '评分', value: sprs[3] },
  ];

  // 总体销售表现
  const salesList = [
    { label: '总销售额', value: adSales[0] },
    { label: '总订单量', value: adSales[1] },
    { label: '总销量', value: adSales[2] },
    { label: '回评率', value: adSales[3] },
    { label: '利润', value: adSales[4] },
    { label: '利润率', value: adSales[5] },
    { label: '销量/订单量', value: adSales[6] },
    { label: '平均客单价', value: adSales[7] },
    { label: '平均售价', value: adSales[8] },
    { label: '优惠订单', value: adSales[9] },
    { label: '关联销售', value: adSales[10] },
  ];

  // 总体流量转化
  const fluxList = [
    { label: 'PageView', value: flux[0] },
    { label: 'Session', value: flux[1] },
    { label: 'PageView/Session', value: flux[2] },
    { label: '转化率', value: flux[3] },
  ];

  // B2B销售
  const b2bList = [
    { label: 'B2B销售额', value: b2b[0] },
    { label: 'B2B订单量', value: b2b[1] },
    { label: 'B2B销量', value: b2b[2] },
    { label: 'B2B销量/订单量', value: b2b[3] },
    { label: 'B2B平均售价', value: b2b[4] },
    { label: 'B2B平均客单价', value: b2b[5] },
  ];

  // 退货
  const refundList = [
    { label: '退货率', value: refunds[0] },
    { label: '退货量', value: refunds[1] },
  ];

  // 广告销售表现
  const adsSalesList = [
    { label: '广告组类型', value: adsSales[0] },
    { label: '广告销售额', value: adsSales[1] },
    { label: '本SKU广告销售额', value: adsSales[2] },
    { label: '自然销售额', value: adsSales[3] },
    { label: '广告订单量', value: adsSales[4] },
    { label: '本SKU广告订单量', value: adsSales[5] },
    { label: '自然订单量', value: adsSales[6] },
  ];

  // 广告流量转化
  const adsFluxList = [
    { label: 'Impressions', value: adsFluxs[0] },
    { label: 'Clicks', value: adsFluxs[1] },
    { label: 'CTR', value: adsFluxs[2] },
    { label: '广告转化率', value: adsFluxs[3] },
  ];

  // 广告投入回报
  const adsPutList = [
    { label: 'CPC', value: adsPuts[0] },
    { label: 'Spend', value: adsPuts[1] },
    { label: 'ACoS', value: adsPuts[2] },
    { label: '综合ACoS', value: adsPuts[3] },
    { label: 'RoAS', value: adsPuts[4] },
    { label: '综合RoAS', value: adsPuts[5] },
  ];
  
  // state
  
  const [indeterminate, settIndeterminate] = useState<boolean>(false);// 总体销售表现 全选按钮
  const [fluxStyle, setFluxStyle] = useState<boolean>(false); // 总体流量转化 全选按钮
  const [b2bStyle, setB2bStyle] = useState<boolean>(false); // b2b销售 全选按钮
  const [refundStyle, setRefundStyle] = useState<boolean>(false); // 退货 全选按钮
  const [adsSalesStyle, setAdsSalesStyle] = useState<boolean>(false); // 广告销售表现 全选按钮
  const [adsFluxStyle, setAdsFluxStyle] = useState<boolean>(false); // 广告流量转化 全选按钮
  const [adsPutStyle, setAdsPutStyle] = useState<boolean>(false); // 广告投入回报 全选按钮

  useEffect(() => {
    form.setFieldsValue({ ...childCustomcol });

    // 全选和取消全选
    // 监听 “总体销售表现”是否需要全选
    if (childCustomcol.salesItem) {
      const length = childCustomcol.salesItem.length;
      if (length === adSales.length) {
        settIndeterminate(false);
        form.setFieldsValue({
          salesAll: true,
        });
      } else {
        form.setFieldsValue({
          salesAll: false,
        });
        if (length > 0) {
          settIndeterminate(true);
        } else {
          settIndeterminate(false);
        }
      }
    }

    // 监听 “总体流量转化”是否需要全选
    if (childCustomcol.fluxItem) {
      const length = childCustomcol.fluxItem.length;
      if (length === flux.length) {
        setFluxStyle(false);
        form.setFieldsValue({
          fluxAll: true,
        });
      } else {
        form.setFieldsValue({
          fluxAll: false,
        });
        if (length > 0) {
          setFluxStyle(true);
        } else {
          setFluxStyle(false);
        }
      }
    }

    // 监听 “B2B销售”是否需要全选
    if (childCustomcol.b2bItem) {
      const length = childCustomcol.b2bItem.length;
      console.log(childCustomcol.b2bItem, childCustomcol.b2bItem.length);
      if (length === b2b.length) {
        setB2bStyle(false);
        form.setFieldsValue({
          b2bAll: true,
        });
      } else {
        form.setFieldsValue({
          b2bAll: false,
        });
        if (length > 0) {
          setB2bStyle(true);
        } else {
          setB2bStyle(false);
        }
      }
    }

    // 监听 “退货”是否需要全选
    if (childCustomcol.refundItem) {
      const length = childCustomcol.refundItem.length;
      if (length === refunds.length) {
        setRefundStyle(false);
        form.setFieldsValue({
          refundAll: true,
        });
      } else {
        form.setFieldsValue({
          refundAll: false,
        });
        if (length > 0) {
          setRefundStyle(true);
        } else {
          setRefundStyle(false);
        }
      }
    }

    // 监听 “广告销售表现”是否需要全选
    if (childCustomcol.adsSalesItem) {
      const length = childCustomcol.adsSalesItem.length;
      if (length === adsSales.length) {
        setAdsSalesStyle(false);
        form.setFieldsValue({
          adsSalesAll: true,
        });
      } else {
        form.setFieldsValue({
          adsSalesAll: false,
        });
        if (length > 0) {
          setAdsSalesStyle(true);
        } else {
          setAdsSalesStyle(false);
        }
      }
    }

    // 监听 “广告流量转化”是否需要全选
    if (childCustomcol.adsFluxsItem) {
      const length = childCustomcol.adsFluxsItem.length;
      if (length === adsFluxs.length) {
        setAdsFluxStyle(false);
        form.setFieldsValue({
          adsFluxAll: true,
        });
      } else {
        form.setFieldsValue({
          adsFluxAll: false,
        });
        if (length > 0) {
          setAdsFluxStyle(true);
        } else {
          setAdsFluxStyle(false);
        }
      }
    }

    // 监听 “广告投入回报”是否需要全选
    if (childCustomcol.adsPutItem) {
      const length = childCustomcol.adsPutItem.length;
      if (length === adsPuts.length) {
        setAdsPutStyle(false);
        form.setFieldsValue({
          adsPutAll: true,
        });
      } else {
        form.setFieldsValue({
          adsPutAll: false,
        });
        if (length > 0) {
          setAdsPutStyle(true);
        } else {
          setAdsPutStyle(false);
        }
      }
    }
  }, [form, childCustomcol]);
  
  const onValuesChange = (changedValues: any, allValues: any) => { // eslint-disable-line
    console.log(changedValues, allValues);
    const obj = {
      asins: allValues.asins || [],
      salesItem: allValues.salesItem || [],
      fluxItem: allValues.fluxItem || [],
      b2bItem: allValues.b2bItem || [],
      refundItem: allValues.refundItem || [],
      adsSalesItem: allValues.adsSalesItem || [],
      adsFluxsItem: allValues.adsFluxsItem || [],
      adsPutItem: allValues.adsPutItem || [],
    }; 

    // 全选和取消全选
    if (changedValues.salesAll) {
      obj.salesItem = adSales;
    } else if (changedValues.salesAll === false) {
      obj.salesItem = [];
    }

    // 全选和取消全选
    if (changedValues.fluxAll) {
      obj.fluxItem = flux;
    } else if (changedValues.fluxAll === false) {
      obj.fluxItem = [];
    }

    // 全选和取消全选
    if (changedValues.b2bAll) {
      obj.b2bItem = b2b;
    } else if (changedValues.b2bAll === false) {
      obj.b2bItem = [];
    }

    // 全选和取消全选
    if (changedValues.refundAll) {
      obj.refundItem = refunds;
    } else if (changedValues.refundAll === false) {
      obj.refundItem = [];
    }

    // 全选和取消全选
    if (changedValues.adsSalesAll) {
      obj.adsSalesItem = adsSales;
    } else if (changedValues.adsSalesAll === false) {
      obj.adsSalesItem = [];
    }

    // 全选和取消全选
    if (changedValues.adsFluxAll) {
      obj.adsFluxsItem = adsFluxs;
    } else if (changedValues.adsFluxAll === false) {
      obj.adsFluxsItem = [];
    }

    // 全选和取消全选
    if (changedValues.adsPutAll) {
      obj.adsPutItem = adsPuts;
    } else if (changedValues.adsPutAll === false) {
      obj.adsPutItem = [];
    }
    dispatch({
      type: 'asinTable/changeChildCustomcol',
      payload: obj,
    });
  };


  return <div className={`${styles.childCustom} clearfix`} onClick={e => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
  }}>
    <Form form={form} onValuesChange={onValuesChange}>
      <div className={styles.leftLayout}>
        <div className={`${styles.common}`}>
          <Item name="asins">
            <Checkbox.Group
              options={skus}
            />
          </Item>
        </div>

        {/* 总体销售表现 */}
        <div className={`${styles.common} ${styles.sales}`}>
          <Item name="salesAll" valuePropName="checked">
            <Checkbox className={styles.title} indeterminate={indeterminate}>总体销售表现</Checkbox>
          </Item>
          <Item name="salesItem">
            <Checkbox.Group options={salesList}/> 
          </Item>
        </div>

        {/* 总体流量转化 */}
        <div className={`${styles.common} ${styles.flux}`}>
          <Item name="fluxAll" valuePropName="checked">
            <Checkbox indeterminate={fluxStyle} className={styles.title}>总体流量转化</Checkbox>
          </Item>
          <Item name="fluxItem">
            <Checkbox.Group options={fluxList} />
          </Item>
        </div>
      </div>

      <div className={styles.centerLayout}>
        {/* B2B销售 */}
        <div className={`${styles.common} ${styles.b2b}`}>
          <Item name="b2bAll" valuePropName="checked">
            <Checkbox indeterminate={b2bStyle} className={styles.title}>B2B销售</Checkbox>
          </Item>
          <Item name="b2bItem">
            <Checkbox.Group options={b2bList}/>
          </Item>
        </div>

        {/* 退货 */}
        <div className={`${styles.common} ${styles.refund}`}>
          <Item name="refundAll" valuePropName="checked">
            <Checkbox
              indeterminate={refundStyle}
              className={styles.title}
            >
              退货
            </Checkbox>
          </Item>
          <Item name="refundItem">
            <Checkbox.Group options={refundList} />
          </Item>
        </div>

        {/* 广告销售表现 */}
        <div className={`${styles.common} ${styles.adsSales}`}>
          <Item name="adsSalesAll" valuePropName="checked">
            <Checkbox
              indeterminate={adsSalesStyle}
              className={styles.title}
            >
              广告销售表现
            </Checkbox>
          </Item>
          <Item name="adsSalesItem">
            <Checkbox.Group options={adsSalesList}/>
          </Item>
        </div>
      </div> 
      
      <div className={styles.rightLayout}>
        {/* 广告流量转化 */}
        <div className={`${styles.common} ${styles.adsFlux}`}>
          <Item name="adsFluxAll" valuePropName="checked">
            <Checkbox 
              indeterminate={adsFluxStyle}
              className={styles.title}
            >
              广告流量转化
            </Checkbox>
          </Item>
          <Item name="adsFluxsItem">
            <Checkbox.Group
              options={adsFluxList}
            />
          </Item>
        </div>

        {/* 广告投入回报 */}
        <div className={`${styles.common} ${styles.adsPut}`}>
          <Item name="adsPutAll" valuePropName="checked">
            <Checkbox
              indeterminate={adsPutStyle}
              className={styles.title}
            >
              广告投入回报
            </Checkbox>
          </Item>
          <Item name="adsPutItem">
            <Checkbox.Group options={adsPutList} />
          </Item>
        </div>
      </div>
    </Form>
  </div>;
};

export default ParentCustomCol;
