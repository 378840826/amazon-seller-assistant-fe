import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { strToMoneyStr } from '@/utils/utils';
import {
  Form,
  Button,
  Input,
  Select,
  message,
} from 'antd';

interface IProps {
  currency: API.Site;
  onCancel: () => void;
  onConfire: (data: CreateCampaign.ICallbackDataType) => void;
  marketplace: string;
}

const { Item } = Form;
const { Option } = Select;
const BatchSetBidMenu: React.FC<IProps> = props => {
  const { currency, onCancel, onConfire, marketplace } = props;
  const [form] = Form.useForm();

  const [visibleOtherSelect, setVisibleOtherSelect] = useState<boolean>(false); // 是否显示第二、三个下拉列表
  const defaultBidMin = marketplace === 'JP' ? 2 : 0.02;

  const onValuesChange = (value: any) => { // eslint-disable-line
    if (value.oneSelect && value.oneSelect === 'a') {
      setVisibleOtherSelect(false);
      return;
    }
    value.oneSelect && setVisibleOtherSelect(true);
  };

  // 确定按钮
  const confire = () => {
    const data: any = {}; // eslint-disable-line
    data.value = form.getFieldValue('value');
    data.oneSelect = form.getFieldValue('oneSelect');

    if (data.value === null || data.value === undefined || data.value === '') {
      message.error('关键词竞价不能为空');
      return;
    }

    if (Number(data.value) < defaultBidMin ) {
      message.error(`关键词竞价不能低于${defaultBidMin}`);
    }

    if (data.oneSelect !== 'a') {
      data.twoSelect = form.getFieldValue('twoSelect');
      data.threeSelect = form.getFieldValue('threeSelect');
    }

    onConfire(data);
  };

  return (
    <Form 
      className={styles.setBox} 
      onValuesChange={onValuesChange} 
      form={form}
      onClick={e => e.nativeEvent.stopImmediatePropagation()}
    >
      <Item name="oneSelect" initialValue="a" className={styles.selectOne}>
        <Select>
          <Option value="a">固定值</Option>
          <Option value="b">建议竞价基础上</Option>
          <Option value="c">最高建议竞价</Option>
          <Option value="d">最低建议竞价</Option>
        </Select>
      </Item>
      <Item name="twoSelect" initialValue="add" className={classnames(styles.otherSelect, visibleOtherSelect ? '' : 'none')}>
        <Select>
          <Option value="add">+</Option>
          <Option value="subtract">-</Option>
        </Select>
      </Item>
      <Item name="threeSelect" initialValue="currency" className={classnames(styles.otherSelect, visibleOtherSelect ? '' : 'none')}>
        <Select>
          <Option value="currency">{currency}</Option>
          <Option value="compare">%</Option>
        </Select>
      </Item>
      <Item className={styles.input} name="value" normalize={v => strToMoneyStr(v)}>
        <Input autoComplete="off"/>
      </Item>
      <Button onClick={onCancel}>取消</Button>
      <Button type="primary" className={styles.btn} onClick={confire}>确定</Button>
    </Form>
  );
};

export default BatchSetBidMenu;
