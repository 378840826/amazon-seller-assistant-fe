/**
 * 会员升级
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Spin } from 'antd';
import { IConnectState } from '@/models/connect';
import { getPageQuery } from '@/utils/utils';
import { vipLevelDict } from '@/models/vip';
import classnames from 'classnames';
import styles from './index.less';

const MyVip: React.FC = () => {
  const dispatch = useDispatch();
  const qs = getPageQuery();
  const buyLevel = Number(qs.level);
  useEffect(() => {
    dispatch({
      type: 'vip/fetchMyVipInfo',
    });
  }, [dispatch]);
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['vip/fetchMyVipInfo'];
  const page = useSelector((state: IConnectState) => state.vip);
  const { data: { level, remainDays, isBilledAnnually } } = page;
  console.log(isBilledAnnually);
  const myVipLevel = vipLevelDict[String(level)];

  // 确定购买的会员等级
  let certainBuyLevel = -1;
  if (buyLevel) {
    certainBuyLevel = buyLevel;
    // 容错
    if (buyLevel < level) {
      certainBuyLevel = level;
    } else if (buyLevel > 3) {
      certainBuyLevel = 3;
    }
  } else {
    // 如果没有 buyLevel 参数，默认升 1 级
    certainBuyLevel = level + 1;
  }
  console.log(certainBuyLevel);
  

  // 卡片点击
  const handleClick = (key: string) => {
    console.log('click', key);
  };

  // 单个卡片，参数对应 models 中 vipLevelDict
  const createCard = (option: {
    name: string;
    month: {
      price: number;
      originalPrice: number;
    };
    year: {
      price: number;
      originalPrice: number;
    };
    unit: 'month' | 'year';
    active?: boolean;
  }) => {
    const { name, unit, active } = option;
    const priceObj = option[unit];
    const unitDict = {
      month: '月',
      year: '年',
    };
    return (
      <div
        className={classnames(styles.card, active ? styles.active : '')}
        key={priceObj.price}
        onClick={() => handleClick(`${priceObj.price}`)}
      >
        <div className={styles.cardTitle}>{name}</div>
        <div className={styles.price}>
          <span>{priceObj.price}</span>元/{unitDict[unit]}
        </div>
        <div className={styles.originalPrice}>原价：{priceObj.originalPrice}元/{unitDict[unit]}</div>
      </div>
    );
  };

  // 续费/升级 卡片
  const renderCard = () => {
    const arr: JSX.Element[] = [];
    Object.keys(vipLevelDict).forEach((key) => {
      Number(key) > 0 && arr.push(
        <div className={styles.cardGroup} key={key}>
          {
            createCard({
              unit: 'month',
              ...vipLevelDict[key],
            })
          }
          {
            createCard({
              unit: 'year',
              ...vipLevelDict[key],
            })
          }
        </div>
      );
    });
    return <div className={styles.upgradeContainer}>{arr.map(card => card)}</div>;
  };

  return (
    <Spin spinning={loading} size="large">
      <div className={classnames(styles.page)}>
        <div className={styles.vipInfo}>
          <img src={myVipLevel.icon} alt="" />
          <div className={styles.vipLevel}>
            <div className={styles.vipName}>{myVipLevel.name}</div>
            <div>
              <span>当前会员等级</span>
              <span className={styles.remainDays}>
                有效期剩余：
                {
                  remainDays >= 0
                    ? <span className={styles.remainDaysNumber}>{remainDays}天</span>
                    : <>{remainDays}天</>
                }
              </span>
            </div>
          </div>
        </div>
        <div className={styles.buyVip}>
          <div className={styles.title}>会员升级</div>
          { renderCard() }
          <div></div>
        </div>
      </div>
    </Spin>
  );
};

export default MyVip;
