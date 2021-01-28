import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import Body from './components/Body';
import Header from './components/Header';
import { connect } from 'umi';
import { IConnectState, IConnectProps } from '@/models/connect';

interface IComPro extends IConnectProps{
  StoreId: string;
  asin: string;
  send: API.IParams;
}

const ComPro: React.FC<IComPro> = ({ 
  dispatch, 
  StoreId, 
  asin,
  send,
}) => {
 
  const [state, setState] = useState({
    myProductData: {},
    page: {
      records: [],    
    },
    errMsg: '',
    tableLoading: false, //表格加载数据是否loading
  });

  const onChangeSwitch = (data: API.IParams) => {
    setState((state) => ({
      ...state,
      ...data,
    }));
  };

  const fetchList = useCallback(() => {
    setState((state) => ({
      ...state,
      tableLoading: true,
    }));
    dispatch({
      type: 'comPro/cpMsList',
      payload: {
        data: { 
          ...send.data, 
          asin, 
          headersParams: {
            StoreId,
          },
        },
        params: {
          ...send.query,
        },
      },
      callback: (res: {code: number; data: API.IParams}) => {
        if (res.code === 200){
          res.data.page.asc = res.data.page.asc ? 'ascend' : 'descend';
          setState((state) => ({
            ...state,
            ...res.data,
            errMsg: '',
            tableLoading: false,
          }));
        } else {
          setState((state) => ({
            ...state,
            myProductData: {},
            page: {
              records: [],    
            },
            errMsg: '',
            tableLoading: false,
          }));
        }
      },
    });
  }, [StoreId, asin, dispatch, send.data, send.query]);
  useEffect(() => {
    fetchList();
  }, [fetchList]);
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <Header 
          callFetchList={fetchList}
          tableLoading={state.tableLoading}/>
        <Body 
          myData={state.myProductData} 
          page={state.page}
          errMsg={state.errMsg}
          onChangeSwitch = {onChangeSwitch}
          tableLoading={state.tableLoading}
        />
      </div>
    </div>
  );
}
;
export default connect(({ global, asinGlobal, comPro }: IConnectState) => ({
  StoreId: global.shop.current.id,
  asin: asinGlobal.asin,
  send: comPro.send,
}))(ComPro);
