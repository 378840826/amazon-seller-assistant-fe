/**
 * 功能页的店铺选择器
 */
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const isRequest = shop.list.length > 0 ? false : true;
    isRequest && dispatch({
      type: 'global/fetchShopList',
    });
  }, [dispatch]); // eslint-disable-line
  // 因为使用路由守卫后，不再需要监听shop，监听shop就会无限请求(店铺列表为0的情况下)

  const handleChange = (value: string) => {
    dispatch({
      type: 'global/setCurrentShop',
      payload: { id: value },
    });
  };

  const { current, status } = shop;
  const { id: currentId, storeName: currentShopName } = current;
  const shopList = shop.list;
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
                    <div className={classnames(styles.SelectItem, 'g-shop-current-box')}>
                      <i className={classnames(styles.flag, styles[`flag-${shop.marketplace}`])}>
                      </i>
                      <span className={classnames(styles.site, 'g-shop-current-site')}>{shop.marketplace}</span>
                      <span className={classnames(styles.shopName, 'g-shop-current-shopName')}>{shop.storeName}</span>
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
