import React from 'react';
import { Table } from 'antd';
import { ColumnProps, TablePaginationConfig } from 'antd/es/table';
import styles from './index.less';
import { Link } from 'umi';
import RenderValue from '../../../components/renderValue';
import ColumnOrderInfo from '../../../components/columnInfo';
interface ITablePage{
  tableInfo: API.IParams;
  tableErrorMsg: string;
  loading: boolean;
  modifySendState: (params: API.IParams) => void;
}
const TablePage: React.FC<ITablePage> = (
  { tableInfo, 
    tableErrorMsg, 
    loading, 
    modifySendState,
  }) => {
  console.log('tableInfo:', tableInfo);
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
    modifySendState({ current: current, size: pageSize });
  };

  const columns: ColumnProps<API.IParams>[] = [
    {
      title: '数据获取时间',
      dataIndex: 'collectionTime',
      width: 100,
      align: 'center',
      render: (text) => {
        return (
          text === '' ? <div className="null_bar"></div>
            :
            <div className={styles.collectionTime}>{text}</div>
        );
      },
    },
    {
      title: '商品信息',
      dataIndex: 'productInfo',
      width: 200,
      align: 'center',
      ellipsis: true,
      render: (text) => {
        return (
          <ColumnOrderInfo item={text}/>
        );
      },
    },
    {
      title: 'SKU',
      dataIndex: 'skuList',
      width: 50,
      align: 'left',
      render: (text) => {
        return (
          <>
            {text.map((item: string, index: number) => {
              return (
                <div key={index}>{item}</div>
              );
            })}
          </>
        );
      },
    },
    {
      title: '变化类型',
      dataIndex: 'changeInfo',
      width: 100,
      align: 'center',
    },
    {
      title: '旧值',
      dataIndex: 'oldValue',
      width: 200,
      align: 'center',
      render: (text, record) => {
        return (
          <RenderValue text={text} record={record}/>
        );
      },
    },
    {
      title: '新值',
      dataIndex: 'newValue',
      width: 200,
      align: 'center',
      render: (text, record) => {
        return (
          <RenderValue text={text} record={record}/>
        );
      },
    },
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: (record) => {
        return (
          <Link 
            className={styles.hover_detail} 
            target="_blank" 
            to={`/asin/dt?asin=${record.productInfo.asin}`}>
              详情
          </Link>
        );
      },
    },
  ];
  return (
    <div>
      <Table 
        className={styles.__table}
        rowKey="key"
        columns={columns}
        loading={loading}
        pagination={{ ...paginationProps }}
        onChange={onTableChange}
        scroll={{ x: true, y: 662 }}
        dataSource={tableInfo.records}
        locale={{ 
          emptyText: tableErrorMsg === '' ? 
            'Oops! 没有更多数据啦' : tableErrorMsg }}
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
