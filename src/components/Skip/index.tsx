/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-18 10:16:12
 * 
 * N秒后跳转到指定页面
 */
import React from 'react';
import styles from './index.less';

import { Iconfont } from '@/utils/utils';
import {
  history,
} from 'umi';
import {
  Modal,
} from 'antd';

export interface IProps {
  title?: string; // 成功提示的信息
  seconds?: number; // 多少秒后跳转
  pageName?: string; // 跳转的页面
  toPath?: string; // 路径
}

const Skip = (props?: IProps) => {
  const {
    title = '创建成功！',
    seconds = 3,
    pageName = '首页',
    toPath = '/',
  } = props || {} ;
  let timer: any = null; // eslint-disable-line
  
  let secondsToGo = seconds;
  const modal = Modal.success({
    title: '',
    content: <><Iconfont type="icon-duigou1" className={styles.successIcon} />{title} {secondsToGo} 秒后跳转到{pageName}</>,
    okText: '立即跳转',
    className: styles.modal,
    onOk() {
      clearInterval(timer);
      modal.destroy();
      history.push(toPath);
    },
  });
  
  timer = setInterval(() => {
    secondsToGo -= 1;

    if (secondsToGo <= 0) {
      clearInterval(timer);
      modal.destroy();
      history.push(toPath);
    }

    modal.update({
      content: <><Iconfont type="icon-duigou1" className={styles.successIcon} />{title} {secondsToGo} 秒后跳转到{pageName}</>,
    });
  }, 1000);

};

export default Skip;
