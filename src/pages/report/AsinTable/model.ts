
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
import { 
  parentsprs,
  parentadSales,
  parentflux,
  parentb2b,
  parentrefunds,
} from './ParentAsin/config';

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
    asins: parentsprs,
    salesItem: parentadSales,
    fluxItem: parentflux,
    b2bItem: parentb2b,
    refundItem: parentrefunds,
  };
  storage.set(asinTableParentCustomCol, parentCustomLocation);
}

const asinTable: IAsinTableModel = {
  namespace: 'asinTable',
  state: {
    parentCols: {
      'asin': true,
    },
    isRequestGroups: false, // ?????????????????????????????????????????????
    childGroups: [], // ???ASIN???????????????????????????
    childControlRSASIN: '', // ???asin ???????????????????????????asin, ???????????????????????????????????????
    childCustomcol: childCustomLocation, // ???ASIN ??????????????????????????????
    parentCustomcol: parentCustomLocation, // ???ASIN ??????????????????????????????
  },

  reducers: {
    updateIsGroups(state, { payload }) {
      if (Array.isArray(payload.data.records)) {
        state.childGroups = payload.data.records;
      } else {
        console.error('??????????????????');
      }
    },

    // ???asin ?????????????????????????????????ASIN
    changechildControlRSASIN(state, { payload }) {
      state.childControlRSASIN = payload;
    },

    // ???ASIN ?????????????????????
    changeChildCustomcol(state, { payload }) {
      state.childCustomcol = payload;
      storage.set(asinTableChildCustomCol, payload);
    },

    // ???ASIN ?????????????????????
    changeParentCustomcol(state, { payload }) {
      state.parentCustomcol = payload;
      storage.set(asinTableParentCustomCol, payload);
    },
  },

  effects: {
    // ?????????ASIN?????????
    *getChildInitList({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getChildInitList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ???ASIN ????????????????????????
    *getChildRs({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getChildRs, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ?????????ASIN?????????????????????
    *getChildGroups({ payload }, { call, put }): Generator {
      const res = yield call(getChildGroups, payload);
      yield put({
        type: 'updateIsGroups',
        payload: res,
      });
    },

    // ???ASIN ????????????
    *addPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(addPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ???ASIN ????????????
    *delPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(delPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ???ASIN ????????????
    *exportChildTable({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(exportChildTable, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ???ASIN ???asin??????????????????
    *getChildPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getChildPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ???ASIN ???asin??????????????????????????????bs???????????????????????? ???asin?????????????????????????????????MWS????????????????????????
    *getChildCheckIntactShop({ payload, resolve, reject }, { call }): Generator {
      try {
        const res1 = yield call(getChildCheckIntact, payload); // ???asin??????????????????????????????bs????????????????????????
        const res2 = yield call(getChildCheckShop, payload); // ???asin?????????????????????????????????MWS????????????????????????
        resolve([res1, res2]);
      } catch (err) {
        reject(err);
      }
    },

    // ???asin??????
    *getParentInitList({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getParentList, payload); // ???asin??????????????????????????????bs????????????????????????
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ???ASIN ???asin??????????????????
    *getParentPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getParentPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ???ASIN ???asin??????????????????????????????bs???????????????????????? ???asin?????????????????????????????????MWS????????????????????????
    *getParentCheckIntactShop({ payload, resolve, reject }, { call }): Generator {
      try {
        const res1 = yield call(getParentCheckIntact, payload); // ???asin??????????????????????????????bs????????????????????????
        const res2 = yield call(getParentCheckShop, payload); // ???asin?????????????????????????????????MWS????????????????????????
        resolve([res1, res2]);
      } catch (err) {
        reject(err);
      }
    },

    // ???ASIN ????????????
    *addParentPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(addParentPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ???ASIN ????????????
    *delParentPreference({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(delParentPreference, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ???ASIN ????????????
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
