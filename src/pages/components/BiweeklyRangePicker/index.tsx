/**
 * 带双周范围选择的日期范围选择器
 *  未改变 antd DatePicker 组件逻辑，只是用 css 表现出双周选择的样式，在 onChange 时修改日期为双周
 *  选中值存储在 localStorage 中， key 是 props 中的 localStorageKey， 格式为 IChangeDates
 */
import React, { useState, useEffect } from 'react';
import { CalendarOutlined, SwapRightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Moment } from 'moment/Moment';
import { storage } from '@/utils/utils';
import { getRangeDate } from '@/utils/huang';
import { list } from './selectList';
import { Input, Dropdown, Menu, DatePicker } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

export interface IChangeDates {
  startDate: string; 
  endDate: string; 
  selectedKey: string;
}

interface IDownListType {
  text: string;
  key: string | number;
}

interface IProps {
  containerClassName?: string;
  width?: number|string;
  // 本地存储的 key
  localStorageKey?: string;
  // 下拉菜单默认选中的key 
  defaultSelectedKey?: string;
  // 日期改变时的回调
  onChange: (dates: IChangeDates) => void;
  /** IDownListType 中 key 的取值范围为 getRangeDate 的参数 query 的范围 */
  selectList?: IDownListType[];
}

// 日期范围选择器的范围选择类型 周/双周/月/季
const pickerTypes = ['week', 'biweekly', 'month', 'quarter'];

const DefinedCalendar: React.FC<IProps> = props => {
  const {
    localStorageKey,
    containerClassName,
    onChange,
    defaultSelectedKey,
    selectList,
  } = props;

  // 下拉列表选中项(值范围为 selectList 中的 key)，缺省值为 7 (最近7天) 
  const [selectedKey, setSelectedKey] = useState<string>(defaultSelectedKey || '7');
  // 显示的日期范围
  const [dateRange, setDateRange] = useState(['', '']);
  // 选择器类型 date | week | month | quarter | year | biweekly(自定义的)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pickerType, setPickerType] = useState<any>('date');
  // 是否打开日期选择器
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  // 下拉列表选项
  const downlist = selectList || list || [];
  
  // 初始化
  useEffect(() => {
    const storageInfo = localStorageKey && storage.get(localStorageKey);
    // 要求记住选择，并且本地已经有历史记录
    if (storageInfo) {
      const { startDate, endDate, selectedKey } = storageInfo;
      setDateRange([startDate, endDate]);
      setSelectedKey(selectedKey);
      pickerTypes.includes(selectedKey) && setPickerType(selectedKey);
    } else {
      // 不要求记住选择或没有历史记录
      const { start, end } = getRangeDate(selectedKey, false);
      setDateRange([start, end]);
      // 要求记住选择，但是还没有历史记录，记录默认值
      if (localStorageKey) {
        storage.set(localStorageKey, {
          startDate: start,
          endDate: end,
          selectedKey,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 不可用日期
  function disabledDate(currentDate: Moment) {
    // return currentDate > moment().subtract(1, 'days');
    return currentDate > moment();
  }
  
  // 选择下拉列表
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleMenuClick({ key }: any) {
    // 按 X 查看, 弹出对应模式的日历供选择日期范围
    if (pickerTypes.includes(key)) {
      setPickerType(key);
      setCalendarOpen(true);
    } else {
      // 最近 X 天等，可直接获取日期
      const { start: startDate, end: endDate } = getRangeDate(key, false);
      setDateRange([startDate, endDate]);
      setSelectedKey(key);
      localStorageKey && storage.set(localStorageKey, {
        startDate,
        endDate,
        selectedKey: key,
      });
      onChange({
        startDate,
        endDate,
        selectedKey: key,
      });
    }
  }

  // 日期范围选择
  function handleDatePickerChange(date: Moment | null| Date) {
    // biweekly 先按 week 处理
    const type = pickerType === 'biweekly' ? 'week' : pickerType;
    const format = 'YYYY-MM-DD';
    const start = moment(date).startOf(type).format(format);
    let end = moment(date).endOf(type).format(format);
    // 双周的结束日期在周的基础上增加 7 天
    if (pickerType === 'biweekly') {
      end = moment(end).add(7, 'days').format(format);
    }
    setDateRange([start, end]);
    setSelectedKey(pickerType);
    localStorageKey && storage.set(localStorageKey, {
      startDate: start,
      endDate: end,
      selectedKey: pickerType,
    });
    onChange({
      startDate: start,
      endDate: end,
      selectedKey: pickerType,
    });
  }

  // 根据下拉选择渲染日期选择器
  function renderDatePicker() {
    let picker = pickerType;
    // 双周按周处理，通过 css 修改成显示双周的样式
    if (pickerType === 'biweekly') {
      picker = 'week';
    }
    return (
      <DatePicker
        onChange={(date: Moment | null| Date) => {
          setCalendarOpen(!calendarOpen);
          handleDatePickerChange(date);
        }}
        onOpenChange={open => {
          setCalendarOpen(open);
        }}
        picker={picker} 
        open={calendarOpen}
        // value={moment(dateRange[0])}
        // 不显示 value，因为切换 picker 后，显示的值有偏差
        value={null}
        className={styles.DatePicker}
        dropdownClassName={pickerType === 'biweekly' && styles.biweeklyCalendar}
        disabledDate={disabledDate}
      />
    );
  }

  const menu = (
    <Menu onClick={handleMenuClick} selectedKeys={[selectedKey]}> 
      {
        downlist.map(item => (
          <Menu.Item key={item.key} className={styles.menuItem}>{item.text}</Menu.Item>
        ))
      }
    </Menu>
  );

  return (
    <div className={classnames(styles.container, containerClassName)}>
      <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
        <div className={styles.showDateContainer}>
          <div className={styles.showDate}>
            <div className={styles.startDate}>{dateRange[0]}</div>
            <SwapRightOutlined className={classnames(styles.icon, styles.arrowIcon)} />
            <div className={styles.endDate}>{dateRange[1]}</div>
            <CalendarOutlined className={classnames(styles.icon, styles.calendarIcon)} />
          </div>
          <Input
            readOnly
            className={styles.Input}
            onFocus={() => setCalendarOpen(false)}
          />
        </div>
      </Dropdown>
      { renderDatePicker() }
    </div>
  );
};

export default DefinedCalendar;
