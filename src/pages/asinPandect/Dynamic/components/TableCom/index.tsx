import React, { useEffect, useState } from 'react';
import { useDispatch } from 'umi';
import { Table } from 'antd';
import styles from './index.less';
import editable from '@/pages/components/EditableCell';
import { ColumnProps, TablePaginationConfig } from 'antd/lib/table';
import RenderValue from '@/pages/mws/AsinChange/components/renderValue'; 

interface ITableCom{
  StoreId: string;
  asin: string;
  dateStart: string;
  dateEnd: string;
  changeType: string[];
  size: number;
  current: number;
  modifySendState: (params: API.IParams) => void;
}

interface IState{
  tableInfo: API.IParams;
  message: string;
  loading: boolean;
}
const TableCom: React.FC<ITableCom> = ({
  StoreId,
  asin,
  dateStart,
  dateEnd,
  changeType,
  size,
  current,
  modifySendState,
}) => {
  const dispatch = useDispatch();
  const [state, setState] = useState<IState>({
    tableInfo: {},
    message: '',
    loading: false,
  });

  const paginationProps = {
    current: state.tableInfo.current,
    pageSize: state.tableInfo.size,
    total: state.tableInfo.total,
    defaultPageSize: 20,
    showSizeChanger: true,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 个`,
  };

  const onTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    modifySendState({ size: pageSize, current });
  };

  const columns: ColumnProps<API.IParams>[] = [
    {
      title: '数据获取时间',
      dataIndex: 'collectionTime',
      width: 200,
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
      title: '变化类型',
      dataIndex: 'changeInfo',
      width: 100,
      align: 'center',
      render: (text) => {
        return (
          text === '' ? <div className="null_bar"></div>
            :
            <div className={styles.changeInfo}>{text}</div>
        );
      },
    },
    {
      title: '旧值',
      dataIndex: 'oldValue',
      width: 300,
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
      width: 300,
      align: 'center',
      render: (text, record) => {
        return (
          <RenderValue text={text} record={record}/>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: 100,
      align: 'center',
      render: (text, record) => {
        return (
          editable({
            ghostEditBtn: false,
            inputValue: text,
            maxLength: 20,
            confirmCallback: value => {
              const newValue = value.trim();
              if (newValue === '') {
                return; 
              }
              dispatch({
                type: 'dynamic/updateRemarks',
                payload: {
                  data: {
                    headersParams: {
                      StoreId,
                    },
                    id: record.id,
                    remarks: newValue,
                  },
                },
                callback: () => {
                  const tableInfo = state.tableInfo; 
                  tableInfo.records[record.key].remarks = newValue;
                  setState((state) => ({
                    ...state,
                    tableInfo,
                  }));
                },
              });
            },
          })
        );
      },
    },
  ];


  useEffect(() => {
    setState((state) => ({
      ...state,
      loading: true,
    }));
    dispatch({
      type: 'dynamic/getDynamicList',
      payload: {
        data: {
          headersParams: {
            StoreId,
          },
          asin,
          dateStart,
          dateEnd,
          cycle: '',
          changeType,
        },
        params: {
          size,
          current,
        },
      },
      callback: (res: {code: number;data: API.IParams;message: string}) => {
        if (res.code === 200){
          setState((state) => ({
            ...state,
            tableInfo: res.data,
            message: '',
            loading: false,
          }));
        } else {
          setState((state) => ({
            ...state,
            tableInfo: {},
            message: res.message,
            loading: false,
          }));
        }
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, StoreId, dateStart, dateEnd, size, current, asin, JSON.stringify(changeType)]);
  return (
    <div className={styles.__table_com}>
      <Table
        className={styles.__table}
        rowKey="id"
        columns={columns}
        pagination={{ ...paginationProps }}
        onChange={onTableChange}
        loading={state.loading}
        scroll={{ x: 'max-content', y: '618px' }}
        locale={{ emptyText: state.message === '' ? 'Oops! 没有更多数据啦' : state.message }}
        dataSource = {state.tableInfo.records}
        rowClassName={(_, index) => {
          if (index % 2 === 1) {
            return styles.dark_row;
          }
        }}
      />
    </div>
  );
};
export default TableCom;
