import { IConnectState, IModelType } from '@/models/connect';
import { AssignmentKeyName } from '@/pages/StoreDetail/utils';
import { colors } from '@/pages/StoreDetail/config';
import {
  queryBaseData,
  queryMainData,
  queryMainPolyline,
  queryMainTable,
  queryB2bData,
  queryB2bPolyline,
  queryB2bTable,
  queryCostData,
  queryCostPolyline,
  queryCostTable,
  queryReturnAnalysis,
  queryAdData,
  queryAdPolyline,
  queryAdTable,
  queryAdChannel,
  queryProductLineHistogram,
  queryProductLineTable,
  queryRegional,
} from '@/services/storeDetail';
import { storage } from '@/utils/utils';


export interface IStoreDetailModelState {
  showCurrency: string;
  searchParams: {
    currency: 'rmb' | 'original';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  customBlock: {
    [key: string]: boolean;
  };
  baseData: {
    // updateTime: string;
    skuInfoTofu: {
      [key: string]: number;
    };
    asinInfoTofu: {
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
      [key: string]: StoreDetail.IPolylineData;
    };
    table: {
      records: StoreDetail.IData[];
      total: number;
      size: number;
      current: number;
    };
  };
  b2bData: {
    tofuChecked: string[];
    tofu: {
      [key: string]: number;
    };
    colors: string[];
    polyline: {
      [key: string]: StoreDetail.IPolylineData;
    };
    table: {
      records: StoreDetail.IData[];
      total: number;
      size: number;
      current: number;
    };
  };
  costData: {
    tofuChecked: {
      [key: string]: {
        checked: boolean;
        color: string;
      };
    };
    tofu: {
      [key: string]: number;
    };
    colors: string[];
    polyline: {
      [key: string]: StoreDetail.IPolylineData;
    };
    table: {
      records: StoreDetail.IData[];
      total: number;
      size: number;
      current: number;
    };
  };
  returnAnalysisData: {
    tofuChecked: {
      [key: string]: {
        checked: boolean;
        color: string;
      };
    };
    tofu: {
      [key: string]: number;
    };
    colors: string[];
    polyline: {
      thisPeriod: StoreDetail.IPolylineData;
    };
    table: {
      records: StoreDetail.IData[];
    };
  };
  adData: {
    tofuChecked: string[];
    tofu: {
      [key: string]: number;
    };
    colors: string[];
    polyline: {
      [key: string]: StoreDetail.IPolylineData;
    };
    table: {
      records: StoreDetail.IData[];
      total: number;
      size: number;
      current: number;
    };
    channel: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }[];
  };
  productLineData: {
    colors: string[];
    histogram: {
      [key: string]: {
        [key: string]: {
          tag: string;
          value: number;
          proportion: number;
        }[];
      };
    };
    pie: {
      [key: string]: number;
    };
    table: {
      records: StoreDetail.IData[];
      total: number;
      size: number;
      current: number;
    };
  };
  regionalData: {
    state: string;
    quantity: number;
    sales: number;
  }[];
}

interface IStoreDetailModelType extends IModelType {
  namespace: 'storeDetail';
  state: IStoreDetailModelState;
}

// 豆腐块选中保存在 localStorage 中的 key
const tofuCheckedStoreKeys = {
  main: 'storeDetailMainTofuChecked',
  b2b: 'storeDetailB2bTofuChecked',
  cost: 'storeDetailCostTofuChecked',
  return: 'storeDetailReturnAnalysisTofuChecked',
  ad: 'storeDetailAdTofuChecked',
};

