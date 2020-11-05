import React, { useState, useEffect, memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'umi';
import moment from 'moment';
import styles from './index.less';
import { IConnectState } from '@/models/connect';
import OperatorBar from './components/operatorBar';
import EchartsCom from './components/EchartsCom';
import TableCom from './components/TableCom';


interface IAsinGlobal {
  asinGlobal: {
    asin: string;
  };
}

interface IState{
  data: API.IParams;
  message: string;
  chartLoading: boolean;
}
const MemoEchartsCom = memo(EchartsCom);
const DynamicAsin: React.FC = () => {
  const dispatch = useDispatch();
  const searchAsin = useSelector((state: IAsinGlobal) => state.asinGlobal.asin);
  const StoreId = useSelector((state: IConnectState) => state.global.shop.current.id);
  const currency = useSelector((state: IConnectState) => state.global.shop.current.currency);
  const [sendState, setSendState] = useState({
    size: 20,
    current: 1,
    dateStart: moment().subtract(29, 'days').format('YYYY-MM-DD'),
    dateEnd: moment().format('YYYY-MM-DD'),
    cycle: '',
    properties: ['orderQuantity', 'bigCategoryRanking'],
    changeType: ['changeImage', 'changeTitle', 'changeDeal', 'changeCoupon', 'changeVariants', 'changeBundle', 'changeBP', 'changeProm'],
  });

  const [state, setState] = useState<IState>({
    data: {},
    message: '',
    chartLoading: false,
  });
 

  useEffect(() => {
    console.log('重新render');
    setState((state) => ({
      ...state,
      chartLoading: true,
    }));
    dispatch({
      type: 'dynamic/getPolyLineList',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
          asin: searchAsin,
          changeType: sendState.changeType,
          properties: sendState.properties,
        },
      },
      callback: (res: {code: number;message: string;data: API.IParams}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            data: res.data,
            message: '',
            chartLoading: false,
          }));
        } else {
          setState((state) => ({
            ...state,
            data: {},
            message: res.message,
            chartLoading: false,
          }));
        }
      },
    });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  [dispatch,
    searchAsin,
    StoreId, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(sendState.changeType), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(sendState.properties)]);
 
  const modifySendState = (params: API.IParams) => {
    setSendState((state) => ({
      ...state,
      ...params,
    }));
  };
  const memoModifySendState = useCallback((param) => modifySendState(param), []);
  return (
    <div className={styles.container}>
      <OperatorBar 
        modifySendState={modifySendState}
        list={sendState.changeType}
        properties={sendState.properties}
        updateTime={state.data.updateTime}
      />
        
      <MemoEchartsCom
        modifySendState={memoModifySendState}
        data={state.data}
        message={state.message}
        chartLoading={state.chartLoading}
        currency={currency}
      /> 
      {StoreId !== '-1' && 
          <TableCom
            StoreId={StoreId}
            asin={searchAsin}
            dateStart={sendState.dateStart}
            dateEnd={sendState.dateEnd}
            changeType={sendState.changeType}
            size={sendState.size}
            current={sendState.current}
            modifySendState={modifySendState}
          />} 
    </div>
  );
};
export default DynamicAsin ;
