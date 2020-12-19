import React from 'react';
import { Input, Radio, DatePicker } from 'antd';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';
import { RadioChangeEvent } from 'antd/lib/radio';
import moment from 'moment';
import { Moment } from 'moment/moment';
const { Search } = Input;
const checkboxList = [
  { name: '全部', key: 'all' },
  { name: '亚马逊', key: 'amazon' },
  { name: '买家', key: 'buyer' },
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
}
const SearchHeader: React.FC<ISearchHeader> = ({ 
  tableLoading, 
  request,
  dateStart,
  dateEnd,
  sourceType,
}) => {
  const dateRange = {
    dateStart,
    dateEnd,
  };
  const beforeRequest = (param: API.IParams) => {
    request({
      ...param,
      size: 20,
      current: 1,
    });
  };
  
  //1.切换radio
  const changeRadio = (e: RadioChangeEvent) => {
    const sourceKey = e.target.value;
    beforeRequest({ type: sourceKey });
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
      dateRange.dateStart = dates[0].format('YYYY-MM-DD');
      dateRange.dateEnd = dates[1].format('YYYY-MM-DD');
    },
    onOpenChange: (open: boolean) => {
      if (dateRange.dateStart === dateStart && dateRange.dateEnd === dateEnd) {
        return; 
      }
      if (!open){
        beforeRequest({ ...dateRange });
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
          placeholder="订单编号、标题、ASIN、SKU、收件人邮箱" 
          onSearch={(value, event) => {
            if (!event?.['__proto__']?.type){
              onSearch(value);
            }
          }}
          disabled={tableLoading}
          enterButton={<Iconfont type="icon-sousuo" className={styles.icon_sousuo}/>} />
      </div>
      <div className={styles.source}>
        <span className={styles.font_source}>邮件来源：</span>
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
      <div className={styles.calendar}>
        <RangePicker 
          {...RangePickerProps}
        />
      </div>
    </div>
  );
};
export default SearchHeader;
