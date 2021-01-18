/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-12-23 16:15:42
 */

export const times = [
  '',
  '00:00', // 1
  '00:30', // 2
  '01:00', // 3
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '10:00',
  '11:30',
  '11:00',
  '12:30',
  '12:00',
  '13:30',
  '13:00',
  '14:30',
  '14:00',
  '15:30',
  '15:00',
  '16:30',
  '16:00',
  '17:30',
  '17:00',
  '18:30',
  '18:00',
  '19:30',
  '19:00',
  '20:30',
  '20:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
  '23:30',
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
    return 'Mon';
  case 1: 
    return 'Tues';
  case 2: 
    return 'Wed';
  case 3: 
    return 'Thur';
  case 4: 
    return 'Fri';
  case 5: 
    return 'Sat';
  case 6: 
    return 'Sun';
  default:
    return 'other';
  }
}


// 将后端给的英文字段转换成行的对应下标
export function weekTransition(val: string): number {
  switch (val) {
  case 'Mon':
    return 0;
  case 'Tues':
    return 1;
  case 'Wed':
    return 2;
  case 'Thur':
    return 3;
  case 'Fri':
    return 4;
  case 'Sat':
    return 5;
  case 'Sun':
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
export function dateTransitionTdIndex (start: string, end: string) {
  return {
    start: times.indexOf(start),
    end: times.indexOf(end),
  };
}
