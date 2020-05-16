/**
 * 功能页的店铺选择器
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import { IConnectProps, IConnectState, ILoading } from '@/models/connect';
import { IShopSelector } from '@/models/global';
import styles from './index.less';
import classnames from 'classnames';

const { Option } = Select;

interface IProps extends IConnectProps {
  shop: IShopSelector;
  loading: ILoading;
}

const ShopSelector: React.FC<IProps> = (props) => {
  const [filterText, setFilterText] = useState<string>('');

  useEffect(() => {
    const { dispatch } = props;
    const type = location.pathname.includes('/ppc') ? 'ppc' : 'mws';
    dispatch({
      type: 'global/fetchShopList',
      payload: { type },
    });
  }, []);

  const handleChange = (value: number) => {
    const { dispatch } = props;
    dispatch({
      type: 'global/setCurrentShop',
      payload: { id: value },
    });
  };

  const {
    shop,
    loading: { effects: { 'global/fetchShopList': loading } },
  } = props;
  const { type, current, status } = shop;
  const { id: currentId, shopName: currentShopName } = current;
  const shopList = shop[type];
  const disabled = shop.status === 'disabled' || loading ? true : false;
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
        defaultValue={-1}
        disabled={disabled}
        optionFilterProp="children"
        onChange={handleChange}
        onSearch={setFilterText}
        filterOption={false}
      >
        {
          currentId < 0 ? <Option key={currentId} value={currentId}>{currentShopName}</Option> :
            shopList.map((shop: API.IShop) => {
              if (shop.shopName.includes(filterText)) {
                return (
                  <Option key={shop.id} value={shop.id}>
                    <div className={styles.SelectItem}>
                      <i className={classnames(styles.flag, styles[`flag-${shop.site}`])}></i>
                      <span className={styles.site}>{shop.site}</span>
                      <span className={styles.shopName}>{shop.shopName}</span>
                    </div>
                  </Option>
                );
              }
            })
        }
      </Select>
  );
};

export default connect(({ global, loading }: IConnectState) => ({
  shop: global.shop,
  loading: loading,
}))(ShopSelector);
