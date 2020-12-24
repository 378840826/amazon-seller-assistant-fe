import React, { useState } from 'react';
import { message } from 'antd';
import { useDispatch } from 'umi';
import { Popover } from 'antd';
import { Iconfont } from '@/utils/utils';
import menu from '../Menu';
import { IConnectProps } from '@/models/connect';
import { DownOutlined } from '@ant-design/icons';
import styles from './index.less';

const style = {
  overlayStyle: { width: '430px' },
};
export interface IOperaShopConnectProps extends IConnectProps{
  // sub: ISubModelState;
  storeList: Array<API.IStoreList>;
  stores: Array<API.IStore>;
  id: string;
}

const OperaShop: React.FC<IOperaShopConnectProps> = ({ storeList, stores, id }) => {
  const dispatch = useDispatch();
  const getIndexList = () => {
    const lists: number[] = [];
    for (let i = 0;i < storeList.length;i++){
      for (let j = 0;j < stores.length;j++){
        if ( (storeList[i].marketplace === stores[j].marketplace) 
        && (storeList[i].sellerId === stores[j].sellerId) ){
          lists.push(i);
        }
      }
    }
    return lists;
  };

  const checkedIndexList = getIndexList();
  const [storesIndex, setStoresIndex] = useState(checkedIndexList);
  const menuCallback = (selectIndexList: number[]) => {
    setStoresIndex(selectIndexList);
    const paramsStores: Array<API.IStore> = storeList.filter((item, index) => {
      return selectIndexList.indexOf(index) > -1;
    }).map((item: { sellerId: string; marketplace: string }) => {
      return { sellerId: item.sellerId, marketplace: item.marketplace };
    });
    
    dispatch({
      type: 'sub/modifyStores',
      payload: {
        id: id,
        stores: paramsStores,
      },
      callback: (res: {code: number; message: string}) => {
        if (res.code !== 200){
          message.error(res.message);
        }
      },
    });
  };
 
  const count3 = storesIndex.slice(0, 3);
  return (
    <Popover placement="bottom" overlayStyle={style.overlayStyle} content={menu(checkedIndexList, menuCallback)} trigger="click" >
      <div className={styles.input_icon_wrap}>
        <div className={styles.three_shop_wrap}>
          {
            storeList.length === storesIndex.length && 
          <div className={styles.show_all_shop}>
            全部
          </div>
          }
          {
            storeList.length !== storesIndex.length && 
            count3.map( (item) => (    
              <div className={styles.show_shop} key={item}>
                <div className={[styles.national_flag, styles[storeList[item].marketplace]].join(' ')} ></div>
                <div className={styles.shop_name}>{storeList[item].storeName}</div>
              </div>
            ))}
        </div>
        <DownOutlined className={styles.iconfont} />
      </div>
    </Popover>
  );
};
export default OperaShop;
