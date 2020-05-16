import React from 'react';
import Link from 'umi/link';
import styles from './index.less';
import { Button } from 'antd';
import { Iconfont } from '@/utils/utils';

interface IProps {
  name: string;
}

const Home: React.FC<IProps> = function(props) {
  const { name } = props;
  return (
    <div className={styles.homeContainer}>
      <Button type="primary">Primary</Button>
      <h1 className="h1">Page index</h1>
      <p>这里是首页</p>
      {name}
      <Link to="/user-center">go to /users-center</Link>
      <Iconfont type="icon-duigou1" />
    </div>
  );
};

export default Home;
