/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:41:57
 * @LastEditTime: 2021-05-10 16:16:34
 * 
 * 物流方式管理
 */

import { Effect, Reducer } from 'umi';
import { 
  getLogisticsList,
  addLogistics,
  setLogisticsState,
  updateLogistics,
  deleteLogistics,
} from '@/services/configuration/logistics';
import { message } from 'antd';

export interface ILogisticsState {
  logistics: Logistics.IRecord[];
}

interface ILogisticsModel {
  namespace: 'logistics';
  state: ILogisticsState;

  effects: {
    getLogisticsList: Effect;
    addLogistics: Effect;
    setLogisticsState: Effect;
    updateLogistics: Effect;
    deleteLogistics: Effect;
  };

  reducers: {
    saveLogistics: Reducer;
    updateLogistic: Reducer;
    deleteLogistic: Reducer;
  };
}

const chipment: ILogisticsModel = {
  namespace: 'logistics',
  state: {
    logistics: [], // 仓库地址列表
  },
  effects: {
    // 物流列表
    *getLogisticsList({ payload, reject, resolve }, { call, put }) {
      try {
        const res = yield call(getLogisticsList, payload);
        yield put({
          type: 'saveLogistics',
          payload: res,
        });
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 创建物流
    *addLogistics({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(addLogistics, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 修改物流开关
    *setLogisticsState({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(setLogisticsState, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 修改物流信息
    *updateLogistics({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(updateLogistics, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 删除物流
    *deleteLogistics({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(deleteLogistics, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
  
  reducers: {
    // 保存物流列表
    saveLogistics(state, { payload }) {
      if (payload.code !== 200) {
        message.error(`获取物流列表异常 ${payload.message}`);
        return;
      }      
      state.logistics = payload.data;
    },

    // 修改单个物流信息
    updateLogistic(state, { payload }) {
      for (let i = 0; i < state.logistics.length; i++) {
        if (state.logistics[i].id === payload.id) {
          state.logistics[i] = payload;
          state.logistics[i].gmtModified = new Date(); // 默认更新一下时间，此时会跟数据库的时间相差几秒
          break;
        }
      }
    },

    // 删除单个物流信息
    deleteLogistic(state, { payload }) {
      for (let i = 0; i < state.logistics.length; i++) {
        if (state.logistics[i].id === payload.id) {
          state.logistics.splice(i, 1);
          break;
        }
      }
    },
  },
};

export default chipment;
