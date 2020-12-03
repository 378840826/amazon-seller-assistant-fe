import React, { useState } from 'react';
import BraftEditor, { EditorState } from 'braft-editor';
import { Popconfirm, Spin } from 'antd';
import classnames from 'classnames';
import styles from './index.less';
import { useDispatch } from 'umi';
import { NativeButtonProps } from 'antd/lib/button/button';

interface ICompetitionOperator{
  StoreId: string;
  id: number;
  fetchList: () => void;
}
interface IState{
  visible: boolean;
  loading: boolean;
  editorState: EditorState;
}

const buttonProps: NativeButtonProps = {
  size: 'middle',
};
const CompetitionOperator: React.FC<ICompetitionOperator> = ({ StoreId, id, fetchList }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState<IState>({
    visible: false,
    loading: false, //数据加载的loading
    editorState: BraftEditor.createEditorState(null), //一开始没有数据

  });
  const menu = () => {
    //braftEditor内容改变
    const handleEditorChange = (editorState: EditorState) => {
      setState((state) => ({
        ...state,
        editorState,
      }));
    };
    return (
      <div className={styles.container}>
        {state.loading ? <Spin/> : 
          <div className={styles.top}>
            <div className={styles.scroll}>
              <BraftEditor
                controls={[]}
                value={state.editorState}
                contentClassName={styles.braftClassName}
                onChange={handleEditorChange}
              />
            </div>
          </div>
        }
      </div>
    );
  };
 
  const showPopconfirm = () => {
    setState((state) => ({
      ...state,
      visible: true,
      loading: true,
    }));
    dispatch({
      type: 'dynamic/msGetAsinList',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
        },
        params: {
          id,
        },
      },
      callback: (res: {code: number; data: {asinList: string[]}}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            loading: false,
            editorState: BraftEditor.createEditorState(res.data.asinList.join('<br/>')),
          }));
        } else {
          setState((state) => ({
            ...state,
            loading: false,
          }));
        }
      },
    });
  };
  const handleOk = () => {
    const htmlList = state.editorState.toHTML().split(/<\/?p[^>]*>/gi);
    const filterList = htmlList.map((item: string) => item.trim()).filter((item: string) => item !== '');
    
    dispatch({
      type: 'dynamic/msAsinUpdate',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
          id,
          asinList: filterList,
        },
      },
      callback: (res: {code: number}) => {
        if (res.code === 200){
          fetchList();
        }
      },
    }); 
    
  };
  const visibleChange = (visible: boolean) => {
    setState((state) => ({
      ...state,
      visible: visible,
    }));
  };
 

  return (
    <div>
      <Popconfirm
        placement="left"
        trigger={['click']} 
        title={menu}
        icon={false}
        visible={state.visible}
        onConfirm={handleOk}
        overlayClassName={styles.__popConfirm}
        cancelButtonProps={buttonProps}
        okButtonProps={buttonProps}
        onVisibleChange = {visibleChange}
      >
        <span 
          className={classnames(styles.blue, { [styles.active]: state.visible })} 
          onClick={showPopconfirm}>竞品</span>
      </Popconfirm>
    </div>
  );
};
export default CompetitionOperator;
