import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Modal, Table, Button, Switch, Spin, message } from 'antd';
import styles from './index.less';
import { ColumnProps } from 'antd/lib/table';
import { IConnectState, IConnectProps } from '@/models/connect';
import Overlay from './components/Overlay';


interface IMailTemplate extends IConnectProps{
  StoreId: string;
}
export interface ITemplateData{
  key?: number;
  templateType: string;
  id: number;
  templateName: string;
  templateSubject: string;
  status: boolean;
}
interface IMailState{
  data: ITemplateData[];
  message: string;
  loading: boolean;
  visible: boolean;
  deleteVisible: boolean;
  id: number;
}
const MailTemplate: React.FC<IMailTemplate> = ({ StoreId, dispatch }) => {
  const [state, setState] = useState<IMailState>({
    data: [],
    message: '', //code不为200返回的信息
    loading: true, //加载表格的loading,默认一开始就加载
    visible: false, //弹框出现与否
    deleteVisible: false, //删除按钮点击
    id: -1, //需要修改或者打开的
  });
  useEffect(() => {
    dispatch({
      type: 'mail/getTemplateList',
      payload: {
        data: {
          headersParams: { StoreId },
        },
      },
      callback: (res: {code: number; data: ITemplateData[]}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            data: res.data,
            loading: false,
          }));
        } else {
          setState((state) => ({
            ...state,
            data: [],
            message: state.message,
            loading: false,
          }));
        }
      },
    });
  }, [dispatch, StoreId]); 

  //模版遮罩层的打开与关闭 打开传入flag 和id，关闭传入flag即可
  const onToggleModal = (flag: boolean, id?: number) => {
    const stats = id !== undefined ? { visible: flag, id } : { visible: flag };
    setState((state) => ({
      ...state,
      ...stats,
    }));
  };

  //列表中删除的点击
  const onDeleteModalOpen = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: number) => {
    e.stopPropagation();
    setState((state) => ({
      ...state,
      id,
      deleteVisible: true,
    }));
  };

  //修改状态
  const onChange = (checked: boolean, id: number) => {
    dispatch({
      type: 'mail/switchRule',
      payload: {
        data: {
          headersParams: { StoreId },
        },
        params: {
          status: checked,
          id,
        },
      },
    });
  };

  //点击确认按钮 删除规则
  const onDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setState((state) => ({
      ...state,
      deleteVisible: false,
    }));
    dispatch({
      type: 'mail/deleteTemplateList',
      payload: {
        data: {
          headersParams: { StoreId },
        },
        params: {
          id: state.id,
        },
      },
      callback: (response: {code: number; message: string}) => {
        if (response.code === 200){
          const records = state.data.filter((item) => item.id !== state.id);
          setState((state) => ({
            ...state,
            data: records,
            id: -1,
            deleteLoading: false,
          }));
        } else {
          message.error(response.message);
        }
      },
    });
  };

  //取消删除 按钮点击
  const onCancelDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setState((state) => ({
      ...state,
      id: -1,
      deleteVisible: false,
    }));
  };

  const columns: ColumnProps<ITemplateData>[] = [
    {
      title: '序号',
      dataIndex: 'key',
      align: 'center',
      width: 180,
      render: (text) => Number(text) + 1,
    },
    {
      title: '模板类型',
      dataIndex: 'templateType',
      align: 'center',
      width: 180,
      ellipsis: true,
      render: (text) => {
        return (
          text === '' ? <div className="null_bar"></div>
            :
            <span>{text}</span>
        );
      },
    },
    {
      title: '模板名称',
      dataIndex: 'templateName',
      align: 'center',
      width: 128,
      ellipsis: true,
      render: (text) => {
        return (
          text === '' ? <div className="null_bar"></div>
            :
            <span>{text}</span>
        );
      },
    },
    {
      title: '主题',
      dataIndex: 'templateSubject',
      align: 'center',
      width: 128,
      ellipsis: true,
      render: (text) => {
        return (
          text === '' ? <div className="null_bar"></div>
            :
            <span>{text}</span>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      width: 140,
      render: (status, record) => {
        return (
          status === '' ? <div className="null_bar"></div>
            :
            <Switch defaultChecked={status} 
              onChange={(checked: boolean) => onChange(checked, record.id)} />
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 224,
      render: (m, record) => {
        return (
          <div>
            <span className={styles.update} 
              onClick={() => onToggleModal(true, record.id)}
            >修改</span>
            <span className={styles.delete} 
              onClick={(e) => onDeleteModalOpen(e, record.id)}>删除</span>
          </div>
        );
      },
    }, 
  ];
  return (
    <div className={styles.container}>
      <Button className={styles.customButton} onClick={() => onToggleModal(true, -1)} type="primary">添加模版</Button>
      <Modal
        visible={state.visible}
        footer={null}
        destroyOnClose={true}
        width={814}
        centered
        closable={false}
        title=""
        onCancel={() => onToggleModal(false)}
      >
        <Overlay StoreId={StoreId} id={state.id} onCancel={() => onToggleModal(false)}/>
      </Modal>
      <Modal
        visible={state.deleteVisible}
        centered
        closable={false}
        title=""
        width={338}
        wrapClassName={styles.__deleteRule}
        onOk={(e) => onDelete(e)}
        onCancel={(e) => onCancelDelete(e)}
      >
        <div>确定删除此规则？</div>

      </Modal>
      <Table
        className={styles.__table}
        columns={columns}
        rowKey="id"
        loading={state.loading}
        scroll={{ x: 'max-content', y: 'calc(100vh - 100px)' }}
        locale={{ emptyText: state.message === '' ? 'Oops! 没有更多数据啦' : state.message }}
        dataSource={state.data}
        pagination={false}
      />
    </div>
  );
};
export default connect(({ global }: IConnectState) => ({
  StoreId: global.shop.current.id,
}))(MailTemplate);
