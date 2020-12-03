import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'umi';
import { Table, Switch, Modal, message } from 'antd';
import styles from './index.less';
import { IConnectState, IConnectProps } from '@/models/connect';
import { ColumnProps } from 'antd/lib/table';
import Overlay from './components/Overlay';

interface IMailRule extends IConnectProps{
  StoreId: string;
}
interface IState{
  data: API.IParams[];
  message: string;
  visible: boolean;
  loading: boolean;
  deleteVisible: boolean;
  deleteLoading: boolean;
  id: number;
}
const MailRule: React.FC<IMailRule> = ({ StoreId, dispatch }) => {
  const [state, setState] = useState<IState>({
    data: [],
    message: '',
    visible: false, //规则modal显示与否
    deleteVisible: false, //是否删除规则显示与否
    loading: false, //表格的loading
    deleteLoading: false, //删除对话框loading与否
    id: -1, //规则的id或者点击删除的id,为-1则是处于添加规则状态
  });
  const getRuleList = useCallback(
    () => {
      dispatch({
        type: 'mail/getRuleList',
        payload: {
          data: {
            headersParams: { StoreId },
          },
        },
        callback: (res: API.IParams) => {
          const { code, data } = res;
          if (code === 200){
            setState((state) => ({
              ...state,
              data,
              loading: false,
            }));
          } else {
            setState((state) => ({
              ...state,
              data: [],
              message: res.message,
              loading: false,
            }));
          }
        },
      });
    }, [StoreId, dispatch]);
  useEffect(() => {
    setState((state) => ({
      ...state,
      loading: true,
    }));
    getRuleList();
  }, [StoreId, dispatch, getRuleList]);

  //切换switch
  const onChange = (checked: boolean, id: number, key: number) => {
    console.log('checked:', checked, key);
    dispatch({
      type: 'mail/switchRule',
      payload: {
        data: {
          headersParams: { StoreId },
          status: checked,
          id,
        },
      },
      callback: () => {
        const records = state.data;
        records[key].status = checked;
        setState((state) => ({
          ...state,
          data: records,
        }));
      },
    });
  };

 
  //规则遮罩层关闭与打开
  const onToggleModal = (flag: boolean, id?: number) => {
    const stats = id ? { visible: flag, id } : { visible: flag };
    setState((state) => ({
      ...state,
      ...stats,
    }));
  };

  //遮罩层保存点击 重新请求
  const onSave = () => {
    getRuleList();
  };
 
  //点击确认按钮 删除规则
  const onDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setState((state) => ({
      ...state,
      deleteLoading: true,
    }));
    dispatch({
      type: 'mail/deleteRule',
      payload: {
        data: {
          headersParams: { StoreId },
        },
        params: {
          id: state.id,
        },
      },
      callback: () => {
        const records = state.data.filter((item) => item.id !== state.id);
        setState((state) => ({
          ...state,
          data: records,
          id: -1,
          deleteLoading: false,
          deleteVisible: false,
        }));
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
  //表格列表中删除的点击
  const onDeleteModalOpen = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: number) => {
    e.stopPropagation();
    setState((state) => ({
      ...state,
      id,
      deleteVisible: true,
    }));
  };
  //

  const cancelButtonProps = {
    disabled: state.deleteLoading,
  };


  const okButtonProps = {
    loading: state.deleteLoading,
  };

  const columns: ColumnProps<API.IParams>[] = [
    {
      title: '序号',
      dataIndex: 'key',
      align: 'center',
      width: 180,
      render: (text) => Number(text) + 1,
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
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
      title: '触发时间',
      dataIndex: 'triggerTime',
      align: 'center',
      width: 245,
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
      title: '邮件模板',
      dataIndex: 'mailTemplate',
      align: 'center',
      ellipsis: true,
      width: 190,
      render: (text) => {
        return (
          text.length === 0 ? <div className="null_bar"></div> 
            :
            <>
              {text.map( (item: string, index: number) => <div key={index}>{item}</div>)}
            </>
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
            <Switch checked={status} className={styles.__switch}
              onChange={(checked: boolean) => onChange(checked, record.id, record.key)} />
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
      <div 
        className={styles.customButton} 
        onClick={() => onToggleModal(true, -1)}
      >添加规则</div>
      <Modal
        visible={state.visible}
        footer={null}
        bodyStyle={{ padding: '30px' }}
        destroyOnClose={true}
        width={610}
        centered
        closable={false}
        title=""
        onCancel={() => onToggleModal(false)}
      >
        <Overlay 
          id={state.id}
          StoreId={StoreId} 
          onSave={onSave}
          onCancel={() => onToggleModal(false)}
        />
      </Modal>
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
        rowClassName={(_, index) => {
          if (index % 2 === 1) {
            return styles.darkRow;
          }
        }}
      />
    </div>
  );
};
export default connect(({ global }: IConnectState) => ({
  StoreId: global.shop.current.id,
}))(MailRule);
