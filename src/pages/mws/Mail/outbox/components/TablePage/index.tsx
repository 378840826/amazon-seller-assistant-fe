import React from 'react';
import styles from './index.less';
import { Table, Typography } from 'antd';
import ColumnOrderInfo from '../../../components/ColumnOrderInfo';
import { ColumnProps, TablePaginationConfig } from 'antd/es/table';
const { Paragraph } = Typography;
import TableNotData from '@/components/TableNotData';
interface ITablePage{
  msg: string;
  tableInfo: API.IParams;
  loading: boolean;
  request: (params: API.IParams) => void;
  operator: (id: number) => void;
}
export const renderState = (status: string) => {
  if (status === 'success'){
    return <span className="success">发送成功</span>;
  } else if (status === 'fail'){
    return <span className="fail">发送失败</span>;
  } else if (status === 'sending'){
    return <span className="sending">正在发送</span>;
  } 
  return <div className={styles.null_bar}></div>;
};

export const renderSendType = (type: string) => {
  if (type === 'all'){
    return <span>全部</span>;
  } else if (type === 'manual'){
    return <span>手动</span>;
  } else if (type === 'automatic'){
    return <span>自动</span>;
  }
  return <div className={styles.null_bar}></div>;
};
const TablePage: React.FC<ITablePage> = ({
  msg, 
  tableInfo, 
  loading, 
  request,
  operator,
}) => {
  const paginationProps = {
    current: tableInfo.current,
    pageSize: tableInfo.size,
    showSizeChanger: true,
    total: tableInfo.total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 个`,
  };

  const onTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    request({
      current,
      size: pageSize,
    });
  };

  const columns: ColumnProps<API.IParams>[] = [
    {
      title: '发送时间',
      dataIndex: 'sendingTime',
      align: 'center',
      width: 120,
      render: (text) => {
        return (
          text === '' ? 
            <div className="null_bar"></div>
            :
            <Paragraph ellipsis={{ rows: 2 }} className={styles.sendingTime}>{text}</Paragraph>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 70,
      align: 'center',
      render: (status) => renderState(status), 
    },
    {
      title: '订单ID',
      dataIndex: 'orderId',
      align: 'center',
      width: 138,
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.orderId}>{text}</div>
        );
      },
    },
    {
      title: '订单信息',
      dataIndex: 'productInfo',
      width: 220,
      align: 'center',
      render: (productInfo) => <ColumnOrderInfo info={productInfo}/>,
    },
    {
      title: '收件人邮箱',
      dataIndex: 'email',
      width: 150,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Paragraph ellipsis className={styles.email}>{text}</Paragraph>
        );
      },
    },
    {
      title: '主题',
      dataIndex: 'subject',
      width: 280,
      align: 'left',
      render: (text) => {
        return (
          text === '' ? 
            <div className="null_bar"></div>
            :
            <Paragraph ellipsis={{ rows: 2 }} className={styles.subject}>
              {text}
            </Paragraph>
        );
      },
    },
    {
      title: '发送方式',
      dataIndex: 'sendType',
      width: 80,
      align: 'center',
      render: (text) => renderSendType(text),
    },
    {
      title: '操作',
      width: 80,
      align: 'center',
      render: (record) => {
        return <span className={styles.operator} onClick={() => operator(record.id)}>沟通记录</span>;
      },
    },
  ];
  
  return (
    <div className={styles.tablePadding}>
      <Table
        className={styles.__table}
        columns={columns}
        rowKey="id"
        pagination={{ ...paginationProps }}
        onChange={onTableChange}
        loading={loading}
        scroll={{ y: 'calc(100vh - 291px)' }}
        locale={{ emptyText: msg === '' ? <TableNotData hint="没找到相关数据"/> : 
          <TableNotData hint={msg || '没有找到相关数据'}/> }}
        dataSource={tableInfo.records}
        rowClassName={(_, index) => {
          if (index % 2 === 1) {
            return styles.dark_row;
          }
        }}
      />
    </div>
  );
};
export default TablePage;
