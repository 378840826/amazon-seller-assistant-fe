import React from 'react';
import Link from 'umi/link';
import styles from './index.less';
import { Button } from 'antd';
import { Iconfont } from '@/utils/utils';
// import { queryCurrent } from '@/services/user';

interface IProps {
  name: string;
}

const Home: React.FC<IProps> = function(props) {
  // queryCurrent().then(res => {
  //   sessionStorage.setItem('test_a', JSON.stringify(res));
  //   const { data } = res;
  //   console.log('data', data);
  // });
  const { name } = props;
  return (
    <div className={styles.normal}>
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
