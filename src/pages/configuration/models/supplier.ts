import { Effect, Reducer } from 'umi';
import {
  getSupplierList,
  updateSupplier,
  updateSupplierState,
  addSupplier,
  getUserList,
  updateBatchSupplier,
  deleteSupplier,
} from '@/services/configuration/supplier';


export interface ISupplierState{
  supplierList: Supplier.ISupplierList[];
  userList: Array<API.IUserList>;
}

interface ISupplierModal {
  namespace: 'supplier';
  state: ISupplierState;
  effects: {
    getSupplierList: Effect;
    updateSupplier: Effect;
    updateSupplierState: Effect;
    addSupplier: Effect;
    getUserList: Effect;
    updateBatchSupplier: Effect;
    deleteSupplier: Effect;
  };
  reducers: {
    saveSupplierList: Reducer;
    saveUserList: Reducer;
  };
}

const chipment: ISupplierModal = {
  namespace: 'supplier',
  state: {
    supplierList: [],
    userList: [],
  },
  effects: {
    *getSupplierList({ payload, reject, resolve }, { call, put }) {
      try {
        const res = yield call(getSupplierList, payload);
        resolve(res);
        yield put({
          type: 'saveSupplierList',
          payload: res.code === 200 ? res.data?.records : [],
        });
      } catch (err){
        reject(err);
      }
    },

    //修改列表信息
    *updateSupplier({ payload, reject, resolve }, { call }){
      try {
        const res = yield call(updateSupplier, payload);
        resolve(res);
      } catch (err){
        reject(err);
      }
    },

    //修改供应商状态
    *updateSupplierState({ payload, reject, resolve }, { call }){
      try {
        const res = yield call(updateSupplierState, payload);
        resolve(res);
      } catch (err){
        reject(err);
      }
    },

    //创建供应商
    *addSupplier({ payload, reject, resolve }, { call }){
      try {
        const res = yield call(addSupplier, payload);
        resolve(res);
      } catch (err){
        reject(err);
      }
    },
    //子账号列表
    *getUserList(_, { call, put }){
      const response = yield call(getUserList);
      if (response.code === 200){
        yield put({
          type: 'saveUserList',
          payload: response,
        });
      }
    },
    //批量上传供应商
    *updateBatchSupplier({ payload, reject, resolve }, { call }){
      try {
        const res = yield call(updateBatchSupplier, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
    //删除供应商
    *deleteSupplier({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(deleteSupplier, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

  },

  reducers: {
    saveSupplierList(state, { payload }){
      state.supplierList = payload;
    },
    saveUserList: (state, { payload }) => {
      state.userList = payload.data;
    },
  },
};

export default chipment;
