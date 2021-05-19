/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-08 14:48:05
 * @LastEditTime: 2021-05-14 17:15:41
 * 
 * Shipment信息
 */
import React from 'react';
import styles from './index.less';
import {
  Table,
} from 'antd';
import moment from 'moment';

interface IProps {
  data: planList.ILog[];
}

const Log: React.FC<IProps> = props => {
  const { data } = props;
  const columns = [
    {
      title: '时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      align: 'center',
      width: 300,
      render: (val: string) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
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
