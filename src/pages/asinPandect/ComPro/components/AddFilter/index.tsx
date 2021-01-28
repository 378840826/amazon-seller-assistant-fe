import React, { useEffect } from 'react';
import { Button } from 'antd';
import { connect } from 'umi';
import TableVirtual from '../TableVirtual';
import { IConnectState, IConnectProps } from '@/models/connect';
import AddLeft from '../AddLeft';
import styles from './index.less';
interface IAddFilter extends IConnectProps{
    StoreId: string;
    asin: string;
    toggleEvent: () => void;
    callFetchList: () => void;
}

export interface ISingleItem{
  image: string;
  title: string;
  titleLink: string;
  asin: string;
  price: string;
  reviewAvgStar: string;
  reviewCount: string;
  ranking: string;
}
const AddFilter: React.FC<IAddFilter> = ({ 
  dispatch, 
  StoreId,
  asin,
  toggleEvent,
  callFetchList }) => {
  useEffect(() => {
    dispatch({
      type: 'comPro/suggestAsin',
      payload: {
        data: {
          headersParams: { StoreId },
          asin,
        },
      },
    });
  }, [StoreId, asin, dispatch]);
 
  const onDelete = () => {
    dispatch({
      type: 'comPro/updateSelected',
      payload: [],
    });
  };

  const onSave = () => {
    dispatch({
      type: 'comPro/addAsin',
      payload: {
        StoreId,
        asin,
      },
      callback: () => {
        toggleEvent();
        dispatch({
          type: 'comPro/updateSelected',
          payload: [],
        });
        callFetchList();
      },
    });
  };

  const onCancel = () => {
    toggleEvent();
  };

  return (
    <div className={styles.add_area}>
      <div className={styles.left}>
        <AddLeft/>
      </div>
      <div className={styles.right}>
        <div className={styles.options}>
          <span className={styles.check}>已选</span>
          <span onClick={() => onDelete()} className={styles.remove_button}>删除全部</span>
        </div>
        <TableVirtual typeDelete/>
      </div>
      <div className={styles.btns}>
        <Button onClick={() => onCancel()}>取消</Button>
        <Button onClick={() => onSave()} className={styles.__save} type="primary">确定</Button>
      </div>
    </div>
  );
};
export default connect(({ global, asinGlobal }: IConnectState) => ({
  StoreId: global.shop.current.id,
  asin: asinGlobal.asin,
}))(AddFilter);
