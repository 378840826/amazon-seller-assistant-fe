/**
 * 销售大盘
 */
import { IConnectState, IModelType } from '@/models/connect';
import { colors } from '@/pages/SalesOverview/config';
import { AssignmentKeyName } from '@/pages/SalesOverview/utils';
import { queryBaseAndTofu, queryChartsData } from '@/services/salesOverview';
import { storage } from '@/utils/utils';

// 当个站点的地图柱状图数据
export interface IMapSiteData {
  marketplace: API.Site;
  totalSales: number;
  totalOrderQuantity: number;
  totalSalesQuantity: number;
  adSales: number;
  adOrderQuantity: number;
  adSpend: number;
}

export interface ISalesOverviewModelState {
  searchParams: {
    currency: 'rmb' | 'usd';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  tofuChecked: string[];
  tofu: {
    [key: string]: number;
  };
  colors: string[];
  /** 汇率 */
  currencyRates: {
    currency: string;
    name: string;
    rate: number;
    updatetime: string;
  }[];
  polyline: {
    [key: string]: StoreDetail.IPolylineData;
  };
  map: IMapSiteData[];
  /** 当前时间 */
  currentTime: number;
  /** 更新时间 */
  updateTime: string;
}

interface ISalesOverviewModelType extends IModelType {
  namespace: 'salesOverview';
  state: ISalesOverviewModelState;
}

// 豆腐块选中保存在 localStorage 中的 key
const tofuCheckedStoreKeys = 'salesOverviewTofuChecked';

const SalesOverviewModel: ISalesOverviewModelType = {
  namespace: 'salesOverview',

  state: {
    searchParams: {
      currency: 'rmb',
    },
    tofuChecked: storage.get(tofuCheckedStoreKeys) || ['总销售额', '总订单量'],
    tofu: {},
    colors: colors,
    currencyRates: [],
    currentTime: 0,
    updateTime: '正在查询...',
    polyline: { thisPeriod: { polylineX: [] } },
    map: [],
  },

  effects: {
    // 豆腐块和汇率等数据
    *fetchBaseAndTofu({ payload, callback }, { call, put, select }) {
      const oldParams = yield select((state: IConnectState) => state.salesOverview.searchParams);
      const newParams = Object.assign({}, oldParams, payload);
      const res = yield call(queryBaseAndTofu, newParams);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveBaseAndTofu',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 折线图和地图
    *fetchPolylineAndMap({ payload, callback }, { call, put, select }) {
      const tofuChecked = yield select(
        (state: IConnectState) => state.salesOverview.tofuChecked
      );
      // 选中的豆腐块
      const attributes = [
        AssignmentKeyName.getkey(tofuChecked[0]),
        AssignmentKeyName.getkey(tofuChecked[1]),
      ];
      const params = { attributes, ...payload };
      // 根据后端要求，数据源选择 fba fbm b2b 时，修改 attributes 中的[总销售额 总订单量 总销量]字段
      const { dataOrigin } = payload;
      if (dataOrigin) {
        const transformKeys = ['totalSales', 'totalOrderQuantity', 'totalSalesQuantity'];
        params.attributes = attributes.map(s => {
          return transformKeys.includes(s) ? s.replace('total', dataOrigin) : s;
        });
      }
      const res = yield call(queryChartsData, params);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'savePolylineAndMap',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    // 更新查询参数
    updateSearchParams(state, { payload }) {
      state.searchParams = { ...state.searchParams, ...payload };
    },
  
    // 豆腐块和汇率等数据
    saveBaseAndTofu(state, { payload }) {
      state.tofu = { ...payload.dataTofuCubes };
      state.currencyRates = [...payload.currencyRates];
      state.currentTime = payload.currentTime;
      state.updateTime = payload.updateTime;
    },

    // // 更新当前时间
    // updateCurrentTime(state, { payload }) {
    //   state.currentTime = payload;
    // },

    // 折线图和地图
    savePolylineAndMap(state, { payload }) {
      state.polyline = { ...payload.lineChart };
      state.map = [...payload.mapHistogram];
    },

    // 切换豆腐块选中
    updateTofuChecked(state, { payload }) {
      // console.log('state', JSON.parse(JSON.stringify(state)));
      const arr = [...state.tofuChecked];
      // 删除前面的，并在后面添加新的
      arr.shift();
      arr.push(payload);
      state.tofuChecked = arr;
      // 颜色跟随，只有两个颜色，所以调换位置就行
      const colors = [...state.colors];
      [colors[0], colors[1]] = [colors[1], colors[0]];
      state.colors = colors;
      // 本地保存
      storage.set(tofuCheckedStoreKeys, arr);
    },
  },
};

export default SalesOverviewModel;
