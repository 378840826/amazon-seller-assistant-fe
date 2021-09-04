/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-26 17:48:49
 * @LastEditTime: 2021-04-29 11:07:01
 * 
 * SKU资料管理
 */

import { Effect } from 'umi';
import { 
  getskuList,
  getMskuList,
  addSku,
  getLocationList,
  uploadBatchRelevance,
  uploadBatchSKU,
  batchDelete,
  aiSKU,
  batchUpdateState,
  updateSku,
} from '@/services/product/skuData';

interface ISkuDataModel {
  namespace: 'skuData';
  state: {};
  effects: {
    getskuList: Effect;
    addSku: Effect;
    getLocationList: Effect;
    getMskuList: Effect;
    uploadBatchRelevance: Effect;
    uploadBatchSKU: Effect;
    batchDelete: Effect;
    aiSKU: Effect;
    batchUpdateState: Effect;
    updateSku: Effect;
  };
}

const skuData: ISkuDataModel = {
  namespace: 'skuData',
  state: {},
  effects: {
    // 获取sku列表
    *getskuList({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(getskuList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 添加SKU
    *addSku({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(addSku, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 获取仓库下的库位号列表
    *getLocationList({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(getLocationList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 获取msku下拉列表
    *getMskuList({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(getMskuList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
    // 批量关联库位号
    *uploadBatchRelevance({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(uploadBatchRelevance, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 批量上传SKU
    *uploadBatchSKU({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(uploadBatchSKU, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 批量删除SKU
    *batchDelete({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(batchDelete, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // SKU智能匹配
    *aiSKU({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(aiSKU, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 批量修改状态
    *batchUpdateState({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(batchUpdateState, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
    // 修改单个SKU资料
    *updateSku({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(updateSku, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
};

export default skuData;
