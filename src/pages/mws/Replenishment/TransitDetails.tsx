import React, { useState } from 'react';
import { Button, Dropdown, Space, Table } from 'antd';
import { useSelector, useDispatch } from 'umi';
import { IConnectState } from '@/models/connect';
import { requestErrorFeedback } from '@/utils/utils';
import classnames from 'classnames';
import { renderCouldNullTd } from './cols';
import TableNotData from '@/components/TableNotData';
import styles from './index.less';

interface IProps {
  sku: string;
  inTransitInventory: number;
}

const TransitDetails: React.FC<IProps> = props => {
  const dispatch = useDispatch();
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['replenishment/fetchTransitDetails'];
  const transitDetails = useSelector((state: IConnectState) => state.replenishment.transitDetails);
  const currentShopId = useSelector((state: IConnectState) => state.global.shop.current.id);

  const [visible, setVisible] = useState<boolean>(false);
  const { sku, inTransitInventory } = props;

  // 获取在途详情
  const getTransitDetails = (sku: string) => {
    dispatch({
      type: 'replenishment/fetchTransitDetails',
      payload: {
        sku,
        headersParams: { StoreId: currentShopId },
        // 后端要求的固定参数
        order: 'createTime',
        asc: false,
      },
      callback: requestErrorFeedback,
    });
  };

  const overlay = () => (
    <div className={styles.detailsDropdownConten}>
      <Table
        scroll={{ x: 'max-content', y: '300px' }}
        loading={loading}
        columns={[
          {
            title: 'ShipmentID',
            dataIndex: 'shipmentId',
            align: 'center',
            width: 150,
          }, {
            title: 'Shipment名称',
            dataIndex: 'shipmentName',
            align: 'center',
          }, {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 100,
          }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            align: 'center',
            width: 100,
          }, {
            title: 'Shipped数量',
            dataIndex: 'shippedQuantity',
            align: 'center',
            width: 100,
          }, {
            title: 'Received数量',
            dataIndex: 'receivedQuantity',
            align: 'center',
            width: 110,
          }, {
            title: '在途数量',
            dataIndex: 'inTransitQuantity',
            align: 'center',
            width: 90,
            render: inTransitQuantity => (
              <span className={styles.inTransitQuantityTd}>{inTransitQuantity}</span>
            ),
          }, {
            title: '目的地',
            dataIndex: 'destination',
            align: 'center',
            width: 80,
            render: value => renderCouldNullTd(value),
          }, {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            width: 100,
          }, {
            title: '预计到货时间',
            dataIndex: 'estimatedArrival',
            align: 'center',
            width: 110,
            render: estimatedArrival => (estimatedArrival || '—'),
          },
        ]}
        pagination={false}
        rowKey="shipmentId"
        dataSource={transitDetails}
        locale={{ emptyText: <TableNotData hint="没有找到相关数据" className={styles.detailsNotData} /> }}
      />
    </div>
  );
  const activeClassName = visible ? styles.activeDetailsBtn : '';
  return (
    <Space direction="vertical" size={2}>
      { inTransitInventory }
      <Dropdown
        overlay={overlay}
        visible={visible}
        placement="bottomCenter"
        trigger={['click']}
        arrow
        onVisibleChange={visible => {
          setVisible(visible);
          visible && getTransitDetails(sku);
        }}
      >
        <Button type="link" className={classnames(styles.detailsBtn, activeClassName)}>
          详情
        </Button>
      </Dropdown>
    </Space>
  );
};

export default React.memo(TransitDetails);
