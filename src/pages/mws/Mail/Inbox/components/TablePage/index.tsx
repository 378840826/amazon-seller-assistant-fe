import React, { ReactText } from 'react';
import styles from './index.less';
import { Table, Typography } from 'antd';
import classnames from 'classnames';
import { ColumnProps, TablePaginationConfig } from 'antd/es/table';
import CountDown from '../Countdown';
const { Paragraph } = Typography;
import TableNotData from '@/components/TableNotData';
import ColumnOrderInfo from '../../../components/ColumnOrderInfo';


interface IColumnStatusProps{
  status: boolean | string;
}

interface IColumnOrderProps{
  info: API.IParams[];
}


interface ITablePage{
  msg: string;
  tableInfo: API.IParams;
  loading: boolean;
  rowSelect: (selects: ReactText[] | number) => void;
  rowClick: (id: number) => void;
  selectedRowKeys: ReactText[];
  request: (params: API.IParams) => void;
}

const TablePage: React.FC<ITablePage> = ({ 
  msg, 
  tableInfo, 
  loading, 
  rowSelect,
  rowClick,
  selectedRowKeys, 
  request,
}) => {
 
 
  const onReply = (id: number, e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    rowSelect(id);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: ReactText[]) => {
      rowSelect(selectedRowKeys);
    },
  };
  
  const paginationProps = {
    current: tableInfo.current,
    pageSize: tableInfo.size,
    total: tableInfo.total,
    defaultPageSize: 20,
    showSizeChanger: true,
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

  const ColumnStatus: React.FC<IColumnStatusProps> = ({ status }) => {
    if (status === ''){
      return <div className="null_bar"></div>;
    }
    if (status){
      return <div>已回复</div>;
    }
    return <div className={styles.orange}>未回复</div>;
  };
  const columns: ColumnProps<API.IParams>[] = [
    {
      title: '发送时间',
      dataIndex: 'receivingTime',
      width: 108,
      align: 'center',
      render: (text) => {
        return (
          text === '' ? 
            <div className="null_bar"></div>
            :
            <div className={styles.receivingTime}>{text}</div>
        );
      },
    },
    {
      title: '剩余时间',
      dataIndex: 'countDown',
      width: 78,
      ellipsis: true,
      align: 'center',
      render: (text, record) => {
        return (
          <CountDown className={styles.countDown} time={text} timeKey={record.key}/>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'hasReplied',
      width: 69,
      ellipsis: true,
      align: 'center',
      render: (text) => <ColumnStatus status={text}/>,
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      width: 163,
      ellipsis: true,
      align: 'center',
      render: (text) => {
        return (
          text === '' ? 
            <div className="null_bar"></div>
            :
            <div className={styles.id}>{text}</div>
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
      title: '发件人邮箱',
      dataIndex: 'email',
      width: 200,
      ellipsis: true,
      align: 'center',
      render: (text) => <div className={styles.email}>
        {text}</div>,
    },
    {
      title: '主题',
      dataIndex: 'subject',
      width: 280,
      align: 'left',
      render: (text) => <Paragraph 
        className={styles.subject} 
        title={text}
        ellipsis={{ rows: 2 }}>{text}</Paragraph>,
    },
    {
      title: '操作',
      width: 120,
      ellipsis: true,
      dataIndex: 'id',
      align: 'center',
      render: (id) => <div className={styles.operator}>
        <span>回复</span>
        <span onClick={(e) => onReply(id, e)}>标记已回复</span>
      </div>,
    },
  
  ];

  return (
    <div>
      <Table
        className={styles.__table}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        rowKey="id"
        pagination={{ ...paginationProps }}
        onChange={onTableChange}
        loading={loading}
        scroll={{ y: 'calc(100vh - 317px)' }}
        locale={{ emptyText: msg === '' ? <TableNotData hint="没找到相关数据"/> : 
          <TableNotData hint={msg || '没有找到相关数据'}/> }}
        dataSource={tableInfo.records}
        rowClassName={(record, index) => {
          return classnames({ [styles.bold]: !record.hasRead,
            [styles.dark_row]: index % 2 === 1, 
          });
        }}
        onRow={
          (record) => {
            return {
              onClick: event => {
                event.stopPropagation();
                rowClick(record.id);
              }, //点击行
            };
          }
        }
      />
    </div>
  );
};
export default TablePage;
