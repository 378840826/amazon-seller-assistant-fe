import React from 'react';
import { Input, Button, Row, Col, Form, Radio, Select } from 'antd';
import { ParamsValue } from '@/models/goodsList';
import { Store } from 'redux';
import {
  strToMoneyStr,
  strToReviewScoreStr,
  strToUnsignedIntStr,
  strToNaturalNumStr,
  strToMinusMoneyStr,
} from '@/utils/utils';
import { ISelectOption } from './BatchSet';
import styles from './index.less';

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;
const { Option } = Select;

interface IProps {
  handleFiltrate: (values: { [key: string]: Store }) => void;
  handleClickFiltrate: () => void;
  filtrateParams: {
    [key: string]: ParamsValue;
  };
  groupsOptions: ISelectOption[];
  rulesOptions: ISelectOption[];
  currency: string;
  getEmptyFiltrateParams: () => {
    [x: string]: ParamsValue;
  };
}

// 筛选器 min - max 范围, valueFormat 为输入框限制的格式
const getFiltrateRangeItem = (
  label: string | React.ReactNode, name: string, valueFormat?: string
) => {
  let converter: (value: string) => string;
  switch (valueFormat) {
  // 金额格式
  case 'money':
    converter = strToMoneyStr;
    break;
  // 可为负数的金额
  case 'minusMoney':
    converter = strToMinusMoneyStr;
    break;
  // 0 - 5 的整数
  case 'review':
    converter = strToReviewScoreStr;
    break;
  // 自然数
  case 'natural':
    converter = strToNaturalNumStr;
    break;
  // 正整数
  case 'unsignedInt':
    converter = strToUnsignedIntStr;
    break;
  default:
    break;
  }
  const formItemProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getValueFromEvent: (e: any) => converter(e.target.value),
  };
  return (
    <Col span={6}>
      <FormItem
        label={label}
        labelAlign="left"
        style={{ marginBottom: 0 }}
      >
        <FormItem name={`${name}Min`} className={styles.FormRangeItem} {...formItemProps}>
          <Input placeholder="min" />
        </FormItem>
        <span className={styles.hyphen}>—</span>
        <FormItem name={`${name}Max`} className={styles.FormRangeItem} {...formItemProps}>
          <Input placeholder="max" />
        </FormItem>
      </FormItem>
    </Col>
  );
};

// 筛选器 下拉选择
const getFiltrateSelectItem = (label: string, name: string, options: ISelectOption[]) => (
  <Col span={6}>
    <FormItem
      label={label}
      name={name}
      labelAlign="left"
      labelCol={{ span: 6 }}
      style={{ marginBottom: 0, display: 'flex', flexWrap: 'nowrap' }}

    >
      <Select style={{ width: '100%' }}>
        <Option value="">全部</Option>
        {
          options.map(item => (
            <Option key={item.value} value={item.value}>{item.name}</Option>
          ))
        }
      </Select>
    </FormItem>
  </Col>
);

