type numType = number;

// 检查是否超出 js 的 Number 范围
function checkNumberBoundary(num: numType, ...otherNum: numType[]) {
  if (otherNum.length > 0) {
    checkNumberBoundary(otherNum[0]);
    return;
  }
  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    console.warn(`将${num}转换为整数时，计算结果可能不准确。`);
  }
}

// 把丢失精度的数据转回正确值 0.09999999999999998 => 0.1
function repair(num: numType, precision?: number) {
  return +parseFloat(Number(num).toPrecision(precision || 15));
}

// 返回小数位数的长度 0.3333 => 4
function decimalLength(num: numType): number {
  if (Number.isInteger(num)) {
    return 0;
  }
  return String(num).split('.')[1].length;
}

// 把小数转成整数(翻了 n10 倍)
function floatToInteger(num: numType): number {
  return Number(num.toString().replace('.', ''));
}

// 乘法
function times(a: numType, b: numType): number {
  // 转换整数后的整数乘值
  const bigValue = floatToInteger(a) * floatToInteger(b);
  checkNumberBoundary(bigValue);
  // 翻了 10 的多少次方倍
  const multipleNum = decimalLength(a) + decimalLength(b);
  return bigValue / Math.pow(10, multipleNum);
}

// 除法
function divide(a: numType, b: numType): number {
  const num1Changed = floatToInteger(a);
  const num2Changed = floatToInteger(b);
  checkNumberBoundary(num1Changed, num2Changed);
  return times(
    num1Changed / num2Changed, repair(Math.pow(10, decimalLength(b) - decimalLength(a)))
  );
}

// 加法
function add(a: numType, b: numType) {
  // 按小数位数多的那个数为基础来翻倍
  const multipleNum = Math.max(decimalLength(a), decimalLength(b));
  // 翻多少倍
  const multiplier = Math.pow(10, multipleNum);
  // 翻倍后的计算值
  const bigValue = times(a, multiplier) + times(b, multiplier);
  return bigValue / multiplier;
}

// 减法
function minus(a: numType, b: numType): number {
  // 按小数位数多的那个数为基础来翻倍
  const multipleNum = Math.max(decimalLength(a), decimalLength(b));
  const multiplier = Math.pow(10, multipleNum);
  return (times(a, multiplier) - times(b, multiplier)) / multiplier;
}

export {
  add,
  minus,
  times,
  divide,
};
