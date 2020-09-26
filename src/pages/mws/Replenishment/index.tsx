import React, { ReactText, useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import { IConnectState } from '@/models/connect';
import { Table, Checkbox } from 'antd';
import { requestErrorFeedback } from '@/utils/utils';
import Header from './Header';
import { getFullColumns } from './cols';
import styles from './index.less';

const Replenishment: React.FC = () => {
  const dispatch = useDispatch();
  // loading
  const loadingEffect = useSelector((state: IConnectState) => state.loading.effects);
  const loading = loadingEffect['replenishment/fetchGoodsInventoryList'];
  // 商品
  const page = useSelector((state: IConnectState) => state.replenishment);
  const {
    goods: goodsData,
    customCols,
    searchParams,
    compareType,
    labels,
    checked,
    setting,
  } = page;
  const { sort, order, current, size } = searchParams;
  const { total, records: goodsList } = goodsData;
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId } = currentShop;
  const headersParams = { StoreId: currentShopId };
  
  // 切换店铺后重新加载表格
  useEffect(() => {
    if (currentShopId !== '-1') {
      // 商品表格
      dispatch({
        type: 'replenishment/fetchGoodsInventoryList',
        payload: {
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
      // 全部标签
      dispatch({
        type: 'replenishment/fetchLabels',
        payload: {
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
      // 店铺更新时间
      dispatch({
        type: 'replenishment/fetchUpdateTime',
        payload: {
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId]);

  // 高亮已排序的表头
  useEffect(() => {
    const activeClassName = 'sortActiveTh';
    const nowTh = document.querySelector(`.${activeClassName}`);
    nowTh?.classList.remove(activeClassName);
    const el = document.querySelector('.ant-table-column-sorter .active') ||
      document.querySelector('.sort-menu-btn .ant-table-column-sorter');
    const th = el && el.closest('th');
    th?.classList.add(activeClassName);
  }, [sort]);

  // 勾选商品
  const rowSelection = {
    onChange: (selectedRowKeys: ReactText[]) => {
      dispatch({
        type: 'replenishment/updateCheckGoods',
        payload: selectedRowKeys,
      });
    },
    fixed: true,
    selectedRowKeys: checked.currentPageSkus,
    hideSelectAll: true,
  };

  // 切换显示设置弹窗（单个）
  const switchSettingVisible = (
    visible: boolean,
    record: API.IInventoryReplenishment,
  ) => {
    // 显示/隐藏弹窗
    dispatch({
      type: 'replenishment/switchSettingVisible',
      payload: {
        visible,
        record: { ...record },
        checked: {
          dataRange: 1,
          currentPageSkus: [record.sku],
        },
      },
    });
  };

  // 选择全店 
  const handleCheckAllChange = (event: { target: { checked: boolean } }) => {
    const { target: { checked: checkedAll } } = event;
    dispatch({
      type: 'replenishment/changeCheckedType',
      payload: checkedAll ? 2 : 1,
    });
    // 勾选全店，则勾选本页
    if (checkedAll) {
      dispatch({
        type: 'replenishment/updateCheckGoods',
        payload: goodsList.map(goods => goods.sku),
      });
    }
  };

  // 自定义的选择本页
  const handleCheckPageChange = (event: { target: { checked: boolean } }) => {
    const { target: { checked: checkedPage } } = event;
    dispatch({
      type: 'replenishment/updateCheckGoods',
      payload: checkedPage ? goodsList.map(goods => goods.sku) : [],
    });
  };

  // 表格参数变化
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (pagination: any, __: any, sorter: any) => {
    const { current, pageSize: size } = pagination;
    const { field: sort, order } = sorter;
    dispatch({
      type: 'replenishment/fetchGoodsInventoryList',
      payload: {
        headersParams,
        searchParams: {
          sort: order ? sort : undefined,
          order,
          current,
          size,
        },
      },
      callback: requestErrorFeedback,
    });
  };

  // 自定义的排序变化
  const handleSortChange = (sort: string, order: string) => {
    dispatch({
      type: 'replenishment/fetchGoodsInventoryList',
      payload: {
        headersParams,
        searchParams: { sort, order, current: 1 },
      },
      callback: requestErrorFeedback,
    });
  };

  // 根据自定义列数据调整 Table 的 columns 数据
  const getColumns = () => {
    const cols = getFullColumns({
      setting,
      handleSortChange,
      switchSettingVisible,
      customCols,
      sort,
      order,
      compareType,
      labels,
    });
    return cols;
  };

  const columns = getColumns();

  const paginationProps = {
    current,
    pageSize: size,
    total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number) => (<span className={styles.total}>共 {total} 个</span>),
    onShowSizeChange: (current: number, size: number) => {
      dispatch({
        type: 'replenishment/fetchGoodsInventoryList',
        payload: {
          headersParams,
          searchParams: { current, size },
        },
        callback: requestErrorFeedback,
      });
    },
  };

  // 选择本页是否半选状态
  const isIndeterminate = () => {
    let indeterminate = false;
    const length = checked.currentPageSkus.length;
    if (length !== 0 && length !== goodsList.length) {
      indeterminate = true;
    }
    return indeterminate;
  };

  // 是否显示选择全部选择框
  const isShowCheckAll = () => {
    let isShow = false;
    if (checked.currentPageSkus.length === goodsList.length) {
      isShow = true;
    }
    return isShow;
  };

  return (
    <div className={styles.page}>
      <Header />
      <Checkbox onChange={handleCheckPageChange} indeterminate={isIndeterminate()}>选择本页</Checkbox>
      {
        isShowCheckAll() ? <Checkbox onChange={handleCheckAllChange}>选择全部</Checkbox> : null
      }
      <Table
        size="middle"
        rowSelection={{ ...rowSelection }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 300px)', scrollToFirstRowOnChange: true }}
        loading={loading}
        columns={columns}
        rowKey="sku"
        dataSource={goodsList}
        locale={{ emptyText: '没有找到相关数据' }}
        rowClassName={(_, index) => {
          if (index % 2 === 1) {
            return styles.darkRow;
          }
        }}
        pagination={{ ...paginationProps, size: 'default' }}
        onChange={handleTableChange}
        showSorterTooltip={false}
      /> 
    </div>
  );
};

export default Replenishment;