const Filtrate: React.FC<IProps> = props => {
  const [form] = Form.useForm();
  const {
    handleFiltrate,
    handleClickFiltrate,
    filtrateParams,
    groupsOptions,
    rulesOptions,
    currency,
    getEmptyFiltrateParams,
  } = props;

  // 清空表单输入
  const handleClickFormEmpty = () => {
    form.resetFields();
    // 设置表单中的值为空 (不改变 state)
    form.setFieldsValue(getEmptyFiltrateParams());
  };

  // 筛选器 带货币符号的 label
  const getCurrencyLabel = (label: string) => (
    <>
      { label }
      <span className={styles.secondary}>&nbsp;({currency})</span>
    </>
  );
  

  return (
    <Form
      className={styles.Form}
      form={form}
      labelCol={{ span: 6 }}
      onFinish={handleFiltrate}
      initialValues={filtrateParams}
    >
      <Row gutter={{ xl: 48, xxl: 96 }}>
        { getFiltrateRangeItem('评分', 'reviewScore', 'review') }
        { getFiltrateRangeItem(getCurrencyLabel('最低价'), 'minPrice', 'money') }
        { getFiltrateRangeItem('7天订单', 'dayOrder7Count', 'natural') }
        <Col span={6}>
          <FormItem
            label="调价开关"
            name="adjustSwitch"
            labelAlign="left"
            labelCol={{ span: 6 }}
            style={{ marginBottom: 0 }}
          >
            <RadioGroup>
              <Radio value={undefined}>全部</Radio>
              <Radio value="true">开</Radio>
              <Radio value="false">关</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ xl: 48, xxl: 96 }}>
        { getFiltrateRangeItem('Review', 'reviewCount', 'natural') }
        { getFiltrateRangeItem(getCurrencyLabel('最高价'), 'maxPrice', 'money') }
        { getFiltrateRangeItem('30天订单', 'dayOrder30Count', 'natural') }
        <Col span={6}>
          <FormItem
            className={styles.acFormItem}
            label="Amazon's Choice :"
            colon={false}
            name="ac"
            labelAlign="left"
            labelCol={{ span: 6 }}
            style={{ marginBottom: 0 }}
          >
            <RadioGroup>
              <Radio value={undefined}>全部</Radio>
              <Radio value="true">有</Radio>
              <Radio value="false">无</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ xl: 48, xxl: 96 }}>
        { getFiltrateRangeItem(getCurrencyLabel('售价'), 'price', 'money') }
        { getFiltrateRangeItem(getCurrencyLabel('成本'), 'cost', 'money') }
        { getFiltrateRangeItem('排名', 'ranking', 'unsignedInt') }
        <Col span={6}>
          <FormItem
            label="发货方式"
            name="fulfillmentChannel"
            labelAlign="left"
            labelCol={{ span: 6 }}
            style={{ marginBottom: 0 }}
          >
            <RadioGroup>
              <Radio value={undefined}>全部</Radio>
              <Radio value="FBA">FBA</Radio>
              <Radio value="FBM">FBM</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ xl: 48, xxl: 96 }}>
        { getFiltrateRangeItem('可售库存', 'sellable', 'natural') }
        { getFiltrateRangeItem(getCurrencyLabel('头程'), 'freight', 'money') }
        { getFiltrateSelectItem('分组', 'groupId', groupsOptions) }
        <Col span={6}>
          <FormItem
            label="Buybox"
            name="buybox"
            labelAlign="left"
            labelCol={{ span: 6 }}
            style={{ marginBottom: 0 }}
          >
            <RadioGroup>
              <Radio value={undefined}>全部</Radio>
              <Radio value="true">是</Radio>
              <Radio value="false">否</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ xl: 48, xxl: 96 }}>
        { getFiltrateRangeItem(getCurrencyLabel('利润'), 'profit', 'minusMoney') }
        { getFiltrateRangeItem(getCurrencyLabel('利润率'), 'profitMargin', 'minusMoney') }
        { getFiltrateSelectItem('调价规则', 'ruleId', rulesOptions) }
        <Col span={6}>
          <FormItem
            className={styles.statusFormItem}
            label="状态"
            name="status"
            labelAlign="left"
            labelCol={{ span: 3 }}
            style={{ marginBottom: 0 }}
          >
            <RadioGroup>
              <Radio value={undefined}>全部</Radio>
              <Radio value="Active">在售</Radio>
              <Radio value="Inactive">不可售</Radio>
              <Radio value="Incomplete">禁止显示</Radio>
              <Radio value="Remove">已移除</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <div className={styles.filtrateBtns}>
        <Button onClick={handleClickFiltrate}>取消</Button>
        <Button type="primary" htmlType="submit">确定</Button>
        <Button className={styles.btnEmpty} type="link" onClick={handleClickFormEmpty}>清空</Button>
      </div>
    </Form>
  );
};

export default Filtrate;
