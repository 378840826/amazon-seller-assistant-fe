import { Effect, Reducer } from 'umi';
import { 
  getCompetingGoods,
  getSearchAsin,
  save,
} from '@/services/competingGoods';
import { isObject } from '@/utils/huang';

export interface ICompetingGoodsModelState {
  initvalue: null | string | CompetingGoods.IInitValues;
  recommends: CompetingGoods.ICompetingOneData[];
  chosens: CompetingGoods.ICompetingOneData[];
}

interface ICompetingGoodsModel {
  namespace: 'competingGoods';
  state: ICompetingGoodsModelState;
  reducers: {
    save: Reducer;
    changeChosens: Reducer;
    delChosenItem: Reducer;
  };
  effects: {
    getCompetingsGoods: Effect;
    getSearchAsin: Effect;
    saveChosens: Effect;
  };
}

const competingGoods: ICompetingGoodsModel = {
  namespace: 'competingGoods',
  state: {
    initvalue: null,
    recommends: [],
    chosens: [],
  },

  reducers: {
    // 初始化值保存
    save(state, { payload }) {
      const { 
        data,
        message: msg,
      } = payload;
      if (data) {
        state.initvalue = data;
        if (data.recommend && Array.isArray(data.recommend)) {
          state.recommends = data.recommend;
        }
  
        if (data.chosen && Array.isArray(data.chosen)) {
          state.chosens = data.chosen;
        }
      } else {
        state.initvalue = msg;
      }
    },

    // 添加竞品
    changeChosens(state, { payload }) {
      // 单个
      if (isObject(payload)) {
        state.chosens.push(payload);
      } else if (Array.isArray(payload)) {
        // 全部添加
        payload.forEach(item => {
          state.chosens.push(item);
        });
      } else {
        console.error('异常类型');
      }
    },

    // 删除竞品
    delChosenItem(state, { index }) {
      // 单个
      if (typeof(index) === 'number') {
        state.chosens.splice(index, 1);
      } else if (index === 'delAll') {
        // 全部删除
        state.chosens = [];
      } else {
        console.error('异常类型');
      }
    },
  },

  effects: {
    // 竞品初始化数据
    *getCompetingsGoods({ payload }, { call, put }) {
      const res = yield call(getCompetingGoods, payload);
      yield put({
        type: 'save',
        payload: res,
      });
    },

    // 搜索ASIN
    *getSearchAsin({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(getSearchAsin, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },

    // 保存
    *saveChosens({ payload, resolve, reject }, { call }) {
      try {
        const res = yield call(save, payload);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    },
  },
};


export default competingGoods;
