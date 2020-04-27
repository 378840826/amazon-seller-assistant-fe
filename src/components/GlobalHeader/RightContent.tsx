import React from 'react';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight: React.FC = () => {
  return (
    <div className={styles.right}>
      <Avatar />
    </div>
  );
};

export default GlobalHeaderRight;
