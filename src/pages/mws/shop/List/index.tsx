/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/**
 * 店铺管理列表
 * 广告店铺和 mws 店铺合并了
 */
import React, { useState, useEffect } from 'react';
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

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window { onAmazonLoginReady: any; amazon: any }
}

const ShopList: React.FC = () => {
  const dispatch = useDispatch();
  const loadingEffect = useSelector((state: IConnectState) => state.loading);
  const shopList = useSelector((state: IConnectState) => state.global.shop.list);
  const [authorizeState, setAuthorizeState] = useState({
    visible: false,
    marketplace: '',
    storeName: '',
    storeId: '',
    sellerId: '',
  });

  function addAmazonSdk () {
    const amazonRoot = document.createElement('div');
    amazonRoot.id = 'amazon-root';
    document.body.appendChild(amazonRoot);
    window.onAmazonLoginReady = function () {
      window.amazon.Login.setClientId('amzn1.application-oa2-client.564a42b3c07c442b8b99a53419425f92');
    };
    (function (document) {
      const a = document.createElement('script');
      a.type = 'text/javascript';
      a.async = true;
      a.id = 'amazon-login-sdk';
      a.src = 'https://api-cdn.amazon.com/sdk/login1.js';
      document.getElementById('amazon-root')?.appendChild(a);
    })(window.document);
  }

  useEffect(() => {
    addAmazonSdk();
  }, []);

  const handleClickAuthorize = (record: API.IShop) => {
    setAuthorizeState({
      visible: true,
      storeName: record.storeName,
      storeId: record.id,
      sellerId: record.sellerId,
      marketplace: record.marketplace,
    });
  };

  // 点击开始授权
  const handleAuthorize = () => {
    const options = {
      scope: 'cpc_advertising:campaign_management',
      // eslint-disable-next-line @typescript-eslint/camelcase
      response_type: 'code',
    };
    // 跳转登录亚马逊
    window.amazon.Login.authorize(options, (response: any) => {
      if (response.error) {
        alert(`oauth error: ${response.error}`);
        return;
      }
      // 亚马逊登录成功, 请求添加店铺广告授权
      dispatch({
        type: 'global/adAuthorize',
        payload: {
          sellerId: authorizeState.sellerId,
          code: response.code,
          headersParams: { StoreId: authorizeState.storeId },
        },
        callback: requestFeedback,
      });
    });
    setAuthorizeState({ ...authorizeState, visible: false });
  };

  // 取消授权
  const handleClickCancelAuthorize = (record: API.IShop) => {
    confirm({
      maskClosable: true,
      centered: true,
      icon: false,
      content: `确定取消店铺 ${record.marketplace} ${record.storeName} 的广告授权？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'global/cancelAdAuthorize',
          payload: { storeId: record.id },
          callback: requestFeedback,
        });
      },
    });
  };

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
      title: '广告授权',
      dataIndex: 'bindAdStore',
      align: 'center',
      render: (bindAdStore, record) => {
        return (
          <>
            {
              bindAdStore
                ?
                <Button
                  onClick={() => handleClickCancelAuthorize(record)}
                  className={styles.authorizeBtn}
                >取消授权</Button>
                :
                <Button
                  onClick={() => handleClickAuthorize(record)}
                  className={styles.authorizeBtn}
                >授权 {bindAdStore}</Button>
            }
          </>
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
        dataSource={shopList}
        pagination={false}
        locale={{ emptyText: <TableNotData hint="未绑定店铺，请点击右上角按钮完成绑定" /> }}
      />
      <Modal
        visible={authorizeState.visible}
        title={false}
        footer={false}
        closable={false}
        keyboard={false}
        maskClosable={false}
        width={600}
        onCancel={() => setAuthorizeState({ ...authorizeState, visible: false })}
      >
        <div className={styles.authorizeModalContent}>
          <div className={styles.title}>
            {authorizeState.marketplace} {authorizeState.storeName} 广告授权
          </div>
          <div className={styles.body}>
            <p>1. 请确认当前电脑常用于登录该店铺的亚马逊后台（以免造成关联）；</p>
            <p>2. 点击开始授权按钮，在弹出的亚马逊登录页面中，使用店铺主账号登录亚马逊；</p>
            <p>3. 点击【允许】，完成授权；</p>
          </div>
          <div className={styles.foot}>
            <Button onClick={() => setAuthorizeState({ ...authorizeState, visible: false })}>
              取消
            </Button>
            <Button type="primary" onClick={handleAuthorize}>开始授权</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShopList;
