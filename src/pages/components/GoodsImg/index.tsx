/**
 * 图片加载失败显示默认图片
 */
import React from 'react';
import styles from './index.less';
import classnames from 'classnames';

interface IProps {
  className?: React.CSSProperties;
  src: string;
  alt?: string;
  width: number | string;
}

const Img: React.FC<IProps> = (props) => {
  const { src, alt, width, className } = props;

  return (
    <div 
      className={classnames(styles.container, className)} 
      style={{ width: width, height: width }}
    >
      <img
        src={src}
        alt={alt}
        className={styles.img}
        style={{ minWidth: width }}
      />
    </div>
  );
};

export default Img;
