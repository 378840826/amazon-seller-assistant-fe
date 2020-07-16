import React from 'react';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';

export default {
  prime: (<span className={styles.prime}>Pr</span>),
  promotion: (<span className={styles.promotion}>促</span>),
  buyBoxcart: (<Iconfont type="icon-gouwuche" className={styles.cart} />),
  link: (<Iconfont className={styles.link} type="icon-lianjie" />),
  hongqi: (<Iconfont type="icon-dangqian" className={styles.hongqi} />),
  add: (addOnItem?: string) => <span className={styles.add} title={addOnItem}>Add</span>,
  bs: (bsCategory?: string) => <span className={styles.bs} title={bsCategory}>BS</span>,
  nr: (nrCategory?: string) => <span className={styles.nr} title={nrCategory}>NR</span>,
  coupon: (coupon?: string) => <span className={styles.coupon} title={coupon}>券</span>,
  ac: (acKeyword?: string) => (
    <span className={styles.ac} title={acKeyword}>
      <span>A</span>
      <span className={styles.C}>C</span>
    </span>
  ),
  seller: (num: number) => (
    <span className={styles.seller}>
      <span className={styles.iconRenshu}>
        <Iconfont type="icon-renshu" />
      </span>
      <span className={styles.sellerNum}>{num}</span>
    </span>
  ),
  question: (text: string) => (
    <Iconfont
      title={text}
      type="icon-shuoming1-copy-copy"
      className={styles.question}
    />
  ),
};
