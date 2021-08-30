/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:41:57
 * @LastEditTime: 2021-02-24 14:43:20
 * 
 * 物流方式管理
 */

import { Effect } from 'umi';
import { 
  getStoreageLocationList,
  addStorageLocation,
  updateStorageLocation,
  deleteStorageLocation,
} from '@/services/configuration/storeageLocation';

interface IStorageLocationModel {
  namespace: 'storageLocation';
  state: {};

  effects: {
    getStoreageLocationList: Effect;
    addStorageLocation: Effect;
    updateStorageLocation: Effect;
    deleteStorageLocation: Effect;
  };

  reducers: {};
}

const chipment: IStorageLocationModel = {
  namespace: 'storageLocation',
  state: {
    storageLocation: [],
  },
  effects: {
    // 库位列表
    *getStoreageLocationList({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(getStoreageLocationList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 添加库位号
    *addStorageLocation({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(addStorageLocation, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 编辑库位号
    *updateStorageLocation({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(updateStorageLocation, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 删除库位号
    *deleteStorageLocation({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(deleteStorageLocation, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
  
  reducers: {},
};

export default chipment;
