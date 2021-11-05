import React from 'react';
import { Link } from 'umi';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';

interface IProps {
  clickmessageIcon: () => void;
  visible: boolean;
  setMessagedata: Function;
  setMessageProfit: Function;
  setMessageAd: Function;
  messagedata: boolean;
  messageprofit: boolean;
  messagead: boolean;
  isShow: boolean;
  messageLength: string[];
  marginRight: number;
}
const Message: React.FC<IProps> = props => {
  const {
    clickmessageIcon,
    visible,
    setMessagedata,
    setMessageProfit,
    setMessageAd,
    messagedata,
    messageprofit,
    messagead,
    isShow,
    messageLength,
    marginRight,
  } = props;

  return (
    <div className={styles.messageIcon} style={{ marginRight: `${marginRight}px` }}>
      <div className={styles.iconfont} onClick={clickmessageIcon}>
        <div
          className={styles.qty}
          style={{ 
            display: visible ? 'none' : 'block',
          }}
        >
          {messageLength.length}</div>
        <Iconfont 
          type="icon-message1" 
          className={`
          ${styles.icon} 
          ${visible ? styles.active : ''}
          ${isShow ? '' : 'none'}
        `}
        />
      </div>

      <div 
        className={`${styles.messageBox}`} 
        style={{
          display: visible ? 'block' : 'none',
        }}
      >
        <div className={`${styles.base} ${styles.data}`} style={{
          display: messagedata ? 'block' : 'none',
          marginTop: '10px',
        }}>
          <p>为保证数据完整，请导入每天的Business Report</p>
          <footer>
            <span className={styles.ignore} 
              onClick={() => setMessagedata(!messagedata)}>忽略</span>
            <Link className={styles.to} to="/report/import" target="_blank">去导入</Link>
          </footer>
        </div>

        <div className={`${styles.base} ${styles.profit}`} style={{
          display: messageprofit ? 'block' : 'none',
        }}>
          <p>为提高利润统计的准确性，请在商品列表导入成本、运费</p>
          <footer>
            <span className={styles.ignore}
              onClick={() => setMessageProfit(!messageprofit)}>忽略</span>
            <Link className={styles.to} to="/product/list" target="_blank">去导入</Link>
          </footer>
        </div>

        <div className={`${styles.base} ${styles.ad}`} style={{
          display: messagead ? 'block' : 'none',
        }}>
          <p>未完成广告授权</p>
          <footer>
            <span className={styles.ignore} 
              onClick={() => setMessageAd(!messagead)}>忽略</span>
            <Link className={styles.to} to="/shop/list" target="_blank">去授权</Link>
          </footer>
        </div>
      </div>
    </div>
  );
};
// eslint-disable-next-line eol-last
export default Message;