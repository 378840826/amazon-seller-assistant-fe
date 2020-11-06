/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-11-28 10:50:30
 */
import { Effect } from 'umi';
import { 
  getHistoryList,
  getHistoryConditions,
  getRuleList,
} from '@/services/ruleHistory';

interface IRuleHistoryType {
  namespace: 'ruleHistory';
  state: {};
  effects: {
    getHistory: Effect;
    getHistoryConditions: Effect;
    getRuleList: Effect;
  };
}

const ruleHistory: IRuleHistoryType = {
  namespace: 'ruleHistory',
  state: {},
  effects: {
    // 初始化列表
    *getHistory({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getHistoryList, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 条件列表
    *getHistoryConditions({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getHistoryConditions, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 规则列表
    *getRuleList({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getRuleList, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },
  },
};


export default ruleHistory;
