/**
 * 顶部通知条，用于重要的全局通知，如会员过期，店铺过期等
 */
import React from 'react';
import { Link, useSelector } from 'umi';
import { IConnectState } from '@/models/connect';
import styles from './index.less';

// 不需要显示过期店铺的页面路径
const hideShopAlertUrlArr = [
  '/users/login',
  '/users/password/forgot',
  '/users/send-email',
  '/users/active',
  '/center',
  '/vip/membership',
  '/vip/upgrade',
  '/vip/renew',
  '/vip/instructions',
  '/sub-account',
  '/shop/list',
  '/shop/bind',
  '/overview',
  '/overview/shop',
  '/',
  '/index/privacy',
  '/index/logs',
  '/index/crx',
];

interface IProps {
  // IndexLayout 时，页面是定宽居中的，要保持通知条的文字和页面内容左对齐，需要设置通知条宽度
  fixedWidth?: boolean;
}

const TopAlert: React.FC<IProps> = props => {
  const state = useSelector((state: IConnectState) => state);
  // 计算会员剩余有效期
  const dayMs = 86400000;
  const nowTimestamp = new Date().getTime();
  const expirationTimestamp = new Date(state.user.currentUser.memberExpirationDate).getTime();
  // 向上取整计算剩余天数
  const validPeriod = Math.ceil((expirationTimestamp - nowTimestamp) / dayMs);

  // vip 到期提示
  const renderVipAlert = () => {
    if (validPeriod > 7) {
      return;
    }
    const className = props.fixedWidth ? styles.fixedWidth : '';
    const days = (
      <span className={styles.vipValidPeriod}>
        { validPeriod > 0 ? validPeriod : 0 }天
      </span>
    );
    const vipLink = <Link to="/vip/menbership">续费&gt;&gt;</Link>;
    const text = validPeriod > 0 ? '为避免影响使用' : '部分功能已暂停更新数据';
    return (
      <div className={className}>
        会员有效期剩余：{days}，{text}，请及时{vipLink}
      </div>
    );
  };

  // 店铺过期提示
  const renderShopAlert = () => {
    if (
      hideShopAlertUrlArr.includes(window.location.pathname) ||
      !state.global.shop.current.tokenInvalid
    ) {
      return;
    }
    return (
      <div>
        该店铺授权已过期，请前往Seller Central的User Permission页面Enable授权并更新MWS Auth Token，
        去<Link to="/shop/list">更新&gt;&gt;</Link>
      </div>
    );
  };

  return (
    <div className={styles.topAlert}>
      { renderVipAlert() }
      { renderShopAlert() }
    </div>
  );
};

export default TopAlert;
