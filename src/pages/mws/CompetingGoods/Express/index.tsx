import React, { useState } from 'react';
import styles from './index.less';

/**
 * 发货方式 
 */
interface IProps {
  method: string;
  style?: React.CSSProperties;
}

const Express: React.FC<IProps> = (props) => {
  const {
    method,
    style,
  } = props;
  const [text] = useState<string>(method || '');
  
  return <span 
    style={style}
    className={`
      ${text.toUpperCase() === 'FBM' ? styles.fbm : styles.fba} 
      ${text === '' || text === undefined ? '' : styles.border }
      `
    }>
    {text.toUpperCase()}
  </span>;
};


export default Express;
