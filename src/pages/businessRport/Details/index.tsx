import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import { IConnectState } from '@/models/connect';
import { Table, Typography } from 'antd';
import { TablePaginationConfig } from 'antd/es/table';
import { requestErrorFeedback, getPageQuery } from '@/utils/utils';
import styles from './index.less';

const { Paragraph } = Typography;

const BsDetails: React.FC = () => {
  const { date, reportId } = getPageQuery();
  const dispatch = useDispatch();
  const page = useSelector((state: IConnectState) => state.bs);
  const { report: { records, current, size, total } } = page;  
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['bs/fetchReport'];
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;
  useEffect(() => {
    if (currentShopId !== '-1') {
      dispatch({
        type: 'bs/fetchReport',
        payload: {
          filtrateParams: {
            id: reportId,
            current: 1,
            size: 20,
          },
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId, reportId]);

  // 分页配置
  const paginationProps: TablePaginationConfig = {
    total,
    current,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    onChange: (current, pageSize) => {
      dispatch({
        type: 'bs/fetchReport',
        payload: {
          // 如果改变了 pageSize， 则重置为第一页
          filtrateParams: { 
            current: pageSize === size ? current : 1,
            size: pageSize,
            id: reportId,
          },
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
    },
  };


  return (
    <div className={styles.page}>
      <div className={styles.pageTitle}>
        Business Rport
        <span> ({date})</span>
      </div>
      <Table
        className={styles.Table}
        scroll={{ x: 'max-content', y: 'calc(100vh - 206px)', scrollToFirstRowOnChange: true }}
        loading={loading}
        columns={[
          {
            title: '(Parent) ASIN',
            dataIndex: 'parentAsin',
            align: 'center',
            fixed: 'left',
            width: 110,
          }, {
            title: '(Child) ASIN',
            dataIndex: 'childAsin',
            align: 'center',
            fixed: 'left',
            width: 110,
          }, {
            title: 'Title',
            dataIndex: 'title',
            align: 'center',
            fixed: 'left',
            width: 300,
            render: title => <Paragraph title={title} ellipsis={{ rows: 2 }}>{title}</Paragraph>,
          }, {
            title: 'Sessions',
            dataIndex: 'sessions',
            align: 'center',
            width: 100,
          }, {
            title: 'Session Percentage',
            dataIndex: 'sessionPercentage',
            align: 'center',
            width: 100,
          }, {
            title: 'Page Views',
            dataIndex: 'pageViews',
            align: 'center',
            width: 100,
          }, {
            title: 'Page Views Percentage',
            dataIndex: 'pageViewsPercentage',
            align: 'center',
            width: 100,
          }, {
            title: 'Buy Box Percentage',
            dataIndex: 'buyBoxPercentage',
            align: 'center',
            width: 100,
          }, {
            title: 'Units Ordered',
            dataIndex: 'unitsOrdered',
            align: 'center',
            width: 100,
          }, {
            title: 'Units Ordered - B2B',
            dataIndex: 'unitsOrderedB2b',
            align: 'center',
            width: 100,
          }, {
            title: 'Unit Session Percentage',
            dataIndex: 'unitSessionPercentage',
            align: 'center',
            width: 100,
          }, {
            title: 'Unit Session Percentage - B2B',
            dataIndex: 'unitSessionPercentageB2b',
            align: 'center',
            width: 100,
          }, {
            title: 'Ordered Product Sales',
            dataIndex: 'orderedProductSales',
            align: 'center',
            width: 100,
          }, {
            title: 'Ordered Product Sales - B2B',
            dataIndex: 'orderedProductSalesB2b',
            align: 'center',
            width: 100,
          }, {
            title: 'Total Order Items',
            dataIndex: 'totalOrderItems',
            align: 'center',
            width: 100,
          }, {
            title: 'Total Order Items - B2B',
            dataIndex: 'totalOrderItemsB2b',
            align: 'center',
            width: 100,
          },
        ]}
        rowKey="id"
        rowClassName={(_, index) => {
          if (index % 2 === 1) {
            return styles.darkRow;
          }
        }}
        dataSource={records}
        locale={{ emptyText: '未找到相关数据' }}
        showSorterTooltip={false}
        pagination={{ ...paginationProps }}
      />
    </div>
  );
};

export default BsDetails;
