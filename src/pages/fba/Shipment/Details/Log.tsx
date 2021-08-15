/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-08 14:48:05
 * @LastEditTime: 2021-04-23 16:33:36
 * 
 * Shipment信息 -> 操作日志
 */
import React from 'react';
import styles from './index.less';
import {
  Table,
} from 'antd';

interface IProps {
  dispose: boolean;
  data: Shipment.ILogs[];
}

const Log: React.FC<IProps> = props => {
  const { data } = props;

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
    rowKey: (r: {gmtCreate: string; modifyText: string}) => `${r.gmtCreate}-${r.modifyText}`,
    pagination: false as false,
    columns: columns as [],
    dataSource: data,
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
