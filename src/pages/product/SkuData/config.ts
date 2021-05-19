/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-25 10:34:08
 * @LastEditTime: 2021-03-02 16:07:14
 */


// 状态下拉列表
export const states = [
  {
    label: '在售',
    value: '在售',
  },
  {
    label: '试卖',
    value: '试卖',
  },
  {
    label: '清货',
    value: '清货',
  },
  {
    label: '部分清货',
    value: '部分清货',
  },
  {
    label: '停售',
    value: '停售',
  },
  {
    label: '部分停售',
    value: '部分停售',
  },
];


// 包装体积尺寸单位
export const packSizeUnit = [
  {
    label: '英尺',
    value: 'feet',
  },
  {
    label: '英寸',
    value: 'inch',
  },
  {
    label: '米',
    value: 'm',
  },
  {
    label: '厘米',
    value: 'cm',
  },
];


// 包装重量单位
export const packWeightUnit = [
  {
    label: '克',
    value: 'g',
  },
  {
    label: '磅',
    value: 'pound',
  },
  {
    label: 'kg',
    value: 'kg',
  },
  {
    label: '盎司',
    value: 'ounce',
  },
];

// 包装材质单位
export const packTextureUnit = [
  {
    label: '纸盒',
    value: '纸盒',
  },
  {
    label: '泡沫',
    value: '泡沫',
  },
  {
    label: '塑料',
    value: '塑料',
  },
  {
    label: '金属',
    value: '金属',
  },
  {
    label: '其它',
    value: 'other',
  },
];

// 店铺下拉列表
export const shopDownlist = [
  // {
  //   label: 'CN-中国',
  //   value: 'CN-中国',
  // },
  {
    label: 'US-美国',
    value: 'US',
  },
  {
    label: 'CA-加拿大',
    value: 'CA',
  },
  {
    label: 'UK-英国',
    value: 'UK',
  },
  {
    label: 'DE-德国',
    value: 'DE',
  },
  {
    label: 'FR-法国',
    value: 'FR',
  },
  {
    label: 'IT-意大利',
    value: 'IT',
  },
  {
    label: 'ES-西班牙',
    value: 'ES',
  },
  {
    label: 'JP-日本',
    value: 'JP',
  },
];


/**
 * 体积单位值转换成英寸单位
 * @param type 数据转换前的单位类型 feet英尺 m米 cm厘米
 * @param number 数值
 */
export function numberToinch(type: 'feet'|'m'|'cm'|'inch', number: number): number {
  switch (type) {
  case 'cm':
    return Math.round(number * 100 * 0.39) / 100;
  case 'feet':
    return number * 12;
  case 'm':
    return Number((number * 39.37).toFixed(2));
  default:
    return number;
  }
}

/**
 * 重量单位值转换成磅单位
 * @param type 数据转换前的单位类型 g克 kg ounce盎司
 * @param number 数值
 */
export function numberToPound(type: 'g'|'kg'|'ounce'|'pound', number: number): number {
  switch (type) {
  case 'g':
    return Math.round(number * 100 * 0.0022) / 100;
  case 'kg':
    return number * 2.2;
  case 'ounce':
    return Math.round(number * 100 * 0.0625) / 100;
  default:
    return number;
  }
}


/**
 * 计算商品体积、包装体积是否有oversize
 * 
 * 长宽高 最大值超过18英寸 有oversize 
 * 长宽高 最小值超过8英寸 有oversize
 * 长宽高 中间值超过14英寸 有oversize
 * 
 * @param width 长度
 * @param wide 宽度
 * @param height 高度
 */
export function sumVolumeOversize(unit: 'feet'|'m'|'cm'|'inch', data: { width: number; wide: number; height: number } ): ''|'oversize' {
  let {
    width = 0,
    wide = 0,
    height = 0,
  } = data;
  width = numberToinch(unit, Number(width));
  wide = numberToinch(unit, Number(wide));
  height = numberToinch(unit, Number(height));
  const arr = [width, wide, height];
  arr.sort();
  
  if (
    arr[2] > 18
    || arr[1] > 14
    || arr[0] > 8
  ) {
    return 'oversize';
  }
  return '';
}

/**
 * 计算包装重量、商品重量是否有oversize
 *  
 * 超过20磅就有
 * 
 * @param width 长度
 * @param wide 宽度
 * @param height 高度
 */
export function sumWeightOversize(unit: 'g'|'kg'|'ounce'|'pound', number: number ): ''|'oversize' {
  number = numberToPound(unit, Number(number));
  return number > 20 ? 'oversize' : '';
}


