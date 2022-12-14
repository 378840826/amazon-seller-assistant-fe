import React, { useState, useEffect, useCallback } from 'react';
import LinkHeader from '../components/LinkHeader';
import styles from './index.less';
import AutoComplete from './components/AutoComplete';
import TablePage from './components/tablePage';
import { connect } from 'umi';
import { IConnectState, IConnectProps } from '@/models/connect';

interface IMonitorProps extends IConnectProps{
  StoreId: string;
  currentUser: API.ICurrentUser;
}
interface IState{
  tableLoading: boolean;
  tableInfo: API.IParams;
  tableErrorMsg: string;
}
const Monitor: React.FC<IMonitorProps> = ({ StoreId, dispatch, currentUser }) => {
  const leftNumList = currentUser.memberFunctionalSurplus.filter(item => item.functionName === 'ASIN动态监控');
  const leftNum = leftNumList.length > 0 ? leftNumList[0].frequency : 0;
  const [state, setState] = useState<IState>({
    tableLoading: false,
    tableInfo: {},
    tableErrorMsg: '',
  });

  const [params, setParams] = useState({
    size: 20,
    current: 1,
  });

  //表格中的开关状态发生改变
  const onTableChange = (status: boolean, record: API.IParams) => {
    const records = state.tableInfo.records;
    records[record.key].monitoringSwitch = status;
    setState((state) => ({
      ...state,
      tableInfo: {
        ...state.tableInfo,
        records,
      },
    }));
  };

  //修改分页信息的回调
  const changePage = (params: API.IParams) => {
    setParams((state) => ({
      ...state,
      ...params,
    }));
  };
  //切换店铺的时候，将发送的分页参数重置
  useEffect(() => {
    setParams(() => ({
      size: 20,
      current: 1,
    }));
  }, [StoreId]);

  const fetchCallback = useCallback( () => {
    setState((state) => ({
      ...state,
      tableLoading: true,
    }));
    StoreId !== '-1' && dispatch({
      type: 'dynamic/getMonitoringSettingsList',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
        },
        params: {
          size: params.size,
          current: params.current,
        },
      },
      callback: (res: {code: number;data: API.IParams;message: string}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            tableInfo: res.data,
            tableErrorMsg: '',
            tableLoading: false,
          }));
        } else {
          setState((state) => ({
            ...state,
            tableInfo: {},
            tableErrorMsg: res.message,
            tableLoading: false,
          }));
        }
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, params]); 
 

  useEffect(() => {
    fetchCallback();
  }, [fetchCallback]);
  return (
    <div className={styles.container} style={{ marginTop: '20px' }}>
      <div className={styles.header_left}>
        <LinkHeader/>
        <span className={styles.left_wrap}>
          剩余可添加ASIN:
          <span>{leftNum}个</span>
        </span>
      </div>
      <div className={styles.autocomplete_table}>
        <AutoComplete 
          StoreId={StoreId} 
          dispatch={dispatch}
          loading={state.tableLoading}
          addRequest={fetchCallback}
        />
        <TablePage 
          tableInfo={state.tableInfo} 
          tableErrorMsg={state.tableErrorMsg}
          loading={state.tableLoading}
          onTableSwitchChange={onTableChange}
          setParams={changePage}
        />
      </div>
      
    </div>
  );
};
export default connect(({ global, user }: IConnectState) => ({
  StoreId: global.shop.current.id,
  currentUser: user.currentUser,
}))(Monitor);
