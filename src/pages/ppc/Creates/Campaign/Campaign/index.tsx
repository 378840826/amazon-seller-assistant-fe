/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-06 09:46:56
 * 
 * 广告活动设置（第三步）
 */
import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Iconfont, strToMoneyStr, strToNaturalNumStr } from '@/utils/utils';
import moment, { Moment } from 'moment';
import momentTimezone from 'moment-timezone';
import {
  Radio,
  Form,
  Input,
  DatePicker,
  Select,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
// import ProductSelect from '../../components/ProductSelect';

interface IProps {
  currency: string;
  timezone: string;
  marketplace: string;
  campaignType: CreateCampaign.ICampaignType; // 选中的SP SD SB广告类型
  pattern: CreateCampaign.IManagementMode; // 营销模式是标签或是智能
  form: FormInstance;
}

const { Item } = Form;
const Campaign: React.FC<IProps> = props => {
  const { campaignType, pattern, currency, timezone, marketplace, form } = props;

  const siteDatetime = momentTimezone({ hour: 0, minute: 0, second: 0 }).tz(timezone).format('YYYY-MM-DD HH:mm:ss'); // 站点时间
  const [startData, setStartDate] = useState<string>(moment().format('YYYY-MM-DD HH:mm:ss')); // 广告活动的开始时间

  const limitedInput = (value: string) => {
    return strToNaturalNumStr(value);
  };

  function startDateChange (date: Moment | null) {
    const startDate = date?.format('YYYY-MM-DD HH:mm:ss');
    const endDate = form.getFieldValue('endDate');
    setStartDate(startDate as string);
      
    // 如果选中的结束日期小于开始日期时，将结束日期改成开始日期
    if (endDate && moment(startDate).isAfter(endDate.format('YYYY-MM-DD HH:mm:ss'))) {
      form.setFieldsValue({
        endDate: moment(startDate),
      });
    }
  }

  return <div className={styles.campaignBox}>
    <Item
      label="广告活动名称："
      name="name"
      className={styles.name}
      validateTrigger={['onKeyUp', 'onBlur']}
      rules={[{
        required: true,
        min: 1,
        max: 128,
        message: '广告活动名称长度不能为0或大于128位！',
      }]}
    >
      <Input className={styles.input} placeholder="请输入广告系列名称" autoComplete="off" maxLength={128} />
    </Item>
    <Item
      label={<>{pattern === 'ai' ? '总' : '日'}预算<span className={styles.secondary}>（{currency}）</span>：</>}
      name="dailyBudget"
      className={styles.totalBugget}
      validateTrigger={['onKeyUp', 'onBlur']}
      normalize={val => {
        if (marketplace === 'JP') {
          return strToNaturalNumStr(val);
        }
        return strToMoneyStr(val);
      }}
      rules={[{
        required: true,
        validator(rule, value) {
          const min = marketplace === 'JP' ? 200 : 1;
          if (isNaN(value) || value < min) {
            return Promise.reject(`广告活动每日预算至少${currency}${min}`);
          }

          if (value > 1000000) {
            return Promise.reject(`广告活动每日预算不能超过${currency}1000000`);
          }
          return Promise.resolve();
        },
      }]}
    >
      <Input className={styles.input} placeholder={`至少${currency}${marketplace === 'JP' ? 200 : 1}`} autoComplete="off" />
    </Item>
    <Item label="预算控制：" name="autoDefaultBid" className={classnames(
      styles.control,
      campaignType === 'sponsoredProducts' && pattern === 'ai' ? '' : 'none'
    )} initialValue="a">
      <Radio.Group>
        <Radio value="a">
          智能化控制
          <Iconfont 
            title="帮您优选高质量流量进行展现，延长推广宝贝的在线时长，提升转化效果" 
            type="icon-yiwen" 
            className={classnames(styles.secondary, styles.controlIcon)}/>
        </Radio>
        <Radio value="b">
          标准化控制
          <Iconfont 
            title="预算均匀分配到每个广告组" 
            type="icon-yiwen" 
            className={classnames(styles.secondary, styles.controlIcon)}/>
        </Radio>
      </Radio.Group>
    </Item>
    <div className={styles.rangeDate}>
      <span className={styles.text}>日期范围：</span>
      <Item name="startDate" initialValue={moment(siteDatetime)}>
        <DatePicker
          placeholder="年 / 月 / 日"
          format="YYYY-MM-DD"
          allowClear={false}
          disabledDate={current => current && current < moment(siteDatetime)}
          className={styles.date}
          onChange={startDateChange}
        />
      </Item>
      <span className={styles.line}>—</span>
      <Item name="endDate">
        <DatePicker
          placeholder="年 / 月 / 日"
          format="YYYY-MM-DD"
          disabledDate={current => current && current < moment(startData)}
          className={styles.date}
        />
      </Item>
    </div>
    
    <div className={classnames(
      campaignType === 'sponsoredProducts' && pattern === 'ai' ? 'none' : ''
    )}>
      <Item name={['outer', 'putMathod']} label="投放方式：" initialValue="auto" className={classnames(
        styles.putMathod,
        campaignType === 'sponsoredProducts' ? '' : 'none'
      )}>
        <Radio.Group onChange={v => console.log(v.target.value, 'xxx')}>
          <Radio value="auto" className={styles.putMathodAuto}>自动</Radio>
          <Radio value="manual">手动</Radio>
        </Radio.Group>
      </Item>
      {/* SD的智能托管的投放方式 */}
      <Item name={['outer', 'sdaiPutMathod']} label="投放方式：" initialValue="audiences" className={classnames(
        styles.putMathod,
        campaignType === 'sd' && pattern === 'ai' ? '' : 'none'
      )}>
        <Radio.Group>
          <Radio value="audiences" className={styles.putMathodAuto}>受众</Radio>
          <Radio value="classProduct">分类/商品</Radio>
        </Radio.Group>
      </Item>
      <Item label="竞价策略：" name="biddingStrategy" initialValue="legacyForSales" className={styles.bidding}>
        <Select dropdownClassName={styles.biddingDownList}>
          <Select.Option value="legacyForSales">Down Only</Select.Option>
          <Select.Option value="autoForSales">Up and Down</Select.Option>
          <Select.Option value="manual">Fixed bids</Select.Option>
        </Select>
      </Item>
      <div className={styles.commonInput}>
        <Item label="Top of search：" normalize={limitedInput} name="biddingPlacementTop" className={styles.topSearch}>
          <Input autoComplete="off" />
        </Item>
        <span className={styles.currency}>%</span>
      </div>
      <div className={styles.commonInput}>
        <Item label="Product page：" normalize={limitedInput} name="biddingPlacementProductPage" className={styles.productPage}>
          <Input autoComplete="off" />
        </Item>
        <span className={styles.currency}>%</span>
      </div>
    </div>

    {/* SP智能模式 */}
    <div className={classnames(
      styles.spCapacity,
      campaignType === 'sponsoredProducts' && pattern === 'ai' ? '' : 'none'
    )}>
      {/* <ProductSelect getSelectProduct={getSelectProduct}/> */}
    </div>
  </div>;
};

export default Campaign;

