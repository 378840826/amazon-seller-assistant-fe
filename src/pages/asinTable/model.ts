
import { Reducer, Effect } from 'umi';
import {
  getChildGroups,
  addPreference,
  getChildInitList,
  getChildRs,
  getChildPreference,
  delPreference,
  exportChildTable,
  getChildCheckIntact,
  getChildCheckShop,

  getParentList,
  getParentCheckIntact,
  getParentCheckShop,
  addParentPreference,
  delParentPreference,
  getParentPreference,
  exportParentTable,
} from '@/services/adinTable';
import { storage } from '@/utils/utils';
import { storageKeys } from '@/utils/huang';
import { sprs, adSales, flux, b2b, refunds, adsSales, adsFluxs, adsPuts } from './ChildAsin/config';

export interface IAsinTableState {
  childControlRSASIN: string;
  parentCols: {};
  isRequestGroups: boolean;
  childGroups: {
    groupName?: string;
    id?: string;
  }[];
  childCustomcol: string[];
  parentCustomcol: string[];
}

const { asinTableChildCustomCol, asinTableParentCustomCol } = storageKeys;
export interface IAsinTableModel {
  namespace: 'asinTable';
  state: IAsinTableState;
  reducers: {
    updateIsGroups: Reducer;
    changechildControlRSASIN: Reducer;
    changeChildCustomcol: Reducer;
    changeParentCustomcol: Reducer;
  };
  effects: {
    getChildInitList: Effect;
    getChildGroups: Effect;
    getChildRs: Effect;
    addPreference: Effect;
    getChildPreference: Effect;
    delPreference: Effect;
    exportChildTable: Effect;
    getChildCheckIntactShop: Effect;
    getParentCheckIntactShop: Effect;
    
    getParentInitList: Effect;
    addParentPreference: Effect;
    delParentPreference: Effect;
    getParentPreference: Effect;
    exportParentTable: Effect;
  };
}

let childCustomLocation = storage.get(asinTableChildCustomCol);
if (!childCustomLocation) {
  childCustomLocation = {
    asins: sprs,
    salesItem: adSales,
    fluxItem: flux,
    b2bItem: b2b,
    refundItem: refunds,
    adsSalesItem: adsSales,
    adsFluxsItem: adsFluxs,
    adsPutItem: adsPuts,
  };
  storage.set(asinTableChildCustomCol, childCustomLocation);
}

let parentCustomLocation = storage.get(asinTableParentCustomCol);
if (!parentCustomLocation) {
  parentCustomLocation = {
    asins: sprs,
    salesItem: adSales,
    fluxItem: flux,
    b2bItem: b2b,
    refundItem: refunds,
  };
  storage.set(asinTableParentCustomCol, parentCustomLocation);
}

const asinTable: IAsinTableModel = {
  namespace: 'asinTable',
  state: {
    parentCols: {
      'asin': true,
    },
    isRequestGroups: false, // 是否已请求过高级筛选的分组数据
    childGroups: [], // 子ASIN高级筛选的分组数据
    childControlRSASIN: '', // 子asin 关联销售当前打开的asin, 如果不相同就关闭组件。。。
    childCustomcol: childCustomLocation, // 子ASIN 保存自定义列本地记录
    parentCustomcol: parentCustomLocation, // 父ASIN 保存自定义列本地记录
  },

  reducers: {
    updateIsGroups(state, { payload }) {
      if (Array.isArray(payload.data.records)) {
        state.childGroups = payload.data.records;
      } else {
        console.error('分组数据异常');
      }
    },

    // 子asin 改变关联销售打开窗口的ASIN
    changechildControlRSASIN(state, { payload }) {
      state.childControlRSASIN = payload;
    },

    // 子ASIN 自定义列的改变
    changeChildCustomcol(state, { payload }) {
      state.childCustomcol = payload;
      storage.set(asinTableChildCustomCol, payload);
    },

    // 父ASIN 自定义列的改变
    changeParentCustomcol(state, { payload }) {
      state.parentCustomcol = payload;
      storage.set(asinTableParentCustomCol, payload);
    },
  },

  effects: {
    // 获取子ASIN的列表
    *getChildInitList({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getChildInitList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 子ASIN 请求关联销售信息
    *getChildRs({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getChildRs, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 获取子ASIN高级筛选的分组
    *getChildGroups({ payload }, { call, put }): Generator {
      const res = yield call(getChildGroups, payload);
      yield put({
        type: 'updateIsGroups',
        payload: res,
      });
    },

    // 子ASIN 保存偏好
    *addPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(addPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 子ASIN 删除偏好
    *delPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(delPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 子ASIN 表格导出
    *exportChildTable({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(exportChildTable, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 子ASIN 子asin列表载入偏好
    *getChildPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getChildPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 子ASIN 子asin列表校验周期内每天的bs数据是否都有导入 子asin列表校验店铺是否已通过MWS绑定或者广告授权
    *getChildCheckIntactShop({ payload, resolve, reject }, { call }): Generator {
      try {
        const res1 = yield call(getChildCheckIntact, payload); // 子asin列表校验周期内每天的bs数据是否都有导入
        const res2 = yield call(getChildCheckShop, payload); // 子asin列表校验店铺是否已通过MWS绑定或者广告授权
        resolve([res1, res2]);
      } catch (err) {
        reject(err);
      }
    },

    // 父asin列表
    *getParentInitList({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getParentList, payload); // 子asin列表校验周期内每天的bs数据是否都有导入
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 父ASIN 父asin列表载入偏好
    *getParentPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getParentPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 父ASIN 父asin列表校验周期内每天的bs数据是否都有导入 父asin列表校验店铺是否已通过MWS绑定或者广告授权
    *getParentCheckIntactShop({ payload, resolve, reject }, { call }): Generator {
      try {
        const res1 = yield call(getParentCheckIntact, payload); // 子asin列表校验周期内每天的bs数据是否都有导入
        const res2 = yield call(getParentCheckShop, payload); // 子asin列表校验店铺是否已通过MWS绑定或者广告授权
        resolve([res1, res2]);
      } catch (err) {
        reject(err);
      }
    },

    // 父ASIN 保存偏好
    *addParentPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(addParentPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 父ASIN 删除偏好
    *delParentPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(delParentPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 子ASIN 表格导出
    *exportParentTable({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(exportParentTable, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
};

export default asinTable;
