/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-08-14 11:06:15
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\follow\models\Monitor.ts
 */
import {
  Effect, 
} from 'umi';
import {
  getFollowComplete,
  getFollowAddasin,
  getFollowRemind,
  updateFollowRemind,
  getFrequency,
  updateFrequency,
  getMonitorList,
  getHistoryList,
  getFollowList,
  updateMonitorSwitch,
} from '@/services/follow';

interface ITomMonitor {
  namespace: 'tomMonitor';
  state: {};
  reducers: {};
  effects: {
    getFollowComplete: Effect;
    getFollowAddasin: Effect;
    getFollowRemind: Effect;
    updateFollowRemind: Effect;
    getFrequency: Effect;
    updateMonitorSwitch: Effect;
    updateFrequency: Effect;
    getMonitorList: Effect;
    getHistoryList: Effect;
    getFollowList: Effect;
  };
}

const tomMonitor: ITomMonitor = {
  namespace: 'tomMonitor',
  state: {

  },

  reducers: {

  },

  effects: {
    // 搜索框列表联想框
    *getFollowComplete({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getFollowComplete, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 搜索框添加ASIN
    *getFollowAddasin({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getFollowAddasin, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 提醒设定-查询
    *getFollowRemind({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getFollowRemind, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 提醒设定-修改
    *updateFollowRemind({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(updateFollowRemind, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 频率设定-查询
    *getFrequency({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getFrequency, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
    
    // 频率设定-修改
    *updateFrequency({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(updateFrequency, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 监控开关
    *updateMonitorSwitch({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(updateMonitorSwitch, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 监控列表 - 查询
    *getMonitorList({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getMonitorList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 跟卖历史列表
    *getHistoryList ({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getHistoryList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 跟卖者列表
    *getFollowList ({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getFollowList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

  },
};

export default tomMonitor;
