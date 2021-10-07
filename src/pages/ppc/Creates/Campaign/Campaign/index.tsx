/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-06 09:46:56
 * 
 * 广告活动设置（第三步）
 */
import React, { useCallback, useState } from 'react';
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
  // Select,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import ProductSelect from '../../components/ProductSelect';
import { add, divide, times } from '@/utils/precisionNumber';

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

  const siteDatetime = momentTimezone().tz(timezone)?.format('YYYY-MM-DD HH:mm:ss'); // 站点时间
  const [startData, setStartDate] = useState<string>(moment(siteDatetime).format('YYYY-MM-DD HH:mm:ss')); // 广告活动的开始时间
  const [exampleChange, setExampleChange] = useState(0);

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

  // 示例，搜索结果顶部（首页） 和 商品页面
  const renderExample = useCallback((type: 'top' | 'page') => {
    // 示例的基础竞价，区分日本站
    const exampleBaseBid = marketplace === 'JP' ? 1000 : 0.75;
    const typeDict = {
      top: Number(form.getFieldValue('biddingPlacementTop')) || 0,
      page: Number(form.getFieldValue('biddingPlacementProductPage')) || 0,
    };
    const biddingStrategy = form.getFieldValue('biddingStrategy');
    const computed = times(exampleBaseBid, add(1, divide(typeDict[type], 100)));
    // 保留两位小数，第三位四舍五入。日本站除外
    const roundingOffComputed = marketplace === 'JP' ? computed : Math.round(computed * 100) / 100;
    const dynamicDict = {
      // 仅降低
      legacyForSales: <>动态竞价范围 {currency}0 - {currency}{roundingOffComputed}</>,
      // 提高和降低
      autoForSales: <>动态竞价范围 {currency}0 - {currency}{(roundingOffComputed * 2).toFixed(2)}</>,
    };
    return (
      <p>
        示例：对于此广告位，{currency}{exampleBaseBid} 竞价将
        {
          exampleBaseBid === computed
            ? `保持 ${currency}${exampleBaseBid} 不变。`
            : `为 ${currency}${roundingOffComputed}。`
        }
        { dynamicDict[biddingStrategy] }
      </p>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exampleChange]);

  return <div className={styles.campaignBox}>
    <Item
      label="广告活动名称："
      name="name"
      className={styles.name}
      validateTrigger={['onKeyUp', 'onBlur']}
      rules={[{
        required: true,
        validator: (_, value: string) => (
          !value || (value.trim().length === 0) ? Promise.reject() : Promise.resolve()
        ),
        message: '广告活动名称不能为空！',
      }]}
    >
      <Input className={styles.input} placeholder="请输入广告活动名称" autoComplete="off" maxLength={128} />
    </Item>
    <Item
      label={<>{pattern === 'ai' ? '总' : '日'}预算：</>}
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
        validator(_, value) {
          const min = marketplace === 'JP' ? 100 : 1;
          const max = marketplace === 'JP' ? 2100000000 : 1000000;
          if (isNaN(value) || value < min) {
            return Promise.reject(`广告活动每日预算至少${currency}${min}`);
          }

          if (value > max) {
            return Promise.reject(`广告活动每日预算不能超过${currency}${max}`);
          }
          return Promise.resolve();
        },
      }]}
    >
      <Input
        className={styles.dailyBudget}
        placeholder={`至少${marketplace === 'JP' ? 200 : 1}`}
        autoComplete="off"
        maxLength={12}
        prefix={currency}
      />
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
        <Radio.Group>
          <Radio value="auto" className={styles.putMathodAuto}>自动</Radio>
          <Radio value="manual">手动</Radio>
        </Radio.Group>
      </Item>
      {/* SD的投放方式 */}
      <Item name={['outer', 'sdPutMathod']} label="投放方式：" initialValue="T00020" className={classnames(
        styles.putMathod,
        campaignType === 'sd' ? '' : 'none'
      )}>
        <Radio.Group>
          <Radio value="T00030" disabled className={styles.putMathodAuto}><span title="功能开发中">受众</span></Radio>
          <Radio value="T00020">分类/商品</Radio>
        </Radio.Group>
      </Item>
      <Item label="竞价策略：" name="biddingStrategy" initialValue="autoForSales" className={styles.bidding}>
        <Radio.Group onChange={() => setExampleChange(exampleChange + 1)}>
          <Radio value="legacyForSales">动态竞价 - 仅降低</Radio>
          <p>当您的广告不太可能带来销售时，我们将实时降低您的竞价。</p>
          <Radio value="autoForSales">动态竞价 - 提高和降低</Radio>
          <p>当您的广告很有可能带来销售时，我们将实时提高您的竞价（最高可达 100%），并在您的广告不太可能带来销售时降低您的竞价。</p>
          <Radio value="manual">固定竞价</Radio>
          <p>我们将使用您的确切竞价和您设置的任何手动调整，而不会根据售出可能性对您的竞价进行更改。</p>
        </Radio.Group>
      </Item>
      <div className={styles.commonInput}>
        <p>除了竞价策略外，您可以将竞价最多提高 900%</p>
        <Item
          label={<>搜索结果顶部<span className={styles.secondary}>（首页）</span></>}
          initialValue={20}
          normalize={limitedInput}
          name="biddingPlacementTop"
          className={styles.topSearch}
          rules={[{
            validator: (_, value) => value > 900 ? Promise.reject() : Promise.resolve(),
            message: '最大值不能超过900',
          }]}
        >
          <Input
            autoComplete="off"
            maxLength={3}
            suffix="%"
            onChange={() => setExampleChange(exampleChange + 1)}
          />
        </Item>
        { renderExample('top') }
      </div>
      <div className={styles.commonInput}>
        <Item
          label="商品页面"
          initialValue={0}
          normalize={limitedInput}
          name="biddingPlacementProductPage"
          className={styles.productPage}
          rules={[{
            validator: (_, value) => value > 900 ? Promise.reject() : Promise.resolve(),
            message: '最大值不能超过900',
          }]}
        >
          <Input
            autoComplete="off"
            maxLength={3}
            suffix="%"
            onChange={() => setExampleChange(exampleChange + 1)}
          />
        </Item>
        { renderExample('page') }
      </div>
    </div>

    {/* SP智能模式 */}
    <div className={classnames(
      styles.spCapacity,
      campaignType === 'sponsoredProducts' && pattern === 'ai' ? '' : 'none'
    )}>
      {campaignType === 'sponsoredProducts' && pattern === 'ai' ? <ProductSelect getSelectProduct={data => console.log(data)}/> : ''}
    </div>
  </div>;
};

export default Campaign;

