import React from 'react';
import styles from './index.less';
// import {
//   productListRouter,
// } from '@/utils/routes';
import { Iconfont } from '@/utils/utils';
import {
  history,
} from 'umi';
import {
  Modal,
} from 'antd';

interface IProps {
  title: string;
  seconds?: number;
}

const Skip = (props: IProps) => {
  const {
    title = '创建成功！',
    seconds = 3,
  } = props;
  
  let secondsToGo = seconds;
  const modal = Modal.success({
    title: '',
    content: <><Iconfont type="icon-duigou1" className={styles.successIcon} />{title} {secondsToGo} 秒后跳转到商品列表页面</>,
    okText: '立即跳转',
    className: styles.modal,
    onOk() {
      // history.push(productListRouter);
      history.goBack();
    },
  });
  const timer = setInterval(() => {
    secondsToGo -= 1;
    modal.update({
      content: <><Iconfont type="icon-duigou1" className={styles.successIcon} />{title} {secondsToGo} 秒后跳转到商品列表页面</>,
    });
  }, 1000);
  setTimeout(() => {
    clearInterval(timer);
    modal.destroy();
    // history.push(productListRouter);
    history.goBack();
  }, secondsToGo * 1000);
};

export default Skip;
