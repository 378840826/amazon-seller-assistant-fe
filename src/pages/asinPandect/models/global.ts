/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @FilePath: \amzics-react\src\pages\asinPandect\models\global.ts
 * 
 * ASIN总览的store
 * 
 * DEV US/DROK 多个兄弟ASIN的B06XJF7LW6
 */
import { Reducer, Effect } from 'umi';
import {
  getSiblingsAsin,
  getServersAsin,
} from '@/services/asinPandect';
import { message } from 'antd';

 
export interface IAsinGlobalType {
  namespace: 'asinGlobal';
  state: {
    asin: string;
    isAsin: boolean;
  };

  reducers: {
    changeAsin: Reducer;
    serverAsin: Reducer;
  };

  effects: {
    getAsin: Effect;
    getSiblingsAsin: Effect;
  };
}
const AsinGlobal: IAsinGlobalType = {
  namespace: 'asinGlobal',
  state: {
    asin: '',
    isAsin: false, // 验证ASIN是否存在的条件，为false不加载组件
  },

  reducers: {
    // 普通更改ASIN
    changeAsin(state, { payload }): void {
      state.asin = payload.asin;
      payload.callback ? payload.callback() : null;
    },

    // 异步更改后的修改
    serverAsin(state, { payload }): void {
      if (!payload.data) {
        state.isAsin = false;
        message.error('ASIN或SKU不存在');
        return;
      }
      state.isAsin = true;
      state.asin = payload.data.asin;
    },
  },

  effects: {
    *getAsin({ payload, resolve, reject }, { call, put }): Generator {
      try {
        const res = yield call(getServersAsin, payload);
        yield put({
          type: 'serverAsin',
          payload: res,
        });
        resolve ? resolve(res) : null;
      } catch (err) {
        reject ? reject(err) : null;
      }
    },

    *getSiblingsAsin({ payload, resolve, reject }, { call }): Generator {
      try {
        const res = yield call(getSiblingsAsin, payload);
        resolve(res as {});
      } catch (err) {
        reject(err);
      }
    },
  },
};


export default AsinGlobal;
