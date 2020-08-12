// 处理函数

/**
 * @name handleMapBarCoordinates 根据州名(英文)处理地图上桩形坐标
 * @param name 州名
 */
export function handleMapBarCoordinates(name: string) {
  switch (name) {
  case 'Oregon':
    return { left: 135, top: 115 };
  case 'Texas':
    return { left: 618, top: 430 };
  case 'Washington':
    return { left: 225, top: 5 };
  case 'North Dakota':
    return { left: 550, top: 10 };
  case 'California':
    return { left: 170, top: 255 };
  case 'Arizona':
    return { left: 362, top: 348 };
  case 'Nevada':
    return { left: 250, top: 225 };
  case 'Colorado':
    return { left: 455, top: 262 };
  case 'Connecticut':
    return { left: 1310, top: 280 };
  case 'Arkansas':
    return { left: 790, top: 330 };
  case 'Mississippi':
    return { left: 850, top: 390 };
  case 'Nebraska':
    return { left: 580, top: 162 };
  case 'Wyoming':
    return { left: 410, top: 148 };
  case 'Oklahoma':
    return { left: 695, top: 355 };
  case 'New Mexico':
    return { left: 488, top: 348 };
  case 'Utah':
    return { left: 340, top: 243 };
  case 'Idaho':
    return { left: 315, top: 120 };
  case 'Montana':
    return { left: 449, top: 20 };
  case 'Alaska':
    return { left: 110, top: 535 };
  case 'Hawaii':
    return { left: 460, top: 575 };
  case 'South Dakota':
    return { left: 615, top: 58 };
  case 'Alabama':
    return { left: 901, top: 392 };
  case 'Vermont':
    return { left: 1200, top: 10 };
  case 'Louisiana':
    return { left: 785, top: 435 };
  case 'Georgia':
    return { left: 950, top: 390 };
  case 'Minnesota':
    return { left: 765, top: -5 };
  case 'Puerto Rico':
    return { left: 1145, top: 570 };
  case 'Florida':
    return { left: 1010, top: 568 };
  case 'Kansas':
    return { left: 615, top: 260 };
  case 'Massachusetts':
    return { left: 1358, top: 125 };
  case 'Iowa':
    return { left: 760, top: 125 };
  case 'Illinois':
    return { left: 845, top: 185 };
  case 'Indiana':
    return { left: 915, top: 185 };
  case 'New York':
    return { left: 1135, top: 98 };
  case 'Wisconsin':
    return { left: 835, top: 45 };
  case 'Michigan':
    return { left: 910, top: 35 };
  case 'Missouri':
    return { left: 780, top: 228 };
  case 'Ohio':
    return { left: 990, top: 168 };
  case 'Kentucky':
    return { left: 882, top: 280 };
  case 'Tennessee':
    return { left: 970, top: 320 };
  case 'Pennsylvania':
    return { left: 1080, top: 155 };
  case 'Maine':
    return { left: 1319, top: 45 };
  case 'New Hampshire':
    return { left: 1240, top: 10 };
  case 'Rhode Island':
    return { left: 1358, top: 210 };
  case 'New Jersey':
    return { left: 1168, top: 178 };
  case 'West Virginia':
    return { left: 1043, top: 59 };
  case 'Virginia':
    return { left: 1100, top: 285 };
  case 'North Carolina':
    return { left: 1020, top: 318 };
  case 'Delaware':
    return { left: 1239, top: 300 };
  case 'Maryland':
    return { left: 1160, top: 408 };
  case 'South Carolina':
    return { left: 1085, top: 475 };
  case 'Washington, D.c.':
    return { left: 1191, top: 363 };

  default: 
    return {};
  }
}

/**
 * 柱子比例问题
 * 1. 柱子的最大高度为100px，取销量和库存的最大值为100，
 * 2. 其他值按百分比等比例显示，
 * 例如，全美国最大值是德州的库存800，纽约州的销量是80，那么德州库存柱子高度为100px，纽约州销量柱子高度为10px；
 * 
 * 求出最大库存数，所有比较都按这个最大库存数来计算
 * 值 = 当前数量 / 最大库存数 * 100
 */
export function sumBarHeight(num: string|number|null, maxStock: number) {
  const barMaxHeight = 80; // 柱子最大高度
  if (num === null) {
    return 0;
  }
  const newNum = Number(num);
  let result = 0; // 返回结果

  if (newNum === maxStock) {
    return barMaxHeight;
  }

  const svg = maxStock / newNum;

  result = Math.floor(barMaxHeight / svg);


  if (result <= 5) {
    result = 5;
  }

  if (result > barMaxHeight) {
    result = barMaxHeight;
  }

  return result;
}


// 当柱形图未够100px时，重新计算Y轴坐标
export function sumBarY(num: number, y: number) {
  const offset = 80 - num;
  return y + offset;
}
