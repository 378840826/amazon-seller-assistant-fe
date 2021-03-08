import React, { useState } from 'react';
import { ColumnProps } from 'antd/es/table';
import styles from './index.less';
import { useDispatch } from 'umi';
import { Table, Switch, Modal } from 'antd';
import TableNotData from '@/components/TableNotData';
import SubAccount from '../SubAccount';
interface ITableCom{
    records: API.IParams[];
    tableLoading: boolean;
    errMsg: string;
    samList: API.IParams[];
    deleteData: (id: number) => void;
    changeItem: (id: number, obj: API.IParams) => void;
    onUpdate: (id: number) => void;
}
const TableCom: React.FC<ITableCom> = ({ 
  records,
  tableLoading,
  errMsg, 
  samList,
  deleteData,
  changeItem,
  onUpdate,
}) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    deleteVisible: false, //delete删除模块的显示
    deleteLoading: false, //delete接口调用
    deleteId: -1, //想要删除的id
  });

  const cancelButtonProps = {
    disabled: state.deleteLoading,
  };

  const okButtonProps = {
    loading: state.deleteLoading,
  };

  //delete模块打开
  const onDeleteOpen = (id: number) => {
    setState((state) => ({
      ...state,
      deleteId: id,
      deleteVisible: true,
    }));
  };

  //取消删除 
  const onCancelDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setState((state) => ({
      ...state,
      id: -1,
      deleteVisible: false,
    }));
  };

  //删除角色
  const onDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setState((state) => ({
      ...state,
      deleteLoading: true,
    }));
    dispatch({
      type: 'dynamic/deleteRole',
      payload: {
        data: {
          id: state.deleteId,
        },
      },
      callback: (res: {code: number ; message: string}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            deleteId: -1,
            deleteVisible: false,
            deleteLoading: false,
          }));
          deleteData(state.deleteId);
        } else {
          setState((state) => ({
            ...state,
            deleteLoading: false,
          }));
          Modal.error({ content: res.message });
        }
       
      },
    });
  };
 
  //切换状态
  const changeSwitch = (checked: boolean, id: number) => {
    dispatch({
      type: 'dynamic/updateStatus',
      payload: {
        data: {
          id,
          roleState: checked,
        },
      },
      callback: () => {
        changeItem(id, { roleState: checked });
      },
    });
  };
 
  const columns: ColumnProps<API.IParams>[] = [{
    title: '状态',
    width: 95,
    align: 'center',
    dataIndex: 'roleState',
    key: 'roleState',
    render: (status, record) => <Switch 
      onChange={(checked) => changeSwitch(checked, record.id)}
      className={styles.__switch} 
      checked={status}/>,
  }, {
    title: '角色名称',
    width: 80,
    align: 'center',
    dataIndex: 'roleName',
    key: 'roleName',
    render: (text) => text ? text : <div className="null_bar"></div>,
  }, {
    title: '角色描述',
    width: 320,
    align: 'left',
    dataIndex: 'roleDescription',
    key: 'roleDescription',
    render: (text) => text ? text : <div className="null_bar"></div>,
  }, {
    title: '关联子账号',
    width: 485,
    dataIndex: 'samList',
    key: 'samList',
    render: (data, record) => 
      <SubAccount 
        id={record.id} 
        samList={samList} 
        changeItem={changeItem}
        data={data}
      />,
  }, {
    title: '创建时间',
    width: 120,
    align: 'center',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
    render: (text) => text ? text : <div className="null_bar"></div>,
  },
  {
    title: '更新时间',
    width: 120,
    align: 'center',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: (text) => text ? text : <div className="null_bar"></div>,
  },
  {
    title: '操作',
    width: 120,
    align: 'center',
    render: (record) => {
      return (
        <div className={styles.__operator}>
          <span onClick={() => onUpdate(record.id)} className={styles.edit}>设置</span>
          <span onClick={() => onDeleteOpen(record.id)} className={styles.delete}>删除</span>
        </div>
      );
    },
  }];
  return (
    <>
      <Modal
        visible={state.deleteVisible}
        centered
        closable={false}
        title=""
        width={338}
        cancelButtonProps={cancelButtonProps}
        okButtonProps={okButtonProps}
        wrapClassName={styles.__deleteRule}
        onOk={(e) => onDelete(e)}
        onCancel={(e) => onCancelDelete(e)}
      >
        <div>确定删除此条信息？</div>

      </Modal>
      <Table
        columns={columns}
        pagination={false}
        dataSource={records}
        loading={tableLoading}
        className={styles.__table}
        rowKey="id"
        locale={{ emptyText: errMsg === '' ? 
          <TableNotData hint="没找到相关数据"/> : 
          <TableNotData hint={errMsg}/> }}
        rowClassName={(a, index) => {
          if (index % 2 === 1) {
            return styles.darkRow;
          }
        }}
      />
    </>
   
  );
};
export default TableCom;
