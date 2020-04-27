import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent } from '@/services/user';

export interface ICurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}

export interface IUserModelState {
  currentUser?: ICurrentUser;
}

export interface IUserModelType {
  namespace: 'global';
  state: IUserModelState;
  effects: {
    fetchNotices: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<IUserModelState>;
  };
}

const UserModel: IUserModelType = {
  namespace: 'global',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchNotices(_, { call, put }): Generator {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action): IUserModelState {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default UserModel;
