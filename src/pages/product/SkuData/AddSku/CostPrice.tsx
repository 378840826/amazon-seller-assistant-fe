/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-25 15:49:10
 * @LastEditTime: 2021-03-01 11:41:10
 * 
 * 成本价格
 */
import React from 'react';
import styles from './index.less';
import { Form, Input } from 'antd';
import { strToNaturalNumStr, strToMoneyStr } from '@/utils/utils';
import { useSelector } from 'umi';


const { Item } = Form;
const CostPrice: React.FC = () => {
  const currentShop = useSelector((state: Global.IGlobalShopType) => state.global.shop.current);
  // 限制输入
  const limitedInput = (value: string) => {
    if (currentShop.marketplace === 'JP') {
      return strToNaturalNumStr(value);
    }
    return strToMoneyStr(value);
  };


  return <div className={styles.costPriceBox}>
    <Item name="purchasingCost" label="采购成本：" normalize={limitedInput}>
      <Input />
    </Item>
    <Item name="packagingCost" label="包装成本：" normalize={limitedInput}>
      <Input />
    </Item>
    <Item name="price" label="指导价：" normalize={limitedInput}>
      <Input />
    </Item>
  </div>;
};


export default CostPrice;

