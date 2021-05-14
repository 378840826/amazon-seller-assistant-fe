import React, { useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import {
  Form,
  Switch,
  Input,
  DatePicker,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import ProductSelect from '../../components/ProductSelect';
import TimeSelectTable, { ITimingInitValueType } from '../../components/TimeSelectBox';
import { useSelector } from 'umi';
import SpAuto from './SpAuto';
import SPManual from './SPManual';
import moment, { Moment } from 'moment';
import momentTimezone from 'moment-timezone';

const { Item } = Form;
interface IProps {
  autoGroupBidType: string; // 自动广告组 
  putMathod: CreateCampaign.putMathod; // 广告活动的投放方式 自动/手动
  form: FormInstance;
  stepIndex: number;
  campaignType: CreateCampaign.ICampaignType;
  getTimingData: (values: ITimingInitValueType) => void;
}

const Group: React.FC<IProps> = props => {
  const { autoGroupBidType, putMathod, form, stepIndex, getTimingData, campaignType } = props;
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  
  // base
  let { currency = '$', marketplace, timezone, id } = currentShop;
  marketplace = 'US';
  currency = '$';
  timezone = 'Asia/Shanghai';
  id = '2';
  const siteDatetime = momentTimezone({ hour: 0, minute: 0, second: 0 }).tz(timezone).format('YYYY-MM-DD HH:mm:ss'); // 站点时间
  const [startDate, setStartDate] = useState<string>(moment().format('YYYY-MM-DD HH:mm:ss')); // 广告活动的开始时间

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

  return <div className={styles.autogroupBox}>
    <Item 
      validateTrigger={['onKeyUp', 'onBlur']}
      label="广告组名称："
      name="name"
      className={styles.name}
      rules={[{
        required: true,
        min: 1,
        max: 256,
        message: '广告组名称长度不能为0或大于256位！',
      }]}>
      <Input maxLength={256}/>
    </Item>
    <div className={styles.product}>
      {stepIndex === 3 ? <ProductSelect /> : ''}
    </div>
    <div className={classnames(campaignType === 'sponsoredProducts' && putMathod === 'auto' ? '' : 'none')}>
      <SpAuto currency={currency} autoGroupBidType={autoGroupBidType} marketplace={marketplace}/>
    </div>
    
    <div className={classnames(['manual', 'classProduct'].includes(putMathod) ? '' : 'none')}>
      <SPManual 
        form={form}
        currency={currency}
        marketplace={marketplace}
        storeId={id}
        putMathod={putMathod}
      />
    </div>
    
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
          disabledDate={current => current && current < moment(startDate)}
          className={styles.date}
        />
      </Item>
    </div>
  
    <div className={styles.timing}>
      <Item name="switch" label="时间：" className={styles.switch} valuePropName="checked">
        <Switch className="h-switch"/>
      </Item>
      <TimeSelectTable getValues={v => getTimingData(v)} />
    </div>
  </div>;
};

export default Group;
