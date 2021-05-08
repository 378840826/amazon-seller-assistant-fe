import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { CalendarOutlined, SwapRightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Moment } from 'moment/Moment';
import 'moment/locale/zh-cn';
import { getRangeDate } from '@/utils/huang';
import {
  Input,
  Dropdown,
  Menu,
  DatePicker,
} from 'antd';


interface IProps {
  style?: React.CSSProperties;
  className?: string;
  change?: (dateInfo: DefinedCalendar.IChangeParams) => void; // 点击改变时才触发
}

interface IDownListType {
  text: string;
  key: string;
}

const DefinedCalendar: React.FC<IProps> = props => {
  const {
    className,
    change,
  } = props;
  

  const [startDate, setStartDate] = useState<string>(''); // 开始日期
  const [endDate, setEndDate] = useState<string>(''); // 结束日期
  const [selectItemKey, setSelectItemKey] = useState<string>('month'); // 选中日期

  // 月日历相关
  const [monthCalendar, setMonthCalendar] = useState<boolean>(false); // 月日历是否显示
  const [monehtValue, setMonthValue] = useState<Moment | null>(moment()); // 清空、选中月

  // 季相关
  const [quarterCalendar, setQuarterCalendar] = useState<boolean>(false); // 季日历是否显示
  const [quarterValue, setQuarterValue] = useState<Moment | null>(null); // 清空、选中季

  // 下拉列表选项
  const downlist = [
    {
      text: '按月查看',
      key: 'month',
    },
    {
      text: '按季查看',
      key: 'quarter',
    },
    {
      text: '今年',
      key: 'year',
    },
    {
      text: '去年',
      key: 'lastYear',
    },
  ];
  

  // 渲染初始化日期
  useEffect(() => {
    const { start, end } = getRangeDate(selectItemKey, false);
    setStartDate(start);
    setEndDate(end);
  }, [selectItemKey]);

  // 改变下拉列表时
  const changeSelect = (current: any) => { // eslint-disable-line 
    const key = current.key;
    const { start, end } = getRangeDate(key, false);
    

    switch (key) {
    case 'month': // 选择的是月查看
      setMonthCalendar(true);
      break;
    case 'quarter': // 选择的是季查看
      setQuarterCalendar(true);
      break;
    default: 
      setStartDate(start); // 页面开始日期
      setEndDate(end); // 页面结束日期
      setSelectItemKey(String(key)); // 记录选中的下拉列表
      change ? change({
        dateStart: start,
        dateEnd: end,
        selectItemKey: String(key),
      }) : null;
    }
  };

  // 处理季/月/周的函数
  const handleWeebMonthQuarter = (type: moment.unitOfTime.StartOf, date: Moment | null| Date) => {
    const start = moment(date).startOf(type).format('YYYY-MM-DD');
    const end = moment(date).endOf(type).format('YYYY-MM-DD');
    setStartDate(start); // 页面开始日期
    setEndDate(end); // 页面结束日期
    setSelectItemKey(String(type)); // 记录选中的下拉列表

    setMonthValue(null as null); // 清空选中的月
    setQuarterValue(null as null); // 清空选中的季
    type === 'month' && setMonthValue(moment(start));
    type === 'quarter' && setQuarterValue(moment(start));

    change ? change({
      dateStart: start,
      dateEnd: end,
      selectItemKey: String(type),
    }) : null;
  };


  // 月日历改变时
  const changeMonth = (date: Moment | null | Date) => {
    setMonthCalendar(!monthCalendar);
    handleWeebMonthQuarter('month', date);
  };

  // 季日历改变时
  const changeQuarter = (date: Moment | null | Date) => {
    setQuarterCalendar(!quarterCalendar);
    handleWeebMonthQuarter('quarter', date);
  };

  // input获取焦点时 隐藏月/周的日期
  const inputFocus = () => {
    setMonthCalendar(false);
    setQuarterCalendar(false);
  };

  const menu = (
    <Menu onClick={changeSelect} selectedKeys={[String(selectItemKey)]}> 
      {
        downlist.map((item: IDownListType) => {
          return <Menu.Item 
            key={String(item.key)} 
            className={styles.calendarItem}
          >
            {item.text}
          </Menu.Item>;
        })
      }
    </Menu>
  );
  return (
    <div style={ props.style } className={`${styles.definedCalendar} ${className}`}>
      <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
        <div className={`${styles.showDate} clearfix`}>
          <Input className={styles.input} readOnly onFocus={inputFocus} />
          <i className={`${styles.icon} ${styles.calendarIcon}`}>
            <CalendarOutlined />
          </i>
          <i className={`${styles.icon} ${styles.arrow}`}>
            <SwapRightOutlined />
          </i>
          <div className={styles.startDate}>{startDate}</div>
          <div className={styles.endDate}>{endDate}</div>
          <div className={styles.downlist}></div>
        </div>
      </Dropdown>
      <DatePicker 
        onChange={changeMonth} 
        picker="month" 
        open={monthCalendar}
        value={monehtValue}
        className={styles.weekCalendar}
      />
      <DatePicker
        onChange={changeQuarter} 
        picker="quarter" 
        open={quarterCalendar}
        value={quarterValue}
        className={styles.quarterCalendar}
      />
    </div>
  );
};

export default DefinedCalendar;
