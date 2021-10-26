import React from 'react';
import styles from './index.less';
import {
  Button,
  Form,
  Input,
  Radio,
  Select,
} from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { 
  useSelector,
} from 'umi';
import {
  strToMoneyStr,
  strToNaturalNumStr,
  strToReviewScoreStr,
} from '@/utils/utils';
import { useState } from 'react';
import EditBox from '../../components/EditBox';
import { 
  IAsinTableState,
  ConnectProps,
} from 'umi';


interface IDvaState extends ConnectProps {
  asinTable: IAsinTableState;
}

interface IProps {
  preferentialConfirmCallback: (val: string, data: {}) => Promise<boolean>;
  cancelFiltrate?: () => void; // 取消按钮
  confirmFiltrateCallback: (data: {}) => void; // 确定按钮
  form: FormInstance;
}


const ChildAsinFiltern: React.FC<IProps> = (props) => {
  const {
    preferentialConfirmCallback,
    cancelFiltrate,
    confirmFiltrateCallback,
    form,
  } = props;

  // dva
  // 分组是否已请求
  const groups = useSelector((state: IDvaState) => state.asinTable.childGroups);

  // hooks
  // const [form] = Form.useForm();

  // state 
  
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
        label: '利润率 ',
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
        defineType: 'int',
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
        label: '转化率 ', 
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
        label: '退货量', 
        field: 'returnQuantity',
        defineType: 'int',
      },
      {
        label: '退货率', 
        field: 'returnRate',
        defineType: 'decimal',
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
        defineType: 'decimal',
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
    ],

    [
      {
        headText: '广告销售表现',
        defineType: 'other', 
      },
      {
        label: '广告销售额', 
        field: 'adSales',
        defineType: 'decimal',
      },
      {
        label: '本SKU广告销售额', 
        field: 'skuAdSales',
        defineType: 'decimal',
      },
      {
        label: '自然销售额', 
        field: 'naturalSales',
        defineType: 'decimal',
      },
      {
        label: '广告订单量',
        field: 'adOrderQuantity',
        defineType: 'int',
      },
      {
        label: '本SKU广告订单量', 
        field: 'skuAdOrderQuantity',
        defineType: 'int',
      },
      {
        label: '自然订单量', 
        field: 'naturalOrderQuantity',
        defineType: 'int',
      },
    ],

    [
      {
        headText: '广告投入回报',
        defineType: 'other',
      },
      {
        label: 'CPC', 
        field: 'cpc',
        defineType: 'decimal',
      },
      {
        label: 'Spend', 
        field: 'spend',
        defineType: 'decimal',
      },
      {
        label: 'ACoS ', 
        field: 'acos',
        percent: true,
        defineType: 'decimal',
      },
      {
        label: '综合ACoS ',
        field: 'compositeAcos',
        percent: true,
        defineType: 'decimal',
      },
      {
        label: 'RoAS ', 
        field: 'roas',
        percent: true,
        defineType: 'decimal',
      },
      {
        label: '综合RoAS ', 
        field: 'compositeRoas',
        percent: true,
        defineType: 'decimal',
      },
    ],

    [
      {
        headText: '广告流量转化',
        defineType: 'other',
      },
      {
        label: 'Impressions', 
        field: 'impressions',
        defineType: 'int',
      },
      {
        label: 'Clicks', 
        field: 'clicks',
        defineType: 'int',
      },
      {
        label: 'CTR ', 
        field: 'ctr',
        percent: true,
        defineType: 'decimal',
      },
      {
        label: '广告转化率 ',
        field: 'adConversionsRate',
        percent: true,
        defineType: 'decimal',
      },
    ],
  ];

  const [savepreferential, setSavepreferential] = useState<boolean>(false); // 是否显示偏好保存

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

  // 清空
  const onresetForm = () => {
    form.resetFields();
  };

  const onFinish = () => {
    confirmFiltrateCallback(form.getFieldsValue());
  };

  return (<div>
    <Form 
      name="childasinfiltern"
      form={form}
      initialValues={{ remember: true }}
      id="childasinfiltern"
      onFinish={onFinish}
    >
      {
        fields.map((arr, arri) => {
          return <div className={styles.filternItem} key={arri}>
            <p className={styles.title} key={0}>{arr[0].headText}</p>
            <div className={styles.layoutBox}>
              {
                arr.map((item, i) => {
                  if (i === 0) {
                    return;
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
        <div className={styles.radioStatus}>
          <Form.Item label="状态" name="status" initialValue={undefined}>
            <Radio.Group>
              <Radio value={undefined} className={styles.radio}>全部</Radio>
              <Radio value="Active" className={styles.radio}>在售</Radio>
              <Radio value="Inactive" className={styles.radio}>不可售</Radio>
              <Radio value="Incomplete" className={styles.radio}>禁止显示</Radio>
              <Radio value="Remove" className={styles.radio}>已移除</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div className={styles.selectBox}>
          <Form.Item name="groupId" hidden={false} label="分组：" colon={false} className={styles.formSelect} initialValue={null}>
            <Select>
              <Select.Option value={null as any}>全部</Select.Option> {/* eslint-disable-line */}
              {groups.map((item, i) => {
                return (
                  <Select.Option value={item.id as string} key={i}>{item.groupName}</Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>
        <div className={styles.radioType}>
          <Form.Item label="广告组类型：" name="adType" initialValue={undefined}>
            <Radio.Group>
              <Radio value={undefined} checked className={styles.radio}>不限</Radio>
              <Radio value="1" className={styles.radio}>SP自动</Radio>
              <Radio value="2" className={styles.radio}>SP手动</Radio>
              <Radio value="3" className={styles.radio}>SB</Radio>
              <Radio value="4" className={styles.radio}>SD</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div>
          <div className={styles.layoutItem}>
            <p className={styles.textName}>
              <span>Review</span>
              <span className={styles.colon}>：</span>
            </p>
            <Form.Item 
              name={`reviewNumMin`} 
              className={styles.item}
              normalize={value => defineType(value, 'int')}
            >
              <Input placeholder="min" />
            </Form.Item>
            <span className={styles.line}>—</span>
            <Form.Item 
              name={`reviewNumMax`}
              className={styles.item}
              normalize={value => defineType(value, 'int')}
            >
              <Input placeholder="max" />
            </Form.Item>
          </div>
        </div>
        <div>
          <div className={styles.layoutItem}>
            <p className={styles.textName}>
              <span>评分</span>
              <span className={styles.colon}>：</span>
            </p>
            <Form.Item 
              name={`reviewScoreMin`} 
              className={styles.item}
              normalize={value => defineType(value, 'grade')}
            >
              <Input placeholder="min" />
            </Form.Item>
            <span className={styles.line}>—</span>
            <Form.Item 
              name={`reviewScoreMax`}
              className={styles.item}
              normalize={value => defineType(value, 'grade')}
            >
              <Input placeholder="max" />
            </Form.Item>
          </div>
        </div>
        <div className={styles.radioAsin}>
          <Form.Item label="独立ASIN" name="independentAsin" initialValue={null}>
            <Radio.Group>
              <Radio value={null} checked className={styles.radio}>不限</Radio>
              <Radio value={1} className={styles.radio}>是</Radio>
              <Radio value={2} className={styles.radio}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div className={styles.btns}>
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
          <Button className={styles.btn} onClick={cancelFiltrate}>取消</Button>
          <Form.Item>
            <Button 
              type="primary"
              htmlType="submit"
              className={styles.btn}
            >
              确定
            </Button>
          </Form.Item>
          <span 
            className={`${styles.clear} ${styles.btn}`}
            onClick={onresetForm}
          >清空</span>
        </div>
      </div>
    </Form>
  </div>);
};


export default ChildAsinFiltern;
