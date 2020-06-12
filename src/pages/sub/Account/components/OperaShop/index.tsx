import React, { useState } from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { Popover } from 'antd';
import { Iconfont } from '@/utils/utils';
import menu from '../Menu';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { IConnectState, IConnectProps } from '@/models/connect';
import { ISubModelState } from '@/models/sub';
import styles from './index.less';

const style = {
  overlayStyle: { width: '430px' },
};
export interface IOperaShopConnectProps extends IConnectProps{
  sub: ISubModelState;
  stores: Array<API.IStore>;
  id: string;
}


const OperaShop: React.FC<IOperaShopConnectProps> = ({ sub, stores, id, dispatch }) => {
  const storeList = sub.storeList;
  const [storesShow, setStores] = useState(stores);
  
  const menuCallback = (selectedIdList: CheckboxValueType[]) => {
    const newStores = storeList.filter(item => selectedIdList.some(ele => ele === item.sellerId));
    setStores(newStores);
    const paramsStores: Array<API.IStore> = [];
    newStores.forEach(item => 
      paramsStores.push({ sellerId: item.sellerId, marketplace: item.marketplace }));
    
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
 
  
  const count3 = storeList.filter(item => 
    storesShow.some(ele => ele.sellerId === item.sellerId)).slice(0, 3);
  return (
    <Popover placement="bottom" overlayStyle={style.overlayStyle} content={menu(storesShow, menuCallback)} trigger="click" >
      <div className={styles.input_icon_wrap}>
        <div className={styles.three_shop_wrap}>
          {
            storeList.length === storesShow.length && 
          <div className={styles.show_all_shop}>
            全部
          </div>
          }
          {
            storeList.length !== storesShow.length && 
            count3.map(subItem => (    
              <div className={styles.show_shop} key={subItem.sellerId}>
                <div className={[styles.national_flag, styles[subItem.marketplace]].join(' ')} ></div>
                <div className={styles.shop_name}>{subItem.storeName}</div>
              </div>
            ))}
        </div>
        <Iconfont type="icon-xiangxiajiantou" className={styles.iconfont}/>
      </div>
    </Popover>
  );
};
export default connect(({ sub }: IConnectState) => ({
  sub,
}))(OperaShop);
