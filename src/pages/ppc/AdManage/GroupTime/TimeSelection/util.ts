import { IDateItem } from './index';

export const times = [
  '',
  '00:00', // 1
  '00:29', // 2
  '00:59', // 3

  '01:29',
  '01:59',

  '02:29',
  '02:59',

  '03:29',
  '03:59',

  '04:29',
  '04:59',

  '05:29',
  '05:59',
  
  '06:29',
  '06:59',

  '07:29',
  '07:59',

  '08:29',
  '08:59',

  '09:29',
  '09:59',

  '10:29',
  '10:59',

  '11:29',
  '11:59',

  '12:29',
  '12:59',

  '13:29',
  '13:59',

  '14:29',
  '14:59',

  '15:29',
  '15:59',

  '16:29',
  '16:59',

  '17:29',
  '17:59',

  '18:29',
  '18:59',

  '19:29',
  '19:59',

  '20:29',
  '20:59',

  '21:29',
  '22:59',

  '22:29',
  '22:59',

  '23:29',
  '23:59',
];

export function weekNumberToChinese(val: number): string {
  switch (val) {
  case 1: 
    return '星期一';
  case 2: 
    return '星期二';
  case 3: 
    return '星期三';
  case 4: 
    return '星期四';
  case 5: 
    return '星期五';
  case 6: 
    return '星期六';
  case 7: 
    return '星期日';
  default:
    return '';
  }
}

// 根据表格行数转换成星期几
export function rowtranstionWeek(val: string) {
  switch (Number(val)) {
  case 0: 
    return 'mon';
  case 1: 
    return 'tues';
  case 2: 
    return 'wed';
  case 3: 
    return 'thur';
  case 4: 
    return 'fri';
  case 5: 
    return 'sat';
  case 6: 
    return 'sun';
  default:
    return 'other';
  }
}


// 将后端给的英文字段转换成行的对应下标
export function weekTransition(val: string): number {
  switch (val) {
  case 'mon':
    return 0;
  case 'tues':
    return 1;
  case 'wed':
    return 2;
  case 'thur':
    return 3;
  case 'fri':
    return 4;
  case 'sat':
    return 5;
  case 'sun':
    return 6;
  default: 
    return -1;
  }
}


export function getAxis(event: any): { // eslint-disable-line 
  x: number;
  y: number;
} {
  const e = event || window.event;
  return { x: e.layerX, y: e.layerY };
}

/**
 *将时间转换成表格td对应的位置
 */
export function dateTransitionTdIndex (timeItem: IDateItem) {
  const { startTime, endTime } = timeItem;
  const [startHour, startmMinute] = startTime.split(':');
  const [endHour, endMinute] = endTime.split(':');
  const hours = Number(endHour) - Number(startHour);
  const minute = Number(endMinute) - Number(startmMinute);
  // 数量
  const count = hours * 2 + ( minute > 30 ? 2 : 1 );
  // 起始下标
  const startIndex = (Number(startHour) + 1) * 2;
  const result = [...Array(count)].map((_, i) => startIndex + i);
  return result;
}
