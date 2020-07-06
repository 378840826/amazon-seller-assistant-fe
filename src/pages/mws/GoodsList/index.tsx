import React, { ReactText, useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import { IConnectState } from '@/models/connect';
import { Table, Pagination, message, ConfigProvider } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { requestFeedback, requestErrorFeedback, getPageQuery } from '@/utils/utils';
import { judgeFastPrice, judgeRuleOpen } from './utils';
import GoodsIcon from './GoodsIcon';
import { getFullColumns } from './cols';
import Header from './Header';
import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.less';

interface IUpdatePrice {
  (params: {
    type: number;
    ids: string[];
    price?: number;
    operator?: string;
    unit?: string;
    changeValue?: string;
  }): void;
}

interface IUpdateGoodsUserDefined {
  (params: {
    id: string;
    sku: string;
    cost?: number;
    freight?: number;
    minPrice?: number;
    maxPrice?: number;
    ruleId?: string;
    ruleName?: string;
  }): void;
}

const GoodsList: React.FC = () => {
  console.log('渲染 index');

  const dispatch = useDispatch();
  const loadingAdjustSwitch = false;
  // 商品
  const goodsListPage = useSelector((state: IConnectState) => state.goodsList);
  const { goods: goodsData, groups, customCols, searchParams, tableLoading } = goodsListPage;
  const { sort, order, current, size } = searchParams;
  const { total, records: goodsList } = goodsData;
  // 店铺
  const currentShop = useSelector((state: IConnectState) => state.global.shop.current);
  const { currency, id: currentShopId } = currentShop;
  const headersParams = { StoreId: currentShopId };

  // 分页
  const paginationProps = {
    current,
    pageSize: size,
    total,
    defaultPageSize: 20,
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    hideOnSinglePage: true,
    showTotal: (total: number) => `共 ${total} 个`,
    onChange: (current: number) => {
      dispatch({
        type: 'goodsList/fetchGoodsList',
        payload: {
          headersParams,
          searchParams: { current },
        },
        callback: requestErrorFeedback,
      });
    },
  };

  useEffect(() => {
    if (currentShopId !== '-1') {
      const queryParams = getPageQuery();
      // 清除 url 中的参数
      history.replaceState(null, '', '/mws/goods/list');
      dispatch({
        type: 'goodsList/fetchShopGroups',
        payload: {
          headersParams: { StoreId: currentShopId },
        },
        callback: requestErrorFeedback,
      });
      dispatch({
        type: 'goodsList/fetchGoodsList',
        payload: {
          headersParams: { StoreId: currentShopId },
          filtrateParams: queryParams,
        },
        callback: requestErrorFeedback,
      });
    }
  }, [dispatch, currentShopId]);

  // 勾选商品
  const rowSelection = {
    onChange: (selectedRowKeys: ReactText[], selectedRows: API.IGoods[]) => {
      console.log('选择', selectedRows, selectedRowKeys);
      dispatch({
        type: 'goodsList/updateCheckGoods',
        payload: selectedRowKeys,
      });
    },
    fixed: true,
  };

  // 单个修改调价开关
  const handleAdjustSwitchClick = (checked: boolean, record: API.IGoods) => {
    const { id } = record;
    // 如果是开启调价，判断是否设置了最低价和最高价
    const judge = !checked ? judgeRuleOpen([record]) : true;
    judge && dispatch({
      type: 'goodsList/switchAdjustSwitch',
      payload: {
        ids: [id],
        adjustSwitch: !checked,
        headersParams,
      },
      callback: requestFeedback,
    });
  };

  // 单个修改商品分组
  const handleGroupChange = (groupId: string, goodsInfo: API.IGoods) => {
    dispatch({
      type: 'goodsList/updateBatchGoods',
      payload: {
        key: 'groupId',
        headersParams,
        ids: [goodsInfo.id],
        groupId,
      },
      callback: requestErrorFeedback,
    });
  };

  // 表格参数变化-只需处理排序
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (_: any, __: any, sorter: any) => {
    const { field: sort, order } = sorter;
    dispatch({
      type: 'goodsList/fetchGoodsList',
      payload: {
        headersParams,
        searchParams: { sort, order, current: 1 },
      },
      callback: requestErrorFeedback,
    });
  };

  // 自定义的排序变化
  const handleSortChange = (sort: string, order: string) => {
    dispatch({
      type: 'goodsList/fetchGoodsList',
      payload: {
        headersParams,
        searchParams: { sort, order, current: 1 },
      },
      callback: requestErrorFeedback,
    });
  };

  // 操作-改价
  const handleFastPrice = (record: API.IGoods, { key }: ClickParam) => {
    console.log('操作-快捷改价', key, headersParams);
    judgeFastPrice(key, [record]) && dispatch({
      type: 'goodsList/fastUpdate',
      payload: {
        headersParams,
        key,
        ids: [record.id],
      },
      callback: requestFeedback,
    });
  };

  // 添加分组并设置分组
  const handleNewGroup = (groupName: string, goodsId: string) => {
    console.log('添加分组并设置分组', groupName, goodsId);
    if (groups.length >= 10) {
      message.error('最多只能添加10个分组！');
      return;
    }
    if (groups.some(group => group.groupName === groupName)) {
      message.error('分组名称不能重复');
      return;
    }
    dispatch({
      type: 'goodsList/newGroup',
      payload: {
        groupName,
        goodsId,
        headersParams,
      },
      callback: requestFeedback,
    });
  };

  // 各种方式修改售价（按百分比，增量，目标值修改）
  const updatePrice: IUpdatePrice = (options) => {
    const { type, ids, price, operator, unit, changeValue } = options;
    console.log('修改售价', type, ids, price, operator, unit, changeValue);
    dispatch({
      type: 'goodsList/updatePrice',
      payload: {
        headersParams,
        type, ids, price, operator, unit, changeValue,
      },
      callback: requestFeedback,
    });
  };

  // 修改商品信息（成本，运费，最高价，最低价，调价规则）
  const updateGoodsUserDefined: IUpdateGoodsUserDefined = (options) => {
    const { id, sku, cost, freight, minPrice, maxPrice, ruleId, ruleName } = options;
    // 后端没有返回这些数据，打包用来更新页面
    const goods: {
      id: string;
      sku: string;
      cost?: number;
      freight?: number;
      minPrice?: number;
      maxPrice?: number;
      ruleId?: string;
      ruleName?: string;
    } = { id, sku };
    cost ? goods.cost = cost : null;
    freight ? goods.freight = freight : null;
    minPrice ? goods.minPrice = minPrice : null;
    maxPrice ? goods.maxPrice = maxPrice : null;
    ruleId ? goods.ruleId = ruleId : null;
    ruleName ? goods.ruleName = ruleName : null;
    dispatch({
      type: 'goodsList/updateGoods',
      payload: {
        headersParams,
        ...goods,
      },
      callback: requestFeedback,
    });
  };

  // 根据自定义列数据调整 Table 的 columns 数据
  const getColumns = () => {
    const cols = getFullColumns({
      loadingAdjustSwitch,
      updatePrice,
      handleGroupChange,
      handleNewGroup,
      updateGoodsUserDefined,
      handleAdjustSwitchClick,
      handleSortChange,
      handleFastPrice,
      groups,
      customCols,
      sort,
      order,
      currency,
    });
    return cols;
  };

  const columns = getColumns();

  return (
    <div className={styles.page}>
      <Header />
      <Table
        size="middle"
        pagination={false}
        rowSelection={{ ...rowSelection }}
        scroll={{ x: 'max-content', y: 'calc(100vh - 360px)', scrollToFirstRowOnChange: true }}
        loading={tableLoading}
        columns={columns}
        rowKey="id"
        dataSource={goodsList as API.IGoods[]}
        locale={{ emptyText: '未找到相关商品' }}
        rowClassName={(_, index) => {
          if (index % 2 === 1) {
            return styles.darkRow;
          }
        }}
        onChange={handleTableChange}
        showSorterTooltip={false}
      />
      <div className={styles.footer}>
        <div className={styles.iconExample}>
          <span>Add-on item：{ GoodsIcon.add() }</span>
          <span>Amazon&apos;s Choice：{ GoodsIcon.ac() }</span>
          <span>Best Seller：{ GoodsIcon.bs() }</span>
          <span>New Releases：{ GoodsIcon.nr() }</span>
          <span>Prime：{ GoodsIcon.prime }</span>
          <span>Promotion：{ GoodsIcon.promotion }</span>
          <span>Coupon：{ GoodsIcon.coupon() }</span>
        </div>
        <ConfigProvider locale={zhCN}>
          <Pagination {...paginationProps} />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default GoodsList;
