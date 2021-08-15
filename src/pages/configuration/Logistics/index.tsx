/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 10:35:38
 * @LastEditTime: 2021-05-10 17:29:04
 * 
 * 物流方式管理
 */

import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Table, message, Popconfirm } from 'antd';
import { useSelector, useDispatch, ConnectProps, ILogisticsState } from 'umi';
import MySwitch from './MySwitch';
import { Iconfont } from '@/utils/utils';
import Add from './Add';
import Edit from './Edit';
import moment from 'moment';


interface IPage extends ConnectProps {
  logistics: ILogisticsState;
}

const Logistics = () => {

  const data = useSelector((state: IPage) => state.logistics.logistics);
  const [loading, setLoading] = useState<boolean>(true); // 表格loading
  const [initCondition, setInitCondition] = useState<boolean>(true); // 表格loading

  const dispatch = useDispatch();

  // 初始化列表
  useEffect(() => {
    setLoading(true);
    new Promise((resolve, reject) => {
      dispatch({
        type: 'logistics/getLogisticsList',
        reject,
        resolve,
        payload: {
          state: false,
        },
      });
    }).then(() => {
      setLoading(false);
    });
  }, [dispatch, initCondition]);

  // 删除仓库
  const deleteWarehouse = function(id: string) {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'logistics/deleteLogistics',
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
        dispatch({
          type: 'logistics/deleteLogistic',
          payload: { id },
        });
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
      render(val: string, record: Logistics.IRecord) {
        const flag = val === 'enabled' ? true : false;
        return <MySwitch id={record.id} checked={flag} />;
      },
    },
    {
      title: '物流名称',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '物流商名称',
      align: 'center',
      dataIndex: 'providerName',
      key: 'providerName',
      width: 100,
    },
    {
      title: '货代',
      align: 'center',
      dataIndex: 'forwarderName',
      key: 'forwarderName',
      width: 210,
      render(val: string) {
        return <div className={styles.address}>
          {val}
        </div>;
      },
    },
    {
      title: '发货国家',
      align: 'center',
      dataIndex: 'countryCode',
      key: 'countryCode',
      width: 250,
    },
    {
      title: '计费方式',
      align: 'center',
      dataIndex: 'chargeType',
      key: 'chargeType',
      width: 150,
    },
    {
      title: '体积重系数',
      align: 'center',
      dataIndex: 'volumeWeight',
      key: 'volumeWeight',
      width: 150,
    },
    {
      title: '创建人',
      align: 'center',
      dataIndex: 'username',
      key: 'username',
      width: 150,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 250,
      render: (val: string) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      width: 250,
      render: (val: string) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'right',
      render(_: string, record: Logistics.IRecord) {
        return <div className={styles.handleCol}>
          <Edit initData={record} successCallback={() => setInitCondition(!initCondition)}></Edit>
          <Popconfirm
            title="确定要删除该仓库吗"
            onConfirm={() => deleteWarehouse(record.id)}
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
    pagination: false as false,
    columns: columns as [],
    dataSource: data as [],
    rowKey: (record: Logistics.IRecord) => String(record.id),
    loading,
    scroll: {
      y: 'calc(100vh - 270px)',
      x: 'max-content',
    },
  };

  return <div className={styles.box}>
    <header className={styles.topHead}>
      <Add logisticsLength={data.length} successCallback={ () => {
        setInitCondition(!initCondition);
      } }/>
    </header>

    <Table {...tableConfig}></Table>
  </div>;
};

export default Logistics;
