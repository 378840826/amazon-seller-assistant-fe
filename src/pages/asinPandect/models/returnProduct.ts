/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-07-13 11:59:51
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinPandect\models\returnProduct.ts
 * 
 * 退货分析
 */ 
import { Reducer, Effect } from 'umi';

import {
  getReturnProductInitData,
} from '@/services/asinPandect';

interface IReturnProductType {
  namespace: 'returnProduct';
  state: {};
  reducers: {
    
  };
  effects: {
    getReturnProductInitData: Reducer;
  };
}
const ReturnProduct: IReturnProductType = {
  namespace: 'returnProduct',
  state: {

  },

  reducers: {

  },

  effects: {
    *getReturnProductInitData({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getReturnProductInitData, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
};


export default ReturnProduct;