const StoreDetailModel: IStoreDetailModelType = {
  namespace: 'storeDetail',

  state: {
    // ￥ 或站点货币符号, 默认原币种
    showCurrency: storage.get('currentShop').currency,
    // 查询参数
    searchParams: {
      // 默认原币种
      currency: 'original',
    },
    // 基础数据
    baseData: {
      // updateTime: '正在查询...',
      skuInfoTofu: {},
      asinInfoTofu: {},
    },
    mainData: {
      tofuChecked: storage.get(tofuCheckedStoreKeys.main) || ['总销售额', '总订单量'],
      colors,
      tofu: {},
      polyline: { thisPeriod: { polylineX: [] } },
      table: {
        records: [],
        total: -1,
        size: 20,
        current: 1,
      },
    },
    b2bData: {
      tofuChecked: storage.get(tofuCheckedStoreKeys.b2b) || ['B2B销售额', 'B2B订单量'],
      colors,
      tofu: {},
      polyline: { thisPeriod: { polylineX: [] } },
      table: {
        records: [],
        total: -1,
        size: 20,
        current: 1,
      },
    },
    costData: {
      tofuChecked: storage.get(tofuCheckedStoreKeys.cost) || {
        '毛利': {
          checked: true,
          color: colors[0],
        },
        '毛利率': {
          checked: true,
          color: colors[1],
        },
      },
      colors,
      tofu: {},
      polyline: { thisPeriod: { polylineX: [] } },
      table: {
        records: [],
        total: -1,
        size: 20,
        current: 1,
      },
    },
    returnAnalysisData: {
      tofuChecked: storage.get(tofuCheckedStoreKeys.return) || {
        '退货量': {
          checked: true,
          color: colors[0],
        },
        '退货率': {
          checked: true,
          color: colors[1],
        },
      },
      colors,
      tofu: {},
      polyline: { thisPeriod: { polylineX: [] } },
      table: {
        records: [],
      },
    },
    adData: {
      tofuChecked: storage.get(tofuCheckedStoreKeys.ad) || ['广告销售额', '自然销售额'],
      colors,
      tofu: {},
      polyline: { thisPeriod: { polylineX: [] } },
      table: {
        records: [],
        total: -1,
        size: 20,
        current: 1,
      },
      channel: [],
    },
    productLineData: {
      colors,
      histogram: {},
      pie: {},
      table: {
        records: [],
        total: -1,
        size: 20,
        current: 1,
      },
    },
    regionalData: [{
      state: '',
      quantity: 0,
      sales: 0,
    }],
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
      'B2B销售额占比': true,
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
      '毛利': true,
      '毛利率': true,
    },
  },

  effects: {
    // 全局-获取基础数据
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

    // 整体表现
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
      }
      callback && callback(res.code, res.message);
    },

    // 整体表现-折线图
    *fetchMainPolyline({ payload, callback }, { call, put, select }) {
      const tofuChecked = yield select(
        (state: IConnectState) => state.storeDetail.mainData.tofuChecked
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
      const res = yield call(queryMainPolyline, params);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveMainPolyline',
          payload: data.lineChart,
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

    // B2B
    // B2B-豆腐块
    *fetchB2bTofu({ payload, callback }, { call, put, select }) {
      const oldParams = yield select((state: IConnectState) => state.storeDetail.searchParams);
      const newParams = Object.assign({}, oldParams, payload);
      const res = yield call(queryB2bData, newParams);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveB2bTofu',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    // B2B-折线图
    *fetchB2bPolyline({ payload, callback }, { call, put, select }) {
      const tofuChecked = yield select(
        (state: IConnectState) => state.storeDetail.b2bData.tofuChecked
      );
      const attributes = [
        AssignmentKeyName.getkey(tofuChecked[0]),
        AssignmentKeyName.getkey(tofuChecked[1]),
      ];
      const params = { attributes, ...payload };
      const res = yield call(queryB2bPolyline, params);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveB2bPolyline',
          payload: data.lineChart,
        });
      }
      callback && callback(res.code, res.message);
    },

    // B2B-表格
    *fetchB2bTable({ payload, callback }, { call, put }) {
      const res = yield call(queryB2bTable, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveB2bTable',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 费用成本
    // 费用成本-豆腐块
    *fetchCostTofu({ payload, callback }, { call, put, select }) {
      const oldParams = yield select((state: IConnectState) => state.storeDetail.searchParams);
      const newParams = Object.assign({}, oldParams, payload);
      const res = yield call(queryCostData, newParams);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveCostTofu',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 费用成本-折线图
    *fetchCostPolyline({ payload, callback }, { call, put, select }) {
      const tofuChecked = yield select(
        (state: IConnectState) => state.storeDetail.costData.tofuChecked
      );
      const attributes: string[] = [];
      Object.keys(tofuChecked).forEach(
        name => tofuChecked[name].checked && attributes.push(AssignmentKeyName.getkey(name))
      );
      const params = { attributes, ...payload };
      const res = yield call(queryCostPolyline, params);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveCostPolyline',
          payload: data.lineChart,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 费用成本-表格
    *fetchCostTable({ payload, callback }, { call, put }) {
      const res = yield call(queryCostTable, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveCostTable',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },


    // 退货分析
    // 退货分析-全部数据
    *fetchReturnAnalysis({ payload, callback }, { call, put, select }) {
      const oldParams = yield select((state: IConnectState) => state.storeDetail.searchParams);
      const newParams = Object.assign({}, oldParams, payload);
      // 只有两个折线数据，且所有数据都输这一个接口，默认请求全部折线数据，切换豆腐块时无需再请求多余的数据
      const attributes = [
        AssignmentKeyName.getkey('退货率'),
        AssignmentKeyName.getkey('退货量'),
      ];
      const params = { attributes, ...newParams };
      const res = yield call(queryReturnAnalysis, params);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveReturnAnalysis',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },


    // 广告表现
    // 广告表现-豆腐块
    *fetchAdTofu({ payload, callback }, { call, put, select }) {
      const oldParams = yield select((state: IConnectState) => state.storeDetail.searchParams);
      const newParams = Object.assign({}, oldParams, payload);
      const res = yield call(queryAdData, newParams);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveAdTofu',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告表现-折线图
    *fetchAdPolyline({ payload, callback }, { call, put, select }) {
      const tofuChecked = yield select(
        (state: IConnectState) => state.storeDetail.adData.tofuChecked
      );
      const attributes = [
        AssignmentKeyName.getkey(tofuChecked[0]),
        AssignmentKeyName.getkey(tofuChecked[1]),
      ];
      const params = { attributes, ...payload };
      const res = yield call(queryAdPolyline, params);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveAdPolyline',
          payload: data.lineChart,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告表现-表格
    *fetchAdTable({ payload, callback }, { call, put }) {
      const res = yield call(queryAdTable, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveAdTable',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告表现-渠道表现
    *fetchAdChannel({ payload, callback }, { call, put }) {
      const res = yield call(queryAdChannel, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveAdChannel',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    
    // 产品线
    // 产品线-柱状图
    *fetchProductLineHistogram({ payload, callback }, { call, put }) {
      const res = yield call(queryProductLineHistogram, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveProductLineHistogram',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 产品线-表格
    *fetchProductLineTable({ payload, callback }, { call, put }) {
      const res = yield call(queryProductLineTable, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveProductLineTable',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },


    // 地区销售
    // 地区销售
    *fetchRegional({ payload, callback }, { call, put }) {
      const res = yield call(queryRegional, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveRegional',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    // 全局-保存基础数据
    saveBaseData(state, { payload }) {
      state.baseData = { ...payload };
    },

    // 全局-更新查询参数
    updateSearchParams(state, { payload }) {
      state.searchParams = { ...state.searchParams, ...payload };
    },

    // 全局-更新自定义列豆腐块
    updateCustomBlock(state, { payload }) {
      state.customBlock = Object.assign(state.customBlock, payload);
    },

    // 全局-更新货币符号
    updateShowCurrency(state, { payload }) {
      const { originalCurrency, currencyType } = payload;
      const dict = {
        rmb: '￥',
        original: originalCurrency,
      };
      state.showCurrency = dict[currencyType];
    },

    // 整体表现
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
      storage.set(tofuCheckedStoreKeys.main, arr);
    },

    // 整体表现-折线图
    saveMainPolyline(state, { payload }) {
      state.mainData.polyline = { ...payload };
    },

    // 整体表现-表格
    saveMainTable(state, { payload }) {
      state.mainData.table = { ...payload };
    },
    
    // B2B
    // B2B-豆腐块
    saveB2bTofu(state, { payload }) {
      state.b2bData.tofu = { ...payload };
    },

    // B2B-折线图
    saveB2bPolyline(state, { payload }) {
      state.b2bData.polyline = { ...payload };
    },

    // B2B-表格
    saveB2bTable(state, { payload }) {
      state.b2bData.table = { ...payload };
    },

    // B2B-切换豆腐块选中
    updateB2bTofuChecked(state, { payload }) {
      const arr = [...state.b2bData.tofuChecked];
      // 删除前面的，并在后面添加新的
      arr.shift();
      arr.push(payload);
      state.b2bData.tofuChecked = arr;
      // 颜色跟随，只有两个颜色，所以调换位置就行
      const colors = [...state.b2bData.colors];
      [colors[0], colors[1]] = [colors[1], colors[0]];
      state.b2bData.colors = colors;
      // 本地保存
      storage.set(tofuCheckedStoreKeys.b2b, arr);
    },
  
    // 费用成本
    // 费用成本-豆腐块
    saveCostTofu(state, { payload }) {
      state.costData.tofu = { ...payload };
    },

    // 费用成本-折线图
    saveCostPolyline(state, { payload }) {
      state.costData.polyline = { ...payload };
    },

    // 费用成本-表格
    saveCostTable(state, { payload }) {
      state.costData.table = { ...payload };
    },

    // 费用成本-切换豆腐块选中
    updateCostTofuChecked(state, { payload }) {
      // 当做开关逻辑处理
      const o = JSON.parse(JSON.stringify(state.costData.tofuChecked));
      o[payload.name].checked = payload.checked;
      // 阻止全部为 false 的情况
      const allFalse = !(Object.keys(o).some(key => o[key].checked));
      if (!allFalse) {
        state.costData.tofuChecked = o;
        // 本地保存
        storage.set(tofuCheckedStoreKeys.cost, o);
      }
    },

    // 退货分析
    // 退货分析-全部数据
    saveReturnAnalysis(state, { payload }) {
      const { tofuBlocData, lineChart, returnReasons } = payload;
      // 豆腐块
      state.returnAnalysisData.tofu = tofuBlocData;
      // 折线图
      state.returnAnalysisData.polyline = lineChart;
      // 表格(饼图)
      state.returnAnalysisData.table.records = returnReasons;
    },

    // 退货分析-切换豆腐块选中
    updateReturnTofuChecked(state, { payload }) {
      // 当做开关逻辑处理
      const o = JSON.parse(JSON.stringify(state.returnAnalysisData.tofuChecked));
      o[payload.name].checked = payload.checked;
      // 阻止全部为 false 的情况
      const allFalse = !(Object.keys(o).some(key => o[key].checked));
      if (!allFalse) {
        state.returnAnalysisData.tofuChecked = o;
        // 本地保存
        storage.set(tofuCheckedStoreKeys.return, o);
      }
    },

    // 广告表现
    // 广告表现-豆腐块
    saveAdTofu(state, { payload }) {
      state.adData.tofu = { ...payload };
    },

    // 广告表现-折线图
    saveAdPolyline(state, { payload }) {
      state.adData.polyline = { ...payload };
    },

    // 广告表现-表格
    saveAdTable(state, { payload }) {
      state.adData.table = { ...payload };
    },

    // 广告表现-渠道表现
    saveAdChannel(state, { payload }) {
      state.adData.channel = [...payload];
    },

    // 广告表现-切换豆腐块选中
    updateAdTofuChecked(state, { payload }) {
      const arr = [...state.adData.tofuChecked];
      // 删除前面的，并在后面添加新的
      arr.shift();
      arr.push(payload);
      state.adData.tofuChecked = arr;
      // 颜色跟随，只有两个颜色，所以调换位置就行
      const colors = [...state.adData.colors];
      [colors[0], colors[1]] = [colors[1], colors[0]];
      state.adData.colors = colors;
      // 本地保存
      storage.set(tofuCheckedStoreKeys.ad, arr);
    },


    // 产品线
    // 产品线-柱状图
    saveProductLineHistogram(state, { payload }) {
      state.productLineData.histogram = { ...payload };
    },

    // 产品线-表格
    saveProductLineTable(state, { payload }) {
      state.productLineData.table = { ...payload };
    },


    // 地区销售
    // 地区销售
    saveRegional(state, { payload }) {
      state.regionalData = payload;
    },
  },
};

export default StoreDetailModel;
