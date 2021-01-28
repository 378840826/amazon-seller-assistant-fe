import React from 'react';
import { Form, Radio, Input, Button, DatePicker } from 'antd';
import styles from './index.less';
import moment from 'moment';
import { connect } from 'umi';
import {
  strToMoneyStr,
  strToNaturalNumStr,
  strToReviewScoreStr,
} from '@/utils/utils';
import { IConnectState, IConnectProps } from '@/models/connect';
import classnames from 'classnames';
const deliveryList = [
  { name: '不限', value: 'all' },
  { name: 'Amazon', value: 'Amazon' },
  { name: 'FBA', value: 'FBA' },
  { name: 'FBM', value: 'FBM' },
];
const acList = [
  { name: '不限', value: 'all' },
  { name: '是', value: true },
  { name: '否', value: false },
];
const rangeList = {
  '全部': null,
  '最近7天': [
    moment().subtract(6, 'day'),
    moment().endOf('day'),
  ],
  '最近14天': [
    moment().subtract(13, 'day'),
    moment().endOf('day'),
  ],
  '最近30天': [
    moment().subtract(29, 'day'),
    moment().endOf('day'),
  ],
  '最近60天': [
    moment().subtract(59, 'day'),
    moment().endOf('day'),
  ],
  '最近180天': [
    moment().subtract(179, 'day'),
    moment().endOf('day'),
  ],
  '最近365天': [
    moment().subtract(364, 'day'),
    moment().endOf('day'),
  ],
};
const ItemLayout = {
  labelCol: { span: 5, offset: 0 },
  wrapperCol: { span: 19, offset: 0 },
};
const acLayout = {
  labelCol: { span: 9, offset: 0 },
  wrapperCol: { span: 15, offset: 0 },
};
const { RangePicker } = DatePicker;

interface ISeniorFilter extends IConnectProps{
  tableLoading: boolean;
  send: API.IParams;
}
const SeniorFilter: React.FC<ISeniorFilter> = ({ tableLoading, dispatch, send }) => {
  const [form] = Form.useForm();
  const RangePickerProps: API.IParams = {
    ranges: rangeList,
  };

  const filterFinish = (value: API.IParams) => {
    const sendFilter: API.IParams = {};
    Object.keys(value).map( item => {
      if (item === 'dateRange'){
        if (Array.isArray(value[item])){
          sendFilter.dateStart = value[item][0].format('YYYY-MM-DD');
          sendFilter.dateEnd = value[item][1].format('YYYY-MM-DD');
        } else {
          sendFilter.dateStart = '';
          sendFilter.dateEnd = '';
        }
      } else {
        sendFilter[item] = value[item] === undefined ? '' : value[item];
      }
      
    });
    const data = {
      ...send.data,
      ...sendFilter,
    };
    dispatch({
      type: 'comPro/updateSend',
      payload: {
        data,
      },
    });
  };

  //清空
  const onClear = () => {
    form.resetFields();
  };

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


  return (
    <div className={styles.__filter}>
      <Form 
        className={styles.__form}
        name="form"
        form={form}
        onFinish={filterFinish}
        initialValues={{
          deliveryMethod: 'all',
          acKeywordStatus: 'all',
        }}
      >
        <Form.Item 
          name="deliveryMethod"
          label="发货方式"
          {...ItemLayout}
          className={classnames(styles.common_width, styles.delivery_checkbox)}
        >
          <Radio.Group>
            {
              deliveryList.map((item, index) => {
                return (
                  <Radio value={item.value} key={index}>{item.name}</Radio>
                );
              })
            }
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="价格"
          className={styles.common_width}
          {...ItemLayout}
        >
          <Form.Item 
            normalize={value => defineType(value, 'decimal')}
            className={styles.short_width} 
            name="priceMin">
            <Input placeholder="min"/>
          </Form.Item>
          <span className={styles.bar}></span>
          <Form.Item 
            normalize={value => defineType(value, 'decimal')}
            className={styles.short_width} 
            name="priceMax">
            <Input placeholder="max"/>
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="评分"
          className={styles.common_width}
          {...ItemLayout}
        >
          <Form.Item 
            normalize={value => defineType(value, 'grade')}
            className={styles.short_width} 
            name="scopeMin"><Input placeholder="min"/></Form.Item>
          <span className={styles.bar}></span>
          <Form.Item 
            normalize={value => defineType(value, 'grade')}
            className={styles.short_width} 
            name="scopeMax"><Input placeholder="max"/></Form.Item>
        </Form.Item>
        <Form.Item
          label="上架时间"
          name="dateRange"
          className={styles.common_width}
          {...ItemLayout}
        >
          <RangePicker {...RangePickerProps}/>
        </Form.Item>
        <Form.Item
          label="Review"
          className={styles.common_width}
          {...ItemLayout}
        >
          <Form.Item 
            normalize={value => defineType(value, 'int')}
            className={styles.short_width} 
            name="reviewsCountMin"><Input placeholder="min"/></Form.Item>
          <span className={styles.bar}></span>
          <Form.Item 
            normalize={value => defineType(value, 'int')}
            className={styles.short_width} 
            name="reviewsCountMax"><Input placeholder="max"/></Form.Item>
        </Form.Item>
        <Form.Item
          label="大类排名"
          className={styles.common_width}
          {...ItemLayout}
        >
          <Form.Item 
            normalize={value => defineType(value, 'int')}
            className={styles.short_width} 
            name="rankingMin"><Input placeholder="min"/></Form.Item>
          <span className={styles.bar}></span>
          <Form.Item 
            normalize={value => defineType(value, 'int')}
            className={styles.short_width} 
            name="rankingMax"><Input placeholder="max"/></Form.Item>
        </Form.Item>
        <Form.Item
          label="卖家数"
          className={styles.common_width}
          {...ItemLayout}
        >
          <Form.Item 
            normalize={value => defineType(value, 'int')}
            className={styles.short_width} 
            name="sellerNumMin"><Input placeholder="min"/></Form.Item>
          <span className={styles.bar}></span>
          <Form.Item 
            normalize={value => defineType(value, 'int')}
            className={styles.short_width} 
            name="sellerNumMax"><Input placeholder="max"/></Form.Item>
        </Form.Item>
        <Form.Item
          label="变体数"
          className={classnames(styles.common_width, styles.variant_bottom)}
          {...ItemLayout}
        >
          <Form.Item 
            normalize={value => defineType(value, 'int')}
            className={styles.short_width} 
            name="variantNumMin"><Input placeholder="min"/></Form.Item>
          <span className={styles.bar}></span>
          <Form.Item 
            normalize={value => defineType(value, 'int')}
            className={styles.short_width} 
            name="variantNumMax"><Input placeholder="max"/></Form.Item>
        </Form.Item>
        <Form.Item 
          name="acKeywordStatus"
          label="Amazon's Choice"
          {...acLayout}
          className={classnames(styles.common_width, styles.ac_radioBox)}
        >
          <Radio.Group className={styles.__radio_group}>
            {
              acList.map((item, index) => {
                return (
                  <Radio value={item.value} key={index}>{item.name}</Radio>
                );
              })
            }
          </Radio.Group>
        </Form.Item>
        <Form.Item className={classnames(styles.common_width, styles.reset_btn)}>
          <Button type="link" onClick={onClear}>清空</Button>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={tableLoading}
          >筛选</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ comPro }: IConnectState) => ({
  send: comPro.send,
}))(SeniorFilter) ;
