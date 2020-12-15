/**
 * 会员价格和等级说明
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch, Link } from 'umi';
import { Spin } from 'antd';
import { IConnectState } from '@/models/connect';
import { IVipBuy, vipLevelToNumberDict } from '@/models/vip';
import MyVipInfo from '../components/MyVipInfo';
import classnames from 'classnames';
import styles from './index.less';

const MyVip: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'vip/fetchMyVipInfo',
    });
    dispatch({
      type: 'vip/fetchUpgradeInfo',
    });
  }, [dispatch]);
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['vip/fetchMyVipInfo'];
  const page = useSelector((state: IConnectState) => state.vip);
  const {
    data: { memberLevel, validPeriod, functionalSurplus, paymentRecords },
    upgradeInfo,
  } = page;
  const { info: { vipList, seniorVipList, extremeVipList } } = upgradeInfo;
  // 会员等级对应的 number
  const level = vipLevelToNumberDict[memberLevel];
  
  // 升级卡片
  const upgradeCard = () => {
    const list: IVipBuy[] = [];
    list.push(vipList[0], seniorVipList[0], extremeVipList[0]);
    return list.map(vipInfo => {
      if (!vipInfo) {
        return;
      }
      const { memberLevel } = vipInfo;
      const key = vipLevelToNumberDict[memberLevel];
      return (
        <div key={memberLevel} className={classnames(styles.card, styles[`vip${key}Card`])}>
          <div className={styles.name}>{memberLevel}</div>
          <Link 
            className={classnames(styles.btnBuy, styles[`btn${key}Buy`])}
            to={`/vip/upgrade?level=${key}`}
          >购买</Link>
        </div>
      );
    });
  };
  
  return (
    <Spin spinning={loading} size="large">
      <div className={styles.page}>
        <div className={styles.vipInfoContainer}>
          <div className={styles.vipInfo}>
            <MyVipInfo memberLevel={memberLevel} validPeriod={validPeriod} renewBtn level={level} />
          </div>
          {
            level < 3
              ?
              <div className={styles.upgradeVip}>
                <div className={styles.title}>升级</div>
                <div className={styles.upgradeVipCardContainer}>
                  { upgradeCard() }
                </div>
                <div className={styles.imgContainer}></div>
              </div>
              : null
          }
        </div>
        <div className={styles.residueContainer}>
          <div className={styles.title}>功能余量</div>
          <table>
            <tbody>
              <tr>
                <th>功能</th>
                <th>剩余次数</th>
              </tr>
              {
                functionalSurplus.map(fun => (
                  <tr key={fun.functionName}>
                    <td>{fun.functionName}</td>
                    <td>{fun.frequency}</td>
                  </tr>
                ))
              }
              <tr>
                <td>其他</td>
                <td>免费，不限次数</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.paymentHistoryContainer}>
          <div className={styles.title}>付费记录</div>
          <table>
            <tbody>
              <tr>
                <th>付款时间</th>
                <th>订单号</th>
                <th>订单详情</th>
                <th>支付方式</th>
                <th>支付金额(￥)</th>
              </tr>
              {
                paymentRecords.length
                  ?
                  paymentRecords.map(item => (
                    <tr key={item.orderNo}>
                      <td>{item.paymentTime}</td>
                      <td>{item.orderNo}</td>
                      <td>{item.orderInfo}</td>
                      <td>{item.paymentMethod}</td>
                      <td>{item.paymentAmount.toFixed(2)}</td>
                    </tr>
                  ))
                  :
                  <tr>
                    <td colSpan={5}>没有付款记录</td>
                  </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </Spin>
  );
};

export default MyVip;
