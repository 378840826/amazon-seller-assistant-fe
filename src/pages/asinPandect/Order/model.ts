/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-07-18 16:16:40
 * @LastEditors: Please set LastEditors
 * @FilePath: \amzics-react\src\pages\asinPandect\Order\model.ts
 */ 
import { Effect, Reducer } from 'umi';
import { storage } from '@/utils/utils';
import { storageKeys } from '@/utils/huang';
import {
  getOrderInitData,
  getGuanLianSales,
  getAsinOrderInit,
  getServerBarData,
  getOrderLineChartData,
  orderTableDownload,
} from '@/services/asinPandect';

interface IAsinOrderType {
  namespace: 'asinOrder';
  state: AsinOrder.IStateType;
  reducers: {
    changeColor: Reducer;
    changeCheckedType: Reducer;
  };
  effects: {
    getInitData: Effect;
    getLineCartsData: Effect;
    getGuanLianSales: Effect;
    getAsinOrderInit: Effect;
    getBarData: Effect;
    tableDownload: Effect;
  };
}

const { asinOrderCheckDoufu } = storageKeys;
const AsinOrder: IAsinOrderType = {
  namespace: 'asinOrder',
  state: {
    initData: {},
    doufuSelectColor: ['#FFC175', '#49B5FF'], // 豆腐块的选中的颜色
    dfCheckedTypes: storage.get(`${asinOrderCheckDoufu}`) || ['sales', 'orderQuantity'],
  },
  reducers: {
    // 豆腐块改变颜色
    changeColor(state, { payload }) {
      state.doufuSelectColor = payload.colors;
    },

    // 改中选中的豆腐块类型
    changeCheckedType(state, { payload }) {
      storage.set(`${asinOrderCheckDoufu}`, payload.checkeds);
      state.dfCheckedTypes = payload.checkeds;
    },
  },
  effects: {
    // 页面切换店铺切换Asin切换周期初始化接口
    *getAsinOrderInit({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getAsinOrderInit, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 获取折线图数据
    *getLineCartsData({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getOrderLineChartData, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 获取分时统时直柱图数据
    *getBarData({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getServerBarData, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 表格数据
    *getInitData({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getOrderInitData, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 请求关联销售
    *getGuanLianSales({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getGuanLianSales, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 导出列表
    *tableDownload({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(orderTableDownload, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
};

export default AsinOrder;
