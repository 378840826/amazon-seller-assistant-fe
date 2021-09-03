/**
 * 当前店铺未授权广告时的替代页面
 */
import React from 'react';
import { Link, useSelector } from 'umi';
import { Button, Spin } from 'antd';
import { IConnectState } from '@/models/connect';
import styles from './index.less';

interface IProps {
  storeName: string;
  marketplace: API.Site;
}

const Unauthorized: React.FC<IProps> = props => {
  const { storeName, marketplace } = props;
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loadingShopList = loadingEffect['global/fetchShopList']; 

  return (
    <div className={styles.container}>
      {
        loadingShopList
          ?
          <>
            <Spin size="large" />
            <p>正在获取店铺数据</p>
          </>
          :
          <>
            <div>
              店铺 <span>{marketplace} {storeName}</span> 未授权广告，请前往<Link to="/shop/list">店铺管理</Link>进行广告授权
            </div>
            <Button type="primary">
              <Link to="/shop/list">去授权</Link>
            </Button>
          </>
      }
    </div>
  );
};

export default Unauthorized;
