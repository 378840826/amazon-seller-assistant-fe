import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { useDispatch, useSelector } from 'umi';
import { sprs, adSales, flux, b2b, refunds } from '../config';


// 组件
import {
  Checkbox,
  Form,
} from 'antd';

interface IProps {
  callback: (params: {}) => void;
}

const { Item } = Form;
const ParentCustomCol: React.FC<IProps> = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // asin SKU
  const asinOrSku = [
    { label: '子ASIN', value: sprs[0] },
    { label: 'SKU', value: sprs[1] },
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

  // 退货
  const refundList = [
    { label: '退货率', value: refunds[0] },
    { label: '退货量', value: refunds[1] },
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

  const parentCustomcol = useSelector(
    (state: AsinTable.IDvaState) => state.asinTable.parentCustomcol
  );

  // state
  //总体销售表现 全选按钮的样式
  const [indeterminate, settIndeterminate] = useState<boolean>(false);
  // 总体流量转化  全选按钮的样式
  const [fluxStyle, setFluxStyle] = useState<boolean>(false);
  // 退货 全选按钮的样式
  const [refundStyle, setRefundStyle] = useState<boolean>(false);
  // b2b销售 全选按钮的样式
  const [b2bStyle, setB2bStyle] = useState<boolean>(false);


  useEffect(() => {
    form.setFieldsValue({ ...parentCustomcol });

    // 全选和取消全选
    // 监听 “总体销售表现”是否需要全选
    if (parentCustomcol.salesItem) {
      const length = parentCustomcol.salesItem.length;
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
    if (parentCustomcol.fluxItem) {
      const length = parentCustomcol.fluxItem.length;
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
    if (parentCustomcol.b2bItem) {
      const length = parentCustomcol.b2bItem.length;
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
    if (parentCustomcol.refundItem) {
      const length = parentCustomcol.refundItem.length;
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
  }, [form, parentCustomcol]);

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

    dispatch({
      type: 'asinTable/changeParentCustomcol',
      payload: obj,
    });
  };

  return <Form form={form} onValuesChange={onValuesChange}>
    <div className={`${styles.parentCustom} clearfix`} onClick={e => {
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();
    }}>

      {/* 子ASIN SKU */}
      <div className={styles.leftLayout}>
        <div className={`${styles.common}`}>
          <Item name="asins">
            <Checkbox.Group
              options={asinOrSku}
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
      </div>

      <div className={styles.rightLayout}>
        {/* 总体流量转化 */}
        <div className={`${styles.common} ${styles.flux}`}>
          <Item name="fluxAll" valuePropName="checked">
            <Checkbox indeterminate={fluxStyle} className={styles.title}>总体流量转化</Checkbox>
          </Item>
          <Item name="fluxItem">
            <Checkbox.Group options={fluxList} />
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

        {/* B2B销售 */}
        <div className={`${styles.common} ${styles.b2b}`}>
          <Item name="b2bAll" valuePropName="checked">
            <Checkbox indeterminate={b2bStyle} className={styles.title}>B2B销售</Checkbox>
          </Item>
          <Item name="b2bItem">
            <Checkbox.Group options={b2bList}/>
          </Item>
        </div>
      </div>
    </div>
  </Form>;
};

export default ParentCustomCol;
