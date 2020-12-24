import React, { ReactText } from 'react';
import styles from './index.less';
import { Table, Switch } from 'antd';
import CompetitionOperator from '../competitionOperator';
import { ColumnProps } from 'antd/es/table';
import ProductInfo from '../productInfo';
import EchartsInfo from '../echartsInfo';
import TableNotData from '@/components/TableNotData';
import SkuInfo from '../skuInfo';
import { Iconfont, toThousands } from '@/utils/utils';
interface ITablePage{
  loading: boolean;
  tableInfo: API.IParams;
  tableMessage: string;
  StoreId: string;
  fetchList: () => void;
  selectedRows: ReactText[];
  selectedRowKeysChange: (_: ReactText[]) => void;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTableChange: (_: any, __: any, sorter: any) => void;
  toggleChange: (status: boolean, ids: ReactText[]) => void;
}


const TablePage: React.FC<ITablePage> = ({ 
  loading, 
  tableInfo, 
  StoreId,
  tableMessage,
  selectedRows,
  selectedRowKeysChange,
  toggleChange,
  fetchList,
  onTableChange }) => {
 
  const { order, asc, size, current, total, records = [] } = tableInfo;
  
  //1. 页脚
  const paginationProps = {
    current,
    pageSize: size,
    total,
    showSizeChanger: true,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 个`,
  };
  //2. 表格复选框选中
  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys: ReactText[]) => {
      selectedRowKeysChange(selectedRowKeys);
    },
  };
  const columns: ColumnProps<API.IParams>[] = [
    {
      title: '监控开关',
      dataIndex: 'monitoringSwitch',
      key: 'monitoringSwitch',
      align: 'center',
      width: 78,
      fixed: 'left',
      render: (text, record) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <Switch checked={text} 
              className={styles.__switch}
              onChange={(checked: boolean) => toggleChange(checked, [record.id])}
            />
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: true,
      fixed: 'left',
      sortOrder: order === 'updateTime' ? asc : null,
      align: 'center',
      width: 93,
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <span className={styles.time}>{text}</span>
        );
      },
    },
    {
      title: '监控次数',
      dataIndex: 'monitoringNumber',
      key: 'monitoringNumber',
      align: 'center',
      fixed: 'left',
      width: 85,
      render: (text) => {
        return (
          text === '' ? 
            <div className="null_bar"></div>
            :
            <span>{text}</span>
        );
      },
    },
    {
      title: '商品信息',
      dataIndex: 'productInfo',
      key: 'productInfo',
      align: 'center',
      fixed: 'left',
      width: 303,
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <ProductInfo item={text}/>
        );
      },
    },
    {
      title: 'SKU',
      dataIndex: 'skuInfo',
      key: 'skuInfo',
      align: 'left',
      fixed: 'left',
      width: 212,
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <SkuInfo item={text}/>
        );
      },
    },
    {
      title: '关键词',
      dataIndex: 'keyword',
      key: 'keyword',
      fixed: 'left',
      align: 'left',
      width: 158,
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <div className={styles.keyword}>{text}</div>
        );
      },
    },
    {
      title: '月搜索量',
      dataIndex: 'searchVolume',
      key: 'searchVolume',
      align: 'center',
      sorter: true,
      sortOrder: order === 'searchVolume' ? asc : null,
      width: 93,
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <span>{toThousands(text)}</span>
        );
      },
    },
    {
      title: '搜索结果数',
      dataIndex: 'searchResultsNumber',
      key: 'searchResultsNumber',
      width: 91,
      sorter: true,
      sortOrder: order === 'searchResultsNumber' ? asc : null,
      align: 'center',
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <span>{toThousands(text)}</span>
        );
      },
    },
    {
      title: '搜索结果自然排名',
      align: 'right',
      className: styles.__naturalRanking,
      width: 150,
      sorter: true,
      sortOrder: order === 'naturalRanking' ? asc : null,
      dataIndex: 'naturalRankingData',
      key: 'naturalRankingData',
      render: (text, record) => {
        return (
          <EchartsInfo type="natural" item={text} StoreId={StoreId} id={record.id}/>
        );
      },
    },
    {
      title: '搜索结果广告排名',
      align: 'right',
      className: styles.__naturalRanking,
      width: 150,
      sorter: true,
      sortOrder: order === 'advertisingRanking' ? asc : null,
      dataIndex: 'advertisingRankingData',
      key: 'advertisingRankingData',
      render: (text, record) => {
        return (
          <EchartsInfo type="ad" item={text} StoreId={StoreId} id={record.id}/>
        );
      },
    },
    {
      title: () => {
        return (
          <>
            <div>当前是否</div>
            <div>Amazon&#39;s Choice</div>
          </>
        );
      },
      dataIndex: 'isAc',
      key: 'isAc',
      align: 'center',
      width: 116,
      render: (text) => {
        return (
          text === '' ? 
            <div className="null_bar"></div>
            :
            <span>{text === true ? <Iconfont className={styles.yes_icon} type="icon-dui"/> 
              : <Iconfont className={styles.close_icon} type="icon-guanbi1"/>}</span>
        );
      },
    },
    {
      title: () => {
        return (
          <>
            <div>曾经是否</div>
            <div>Amazon&rsquo;s Choice</div>
          </>
        );
      },
      dataIndex: 'onceIsAc',
      key: 'onceIsAc',
      align: 'center',
      width: 131,
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <span>{text === true ? <Iconfont className={styles.yes_icon} type="icon-dui"/> 
              : <Iconfont className={styles.close_icon} type="icon-guanbi1"/>}</span>
        );
      },
    },
    {
      title: () => {
        return (
          <>
            <div>搜索第1页竞</div>
            <div>品ASIN占比</div>
          </>
        );
      },
      dataIndex: 'ratio',
      key: 'ratio',
      align: 'center',
      sorter: true,
      sortOrder: order === 'ratio' ? asc : null,
      width: 88,
      render: (text) => {
        return (
          text === '' ?
            <div className="null_bar"></div>
            :
            <span>{text}%</span>
        );
      },
    },
    {
      title: '操作',
      width: 65,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        return (
          <CompetitionOperator 
            id={record.id} 
            fetchList={fetchList}
            StoreId={StoreId}/>

        );
      },
    },
  ];

  return (
   
    <Table
      pagination={{ ...paginationProps }}
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
      loading={loading}
      rowKey="id"
      showSorterTooltip={false}
      dataSource={records}
      columns={columns}
      sortDirections={['descend', 'ascend']}
      scroll={records.length > 0 ? Object.assign({ x: 1825 }, { y: 'calc(100vh - 317px)' }) : { x: 1825 }}
      className={styles.custom_table}
      onChange={onTableChange}
      locale={{ emptyText: tableMessage === '' ? 
        <TableNotData hint="没找到相关数据"/> : 
        <TableNotData hint={tableMessage}/> }}
      
      rowClassName={(_, index) => {
        if (index % 2 === 1) {
          return styles.darkRow;
        }
      }}
    />
  );
};
export default TablePage;
