/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-05-29 10:39:05
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-19 15:24:00
 * @FilePath: \amzics-react\src\pages\mws\order\List\model.ts
 */ 

import { getOrderLists } from '@/services/orderList';
import { Effect, Reducer } from 'umi';

interface IState {
  tableData: {};
}

interface IOrderList {
  namespace: 'orderList';
  
  state: IState;
  
  effects: {
    getOrderList: Effect;
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
    *getOrderList({ payload }, { call }): Generator {
      try {
        const response = yield call(getOrderLists, payload.data);
        payload.resolve(response as {});
      } catch (error) {
        payload.reject(error);
      }
    },
  },
};

export default OrderList;
