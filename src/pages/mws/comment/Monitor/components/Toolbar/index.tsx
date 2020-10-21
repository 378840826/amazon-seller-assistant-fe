import React, { useState, useEffect } from 'react';
import styles from './index.less';
import zhCN from 'antd/es/locale/zh_CN';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { RadioChangeEvent } from 'antd/lib/radio';
import moment from 'moment';
import { Moment } from 'moment/moment';
import { useSelector } from 'umi';
import { getRangeDate } from '@/utils/huang';

import {
  Checkbox, 
  Input, 
  ConfigProvider, 
  DatePicker,
  Radio,
  Button,
} from 'antd';

// 星级
const options = [
  { label: '1星', value: 1 },
  { label: '2星', value: 2 },
  { label: '3星', value: 3 },
  { label: '4星', value: 4 },
  { label: '5星', value: 5 },
];

// 状态
const statusList = [
  {
    text: '全部',
    value: 'all',
  },
  {
    text: '未处理',
    value: 'non',
  },
  {
    text: '已处理',
    value: 'done',
  },
];

let shopCount = 0; // 店铺切换的条件
// 给父组件的数据
const fields = {} as CommectMonitor.IMonitorToolBarFieldsType; 
const ToolBar: React.FC<CommectMonitor.IMonitorToolProps> = (props) => {
  const [radioStatus, setRadioStatus] = useState<string>(statusList[0].value); // radio 状态
  const [radioStar, setRadioStar] = useState<number[]>([
    options[0].value, 
    options[1].value,
    options[2].value,
  ]); // 星级
  const [asin, setAsin] = useState<string>(props.asin || ''); // asin
  const [scopeMin, setScopeMin] = useState<string>(''); // 最小评分
  const [scopeMax, setScopeMax] = useState<string>(''); // 最大评分
  // const [dateStart, setDateStart] = useState<string>(''); // 开始日期
  // const [dateEnd, setDateEnd] = useState<string>(''); // 结束日期
  const [reviewerName, setReviewerName] = useState<string>(''); // 笔名
  const [reviewsNumMin, setReviewsNumMin] = useState<string>(''); // reviews起始值
  const [reviewsNumMax, setReviewsNumMax] = useState<string>(''); // reviews结束值
  const current = useSelector((state: CommectMonitor.IGlobalType) => state.global.shop.current);
  const { start, end } = getRangeDate(30);
  const [datepickerValue, setDatepickerValue] = useState<Moment[]>([start, end]);
  const [reply, setReply] = useState<string>('all'); // 回复

  // 收集请求所需数据
  const gather = (param = {}, type = false) => {
    fields.stars = radioStar; // 星级
    fields.status = radioStatus; // 状态
    fields.asin = asin;
    fields.scopeMin = scopeMin; // 最小评分
    fields.scopeMax = scopeMax; // 最大评分
    fields.dateStart = datepickerValue[0].format('YYYY-MM-DD'); // 开始日期
    fields.dateEnd = datepickerValue[1].format('YYYY-MM-DD'); // 结束日期
    fields.reviewerName = reviewerName; // 笔名
    fields.reviewsNumMin = reviewsNumMin; // review起始值
    fields.reviewsNumMax = reviewsNumMax; // review结束值
    fields.replyStatus = reply; // review结束值

    Object.assign(fields, param);

    if (type) {
      props.handleToolbar(fields, 'download');
    } else {
      props.handleToolbar(fields, '');
    }
  };

  // 星级筛选
  const changeStar = (list: CheckboxValueType[]) => {
    setRadioStar(list as []);
    gather({ stars: list });
  };

  // 店铺切换时、回到初始状态
  useEffect(() => {
    if (shopCount > 1) {
      const list = [
        options[0].value, 
        options[1].value,
        options[2].value,
      ];
      setRadioStar(list);
      setAsin('');
      setScopeMin('');
      setScopeMax('');
      setDatepickerValue([
        moment().subtract(29, 'days'),
        moment(),
      ]);
      setReviewsNumMin('');
      setReviewsNumMax('');
    } else {
      shopCount++;
    }
  }, [current]);

  // asin输入框
  const changeAsin = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setAsin(value);
  };

  // 评分处理
  const starRange = (value: string): string => {
    value = value.replace(/[^\d\\.]/g, '');
    //只保留第一个. 清除多余的
    value = value.replace(/\.{2,}/g, '.');
    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    //只能输入两个小数
    value = value.replace(/^(\\-)*(\d+)\.(\d).*$/, '$1$2.$3');
    
    //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02
    if (value.indexOf('.') < 0 && value !== '') {
      value = parseFloat(value).toString();
    }
    
    // 第一位不能为小数点
    if (value.indexOf('.') === 0) {
      value = '0.';
    }

    // 大于 5 时
    if (Number(value) > 5) {
      value = String(5);
    }
    return value;
  };

  // 评分 min输入框
  const copeMinChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    const newValue = starRange(value);
    setScopeMin(newValue);
  };

  // 评分 max输入框
  const copeMaxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    const newValue = starRange(value);
    setScopeMax(newValue);
  };

  // 更改radio 状态
  const handleStatus = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setRadioStatus(value);
    gather({ status: value });
  };

  // 笔名
  const changeReviewerName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = e.target.value;
    setReviewerName(value);
  };

  // 输入框的回车
  const InputDownEnter = () => {
    gather();
  };

  // 点击查询
  const clickSearchBtn = () => {
    gather();
  };

  // 下载
  const clickDownload = () => {
    gather({}, true);
  };

  // review数量  min
  const changeReviewMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const pattern = /[^\d]/;
    value = value.replace(pattern, '');
    setReviewsNumMin(value);
  };

  // review数量  max
  const changeReviewMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const pattern = /[^\d]/;
    value = value.replace(pattern, '');
    setReviewsNumMax(value);
  };

  // 回复的改变
  const changReply = (e: RadioChangeEvent) => {
    setReply(e.target.value);
  };

  const { start: start7, end: end7 } = getRangeDate(7);
  const { start: start30, end: end30 } = getRangeDate(30);
  const { start: start60, end: end60 } = getRangeDate(60);
  const { start: start90, end: end90 } = getRangeDate(90);
  const { start: start180, end: end180 } = getRangeDate(180);
  const { start: start365, end: end365 } = getRangeDate(365);
  const rangeList = {
    '最近7天': [start7, end7],
    '最近30天': [start30, end30],
    '最近60天': [start60, end60],
    '最近90天': [start90, end90],
    '最近180天': [start180, end180],
    '最近365天': [start365, end365],
  };
  
  // 日历配置
  // eslint-disable-next-line
  const RangePicker: any = {
    ranges: rangeList,
    value: datepickerValue,
    defaultValue: datepickerValue,
    allowClear: false,
    onChange(dates: Moment[]): void {
      let dateStart = '';
      let dateEnd = '';
      setDatepickerValue(dates);
      dateStart = dates[0].format('YYYY-MM-DD');
      dateEnd = dates[1].format('YYYY-MM-DD');
      gather({ dateStart, dateEnd });
    },
  };

  return (
    <header className={` ${styles.monitor_toolbar} monitor-list-toolbar`}>
      <div className={styles.layout_one_div}>
        <span className={styles.text}>星级：</span>
        <Checkbox.Group 
          options={options} 
          value={radioStar}
          onChange={changeStar} />
      </div>

      <div className={styles.layout_three_div}>
        <span className={styles.text}>回复：</span>
        <Radio.Group onChange={changReply} value={reply}>
          <Radio value="all">全部</Radio>
          <Radio value="yes" className={styles.other}>有</Radio>
          <Radio value="no" className={styles.other}>无</Radio>
        </Radio.Group>
      </div>

      <div className={styles.layout_seven_div}>
        <span className={styles.text}>用户笔名：</span>
        <Input
          value={reviewerName}
          onChange={changeReviewerName}
          onPressEnter={InputDownEnter}
        />
      </div>

      <div className={styles.layout_five_div}>
        <span className={styles.text}>日期：</span>
        <ConfigProvider locale={zhCN}>
          <DatePicker.RangePicker 
            {...RangePicker} 
            dropdownClassName="h-range-picker" 
            className="h-range-picker"
          />
        </ConfigProvider>
      </div>

      <div className={styles.layout_two_div}>
        <span className={styles.text}>ASIN：</span>
        <Input 
          value={asin} 
          onChange={changeAsin}
          onPressEnter={InputDownEnter}
          maxLength={10}
        />
      </div>

      <div className={styles.layout_four_div}>
        <span className={styles.text}>评分：</span>
        <Input
          placeholder="min"
          value={scopeMin}
          onChange={copeMinChange}
          onPressEnter={InputDownEnter}
        />
        <span className={styles.line}></span>
        <Input 
          placeholder="max"
          value={scopeMax}
          onChange={copeMaxChange}
          onPressEnter={InputDownEnter}
        />
      </div>

      <div className={styles.layout_eight_div}>
        <span className={styles.text}>Review：</span>
        <Input
          value={reviewsNumMin}
          onChange={changeReviewMin}
          onPressEnter={InputDownEnter}
        />
        <span className={styles.line}></span>
        <Input
          value={reviewsNumMax}
          onChange={ changeReviewMax }
          onPressEnter={InputDownEnter}
        />
      </div>

      <div className={styles.layout_six_div}>
        <span className={styles.text}>状态：</span>
        <Radio.Group onChange={handleStatus} value={radioStatus}>
          {statusList.map((item, index) => {
            return <Radio value={item.value} key={index}>{item.text}</Radio>;
          })}
        </Radio.Group>
      </div>
    
      {/* 占位 */}
      <div className={styles.empty}></div>
      <div className={styles.empty}></div>
      <div className={styles.empty}></div>
      
      <div className={styles.btns}>
        <Button type="primary" onClick={clickSearchBtn}>查询</Button>
        <Button onClick={clickDownload}>下载</Button>
      </div>
    </header>
  );
};

export default ToolBar;
