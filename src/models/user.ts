import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent } from '@/services/user';

export interface ICurrentUser {
  id: number;
  username: string;
  email: string;
  phone: string;
  isMainAccount: boolean;
}

export interface IUserModelState {
  currentUser: ICurrentUser;
}

export interface IUserModelType {
  namespace: 'user';
  state: IUserModelState;
  effects: {
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<IUserModelState>;
  };
}

const UserModel: IUserModelType = {
  namespace: 'user',

  state: {
    currentUser: {
      id: -1,
      username: '请登录',
      email: '',
      phone: '',
      isMainAccount: false,
    },
  },

  effects: {
    *fetchCurrent(_, { call, put }): Generator {
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
        currentUser: action.payload.data || {},
      };
    },
  },
};

export default UserModel;
