/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-20 10:19:14
 * @LastEditTime: 2021-04-21 17:35:45
 * 
 * 发货单
 */


import { Effect, Reducer } from 'umi';
import { 
  getDispatchList, 
  getSites, 
  updateDispatch,
  updateDispatchState,
  getInvoiceDetail,
} from '@/services/fba/dispatchList';

export interface IFbaDispatchListState {
  dispatchList: DispatchList.IListRecord[];
}

interface IFbaDispatchListModel {
  namespace: 'fbaDispatchList';
  state: IFbaDispatchListState;
  effects: {
    getDispatchList: Effect;
    getSites: Effect;
    updateDispatch: Effect;
    updateDispatchState: Effect;
    getInvoiceDetail: Effect;
  };
  reducers: {
    saveDispatchList: Reducer;
  };
}

const fbaBase: IFbaDispatchListModel = {
  namespace: 'fbaDispatchList',
  state: {
    dispatchList: [],
  },
  effects: {
    // 发货单列表
    *getDispatchList({ payload, callback, reject, resolve }, { call, put }) {
      try {
        const res = yield call(getDispatchList, payload);
        resolve(res);
        callback && callback(res.code, res.message);
        yield put({
          type: 'saveDispatchList',
          payload: res.code === 200 ? (res.data.page?.records || []) : [],
        });
      } catch (error) {
        reject(error);
      }
    },

    // 站点下拉列表
    *getSites({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(getSites, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 修改配货、发货、作废
    *updateDispatchState({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(updateDispatchState, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 修改发货单信息
    *updateDispatch({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(updateDispatch, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 获取发货单详情
    *getInvoiceDetail({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(getInvoiceDetail, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },
  },

  reducers: {
    // 保存或修改发货单列表
    saveDispatchList(state, { payload }) {
      state.dispatchList = payload;
    },
  },
};

export default fbaBase;

