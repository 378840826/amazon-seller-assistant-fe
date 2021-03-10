import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'umi';
import styles from './index.less';
import TableCom from './components/Table';
import RoleModal from './components/RoleModal';
import { Button, Modal } from 'antd';

interface IState{
  tableLoading: boolean;
  modalVisible: boolean;//modal框是否显示
  errMsg: string;
  id: number;
  data: API.IParams[];
}
const Auth = () => {
  const dispatch = useDispatch();
  const [permissionList, setPermissionList] = useState<API.IParams[]>([]);
  const [samList, setSamList] = useState<API.IParams[]>([]); 
  const [state, setState] = useState<IState>({
    tableLoading: false,
    modalVisible: false,
    id: -1, //规则的id或者点击删除的id,为-1则是处于添加规则状态
    errMsg: '', //表格的错误信息
    data: [], //表格中的信息
  });
  //获取所有的子账号
  useEffect(() => {
    dispatch({
      type: 'dynamic/getSamList',
      callback: (res: {code: number; data: API.IParams[]}) => {
        if (res.code === 200){
          setSamList(res.data);
        } else {
          setSamList([]);
        }
      },
    });
  }, [dispatch]);

  //获取角色列表
  const getRecordsList = useCallback(() => {
    setState((state) => ({
      ...state,
      tableLoading: true,
    }));

    dispatch({
      type: 'dynamic/getRolePermission',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (res: { code: number; data: any; message: string }) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            tableLoading: false,
            errMsg: '', 
            data: res.data,
          }));
        } else {
          setState((state) => ({
            ...state,
            tableLoading: false,
            errMsg: res.message,
            data: [],
          }));
        }
      },
    });
  }, [dispatch]);

  useEffect(() => {
    getRecordsList();
  }, [getRecordsList]);

  //获取权限列表
  useEffect(() => {
    dispatch({
      type: 'dynamic/getPermissionList',
      callback: (res: API.IParams[]) => {
        setPermissionList(res);
      },
    });
  }, [dispatch]);
  //修改 状态和 单条的信息
  const changeItem = (id: number, obj: API.IParams) => {
    const index = state.data.findIndex( item => item.id === id);
    const newData = state.data;
    newData[index] = Object.assign(newData[index], obj); 
    setState((state) => ({
      ...state,
      data: newData,
    }));
  };

  //删除
  const deleteData = (id: number) => {
    setState((state) => ({
      ...state,
      data: state.data.filter(item => item.id !== id),
    }));
  };

  const onToggleModal = (flag: boolean, id?: number) => {
    const newState = id ? { modalVisible: flag, id } : { modalVisible: flag };
    setState((state) => ({
      ...state,
      ...newState,
    }));
  };
  return (
    <div className={styles.container}>
      <Button 
        type="primary"
        className={styles.__add_btn} 
        onClick={() => onToggleModal(true, -1)}>添加角色</Button>
      <Modal 
        className={styles.__modal}
        footer={null}
        visible={state.modalVisible}
        destroyOnClose={true}
        width={700}
        centered
        closable
        title=""
        onCancel={() => onToggleModal(false)}
      >
        <RoleModal 
          id={state.id}
          roleList={permissionList} 
          samList={samList}
          records={state.data}
          getRecordsList={() => getRecordsList()}
          onCancel={() => onToggleModal(false)}
        />
      </Modal>
      <TableCom 
        onUpdate={(id) => onToggleModal(true, id)}
        deleteData={deleteData}
        changeItem={changeItem}
        records={state.data}
        samList={samList}
        tableLoading={state.tableLoading}
        errMsg={state.errMsg}
      />
    </div>
  );
};
export default Auth;
