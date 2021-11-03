/**
 * 单个数据豆腐块
 */
import React from 'react';
import { Tooltip } from 'antd';
import GoodsIcon from '@/pages/components/GoodsIcon';
import Rate from '@/components/Rate';
import styles from './index.less';

interface IProps {
  checked: boolean;
  color?: string;
  name: string;
  value: string | number | null | undefined;
  // 上期
  previous: string | number | null | undefined;
  // 环比
  ratio: number;
  // 提示
  hint?: string;
  clickCallback: (name: string) => void;
}

const DataBlock: React.FC<IProps> = props => {
  const { color, name, value, previous, ratio, hint, clickCallback, checked } = props;

  function handleClick() {
    clickCallback(name);
  }

  return (
    <div
      className={styles.block}
      key={name}
      onClick={() => handleClick()}
      style={ checked ? { borderTopColor: color } : undefined }
    >
      <div>
        <div className={styles.value}>{value}</div>
        <div className={styles.name}>
          {name}
          { hint && <Tooltip title={hint}>{GoodsIcon.question('')}</Tooltip> }
        </div>
      </div>
      <div>
        <div>
          <span className={styles.label}>上期：</span>{previous}
        </div>
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
