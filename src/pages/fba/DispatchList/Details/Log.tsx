/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-08 14:48:05
 * @LastEditTime: 2021-04-22 11:05:10
 * 
 * Shipment信息
 */
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Table } from 'antd';

interface IProps {
  data: DispatchList.IDispatchLog[]|null;
}

const Log: React.FC<IProps> = props => {
  const { data } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<DispatchList.IDispatchLog[]>(data || []);
  
  useEffect(() => {
    Array.isArray(data) && (
      setLoading(false),
      setDataSource(data)
    );
  }, [data]);

  const columns = [
    {
      title: '时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      align: 'center',
      width: 100,
      render(val: string) {
        return <div className={styles.dateCol}>
          {val}
        </div>;
      },
    },
    {
      title: '操作人',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
      width: 100,
      render(val: string) {
        return <div className={styles.dateCol}>
          {val}
        </div>;
      },
    },
    {
      title: '操作',
      dataIndex: 'modifyText',
      key: 'modifyText',
      align: 'center',
    },
  ];

  const tableConfig = {
    rowKey: (record: {gmtCreate: string}) => record.gmtCreate,
    pagination: false as false,
    columns: columns as [],
    dataSource: dataSource,
    loading,
    locale: {
      emptyText: <div className={styles.notData}>操作信息为空</div>,
    },
    scroll: {
      y: 316,
      x: 'max-content',
    },
  };

  return <div className={styles.logBox}>
    <Table {...tableConfig}/>
  </div>;
};


export default Log;
