/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-18 17:55:38
 * @LastEditTime: 2021-04-23 15:06:58
 * 
 * Shipment相关
 */
import { Effect, Reducer } from 'umi';
import { 
  uploadLogisticisInfo,
  uploadPackageFile,
  updateShipment,
  updateShipmentItem,
  generateInvoice,
  getShipmentList,
  getRefereceid,
  getShipmentDetails,
} from '@/services/fba/shipment';


export interface IShipmentState {
  shipmentList: Shipment.IShipmentList[];
}

interface IShipmentModel {
  namespace: 'shipment';
  state: IShipmentState;
  effects: {
    getShipmentList: Effect;
    updateShipment: Effect;
    updateShipmentItem: Effect;
    generateInvoice: Effect;
    getRefereceid: Effect;
    getShipmentDetails: Effect;
    uploadLogisticisInfo: Effect;
    uploadPackageFile: Effect;
  };
  reducers: {
    saveShipmentList: Reducer;
  };
}

const chipment: IShipmentModel = {
  namespace: 'shipment',
  state: {
    shipmentList: [],
  },
  effects: {
    // shipment列表
    *getShipmentList({ payload, reject, resolve }, { call, put }) {
      try {
        const res = yield call(getShipmentList, payload);
        resolve(res);
        yield put({
          type: 'saveShipmentList',
          payload: res.code === 200 ? res.data?.page?.records : [],
        });
      } catch (err) {
        reject(err);
      }
    },

    // 修改shipment - 批量标记出运或取消
    *getRefereceid({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(getRefereceid, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 修改shipment - 批量标记出运或取消
    *updateShipment({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(updateShipment, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 修改shipment - 修改名称/物流方式/商品
    *updateShipmentItem({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(updateShipmentItem, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 生成发货单
    *generateInvoice({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(generateInvoice, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // shipment详情
    *getShipmentDetails({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(getShipmentDetails, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 上传物流信息
    *uploadLogisticisInfo({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(uploadLogisticisInfo, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 上传装箱清单文件
    *uploadPackageFile({ payload, reject, resolve }, { call }) {
      try {
        const res = yield call(uploadPackageFile, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },

  reducers: {
    // 保存shipment列表
    saveShipmentList(state, { payload }) {
      state.shipmentList = payload;
    },
  },
};

export default chipment;
