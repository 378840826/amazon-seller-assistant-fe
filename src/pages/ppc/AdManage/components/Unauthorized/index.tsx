/**
 * 当前店铺未授权广告时的替代页面
 */
import React from 'react';
import { Link } from 'umi';
import { Button } from 'antd';
import styles from './index.less';

interface IProps {
  storeName: string;
  marketplace: API.Site;
}

const Unauthorized: React.FC<IProps> = props => {
  const { storeName, marketplace } = props;

  return (
    <div className={styles.container}>
      <div>
        店铺 <span>{marketplace} {storeName}</span> 未授权广告，请前往<Link to="/shop/list">店铺管理</Link>进行广告授权
      </div>
      <Button type="primary">
        <Link to="/shop/list">去授权</Link>
      </Button>
    </div>
  );
};

export default Unauthorized;
