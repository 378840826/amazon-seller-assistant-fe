import React from 'react';
import { Iconfont } from '@/utils/utils';
import { useDispatch } from 'umi';
import DragPart from '../DragPart';
import styles from './index.less';

const ReplayPage = () => {
  const dispatch = useDispatch();
  const goBack = (id: number) => {
    dispatch({
      type: 'mail/modifyInboxId',
      payload: id,
    });
  };
  
  return (
    <div>
      <p onClick={() => goBack(-1)} className={styles.back}>
        <Iconfont className={styles.icon_back} type="icon-zhankai-"/>
        <span>返回</span>
      </p>
      <div className={styles.down_part_overflow}>
        <div className={styles.down_part}>
          <DragPart/>
        </div>
      </div>
    </div>
  );
};
export default ReplayPage;

