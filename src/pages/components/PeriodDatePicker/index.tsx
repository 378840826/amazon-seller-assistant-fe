/**
 * 固定周期日期选择器（不可随意选择日期，只能选择 '本周' ‘上月’ 等固定周期）
 */
import React, { useState, useMemo } from 'react';
import { DatePicker, Dropdown, Menu } from 'antd';
import moment from 'moment';
import { getRangeDate as getTimezoneDateRange } from '@/utils/huang';
import classnames from 'classnames';
import styles from './index.less';

const { RangePicker } = DatePicker;

type SelectList = { key: string; title: string; className?: string }[];

interface IProps {
  /** 默认选中的key，可用范围参照 @/utils/huang/getRangeDate 方法中的 query 字段 */
  defaultSelectedKey: string;
  selectList?: SelectList;
  /** 切换日期后的回调函数 */
  onChange: (date: { start: string; end: string; selectedKey: string }) => void;
}

const defaultSelectListList: SelectList = [
  {
    key: 'week',
    title: '本周',
  }, {
    key: 'lastWeek',
    title: '上周',
  }, {
    key: 'month',
    title: '本月',
  }, {
    key: 'lastMonth',
    title: '上月',
  }, {
    key: '7',
    title: '最近7天',
  }, {
    key: '30',
    title: '最近30天',
  }, {
    key: '60',
    title: '最近60天',
  }, {
    key: '90',
    title: '最近90天',
  }, {
    key: '180',
    title: '最近180天',
  }, {
    key: '365',
    title: '最近365天',
  }, {
    key: 'year',
    title: '今年',
  }, {
    key: 'lastYear',
    title: '去年',
  },
];

const PeriodDatePicker: React.FC<IProps> = function(props) {
  const { onChange, defaultSelectedKey } = props;
  const [selectedKey, setSelectedKey] = useState<string>(defaultSelectedKey);
  const [visibleDropdownMenu, setVisibleDropdownMenu] = useState<boolean>(false);
  const selectList = props.selectList || defaultSelectListList;
  
  // 计算出的日期范围
  const dateRange = useMemo(() => {
    return getTimezoneDateRange(selectedKey, false);
  }, [selectedKey]);
  
  // 切换周期
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChange({ key }: any) {
    setSelectedKey(key);
    setVisibleDropdownMenu(false);
    const { start, end } = getTimezoneDateRange(key, false);
    onChange({ start, end, selectedKey: key });
  }

  // 下拉菜单
  const dropdownMenu = (
    <Menu onClick={handleChange} selectedKeys={[]}> 
      {
        selectList.map(item => {
          return (
            <Menu.Item
              key={item.key}
              className={classnames(item.key === selectedKey && styles.active, item.className)}>
              { item.title }
            </Menu.Item>
          );
        })
      }
    </Menu>
  );

  return (
    <div className={styles.container}>
      <div className={styles.ghostBtn} onClick={() => setVisibleDropdownMenu(true)}></div>
      <Dropdown
        overlay={dropdownMenu}
        placement="bottomCenter"
        trigger={['click']}
        visible={visibleDropdownMenu}
        onVisibleChange={flag => setVisibleDropdownMenu(flag)}
      >
        <RangePicker
          inputReadOnly
          open={false}
          allowClear={false}
          value={[moment(dateRange.start), moment(dateRange.end)]}
        />
      </Dropdown>
    </div>
  );
};

export default React.memo(PeriodDatePicker);
