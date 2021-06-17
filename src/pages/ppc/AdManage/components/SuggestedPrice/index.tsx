/**
 * 建议竞价
 */
import React from 'react';
import { Spin, Button } from 'antd';
import { getShowPrice } from '@/utils/utils';
import styles from './index.less';

interface IProps {
  loading?: boolean;
  /** 是否禁用应用按钮，归档状态下需要禁用 */
  disabled?: boolean;
  suggestedPrice: number | string;
  suggestedMin?: number | string;
  suggestedMax?: number | string;
  marketplace: API.Site;
  currency: string;
  onApply: () => void;
}

const SuggestedPrice: React.FC<IProps> = props => {
  const {
    loading,
    disabled,
    suggestedPrice,
    suggestedMin,
    suggestedMax,
    marketplace,
    currency,
    onApply,
  } = props;

  return (
    // spinning 为 undefined 时会 loading
    <Spin spinning={loading || false} size="small">
      {
        suggestedPrice === null || suggestedPrice === undefined || suggestedPrice === ''
          ? '—'
          :
          <>
            <div className={styles.suggested}>
              { getShowPrice(suggestedPrice, marketplace, currency) }
              <Button disabled={disabled || !suggestedPrice} onClick={onApply} >应用</Button>
            </div>
            <div>
              ({ getShowPrice(suggestedMin, marketplace, currency )}
              -
              { getShowPrice(suggestedMax, marketplace, currency) })
            </div>
          </>
      }
    </Spin>
  );
};

export default SuggestedPrice;
