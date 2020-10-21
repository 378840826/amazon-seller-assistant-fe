import { Effect } from 'umi';
import {
  Login,
  getBaseInitData,
  updatePriceEstimated,
  tabSkuData,
} from '@/services/asinPandect';

interface IBaseType {
  namespace: 'asinBase';
  effects: {
    login: Effect;
    getinitData: Effect;
    updatePriceEstimated: Effect;
    tabSkuData: Effect;
  };
}

const Base: IBaseType = {
  namespace: 'asinBase',

  effects: {
    *login({ payload }, { call }): Generator {
      try {
        const res = yield call(Login, payload);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    },

    *getinitData({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getBaseInitData, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 价格估算修改
    *updatePriceEstimated({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(updatePriceEstimated, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 切换SKU
    *tabSkuData({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(tabSkuData, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
};


export default Base;
