/**
 * 高级筛选
 */
import React from 'react';
import { Input, Button, Form } from 'antd';
import { ParamsValue } from '@/models/goodsList';
import { Store } from 'redux';
import {
  strToMoneyStr,
  strToUnsignedIntStr,
  strToNaturalNumStr,
} from '@/utils/utils';
import classnames from 'classnames';
import styles from './index.less';

const { Item: FormItem } = Form;

interface IProps {
  handleFiltrate: (values: { [key: string]: Store }) => void;
  handleClickFiltrate: () => void;
  filtrateParams: {
    [key: string]: ParamsValue;
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
    <FormItem
      label={label}
      labelAlign="left"
      className={styles.FormItem}
    >
      <FormItem name={`${name}Min`} className={styles.FormRangeItem} {...formItemProps}>
        <Input placeholder="min" />
      </FormItem>
      <span className={styles.hyphen}>—</span>
      <FormItem name={`${name}Max`} className={styles.FormRangeItem} {...formItemProps}>
        <Input placeholder="max" />
      </FormItem>
    </FormItem>
  );
};

const Filtrate: React.FC<IProps> = props => {
  const [form] = Form.useForm();
  const {
    handleFiltrate,
    handleClickFiltrate,
    filtrateParams,
  } = props;

  // 获取带货币符号或者百分号的 label
  function getSymbolLabel(label: string, symbol: string) {
    return (
      <>
        { label }
        <span className={styles.secondary}>&nbsp;({symbol})</span>
      </>
    );
  }

  // 获取空筛选条件
  function getEmptyFiltrateParams() {
    const params = { ...filtrateParams };
    Object.keys(params).forEach(key => {
      params[key] = undefined;
    });
    return params;
  }

  // 清空表单输入
  function handleClickFormEmpty() {
    form.resetFields();
    // 设置表单中的值为空 (不改变 state)
    form.setFieldsValue(getEmptyFiltrateParams());
  }

  return (
    <Form
      className={styles.Form}
      form={form}
      labelCol={{ span: 6 }}
      onFinish={handleFiltrate}
      initialValues={filtrateParams}
    >
      { getFiltrateRangeItem('销售额', 'sales', 'money') }
      { getFiltrateRangeItem('Spend', 'spend', 'money') }
      { getFiltrateRangeItem('Clicks', 'clicks', 'natural') }
      { getFiltrateRangeItem('订单量', 'orderNum', 'natural') }
      { getFiltrateRangeItem(getSymbolLabel('ACoS', '%'), 'acos', 'money') }
      { getFiltrateRangeItem(getSymbolLabel('CTR', '%'), 'ctr', 'money') }
      { getFiltrateRangeItem('CPC', 'cpc', 'money') }
      { getFiltrateRangeItem('RoAS', 'roas', 'money') }
      { getFiltrateRangeItem(getSymbolLabel('转化率', '%'), 'conversionsRate', 'money') }
      { getFiltrateRangeItem('CPA', 'cpa', 'money') }
      { getFiltrateRangeItem('Impressions', 'impressions', 'unsignedInt') }
      <div className={classnames(styles.filtrateBtns, styles.FormItem)}>
        <Button onClick={handleClickFiltrate}>取消</Button>
        <Button type="primary" htmlType="submit">确定</Button>
        <Button className={styles.btnEmpty} type="link" onClick={handleClickFormEmpty}>清空</Button>
      </div>
    </Form>
  );
};

export default Filtrate;
