import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryUnreadNotices } from '@/services/notices';

export interface IUnreadNotices {
  reviewRemindCount: number;
  stockRemindCount: number;
}

export interface IGlobalModelState {
  unreadNotices: IUnreadNotices;
}

export interface IGlobalModelType {
  namespace: 'global';
  state: IGlobalModelState;
  effects: {
    fetchUnreadNotices: Effect;
  };
  reducers: {
    saveUnreadNotices: Reducer<IGlobalModelState>;
  };
}

const GlobalModel: IGlobalModelType = {
  namespace: 'global',

  state: {
    // 未读消息数量
    unreadNotices: {
      reviewRemindCount: 0,
      stockRemindCount: 0,
    },
  },

  effects: {
    // 获取未读消息数量
    *fetchUnreadNotices(_, { call, put }): Generator {
      const response = yield call(queryUnreadNotices);
      yield put({
        type: 'saveUnreadNotices',
        payload: response,
      });
    },
  },

  reducers: {
    saveUnreadNotices(state, action): IGlobalModelState {
      return {
        ...state,
        unreadNotices: action.payload.data.unreadNotices,
      };
    },
  },
};

export default GlobalModel;
