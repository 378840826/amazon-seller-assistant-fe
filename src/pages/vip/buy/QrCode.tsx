/**
 * 微信支付二维码
 */
import React from 'react';
import { Spin } from 'antd';
import QRCode from 'qrcode.react';
import { Iconfont } from '@/utils/utils';
import wePayLogo from '@/assets/vip/wePayLogo.png';
import classnames from 'classnames';
import styles from './index.less';

interface IProps {
  checked: boolean;
  loading?: boolean;
  codeUrl: string;
}

const QrCode: React.FC<IProps> = props => {
  const { checked, loading, codeUrl } = props;
  return (
    <div className={styles.qrCodeContainer}>
      <div className={classnames(styles.qrCode, checked ? styles.qrCodeChecked : '')}>
        {
          checked
            ?
            <Spin spinning={loading} size="large">
              <QRCode
                size={130}
                value={codeUrl}
              />
            </Spin>
            :
            <>
              <QRCode
                size={130}
                value="请先阅读并勾选会员协议"
              />
              <div className={styles.qrCodeShelter}>
                <Iconfont type="icon-tishi2" className={styles.icon} />
                <div>
                  请勾选会员协议
                </div>
              </div>
            </>
        }
      </div>
      <img src={wePayLogo} className={styles.wePayLogo} />
    </div>
  );
};

export default QrCode;
