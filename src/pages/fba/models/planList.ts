/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-03-16 10:29:28
 * @LastEditTime: 2021-05-18 17:47:52
 * 
 * 货件计划列表
 */


import { Effect, Reducer } from 'umi';
import { 
  getPlanList,
  updatePlan,
  getSites,
  getWarehouses,
  getProductList,
  addPlan,
  getPlanDetail,
  updateLogistics,
  updateDetails,
  planVerify,
  planVerifySubmit,
  untoVerify,
  planVerifyPageInitData,
  planHandlePageInitData,
  shipmentList,
  associatShipment,
  createShipment,
} from '@/services/fba/planList';
import moment from 'moment';

export interface IPianListState {
  planList: planList.IPlanDetail[];
  sites: string[];
  warehouses: planList.IWarehouses[];
}

interface IPlanListModel {
  namespace: 'planList';
  state: IPianListState;
  effects: {
    getPlanList: Effect;
    updatePlan: Effect;
    getSites: Effect;
    getWarehouses: Effect;
    getProductList: Effect;
    addPlan: Effect;
    getPlanDetail: Effect;
    updateLogistics: Effect;
    updateDetails: Effect;
    planVerify: Effect;
    planVerifySubmit: Effect;
    untoVerify: Effect;
    planVerifyPageInitData: Effect;
    planHandlePageInitData: Effect;
    shipmentList: Effect;
    associatShipment: Effect;
    createShipment: Effect;
  };
  reducers: {
    savePlanList: Reducer;
    updatePlanList: Reducer;
    saveSites: Reducer;
    saveWarehouses: Reducer;
    updatePlanState: Reducer;
    updateItemPlan: Reducer;
    updateUntoPlan: Reducer;
    updatePlanItemVerify: Reducer;
  };
}

const planList: IPlanListModel = {
  namespace: 'planList',
  state: {
    planList: [], // 货件计划列表
    sites: [], // 站点下拉列表
    warehouses: [], // 目的仓库下拉列表
  },
  effects: {
    // 货件计划列表
    *getPlanList({ payload, reject, resolve }, { call, put }) {
      try {
        const res = yield call(getPlanList, payload);
        resolve(res);
        
        yield put({
          type: 'savePlanList',
          payload: res.code === 200 ? res.data.records : [],
        });
      } catch (err) {
        reject(err);
      }
    },

    // 货件作废
    *updatePlan({ payload, resolve, reject }, { call, put }) {
      try {
        const res = yield call(updatePlan, payload);
        resolve(res);
        if (res.code && res.code === 200) {
          yield put({
            type: 'updateItemPlan',
            payload: payload.ids,
          });
        }
      } catch (error) {
        reject(error);
      }
    },

    // 创建货件计划 - 获取站点下拉列表
    *getSites({ payload, callback }, { call, put }) {
      const res = yield call(getSites, payload);
      if (res.code === 200) {
        yield put({
          type: 'saveSites',
          payload: res.data || [],
        });
      }
      callback(res.code, res.message);
    },

    // 创建货件计划 - 获取目的仓库下拉列表
    *getWarehouses({ payload, callback }, { call, put }) {
      const res = yield call(getWarehouses, payload);
      if (res.code === 200) {
        yield put({
          type: 'saveWarehouses',
          payload: res.data || [],
        });
      }
      callback(res.code, res.message);
    },

    // 创建货件计划 - 获取商品列表
    *getProductList({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(getProductList, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 创建货件计划 - 提交创建
    *addPlan({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(addPlan, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },
    
    // 货件计划列表  - 详情
    *getPlanDetail({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(getPlanDetail, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 货件计划列表  - 修改物流方式
    *updateLogistics({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(updateLogistics, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },
    
    // 修改货件详情
    *updateDetails({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(updateDetails, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },
    
    // 核实货件计划详情
    *planVerify({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(planVerify, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 核实货件计划核实按钮
    *planVerifySubmit({ payload, resolve, reject }, { call, put }) {
      console.log(payload, 'ss');
      
      return;
      try {
        const res = yield call(planVerifySubmit, payload);
        if (res.code && res.code === 200) {
          yield put({
            type: 'updatePlanState',
            payload: { id: payload.id },
          });
        }
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 撤销已核实货件
    *untoVerify({ payload, resolve, reject }, { call, put }) {
      try {
        const res = yield call(untoVerify, payload);
        resolve(res);
        if (res.code && res.code === 200) {
          yield put({
            type: 'updateUntoPlan',
            payload: { id: payload.id },
          });
        }
      } catch (error) {
        reject(error);
      }
    },

    // 货件计划核实商品页面
    *planVerifyPageInitData({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(planVerifyPageInitData, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 货件计划核实商品页面
    *planHandlePageInitData({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(planHandlePageInitData, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 已有的shipment列表
    *shipmentList({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(shipmentList, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 关联已有的shipment
    *associatShipment({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(associatShipment, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },

    // 关联已有的shipment
    *createShipment({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(createShipment, payload);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    },
  },

  reducers: {
    // 保存货件计划列表
    savePlanList(state, { payload }) {
      state.planList = payload;
    },

    // 更新货件计划列表的数据
    updatePlanList(state, { payload }) {
      state.planList.forEach((item: planList.IRecord) => {
        if (payload.indexOf(item.id) > -1) {
          item.deleted = false;
        }
      });
    },

    // 保存站点列表
    saveSites(state, { payload }) {
      state.sites = payload;
    },

    // 保存目的仓库列表
    saveWarehouses(state, { payload }) {
      state.warehouses = payload;
    },

    // 核件核实成功后，更新核实状态和更新时间
    updatePlanState(state, { payload }) {
      const temp = state.planList.find((item: planList.IPlanDetail) => item.id === payload.id);
      temp && (
        temp.gmtModified = moment().format('YYYY-MM-DD HH:mm:ss'),
        temp.verifyType = true
      );
    },

    // 更改货件的状态（批量作废）
    updateItemPlan(state, { payload }) {
      state.planList.map(( item: planList.IPlanDetail) => {
        const isExist = payload.includes(item.id);
        if (isExist) {
          item.state = false;
          item.gmtModified = moment().format('YYYY-MM-DD HH:mm:ss');
        }
      });
    },

    // 货件撤销成功后，更改核实状态和更新时间
    updateUntoPlan(state, { payload }) {
      const tempOjb = state.planList.find((item: planList.IPlanDetail) => item.id === payload.id);
      tempOjb && (
        tempOjb.gmtModified = moment().format('YYYY-MM-DD HH:mm:ss'),
        tempOjb.verifyType = false
      );
    },

    // 核实成功后，修改货件列表
    updatePlanItemVerify(state, { payload }) {
      const tempOjb = state.planList.find((item: planList.IPlanDetail) => item.id === payload.id);
      tempOjb && (
        tempOjb.gmtModified = moment().format('YYYY-MM-DD HH:mm:ss'),
        tempOjb.verifyType = true
      );
    },
  },
};

export default planList;

