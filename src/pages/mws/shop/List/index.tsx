import React from 'react';
import { Link, useSelector, useDispatch } from 'umi';
import { IConnectState } from '@/models/connect';
import { Table, Switch, Button, Modal, message } from 'antd';
import { ColumnProps } from 'antd/es/table';
import editable from '@/pages/components/EditableCell';
import tokenEditable from './TokenEditableCell';
import { requestFeedback } from '@/utils/utils';
import PageTitleRightInfo from '@/pages/components/PageTitleRightInfo';
import TableNotData from '@/components/TableNotData';
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
      icon: false,
      title: '店铺操作',
      content: `${text}店铺智能调价功能？`,
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
      icon: false,
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
      title: <span className={styles.shopNameThTitle}>店铺名称</span>,
      dataIndex: 'storeName',
      align: 'left',
      width: 300,
      className: styles.shopNameCol,
      render: (storeName, record) => {
        return (
          <div>
            {
              editable({
                ghostEditBtn: true,
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
            }
          </div>
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
            className={styles.shopSwitch}
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
  const unbindLoading = loadingEffect.effects['global/unbindMwsShop'];
  return (
    <div className={styles.page}>
      <PageTitleRightInfo
        functionName={'绑定店铺'}
        rightElement={
          <Link to="/shop/bind">
            <Button type="primary" className={styles.bindBtn}>添加店铺</Button>
          </Link>
        }
        containerStyle={{ top: -44 }}
      />
      <Table
        loading={loading || unbindLoading}
        columns={columns}
        rowClassName={styles.tableTr}
        rowKey="id"
        dataSource={mwsShop}
        pagination={false}
        locale={{ emptyText: <TableNotData hint="未绑定店铺，请点击右上角按钮完成绑定" /> }}
      />
    </div>
  );
};

export default ShopList;
