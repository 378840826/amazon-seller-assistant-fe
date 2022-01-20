/**
 * 单个数据豆腐块
 */
import React from 'react';
import Rate from '@/components/Rate';
import { moneyFormatNames } from '../../config';
import { renderTdNumValue as renderValue } from '@/pages/StoreReport/utils';
import styles from './index.less';

interface IProps {
  currency?: string;
  checked: boolean;
  color?: string;
  name: string;
  value: string | number | null | undefined;
  // 环比
  ratio: number;
  clickCallback: (name: string) => void;
}

const DataBlock: React.FC<IProps> = props => {
  const { color, name, value, ratio, clickCallback, checked, currency } = props;

  function handleClick() {
    clickCallback(name);
  }

  function getShowValue() {
    let showValue = value;
    if (moneyFormatNames.includes(name)) {
      showValue = renderValue({ value, prefix: currency });
    } else {
      showValue = renderValue({ value });
    }
    return showValue;
  }

  return (
    <div
      className={styles.block}
      key={name}
      onClick={() => handleClick()}
      style={ checked ? { borderTopColor: color } : undefined }
    >
      <div className={styles.name}>
        {name}
      </div>
      <div className={styles.num}>
        <div className={styles.value}>{ getShowValue() }</div>
        <div>
          <span className={styles.label}>环比：</span>
          {
            [null, undefined, NaN, ''].includes(ratio)
              ? '—'
              : <Rate value={ratio} decimals={2} />
          }
        </div>
      </div>
    </div>
  );
};

export default DataBlock;
