/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-05-29 10:39:05
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\mws\order\List\model.ts
 */ 

import { getOrderLists, Test } from '@/services/orderList';
import { Effect, Reducer } from 'umi';

interface IState {
  tableData: {};
}

interface IOrderList {
  namespace: 'orderList';
  
  state: IState;
  
  effects: {
    getOrderList: Effect;
    test: Effect;
  };
  reducers: {
    changeData: Reducer;
  };
}


const OrderList: IOrderList = {
  namespace: 'orderList',

  state: {
    tableData: {},
  },

  reducers: {
    changeData(state, { payload }) {
      state.tableData = payload;
    },
  },

  effects: {
    *getOrderList({ payload, resolve, reject }, { call }): Generator {
      try {
        const response = yield call(getOrderLists, payload);
        resolve(response as {});
      } catch (error) {
        reject(error);
      }
    },

    *test({ payload }, { call }) {
      yield call(Test, payload.data);
    },
  },
};

export default OrderList;
