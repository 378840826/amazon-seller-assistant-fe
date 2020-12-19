import React from 'react';
import { Input, Radio, DatePicker } from 'antd';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';
import { RadioChangeEvent } from 'antd/lib/radio';
import moment from 'moment';
import { Moment } from 'moment/moment';
import classnames from 'classnames';
const { Search } = Input;
const checkboxList = [
  { name: '全部', key: 'all' },
  { name: '亚马逊', key: 'amazon' },
  { name: '买家', key: 'buyer' },
];
const sendTypeList = [
  { name: '全部', key: 'all' },
  { name: '手动', key: 'manual' },
  { name: '自动', key: 'automatic' },
];
const rangeList = {
  '最近7天': [
    moment().subtract(6, 'day'),
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
  '最近90天': [
    moment().subtract(89, 'day'),
    moment().endOf('day'),
  ],
  '最近180天': [
    moment().subtract(179, 'day'),
    moment().endOf('day'),
  ],
  '最近365天': [
    moment().subtract(365, 'day'),
    moment().endOf('day'),
  ],
};
const { RangePicker } = DatePicker;

interface ISearchHeader{
  tableLoading: boolean;
  dateStart: string;
  dateEnd: string;
  request: (params: API.IParams) => void;
  sourceType: string;
  sendType: string;
}
const SearchHeader: React.FC<ISearchHeader> = ({ 
  tableLoading, 
  request,
  dateStart,
  dateEnd,
  sourceType,
  sendType,
}) => {
 
  const beforeRequest = (param: API.IParams) => {
    request({
      ...param,
      size: 20,
      current: 1,
    });
  };
  const rangeDate = {
    dateStart,
    dateEnd,
  };
  
  //1.切换radio
  const changeRadio = (e: RadioChangeEvent) => {
    const sourceKey = e.target.value;
    beforeRequest({ type: sourceKey });
  };

  //切换发送方式
  const changeSendType = (e: RadioChangeEvent) => {
    const sourceKey = e.target.value;
    beforeRequest({ sendType: sourceKey });
  };

  //2.搜索
  const onSearch = (value: string) => {
    beforeRequest({ searchContent: value });
  };

  //3.日历
  const RangePickerProps: API.IParams = {
    disabled: tableLoading,
    ranges: rangeList,
    defaultValue: [moment(dateStart), moment(dateEnd)],
    onChange: (dates: Moment[]): void => {
      rangeDate.dateStart = dates[0].format('YYYY-MM-DD');
      rangeDate.dateEnd = dates[1].format('YYYY-MM-DD');
    },
    onOpenChange: (open: boolean) => {
      if (rangeDate.dateStart === dateStart && rangeDate.dateEnd === dateEnd) {
        return; 
      }
      if (!open){
        beforeRequest({ ...rangeDate });
      }
    },
  };
  return (
    <div className={[styles.search_header_container, 'clearfix'].join(' ')}>
      <div className={styles.search_container}>
        <Search 
          size="middle" 
          allowClear
          className="__search_input"
          placeholder="订单编号、标题、ASIN、SKU、发件人邮箱" 
          onSearch={(value, event) => {
            if (!event?.['__proto__']?.type){
              onSearch(value);
            }
          }}
          disabled={tableLoading}
          enterButton={<Iconfont type="icon-sousuo" className={styles.icon_sousuo}/>} />
      </div>
      <div className={classnames(styles.source, styles.source1)}>
        <span className={styles.font_source}>邮件去向：</span>
        <Radio.Group 
          onChange={changeRadio} 
          defaultValue={sourceType}
          disabled={tableLoading}
        >
          {
            checkboxList.map((item) => {
              return (
                <Radio key={item.key} value={item.key}>{item.name}</Radio>
              );
            })
          }
        </Radio.Group>
      </div>
      <div className={classnames(styles.source, styles.source2)}>
        <span className={styles.font_source}>发送方式：</span>
        <Radio.Group 
          onChange={changeSendType} 
          defaultValue={sendType}
          disabled={tableLoading}
        >
          {
            sendTypeList.map((item) => {
              return (
                <Radio key={item.key} value={item.key}>{item.name}</Radio>
              );
            })
          }
        </Radio.Group>
      </div>
      <div className={styles.calendar}>
        <RangePicker 
          {...RangePickerProps}
        />
      </div>
    </div>
  );
};
export default SearchHeader;
