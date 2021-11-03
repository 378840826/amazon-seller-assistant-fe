/**
 * 表格
 */
import React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import TableNotData from '@/components/TableNotData';
import styles from './index.less';

interface IProps<T> {
  dataSource: Array<T>;
  columns: ColumnProps<T>[];
  loading?: boolean;
  current: number;
  size: number;
  total: number;
  // 翻页回调
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (p: any) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MyTable: React.FC<IProps<any>> = function(props) {
  const { 
    columns,
    loading,
    total,
    dataSource,
    current,
    size,
    onChange,
  } = props;

  // 分页器配置
  const paginationProps = {
    current: Number(current),
    pageSize: Number(size),
    total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
  };

  // 表格参数变化（翻页）
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleTableChange (pagination: any) {
    const { current, pageSize: size } = pagination;
    const params = { current, size };
    onChange(params);
  }

  return (
    <div className={styles.container}>
      <Table
        scroll={{
          x: 'max-content',
          y: 331,
          scrollToFirstRowOnChange: true,
        }}
        loading={loading}
        columns={columns}
        rowKey="time"
        dataSource={dataSource}
        locale={{ emptyText: <TableNotData style={{ padding: 40 }} hint="没有找到相关数据" /> }}
        pagination={{ ...paginationProps, size: 'default' }}
        onChange={handleTableChange}
      /> 
    </div>
  ); 
};

export default MyTable;
