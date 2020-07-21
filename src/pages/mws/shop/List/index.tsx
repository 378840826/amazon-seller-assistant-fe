import React from 'react';
import { Link, useSelector, useDispatch } from 'umi';
import { IConnectState } from '@/models/connect';
import { Table, Switch, Button, Modal, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import editable from '@/pages/components/EditableCell';
import tokenEditable from './TokenEditableCell';
import { requestFeedback } from '@/utils/utils';
import styles from './index.less';

const { confirm } = Modal;

const ShopList: React.FC = () => {
  const dispatch = useDispatch();
  const loadingEffect = useSelector((state: IConnectState) => state.loading);
  const mwsShop = useSelector((state: IConnectState) => state.global.shop.mws);

  const handleSwitchClick = (checked: boolean, record: API.IShop) => {
    const text = checked ? '关闭' : '开启';
    const { id } = record;
    confirm({
      maskClosable: true,
      centered: true,
      title: '店铺操作',
      content: `${text}店铺的所有功能设置？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'global/switchShopAutoPrice',
          payload: { id, autoPrice: !checked },
          callback: requestFeedback,
        });
      },
    });
  };

  const handleUnbind = (record: API.IShop) => {
    confirm({
      maskClosable: true,
      centered: true,
      title: '店铺操作',
      content: '解绑将清除该账号的所有数据，确定解绑？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'global/unbindMwsShop',
          payload: { storeId: record.id },
          callback: requestFeedback,
        });
      },
    });
  };

  const columns: ColumnProps<API.IShop>[] = [
    {
      title: '站点',
      dataIndex: 'marketplace',
      align: 'center',
    },
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      align: 'center',
      width: 200,
      render: (storeName, record) => {
        return (
          editable({
            inputValue: storeName,
            maxLength: 20,
            confirmCallback: value => {
              const storeName = value.replace(/(^\s*)|(\s*$)/g, '');
              if (!storeName) {
                message.error('请输入店铺名称');
                return;
              }
              dispatch({
                type: 'global/modifyMwsShopName',
                payload: {
                  storeId: record.id,
                  storeName: storeName,
                },
                callback: requestFeedback,
              });
            },
          })
        );
      },
    },
    {
      title: 'Seller ID',
      dataIndex: 'sellerId',
      align: 'center',
    },
    {
      title: 'MWS Auth Token',
      dataIndex: 'token',
      align: 'center',
      width: 420,
      render: (token, record) => {
        const { tokenInvalid } = record;
        return (
          tokenEditable({
            tokenInvalid,
            inputValue: token,
            maxLength: 100,
            confirmCallback: value => {
              const token = value.replace(/(^\s*)|(\s*$)/g, '');
              if (!token) {
                message.error('请输入MWS Auth Token');
                return;
              }
              dispatch({
                type: 'global/modifyShopToken',
                payload: {
                  id: record.id,
                  token,
                },
                callback: requestFeedback,                
              });
            },
          })
        );
      },
    },
    {
      title: '调价总开关',
      dataIndex: 'autoPrice',
      align: 'center',
      render: (autoPrice, record) => {
        const loading = loadingEffect.effects['global/switchShopAutoPrice'];
        return (
          <Switch
            loading={loading}
            checked={autoPrice}
            onClick={() => handleSwitchClick(autoPrice, record)}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => handleUnbind(record)}
            className={styles.unBindBtn}
          >解绑</Button>
        );
      },
    },
  ];

  const loading = loadingEffect.effects['global/fetchShopList'];
  return (
    <div className={styles.page}>
      <Link to="/mws/shop/bind">
        <Button type="primary" className={styles.bindBtn}>添加店铺</Button>
      </Link>
      <Table
        loading={loading}
        columns={columns}
        rowKey="id"
        dataSource={mwsShop}
        pagination={false}
        locale={{ emptyText: '未绑定店铺，请点击右上角按钮完成绑定' }}
      />
    </div>
  );
};

export default ShopList;
