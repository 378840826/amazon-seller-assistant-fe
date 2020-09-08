import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { IGlobalModelState } from '@/models/global';
import { IConnectState, IConnectProps } from '@/models/connect';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

interface ISummaryConnectProps extends IConnectProps{
  global: IGlobalModelState;
}
const defaultParams = {
  size: 20,
  current: 1,
};
const Summary: React.FC<ISummaryConnectProps> = ({ global, dispatch }) => {
  const headersParams = { StoreId: global.shop.current.id };
  const [state, setState] = useState({
    tableInfo: {
      total: 0,
      current: 1,
      size: 20,
      pages: 0,
      records: [],
    },
    msg: '', //错误的返回信息
    tableLoading: false,
  });
  const requestTable = (params = {}) => {
    setState((state) => ({
      ...state,
      tableLoading: true,
    }));
    dispatch({
      type: 'mail/getStatisticalList',
      payload: {
        data: {
          headersParams, 
        },
        params: {
          ...defaultParams,
          ...params,
        },
      },
      callback: (res: API.IParams) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            tableInfo: res.data,
            tableLoading: false,
            msg: '',
          }));
        } else {
          setState((state) => ({
            ...state,
            tableLoading: false,
            msg: res.message,
          }));
        }
        
      },
    });
  };
  //分页
  const paginationProps = {
    current: state.tableInfo.current,
    pageSize: state.tableInfo.size,
    total: state.tableInfo.total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 个`,
  };
  useEffect(() => {
    requestTable();
  }, [dispatch]);

  const columns: ColumnProps<API.IParams>[] = [
    {
      title: '发送时间',
      key: 'statisticalTime',
      dataIndex: 'statisticalTime',
      width: 103,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.text}>{text}</div>
        );
      },
    },
    {
      title: '发送邮件',
      key: 'totalNumber',
      dataIndex: 'totalNumber',
      width: 62,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.text}>{text}</div>
        );
      },
    },
    {
      title: '自动发送',
      key: 'automaticNumber',
      dataIndex: 'automaticNumber',
      width: 80,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.text}>{text}</div>
        );
      },
    },
    {
      title: '手动发送',
      key: 'manualNumber',
      dataIndex: 'manualNumber',
      width: 74,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.text}>{text}</div>
        );
      },
    },
    {
      title: '成功邮件',
      key: 'successNumber',
      dataIndex: 'successNumber',
      width: 80,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.orange}>{text}</div>
        );
      },
    },
    {
      title: '自动发送成功',
      key: 'automaticSuccessNumber',
      dataIndex: 'automaticSuccessNumber',
      width: 95,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.orange}>{text}</div>
        );
      },
    },
    {
      title: '手动发送成功',
      key: 'manualSuccessNumber',
      dataIndex: 'manualSuccessNumber',
      width: 107,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.orange}>{text}</div>
        );
      },
    },
    {
      title: '失败邮件',
      key: 'failNumber',
      dataIndex: 'failNumber',
      width: 73,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.text}>{text}</div>
        );
      },
    },
    {
      title: '自动发送失败',
      key: 'automaticFailNumber',
      dataIndex: 'automaticFailNumber',
      width: 107,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.text}>{text}</div>
        );
      },
    },
    {
      title: '手动发送失败',
      key: 'manualFailNumber',
      dataIndex: 'manualFailNumber',
      ellipsis: true,
      width: 94,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.text}>{text}</div>
        );
      },
    },
    {
      title: '正在发送',
      key: 'sendingNowNumber',
      dataIndex: 'sendingNowNumber',
      width: 63,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.orange}>{text}</div>
        );
      },
    },
    {
      title: '正在自动发送',
      key: 'sendingNowAutomaticNumber',
      dataIndex: 'sendingNowAutomaticNumber',
      width: 100,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.orange}>{text}</div>
        );
      },
    },
    {
      title: '正在手动发送',
      key: 'sendingNowManualNumber',
      dataIndex: 'sendingNowManualNumber',
      width: 94,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.orange}>{text}</div>
        );
      },
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onTableChange = (pagination: any,) => {
    const { current, pageSize } = pagination;
    requestTable({ current, size: pageSize });
  };
  return (
    <div className={styles.table_wrapper}>
      <Table
        className="__table"
        pagination={{ ...paginationProps }}
        loading={state.tableLoading}
        columns={columns}
        scroll={{ x: 'max-content', y: 'calc(100vh - 228px)' }}
        dataSource={state.tableInfo.records}
        onChange={onTableChange}
        locale={{ emptyText: state.msg === '' ? 'Oops! 没有更多数据啦' : state.msg }}
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
  global,
}))(Summary) ;
