/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-10 14:42:50
 * @LastEditTime: 2021-05-08 16:48:12
 * 
 * 利润表
 */

import { Effect } from 'umi';
import { 
  getStoreList,
  storeExport, 
  getChildAsinList,
  getShopDownList,
  getAsinList,
  asinExport,
} from '@/services/report/profit';

// export interface IProfitTableModelState {
  
// }

interface IProfitTableModelType{
  namespace: 'profitTable';
  // state: IProfitTableModelState;
  state: {};
  effects: {
    getStoreList: Effect;
    storeExport: Effect;
    getChildAsinList: Effect;
    getShopDownList: Effect;
    getAsinList: Effect;
    asinExport: Effect;
  };
}

const profitTable: IProfitTableModelType = {
  namespace: 'profitTable',

  state: { },
  effects: {
    // 店铺利润列表
    *getStoreList({ reject, resolve, payload }, { call }) {
      try {
        const res = yield call(getStoreList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 店铺导出
    *storeExport({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(storeExport, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // ASIN报表导出
    *asinExport({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(asinExport, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 店铺利润列表
    *getChildAsinList({ reject, resolve, payload }, { call }) {
      try {
        const res = yield call(getChildAsinList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 站点地区店铺筛选接口(店铺列表)
    *getShopDownList({ reject, resolve, payload }, { call }) {
      try {
        const res = yield call(getShopDownList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 站点店铺筛选（asin列表）
    *getAsinList({ reject, resolve, payload }, { call }) {
      try {
        const res = yield call(getAsinList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
};

export default profitTable;
