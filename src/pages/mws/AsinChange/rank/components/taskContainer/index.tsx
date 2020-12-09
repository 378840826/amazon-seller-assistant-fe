import { IConnectProps } from '@/models/connect';
import React, { useState, useRef, useEffect } from 'react';
import styles from './index.less';
import TaskLeft from '../taskContainerLeft';
import TaskCenter from '../taskContainerCenter';
import { Input, Button, message } from 'antd';
const { TextArea } = Input;
interface ITaskContainer{
  StoreId: string;
  dispatch: IConnectProps['dispatch'];
  toggleEvent: () => void;
 

}
interface IState{
  asinList: string[];
  keywordList: string[];
  loading: boolean;
  leftLoading: boolean;
  centerLoading: boolean;
}
const TaskContainer: React.FC<ITaskContainer> = ({ 
  StoreId, 
  dispatch, 
  toggleEvent,
}) => {
  const [state, setState] = useState<IState>({
    asinList: [],
    keywordList: [],
    leftLoading: false,
    centerLoading: false,
    loading: false, //确认按钮的loading状态
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refText = useRef<any>(null);
  const asinChange = (list: string[]) => {
    setState((state) => ({
      ...state,
      asinList: list,
    }));
  };
  const keywordChange = (list: string[]) => {
    setState((state) => ({
      ...state,
      keywordList: list,
    }));
  };

  const onSave = () => {
    let list = [];
    if (refText.current){
      const content = refText.current.state.value;
      console.log('content:', content);
      if (content === '' || content === undefined){
        list = [];
      } else {
        list = content.split(/\n/ig).map( (item: string) => item.trim())
          .filter((item1: string) => item1 !== '');
      }
    }
  
    if (state.asinList.length > 0 && state.keywordList.length > 0 ){
      setState((state) => ({
        ...state,
        loading: true,
      }));
      dispatch({
        type: 'dynamic/msMonitorAdd',
        payload: {
          data: {
            headersParams: { StoreId },
            asinList: state.asinList,
            keywordList: state.keywordList,
            competitiveAsinList: list,
          },
        },
        callback: () => {
          setState((state) => ({
            ...state,
            loading: false,
          }));
        },
      });
    } else {
      message.error('关键词或商品不能为空');
    }
  };
  return (
    <div className={styles.container_wrap}>
      <div className={styles.container}>
        <div className={styles.left}>
          <TaskLeft 
            asinChange={asinChange}
          />
        </div>
        <div className={styles.center}>
          <TaskCenter 
            asinList={state.asinList} 
            keywordChange={keywordChange}
          />
        </div>
        <div className={styles.right}>
          <div className={styles.title}>竞品ASIN</div>
          <TextArea className={styles.text_area} 
            ref={refText}
            placeholder="输入竞品ASIN，一行一个，输入越多，分析结果越准确"
          />
          <div className={styles.footer}>注：若选择多个ASIN和关键词，则ASIN和关键词会两两组合添加到任务列表；
若ASIN和关键词组合已存在，则不会重复添加；输入竞品ASIN，系统可自动计
算搜索结果页里面，竞品ASIN的占比，有助于判断关键词与ASIN的相关性</div>
        </div>
      </div>
      <div className={styles.btns}>
        <Button onClick={toggleEvent} >取消</Button>
        <Button loading={state.loading} onClick={onSave} type="primary">确定</Button>
      </div>
    </div>
  );
};
export default TaskContainer;
