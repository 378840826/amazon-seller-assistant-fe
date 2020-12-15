/**
 * 会员续费
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Spin, Checkbox } from 'antd';
import { IConnectState } from '@/models/connect';
import { typeOfFeeToChineseDict } from '@/models/vip';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import QrCode from './QrCode';
import Agreement from './Agreement';
import Success from './Success';
import MyVipInfo from '../components/MyVipInfo';
import classnames from 'classnames';
import styles from './index.less';

const VipRenew: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'vip/fetchRenewInfo',
    });
  }, [dispatch]);
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const pageLoading = loadingEffect['vip/fetchRenewInfo'];
  const qrCodeLoading = loadingEffect['vip/fetchRenewCodeUrl'];
  const page = useSelector((state: IConnectState) => state.vip);
  const {
    renewInfo: {
      info: { memberLevel, validPeriod, vipList, seniorVipList, extremeVipList },
      payStatus, codeUrl, orderId,
    },
  } = page;
  const usableVipList = [vipList, seniorVipList, extremeVipList].find(list => {
    return list.length !== 0;
  });

  // 轮询支付状态
  useEffect(() => {
    orderId && dispatch({
      type: 'vip/pollPayStatus-start',
      payload: { orderId, type: 'renew' },
    });
    // 卸载时停止
    return () => {
      dispatch({
        type: 'vip/pollPayStatus-stop',
      });
    };
  }, [dispatch, orderId]);

  useEffect(() => {
    // 支付成功后停止轮询, 延时跳转至我的会员
    if (payStatus === true) {
      dispatch({
        type: 'vip/pollPayStatus-stop',
      });
      setTimeout(() => {
        window.location.href = './membership';
      }, 3000);
    }
  }, [dispatch, payStatus]);
  
  // 选中的卡片, 1：月费 2：年费
  const [activeCardType, setActiveCardType] = useState<string>('2');
  // 勾选协议
  const [checked, setChecked] = useState<boolean>(false);
  // 协议弹窗显示
  const [agreementVisible, setAgreementVisible] = useState<boolean>(false);

  // 获取 codeUrl
  useEffect(() => {
    memberLevel && dispatch({
      type: 'vip/fetchRenewCodeUrl',
      payload: {
        memberLevel,
        typeOfFee: activeCardType,
        purchaseType: 3,
        price: usableVipList?.find(vip => vip.typeOfFee === activeCardType)?.currentPrice,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, activeCardType, memberLevel]);
  
  // 会员协议勾选 
  const handleChange = ({ target: { checked } }: CheckboxChangeEvent) => {
    setChecked(checked);
  };

  // 卡片选择
  const handleClickCard = (typeOfFee: string) => {
    // 避免混乱
    !qrCodeLoading && setActiveCardType(typeOfFee);
  };

  // 单个卡片
  const createCard = (info: {
    memberLevel: string;
    currentPrice: number;
    originalPrice: number;
    typeOfFee: string;
  }) => {
    const { memberLevel, currentPrice, originalPrice, typeOfFee } = info;
    const active = activeCardType === typeOfFee;
    return (
      <div
        className={
          classnames(styles.card, active ? styles.active : '', qrCodeLoading && !active ? styles.disabled : '')
        }
        key={currentPrice}
        onClick={() => handleClickCard(typeOfFee)}
      >
        <div className={styles.cardTitle}>{memberLevel}</div>
        <div className={styles.price}>
          <span>{currentPrice}</span>元/{typeOfFeeToChineseDict[typeOfFee]}
        </div>
        <div className={styles.originalPrice}>
          原价：{originalPrice}元/{typeOfFeeToChineseDict[typeOfFee]}
        </div>
      </div>
    );
  };

  // 续费卡片
  const renderCard = () => {
    return (
      <div className={styles.renewContainer}>
        { usableVipList?.map(info => createCard(info)) }
      </div>
    );
  };

  return (
    <Spin spinning={pageLoading} size="large">
      <div className={classnames(styles.page, styles.renewPage)}>
        {
          payStatus
            ? <Success />
            : 
            <>
              <div className={styles.vipInfo}>
                <MyVipInfo memberLevel={memberLevel} validPeriod={validPeriod} />
              </div>
              <div className={styles.buyVip}>
                <div className={styles.title}>会员续费</div>
                { renderCard() }
                <div className={styles.payment}>
                  <div className={styles.payPrice}>
                    实付：
                    <span className={styles.price}>
                      {usableVipList?.find(vip => vip.typeOfFee === activeCardType)?.currentPrice}元
                    </span>
                    <span className={styles.secondary}>（付款成功后，立即生效）</span>
                  </div>
                  <Checkbox onChange={handleChange}>
                    <span className={styles.secondary}>本人已阅且同意</span>
                  </Checkbox>
                  <span className={styles.protocol} onClick={() => setAgreementVisible(true)}>
                    会员协议
                  </span>
                  <QrCode checked={checked} loading={qrCodeLoading} codeUrl={codeUrl || '网络有点问题，请稍后再试'} />
                </div>
              </div>
            </>
        }
      </div>
      <Agreement visible={agreementVisible} onCancel={() => setAgreementVisible(false)} />
    </Spin>
  );
};

export default VipRenew;
