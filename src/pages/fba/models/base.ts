/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-03-16 11:45:06
 * @LastEditTime: 2021-05-13 11:41:12
 * 
 * FBA 共用部分
 */


import { Effect, Reducer } from 'umi';
import { getShops } from '@/services/configuration/base';
import { getLogistics, getSpinAddress } from '@/services/fba/planList';

export interface IFbaBaseState {
  shops: {
    id: string;
    storeName: string;
    marketplace: string;
  }[];
  logistics: string[];
  spinAddress: planList.IAddressLine[];
}

interface IFbaBaseModel {
  namespace: 'fbaBase';
  state: IFbaBaseState;
  effects: {
    getLogistics: Effect;
    getShops: Effect;
    getSpinAddress: Effect;
  };
  reducers: {
    saveLogistics: Reducer;
    saveShop: Reducer;
    saveSpinAddress: Reducer;
  };
}

const fbaBase: IFbaBaseModel = {
  namespace: 'fbaBase',
  state: {
    shops: [],
    logistics: [], // 物流方式下拉列表
    spinAddress: [], // 发货地址列表
  },
  effects: {
    // 店铺列表
    *getShops({ payload, callback }, { call, put }) {
      const res = yield call(getShops, payload);
      yield put({
        type: 'saveShop',
        payload: res.code === 200 ? res.data : [],
      });
      callback && callback(res.code, res.message);
    },

    // 创建货件计划 - 获取物流方式列表
    *getLogistics({ payload, callback }, { call, put }) {
      const res = yield call(getLogistics, payload);
      if (res.code === 200) {
        yield put({
          type: 'saveLogistics',
          payload: res.data || [],
        });
      }
      callback && callback(res.code, res.message);
    },

    // 创建货件计划 - 获取发货地址列表
    *getSpinAddress({ payload, callback, resolve, reject }, { call, put }) {
      try {
        const res = yield call(getSpinAddress, payload);
        resolve(res);
        if (res.code === 200) {
          yield put({
            type: 'saveSpinAddress',
            payload: res.data || [],
          });
        }
        callback && callback(res.code, res.message);
      } catch (error) {
        reject(error);
      }
    },
  },

  reducers: {
    // 保存店铺列表
    saveShop(state, { payload }) {
      state.shops = payload;
    },

    // 保存物流方式列表
    saveLogistics(state, { payload }) {
      state.logistics = payload;
    },

    // 保存发货地址列表
    saveSpinAddress(state, { payload }) {
      state.spinAddress = payload;
    },
  },
};

export default fbaBase;

