import { message } from 'antd';
import { IModelType } from './connect.d';
import { nTs } from '@/utils/utils';
import {
  getSummaryList,
  getMonitoringSettingsList,
  getMonitorSettingsSearch,
  addAsin,
  setSwitch,
  getDynamicList,
  getPolyLineList,
  updateRemarks,
} from '@/services/dynamic';
export interface IDynamicModelType extends IModelType{
  namespace: 'dynamic';
}
const DynamicModel: IDynamicModelType = {
  namespace: 'dynamic',
  effects: {
    *getSummaryList({ payload, callback }, { call }){
      const response = yield call(getSummaryList, payload);
      nTs(response);
      if (response.code === 200){
        response.data.records.map((item: API.IParams, index: number) => {
          item.key = index;
        });
      }
      callback && callback(response);
    },
    *getMonitorSettingsSearch({ payload, callback }, { call }){
      const response = yield call(getMonitorSettingsSearch, payload);
      nTs(response);
      if (response.code === 200){
        callback && callback(response.data);
      }
      
    },
    *getMonitoringSettingsList({ payload, callback }, { call }){
      const response = yield call(getMonitoringSettingsList, payload);
      nTs(response);
      if (response.code === 200){
        response.data.records.map((item: API.IParams, index: number) => {
          item.key = index;
        });
      }
      callback && callback(response);
    },
    *setSwitch({ payload, callback }, { call }){
      const response = yield call(setSwitch, payload);
      if (response.code === 200){
        callback && callback();
      } else {
        message.error(response.message);
      }
    },
    *addAsin({ payload, callback }, { call }){
      const response = yield call(addAsin, payload);
      if (response.code === 200){
        callback && callback(response);
      } else {
        message.error(response.message);
      }
    },
    *getDynamicList({ payload, callback }, { call }){
      const response = yield call(getDynamicList, payload);
      if (response.code === 200){
        response.data.records.map((item: API.IParams, index: number) => {
          item.key = index;
        });
      }
      callback && callback(response);
    },
    *getPolyLineList({ payload, callback }, { call }){
      const response = yield call(getPolyLineList, payload);
      callback && callback(response);
    },
    *updateRemarks({ payload, callback }, { call }){
      const response = yield call(updateRemarks, payload);
      if (response.code === 200){
        callback && callback(response);
      } else {
        message.error(response.message);
      }
    },
  },
};
export default DynamicModel;
