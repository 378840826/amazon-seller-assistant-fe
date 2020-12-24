import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { CalendarOutlined, SwapRightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Moment } from 'moment/Moment';
import 'moment/locale/zh-cn';
import { storage } from '@/utils/utils';
import { getRangeDate } from '@/utils/huang';
import { list } from './selectList';
import {
  Input,
  Dropdown,
  Menu,
  DatePicker,
} from 'antd';


interface IProps {
  style?: React.CSSProperties;
  className?: string;
  width?: number|string; // 显示日期框的宽度
  storageKey?: string; // storageKey属性存在时会本地存储
  itemKey?: string; // 默认选中的key 
  change?: (dateInfo: DefinedCalendar.IChangeParams) => void; // 点击改变时才触发
  selectList?: DefinedCalendar.IDownListType[];
  index?: number; // ... 不想传下拉列表选项过来?.... 写在selectList.ts文件里吧 selectList优先级更高
}

interface IDownListType {
  text: string;
  key: string;
}
/**
 * 选中周/月/季时，会以${storageKey}_dc_${selectItemKey}做localStorage储存
 * 选中其它时，删除周/月/季的记录
 * 开始日期、结束日期保存在 storage.get(`${storageKey}_dc_dateRange`)
 * 保存选中项 storage.get(`${storageKey}_dc_itemKey`) 即downlist下拉列表 key的值
 * 
 * 如果选中的是 按周 / 月 / 季查看时, 下次打开时，拿选中的开始值放进去即可保证选中组件的默认值
 * 
 */
const DefinedCalendar: React.FC<IProps> = props => {
  const {
    storageKey,
    className,
    change,
    itemKey,
    selectList,
    index = 0,
  } = props;
  

  const [startDate, setStartDate] = useState<string>(''); // 开始日期
  const [endDate, setEndDate] = useState<string>(''); // 结束日期
  // 下拉列表选中内容，默认是 “最近7天”
  const [selectItemKey, setSelectItemKey] = useState<string>(
    itemKey || (storageKey ? storage.get(`${storageKey}_dc_itemKey`) : '') || '7'
  );

  // 周日历相关
  const [weekCalendar, setWeekCalendar] = useState<boolean>(false); // 周日历是否显示
  const [weekValue, setWeekValue] = useState<Moment | null>(null); // 清空、选中周
  
  // 月日历相关
  const [monthCalendar, setMonthCalendar] = useState<boolean>(false); // 月日历是否显示
  const [monehtValue, setMonthValue] = useState<Moment | null>(null); // 清空、选中月

  // 季相关
  const [quarterCalendar, setQuarterCalendar] = useState<boolean>(false); // 季日历是否显示
  const [quarterValue, setQuarterValue] = useState<Moment | null>(null); // 清空、选中季

  // 下拉列表选项
  const downlist = selectList || list[index];

  // 渲染初始化日期
  useEffect(() => {
    const { start, end } = getRangeDate(selectItemKey, false);

    // 本地记录并且是周、月、季时
    if (storageKey) {
      // 主要作用：不传默认key时，下次也能获取
      storage.set(`${storageKey}_dc_itemKey`, String(selectItemKey));

      if (selectItemKey === 'week' 
        || selectItemKey === 'month' 
        || selectItemKey === 'quarter'
      ) {
        const {
          startDate: start,
          endDate: end,
        } = storage.get(`${storageKey}_dc_dateRange`);
        setStartDate(start);
        setEndDate(end);
  
        selectItemKey === 'week' && setWeekValue(moment(start));
        selectItemKey === 'month' && setMonthValue(moment(start));
        selectItemKey === 'quarter' && setQuarterValue(moment(start));
        return;
      }

      storage.set(`${storageKey}_dc_dateRange`, {
        startDate: start,
        endDate: end,
      });
    } 
    setStartDate(start);
    setEndDate(end);
  }, [selectItemKey, storageKey]);

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
    case 'quarter': // 选择的是季查看
      setQuarterCalendar(true);
      break;
    default: // 最近N天
      setMonthValue(null as null); // 清空选中的月
      setWeekValue(null as null); // 清空选中的周
      setQuarterValue(null as null); // 清空选中的季
      obj = getRangeDate(key, false);
      setStartDate(obj.start);
      setEndDate(obj.end);
      setSelectItemKey(key);
      storageKey ? storage.set(`${storageKey}_dc_itemKey`, String(key)) : null;

      change ? change({
        dateStart: obj.start,
        dateEnd: obj.end,
        selectItemKey: key,
      }) : null;
    }
  };

  // 处理季/月/周的函数
  const handleWeebMonthQuarter = (type: string, date: Moment | null| Date) => {
    const { start, end } = getRangeDate(type, false, date as Date);
    setStartDate(start); // 页面开始日期
    setEndDate(end); // 页面结束日期
    setSelectItemKey(type); // 记录选中的下拉列表
    storage.set(`${storageKey}_dc_dateRange`, {
      startDate: start,
      endDate: end,
    });

    setMonthValue(null as null); // 清空选中的月
    setWeekValue(null as null); // 清空选中的周
    setQuarterValue(null as null); // 清空选中的季
    type === 'week' && setWeekValue(moment(start));
    type === 'month' && setMonthValue(moment(start));
    type === 'quarter' && setQuarterValue(moment(start));

    change ? change({
      dateStart: start,
      dateEnd: end,
      selectItemKey: type,
    }) : null;
  };

  // 周日历改变时
  const changeWeek = (date: Moment | null| Date) => {
    setWeekCalendar(!weekCalendar);
    handleWeebMonthQuarter('week', date);
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
    setWeekCalendar(false);
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
