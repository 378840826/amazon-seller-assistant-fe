import { message } from 'antd';
import { IModelType } from './connect';
import { nTs } from '@/utils/utils';
import { getStoreList, getUserList, addUser, deleteUser, modifySUsername, modifySEmail, modifySPassword, modifyStores } from '@/services/sub';

export interface ISubModelState{
  storeList: Array<API.IStoreList>;
  userList: Array<API.IUserList>;
}

interface ISubModelType extends IModelType{
  namespace: 'sub';
  state: ISubModelState;
  
}
const SubModel: ISubModelType = {
  namespace: 'sub',
  state: {
    storeList: [],
    userList: [],
  },
  effects: {
    *getStoreList({ callback }, { call, put }){
      const response = yield call(getStoreList);
      if (response.code === 200 ){
        yield put({
          type: 'saveStoreList',
          payload: response,
        });
        callback();
      }
      
    },    
    *addUser({ payload, callback }, { call, put }){
      const response = yield call(addUser, payload);
      callback && typeof callback === 'function' && callback(response);
      if (response.code === 200){
        yield put({
          type: 'getUserList',
        });
      }
    },
    *getUserList(_, { call, put }){
      const response = yield call(getUserList);
      if (response.code === 200){
        yield put({
          type: 'saveUserList',
          payload: response,
        });
      }
    },
    *modifySUsername({ payload, callback }, { call, put }) {
      const response = yield call(modifySUsername, payload);
      if (response.code === 200){
        yield put({
          type: 'modifyUsername',
          payload: payload,
        });
      } else {
        message.error(response.message);
      } 
      callback && typeof callback === 'function' && callback(response);
    },
    *modifySPassword({ payload, callback }, { call }){
      const response = yield call(modifySPassword, payload);
      if (response.code !== 200){
        message.error(response.message);
      }
      callback && typeof callback === 'function' && callback(response);
    },
    *modifySEmail({ payload, callback }, { call, put }){
      const response = yield call(modifySEmail, payload);
      if (response.code === 200){
        yield put({
          type: 'modifyEmail',
          payload: payload,
        });
      } else {
        message.error(response.message);
      }
      callback && typeof callback === 'function' && callback(response);
    },
    *modifyStores({ payload, callback }, { call }){
      const response = yield call(modifyStores, payload);
      callback && typeof callback === 'function' && callback(response);
    },
    *deleteUser({ payload, callback }, { call, put }){
      const response = yield call(deleteUser, payload);
      if (response.code === 200){
        callback && typeof callback === 'function' && callback(response);
        yield put({
          type: 'deleteSingleUser',
          payload: payload,
        });
      } else {
        message.error(response.message);
      }
      
    },
  },
  reducers: {
    saveStoreList(state, { payload }){
      nTs(payload);
      state.storeList = payload.data.records || [];
    },
    saveUserList: (state, { payload }) => {
      nTs(payload);
      state.userList = payload.data;
    },
    deleteSingleUser: (state, { payload }) => {
      const id = payload.id;
      state.userList = state.userList.filter( (item: { id: string }) => item.id !== id);
    },
    modifyUsername: (state, { payload }) => {
      const { id, username } = payload;
      const newUserList = state.userList;
      newUserList.forEach((item: API.IUserList, index: number) => item.id === id ? (newUserList[index].username = username) : '');
      state.userList = newUserList;
    },
    modifyEmail: (state, { payload }) => {
      const { id, email } = payload;
      const newUserList = state.userList;
      newUserList.forEach((item: API.IUserList, index: number) => item.id === id ? (newUserList[index].email = email) : '');
      state.userList = newUserList;
    },
    
  }, 
};
export default SubModel;
