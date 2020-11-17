import React, { useState, useMemo, useCallback } from 'react';
import { AutoComplete, Spin, Button } from 'antd';
import styles from './index.less';
import debounce from 'lodash/debounce';
import { IConnectProps } from '@/models/connect';

const { Option } = AutoComplete;
interface IAutoCompleteCom extends IConnectProps{
  StoreId: string;
  addRequest: () => void;
  loading: boolean;
}
interface IState{
  result: IAutoData[];
  loading: boolean;
  asin: string;
}

interface IAutoData{
  asin: string;
  title: string;
}

const AutoCompleteCom: React.FC<IAutoCompleteCom> = ({
  StoreId,
  addRequest,
  dispatch,
  loading,
}) => {
  const [state, setState] = useState<IState>({
    result: [],
    loading: false,
    asin: '',
  });
  
  const ajax = useCallback((value) => {
    dispatch({
      type: 'dynamic/getMonitorSettingsSearch',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
        },
        params: {
          asin: value,
        },
      },
      callback: (data: IAutoData[]) => {
        setState((state) => ({
          ...state,
          loading: false,
          result: data,
        }));
      },
    });
  }, [dispatch, StoreId]);

  const debounceAjax = useMemo(() => debounce(ajax, 500), [ajax]);
  const handleSearch = (value: string) => {
    value = value.trim();
    setState(state => ({
      ...state,
      loading: true,
      asin: value,
    }));

    if (!value){
      setState(state => ({
        ...state,
        loading: false,
        result: [],
      }));
    } else {
      debounceAjax(value);
    }
  };

  const handleSelect = (value: string) => {
    setState((state) => ({
      ...state,
      asin: value.trim(),
    }));
  };

  const onAdd = () => {
    if (state.asin){
      dispatch({
        type: 'dynamic/addAsin',
        payload: {
          data: {
            headersParams: {
              StoreId,
            },
            asin: state.asin,
          },
        },
        callback: () => {
          addRequest();
        },
      });
    }

  };
  
  return (
    <div className={styles.autoComplete_wrapper}>
      <div className={styles.autoComplete_container}>
        <AutoComplete
          style={{
            width: '100%',
          }}
          onSearch={handleSearch}
          onSelect = {handleSelect}
          placeholder="请输入要监控的ASIN"
          allowClear
        >
          { state.loading ? 
            <Option style={{ textAlign: 'center' }} value={''}>
              <Spin />
            </Option>
            : 
            state.result.map( (item, idx: number) => (
              <Option key={idx} value={item.asin}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.asin}>{item.asin}</div>
              </Option>
            ))
          }
        </AutoComplete>
      </div>
      <Button className={styles.addBtn} disabled={loading} onClick={onAdd} type="primary">添加</Button>
      <span className={styles.font_monitor}>（每天监控一次）</span>
    </div>
    
  );
};
export default AutoCompleteCom;
