/**
 * 会员购买协议
 */
import React from 'react';
import { Modal } from 'antd';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: () => void;
}

const Agreement: React.FC<IProps> = props => {
  const { visible, onCancel } = props;
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      className={styles.agreement}
      width={1240}
    >
      <div>
        <p>
          • 当月未用完的次数，月底清零；<br/>
          • 会员等级是针对主账号的，子账号的等级=主账号的等级；子账号没有权限购买会员或者升级会员；<br />
          • 会员到期后：数据停止更新；直至会员续费成功；<br />
          • 按月付费，有效期为30天，按年付费，有效期为365天；<br />
          • 原则上付费后不退款，不找零，会员有效期间，不降会员等级；<br />
          • 普通会员免费，有效期为14天；<br />
        </p>
        <h4>普通会员购买VIP</h4>
        <p>
          • 普通会员如果付费购买VIP、高级VIP或至尊VIP，付款后，权益会直接升级到相应级别；会员有效期从付费成功当天算起；<br />
          • 会员过期后再购买VIP、高级VIP或至尊VIP，相当于重新开会员。高级别的会员过期后，可以买低级别的会员；<br />
        </p>
        <h4>VIP续费</h4>
        <p>
          • 每月提前7天全局弹窗提示用户续费；<br />
          • 过期后续费，会员有效期重新算；会员有效期从付费成功当天算起；<br />
          • 过期前续费，会员有效期顺延，例如：6.10号过期，1号续费1个月，那么续费后有效期是7.11；按年续费同理；可以连续多次按月续费或按年续费，会员有效期累加；<br />
          • 按年续费，按月续费，会员等级都不变；<br />
        </p>
        <h4>VIP升级</h4>
        <p>
          • 普通会员、VIP会员、高级VIP会员，升级更高级别的会员；SKU/ASIN/店铺个数的限额，直接升级到相应级别；月使用次数升级至相应级别；<br />
          • 月卡会员能升级至月卡会员或年卡会员，年卡会员只能升级至年卡会员；例如：月卡VIP只能升级至月卡/年卡高级VIP或者月卡/年卡至尊VIP；<br />
          • 当日生效；当月剩余的使用次数清零，不顺延至下一个月；SKU/ASIN/店铺个数的限额，直接升级到相应级别；<br />
          • 需按天补齐差价，若升级至月卡，当剩余天数＜30，补齐费用=新等级费用-（原等级费用/天数）*剩余天数。
            当剩余天数≥30，补齐费用=（新等级费用/天数-原等级费用/天数）*剩余天数。<br />
          • 若升级至年卡，当剩余天数＜365，补齐费用=新等级费用-（原等级费用/天数）*剩余天数
            当剩余天数≥365，补齐费用=（新等级费用/天数-原等级费用/天数）*剩余天数。<br />
          • 例如，<br />
          • 月卡VIP，剩余天数n天，升级至月卡高级VIP，若n＜30，补齐费用=499-（299/30）*n；若n≥30，补齐费用=（499/30-299/30）*n；<br />
          • 月卡VIP，剩余天数n天，升级至年卡高级VIP，若n＜365，补齐费用=4999-（299/30）*n；若n≥365，补齐费用=（4999/365-299/30）*n；
          <br />
          • 年卡VIP，剩余天数n天，升级至年卡高级VIP，若n＜365，补齐费用=4999-（2999/365）*n；若n≥365，补齐费用=（4999/365-2999/365）*n；
        </p>
      </div>
    </Modal>
  );
};

export default Agreement;
