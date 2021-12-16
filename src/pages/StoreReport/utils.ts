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

// 单元格数据，货币，百分比，数字每 3 位加逗号
export function renderTdNumValue(params: {
  value?: number | string | null;
  prefix?: string;
  suffix?: string;
  /** 是否精确到 0.01 */
  isFraction?: boolean;
}) {
  const { value, prefix, suffix, isFraction } = params;
  // 空
  if ([null, undefined, '', NaN].includes(value)) {
    return '—';
  }
  // 整数
  if (!prefix && !suffix && !isFraction) {
    const floatVlaue = Number(value).toLocaleString();
    return floatVlaue;
  }
  // 小数
  const v = Number(value).toLocaleString(
    undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );
  return `${prefix || ''}${v || '—'}${suffix || ''}`;
}
