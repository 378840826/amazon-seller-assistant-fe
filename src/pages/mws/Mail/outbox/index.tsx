import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { IInbox } from '../Inbox';
import moment from 'moment';
import { IConnectState } from '@/models/connect';
import SearchHeader from './components/SearchHeader';
import TablePage from './components/TablePage';
import ReplayPage from './components/ReplayPage';

const status = (pathname: string) => {
  if (pathname === '/mws/mail/send-success') {
    return 'success'; 
  }
  if (pathname === '/mws/mail/send-fail') {
    return 'fail'; 
  }
  if (pathname === '/mws/mail/sending'){
    return 'Sending';
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
  sendType: 'all',
};

const OutBox: React.FC<IInbox> = ({ state, StoreId, dispatch }) => {
  const pathname = location.pathname;
  const [request, setRequest] = useState({ ...params, status: status(pathname) });
  useEffect(() => {
    dispatch({
      type: 'mail/getSendList',
      payload: {
        data: {
          headersParams: { StoreId },
          dateStart: request.dateStart,
          dateEnd: request.dateEnd,
          cycle: request.cycle,
          type: request.type,
          status: request.status,
          searchContent: request.searchContent,
          sendType: request.sendType,
        },
        params: {
          size: request.size,
          current: request.current,
        },
      },
    });
    return () => {
      dispatch({
        type: 'mail/receiveEmailRecover',
      });
    };
  }, [dispatch, pathname, request, StoreId]);


  //头部搜索，邮件来源，日历的点击请求,表格页脚点击
  const requestParam = (params: API.IParams) => {
    setRequest((request) => ({
      ...request,
      ...params,
    }));
  };

  //点击沟通记录操作出现
  const rowClick = (id: number) => {
    dispatch({
      type: 'mail/modifyInboxId',
      payload: id,
    });
  };

  return (
    <div className={styles.right_container} style={{ lineHeight: '30px' }}>
      <SearchHeader 
        dateStart={params.dateStart}
        dateEnd={params.dateEnd}
        sourceType={params.type}
        sendType={params.sendType}
        request={requestParam} 
        tableLoading={state.tableLoading}/>
      {
        state.id === -1 && <TablePage
          msg = {state.msg}
          loading={state.tableLoading}
          tableInfo={state.tableInfo}
          request={requestParam}
          operator={rowClick}/>
      }
      {
        state.id !== -1 && 
        <ReplayPage request={requestParam}/>
      }
    </div>
  );
};
export default connect(({ global, mail }: IConnectState) => ({
  StoreId: global.shop.current.id,
  state: mail.inbox,
}))( OutBox);

