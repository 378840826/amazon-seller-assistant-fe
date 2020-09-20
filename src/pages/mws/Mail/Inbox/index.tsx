import React, { useEffect, ReactText } from 'react';
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
  request?: API.IParams;
}
const status = (pathname: string) => {
  if (pathname === '/mws/mail/reply') {
    return 'replied-true'; 
  }
  if (pathname === '/mws/mail/no-reply') {
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


const Inbox: React.FC<IInbox> = ({ state, StoreId, dispatch, request }) => { 
  const pathname = location.pathname;
  useEffect(() => {
    dispatch({
      type: 'mail/modifyInboxSendParams',
      payload: {
        ...params,
        status: status(pathname),
      },
    });
    return () => {
      dispatch({
        type: 'mail/receiveEmailRecover',
      });
    };
  }, [dispatch, pathname]);
 
  useEffect(() => {
    const length = Object.keys(request as API.IParams).length;
    length > 0 && dispatch({
      type: 'mail/getReceiveEmailList',
      payload: {
        data: {
          headersParams: { StoreId },
        },
        params: request,
      },
    });
  }, [StoreId, dispatch, request]);


  //头部搜索，邮件来源，日历的点击请求,表格页脚点击
  const requestParam = (params: API.IParams) => {
    dispatch({
      type: 'mail/modifyInboxSendParams',
      payload: {
        ...request,
        ...params,
      },
    });
  };

  //批量标记的发送请求
  const updateStatus = (type: string, selects: ReactText[], show: boolean) => {
    dispatch({
      type: 'mail/updateStatus',
      payload: {
        data: {
          headersParams: { StoreId },
        },
        params: {
          ids: selects,
          status: type,
        },
        callback: ( msg: string) => {
          show && message.success(msg);
        },
      },
    });
  };
  
  //单个标记已回复点击事件
  const rowSelect = (selects: number | ReactText[]) => {
    if (typeof selects === 'number'){
      updateStatus('replied-true', [selects], true);
    } else {
      dispatch({
        type: 'mail/modifyInboxRowSelection',
        payload: selects,
      });
    }
  };
  //批量标记四个按钮的点击
  const rowListUpdate = (type: string) => {
    updateStatus(type, state.rowSelection, true);
  };
  //点击每一行出现回复页面
  const rowClick = (id: number) => {
    dispatch({
      type: 'mail/modifyInboxId',
      payload: id,
    });
    updateStatus('replied-true', [id], false);
  };
  return (
    <div className={styles.right_container} style={{ lineHeight: '30px' }}>
      <SearchHeader 
        dateStart={params.dateStart}
        dateEnd={params.dateEnd}
        sourceType={params.type}
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
          <ReplayPage/>
        }
      </div>
    </div>
  );
};
export default connect(({ global, mail }: IConnectState) => ({
  StoreId: global.shop.current.id,
  state: mail.inbox,
  request: mail.request,
}))(Inbox);
