/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 10:35:38
 * @LastEditTime: 2021-05-10 17:30:35
 * 
 * 库位管理
 */

import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import { Table, message, Popconfirm, Button } from 'antd';
import { useDispatch } from 'umi';
import Add from './Add';
import Edit from './Edit';
import Upload from './Upload';
import MySwitch from './MySwitch';
import { Iconfont } from '@/utils/utils';
import TableNotData from '@/components/TableNotData';
import moment from 'moment';


const StorageLocation = () => {
  const [data, setData] = useState<StorageLocation.IRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 表格loading
  const [initCondition, setInitCondition] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);

  const dispatch = useDispatch();

  const request = useCallback((params = { currentPage: 1, pageSize: 20 }) => {
    let payload = { state: false };
    payload = Object.assign({}, payload, params);
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'storageLocation/getStoreageLocationList',
        resolve,
        reject,
        payload,
      });
    }).then(datas => {
      setLoading(false);
      const {
        code,
        message: msg,
        data,
      } = datas as {
        code: number;
        message: string;
        data: {
          page: {
            records: StorageLocation.IRecord[];
            current: number;
            size: number;
            total: number;
          };
        };
      };

      if (code === 200) {
        setPageSize(Number(data.page.size));
        setCurrent(Number(data.page.current));
        setTotal(Number(data.page.total));
        setData(data.page.records);
        return;
      }

      message.error(msg || '获取列表失败');
    });
  }, [dispatch]);

  useEffect(() => {
    request({ pageSize, currentPage: current });
  }, [request, initCondition, pageSize, current]);

  // 删除库位
  const deleteStorageLocation = function(id: number) {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'storageLocation/deleteStorageLocation',
        resolve,
        reject,
        payload: {
          id,
        },
      });
    }).then(datas => {
      const {
        code,
        message: msg,
      } = datas as Global.IBaseResponse;

      if (code === 200) {
        message.success(msg);
        setInitCondition(!initCondition);
        return;
      }
      message.error(msg);
    });
  };

  const columns = [
    {
      title: '状态',
      align: 'center',
      dataIndex: 'state',
      key: 'state',
      width: 80,
      render(val: string, record: StorageLocation.IRecord) {
        const flag = val === 'enabled' ? true : false;
        return <MySwitch id={record.id} checked={flag} />;
      },
    },
    {
      title: '库位号',
      align: 'center',
      dataIndex: 'locationNo',
      key: 'locationNo',
      width: 100,
    },
    {
      title: '仓库',
      align: 'center',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 100,
    },
    {
      title: 'SKU',
      align: 'left',
      dataIndex: 'skus',
      key: 'name',
      width: 100,
      render(skus: string[]) {
        return <div>
          {
            skus.map((item, index) => {
              return <p key={index}>{item}</p>;
            })
          }
        </div>;
      },
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'username',
      key: 'username',
      width: 100,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 150,
      render: (val: string) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      width: 150,
      render: (val: string) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'right',
      render(_: string, record: StorageLocation.IRecord) {
        return <div className={styles.handleCol}>
          <Edit initData={record} successCallback={() => setInitCondition(!initCondition)}></Edit>
          <Popconfirm
            title="确定删除此库位号？"
            onConfirm={() => deleteStorageLocation(record.id)}
            icon={<Iconfont type="icon-tishi2" />}
            okText="确定"
            cancelText="取消"
            placement="right"
            arrowPointAtCenter
            overlayClassName={styles.delTooltip}
          ><span className={styles.delete}>删除</span></Popconfirm>
        </div>;
      },
    },
  ];

  const tableConfig = {
    pagination: {
      pageSizeOptions: ['20', '50', '100'],
      total,
      pageSize,
      current,
      showQuickJumper: true, // 快速跳转到某一页
      showSizeChanger: true,
      showTotal: (total: number) => `共 ${total} 个`,
      onChange(currentPage: number, pageSize: number | undefined){
        request({ currentPage, pageSize });
      },
    },
    columns: columns as [],
    dataSource: data as [],
    rowKey: (record: StorageLocation.IRecord) => String(record.id),
    loading,
    scroll: {
      y: 'calc(100vh - 270px)',
      x: 'max-content',
    },
    locale: {
      emptyText: <TableNotData hint="没有找到相关订单，请重新选择查询条件"/>,
    },
  };

  return <div className={styles.box}>
    <header className={styles.topHead}>
      <Add successCallback={ () => {
        setInitCondition(!initCondition);
      } }/>
      <Upload successCallback={ () => {
        setInitCondition(!initCondition);
      } }/>
      <Button href="/api/mws/shipment/location/importTemplate" type="link">下载模板</Button>
    </header>
    <Table {...tableConfig} />
  </div>;
};

export default StorageLocation;
