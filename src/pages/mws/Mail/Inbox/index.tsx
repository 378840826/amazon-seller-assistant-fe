import React, { useEffect, ReactText, useState } from 'react';
import { connect } from 'umi';
import SearchHeader from './components/SearchHeader';
import OperatorBar from './components/OperatorBar';
import TablePage from './components/TablePage';
import styles from './index.less';
import { IConnectState, IConnectProps } from '@/models/connect';
import { IMailModelState } from '@/models/mail';
import ReplayPage from './components/ReplayPage';
import moment from 'moment';
import { message } from 'antd';
export interface IState {
  msg: string;
  tableInfo: {
    total: number;
    current: number;
    size: number;
    pages: number;
    records: API.IParams[];
  };
  tableLoading: boolean;
  rowSelection: ReactText[];
  id: number;
}

export interface IInbox extends IConnectProps{
  state: IMailModelState['inbox'];
  StoreId: string;
  request: API.IParams;
}
const status = (pathname: string) => {
  if (pathname === '/mail/reply') {
    return 'replied-true'; 
  }
  if (pathname === '/mail/no-reply') {
    return 'replied-false'; 
  }
  return '';
};

const params = {
  size: 20,
  current: 1,
  dateStart: moment().subtract(29, 'days').format('YYYY-MM-DD'),
  dateEnd: moment().format('YYYY-MM-DD'),
  cycle: '',
  type: 'all',
  searchContent: '',
};


const Inbox: React.FC<IInbox> = ({ state, StoreId, dispatch }) => { 
  const pathname = location.pathname;
  const [request, setRequest] = useState({ ...params, status: status(pathname) });
  useEffect(() => {
    return () => {
      dispatch({
        type: 'mail/receiveEmailRecover',
      });
    };
  }, [dispatch, pathname]);

  useEffect(() => {
    setRequest((request) => ({
      ...request,
      size: 20,
      current: 1,
    }));
  }, [StoreId]);
 
  useEffect(() => {
    dispatch({
      type: 'mail/getReceiveEmailList',
      payload: {
        data: {
          headersParams: { StoreId },
          dateStart: request.dateStart,
          dateEnd: request.dateEnd,
          cycle: request.cycle,
          type: request.type,
          searchContent: request.searchContent,
          status: request.status,
        },
        params: {
          size: request.size,
          current: request.current,
        },
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, request]);
 
  //???????????????????????????????????????????????????,??????????????????
  const requestParam = (params: API.IParams) => {
    setRequest((request) => ({
      ...request,
      ...params,
    }));
  };

  //??????????????????????????? show???????????????????????????????????????
  const updateStatus = (type: string, selects: ReactText[], show: boolean) => {
    selects.length > 0 && dispatch({
      type: 'mail/updateStatus',
      payload: {
        data: {
          headersParams: { StoreId },
          ids: selects,
          status: type,
        },
      },
      callback: ( msg: string) => {
        show && message.success(msg);
      },
    });
  };
  
  //?????????????????????????????????
  const rowSelect = (selects: number | string | ReactText[]) => {
    if (typeof selects === 'number' || typeof selects === 'string'){
      updateStatus('replied-true', [selects], true);
    } else {
      dispatch({
        type: 'mail/modifyInboxRowSelection',
        payload: selects,
      });
    }
  };
  //?????????????????????????????????
  const rowListUpdate = (type: string) => {
    updateStatus(type, state.rowSelection, true);
  };
  //?????????????????????????????????
  const rowClick = (id: number) => {
    dispatch({
      type: 'mail/modifyInboxId',
      payload: id,
    });
    updateStatus('read-true', [id], false);
  };
  return (
    <div className={styles.right_container} style={{ lineHeight: '30px' }}>
      <SearchHeader 
        dateStart={request.dateStart}
        dateEnd={request.dateEnd}
        sourceType={request.type}
        request={requestParam} 
        tableLoading={state.tableLoading}/>
      <div className={styles.table_operator}>
        <OperatorBar rowListUpdate={(type) => rowListUpdate(type)}/>
        
        {
          state.id === -1 && <TablePage 
            msg={state.msg} 
            rowSelect={(selects) => rowSelect(selects)}
            rowClick={rowClick}
            request={requestParam}
            loading={state.tableLoading} 
            selectedRowKeys={state.rowSelection}
            tableInfo={state.tableInfo}/>
        }
        {
          state.id !== -1 && 
          <ReplayPage
            request={requestParam}
          />
        }
      </div>
    </div>
  );
};
export default connect(({ global, mail }: IConnectState) => ({
  StoreId: global.shop.current.id,
  state: mail.inbox,
}))(Inbox);
