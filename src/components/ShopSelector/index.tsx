/**
 * 功能页的店铺选择器
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Select } from 'antd';
import { IConnectState } from '@/models/connect';
import styles from './index.less';
import classnames from 'classnames';

const { Option } = Select;

const ShopSelector: React.FC = () => {
  const [filterText, setFilterText] = useState<string>('');
  const dispatch = useDispatch();
  const loadingEffect = useSelector((state: IConnectState) => state.loading);
  const loading = loadingEffect.effects['global/fetchShopList'];
  const shop = useSelector((state: IConnectState) => state.global.shop);

  // useEffect(() => {
  //   const type = location.pathname.includes('/ppc') ? 'ppc' : 'mws';
  //   dispatch({
  //     type: 'global/fetchShopList',
  //     payload: { type },
  //   });
  // }, [dispatch]);

  const handleChange = (value: string) => {
    dispatch({
      type: 'global/setCurrentShop',
      payload: { id: value },
    });
  };

  const { type, current, status } = shop;
  const { id: currentId, storeName: currentShopName } = current;
  const shopList = shop[type];
  const disabled = status === 'disabled' || loading ? true : false;
  return (
    status === 'hidden'
      ?
      null
      :
      <Select
        showSearch
        className={styles.Select}
        bordered={false}
        loading={loading}
        value={currentId}
        defaultValue={'-1'}
        disabled={disabled}
        onChange={handleChange}
        onSearch={setFilterText}
        filterOption={false}
        listHeight={200}
      >
        {
          currentId === '-1' ? <Option key={currentId} value={currentId}>{currentShopName}</Option> :
            shopList.map((shop: API.IShop) => {
              if (shop.storeName.toLowerCase().includes(filterText.toLowerCase())) {
                return (
                  <Option key={shop.id} value={shop.id}>
                    <div className={styles.SelectItem}>
                      <i className={classnames(styles.flag, styles[`flag-${shop.marketplace}`])}>
                      </i>
                      <span className={styles.site}>{shop.marketplace}</span>
                      <span className={styles.shopName}>{shop.storeName}</span>
                    </div>
                  </Option>
                );
              }
            })
        }
      </Select>
  );
};

export default ShopSelector;
