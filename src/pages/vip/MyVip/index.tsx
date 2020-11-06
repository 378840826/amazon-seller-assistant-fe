/**
 * 会员价格和等级说明
 */
import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch, Link } from 'umi';
import { Spin } from 'antd';
import { IConnectState } from '@/models/connect';
import { vipLevelDict } from '@/models/vip';
import diamond from '@/assets/vip/diamond.png';
import classnames from 'classnames';
import styles from './index.less';

const MyVip: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'vip/fetchMyVipInfo',
    });
  }, [dispatch]);
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['vip/fetchMyVipInfo'];
  const page = useSelector((state: IConnectState) => state.vip);
  console.log('page', page);
  const { data: { level, remainDays, residue, paymentHistory } } = page;
  const myVipLevel = vipLevelDict[String(level)];

  // 升级卡片
  const upgradeCard = () => {
    const result: ReactElement[] = [];
    Object.keys(vipLevelDict).forEach(key => {
      Number(key) > level && result.push(
        <div key={key} className={classnames(styles.card, styles[`vip${key}Card`])}>
          <div className={styles.name}>{vipLevelDict[key].name}</div>
          <Link className={styles.btnBuy} to={`/vip/upgrade?level=${key}`}>购买</Link>
        </div>
      );
    });
    return result;
  };
  
  return (
    <Spin spinning={loading} size="large">
      <div className={styles.page}>
        <div className={styles.vipInfoContainer}>
          <div className={styles.vipInfo}>
            <img src={myVipLevel.icon} alt=""/>
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
                {
                  level > 0
                    ? <Link className={styles.btnRenew} to={`/vip/renew?level=${level}`}>续费</Link>
                    : null
                }
              </div>
            </div>
          </div>
          {
            level < 3
              ?
              <div className={styles.upgradeVip}>
                <div className={styles.title}>升级</div>
                <div className={styles.upgradeVipCardContainer}>
                  { upgradeCard() }
                </div>
                <img src={diamond} alt="" />
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
              <tr>
                <td>绑定店铺</td>
                <td>{residue.mwsShop}</td>
              </tr>
              <tr>
                <td>广告授权店铺</td>
                <td>{residue.ppcShop}</td>
              </tr>
              <tr>
                <td>子账号</td>
                <td>{residue.subAccount}</td>
              </tr>
              <tr>
                <td>智能调价</td>
                <td>{residue.reprice}</td>
              </tr>
              <tr>
                <td>ASIN总览报表导出</td>
                <td>{residue.asinReport}</td>
              </tr>
              <tr>
                <td>ASIN动态监控</td>
                <td>{residue.asinMonitor}</td>
              </tr>
              <tr>
                <td>跟卖监控</td>
                <td>{residue.competitorMonitor}</td>
              </tr>
              <tr>
                <td>Review监控</td>
                <td>{residue.reviewMonitor}</td>
              </tr>
              <tr>
                <td>自动邮件</td>
                <td>{residue.autoMail}</td>
              </tr>
              <tr>
                <td>补货计划导出</td>
                <td>{residue.replenishmentExport}</td>
              </tr>
              <tr>
                <td>PPC托管</td>
                <td>{residue.ppcTrusteeship}</td>
              </tr>
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
                paymentHistory.map(item => (
                  <tr key={item.orderId}>
                    <td>{item.time}</td>
                    <td>{item.orderId}</td>
                    <td>{item.orderDetail}</td>
                    <td>{item.payment}</td>
                    <td>{item.cost.toFixed(2)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </Spin>
  );
};

export default MyVip;
