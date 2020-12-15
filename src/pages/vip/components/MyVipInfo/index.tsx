/**
 * 会员等级，剩余天数等信息
 */
import React from 'react';
import { vipIconDict } from '@/models/vip';
import { Link } from 'umi';
import classnames from 'classnames';
import styles from './index.less';

interface IProps {
  memberLevel: string;
  validPeriod: string;
  renewBtn?: boolean;
  level?: number;
}

const MyVipInfo: React.FC<IProps> = props => {
  const { memberLevel, validPeriod, renewBtn, level } = props;
  // 是否快过期
  const isExpiringSoon = Number(validPeriod) > 7 ? false : true;
  return (
    <div className={styles.container}>
      <img src={vipIconDict[memberLevel]} alt="" />
      <div className={styles.vipLevel}>
        <div className={styles.vipName}>{memberLevel}</div>
        <div>
          <span>当前会员等级</span>
          <span className={styles.validPeriod}>
            有效期剩余：
            {
              Number(validPeriod) >= 0
                ?
                <span
                  className={classnames(styles.remainDaysNumber, isExpiringSoon ? styles.isExpiringSoon : '')}>
                  {validPeriod}天
                </span>
                : <>{validPeriod}天</>
            }
          </span>
          {
            renewBtn && level
              ? <Link className={styles.btnRenew} to={`/vip/renew`}>续费</Link>
              : null
          }
        </div>
      </div>
    </div>
  );
};

export default MyVipInfo;
