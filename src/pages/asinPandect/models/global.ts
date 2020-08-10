/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\asinPandect\models\global.ts
 * 
 * ASIN总览的store
 */
import { Reducer, Effect } from 'umi';
import {
  getSiblingsAsin,
  getServersAsin,
} from '@/services/asinPandect';
import { message } from 'antd';

 
interface IAsinGlobalType {
  namespace: 'asinGlobal';
  state: {
    asin: string;
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
        message.error(payload.message || '没有相关ASIN');
        return;
      }
      state.asin = payload.data.asin;
    },
  },

  effects: {
    *getAsin({ payload, resolve, reject }, { call, put }): Generator {
      // try {
      //   const res = yield call(getServersAsin, payload);
      //   yield put({
      //     type: 'serverAsin',
      //     payload: res,
      //   });
      //   resolve(res);
      // } catch (err) {
      //   reject(err);
      // }
      const res = yield call(getServersAsin, payload);
      yield put({
        type: 'serverAsin',
        payload: res,
      });
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
