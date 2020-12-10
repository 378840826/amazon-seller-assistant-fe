import { message } from 'antd';
import { IModelType } from './connect';
import { queryCurrent, modifyUsername, modifyPwd, 
  emailExist, sendForgetEmail, activeEmail, 
  resetPwd, userNameExist, preLogin, login, logout, resentEmail } from '@/services/user';

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
      username: '',
      email: '',
      phone: '',
      topAccount: false,
      memberExpirationDate: '',
      memberExpired: false,
      memberFunctionalSurplus: [
        { functionName: '绑定店铺', frequency: 0 },
        { functionName: '广告授权店铺', frequency: 0 },
        { functionName: '子账号', frequency: 0 },
        { functionName: '智能调价', frequency: 0 },
        { functionName: 'ASIN总览报表导出', frequency: 0 },
        { functionName: 'ASIN动态监控', frequency: 0 },
        { functionName: '跟卖监控', frequency: 0 },
        { functionName: 'Review监控', frequency: 0 },
        { functionName: '搜索排名监控', frequency: 0 },
        { functionName: '自动邮件', frequency: 0 },
        { functionName: '补货计划导出', frequency: 0 },
        { functionName: 'PPC托管', frequency: 0 },
      ],
    },
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.code === 200){
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
    },
    *modifyUsername({ payload, callback }, { call }) {
      const response = yield call(modifyUsername, payload);
      if (callback && typeof callback === 'function'){
        callback(response);
      }
    },
    *modifyPwd({ payload, callback }, { call }){
      const response = yield call(modifyPwd, payload);
      if (response.code === 200){
        if (callback && typeof callback === 'function'){
          callback(response);
        }
      }
    },
    *existEmail({ payload, callback }, { call }){
      const response = yield call(emailExist, payload);
      if ( response.code === 200 && callback && typeof callback === 'function'){
        callback(response);
      }
    },
    *existUsername({ payload, callback }, { call }){
      const response = yield call(userNameExist, payload);
      if (response.code === 200 && callback && typeof callback === 'function'){
        callback(response);
      }
    },
  
    *sendForgetEmail({ payload, callback }, { call }){
      const response = yield call(sendForgetEmail, payload);
      if (callback && typeof callback === 'function'){
        callback(response);
      }
    },
    *activeEmail({ payload, callback }, { call }){
      const response = yield call(activeEmail, payload);
      if (callback && typeof callback === 'function'){
        callback(response);
      }
    },
    *resetPwd({ payload, callback }, { call }){
      const response = yield call(resetPwd, payload);
      if (callback && typeof callback === 'function'){
        callback(response);
      }
    },
    *preLogin({ payload, callback }, { call }){
      const response = yield call(preLogin, payload);
      if (callback && typeof callback === 'function'){
        callback(response);
      }
    },
    *login({ payload, callback }, { call }){
      const response = yield call(login, payload);
      if (callback && typeof callback === 'function'){
        callback(response);
      }
    },
    *logout(_, { call }){
      const response = yield call(logout);
      if (response.code === 200){
        window.location.href = '/users/login';
      }
    },
    *resentEmail({ payload }, { call }){
      const response = yield call(resentEmail, payload);
      if (response.code !== 200){
        message.error(response.message);
      }
    },
  },

  reducers: {
    saveCurrentUser(state, { payload, callback }) {
      state.currentUser = payload.data || {};
      callback && typeof callback === 'function' && callback();
    },
    modifyCurrentUsername(state, { payload }) {
      state.currentUser.username = payload;
    },

    // 更新功能余量次数（默认调用一次余量减少 1）
    updateMemberFunctionalSurplus(state, { payload }) {
      // quantity 功能余量减少的数值，默认为 1， 增加则设为负数
      const { functionName, quantity } = payload;
      for (let index = 0; index < state.currentUser.memberFunctionalSurplus?.length; index++) {
        const element = state.currentUser.memberFunctionalSurplus[index];
        if (element.functionName === functionName) {
          element.frequency -= quantity || 1;
          return;
        }
      }
    },
  },
};

export default UserModel;
