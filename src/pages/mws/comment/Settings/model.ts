/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-05 15:04:27
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-22 19:08:13
 * @FilePath: \amzics-react\src\pages\mws\comment\Settings\model.ts
 */ 
import { Effect, Reducer } from 'umi';
import { 
  getSearchAsinList, 
  commentMonitorSettingsList,
  setcommentMonitorSettingsSwitch,
  addMonitorSetting,
  setreviewRemindStar,
  getreviewRemindStar,
} from '@/services/commentMonitor';

export interface ICommentSettingsState {
  downList: [] | [ {code?: string; data?: []}];
  datas?: {};
}

export interface ICommentSettings {
  namespace: 'commectSettings';
  state: ICommentSettingsState;

  reducers: {
    getTableList: Reducer;
  };

  effects: {
    getSearchAsinList: Effect;
    getCommectMonitorSetList: Effect;
    setcommentMonitorSettingsSwitch: Effect;
    addMonitorSetting: Effect;
    setreviewRemindStar: Effect;
    getreviewRemindStar: Effect;
  };
}


const Model: ICommentSettings = {
  namespace: 'commectSettings',
  state: {
    downList: [],
    datas: {},
  },

  reducers: {
   

    getTableList(state, { payload }) {
      state.datas = payload;
    },
  },
  
  effects: {
    // 获取建议ASIN  (搜索下拉框)
    *getSearchAsinList({ payload, reject, resolve }, { call }): Generator {
      try {
        const res = yield call(getSearchAsinList, payload.asin);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 添加一条监控设定
    *addMonitorSetting({ payload, reject, resolve }, { call }): Generator {
      try {
        const res = yield call(addMonitorSetting, payload.asin);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 提醒星级获取
    *getreviewRemindStar({ reject, resolve }, { call }): Generator {
      try {
        const res = yield call(getreviewRemindStar);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 提醒星级设置修改
    *setreviewRemindStar({ payload, reject, resolve }, { call }): Generator {
      try {
        const res = yield call(setreviewRemindStar, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 获取监控评论设定列表
    *getCommectMonitorSetList({ payload }, { call, put }): Generator {
      const response = yield call(commentMonitorSettingsList, payload.data);
      yield put({
        type: 'getTableList',
        payload: response as {},
      });
    },

    // 监控开关
    *setcommentMonitorSettingsSwitch({ payload }, { call }): Generator {
      try {
        const response = yield call(setcommentMonitorSettingsSwitch, payload.data);
        payload.resolve(response);
      } catch (err) {
        payload.reject(err);
      }
    },
  },
};


export default Model;
