/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinPandect\models\b2b.ts
 * 
 * ASIN总览的store
 */
import { Reducer, Effect } from 'umi';
import {
  getB2BinitData,
  getB2BlineChartData,
} from '@/services/asinPandect';
import { storage } from '@/utils/utils';
import { storageKeys } from '@/utils/huang';


const { asinB2BCheckDoufu } = storageKeys;
interface IAsinB2B {
  namespace: 'asinB2B';
  state: {
    
  };

  reducers: {
    changeColor: Reducer;
    changeCheckedType: Reducer;
  };

  effects: {
    getinitData: Effect;
    getLineChartData: Effect;
  };
}
const asinB2B: IAsinB2B = {
  namespace: 'asinB2B',
  state: {
    dfCheckedTypes: storage.get(`${asinB2BCheckDoufu}`) || ['sales', 'orderQuantity'],
    doufuSelectColor: ['#FFC175', '#49B5FF'], // 豆腐块的选中的颜色
  },

  reducers: {
    // 豆腐块改变颜色
    changeColor(state, { payload }) {
      state.doufuSelectColor = payload.colors;
    },

    // 改中选中的豆腐块类型
    changeCheckedType(state, { payload }) {
      storage.set(`${asinB2BCheckDoufu}`, payload.checkeds);
      state.dfCheckedTypes = payload.checkeds;
    },
  },

  effects: {
    *getinitData({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getB2BinitData, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    *getLineChartData({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getB2BlineChartData, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
};


export default asinB2B;
