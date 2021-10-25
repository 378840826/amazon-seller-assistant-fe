/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 10:35:38
 * @LastEditTime: 2021-05-10 17:35:34
 * 
 * 仓库地址管理
 */

import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Button, Table, message, Popconfirm } from 'antd';
import { useSelector, useDispatch, ConnectProps, IWarehouseLocationState } from 'umi';
import WarehouseManage from './WarehouseManage';
import MySwitch from './MySwitch';
import { Iconfont } from '@/utils/utils';
import TableNotData from '@/components/TableNotData';
import moment from 'moment';

interface IPage extends ConnectProps {
  warehouseLocation: IWarehouseLocationState;
}

const WarehouseLocation = () => {
  const data = useSelector((state: IPage) => state.warehouseLocation.warehouses);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [editData, setEditData] = useState<WarehouseLocation.IRecord|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [requestCondition, setRequestCondition] = useState<boolean>(false);

  const dispatch = useDispatch();

  // 初始化列表
  useEffect(() => {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'warehouseLocation/getWarehouseList',
        reject,
        resolve,
        payload: {
          state: false,
        },
      });
    }).then(() => {
      setLoading(false);
    });
  }, [dispatch, requestCondition]);

  // 点击编辑按钮
  const editFn = function(data: WarehouseLocation.IRecord) {
    setEditData(data);
    setAddVisible(!addVisible);
  };

  // 删除仓库
  const deleteWarehouse = function(id: number) {
    new Promise((resolve, reject) => {
      dispatch({
        type: 'warehouseLocation/deleteWarehouse',
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
        const temp: string = JSON.stringify(data);
        const tempData: Global.IOption[] = JSON.parse(temp);
        
        message.success(msg);
        for ( let i = 0; i < data.length; i++ ) {
          const item = data[i];
          
          if (String(item.id) === String(id)) {
            tempData.splice(i, 1);

            dispatch({
              type: 'warehouseLocation/saveWarehouse',
              payload: { code: 200, data: tempData },
            });
            break;
          }
        }

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
      render(val: string, record: WarehouseLocation.IRecord) {
        const flag = val === 'enabled' ? true : false;
        return <MySwitch id={record.id} checked={flag} />;
      },
    },
    {
      title: '仓库名称',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '仓库类型',
      align: 'center',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '详细地址',
      align: 'left',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render(_: string, record: WarehouseLocation.IRecord) {
        const {
          countryCode,
          stateOrProvinceCode,
          districtOrCounty,
          addressLine1,
          addressLine2,
        } = record;
        return <div className={styles.address}>
          {countryCode + stateOrProvinceCode + districtOrCounty + addressLine1 + (addressLine2 ? addressLine2 : '')}
        </div>;
      },
    }, {
      title: '亚马逊中文地址备注',
      align: 'left',
      dataIndex: 'addressLineNa',
      key: 'addressLineNa',
      width: 110,
    }, {
      title: '关联店铺',
      align: 'center',
      dataIndex: 'stores',
      key: 'stores',
      width: 250,
      render(data: { id: string; marketplace: string; storeName: string}[]) {
        return <div>
          {data.map((item, index) => {
            return <p key={index}>{item.marketplace} - {item.storeName}</p>;
          })}
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
      render(val: string) {
        return moment(val).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'gmtModified',
      key: 'gmtModified',
      width: 150,
      render(val: string) {
        return moment(val).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'right',
      render(_: string, record: WarehouseLocation.IRecord) {
        return <div className={styles.handleCol}>
          <span className={styles.edit} onClick={() => editFn(record)}>编辑</span>
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
    loading,
    rowKey: (record: WarehouseLocation.IRecord) => String(record.id),
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
      <Button 
        type="primary" 
        onClick={() => {
          if (data.length >= 20) {
            message.error('每个账号最多添加20个仓库');
            return;
          }
          setEditData(null);
          setAddVisible(!addVisible);
        } }
      >添加仓库</Button>
      {addVisible && <WarehouseManage
        onCancel={() => setAddVisible(false)}
        initData={editData}
        addSuccessCallback={() => setRequestCondition(!requestCondition)}
        visible={addVisible}/>}
    </header>

    <Table {...tableConfig}></Table>
  </div>;
};

export default WarehouseLocation;
