import React from 'react';
import GlobalFooter from '@/components/GlobalFooter';
import crxpage from '../../assets/crx/crxpage.png';
import chrome from '../../assets/crx/chrome.png';
import safe360 from '../../assets/crx/360safe.png';
import chrome360 from '../../assets/crx/360.png';
import classnames from 'classnames';
import styles from './index.less';

const CrxDownload: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.presentation}>
          <h4>功能介绍</h4>
          <p>1、支持批量Request Review；</p>
          <p>2、智能排除有Pending、Cancelled和有Refund的订单。</p>
          <img src={crxpage} />
        </div>
        <div className={styles.browser}>
          <h4>兼容浏览器</h4>
          <div>
            <img src={chrome} />
            <img src={safe360} />
            <img src={chrome360} />
          </div>
        </div>
        <div>
          <h4>安装说明</h4>
          <div className={styles.installExplain}>
            <div className={styles.installAppStore}>
              <div className={styles.installTitle}>扩展程序商店安装</div>
              <span className={classnames(styles.btn, styles.btnChrome)}>
                <a href="https://chrome.google.com/webstore/detail/%E5%AE%89%E7%9F%A5%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%8D%96%E5%AE%B6%E5%8A%A9%E6%89%8B/ondhhjilddbeeabngdkhobhmjgcmgamc" target="_blank" rel="noreferrer">Chrome（需科学上网）</a>
              </span>
              <span className={classnames(styles.btn, styles.btnSafe360)}>
                <a href="https://ext.chrome.360.cn/webstore/detail/nebhcedgdekmefddagbjijliojepmoea" target="_blank" rel="noreferrer">360</a>
              </span>
              <span className={classnames(styles.btn, styles.btnChrome360)}>
                <a href="https://ext.chrome.360.cn/webstore/detail/nebhcedgdekmefddagbjijliojepmoea" target="_blank" rel="noreferrer">360极速</a>
              </span>
            </div>
            <div>
              <div className={styles.installTitle}>本地安装</div>
              <div className={styles.installStep}>
                <span>步骤1：下载安装包</span>
                <span>步骤2：在文件夹点击安装包，拖动到360/360极速等浏览器</span>
                <span>步骤3：点击确定添加，即可完成安装</span>
              </div>
              <span className={classnames(styles.btn, styles.btnLocal)}>
                <a href="/crx-download" download>下载</a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerContainer}>
        <GlobalFooter className={styles.footer} />
      </div>
    </div>
  );
};

export default CrxDownload;
