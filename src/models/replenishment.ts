import { IModelType, IConnectState } from '@/models/connect';
import {
  queryGoodsList,
  queryLabels,
  updateRule,
  addLabel,
  deleteLabel,
  queryTransitDetails,
  queryUpdateTime,
  querySkuSetting,
} from '@/services/replenishment';
import { storage, getAmazonAsinUrl } from '@/utils/utils';

export type Order = 'descend' | 'ascend' | null | undefined;

export interface IReplenishmentModelState {
  updateTime: string;
  goods: {
    total: number;
    records: API.IInventoryReplenishment[];
  };
  labels: API.ILabel[];
  searchParams: {
    order: Order;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  compareType: string;
  customCols: {
    [key: string]: boolean;
  };
  checked: {
    dataRange: number;
    currentPageSkus: string[];
  };
  setting: {
    visible: boolean;
    sku: string | undefined;
    record: API.IInventoryReplenishmentSetting;
  };
  transitDetails: API.ITransitDetails[];
}

interface IReplenishmentModelType extends IModelType {
  namespace: 'replenishment';
  state: IReplenishmentModelState;
}

// 订单量和销量环比排序的请求 sort 参数， 百分比/数量
const fluctuationSortDict = {
  'orderFluctuation_7': { percent: 'orderCount7dayRatio', number: 'orderSevenNumRatioSub' },
  'orderFluctuation_15': { percent: 'orderCount15dayRatio', number: 'orderFifteenNumRatioSub' },
  'orderFluctuation_30': { percent: 'orderCount30dayRatio', number: 'orderThirtyNumRatioSub' },
  'salesFluctuation_7': { percent: 'orderSalesCount7dayRatio', number: 'salesSevenNumRatioSub' },
  'salesFluctuation_15': { percent: 'orderSalesCount15dayRatio', number: 'salesFifteenNumRatioSub' },
  'salesFluctuation_30': { percent: 'orderSalesCount30dayRatio', number: 'salesThirtyNumRatioSub' },
};

// 设置弹窗的默认填充
export const settingDefaultRecord = {
  skuStatus: 'normal',
  avgDailySalesRules: 2,
  fixedSales: 0,
  weightCount90sales: '0',
  weightCount60sales: '0',
  weightCount30sales: '15',
  weightCount15sales: '25',
  weightCount7sales: '60',
  labels: [],
  shippingMethods: [],
  safeDays: '0',
  firstPass: '30',
  qualityInspection: '0',
  purchaseLeadTime: '30',
  shoppingList: '0',
};

const GoodsListModel: IReplenishmentModelType = {
  namespace: 'replenishment',

  state: {
    // 店铺更新时间
    updateTime: '正在查询...',
    // 补货商品列表
    goods: {
      total: 0,
      records: [],
    },
    // 全部标签
    labels: [],
    // 查询参数
    searchParams: {
      order: null,
      current: 1,
      size: 20,
    },
    // 环比类型： 百分比=percent 数值=number
    compareType: 'percent',
    // 自定义列
    customCols: storage.get('replenishmentCustomCols') || {
      skuStatus: true,
      openDate: true,
      review: true,
      totalInventory: true,
      existingInventory: true,
      inTransitInventory: true,
      orderCount: true,
      salesCount: true,
      stockingCycle: true,
      firstPass: true,
      totalInventoryAvailableDays: true,
      availableDaysOfExistingInventory: true,
      estimatedOutOfStockTime: true,
      recommendedReplenishmentVolume: true,
      shippingMethods: true,
      labels: true,
    },
    // 勾选的商品（批量，全店）,接口文档： 1表示页面勾选，2表示全店
    checked: {
      dataRange: 1,
      currentPageSkus: [],
    },
    // 设置弹窗
    setting: {
      visible: false,
      sku: undefined,
      record: settingDefaultRecord,
    },
    // 在途详情弹窗内容
    transitDetails: [],
  },

  effects: {
    // 获取商品库存列表
    *fetchGoodsInventoryList({ payload, callback }, { select, call, put }) {
      const { searchParams, headersParams } = payload;
      const state = yield select((state: IConnectState) => state);
      const { replenishment: { searchParams: oldSearchParams, compareType } } = state;
      const newParams = Object.assign({}, oldSearchParams, searchParams);
      // 如果排序是订单量和销量的环比，则要区分按百分比还是数值
      if (newParams.sort && newParams.sort.includes('Fluctuation_')) {
        newParams.sort = fluctuationSortDict[newParams.sort][compareType];
      }
      // 去掉头尾的空格
      if (newParams.inputContent) {
        newParams.inputContent = newParams.inputContent.replace(/(^\s*)|(\s*$)/g, '');
      }  
      const res = yield call(queryGoodsList, { ...newParams, headersParams });
      if (res.code === 200) {
        const { data: goods } = res;
        // 增加商品链接
        goods.records.forEach((goodsItem: API.IInventoryReplenishment) => {
          goodsItem.url = getAmazonAsinUrl(goodsItem.asin, state.global.shop.current.marketplace);
        });
        yield put({
          type: 'saveGoodsList',
          payload: { goods },
        });
        yield put({
          type: 'saveParams',
          payload: { searchParams },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取全部标签
    *fetchLabels({ payload, callback }, { call, put }) {
      const res = yield call(queryLabels, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveLabels',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取 sku 保存的设置内容 并切换显示弹窗
    *fetchSkuSetting({ payload, callback }, { call, put }) {
      const { visible, sku } = payload;
      // 切换显示弹窗
      yield put({
        type: 'switchSettingVisible',
        payload: { visible, sku, record: settingDefaultRecord },
      });
      if (visible) {
        const res = yield call(querySkuSetting, payload);
        if (res.code === 200) {
          const { data: record } = res;
          yield put({
            type: 'switchSettingVisible',
            payload: { visible, sku, record },
          });
        }
        callback && callback(res.code, res.message);
      }
    },

    // 设置和批量设置
    *setRule({ payload, callback }, { select, call, put }) {
      // 获取勾选的商品参数
      const checked = yield select((state: IConnectState) => state.replenishment.checked);
      const searchParams = yield select((state: IConnectState) => (
        state.replenishment.searchParams
      ));
      let params = { ...payload, ...checked };
      // 如果是选择全部，还需要额外的查询参数
      if (checked.dataRange === 2) {
        params = {
          ...payload,
          ...checked,
          skuStatusQuery: searchParams.skuStatus,
          replenishmentExists: searchParams.replenishmentExists,
          inputContent: searchParams.inputContent,
        };
      }
      const res = yield call(updateRule, params);
      if (res.code === 200) {
        // 用现有的参数重新查询表格
        yield put({
          type: 'fetchGoodsInventoryList',
          payload: {
            ...searchParams,
            headersParams: payload.headersParams,
          },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 添加标签
    *createLabel({ payload, callback }, { call, put }) {
      const res = yield call(addLabel, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveLabels',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 删除标签
    *removeLabel({ payload, callback }, { call, put }) {
      const res = yield call(deleteLabel, payload);
      if (res.code === 200) {
        yield put({
          type: 'deleteLabel',
          payload,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取在途详情
    *fetchTransitDetails({ payload, callback }, { call, put }) {
      const res = yield call(queryTransitDetails, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveTransitDetails',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取店铺更新时间
    *fetchUpdateTime({ payload, callback }, { call, put }) {
      const res = yield call(queryUpdateTime, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveUpdateTime',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    // 保存商品列表数据
    saveGoodsList(state, { payload }) {
      const { goods } = payload;
      state.goods = goods;
    },

    // 更新查询参数
    saveParams(state, { payload }) {
      const { searchParams } = payload;
      state.searchParams = Object.assign(state.searchParams, searchParams);
    },

    // 更新页面勾选商品
    updateCheckGoods(state, { payload }) {
      state.checked.currentPageSkus = payload;
    },

    // 切换选择全店商品/选择本页部分商品
    changeCheckedType(state, { payload }) {
      state.checked.dataRange = payload;
    },

    // 更新自定义列数据
    updateCustomCols(state, { payload }) {
      state.customCols = Object.assign(state.customCols, payload);
    },

    // 切换环比类型
    changeCompareType(state, { payload }) {
      state.compareType = payload;
    },

    // 保存全部标签
    saveLabels(state, { payload }) {
      const { records } = payload;
      state.labels = records;
    },

    // 切换显示设置弹窗
    switchSettingVisible(state, { payload }) {
      const { visible, sku, record } = payload;
      if (sku) {
        state.checked = { dataRange: 1, currentPageSkus: [sku] };
      }
      state.setting = { visible, sku, record };
    },

    // 删除标签
    deleteLabel(state, { payload }) {
      const { labelId } = payload;
      // 删除标签管理中对应的标签
      for (let index = 0; index < state.labels.length; index++) {
        const label = state.labels[index];
        if (label.id === labelId) {
          state.labels.splice(index, 1);
          break;
        }
      }
      // 修改商品列表的数据
      state.goods.records.forEach((goods: API.IInventoryReplenishment) => {
        for (let i = 0; i < goods.labels.length; i++) {
          const label = goods.labels[i];
          if (label.id === labelId) {
            goods.labels.splice(i, 1);
            break;
          }
        }
      });
    },

    // 保存在途详情
    saveTransitDetails(state, { payload }) {
      const { data } = payload;
      state.transitDetails = data;
    },

    // 保存店铺更新时间
    saveUpdateTime(state, { payload }) {
      const { data } = payload;
      state.updateTime = data;
    },
  },
};

export default GoodsListModel;
