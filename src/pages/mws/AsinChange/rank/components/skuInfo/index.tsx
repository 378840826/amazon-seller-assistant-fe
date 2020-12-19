import React from 'react';
import styles from './index.less';
interface ISkuInfo{
  item: ISmallItem[] ;
  
}
interface ISmallItem{
    sku: string;
    skuStatus: string;
}

const SkuInfo: React.FC<ISkuInfo> = ({ item }) => {
  return (
    <div className={styles.sku_list}>
      {item.map((smallItem, index: number) => {
        if (smallItem.skuStatus === 'Active'){
          return (
            <div key={index} className={styles.active}>
              <span>{smallItem.sku}</span>
              <span>在售</span>
            </div>
          );
        } else if (smallItem.skuStatus === 'Inactive'){
          return (
            <div key={index} className={styles.inactive}>
              <span>{smallItem.sku}</span>
              <span>不可售</span>
            </div>
          );
        } else if (smallItem.skuStatus === 'deleted'){
          return (
            <div key={index} className={styles.inactive}>
              <span>{smallItem.sku}</span>
              <span>已移除</span>
            </div>
          );
        } else if (smallItem.skuStatus === 'Incompleted'){
          return (
            <div key={index} className={styles.inactive}>
              <span>{smallItem.sku}</span>
              <span>禁止显示</span>
            </div>
          );
        }
        return (
          <div key={index}>
            <span>{smallItem.sku}</span>
          </div>
        );
        
      })}

    </div>
  );
};
export default SkuInfo;
