import { IConnectState, IModelType } from '@/models/connect';
import { AssignmentKeyName } from '@/pages/StoreDetail/utils';
import {
  queryBaseData,
  queryMainData,
  queryMainPolyline,
  queryMainTable,
} from '@/services/storeDetail';
import { storage } from '@/utils/utils';


export interface IStoreDetailModelState {
  searchParams: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  customBlock: {
    [key: string]: boolean;
  };
  baseData: {
    updateTime: string;
    sku: {
      [key: string]: number;
    };
    asin: {
      [key: string]: number;
    };
  };
  mainData: {
    tofuChecked: string[];
    tofu: {
      [key: string]: number;
    };
    colors: string[];
    polyline: {
      // [key: string]: { value: number; time: string }[];
      本期: StoreDetail.IPolylineData;
      上年同期: StoreDetail.IPolylineData;
      上月同期: StoreDetail.IPolylineData;
      上周同期: StoreDetail.IPolylineData;
    };
    dataOriginSelectorVisible: boolean;
    table: {
      records: StoreDetail.IData[];
      total: number;
      size: number;
      current: number;
    };
  };
}

interface IStoreDetailModelType extends IModelType {
  namespace: 'storeDetail';
  state: IStoreDetailModelState;
}

const StoreDetailModel: IStoreDetailModelType = {
  namespace: 'storeDetail',

  state: {
    // 查询参数
    searchParams: {
      currency: '0',
    },
    // 基础数据
    baseData: {
      updateTime: '正在查询...',
      sku: {},
      asin: {},
    },
    mainData: {
      tofuChecked: storage.get('storeDetailMainTofuChecked') || ['总销售额', '总订单量'],
      colors: ['#49B5FF', '#FFC175'],
      tofu: {},
      polyline: {
        本期: {},
        上年同期: {},
        上月同期: {},
        上周同期: {},
      },
      // 数据源选择器显示
      dataOriginSelectorVisible: true,
      table: {
        records: [],
        total: -1,
        size: 20,
        current: 1,
      },
    },
    // 自定义豆腐块
    customBlock: storage.get('storeDetailCustomBlock') || {
      'SKU总数': true,
      'Active-SKU': true,
      'Inactive-SKU': true,
      'FBA-active-SKU': true,
      'FBA-Inactive-SKU': true,
      'FBM-active-SKU': true,
      'FBM-Inactive-SKU': true,
      'ASIN总数': true,
      'Buybox-ASIN': true,
      '非Buybox-ASIN': true,
      '动销率': true,
      '在售': true,
      '上新': true,
      '总销售额': true,
      '总订单量': true,
      '总销量': true,
      'undefined': true,
      '销量/订单量': true,
      '平均售价': true,
      '平均客单价': true,
      '优惠订单': true,
      '关联销售': true,
      'PageView': true,
      'Session': true,
      'PageView/Session': true,
      '转化率': true,
      '退货量': true,
      '退货率': true,
      'B2B销售额': true,
      'B2B订单量': true,
      'B2B销量': true,
      'B2B销量/订单量': true,
      'B2B平均售价': true,
      'B2B平均客单价': true,
      '广告销售额': true,
      '自然销售额': true,
      '广告订单量': true,
      '自然订单量': true,
      'CPC': true,
      'CPA': true,
      'CPM': true,
      'Spend': true,
      'ACoS': true,
      '综合ACoS': true,
      'RoAS': true,
      '综合RoAS': true,
      'Impressions': true,
      'Clicks': true,
      'CTR': true,
      '广告转化率': true,
    },
  },

  effects: {
    // 获取基础数据
    *fetchBaseData({ payload, callback }, { call, put, select }) {
      const oldParams = yield select((state: IConnectState) => state.storeDetail.searchParams);
      const newParams = Object.assign({}, oldParams, payload);
      const res = yield call(queryBaseData, newParams);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveBaseData',
          payload: data,
        });
        // 更新查询参数
        yield put({
          type: 'updateSearchParams',
          payload,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 整体表现-豆腐块
    *fetchMainTofu({ payload, callback }, { call, put, select }) {
      const oldParams = yield select((state: IConnectState) => state.storeDetail.searchParams);
      const newParams = Object.assign({}, oldParams, payload);
      const res = yield call(queryMainData, newParams);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveMainTofu',
          payload: data,
        });
        // // 更新查询参数
        // yield put({
        //   type: 'updateSearchParams',
        //   payload,
        // });
      }
      callback && callback(res.code, res.message);
    },

    // 整体表现-折线图
    *fetchMainPolyline({ payload, callback }, { call, put, select }) {
      const tofuChecked = yield select(
        (state: IConnectState) => state.storeDetail.mainData.tofuChecked
      );
      const dispAttribute = [
        AssignmentKeyName.getkey(tofuChecked[0]),
        AssignmentKeyName.getkey(tofuChecked[1]),
      ];
      // const dispAttribute = [...tofuChecked];
      const params = { dispAttribute, ...payload };
      const res = yield call(queryMainPolyline, params);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveMainPolyline',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 整体表现-表格
    *fetchMainTable({ payload, callback }, { call, put }) {
      const res = yield call(queryMainTable, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveMainTable',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    // 保存基础数据
    saveBaseData(state, { payload }) {
      state.baseData = { ...payload };
    },

    // 更新查询参数
    updateSearchParams(state, { payload }) {
      state.searchParams = { ...state.searchParams, ...payload };
    },

    // 更新自定义列豆腐块
    updateCustomBlock(state, { payload }) {
      state.customBlock = Object.assign(state.customBlock, payload);
    },

    // 整体表现-豆腐块
    saveMainTofu(state, { payload }) {
      state.mainData.tofu = { ...payload };
    },

    // 整体表现-切换豆腐块选中
    updateMainTofuChecked(state, { payload }) {
      const arr = [...state.mainData.tofuChecked];
      // 删除前面的，并在后面添加新的
      arr.shift();
      arr.push(payload);
      state.mainData.tofuChecked = arr;
      // 颜色跟随，只有两个颜色，所以调换位置就行
      const colors = [...state.mainData.colors];
      [colors[0], colors[1]] = [colors[1], colors[0]];
      state.mainData.colors = colors;
      // 本地保存
      storage.set('storeDetailMainTofuChecked', arr);
    },

    // 整体表现-折线图
    saveMainPolyline(state, { payload }) {
      state.mainData.polyline = { ...payload };
    },

    // 整体表现-切换显示数据源选择器
    changeDataOriginSelectorVisible(state, { payload }) {
      state.mainData.polyline.dataOriginSelectorVisible = payload;
    },

    // 整体表现-表格
    saveMainTable(state, { payload }) {
      state.mainData.table = { ...payload };
    },
    
  },
};

export default StoreDetailModel;
