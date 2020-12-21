import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { IConnectState, IConnectProps } from '@/models/connect';
import { Table, Typography } from 'antd';
import { ColumnProps } from 'antd/es/table';
import TableNotData from '@/components/TableNotData';
import classnames from 'classnames';

interface ISummaryConnectProps extends IConnectProps{
  StoreId: string;
}
const defaultParams = {
  size: 20,
  current: 1,
};
const { Paragraph } = Typography;
const Summary: React.FC<ISummaryConnectProps> = ({ StoreId, dispatch }) => {
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
  const requestTable = useCallback((params = {}) => {
    setState((state) => ({
      ...state,
      tableLoading: true,
    }));
    dispatch({
      type: 'mail/getStatisticalList',
      payload: {
        data: {
          headersParams: { StoreId }, 
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
  }, [StoreId, dispatch]);

  //分页
  const paginationProps = {
    current: state.tableInfo.current,
    pageSize: state.tableInfo.size,
    total: state.tableInfo.total,
    showSizeChanger: true,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 个`,
  };
  useEffect(() => {
    requestTable();
  }, [dispatch, requestTable]);

  const columns: ColumnProps<API.IParams>[] = [
    {
      title: '发送时间',
      key: 'statisticalTime',
      dataIndex: 'statisticalTime',
      width: 103,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph ellipsis>{text}</Paragraph>
        );
      },
    },
    {
      title: '发送邮件',
      key: 'totalNumber',
      dataIndex: 'totalNumber',
      width: 62,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph ellipsis>{text}</Paragraph>
        );
      },
    },
    {
      title: '自动发送',
      key: 'automaticNumber',
      dataIndex: 'automaticNumber',
      width: 80,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph ellipsis>{text}</Paragraph>
        );
      },
    },
    {
      title: '手动发送',
      key: 'manualNumber',
      dataIndex: 'manualNumber',
      width: 74,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph ellipsis>{text}</Paragraph>
        );
      },
    },
    {
      title: '成功邮件',
      key: 'successNumber',
      dataIndex: 'successNumber',
      width: 80,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph className={styles.orange} ellipsis>{text}</Paragraph>
        );
      },
    },
    {
      title: '自动发送成功',
      key: 'automaticSuccessNumber',
      dataIndex: 'automaticSuccessNumber',
      width: 95,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph className={styles.orange} ellipsis>{text}</Paragraph>
           
        );
      },
    },
    {
      title: '手动发送成功',
      key: 'manualSuccessNumber',
      dataIndex: 'manualSuccessNumber',
      width: 107,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph className={styles.orange} ellipsis>{text}</Paragraph>
        );
      },
    },
    {
      title: '失败邮件',
      key: 'failNumber',
      dataIndex: 'failNumber',
      width: 73,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph className={styles.orange} ellipsis>{text}</Paragraph>
        );
      },
    },
    {
      title: '自动发送失败',
      key: 'automaticFailNumber',
      dataIndex: 'automaticFailNumber',
      width: 107,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph className={styles.orange} ellipsis>{text}</Paragraph>
        );
      },
    },
    {
      title: '手动发送失败',
      key: 'manualFailNumber',
      dataIndex: 'manualFailNumber',
      width: 94,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph ellipsis>{text}</Paragraph>
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
            <Paragraph className={styles.orange} ellipsis>{text}</Paragraph>
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
            <Paragraph className={styles.orange} ellipsis>{text}</Paragraph>
        );
      },
    },
    {
      title: '正在手动发送',
      key: 'sendingNowManualNumber',
      dataIndex: 'sendingNowManualNumber',
      width: 94,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph className={styles.orange} ellipsis>{text}</Paragraph>
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
        scroll={{ y: 'calc(100vh - 226px)' }}
        dataSource={state.tableInfo.records}
        onChange={onTableChange}
        locale={{ emptyText: state.msg === '' ? <TableNotData hint="没找到相关数据"/> : 
          <TableNotData hint={state.msg}/> }}
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
}))(Summary) ;
