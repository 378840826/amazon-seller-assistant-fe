/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-20 14:41:57
 * @LastEditTime: 2021-04-26 14:03:01
 * 
 * 配置模块下的公用的
 */

import { Effect, Reducer } from 'umi';
import { 
  getShops,
} from '@/services/configuration/base';
import { message } from 'antd';

export interface IConfigurationBaseState {
  shops: Global.IOption[];
}

interface IConfigurationBaseModel {
  namespace: 'configurationBase';
  state: IConfigurationBaseState;

  effects: {
    getShop: Effect;
  };

  reducers: {
    saveShop: Reducer;
  };
}

const chipment: IConfigurationBaseModel = {
  namespace: 'configurationBase',
  state: {
    shops: [],
  },
  effects: {
    // 获取店铺
    *getShop({ payload }, { call, put }) {
      const res = yield call(getShops, payload);

      if (res.code !== 200) {
        message.error('店铺列表获取失败！');
        return;
      }

      yield put({
        type: 'saveShop',
        payload: res.code === 200 ? res.data : [],
      });
    },
  },
  
  reducers: {
    saveShop(state, { payload }) {
      
      const arr: Global.IOption[] = [];
      payload.forEach((item: { id: string; mstoreName: string }) => {
        arr.push({
          label: item.mstoreName,
          value: item.id,
        });
      });
      state.shops = arr;
    },
  },
};

export default chipment;
