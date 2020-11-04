/*
 * @Author: your name
 * @Date: 2020-11-25 09:18:32
 * @LastEditTime: 2020-11-26 21:29:49
 */
import {
  Effect,
} from 'umi';
import {
  rulesList,
  setRuleName,
  getCompete,
  addtOrSetCompete,
  addtOrSetBuybox,
  addtOrSetSales,
  deleteRule,
  setTiming,
  getSales,
  getBuybox,
} from '@/services/rules';


export interface IRulesModel {
  namespace: 'rules';
  state: {};
  effects: {
    rulesList: Effect;
    setRuleName: Effect;
    getCompete: Effect;
    addtOrSetCompete: Effect;
    addtOrSetBuybox: Effect;
    addtOrSetSales: Effect;
    deleteRule: Effect;
    setTiming: Effect;
    getSales: Effect;
    getBuybox: Effect;
  };
}

const RulesIndex: IRulesModel = {
  namespace: 'rules',
  state: {},
  effects: {
    // 规则列表
    *rulesList({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(rulesList, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 修改规则名称
    *setRuleName({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(setRuleName, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 修改规则定时
    *setTiming({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(setTiming, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },


    // 规则列表 - 删除规则
    *deleteRule({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(deleteRule, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },


    // 获取竞品规则设定查询
    *getCompete({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(getCompete, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 竞品规则设定修改或添加
    *addtOrSetCompete({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(addtOrSetCompete, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 黄金购物车调价修改或添加
    *addtOrSetBuybox({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(addtOrSetBuybox, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // buybox规则设定查询
    *getBuybox({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(getBuybox, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 销售表现规则设定修改或者添加
    *addtOrSetSales({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(addtOrSetSales, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 销售表现规则设定查询
    *getSales({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(getSales, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

  },
};

export default RulesIndex;
