import React from 'react';
import styles from './index.less';
import { Table, Switch } from 'antd';
import { Link, connect } from 'umi';
import ColumnInfo from '../../../components/columnMonitorInfo';
import { ColumnProps, TablePaginationConfig } from 'antd/es/table';
import { IConnectState, IConnectProps } from '@/models/connect';

interface ITablePageProps extends IConnectProps{
  tableInfo: API.IParams;
  tableErrorMsg: string;
  loading: boolean;
  StoreId: string;
  setParams: (obj: API.IParams) => void;
  onTableSwitchChange: (status: boolean, record: API.IParams) => void;
}

const TablePage: React.FC<ITablePageProps> = ({
  tableInfo,
  tableErrorMsg,
  loading,
  StoreId,
  setParams,
  onTableSwitchChange,
  dispatch,
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

  const onChange = (status: boolean, record: API.IParams) => {
    dispatch({
      type: 'dynamic/setSwitch',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
          asin: record.productInfo.asin,
          switchStatus: status,
        },
      },
      callback: () => {
        onTableSwitchChange(status, record);
      },
    });
  };

  const onTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    const { current, pageSize } = pagination;
    setParams({ current, size: pageSize });
  };

  const columns: ColumnProps<API.IParams>[] = [
    {
      title: '监控开关',
      dataIndex: 'monitoringSwitch',
      width: 108,
      align: 'center',
      render: (text, record) => {
        return (
          text === '' ? <div className="null_bar"></div> 
            :
            <div className={styles.switch}>
              <Switch checked={text} onChange={(status) => onChange(status, record)}/>
            </div>
        );
      },
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 108,
      align: 'center',
      render: (text) => {
        return (
          text === '' ? <div className="null_bar"></div>
            :
            <div className={styles.updateTime}>
              {text}
            </div>
        );
      },
    },
    {
      title: '商品信息',
      dataIndex: 'productInfo',
      align: 'center',
      width: 250,
      render: (text) => {
        return (
          <ColumnInfo item={text}/>
        );
      },
    },
    {
      title: '监控次数',
      dataIndex: 'monitoringNumber',
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'productInfo',
      width: 100,
      render: (record) => {
        return (
          <Link className={styles.hover_color} to={`/asin/base?asin=${record.asin}`}>查看</Link>
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
        scroll={{ x: 'max-content', y: 'calc(100vh - 271px)' }}
        dataSource={tableInfo.records}
        locale={{ emptyText: tableErrorMsg === '' ? 'Oops! 没有更多数据啦' : tableErrorMsg }}
        rowClassName={(_, index) => {
          if (index % 2 === 1) {
            return styles.dark_row;
          }
        }}
      />
    </div>
  );
};
export default connect(({ global }: IConnectState) => ({
  StoreId: global.shop.current.id,
}))(TablePage);
