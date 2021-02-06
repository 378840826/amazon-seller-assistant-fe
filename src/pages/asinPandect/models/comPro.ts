import { 
  cpMsList, 
  cpMsFrequency, 
  cpMsFreUpdate,
  getACList,
  getEcharts,
  updateStatus,
  suggestAsin,
  cpAsin,
} from '@/services/dynamic.ts';
import { IConnectState } from '@/models/connect';
import { ReactText } from 'react';
import { IModelType } from '@/models/connect.d';
import { nTs } from '@/utils/utils';
import { message } from 'antd';
interface IComProType extends IModelType{
  namespace: 'comPro';
  state: IComProState;
}
export interface ISingleItem{
  image: string;
  title: string;
  titleLink: string;
  asin: string;
  price: string;
  reviewAvgStar: string;
  reviewCount: string;
  ranking: string;
}
export interface IComProState{
  customSelected: Array<string>;
  send: API.IParams;
  selectedRows: ReactText[];//已经选中的行
  selectedList: ISingleItem[];//已经选中的- 添加竞品中的数据
  allData: ISingleItem[];//全部返回的- 添加竞品
  filterData: ISingleItem[];//根据搜索筛选过的 - 添加竞品
  tableLoading: boolean;//表格的loading状态- 添加竞品
  errorMsg: string;//表格请求错误时返回的错误信息- 添加竞品
}

export const initial = {
  size: 20,
  current: 1,
  order: '',
  asc: false,
  searchTerms: '',
  // asin: '', //asin自己传入
  switchStatus: 'all',
  acKeywordStatus: 'all',
  deliveryMethod: 'all',
  dateStart: '',
  dateEnd: '',
  scopeMin: '',
  scopeMax: '',
  reviewsCountMin: '',
  reviewsCountMax: '',
  priceMin: '',
  priceMax: '',
  sellerNumMin: '',
  sellerNumMax: '',
  variantNumMin: '',
  variantNumMax: '',
  rankingMin: '',
  rankingMax: '',
};

const ComPro: IComProType = {
  namespace: 'comPro',
  state: {
    customSelected: [
      'monitoringSwitch',
      'updateTime',
      'currentRanking',
      'lastRanking',
      'monitoringNumber',
      'productInfo',
      'brandName',
      'sellerName',
      'price',
      'ranking',
      'reviewAvgStar',
      'reviewCount',
      'usedNewSellNum',
      'variantNum',
      'dateFirstListed',
      'acKeyword',
      'relatedKeywords',
    ],
    send: initial,
    selectedRows: [],
    selectedList: [],
    allData: [],
    filterData: [],
    tableLoading: false,
    errorMsg: '',
  },
  effects: {
    *cpMsList({ payload, callback }, { call }){
      const response = yield call(cpMsList, payload);
      nTs(response);
      callback(response);
    },
    *cpMsFrequency({ payload, callback }, { call }){
      const response = yield call(cpMsFrequency, payload);
      if (response.code === 200){
        callback(response.data.frequency);
      } else {
        message.error(response.msg);
      }
    },
    *cpMsFreUpdate({ payload, callback }, { call }){
      const response = yield call(cpMsFreUpdate, payload);
      if (response.code !== 200){
        message.error(response.message);
        return;
      }
      callback && callback(response);
    },
    *getACList({ payload, callback }, { call }){
      const response = yield call(getACList, payload);
      if (response.code === 200){
        callback(response.data);
      } else {
        message.error(response.msg);
      }
    },
    *getEcharts({ payload, category, callback }, { call }){
      const response = yield call(getEcharts, payload, category);
      nTs(response);
      callback(response);
    },
    *updateStatus({ payload, callback }, { call }){
      const response = yield call(updateStatus, payload);
      callback(response);
    },
    *suggestAsin({ payload }, { call, put }){
      yield put({
        type: 'modifyLoading',
        payload: true,
      });
      const response = yield call(suggestAsin, payload);
      nTs(response);
      if (response.code === 200){
        yield put({
          type: 'updateData',
          payload: {
            allData: response.data,
            filterData: response.data,
            selectedList: [],
            tableLoading: false,
            errorMsg: '',
          },
        });
      } else {
        yield put({
          type: 'updateData',
          payload: {
            allData: [],
            filterData: [],
            selectedList: [],
            tableLoading: false,
            errorMsg: '',
          },
        });
      }
    },
    *addAsin({ payload, callback }, { call, select }){
      let asinList = yield select( (state: IConnectState) => state.comPro.selectedList);
      asinList = asinList.map( (item: ISingleItem) => item.asin);
      const data = {
        data: {
          headersParams: { StoreId: payload.StoreId },
          asin: payload.asin,
          asinList,
        },
      };
      const response = yield call(cpAsin, data);
      if (response.code === 200){
        callback && callback(response);
      } else {
        message.error(response.message);
      }
    },
    *addSelectText({ payload }, { select, put }){
      /* 
      1. asin在all中的就全部找出来，并记录obj[asin] = true,剩下的就push进去
      */
      const state = yield select( (all: IConnectState) => all.comPro);
      console.log('state:', state);
      const selectedAsin = state.selectedList.map((item: ISingleItem) => item.asin);
      const allAsin = state.allData.map( (item: ISingleItem) => item.asin);
      const leftAndAdd = [...new Set([...selectedAsin, ...payload])];
      //不包含在allAsin中的asin
      const leftAsin = leftAndAdd.filter((item: string) => !allAsin.includes(item));
      
      const includeArray = state.allData.filter( (item: ISingleItem) => 
        leftAndAdd.includes(item.asin));
      
      leftAsin.forEach((item: string) => includeArray.push({
        asin: item,
        image: '',
        price: '',
        ranking: '',
        reviewAvgStar: '',
        title: '',
        titleLink: '',
        reviewCount: '',
      }));
      console.log('includeArray:', includeArray);
      yield put({
        type: 'updateSelected',
        payload: includeArray,
      });
    },
  },
  reducers: {
    customSelectedUpdate(state, { payload }){
      state.customSelected = payload;
    },
    updateRows(state, { payload }){
      state.selectedRows = payload;
    },
    updateSend(state, { payload = {} }){
      if (payload.asc){
        payload.asc = payload.asc === 'ascend' ? true : false;
      }
      state.send = { ...state.send, ...payload };
    },
    modifyLoading(state, { payload }){
      state.tableLoading = payload;
    },
    updateData(state, { payload }){
      Object.assign(state, payload);
    },
    updateSelected(state, { payload }){
      state.selectedList = payload;
    },
    updateFilter(state, { payload }){
      state.filterData = payload;
    },
  },
};
export default ComPro;
