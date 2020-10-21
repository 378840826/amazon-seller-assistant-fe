import React, { useState, useEffect } from 'react';
import { IConnectState, IConnectProps } from '@/models/connect';
import { connect } from 'umi';
import { Spin, Space } from 'antd';
import OrderInfo from '../OrderInfo';
import RightFeedback from '../RightFeedback';
import styles from './index.less';

interface IRightPart extends IConnectProps{
  id: number | string;
  StoreId: string;
}

export interface IRightPartState{
  mailContent: API.IParams[];
  orderInfo: API.IParams;
  loading: boolean;
}
const RightPart: React.FC<IRightPart> = ({ id, StoreId, dispatch }) => {
  const [state, setState] = useState<IRightPartState>({
    mailContent: [],
    orderInfo: {},
    loading: false,
  });

  const pathName = location.pathname;
  const dispatchType = ['/mail/inbox', '/mail/reply', '/mail/no-reply'].indexOf(pathName) > -1 ?
    'mail/receiveReplayPage' : 'mail/sendListReplayPage';

  useEffect(() => {
    setState((state) => ({
      ...state,
      loading: true,
    }));
    dispatch({
      type: dispatchType,
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
        },
        params: {
          id,
        },
      },
      callback: (res: API.IParams) => {
        if (res.code === 200){
          setState(state => ({
            ...state,
            ...res.data,
            loading: false,
          }));
        } else {
          setState(state => ({
            ...state,
            mailContent: [],
            orderInfo: {},
            loading: false,
          }));
        }
      },
    });
  }, [StoreId, dispatch, dispatchType, id]);

  useEffect(() => {
    dispatch({
      type: 'mail/tankTemplateList',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
        },
       
      },
    });

  }, [dispatch, StoreId]);

  const addContent = (params: API.IParams) => {
    setState(state => ({
      ...state,
      mailContent: state.mailContent.concat(params),
    }));

  };
  return (
    <>
      { state.loading && 
        <Space size="middle" className={styles.__spain}>
          <Spin size="large" />
        </Space>
      }
      {
        !state.loading && 
        <div className={styles.container}>
          <RightFeedback mailContent={state.mailContent} onAdd={addContent}/>
          <OrderInfo info={state.orderInfo}/>
        </div>
      }
    </>
  );
};
export default connect(({ global, mail }: IConnectState) => ({
  StoreId: global.shop.current.id,
  id: mail.inbox.id,
}))(RightPart);
