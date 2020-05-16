import { IModelType } from './connect';
import { queryCurrent } from '@/services/user';

export interface IUserModelState {
  currentUser: API.ICurrentUser;
}

interface IUserModelType extends IModelType {
  namespace: 'user';
  state: IUserModelState;
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
