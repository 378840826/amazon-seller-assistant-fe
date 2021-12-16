/**
 * SKU 和 ASIN 豆腐块
 */
import React from 'react';
import { useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import { groups } from '../components/CustomBlock';
import MyIcon from '@/pages/components/GoodsIcon';
import styles from './index.less';
import { AssignmentKeyName } from '../utils';

// 跳转链接
const urlDict = {
  'SKU总数': '/product/list',
  'Active-SKU': '/product/list?status=Active',
  'Inactive-SKU': '/product/list?status=Inactive',
  'FBA-active-SKU': '/product/list?status=Active&fulfillmentChannel=FBA',
  'FBA-Inactive-SKU': '/product/list?status=Inactive&fulfillmentChannel=FBA',
  'FBM-active-SKU': '/product/list?status=Active&fulfillmentChannel=FBM',
  'FBM-Inactive-SKU': '/product/list?status=Inactive&fulfillmentChannel=FBM',
  'ASIN总数': '/product/list',
  'Buybox-ASIN': '/product/list?buybox=true',
  '非Buybox-ASIN': '/product/list?buybox=false',
};

// 问号
const queryDict = {
  '动销率': '周期内有订单的ASIN数/周期内曾经在售的ASIN，ASIN有一个SKU是active状态，则ASIN就是在售的',
  '在售': '周期内累计在售的ASIN数，ASIN有一个SKU是active状态，则ASIN就是在售的，ASIN只要有一天是在售的，就算入累计在售ASIN数',
  '上新': '以ASIN最早创建的SKU的创建时间为准',
};

const SkuAsinBlock: React.FC = () => {
  const pageData = useSelector((state: IConnectState) => state.storeDetail);
  const { customBlock, baseData: { skuInfoTofu, asinInfoTofu } } = pageData;

  // 单个简单豆腐块
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderSimpleBlock(name: string, value: any) {
    const item = (
      <div className={styles.block} key={name}>
        <div>
          {name}
          {
            queryDict[name] && MyIcon.question(queryDict[name])
          }
        </div>
        <div className={styles.blockVal}>{[null, undefined, ''].includes(value) ? '—' : value}</div>
      </div>
    );
    return (
      urlDict[name]
        ? <a href={urlDict[name]} key={name} target="_blank" rel="noreferrer">{ item }</a>
        : item
    );
  }

  return (
    <>
      <div>
        <div className={styles.title}>SKU</div>
        <div className={styles.container}>
          {
            ['SKU总数'].concat(groups.SKU).map(name => {
              const value = skuInfoTofu[AssignmentKeyName[name]];
              return customBlock[name] && renderSimpleBlock(name, value);
            })
          }
        </div>
      </div>
      <div>
        <div className={styles.title}>ASIN</div>
        <div className={styles.container}>
          {
            ['ASIN总数'].concat(groups.ASIN).map(name => {
              const value = asinInfoTofu[AssignmentKeyName[name]];
              return customBlock[name] && renderSimpleBlock(name, value);
            })
          }
        </div>
      </div>
    </>
  );
};

export default SkuAsinBlock;
