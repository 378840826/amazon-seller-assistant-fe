import { IConnectState, IModelType } from '@/models/connect';
import {
  queryList,
  queryRegionSiteStore,
} from '@/services/storeReport';
import { storage } from '@/utils/utils';
import { SortOrder } from 'antd/es/table/interface';


export interface IStoreReportModelState {
  searchParams: {
    order: SortOrder;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  regionSiteStore: {
    marketplaceList: string[];
    regionList: {region: string; chinesRegion: string}[];
    storeNameList: string[];
  };
  customCols: {
    [key: string]: boolean;
  };
  list: {
    updateTime: string;
    totalIndicators: {};
    records: StoreReport.IStoreReport[];
  };
}

interface IStoreReportModelType extends IModelType {
  namespace: 'storeReport';
  state: IStoreReportModelState;
}

const StoreReportModel: IStoreReportModelType = {
  namespace: 'storeReport',

  state: {
    list: {
      // 更新时间
      updateTime: '正在查询...',
      // 合计
      totalIndicators: {},
      records: [],
    },
    // 自定义列
    customCols: storage.get('storeReportCustomCols') || {
      totalSales: true,
      totalOrderQuantity: true,
      totalSalesQuantity: true,
      cumulativelyOnSaleAsin: true,
      avgEachAsinOrder: true,
      grossProfit: true,
      grossProfitRate: true,
      salesQuantityExceptOrderQuantity: true,
      avgSellingPrice: true,
      avgCustomerPrice: true,
      preferentialOrderQuantity: true,
      associateSales: true,
      pageView: true,
      session: true,
      pageViewExceptSession: true,
      conversionsRate: true,
      returnQuantity: true,
      returnRate: true,
      b2bSales: true,
      b2bOrderQuantity: true,
      b2bSalesQuantity: true,
      b2bSalesQuantityExceptOrderQuantity: true,
      b2bAvgSellingPrice: true,
      b2bAvgCustomerPrice: true,
      adSales: true,
      naturalSales: true,
      adOrderQuantity: true,
      naturalOrderQuantity: true,
      cpc: true,
      cpa: true,
      cpm: true,
      spend: true,
      acos: true,
      compositeAcos: true,
      roas: true,
      compositeRoas: true,
      impressions: true,
      clicks: true,
      ctr: true,
      adConversionsRate: true,
    },
    // 查询参数
    searchParams: {
      order: null,
      currency: 'original',
    },
    // 地区、站点、店铺
    regionSiteStore: {
      marketplaceList: [],
      regionList: [],
      storeNameList: [],
    },
  },

  effects: {
    // 列表
    *fetchList({ payload, callback }, { call, put, select }) {
      const oldParams = yield select((state: IConnectState) => state.storeReport.searchParams);
      const newParams = Object.assign({}, oldParams, payload);
      const res = yield call(queryList, newParams);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'savePage',
          payload: {
            records: data.storeDatas,
            totalIndicators: data.totalIndicators,
            updateTime: data.updateTime,
          },
        });
        // 更新查询参数
        yield put({
          type: 'updateSearchParams',
          payload,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取地区/站点/店铺
    *fetchRegionSiteStore({ payload, callback }, { call, put }) {
      const res = yield call(queryRegionSiteStore, { ...payload.values });
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'updateRegionSiteStore',
          payload: {
            data,
            changeValueObj: payload.changeValueObj,
          },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 排序
    *sortList({ payload }, { put, select }) {
      const { order, sort } = payload;
      const records = yield select((state: IConnectState) => state.storeReport.list.records);
      const sortRecords = [...records].sort((a, b) => {
        const nunA = Number(a[sort] || 0);
        const nunB = Number(b[sort] || 0);
        if (order === 'ascend') {
          return nunA - nunB;
        } else if (order === 'descend') {
          return nunB - nunA;
        }
        return 0;
      });
      // 更新参数
      yield put({
        type: 'updateSearchParams',
        payload,
      });
      // 更新列表
      yield put({
        type: 'updateList',
        payload: sortRecords,
      });
    },

    // 获取合计数据
    *fetchTotalIndicators({ payload, callback }, { call, put, select }) {
      const params = yield select((state: IConnectState) => state.storeReport.searchParams);
      const res = yield call(queryList, { ...params, ...payload });
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'updateTotalIndicators',
          payload: data.totalIndicators,
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    // 更新列表和更新时间
    savePage(state, { payload }) {
      state.list = payload;
    },

    // 更新列表数据(用于排序)
    updateList(state, { payload }) {
      state.list.records = payload;
    },

    // 更新查询参数
    updateSearchParams(state, { payload }) {
      state.searchParams = { ...state.searchParams, ...payload };
    },

    // 更新自定义列数据
    updateCustomCols(state, { payload }) {
      state.customCols = Object.assign(state.customCols, payload);
    },

    // 更新地区/站点、店铺
    updateRegionSiteStore(state, { payload }) {
      const { changeValueObj, data } = payload;
      // 排序
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const compare = (a: any, b: any) => {
        if (a.region) {
          return a.region > b.region ? 1 : -1;
        }
        return a > b ? 1 : -1;
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const desc = (a: any, b: any) => {
        return a < b ? 1 : -1;
      };
      // 如果更新了一个条件(并且不是清除这个条件)，那么就只更新另外两个筛选的下拉框，此条件的下拉框保持不变
      if (changeValueObj) {
        const [key, value] = Object.entries(changeValueObj)[0];
        if (value) {
          switch (key) {
          case 'marketplace':
            state.regionSiteStore.regionList = data.regionList.sort(compare);
            state.regionSiteStore.storeNameList = data.storeNameList.sort(compare);
            break;
          case 'region':
            state.regionSiteStore.marketplaceList = data.marketplaceList.sort(desc);
            state.regionSiteStore.storeNameList = data.storeNameList.sort(compare);
            break;
          case 'storeName':
            state.regionSiteStore.marketplaceList = data.marketplaceList.sort(desc);
            state.regionSiteStore.regionList = data.regionList.sort(compare);
            break;
          default:
            break;
          }
          return;
        }
      }
      state.regionSiteStore.marketplaceList = data.marketplaceList.sort(desc);
      state.regionSiteStore.regionList = data.regionList.sort(compare);
      state.regionSiteStore.storeNameList = data.storeNameList.sort(compare);
    },

    // 更新合计数据
    updateTotalIndicators(state, { payload }) {
      state.list.totalIndicators = payload;
    },
  },
};

export default StoreReportModel;
