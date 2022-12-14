import React, { useState, useEffect, ReactText, useCallback } from 'react';
import { connect } from 'umi';
import { message } from 'antd';
import CrumbCom from './components/crumb';
import OperaBar from './components/operatorBar';
import BatchOperator from './components/batchOperator';
import TablePage from './components/tablePage';
import styles from './index.less';
import { IConnectState, IConnectProps } from '@/models/connect';
interface IRankMonitorProps extends IConnectProps{
  StoreId: string;
  currentUser: API.ICurrentUser;
}

interface IState{
  loading: boolean;
  tableInfo: API.IParams;
  remainingTasksNumber: number | string;
  tableMessage: string;
  selectedRows: ReactText[];
  
}
export interface IParams{
  size: number;
  current: number;
  order: string;
  asc: string;
  searchTerms: string;
  switchStatus: string;
  isAc: string;
}
const RankMonitor: React.FC<IRankMonitorProps> = ({ StoreId, dispatch, currentUser }) => {
  const surplus = currentUser.memberFunctionalSurplus.filter(item => item.functionName === '搜索排名监控');
  const leftNum = surplus.length > 0 ? surplus[0].frequency : 0;
  const [state, setState] = useState<IState>({
    loading: false,
    tableInfo: {},
    remainingTasksNumber: 0, //默认剩下的任务数是0个
    tableMessage: '',
    selectedRows: [],
  });
  const [params, setParams] = useState({
    size: 20,
    current: 1,
    order: '',
    asc: '',
    searchTerms: '',
    switchStatus: 'all', //默认全部，可选close,open
    isAc: 'all', //默认全部，no否，yes是
  });
 
  const onTableChange = (
    pagination: {current: number; pageSize: number},
    _: API.IParams,
    sorter: {order: string; field: string},
    // eslint-disable-next-line max-params
    extra: {action: string}) => {
    const { order, field } = sorter;
    const { current, pageSize } = pagination;
    const { action } = extra;

    setParams((params) => ({
      ...params,
      size: pageSize,
      current: action === 'sort' ? 1 : current,
      order: field,
      asc: order,
    })); 
  };

  //1. 已选的复选框
  const selectedRowKeysChange = (rows: ReactText[]) => {
    setState((state) => ({
      ...state,
      selectedRows: rows,
    }));
  };

  //2. 批量操作，暂停或停止
  const toggleChange = ( status: boolean, ids?: ReactText[] | undefined ) => {
    const idsList = Array.isArray(ids) ? ids : state.selectedRows;
    dispatch({
      type: 'dynamic/msUpdateStatus',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
          ids: idsList,
          status,
        },
      },
      callback: (res: {code: number; message: string}) => {
        if (res.code === 200){
          const rowIndex: number[] = [];
          const records = state.tableInfo.records;
          idsList.map((id: ReactText) => {
            rowIndex.push(
              records.findIndex((item: API.IParams) => {
                return item.id === id;
              })
            );
          });
          rowIndex.map(item => {
            records[item].monitoringSwitch = status;
          });
          setState((state) => ({
            ...state,
            tableInfo: {
              ...state.tableInfo,
              records,
            },
          }));
          dispatch({
            type: 'user/fetchCurrent',
          });
        } else {
          message.error(res.message);
        }
      },
    });
    

  };
  useEffect(() => {
    setParams((params) => ({
      ...params,
      size: 20,
      current: 1,
      order: '',
      asc: '',
    })); 
  }, [StoreId]);

  const fetchList = useCallback(() => {
    setState((state) => ({
      ...state,
      loading: true,
    }));
    StoreId !== '-1' && dispatch({
      type: 'dynamic/msGetList',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
          searchTerms: params.searchTerms,
          switchStatus: params.switchStatus,
          isAc: params.isAc,
        },
        params: {
          size: params.size,
          current: params.current,
          order: params.order,
          asc: params.asc,
        },
      },
      callback: (res: {code: number; message: string;data: API.IParams}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            loading: false,
            tableInfo: res.data.page,
            remainingTasksNumber: res.data.remainingTasksNumber,
            tableMessage: '',
          }));
        } else {
          setState((state) => ({
            ...state,
            loading: false,
            tableInfo: {},
            remainingTasksNumber: 0,
            tableMessage: res.message || '没找到相关数据',
          }));
        }
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, dispatch]); 
  useEffect(() => {
    fetchList();
  }, [fetchList]);
  return (
    <div>
      <CrumbCom remainingTasksNumber={leftNum}/>
      <div className={styles.main}>
        <OperaBar
          loading={state.loading}
          searchTerms={params.searchTerms}
          switchStatus={params.switchStatus}
          isAc = {params.isAc}
          setParams={setParams}
          
        />
        {StoreId !== '-1' && 
        <div className={styles.main_second}>
          <BatchOperator 
            toggleChange={toggleChange}
            StoreId={StoreId}
            dispatch={dispatch}
            fetchList={fetchList}
          />
          <TablePage
            onTableChange={onTableChange}
            selectedRowKeysChange={selectedRowKeysChange}
            StoreId={StoreId}
            selectedRows={state.selectedRows}
            loading={state.loading}
            tableInfo={state.tableInfo}
            tableMessage={state.tableMessage}
            toggleChange={toggleChange}
            fetchList={fetchList}
          />
        </div>
        }
      </div>
    </div>
  );
};
export default connect(({ global, user }: IConnectState) => ({
  StoreId: global.shop.current.id,
  currentUser: user.currentUser,
}))(RankMonitor);
