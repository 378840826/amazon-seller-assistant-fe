/**
 * 表格
 */
import React, { ReactElement, ReactText } from 'react';
import { Table } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import { IConnectState } from '@/models/connect';
import { Order } from '@/models/adManage';
import { useSelector, useDispatch } from 'umi';
import { requestErrorFeedback } from '@/utils/utils';
import TableNotData from '@/components/TableNotData';
import classnames from 'classnames';
import styles from './index.less';

interface IProps<T> {
  dataSource: Array<T>;
  // 自定义列数据
  customCols?: {
    [key: string]: boolean;
  };
  columns: ColumnProps<T>[];
  loading?: boolean;
  total: number;
  current: number;
  size: number;
  // 勾选的数据
  checkedIds: string[];
  // 表格数据的 dispatch type
  fetchListActionType: string;
  // 勾选数据的的 dispatch type
  checkedChangeActionType: string;
}

// 获取表头（合计行，因合计行的存在排序图标需要自定义）
export function getTableTitle(
  params: {
    title: string | ReactElement;
    // 合计列的数值或“合计”
    total?: string | number;
    // 此列的对齐方式
    align?: 'left' | 'right';
    // 此列的排序 key
    key?: string;
    // 当前表格内容的排序参数，当此列数据有排序时必传
    sort?: string;
    order?: Order;
  }
) {
  const { title, total, align, key, sort, order } = params;
  return (
    <>
      <div className={classnames(styles.thCell, align ? styles[`${align}ThCell`] : '')}>
        {
          key
            ?
            <>
              { title }
              <span className={styles.sorterIconContainer}>
                <CaretUpOutlined
                  className={classnames(styles.ascend, (sort === key && order === 'ascend') ? styles.active : '')}
                />
                <CaretDownOutlined
                  className={classnames(styles.descend, (sort === key && order === 'descend') ? styles.active : '' )}
                />
              </span>
            </>
            : title
        }
      </div>
      <div className={classnames(styles.thTotalRowCell, align ? styles[`${align}ThCell`] : '')}>{total}</div>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AdManageTable: React.FC<IProps<any>> = function(props) {
  const dispatch = useDispatch();
  const { 
    columns,
    loading,
    total,
    dataSource,
    current,
    size,
    customCols,
    checkedIds,
    fetchListActionType,
    checkedChangeActionType,
  } = props;
  // 店铺
  const {
    id: currentShopId,
  } = useSelector((state: IConnectState) => state.global.shop.current);
  const treeSelectedInfo = useSelector((state: IConnectState) => state.adManage.treeSelectedInfo);
  const isShowBreadcrumb = treeSelectedInfo.key.split('-').length > 2;

  // 分页器配置
  const paginationProps = {
    current,
    pageSize: size,
    total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => (<>共 {total} 个</>),
  };

  // 勾选配置
  const rowSelection = {
    fixed: true,
    selectedRowKeys: checkedIds,
    columnWidth: 36,
    onChange: (selectedRowKeys: ReactText[]) => {
      dispatch({
        type: checkedChangeActionType,
        payload: selectedRowKeys,
      });
    },
  };

  // 获取需要显示的列（按自定义列显示）
  function getShowCols() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const showCols: any = [];
    columns.forEach(col => {
      !col.key && showCols.push(col);
      if (customCols && customCols[col.key || '']) {
        showCols.push(col);
      }
    });
    return showCols;
  }

  // 表格参数变化（翻页和排序变化）
  // eslint-disable-next-line max-params
  function handleTableChange (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pagination: any, __: any, sorter: any, action: any) {
    const { current, pageSize: size } = pagination;
    const { field: sort, order } = sorter;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let params: { [key: string]: any } = {};
    const actionType = action.action;
    if (actionType === 'paginate') {
      // 由翻页触发的, 只传分页参数，model 中会获取旧的排序参数
      params = { current, size };
    } else if (actionType === 'sort') {
      // 由排序触发的， 重置页码为 1
      params = { current: 1, size, sort, order };
    }
    dispatch({
      type: fetchListActionType,
      payload: {
        headersParams: { StoreId: currentShopId },
        searchParams: params,
      },
      callback: requestErrorFeedback,
    });
  }

  // isShowBreadcrumb
  const tableScroll = {
    x: 'max-content',
    y: isShowBreadcrumb ? 'calc(100vh - 354px)' : 'calc(100vh - 324px)',
    scrollToFirstRowOnChange: true,
  };

  return (
    <div className={styles.container}>
      <Table
        size="middle"
        sortDirections={['descend', 'ascend']}
        showSorterTooltip={false}
        rowSelection={{ ...rowSelection }}
        scroll={{ ...tableScroll }}
        loading={loading}
        columns={getShowCols()}
        rowKey="id"
        rowClassName={styles.tableTr}
        dataSource={dataSource}
        locale={{ emptyText: <TableNotData style={{ padding: 50 }} hint="没有找到相关数据" /> }}
        pagination={{ ...paginationProps, size: 'default' }}
        onChange={handleTableChange}
      /> 
    </div>
  ); 
};

export default AdManageTable;
