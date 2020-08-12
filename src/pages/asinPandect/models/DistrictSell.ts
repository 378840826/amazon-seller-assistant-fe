/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-07-27 11:53:42
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinPandect\models\DistrictSell.ts
 */ 
import {
  getDSellInit,
} from '@/services/asinPandect';
import { Effect } from 'umi';

interface IDistrictSellType {
  namespace: 'districtSell';
  state: {};
  effects: {
    getDSellInit: Effect;
  };
}


const DistrictSell: IDistrictSellType = {
  namespace: 'districtSell',
  state: {},

  effects: {
    *getDSellInit({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getDSellInit, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
};

export default DistrictSell;
