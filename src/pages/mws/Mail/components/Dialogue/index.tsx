import React from 'react';
import { Iconfont } from '@/utils/utils';
import classnames from 'classnames';
import styles from './index.less';
interface IDialogue{
  item: API.IParams;
}

const Dialogue: React.FC<IDialogue> = ({ item }) => {
  const { type, time, content, status } = item;
  return (
    
    <div className={classnames(styles.dialogue, styles[type])}>
      { type === 'me' ? 
        <>
          {status === 'fail' ? <Iconfont className={styles.icon_error} type="icon-cuowutishi1"/> : ''}
         
          <div className={styles.main_content}>
            <div className={styles.date}>{time}</div>
            <div dangerouslySetInnerHTML={{ __html: content }} className={styles.content}>
              {/* {content} */}
            </div>
          </div>
          <Iconfont className={styles.icon_person} type="icon-kefu"/>
        </>
        :
        <>
          <Iconfont className={styles.icon_person} type="icon-yonghu"/>
          <div className={styles.main_content}>
            <div className={styles.date}>{time}</div>
            <div dangerouslySetInnerHTML={{ __html: content }} className={styles.content}>
              {/* {content} */}
            </div>
          </div>
          {status === 'fail' ? <Iconfont className={styles.icon_error} type="icon-cuowutishi1"/> : ''}
          
        </>
      }
    </div>
  );
};
export default Dialogue;
