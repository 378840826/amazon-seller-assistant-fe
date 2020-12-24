/**
 * 商品相关的 icon 和部分常用 icon
 * 全部用函数是为了统一调用方式
 */

import React from 'react';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';

const icon = {
  // 会员 prime
  prime: (title?: string) => (<span className={styles.prime} title={title}>Pr</span>),
  // 促销 Promotion
  promotion: (title?: string) => (<span className={styles.promotion} title={title}>促</span>),
  // add-on
  add: (addOnItem?: string) => <span className={styles.add} title={addOnItem}>Add</span>,
  // Best Seller
  bs: (bsCategory?: string) => <span className={styles.bs} title={bsCategory}>BS</span>,
  // New Releases
  nr: (nrCategory?: string) => <span className={styles.nr} title={nrCategory}>NR</span>,
  // 优惠券 coupon
  coupon: (coupon?: string) => <span className={styles.coupon} title={coupon}>券</span>,
  // Amazon's Choice
  ac: (acKeyword?: string) => (
    <span className={styles.ac} title={acKeyword}>
      <span>A</span>
      <span className={styles.C}>C</span>
    </span>
  ),
  // 卖家数
  seller: (num: number, title?: string) => (
    <span className={styles.seller} title={title}>
      <span className={styles.iconRenshu}>
        <Iconfont type="icon-renshu" />
      </span>
      <span className={styles.sellerNum}>{num}</span>
    </span>
  ),
  // 购物车 buyBox
  buyBoxcart: () => (<Iconfont type="icon-gouwuche" className={styles.cart} />),
  // 链接 link
  link: () => (<Iconfont className={styles.link} type="icon-lianjie" />),
  // 红旗
  redFlag: (title?: string) => (<Iconfont type="icon-dangqian" className={styles.redFlag} title={title} />),
  // 带圈问号
  question: (text: string) => (
    <Iconfont title={text} type="icon-yiwen" className={styles.question} />
  ),
};

// 大图标包裹
const bigWrapper = (element: JSX.Element) => (
  <span className={styles.big}>{element}</span>
);

// 大图标
const bigIcon = {
  // 会员 prime
  prime: (title?: string) => bigWrapper(icon.prime(title)),
  // 促销 Promotion
  promotion: (title?: string) => bigWrapper(icon.promotion(title)),
  // add-on
  add: (addOnItem?: string) => bigWrapper(icon.add(addOnItem)),
  // Best Seller
  bs: (bsCategory?: string) => bigWrapper(icon.bs(bsCategory)),
  // New Releases
  nr: (nrCategory?: string) => bigWrapper(icon.nr(nrCategory)),
  // 优惠券 coupon
  coupon: (coupon?: string) => bigWrapper(icon.coupon(coupon)),
  // Amazon's Choice
  ac: (acKeyword?: string) => bigWrapper(icon.ac(acKeyword)),
};

export { icon, bigIcon };
export default icon;
