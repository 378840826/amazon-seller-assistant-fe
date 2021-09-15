/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import LinkHeader from '../components/LinkHeader';
import styles from './index.less';
import { Iconfont, getPageQuery } from '@/utils/utils';
import { Input } from 'antd';
import { connect } from 'umi';
import { IConnectState, IConnectProps } from '@/models/connect';
import OperatorBar from './components/operatorBar';
import TablePage from './components/tablePage';
import moment from 'moment';

const { Search } = Input;
interface ISummary extends IConnectProps{
  StoreId: string;
}
const Summary: React.FC<ISummary> = ({ StoreId, dispatch }) => {
  const [state, setState] = useState({
    tableLoading: false,
    tableInfo: {},
    updateTime: '',
    tableErrorMsg: '',
  });
  const [sendState, setSendState] = useState({
    size: 20,
    current: 1,
    asin: '',
    dateStart: moment().subtract(29, 'days').format('YYYY-MM-DD'), //时间范围默认最近30天
    dateEnd: moment().format('YYYY-MM-DD'),
    cycle: '',
    changeType: ['changeImage', 'changeTitle', 'changeDeal', 'changeCoupon', 'changeVariants', 'changeBundle', 'changeBP', 'changeProm'],
  });
  const [searchValue, setSearchValue] = useState<string | undefined | string[]>('');

  const modifySendState = (params: API.IParams) => {
    setSendState(state => ({
      ...state,
      ...params,
    }));
  };

  const onSearch = (value: string) => { 
    setSendState(state => ({
      ...state,
      asin: value.trim(),
    }));
  };
  //加载路由传过来的参数
  useEffect(() => {
    const queryParams = getPageQuery();
    if (queryParams.asin){
      setSendState(state => ({
        ...state,
        asin: queryParams.asin as string, 
      }));
      console.log(queryParams.asin, `路由传过来的值`);
      setSearchValue(queryParams.asin);
      console.log(searchValue, `能不能保存`);
      
    }
  }, []);


  //切换店铺 修改分页相关信息
  useEffect(() => {
    setSendState((sendState) => ({
      ...sendState,
      size: 20,
      current: 1,
    }));
  }, [StoreId] );
  useEffect(() => {
    setState((state) => ({
      ...state,
      tableLoading: true,
    }));
    StoreId !== '-1' && dispatch({
      type: 'dynamic/getSummaryList',
      payload: {
        data: {
          headersParams: { StoreId },
          asin: sendState.asin,
          dateStart: sendState.dateStart,
          dateEnd: sendState.dateEnd,
          cycle: sendState.cycle,
          changeType: sendState.changeType,
        },
        params: {
          size: sendState.size,
          current: sendState.current,
        },
      },
      callback: (res: {code: number;data: API.IParams;message: string}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            tableInfo: res.data.page,
            updateTime: res.data.updateTime,
            tableErrorMsg: '',
            tableLoading: false,
          }));
        } else {
          setState((state) => ({
            ...state,
            tableInfo: {},
            updateTime: '',
            tableErrorMsg: res.message,
            tableLoading: false,
          }));
        }
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, sendState]);

  
  return (
    <div className={styles.container} style={{ marginTop: '20px' }}>
      <div className={styles.time_container}>
        <LinkHeader/>
        <span className={styles.timestamp}>
          <i>更新时间：</i>
          <i>{state.updateTime}</i>
        </span>
      </div>
      <div className={styles.other_container}>
        <div className={styles.__search_container}>
          <Search 
            size="middle" 
            allowClear
            className={styles.__search_input}
            placeholder="输入标题、ASIN、SKU" 
            onSearch={(value, event) => {
              if (!event?.['__proto__']?.type){
                onSearch(value);
              }
            }}
            defaultValue={searchValue}
            disabled={state.tableLoading}
            enterButton={<Iconfont type="icon-sousuo"
              className={styles.icon_sousuo}/>}
          />
        </div>
        
        <OperatorBar 
          list={sendState.changeType} 
          modifySendState={modifySendState} 
          tableLoading={state.tableLoading}
          dateStart={sendState.dateStart}
          dateEnd={sendState.dateEnd}
        />
        <TablePage
          loading={state.tableLoading}
          tableInfo={state.tableInfo}
          tableErrorMsg={state.tableErrorMsg}
          modifySendState={modifySendState}
        />
      </div>     
    </div>
  );
};
export default connect(({ global }: IConnectState) => ({
  StoreId: global.shop.current.id,
}))(Summary);
