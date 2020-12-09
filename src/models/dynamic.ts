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
  msGetList,
  msUpdateStatus,
  msFrequency,
  msFrequencyUpdate,
  msGetAsinList,
  msAsinUpdate,
  msGetNaturalData,
  msGetAd,
  msSearchProduct,
  msSearchKeyword,
  msMonitorAdd,
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
        response.data.page.records.map((item: API.IParams, index: number) => {
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
    //=======排名搜索====
    *msGetList({ payload, callback }, { call }){
      const response = yield call(msGetList, payload);
      nTs(response);
      if (response.code === 200){
        const asc = response.data.page.asc;
        response.data.page.asc = asc ? 'ascend' : 'descend';
      }
      callback && callback(response);
    },
    *msFrequency({ payload, callback }, { call }){
      const response = yield call(msFrequency, payload);
      if (response.code === 200){
        callback && callback(response.data.frequency);
      }
    },
    *msFrequencyUpdate({ payload, callback }, { call }){
      const response = yield call(msFrequencyUpdate, payload);
      callback && callback(response);
    },
    *msGetAsinList({ payload, callback }, { call }){
      const response = yield call(msGetAsinList, payload);
      callback && callback(response);
    },
    *msAsinUpdate({ payload, callback }, { call }){
      const response = yield call(msAsinUpdate, payload);
      callback && callback(response);
      if (response.code !== 200){
        message.error(response.message);
      }
    },
    *msGetNaturalData({ payload, callback }, { call }){
      const response = yield call(msGetNaturalData, payload);

      if (response.code === 200){
        const scatter: API.IParams[] = [];
        const data = response.data.filter((item: API.IParams) => item[3] === true);
       
        data.map((item: API.IParams) => {
          scatter.push({ name: 'AC', value: item });
        });
        response.scatter = scatter;
      }
      callback && callback(response);
    },
    *msGetAd({ payload, callback }, { call }){
      const response = yield call(msGetAd, payload);
      callback && callback(response);
    },
    *msUpdateStatus({ payload, callback }, { call }){
      const response = yield call(msUpdateStatus, payload);
      callback && callback(response);
    },
    *msSearchProduct({ payload, callback }, { call }){
      const response = yield call(msSearchProduct, payload);
      if (response.code === 200){
        response.data.map((item: API.IParams, index: number) => {
          item.key = index;
        });
      }
      callback && callback(response);
    },
    *msSearchKeyword({ payload, callback }, { call }){
      const response = yield call(msSearchKeyword, payload);
      if (response.code === 200){
        const data: {title: string}[] = [];
        response.data.keywordList.map( (item: string) => {
          data.push({ title: item });
        });
        response.data = data;
      }
      callback && callback(response);
    },
    *msMonitorAdd({ payload, callback }, { call }){
      const response = yield call(msMonitorAdd, payload);
      if (response.code === 200){
        message.success(response.message);
        callback && callback();
      } else {
        message.error(response.message);
      }
    },
  },
};
export default DynamicModel;
