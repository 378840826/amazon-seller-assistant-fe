/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-08 14:48:05
 * @LastEditTime: 2021-05-14 17:16:42
 * 
 * Shipment信息
 */
import React from 'react';
import styles from './index.less';
import { Table } from 'antd';

interface IProps {
  data: [];
}


const Shipment: React.FC<IProps> = function({ data }) {
  const columns = [
    {
      title: 'ShipmentID',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: 'Shipment名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '亚马逊仓库代码',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '申报量',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '已发量',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '已收量',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      width: 100,
      render(val: string) {
        return <div className={styles.dateCol}>
          {val}
        </div>;
      },
    },
    {
      title: '开始收货时间',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      width: 100,
      render(val: string) {
        return <div className={styles.dateCol}>
          {val}
        </div>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
      width: 100,
      render(val: string) {
        return <div className={styles.dateCol}>
          {val}
        </div>;
      },
    },
    {
      title: '创建人',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 100,
    },
  ];

  const tableConfig = {
    pagination: false as false,
    columns: columns as [],
    dataSource: data,
    locale: {
      emptyText: <div className={styles.notData}>货件计划未处理，Shipment信息为空</div>,
    },
    scroll: {
      y: 316,
      x: 'max-content',
    },
    rowKey: (record: { id: string }) => record.id,
  };

  return <div className={styles.shipmentBox}>
    <Table {...tableConfig}/>
  </div>;
};


export default Shipment;
