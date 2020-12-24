import React from 'react';
import { Iconfont } from '@/utils/utils';
import { useDispatch } from 'umi';
import DragPart from '../DragPart';
import styles from './index.less';
interface IReplayPage{
  request: (params: API.IParams) => void;
}
const ReplayPage: React.FC<IReplayPage> = ({ request }) => {
  const dispatch = useDispatch();
  const goBack = (id: number) => {
    dispatch({
      type: 'mail/modifyInboxId',
      payload: id,
    });
  };
  
  return (
    <div className={styles.tablePadding}>
      <p onClick={() => goBack(-1)} className={styles.back}>
        <Iconfont className={styles.icon_back} type="icon-zhankai"/>
        <span>返回</span>
      </p>
      <div style={{ paddingBottom: '20px' }}>
        <div className={styles.down_part}>
          <DragPart request={request}/>
        </div>
      </div>
    </div>
  );
};
export default ReplayPage;

