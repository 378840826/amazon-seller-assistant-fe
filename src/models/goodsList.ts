import { IModelType, IConnectState } from '@/models/connect';
import {
  queryGoodsList,
  getShopGroups,
  getShopRules,
  updateAdjustSwitch,
  updatePriceFast,
  updateGoodsPrice,
  updateGoods,
  updateBatchGoods,
  updateGroupName,
  deleteGroup,
  addGroup,
  updateCycle,
  getCycle,
  getErrorReport,
} from '@/services/goodsList';
import { storage } from '@/utils/utils';

export type Order = 'descend' | 'ascend' | null | undefined;
export type ParamsValue = string | number | boolean | undefined;

export interface IRule {
  id: string;
  name: string;
}

export interface IGoodsListModelState {
  goods: {
    total: number;
    records: API.IGoods[];
  };
  searchParams: {
    order: Order;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
    filtrateParams: {
      [key: string]: ParamsValue;
    };
  groups: API.IGroup[];
  rules: IRule[];
  customCols: {
    [key: string]: boolean;
  };
  checkedGoodsIds: string[];
  tableLoading: boolean;
  cycle: string;
  errorReport: {
    total: number;
    size: number;
    current: number;
    records: API.IErrorReport[];
  };
}

interface IGoodsListModelType extends IModelType {
  namespace: 'goodsList';
  state: IGoodsListModelState;
}

const GoodsListModel: IGoodsListModelType = {
  namespace: 'goodsList',

  state: {
    // 商品列表
    goods: {
      total: 0,
      records: [],
    },
    // 查询参数
    searchParams: {
      order: null,
      current: 1,
      size: 20,
    },
    // 筛选参数
    filtrateParams: {
      groupId: '',
      ruleId: '',
    },
    // 全部分组
    groups: [],
    // 全部调价规则
    rules: [],
    // 自定义列
    customCols: storage.get('goodsListCustomCols') || {
      group: true,
      title: true,
      asin: true,
      tag: true,
      usedNewSellNum: true,
      isBuyBox: true,
      parentAsin: true,
      sku: true,
      openDate: true,
      fulfillmentChannel: true,
      listingStatus: true,
      sellable: true,
      sellableDays: true,
      inbound: true,
      price: true,
      postage: true,
      commission: true,
      fbaFee: true,
      cost: true,
      freight: true,
      profit: true,
      profitMargin: true,
      dayOrder7Count: true,
      dayOrder7Ratio: true,
      dayOrder30Count: true,
      dayOrder30Ratio: true,
      ranking: true,
      reviewScore: true,
      reviewCount: true,
      minPrice: true,
      maxPrice: true,
      competingCount: true,
      ruleName: true,
      adjustSwitch: true,
    },
    // 勾选的商品的id
    checkedGoodsIds: [],
    // 商品列表 loading （因为性能的原因，没使用 umi 的 state.loading）
    tableLoading: true,
    // 补货周期
    cycle: '15',
    // 错误报告
    errorReport: {
      total: 0,
      size: 20,
      current: 1,
      records: [],
    },
  },

  effects: {
    // 查询商品
    *fetchGoodsList({ payload, callback }, { select, call, put }) {
      // loading 表格（性能原因）
      yield put({ type: 'setTableLoading' });
      const { searchParams, filtrateParams, headersParams } = payload;
      const oldParams = yield select((state: IConnectState) => {
        return Object.assign({}, state.goodsList.searchParams, state.goodsList.filtrateParams);
      });
      const newParams = Object.assign(oldParams, searchParams, filtrateParams);
      // 后端不能处理空字符串的 ID
      if (newParams.groupId === '') {
        delete newParams.groupId;
      }
      if (newParams.ruleId === '') {
        delete newParams.ruleId;
      }
      // 去掉头尾的空格
      if (newParams.code) {
        newParams.code = newParams.code.replace(/(^\s*)|(\s*$)/g, '');
      }
      if (newParams.search) {
        newParams.search = newParams.search.replace(/(^\s*)|(\s*$)/g, '');
      }
      const res = yield call(queryGoodsList, { ...newParams, headersParams });
      if (res.code === 200) {
        const { data: goods } = res;
        yield put({
          type: 'saveGoodsList',
          payload: { goods },
        });
        yield put({
          type: 'saveParams',
          payload: { searchParams, filtrateParams },
        });
        // 取消选中
        yield put({
          type: 'updateCheckGoods',
          payload: [],
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取店铺全部分组
    *fetchShopGroups({ payload, callback }, { call, put }) {
      const res = yield call(getShopGroups, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveShopGroups',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取店铺全部调价规则
    *fetchShopRules({ payload, callback }, { call, put }) {
      const res = yield call(getShopRules, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveShopRules',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 修改商品的售价（批量/单个）
    *updatePrice({ payload, callback }, { call, put }) {
      const res = yield call(updateGoodsPrice, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateGoodsList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 修改商品的调价系统参数（最高价。最低价，成本，运费，调价规则）
    *updateGoods({ payload, callback }, { call, put }) {
      const res = yield call(updateGoods, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateGoodsList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 批量修改商品的（最高价。最低价，分组，调价规则）
    *updateBatchGoods({ payload, callback }, { call, put }) {
      const res = yield call(updateBatchGoods, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateGoodsList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 商品调价开关
    *switchAdjustSwitch({ payload, callback }, { call, put, select }) {
      const res = yield call(updateAdjustSwitch, payload);
      if (res.code === 200) {
        // 更新会员功能余量(批量操作时，可能部分商品的开关状态不会改变，找出改变了开关状态的商品的数量)
        const { adjustSwitch, ids } = payload;
        const goodsRecords: API.IGoods[] = yield select(
          (state: IConnectState) => state.goodsList.goods.records
        );
        let quantity = 0;
        goodsRecords.forEach(goods => {
          if (ids.includes(goods.id) && goods.adjustSwitch !== adjustSwitch) {
            quantity++;
          }
        });
        yield put({
          type: 'user/updateMemberFunctionalSurplus',
          payload: {
            functionName: '智能调价',
            quantity: adjustSwitch ? quantity : -quantity,
          },
        });
        // 更新商品数据
        const { data: { records } } = res;
        yield put({
          type: 'updateGoodsList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 快捷设置价格相关,价格，最低价，最高价（批量/单个）
    *fastUpdate({ payload: { ids, key, headersParams }, callback }, { call, put }) {
      const res = yield call(updatePriceFast, { ids, key, headersParams });
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateGoodsList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 修改分组名称
    *modifyGroupName({ payload, callback }, { call, put }) {
      const res = yield call(updateGroupName, payload);
      if (res.code === 200) {
        yield put({
          type: 'updateGroupsList',
          payload,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 删除分组
    *removeGroup({ payload, callback }, { call, put }) {      
      const res = yield call(deleteGroup, payload);
      if (res.code === 200) {
        yield put({
          type: 'deleteGroup',
          payload,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 添加分组
    *addGroup({ payload, callback }, { call, put }) {
      const res = yield call(addGroup, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'insertGroup',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 添加分组并设置商品的分组为新分组
    *newGroup({ payload, callback }, { call, put }) {
      const res = yield call(addGroup, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'insertGroup',
          payload: data,
        });
        yield put({
          type: 'updateBatchGoods',
          payload: {
            key: 'groupId',
            groupId: data.id,
            ids: [payload.goodsId],
            headersParams: payload.headersParams,
          },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 修改补货周期
    *updateCycle({ payload, callback }, { call, put }) {
      const res = yield call(updateCycle, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateGoodsList',
          payload: { records },
        });
        yield put({
          type: 'saveCycle',
          payload: { data: payload.cycle },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取补货周期
    *fetchCycle({ payload, callback }, { call, put }) {
      const res = yield call(getCycle, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveCycle',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取错误报告
    *fetchErrorReport({ payload, callback }, { call, put }) {
      const res = yield call(getErrorReport, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveErrorReport',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    // 保存商品列表数据
    saveGoodsList(state, { payload }) {
      const { goods } = payload;
      state.goods = goods;
      state.tableLoading = false;
    },

    // 列表 loading
    setTableLoading(state) {
      state.tableLoading = true;
    },

    // 更新查询参数
    saveParams(state, { payload }) {
      const { searchParams, filtrateParams } = payload;
      state.searchParams = Object.assign(state.searchParams, searchParams);
      state.filtrateParams = Object.assign(state.filtrateParams, filtrateParams);
    },

    // 保存全部分组
    saveShopGroups(state, { payload }) {
      const { records } = payload;
      state.groups = records;
    },

    // 保存全部调价规则
    saveShopRules(state, { payload }) {
      const { records } = payload;
      state.rules = records || [];
    },
    
    // 修改分组名称
    updateGroupsList(state, { payload }) {
      const { id, groupName } = payload;
      for (let index = 0; index < state.groups.length; index++) {
        const group = state.groups[index];
        if (group.id === id) {
          group.groupName = groupName;
          break;
        }
      }
      // 修改商品列表中的分组名称
      state.goods.records.forEach((goods: API.IGoods) => {
        if (goods.groupId === id) {
          goods.groupName = groupName;
        }
      });
    },

    // 删除分组
    deleteGroup(state, { payload }) {
      const { id } = payload;
      for (let index = 0; index < state.groups.length; index++) {
        const group = state.groups[index];
        if (group.id === id) {
          state.groups.splice(index, 1);
          break;
        }
      }
      // 找到未分组的 id
      let ungroupedId = '';
      for (let index = 0; index < state.groups.length; index++) {
        const group = state.groups[index];
        if (group.groupName === '未分组') {
          ungroupedId = group.id;
          break;
        }
      }
      // 修改商品列表的数据
      state.goods.records.forEach((goods: API.IGoods) => {
        if (goods.groupId === id) {
          goods.groupId = ungroupedId;
          goods.groupName = '未分组';
        }
      });
    },

    // 添加分组
    insertGroup(state, { payload }) {
      state.groups.unshift(payload);
    },

    // 商品修改后更新商品列表数据
    updateGoodsList(state, { payload }) {
      const { records } = payload;
      const { goods: { records: goodsList } } = state;
      for (let index = 0; index < goodsList.length; index++) {
        const goods = goodsList[index];
        records.forEach((newGoods: API.IGoods) => {
          if (goods.id === newGoods.id) {
            Object.assign(goods, newGoods);
          }
        });
      }
    },

    // 更新自定义列数据
    updateCustomCols(state, { payload }) {
      state.customCols = Object.assign(state.customCols, payload);
    },

    // 更新勾选商品
    updateCheckGoods(state, { payload }) {
      state.checkedGoodsIds = payload;
    },

    // 保存补货周期
    saveCycle(state, { payload }) {
      state.cycle = payload.data;
    },

    // 保存错误报告
    saveErrorReport(state, { payload }) {
      state.errorReport = payload.data;
    },
  },
};

export default GoodsListModel;
