/**
 * 会员升级
 */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import { Spin, Checkbox } from 'antd';
import { IConnectState } from '@/models/connect';
import { getPageQuery, day } from '@/utils/utils';
import { vipLevelToNumberDict, vipNumberToLevelDict, typeOfFeeToChineseDict } from '@/models/vip';
import Success from './Success';
import Agreement from './Agreement';
import QrCode from './QrCode';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import MyVipInfo from '../components/MyVipInfo';
import classnames from 'classnames';
import styles from './index.less';

// 获取实付价格和计算公式
const geyActualPrice: (props: {
  // 新等级价格
  newLevelPrice: number;
  // 用户当前会员等级价格
  currentPrice: number;
  // 购买类型 月/年 1/2
  typeOfFee: string;
  // 当前类型
  oldTypeOfFee: string | null;
  // 当前会员等级有效期剩余天数
  validPeriod: number;
}) => {
  // 实付价格
  price: string;
  // 实付价格的计算过程
  equation: string;
  // 增加的有效期天数
  addValidPeriod: number;
  // 延期后的到期日
  expiringDate: string;
} = buyInfo => {
  const { newLevelPrice, currentPrice, typeOfFee, oldTypeOfFee, validPeriod } = buyInfo;
  const ms = 86400000;
  const currentTimestamp = new Date().getTime();
  let price = 0;
  let equation = '';
  let oldDays = 0;
  let buyDays = 0;
  if (typeOfFee === '1') {
    buyDays = 30;
  } else if (typeOfFee === '2') {
    buyDays = 365;
  }
  if (oldTypeOfFee === '1') {
    oldDays = 30;
  } else if (oldTypeOfFee === '2') {
    oldDays = 365;
  } else {
    // 非付费会员(普通会员)
    // 到期日
    const expiringDate = day.getNowFormatTime('YYYY-MM-DD', currentTimestamp + buyDays * ms);
    return {
      price: newLevelPrice.toFixed(2),
      equation,
      addValidPeriod: buyDays,
      expiringDate,
    };
  }
  if (validPeriod < buyDays) {
    // 补齐费用 = 新等级费用-（原等级费用/oldDays*剩余天数
    price = newLevelPrice - (currentPrice / oldDays) * validPeriod;
    equation = `${newLevelPrice} - (${currentPrice} / ${oldDays}) * ${validPeriod}`;
  } else {
    // 补齐费用 =（新等级费用/buyDays-原等级费用/oldDays*剩余天数
    price = (newLevelPrice / buyDays - currentPrice / oldDays) * validPeriod;
    equation = `(${newLevelPrice} / ${buyDays} - ${currentPrice} / ${oldDays}) * ${validPeriod}`;
  }
  // 增加的有效期天数
  const addValidPeriod = validPeriod < buyDays ? buyDays - validPeriod : 0;
  // 延期后的到期日
  let expiringDate = '';
  if (addValidPeriod > 0) {
    const expiringDateTimestamp = currentTimestamp + (addValidPeriod + validPeriod) * ms;
    expiringDate = day.getNowFormatTime('YYYY-MM-DD', expiringDateTimestamp);
  }
  return {
    price: price.toFixed(2),
    equation,
    addValidPeriod,
    expiringDate,
  };
};

