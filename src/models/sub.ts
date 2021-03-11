import { message } from 'antd';
import { IModelType } from './connect';
import { nTs } from '@/utils/utils';
import { 
  getStoreList, 
  getUserList, 
  addUser, 
  deleteUser, 
  modifySUsername,
  modifySEmail, 
  modifySPassword,
  modifyStores,
  getRoleList,
  updateRole,
  updateState } from '@/services/sub';

export interface ISubModelState{
  storeList: Array<API.IStoreList>;
  userList: Array<API.IUserList>;
  roleList: Array<API.IParams>;
  tableLoading: boolean;
}

interface ISubModelType extends IModelType{
  namespace: 'sub';
  state: ISubModelState;
  
}
const SubModel: ISubModelType = {
  namespace: 'sub',
  state: {
    storeList: [], //可分配店铺列表
    userList: [], //表格中列表
    roleList: [], //角色列表
    tableLoading: false, //表格是否loading
  },
  effects: {
    *getThreeList(_, { call, put, all }){
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const [storeList, userList, roleList] = yield all([
        call(getStoreList),
        call(getUserList), 
        call(getRoleList),
      ]);
      yield put({
        type: 'saveStoreList',
        payload: storeList,
      });
      yield put({
        type: 'saveUserList',
        payload: userList,
      });
      yield put({
        type: 'saveRoleList',
        payload: roleList.data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
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
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getUserList);
      if (response.code === 200){
        yield put({
          type: 'saveUserList',
          payload: response,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
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
    *getRoleList(_, { call, put }){
      const response = yield call(getRoleList);
      if (response.code === 200){
        yield put({
          type: 'saveRoleList',
          payload: response.data,
        });
      } else {
        message.error(response.message);
      }
    },
    *updateRole({ payload, callback }, { call }){
      const response = yield call(updateRole, payload);
      if (response.code === 200){
        callback && callback();
      } else {
        message.error(response.message);
      }
    },
    *updateState({ payload }, { call, put }){
      const response = yield call(updateState, payload);
      if (response.code === 200){
        yield put({
          type: 'changeSwitch',
          payload,
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
    saveRoleList: (state, { payload }) => {
      state.roleList = payload;
    },
    changeSwitch: (state, { payload }) => {
      const { id, checked } = payload;
      const index = state.userList.findIndex( (item: API.IUserList) => item.id === id);
      state.userList[index].state = checked;
    },
    //修改表格loading的状态
    changeLoading: (state, { payload }) => {
      state.tableLoading = payload;
    },
    
  }, 
};
export default SubModel;
