import React, { useEffect } from 'react';
import { Link, useSelector, useDispatch } from 'umi';
import { IConnectState } from '@/models/connect';
import { Table, Pagination, ConfigProvider } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { Iconfont, requestErrorFeedback } from '@/utils/utils';
import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.less';

const ErrorReport: React.FC = () => {
  const dispatch = useDispatch();
  const loadingEffect = useSelector((state: IConnectState) => state.loading);
  const loading = loadingEffect.effects['goodsList/fetchErrorReport'];
  const errorReport = useSelector((state: IConnectState) => state.goodsList.errorReport);
  const { records, current, size, total } = errorReport;  
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;

  useEffect(() => {
    if (currentShopId !== '-1') {
      dispatch({
        type: 'goodsList/fetchErrorReport',
        payload: {
          headersParams: { StoreId: currentShopId },
          current: 1,
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId]);

  const paginationProps = {
    current,
    pageSize: size,
    total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => (<span className={styles.total}>共 {total} 条</span>),
    onChange: (current: number) => {
      dispatch({
        type: 'goodsList/fetchErrorReport',
        payload: {
          headersParams: { StoreId: currentShopId },
          current,
          size,
        },
        callback: requestErrorFeedback,
      });
    },
    onShowSizeChange: (current: number, size: number) => {
      dispatch({
        type: 'goodsList/fetchErrorReport',
        payload: {
          headersParams: { StoreId: currentShopId },
          current,
          size,
        },
        callback: requestErrorFeedback,
      });
    },
  };

  const columns: ColumnProps<API.IErrorReport>[] = [
    {
      title: '导入时间',
      dataIndex: 'importTime',
      align: 'center',
      width: '20%',
      render: importTime => <div className={styles.time}>{importTime}</div>,
    },
    {
      title: '错误数量',
      dataIndex: 'count',
      align: 'center',
      width: '30%',
    },
    {
      title: '错误描述',
      dataIndex: 'errorDesc',
      width: '30%',
      render: errorDesc => {
        const arr = errorDesc.split('；');
        if (arr.length > 3) {
          arr.splice(2);
          arr.push('...');
        }
        return (
          <div className={styles.descContainer}>
            {
              arr.map((item: string, i: number) => (
                <p key={item}>
                  { i !== arr.length - 1 ? `${item}；` : item }
                </p>
              ))
            }
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      render: id => {
        const link = `/api/mws/product/report/error-download?id=${id}`;
        return (
          <a className={styles.download} href={link}>
            下载
          </a>
        );
      },
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/product/list">商品管理</Link>
        <Iconfont type="icon-zhankai" className={styles.icon} />
        <span>导入错误报告</span>
      </div>
      <Table
        loading={loading}
        columns={columns}
        scroll={{ y: 'calc(100vh - 198px)', scrollToFirstRowOnChange: true }}
        rowKey="id"
        dataSource={records}
        pagination={false}
        locale={{ emptyText: '没有找到相关数据' }}
      />
      <div className={styles.footer}>
        <ConfigProvider locale={zhCN}>
          <Pagination {...paginationProps} />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ErrorReport;
