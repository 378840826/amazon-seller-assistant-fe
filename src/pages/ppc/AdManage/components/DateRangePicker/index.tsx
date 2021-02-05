/**
 * 时间范围选择器
 */
import React from 'react';
import { DatePicker } from 'antd';
import { getRangeDate as getTimezoneDateRange } from '@/utils/huang';
import { _sessionStorage } from '@/utils/utils';
import moment, { Moment } from 'moment';

const { RangePicker } = DatePicker;

interface IProps {
  startDate: string;
  endDate: string;
  disabled?: boolean;
  callback: (rangePickerDates: string[]) => void;
  wrapClassName?: string;
}

const DateRangePicker: React.FC<IProps> = (props) => {
  const { disabled, wrapClassName, callback } = props;
  let { startDate, endDate } = props;
  if (!startDate || !endDate) {
    const dateRange = _sessionStorage.get('adManageDateRange') || getTimezoneDateRange(7, false);
    startDate = dateRange.start;
    endDate = dateRange.end;
  }
  let rangePickerDates = [moment(startDate), moment(endDate)];
  const dateFormat = 'YYYY-MM-DD';

  // 最近 n 天的站点时间范围
  const { start: start7, end } = getTimezoneDateRange(7);
  const { start: start30 } = getTimezoneDateRange(30);
  const { start: start60 } = getTimezoneDateRange(60);
  const { start: start90 } = getTimezoneDateRange(90);
  const { start: start180 } = getTimezoneDateRange(180);
  const { start: start365 } = getTimezoneDateRange(365);
  const { start: startWeek, end: endWeek } = getTimezoneDateRange('week');
  const { start: startMonth, end: endMonth } = getTimezoneDateRange('month');
  const { start: startLastWeek, end: endLastWeek } = getTimezoneDateRange('lastWeek');
  const { start: startLastMonth, end: endLastMonth } = getTimezoneDateRange('lastMonth');
  const { start: startYear, end: endYear } = getTimezoneDateRange('year');
  const { start: startLastYear, end: endLastYear } = getTimezoneDateRange('lastYear');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RangePickerConfig: any = {
    ranges: {
      '本周': [startWeek, endWeek],
      '本月': [startMonth, endMonth],
      '上周': [startLastWeek, endLastWeek],
      '上月': [startLastMonth, endLastMonth],
      '最近7天': [start7, end],
      '最近30天': [start30, end],
      '最近60天': [start60, end],
      '最近90天': [start90, end],
      '最近180天': [start180, end],
      '最近365天': [start365, end],
      '今年': [startYear, endYear],
      '上年': [startLastYear, endLastYear],
    },
    defaultValue: rangePickerDates,
    dateFormat,
    allowClear: false,
    onChange: (dates: Moment[]) => {
      rangePickerDates = [...dates];
    },
    onOpenChange: (isOpen: boolean) => {
      if (isOpen) {
        return;
      }
      const formatStart = rangePickerDates[0].format(dateFormat);
      const formatEnd = rangePickerDates[1].format(dateFormat);
      if (formatStart === startDate && formatEnd === endDate) {
        return;
      }
      callback([formatStart, formatEnd]);
      // 临时保存到本地
      _sessionStorage.set('adManageDateRange', { start: formatStart, end: formatEnd });
    },
    disabled,
  };

  return (
    <div className={wrapClassName}>
      <RangePicker {...RangePickerConfig} />
    </div>
  );
};

export default DateRangePicker;
