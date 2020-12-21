import React, { useState, useEffect } from 'react';
import { Radio, Button, Dropdown, Row, Form, message } from 'antd';
import TaskContainer from '../taskContainer';
import styles from './index.less';
import { IConnectProps } from '@/models/connect';
import { DownOutlined, UpOutlined } from '@ant-design/icons';


const hzList = [
  { value: 1, desc: '整点' },
  { value: 2, desc: '0/2/4/6/8/10/12点' },
  { value: 4, desc: '0/4/8/12/16/20点' },
  { value: 6, desc: '0/6/12/18点' },
  { value: 12, desc: '0/12点' },
  { value: 24, desc: '0点' },
];


interface IBatchOperator{
  StoreId: string;
  dispatch: IConnectProps['dispatch'];
  toggleChange: (status: boolean) => void;
  fetchList: () => void;
}

const BatchOperator: React.FC<IBatchOperator> = ({ 
  StoreId, 
  dispatch, 
  toggleChange, 
  fetchList }) => {
  const [state, setState] = useState({
    open: false, //添加监控任务弹出框
    monitorOpen: false, //频率监控设定是否打开
    frequency: -1, //频率监控设定的频率
    monitorOpenLoading: false, //频率监控确定按钮
  });

  // => 监控任务框弹出切换
  const toggleEvent = () => {
    setState((state) => ({
      ...state,
      open: !state.open,
    }));
  };

  const onVisible = (flag: boolean) => {
    setState((state) => ({
      ...state,
      monitorOpen: flag,
    }));
  };

  //=> 监控频率设定
  const onFinish = (values: {radios: number}) => {
    if (state.frequency === values.radios){
      onVisible(false);
      return;
    }
    setState(state => ({
      ...state,
      monitorOpenLoading: true,
    }));
    dispatch({
      type: 'dynamic/msFrequencyUpdate',
      payload: {
        data: {
          headersParams: { StoreId },
        },
        params: {
          frequency: values.radios,
        },
      },
      callback: (res: {code: number; message: string}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            frequency: values.radios,
            monitorOpenLoading: false,
          }));
        } else {
          setState((state) => ({
            ...state,
            monitorOpenLoading: false,
          }));
          message.error(res.message);
        }
        onVisible(false);
      },
    });
  };
 

  useEffect(() => {
    dispatch({
      type: 'dynamic/msFrequency',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
        },
      },
      callback: (frequency: number) => {
        setState((state) => ({
          ...state,
          frequency,
        }));
      },
    });
    
  }, [StoreId, dispatch]);

  //处理添加监控任务在切换店铺时候的弹出框变化
  useEffect(() => {
    if (state.open){
      setState((state) => ({
        ...state,
        open: false,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [StoreId]);
  const menu = (
    <div className={styles.menu}>
      <div className={styles.title}>监控频率</div>
      <Form name="form"
        onFinish={onFinish}
        initialValues={{
          radios: state.frequency,
        }}
      >
        <Form.Item name="radios">
          <Radio.Group 
            name="radiogroup" 
          >
            {hzList.map((item, index) => {
              return (
                <Row key={index}>
                  <Radio 
                    className={styles.menuRadio} 
                    value={item.value}
                  >每{item.value}小时
                    <span className={styles.desc}>({item.desc})</span>
                  </Radio>
                </Row>
              );
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button onClick={() => onVisible(false)}>取消</Button>
          <Button loading={state.monitorOpenLoading} type="primary" htmlType="submit">保存</Button>
        </Form.Item>
      </Form>
    </div>
    
  );
  return (
    <>
      <div className={styles.btns}>
        <Button type="primary" onClick={toggleEvent}>
        添加监控任务
          {state.open ? <UpOutlined style={{ fontSize: '12px' }}/> : <DownOutlined style={{ fontSize: '12px' }} />}
          
        </Button>
        <Button onClick={() => toggleChange(false)}>批量暂停</Button>
        <Button onClick={() => toggleChange(true)}>批量开启</Button>
        <Dropdown
          overlay={menu}
          placement="bottomLeft"
          trigger={['click']}
          onVisibleChange={(flag) => onVisible(flag)}
          visible={state.monitorOpen}
        >
          <Button>监控频率设定</Button>
        </Dropdown>
      </div>
      <div className={styles.taskContainer} > 
        {state.open && <TaskContainer
          StoreId={StoreId}
          dispatch ={dispatch}
          toggleEvent={toggleEvent}
          fetchList={fetchList}
        />} 
      </div>
    </>
  );
};
export default BatchOperator;
