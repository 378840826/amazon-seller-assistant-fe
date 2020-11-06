/**
 * 会员续费
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Spin, Checkbox } from 'antd';
import { IConnectState } from '@/models/connect';
import { vipLevelDict } from '@/models/vip';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import wePayLogo from '@/assets/vip/wePayLogo.png';
import QRCode from 'qrcode.react';
import Agreement from './Agreement';
import classnames from 'classnames';
import styles from './index.less';

const VipRenew: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'vip/fetchMyVipInfo',
    });
    dispatch({
      type: 'vip/fetchRenewCodeUrl',
    });
  }, [dispatch]);
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const pageLoading = loadingEffect['vip/fetchMyVipInfo'];
  const qrCodeLoading = loadingEffect['vip/fetchRenewCodeUrl'];
  const page = useSelector((state: IConnectState) => state.vip);
  const { data: { level, remainDays }, renewCodeUrl } = page;
  const myVipLevel = vipLevelDict[String(level)];
  
  // 选中的卡片
  const [activeCardInfo, setActiveCardInfo] = useState({
    unit: 'year',
    price: myVipLevel.year.price,
  });
  // 勾选协议
  const [checked, setChecked] = useState<boolean>(false);
  // 协议弹窗显示
  const [agreementVisible, setAgreementVisible] = useState<boolean>(false);
  
  // 会员协议勾选 
  const handleChange = ({ target: { checked } }: CheckboxChangeEvent) => {
    setChecked(checked);
  };

  // 卡片选择
  const handleClickCard = (unit: string, price: number) => {
    // 避免混乱
    if (qrCodeLoading) {
      return;
    }
    setActiveCardInfo({ unit, price });
    dispatch({
      type: 'vip/fetchRenewCodeUrl',
      payload: { unit },
    });
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
        className={
          classnames(styles.card, active ? styles.active : '', qrCodeLoading && !active ? styles.disabled : '')
        }
        key={`${unit}-${priceObj.price}`}
        onClick={() => handleClickCard(unit, priceObj.price)}
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
    return (
      <div className={styles.renewContainer}>
        {[
          createCard({
            unit: 'month',
            ...vipLevelDict[level],
            active: activeCardInfo.unit === 'month',
          }),
          createCard({
            unit: 'year',
            ...vipLevelDict[level],
            active: activeCardInfo.unit === 'year',
          }),
        ]}
      </div>
    );
  };

  return (
    <Spin spinning={pageLoading} size="large">
      <div className={classnames(styles.page, styles.renewPage)}>
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
          <div className={styles.title}>会员续费</div>
          { renderCard() }
          <div className={styles.payment}>
            <div className={styles.payPrice}>
              实付：
              <span className={styles.price}>{activeCardInfo.price}元</span>
              <span className={styles.secondary}>（付款成功后，立即生效）</span>
            </div>
            <Checkbox onChange={handleChange}>
              <span className={styles.secondary}>本人已阅且同意</span>
            </Checkbox>
            <span className={styles.protocol} onClick={() => setAgreementVisible(true)}>会员协议</span>
            <div className={styles.qrCodeContainer}>
              <div className={classnames(styles.qrCode, checked ? styles.qrCodeChecked : '')}>
                {
                  checked
                    ?
                    <Spin spinning={qrCodeLoading} size="large">
                      <QRCode
                        size={130}
                        value={renewCodeUrl}
                      />
                    </Spin>
                    :
                    <QRCode
                      size={130}
                      value="请先阅读并勾选会员协议"
                    />
                }
              </div>
            </div>
            <img src={wePayLogo} className={styles.wePayLogo} />
          </div>
        </div>
      </div>
      <Agreement visible={agreementVisible} onCancel={() => setAgreementVisible(false)} />
    </Spin>
  );
};

export default VipRenew;
