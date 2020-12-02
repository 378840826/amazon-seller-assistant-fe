// 安全设定
import React, { useEffect } from 'react';
import styles from './index.less';
import { strToMoneyStr } from '@/utils/utils';
import { isEmptyObj } from '@/utils/huang';
import { Iconfont } from '@/utils/utils';
import {
  Form,
  Input,
  Select,
  Tooltip,
} from 'antd';

interface IProps {
  getDataFn: (params: {}) => void;
  initValues: Rules.ISafeDataType; // 初始化值
}

const { Item } = Form; 
const SecuritySettings: React.FC<IProps> = props => {
  const {
    getDataFn,
    initValues,
  } = props;
  const [form] = Form.useForm();

  // 修改时、初始化值
  useEffect(() => {
    if (!isEmptyObj(initValues)) {
      form.setFieldsValue(initValues);
      getDataFn(initValues);
    }
  }, [form, initValues, getDataFn]);

  const fieldChange = () => {
    getDataFn(form.getFieldsValue());
  };

  // 限制输入
  const limitedInput = (value: string) => {
    return strToMoneyStr(value);
  };
 

  return <div className={styles.SecuritySettings}>
    <Form form={form} onValuesChange={fieldChange}>
      <div className={styles.LayoutOneRow}>
        <div className={styles.item}>
          <span className={styles.title}>条件1：</span>当库存 ≤
          <Item name="stockLeValue" normalize={limitedInput}>
            <Input className={styles.securityValue} />
          </Item>
          <Tooltip title="现有库存=available库存+reserved可售库存" overlayClassName={styles.tooltip} >
            <Iconfont type="icon-shuoming-shubiaojingguo-copy" className={styles.hintIcon}/>
          </Tooltip>
        </div>
       
        <div className={styles.item}>
          则价格调至：
          <Item name="stockLeAction" initialValue="unchange" className={styles.select}>
            <Select>
              <Select.Option value="unchange">保持价格不变</Select.Option>
              <Select.Option value="max">最高价</Select.Option>
            </Select>
          </Item>
        </div>
      </div>
      <div className={styles.LayoutTwoRow}>
        <span className={styles.title}>条件2：</span>根据以上规则调价，若高于最高价， 则价格调至：
        <Item name="gtMaxAction" initialValue="max" className={styles.select}>
          <Select>
            <Select.Option value="max">最高价</Select.Option>
            <Select.Option value="unchange">保持价格不变</Select.Option>
          </Select>
        </Item>
      </div>
      <div className={styles.LayoutThreeRow}>
        <span className={styles.title}>条件3：</span>根据以上规则调价，若低于最低价， 则价格调至：
        <Item name="ltMinAction" initialValue="min" className={styles.select}>
          <Select>
            <Select.Option value="min">最低价</Select.Option>
            <Select.Option value="unchange">保持价格不变</Select.Option>
          </Select>
        </Item>
      </div>
    </Form>
  </div>;
};

export default SecuritySettings;
