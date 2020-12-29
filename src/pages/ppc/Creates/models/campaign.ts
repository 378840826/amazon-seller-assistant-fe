/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-12-31 15:45:15
 */
import { Effect, Reducer } from 'umi';
import {
  getProductList,
  getThiningBrands,
  createCampagin,
  getKeywords,
  getClassifys,
  getProductAsins,
} from '@/services/ppc/createCampaign';
import { IRecord } from '../Campaign/Group/SpAuto';

export interface ICreateGampaignState {
  products: [];
  selectProduct: CampaignCreate.IProductSelect[];
  autoTargetGroupList: IRecord[];
  keywords: CreateCampaign.IKeywords[];
  classifys: CreateCampaign.ISuggestedClassType[];
  saveProducts: [];
}

interface ICreateCampaignModalType {
  namespace: 'createCampagin';
  state: ICreateGampaignState;

  effects: {
    createCampagin: Effect;
    getProductList: Effect;
    getKeywords: Effect;
    getClassifys: Effect;
    getThiningBrands: Effect;
    getProductAsins: Effect;
  };

  reducers: {
    setProduct: Reducer;
    setSelectProduct: Reducer;
    setAutoTargetGroupList: Reducer;
    setKeywords: Reducer;
    setClassifys: Reducer;
    setSaveProducts: Reducer;
  };

}

const campaign: ICreateCampaignModalType = {
  namespace: 'createCampagin',
  state: {
    products: [], // 店铺的商品数据
    selectProduct: [], // 保存已选中的商品列表
    autoTargetGroupList: [], // 自动广告组的按Targeting Group设置竞价数据
    keywords: [], // 手动广告组 保存的关键词
    classifys: [], // 手动广告组 已选的分类(右边表格)
    saveProducts: [], // 手动广告组 分类/商品 保存的商品
  },
  effects: {
    // 创建广告活动
    *createCampagin({ resolve, reject, payload }, { call }) {
      try {
        const res = yield call(createCampagin, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 商品列表
    *getProductList({ payload, resolve, reject }, { call, put }) {
      try {
        const res = yield call(getProductList, payload);
        resolve ? resolve(res) : '';
        yield put({
          type: 'setProduct',
          payload: res,
        });
      } catch (err) {
        reject ? reject(err) : '';
      }
    },

    // 根据商品列表获取关键词(SP) - 推荐关键字列表(SP)
    *getKeywords({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(getKeywords, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 根据商品列表获取建议分类(SP) - 建议分类列表(SP)
    *getClassifys({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(getClassifys, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
    
    // 根据商品列表获取商品(SP) - 获取建议asin(SP)  
    *getProductAsins({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(getProductAsins, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 细化分类获取品牌
    *getThiningBrands({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(getThiningBrands, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },

  reducers: {
    // 修改商品列表
    setProduct(state, { payload }) {
      if (payload.data && payload.data.records) {
        state.products = payload.data.records;
        return;
      }
      state.products = [];
    },

    // 修改选中的商品列表
    setSelectProduct(state, { payload }) {
      state.selectProduct = payload;
    },

    // 修改自动广告组的按Targeting Group设置竞价数据
    setAutoTargetGroupList(state, { payload }) {
      state.autoTargetGroupList = payload;
    },

    // 修改关键词列表的数据
    setKeywords(state, { payload }) {
      state.keywords = payload;
    },

    // 修改已保存的分类
    setClassifys(state, { payload }) {
      state.classifys = payload;
    },

    // 修改已保存的商品数据（右边）
    setSaveProducts(state, { payload }) {
      state.saveProducts = payload;
    },
  },
  
};

export default campaign;
