/**
 * 筛选的面包屑
 */
import React from 'react';
import { Button } from 'antd';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';

interface IProps {
  currency: string;
  filtrateParams: { [key: string]: string };
  handleEmpty: () => void;
  handleDelete: (key: string) => void;
}

const Crumbs: React.FC<IProps> = props => {
  const {
    currency,
    filtrateParams,
    handleEmpty,
    handleDelete,
  } = props;

  const titleDict = {
    search: '查询',
    sales: `销售额(${currency})`,
    spend: 'Spend',
    acos: 'ACoS(%)',
    ctr: 'CTR(%)',
    conversionsRate: '转化率(%)',
    orderNum: '订单量',
    impressions: 'Impressions',
    clicks: 'Clicks',
    roas: 'RoAS',
    cpc: 'CPC',
    cpa: 'CPA',
    // search term 报表的查询
    keywordText: '投放词',
    queryKeyword: '搜索词',
    asinKeyword: 'ASIN',
  };

  // 生成单个面包屑
  function createCrumb(key: string, values: string[]) {
    const empty = <span className={styles.empty}>__</span>;
    const title = titleDict[key];
    return (
      <span key={key} className={styles.tag}>
        <span>
          <span className={styles.secondary}>{title}：</span>
          {
            values && values.length === 1
              ?
              values[0]
              :
              <>{values[0] || empty} - {values[1] || empty}</>
          }
        </span>
        <span
          className={styles.tagCloseIcon}
          onClick={() => {
            handleDelete(key);
          }}
        >
          <Iconfont type="icon-cuo" />
        </span>
      </span>
    );
  }

  const obj: {
    [key: string]: string[];
  } = {};

  Object.keys(filtrateParams).forEach(key => {
    if (filtrateParams[key]) {
      const k = key.slice(0, -3);
      if (key.slice(-3) === 'Min' || key.slice(-3) === 'Max') {
        obj[k] ? null : obj[k] = [filtrateParams[`${k}Min`], filtrateParams[`${k}Max`]];
      } else if (key === 'search') {
        obj[key] = [filtrateParams[key]];
      }
    }
  });

  const keys = Object.keys(obj);

  return (
    <>
      {
        keys.length
          ?
          <div className={styles.crumbs}>
            { keys.map(key => createCrumb(key, obj[key])) }
            <Button type="link" onClick={handleEmpty}>清空条件</Button>
          </div>
          : null
      }
    </>
  );
};

export default Crumbs;
