import React, { useState } from 'react';
import { connect } from 'umi';
import { Popover, Timeline, Spin } from 'antd';
import { Iconfont } from '@/utils/utils';
import styles from './index.less';
import { IConnectState, IConnectProps } from '@/models/connect';

interface IACKeyword extends IConnectProps{
  StoreId: string;
  value: string | number;
  id: number;
}
interface IState{
  visible: boolean;
  loading: boolean;
  data: Array<[string, string]>;
}
const ACKeyword: React.FC<IACKeyword> = ({ value, StoreId, dispatch, id }) => {
  const [state, setState] = useState<IState>({
    visible: false,
    loading: false, //content是否loading
    data: [],
  });

  const content = () => {
    return (
      <div className={styles.__content}>
        {state.loading ? <Spin/> : 
          <Timeline>
            {state.data.map((item, index) => (
              <Timeline.Item key={index}>
                <span className={styles.__time}>{item[0]}</span><span>{item[1]}</span>
              </Timeline.Item>
            ))}
          
          </Timeline>
        }
      </div>
    );
  };

  const onOpenClock = () => {
    setState((state) => ({
      ...state,
      visible: true,
      loading: true,
    }));
    dispatch({
      type: 'comPro/getACList',
      payload: {
        data: {
          headersParams: { StoreId },
          id,
        },
      },
      callback: (data: IState['data']) => {
        setState((state) => ({
          ...state,
          data,
          loading: false,
        }));
      },
    }); 
  };
  const handleVisibleChange = (visible: boolean) => {
    setState((state) => ({
      ...state,
      visible: visible,
    }));
  };
  return (
    <>
      <Popover 
        overlayClassName={styles.__popOver}
        content={content}
        trigger="click"
        placement="left"
        visible={state.visible}
        onVisibleChange={handleVisibleChange}
      >
        <>
          {value === '' ? <div className="null_bar"></div> : 
            <span>{value}</span>}
          <Iconfont onClick={onOpenClock} type="icon-shijianfenlei" className={styles.__clock}/>
        </>
      </Popover>
     
    </>
  );
};
export default connect(({ global }: IConnectState) => ({
  StoreId: global.shop.current.id,
}))(ACKeyword);