const VipUpgrade: React.FC = () => {
  const dispatch = useDispatch();
  const qs = getPageQuery();
  const buyLevel = Number(qs.level);
  useEffect(() => {
    dispatch({
      type: 'vip/fetchUpgradeInfo',
    });
  }, [dispatch]);
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['vip/fetchUpgradeInfo'];
  const qrCodeLoading = loadingEffect['vip/fetchUpgradeCodeUrl'];
  const page = useSelector((state: IConnectState) => state.vip);
  const {
    upgradeInfo: {
      info: {
        memberLevel,
        typeOfFee: oldTypeOfFee,
        validPeriod,
        price: currentPrice,
        vipList,
        seniorVipList,
        extremeVipList,
      },
      payStatus, codeUrl, orderId,
    },
  } = page;
  const usableVipList = vipList.concat(seniorVipList, extremeVipList);
  const level = vipLevelToNumberDict[memberLevel];
  // 勾选协议
  const [checked, setChecked] = useState<boolean>(false);
  // 协议弹窗显示
  const [agreementVisible, setAgreementVisible] = useState<boolean>(false);

  // 轮询支付状态
  useEffect(() => {
    orderId && dispatch({
      type: 'vip/pollPayStatus-start',
      payload: { orderId, type: 'upgrade' },
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

  // 通过 qs 确定购买的会员等级
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
    // 如果没有 buyLevel 参数，默认升最高级
    certainBuyLevel = 3;
  }
  // 选中的卡片
  const [activeCard, setActiveCard] = useState({
    memberLevel: vipNumberToLevelDict[certainBuyLevel],
    typeOfFee: '2',
    price: 0,
  });
  
  // 选中卡片的价格
  const activeCardPrice = activeCard.price || usableVipList?.find(
    vip => vip.typeOfFee === '2' && vip.memberLevel === vipNumberToLevelDict[certainBuyLevel]
  )?.currentPrice;

  // 获取 codeUrl
  useEffect(() => {
    memberLevel && dispatch({
      type: 'vip/fetchUpgradeCodeUrl',
      payload: {
        memberLevel,
        typeOfFee: activeCard.typeOfFee,
        purchaseType: memberLevel === '普通会员' ? 1 : 2,
        price: 0,
      },
    });
  }, [dispatch, activeCard, memberLevel]);

  // 卡片点击
  const handleClickCard = (typeOfFee: string, memberLevel: string, currentPrice: number) => {
    // 避免混乱，加载完成才能再点击
    !qrCodeLoading && setActiveCard({
      memberLevel,
      typeOfFee,
      price: currentPrice,
    });
  };

  // 会员协议勾选 
  const handleChange = ({ target: { checked } }: CheckboxChangeEvent) => {
    setChecked(checked);
  };

  // 实付价格/公式/有效期/日期
  const actualAndResult = geyActualPrice({
    // 新等级价格
    newLevelPrice: Number(activeCard.price || activeCardPrice),
    // 用户当前会员等级价格
    currentPrice,
    // 购买的费用类型，月/年 1/2
    typeOfFee: activeCard.typeOfFee,
    // 当前的费用类型
    oldTypeOfFee,
    // 当前会员等级有效期剩余天数
    validPeriod: Number(validPeriod),
  });

  // 单个卡片
  const createCard = (info: {
    memberLevel: string;
    currentPrice: number;
    originalPrice: number;
    typeOfFee: string;
  }) => {
    const { memberLevel, currentPrice, originalPrice, typeOfFee } = info;
    const active = typeOfFee === activeCard.typeOfFee && memberLevel === activeCard.memberLevel;
    return (
      <div
        className={
          classnames(styles.card, active ? styles.active : '', qrCodeLoading && !active ? styles.disabled : '')
        }
        key={currentPrice}
        onClick={() => handleClickCard(typeOfFee, memberLevel, currentPrice)}
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

  // 升级卡片
  const renderCard = () => {
    // 2个/4个卡片时特殊处理布局
    const twoClassName = usableVipList.length === 2 ? styles.upgradeContainerTwo : '';
    const fourClassName = usableVipList.length === 4 ? styles.upgradeContainerFour : '';
    return (
      <div className={classnames(styles.upgradeContainer, twoClassName, fourClassName)}>
        { usableVipList.map(info => createCard(info))}
      </div>
    );
  };

  return (
    <Spin spinning={loading} size="large">
      <div className={classnames(styles.page)}>
        {
          payStatus
            ? <Success />
            :
            <>
              <div className={styles.vipInfo}>
                <MyVipInfo memberLevel={memberLevel} validPeriod={validPeriod} />
              </div>
              <div className={styles.buyVip}>
                <div className={styles.title}>会员升级</div>
                { renderCard() }
                <div className={styles.payment}>
                  <div className={styles.payPrice}>
                    实付：
                    {
                      actualAndResult.equation
                        ?
                        <>
                          <span className={styles.actualPrice}>
                            { actualAndResult.price }元
                            <span className={styles.equation}>
                              = {actualAndResult.equation}
                            </span>
                          </span>
                          <div className={styles.secondary}>
                            （升级当日生效，
                            {
                              actualAndResult.addValidPeriod
                                ?
                                `有效期延长${actualAndResult.addValidPeriod}天
                                (${actualAndResult.expiringDate}到期)，`
                                : null
                            }
                            需补齐差价）
                          </div>
                        </>
                        :
                        <>
                          <span className={styles.actualPrice}>{actualAndResult.price}元</span>
                          <div className={styles.secondary}>
                            （付费成功后立即生效，有效期至{actualAndResult.expiringDate}）
                          </div>
                        </>
                    }
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

export default VipUpgrade;
