/**
 * 状态筛选下拉选择
 */
import React, { useState } from 'react';
import { Dropdown, Form, Select, Button, Input, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { strToMoneyStr } from '@/utils/utils';
import styles from './index.less';

const { Option } = Select;
const { Item: FormItem } = Form;

interface IProps {
  currency: string;
  marketplace: API.Site;
  callback: (values: IComputedBidParams) => boolean | undefined;
}

export interface IComputedBidParams {
  type: 'value' | 'suggest' | 'suggestMax' | 'suggestMin';
  unit: 'currency' | 'percent';
  operator: '+' | '-';
  exprValue: number;
  price?: number;
}

// 设置竞价的调价类型下拉框
const setBidOptions = [
  { key: 'value', name: '固定值' },
  { key: 'suggested', name: '建议竞价基础上' },
  { key: 'suggestedMax', name: '最高建议竞价' },
  { key: 'suggestedMin', name: '最低建议竞价' },
].map(item => <Option key={item.key} value={item.key}>{item.name}</Option>);

const BatchSetBid: React.FC<IProps> = props => {
  const { currency, marketplace, callback } = props;
  const [visibleBid, setVisibleBid] = useState<boolean>(false);
  // 批量设置竞价时的 type，是数值还是按建议竞价计算值
  const [isExprBatchBid, setIsExprBatchBid] = useState<boolean>(false);

  // 批量设置竞价
  function handleBatchBidFinish (values: IComputedBidParams) {
    if (!values.exprValue && !values.price) {
      message.error('请输入正确的值');
      return;
    }
    if (marketplace === 'JP') {
      // 日本站不允许设置小数
      if (values.price && Number(values.price) % 1 !== 0) {
        message.error('日本站的金额不能设置为小数!');
        return;
      }
    }
    values.exprValue = Number(values.exprValue);
    // 最终结果正确时才关闭弹窗
    callback(values) ? setVisibleBid(false) : null;
  }

  return (
    <Dropdown
      overlayClassName={styles.batchBidDropdown}
      trigger={['click']}
      visible={visibleBid}
      onVisibleChange={flag => setVisibleBid(flag)}
      placement="bottomLeft"
      overlay={
        <div>
          <Form
            className={styles.batchBidForm}
            layout="inline"
            onFinish={handleBatchBidFinish}
            initialValues={{
              type: 'value',
              operator: '+',
              unit: 'currency',
            }}
          >
            <FormItem name="type">
              <Select
                className={styles.bidSetTypeSelect}
                dropdownClassName={styles.selectDropdown}
                onChange={value => setIsExprBatchBid(value !== 'value')}
              >
                { setBidOptions }
              </Select>
            </FormItem>
            <div className={styles.batchPriceExpr}>
              {
                isExprBatchBid
                  ?
                  <>
                    <FormItem name="operator">
                      <Select dropdownClassName={styles.selectDropdown}>
                        <Option value="+">+</Option>
                        <Option value="-">-</Option>
                      </Select>
                    </FormItem>
                    <FormItem name="unit">
                      <Select dropdownClassName={styles.selectDropdown}>
                        <Option value="currency">{currency}</Option>
                        <Option value="percent">%</Option>
                      </Select>
                    </FormItem>
                  </>
                  :
                  null
              }
            </div>
            <FormItem
              name={isExprBatchBid ? 'exprValue' : 'price'}
              style={{ flex: 1 }}
              getValueFromEvent={
                (e: React.ChangeEvent<HTMLInputElement>) => strToMoneyStr(e.target.value)
              }
            >
              <Input />
            </FormItem>
            <Button htmlType="submit" type="primary">确定</Button>
          </Form>
        </div>
      }
    >
      <Button>设置竞价 <DownOutlined /></Button>
    </Dropdown>
  );
};

export default BatchSetBid;
