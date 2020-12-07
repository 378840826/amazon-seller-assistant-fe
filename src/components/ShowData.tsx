/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-12-07 14:11:12
 * 
 * 当数据为 ""  null undefined 时 显示横线
 * 扩展：是否在数据前添加货币符号
 * 扩展：数据是为补满指定数的小数位  例如： 2 => 2.00    2.1 => 2.10     2.20 => 2.20
 */
import React from 'react';
import { useSelector } from 'umi';
import { toIndexFixed } from '@/utils/huang';


interface IProps {
  color?: string; // 横线显示的颜色
  style?: React.CSSProperties;// 横线的style
  className?: string; // // 横线显示的className
  isCurrency?: boolean; // 数据前面是否加上货号符号
  fillZero?: boolean; // 数据是否补小数点，（默认2位）
  fillNumber?: number; // 补的小数点
  value: string|number|null|undefined; // 显示的数据
}

export default (props: IProps) => {
  const {
    value,
    style,
    className,
    isCurrency = false,
    fillZero = true,
    fillNumber = 2,
    color = '#888',
  } = props;

  const { currency = '' } = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);

  return <>{
    (value === null || value === '' || value === undefined) ? (
      <span className={className ? className : ''} style={{
        color,
        ...style,
      }}>—</span>
    ) : ( (isCurrency ? currency : '') + (fillZero ? toIndexFixed(value, fillNumber) : value ) )
  }</>;
};
