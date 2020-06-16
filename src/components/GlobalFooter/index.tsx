import React from 'react';
import { Link } from 'umi';
import styles from './index.less';
import classnames from 'classnames';
interface IGlobalFooter{
  className?: string;//fixedFooter 设置为display:fixed之后的样式
}
const GlobalFooter: React.FC<IGlobalFooter> = (props) => {
  const { className } = props;
  return (
    <>
      <div className={classnames(styles.footerContainer, className)}>
        <p className={styles.first}>
          <span><Link to="/">更新日志</Link></span>
          <span><Link to="/">Privacy Notice</Link></span>
        </p>
        <p className={styles.second}>技术支持： support@amzics.com</p>
        <p className={styles.third}>
          Copyright 2017 - 2018 All Rights Reserved | Powered by amzics.cn
        </p>
      </div>
    </>
  );

};
export default GlobalFooter;
