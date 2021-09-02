/**
 * 补货计划
 */

import React, { ReactText, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'umi';
import { IConnectState } from '@/models/connect';
import { Table, Checkbox, Button, Modal, message } from 'antd';
import { requestErrorFeedback, objToQueryString, day } from '@/utils/utils';
import Header from './Header';
import { getFullColumns } from './cols';
import TableNotData from '@/components/TableNotData';
import PageTitleRightInfo from '@/pages/components/PageTitleRightInfo';
import CustomCols from './CustomCols';
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
  const {
    sort,
    order,
    current,
    size,
    inputContent,
    code,
    skuStatus,
    replenishmentExists,
  } = searchParams;
  const { total, records: goodsList } = goodsData;
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { id: currentShopId, marketplace, storeName } = currentShop;
  const headersParams = { StoreId: currentShopId };
  // 导出按钮 loading
  const [exportBtnLoading, setExportBtnLoading] = useState<boolean>(false);
  
  // 切换店铺后重新加载表格
  useEffect(() => {
    if (currentShopId !== '-1') {
      // 商品表格
      dispatch({
        type: 'replenishment/fetchGoodsInventoryList',
        payload: {
          headersParams: { StoreId: currentShopId },
          searchParams: {
            inputContent: '',
            code: '',
            current: 1,
            order: null,
            replenishmentExists: null,
            skuStatus: null,
          },
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

  // 勾选商品
  const rowSelection = {
    onChange: (selectedRowKeys: ReactText[]) => {
      // 取消了商品勾选就把选择全部也取消勾选
      if (selectedRowKeys.length !== goodsList.length) {
        dispatch({
          type: 'replenishment/changeCheckedType',
          payload: 1,
        });
      }
      dispatch({
        type: 'replenishment/updateCheckGoods',
        payload: selectedRowKeys,
      });
    },
    fixed: true,
    selectedRowKeys: checked.currentPageSkus,
    hideSelectAll: true,
    columnWidth: 36,
  };

  // 切换显示设置弹窗（单个）
  const switchSettingVisible = (
    visible: boolean,
    sku: string,
  ) => {
    // 请求 sku 设置数据
    dispatch({
      type: 'replenishment/fetchSkuSetting',
      payload: {
        headersParams: { StoreId: currentShopId },
        visible,
        sku,
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
  };

  // 自定义的选择本页
  const handleCheckPageChange = (event: { target: { checked: boolean } }) => {
    const { target: { checked: checkedPage } } = event;
    let keys: string[] = [];
    if (checkedPage) {
      keys = goodsList.map(goods => goods.sku);
    } else {
      // 取消选择本页，则取消选择全部
      dispatch({
        type: 'replenishment/changeCheckedType',
        payload: 1,
      });
    }
    dispatch({
      type: 'replenishment/updateCheckGoods',
      payload: keys,
    });
  };

  // 表格参数变化（翻页和非自定义排序变化）
  // eslint-disable-next-line max-params
  const handleTableChange = function (
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
      // 由非自定义排序触发的， 重置页码为 1
      params = { current: 1, size, sort, order };
    }
    dispatch({
      type: 'replenishment/fetchGoodsInventoryList',
      payload: {
        headersParams,
        searchParams: params,
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
    showTotal: (total: number) => (<>共 {total} 个</>),
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

  // 导出链接
  const getExportFileUrl = () => {
    const qs = objToQueryString({ inputContent, code, skuStatus, replenishmentExists });
    return `/api/mws/fis/download?${qs}`;
  };

  // 模拟 a 标签实现下载
  const download = (blobUrl: string) => {
    const a = document.createElement('a');
    // 文件名
    const date = day.getNowFormatTime('YYYYMMDD');
    a.download = `${date}_${marketplace}_${storeName}_补货计划.xlsx`;
    a.href = blobUrl;
    a.click();
  };

  // 导出
  const handleDownload = () => {
    Modal.confirm({
      title: '本次导出将消耗1次导出次数',
      icon: null,
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk() {
        setExportBtnLoading(true);
        const url = getExportFileUrl();
        fetch(url, {
          method: 'GET',
          headers: new Headers({
            StoreId: currentShopId,
          }),
        })
          .catch(err => {
            message.error('导出失败，请稍后再试！');
            return err;
          })
          .then(res => res.blob())
          .then(data => {
            const blobUrl = window.URL.createObjectURL(data);
            download(blobUrl);
            setExportBtnLoading(false);
            // 减少一次导出次数
            dispatch({
              type: 'user/updateMemberFunctionalSurplus',
              payload: {
                functionName: '补货计划导出',
              },
            });
          })
          .catch(err => {
            console.error('导出发生错误', err);
            setExportBtnLoading(false);
          });
      },
    });
  };

  return (
    <div className={styles.page}>
      <PageTitleRightInfo functionName={'补货计划导出'} />
      <Header />
      <div className={styles.toolBar}>
        <div className={styles.checkedAllContainer}>
          <Checkbox
            onChange={handleCheckPageChange}
            indeterminate={isIndeterminate()}
            checked={checked.currentPageSkus.length !== 0}
          >选择本页</Checkbox>
          <Checkbox
            onChange={handleCheckAllChange}
            checked={checked.dataRange === 2}
            className={isShowCheckAll() ? '' : styles.hide}
          >选择全部</Checkbox>
        </div>
        <div>
          <CustomCols colsItems={customCols} />
          <Button onClick={handleDownload} loading={exportBtnLoading}>
            导出
          </Button>
        </div>
      </div>
      <Table
        className={styles.Table}
        size="middle"
        rowSelection={{ ...rowSelection }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 316px)', scrollToFirstRowOnChange: true }}
        loading={loading}
        columns={columns}
        rowKey="sku"
        dataSource={goodsList}
        locale={{ emptyText: <TableNotData hint="没有找到相关数据" /> }}
        sortDirections={['descend', 'ascend']}
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
