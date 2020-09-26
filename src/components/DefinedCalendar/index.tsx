import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { CalendarOutlined, SwapRightOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/locale/zh_CN';
import { Moment } from 'moment/Moment';
import 'moment/locale/zh-cn';
import { storage } from '@/utils/utils';
import { getRangeDate } from '@/utils/huang';
import {
  Input,
  Dropdown,
  Menu,
  DatePicker,
  ConfigProvider,
} from 'antd';


interface IProps {
  style?: React.CSSProperties;
  className?: string;
  width?: number|string; // 显示日期框的宽度
  storageKey?: string; // storageKey属性存在时会本地存储
  checkedItem?: string; // 默认选中的key 
  cb?: (dateInfo: DefinedCalendar.IChangeParams) => void; // 初始化触发、改变时也会触发
  change?: (dateInfo: DefinedCalendar.IChangeParams) => void; // 点击改变时才触发
}

interface IDownListType {
  text: string;
  key: string;
}
/**
 * 选中周/月时，会以${storageKey}_${selectItem}做localStorage储存
 * 选中其它时，删除周/月的记录
 * 日期保存在 storage.get(`${storageKey}_date`)
 * 再保存一个值 本地保存选中项  storageKey存在时保存  storage.get(`${storageKey}_date_checked`)
 */
const DefinedCalendar: React.FC<IProps> = (props) => {
  const {
    storageKey,
    className,
    cb,
    change,
    checkedItem,
  } = props;

  const [startDate, setStartDate] = useState<string>(''); // 开始日期
  const [endDate, setEndDate] = useState<string>(''); // 结束日期
  const [selectItem, setSelectItem] = useState<string>(checkedItem || '7');// 下拉列表选中内容，默认是 “最近7天”

  // 周日历相关
  const [weekCalendar, setWeekCalendar] = useState<boolean>(false); // 周日历是否显示
  const [weekValue, setWeekValue] = useState<Moment | null>(null); // 目前只用来做清空作用
  
  // 月日历相关
  const [monthCalendar, setMonthCalendar] = useState<boolean>(false); // 月日历是否显示
  const [monehtValue, setMonthValue] = useState<Moment | null>(null); // 目前只用来做清空作用

  // 下拉列表选项
  const downlist: IDownListType[] = [
    {
      text: '按月查看',
      key: 'month',
    },
    {
      text: '按周查看',
      key: 'week',
    },
    {
      text: '最近7天',
      key: '7',
    },
    {
      text: '最近30天',
      key: '30',
    },
    {
      text: '最近60天',
      key: '60',
    },
    {
      text: '最近90天',
      key: '90',
    },
    {
      text: '最近180天',
      key: '180',
    },
    {
      text: '最近365天',
      key: '365',
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
    // 本地储存
    if (storageKey) {
      storage.set(`${storageKey}_date_checked`, selectItem);

      if (storage.get(storageKey) === '') {
        // 首次进入页面时初始化值
        storage.set(storageKey, selectItem);
        const { start, end } = getRangeDate(selectItem);
        setStartDate(start);
        setEndDate(end);
        return;
      }
      // 保存选中项
      setSelectItem(String(storage.get(storageKey)));

      // 如果选中的是按月、按周查看、拿出选中的日期
      if (selectItem === 'week' || selectItem === 'month') {
        const strDate = storage.get(`${storageKey}_${selectItem}`);
        const arr: string[] = strDate.split('至');
        setStartDate(arr[0]);
        setEndDate(arr[1]);
      } else {
        const { start, end } = getRangeDate(selectItem);
        setStartDate(start);
        setEndDate(end);
      }
    } else {
      const { start, end } = getRangeDate(selectItem);
      setStartDate(start);
      setEndDate(end);
    }
  }, [selectItem, storageKey]);

  useEffect(() => {
    if (storageKey && startDate && endDate) {
      storage.set(`${storageKey}_date`, {
        startDate,
        endDate,
      });
    }

    if (cb && startDate && endDate) {
      cb({
        dateStart: startDate,
        dateEnd: endDate,
        selectItem,
      });
    }
  }, [startDate, endDate, cb, storageKey, selectItem]);

  // 改变下拉列表时
  const changeSelect = (current: any) => { // eslint-disable-line 
    const key = current.key;
    let obj = {} as { start: string; end: string } ;

    switch (key) {
    case 'month': // 选择的是月查看
      setMonthCalendar(true);
      break;
    case 'week': // 选择的是周查看
      setWeekCalendar(true);
      break;
    default: // 最近N天
      setMonthValue(null as null); // 清空选中的月
      setWeekValue(null as null); // 清空选中的周
      obj = getRangeDate(key);
      setStartDate(obj.start);
      setEndDate(obj.end);
      setSelectItem(key);
      storageKey ? storage.set(storageKey, key) : null;
      storage.remove(`${storageKey}_${selectItem}`);
      change ? change({
        dateStart: obj.start,
        dateEnd: obj.end,
        selectItem: key,
      }) : null;
    }
  };

  // 处理月/周的函数
  const handleWeebMonth = (type: string, date: Moment | null| Date) => {
    const { start, end } = getRangeDate(type, date as Date);
    setStartDate(start); // 页面开始日期
    setEndDate(end); // 页面结束日期
    setSelectItem(type); // 记录选中的下拉列表
    storageKey ? storage.set(storageKey, type) : null; // 是否本地储存选择项
    storage.set(`${storageKey}_${type}`, `${start}至${end}`); // 存在本地，以便读取
    change ? change({
      dateStart: start,
      dateEnd: end,
      selectItem: type,
    }) : null;
  };

  // 周日历改变时
  const changeWeek = (date: Moment | null| Date) => {
    setWeekCalendar(!weekCalendar);
    handleWeebMonth('week', date);
    storage.remove(`${storageKey}_month`);
    setWeekValue(date as Moment);
  };

  // 月日历改变时
  const changeMonth = (date: Moment | null | Date) => {
    setMonthCalendar(!monthCalendar);
    handleWeebMonth('month', date);
    storage.remove(`${storageKey}_week`);
    setMonthValue(date as Moment);
  };

  // input获取焦点时 隐藏月/周的日期
  const inputFocus = () => {
    setWeekCalendar(false);
    setMonthCalendar(false);
  };

  const menu = (
    <Menu onClick={changeSelect} selectedKeys={[selectItem]}> 
      {
        downlist.map((item: IDownListType) => {
          return <Menu.Item key={item.key}>{item.text}</Menu.Item>;
        })
      }
    </Menu>
  );
  return (
    <div style={ props.style } className={`${styles.definedCalendar} ${className}`}>
      <ConfigProvider locale={zhCN}>
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
          onChange={changeWeek} 
          picker="week" 
          open={weekCalendar}
          value={weekValue}
          className={styles.weekCalendar}
        />
        <DatePicker 
          onChange={changeMonth} 
          picker="month" 
          open={monthCalendar}
          value={monehtValue}
          className={styles.weekCalendar}
        />
      </ConfigProvider>
    </div>
  );
};

export default DefinedCalendar;
