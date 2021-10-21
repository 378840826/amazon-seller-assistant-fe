// 按接口参数格式要求格式化日期参数
export function getDefinedCalendarFiltrateParams(dates: DefinedCalendar.IChangeParams) {
  console.log('dates', dates);
  if (Number(dates.selectItemKey)) {
    return {
      cycle: dates.selectItemKey,
      startTime: null,
      endTime: null,
      timeMethod: null,
    };
  }
  return {
    cycle: null,
    startTime: dates.dateStart,
    endTime: dates.dateEnd,
    timeMethod: dates.selectItemKey,
  };
}

// 单元格数据
export function renderTdNumValue(params: {
  value?: number | string | null;
  prefix?: string;
  suffix?: string;
}) {
  const { value, prefix, suffix } = params;
  if ([null, undefined, '', NaN].includes(value)) {
    return '—';
  }
  if (!prefix && !suffix) {
    return value;
  }
  const v = Number(value).toFixed(2);
  return `${prefix || ''}${v || '—'}${suffix || ''}`;
}
