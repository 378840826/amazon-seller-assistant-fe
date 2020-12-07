import React, { useState } from 'react';
import styles from './index.less';
import EditBox from '../../components/EditBox';
import {
  Button,
  Form,
  Input,
} from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import {
  strToMoneyStr,
  strToNaturalNumStr,
  strToReviewScoreStr,
} from '@/utils/utils';

interface IProps {
  preferentialConfirmCallback: (val: string, data: {}) => Promise<boolean>;
  cancelFiltrate?: () => void; // 取消按钮
  confirmFiltrateCallback: (data: {}) => void; // 确定按钮
  form: FormInstance;
}

const ParentAsinFiltern: React.FC<IProps> = (props) => {
  const {
    preferentialConfirmCallback,
    cancelFiltrate,
    confirmFiltrateCallback,
    form,
  } = props;

  const [savepreferential, setSavepreferential] = useState<boolean>(false); // 是否显示偏好保存

  // 限定输入框的值
  const defineType = (value: string, type: AsinTable.IDefineType): string => {
    switch (type) {
    case 'int': // 整数
      return strToNaturalNumStr(String(value));
    case 'decimal': // 小数
      return strToMoneyStr(String(value));
    case 'grade': // 评分
      return strToReviewScoreStr(String(value));
    default:
      return '';
    }
  };

  const fields: AsinTable.IFieldsType[][] = [
    [
      {
        headText: '总体销售表现',
        defineType: 'other',
      },
      {
        label: '总销售额', 
        field: 'totalSales',
        defineType: 'decimal',
      },
      {
        label: '总订单量', 
        field: 'totalOrderQuantity',
        defineType: 'int',
      },
      {
        label: '总销量', 
        field: 'totalSalesQuantity',
        defineType: 'int',
      },
      {
        label: '回评率', 
        field: 'replyReviewRate',
        defineType: 'decimal',
      },
      {
        label: '利润', 
        field: 'profit',
        defineType: 'decimal',
      },
      {
        label: '利润率',
        percent: true,
        field: 'profitRate',
        defineType: 'decimal',
      },
      {
        label: <span>销量<span className={styles.secondary}>/</span>订单量</span>,
        field: 'salesQuantityExceptOrderQuantity',
        defineType: 'decimal',
      },
    
      {
        label: '平均客单价',
        field: 'avgCustomerPrice',
        defineType: 'decimal',
      },
      {
        label: '平均售价',
        field: 'avgSellingPrice',
        defineType: 'decimal',
      },
      {
        label: '优惠订单',
        field: 'preferentialOrderQuantity',
        defineType: 'decimal',
      },
      {
        label: '关联销售',
        field: 'associateSales',
        defineType: 'int',
      },
    ],

    [
      {
        headText: '总体流量转化',
        defineType: 'other',
      },
      {
        label: 'PageView', 
        field: 'pageView',
        defineType: 'int',
      },
      {
        label: 'Session', 
        field: 'session',
        defineType: 'int',
      },
      {
        label: <span style={{
          fontSize: 13,
        }}>PageView<span className={styles.secondary}>/</span>Session</span>,
        field: 'pageViewExceptSession',
        defineType: 'decimal',
      },
      {
        label: '转化率', 
        field: 'conversionsRate',
        percent: true,
        defineType: 'decimal',
      },
    ],

    [
      {
        headText: '退货',
        defineType: 'other',
      },
      {
        label: '退货率', 
        field: 'returnRate',
        defineType: 'decimal',
      },
      {
        label: '退货量', 
        field: 'returnQuantity',
        defineType: 'int',
      },
    ],
  
    [
      {
        headText: 'B2B销售',
        defineType: 'other',
      },
      {
        label: 'B2B销售额', 
        field: 'b2bSales',
        defineType: 'decimal',
      },
      {
        label: 'B2B订单量', 
        field: 'b2bOrderQuantity',
        defineType: 'int',
      },
      {
        label: 'B2B销量', 
        field: 'b2bSalesQuantity',
        defineType: 'int',
      },
      {
        label: <span>B2B销量<span className={styles.secondary}>/</span>订单量</span>,
        field: 'b2bSalesQuantityExceptOrderQuantity',
        defineType: 'decimal',
      },
      {
        label: 'B2B平均售价', 
        field: 'b2bAvgSellingPrice',
        defineType: 'decimal',
      },
      {
        label: 'B2B平均客单价', 
        field: 'b2bAvgCustomerPrice',
        defineType: 'decimal',
      },

      // 占个按钮组
      {
        headText: 'btns',
        defineType: 'other',
      },
    ],
  ];


  // 清空
  const onresetForm = () => {
    form.resetFields();
  };

  // 取消偏好
  const preferentialCancelCallback = () => {
    setSavepreferential(false);
  };

  // 点击偏好
  const clickSavePreferential = () => {
    setSavepreferential(true);
  };

  /**
   * 保存偏好的编辑框回调
   * @param val 偏好名字
   * 返回一个Promise给编辑框组件，true,条件通过，清空编辑框，false不清空
   */
  const confirmCallback = (val: string): Promise<boolean> => {
    let res = true; // 传给编辑框的值，如果区间为空，条件不通过时，返回false
    setSavepreferential(true);
    const result = preferentialConfirmCallback(val, form.getFieldsValue());
    return result.then(isBoolean => {
      // 区间为空，条件不通过
      if (isBoolean === false) {
        setSavepreferential(true);
        res = false;
      } else {
        setSavepreferential(false);
        res = true;
      }
      return Promise.resolve(res);
    });
  };

  const onFinish = () => {
    confirmFiltrateCallback(form.getFieldsValue());
  };

  return (<div>
    <Form 
      name="parentasinfiltern"
      form={form}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      id="parentasinfiltern"
    >
      {
        fields.map((arr, arri) => {
          return <div className={styles.filternItem} key={arri}>
            <p className={styles.title} key={arri}>{arr[0].headText}</p>
            <div className={styles.layoutBox}>
              {
                arr.map((item, i) => {
                  // 过滤标题
                  if (i === 0) {
                    return;
                  }
                  // 最后一个是按钮
                  if (item.headText && item.headText === 'btns') {
                    return <div className={styles.btns} key={i}>
                      <div className={styles.savePreferential}>
                        <Button className={styles.btn} onClick={clickSavePreferential}>保存偏好</Button>
                        <div className={styles.alert}
                          style={{
                            display: savepreferential ? 'block' : 'none',
                          }}
                        >
                          <EditBox 
                            inputValue={''} 
                            maxLength={15}
                            confirmCallback={confirmCallback}
                            cancelCallback={preferentialCancelCallback}
                          />
                        </div>
                      </div>
                      <Button onClick={cancelFiltrate}>取消</Button>
                      <Form.Item><Button type="primary" htmlType="submit">确定</Button></Form.Item>
                      <span className={styles.clear} onClick={onresetForm}>清空</span>
                    </div>;
                  }

                  return <div className={styles.layoutItem} key={i}>
                    <p className={styles.textName}>
                      <span>{item.label}</span>
                      {item.percent ? <span className={styles.percent}>(%)</span> : null}
                      <span className={styles.colon}>：</span>
                    </p>
                    <Form.Item 
                      name={`${item.field}Min`} 
                      className={styles.item}
                      normalize={value => defineType(value, item.defineType)}
                    >
                      <Input placeholder="min" />
                    </Form.Item>
                    <span className={styles.line}>—</span>
                    <Form.Item 
                      name={`${item.field}Max`}
                      className={styles.item}
                      normalize={value => defineType(value, item.defineType)}
                    >
                      <Input placeholder="max" />
                    </Form.Item>
                  </div>;
                })
              }
            </div>
          </div>;
        })
      }
      <div className={`${styles.layoutBox} ${styles.other}`}>
        
      </div>
    </Form>
  </div>);
};


export default ParentAsinFiltern;
