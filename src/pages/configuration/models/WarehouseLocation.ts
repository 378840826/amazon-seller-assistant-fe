/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:41:57
 * @LastEditTime: 2021-04-26 11:07:08
 * 
 * 仓库列表
 */

import { Effect, Reducer } from 'umi';
import { 
  addWarehouse,
  getWarehouseList,
  setWarehouseState,
  updateWarehouse,
  deleteWarehouse,
} from '@/services/configuration/warehouseLocation';
import { message } from 'antd';

export interface IWarehouseLocationState {
  warehouses: WarehouseLocation.IRecord[];
}

interface IWarehouseLocationModel {
  namespace: 'warehouseLocation';
  state: IWarehouseLocationState;

  effects: {
    getWarehouseList: Effect;
    addWarehouse: Effect;
    setWarehouseState: Effect;
    updateWarehouse: Effect;
    deleteWarehouse: Effect;
  };

  reducers: {
    saveWarehouse: Reducer;
  };
}

const chipment: IWarehouseLocationModel = {
  namespace: 'warehouseLocation',
  state: {
    warehouses: [], // 仓库地址列表
  },
  effects: {
    // 列表仓库
    *getWarehouseList({ payload, resolve, reject }, { call, put }) {
      try {
        const res = yield call(getWarehouseList, payload);
        yield put({
          type: 'saveWarehouse',
          payload: res,
        });
        resolve && resolve(res);
      } catch (error) {
        reject && reject(reject);
      }
    },

    // 创建仓库
    *addWarehouse({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(addWarehouse, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 修改仓库开关
    *setWarehouseState({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(setWarehouseState, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 修改仓库
    *updateWarehouse({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(updateWarehouse, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 删除仓库
    *deleteWarehouse({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(deleteWarehouse, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
  
  reducers: {
    // 保存仓库地址
    saveWarehouse(state, { payload }) {
      if (payload.code !== 200) {
        message.error(`获取仓库地址列表异常 ${payload.message}`);
        return;
      }      
      state.warehouses = payload.data;
    },
  },
};

export default chipment;
