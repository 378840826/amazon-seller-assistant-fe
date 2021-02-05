/**
 * 广告管理
 */
import { IConnectState, IModelType } from '@/models/connect';
import {
  // 广告管理
  queryUpdateTime,
  queryTabsCellCount,
  queryCampaignSimpleList,
  queryGroupSimpleList,
  // 广告活动
  queryCampaignList,
  queryPortfolioList,
  batchCampaignState,
  createPortfolio,
  updatePortfolioName,
  updateCampaign,
  // 广告组
  queryGroupList,
  updateGroup,
  batchGroupState,
  copyGroup,
  // 广告
  queryAdList,
  batchAdState,
  // 关键词
  queryKeywordList,
  batchKeyword,
  queryKeywordSuggestedBid,
  // Targeting
  queryTargetingList,
  batchTargeting,
  queryTargetingSuggestedBid,
} from '@/services/adManage';
import { storage } from '@/utils/utils';
import { stateIconDict, initTreeData } from '@/pages/ppc/AdManage';

export interface IAdManage {
  updateTime: string;
  treeData: ITreeDataNode[];
  tabsCellCount: {
    [key: string]: number;
  };
  campaignTab: {
    list: {
      total: number;
      records: API.IAdCampaign[];
      dataTotal: { [key: string]: number };
    };
    searchParams: {
      order: Order;
      size: number;
      current: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    filtrateParams: {
      startDate: string;
      endDate: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    portfolioList: API.IPortfolio[];
    checkedIds: string[];
    customCols: {
      [key: string]: boolean;
    };
  };
  groupTab: {
    list: {
      total: number;
      records: API.IAdGroup[];
      dataTotal: { [key: string]: number };
    };
    searchParams: {
      order: Order;
      size: number;
      current: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    filtrateParams: {
      startDate: string;
      endDate: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    checkedIds: string[];
    customCols: {
      [key: string]: boolean;
    };
  };
  adTab: {
    list: {
      total: number;
      records: API.IAd[];
      dataTotal: { [key: string]: number };
    };
    searchParams: {
      order: Order;
      size: number;
      current: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    filtrateParams: {
      startDate: string;
      endDate: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    checkedIds: string[];
    customCols: {
      [key: string]: boolean;
    };
  };
  keywordTab: {
    list: {
      total: number;
      records: API.IAdTargeting[];
      dataTotal: { [key: string]: number };
    };
    searchParams: {
      order: Order;
      size: number;
      current: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    filtrateParams: {
      startDate: string;
      endDate: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    checkedIds: string[];
    customCols: {
      [key: string]: boolean;
    };
  };
  targetingTab: {
    list: {
      total: number;
      records: API.IAdTargeting[];
      dataTotal: { [key: string]: number };
    };
    searchParams: {
      order: Order;
      size: number;
      current: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    filtrateParams: {
      startDate: string;
      endDate: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    };
    checkedIds: string[];
    customCols: {
      [key: string]: boolean;
    };
  };
}

interface IAdManageModelType extends IModelType {
  namespace: 'adManage';
  state: IAdManage;
}

// Tree 节点
export interface ITreeDataNode {
  title: Element | string | JSX.Element;
  key: string;
  icon?: Element;
  isLeaf?: boolean;
  children?: ITreeDataNode[];
  selectable?: boolean;
}

// 树节点接口字段
export interface INode {
  id: string;
  name: string;
  state: string;
}

// 排序
export type Order = 'descend' | 'ascend' | null | undefined;

// 按 Tree 的要求格式化数据, params key 是父节点的 key
export const formattingRecords = (list: INode[], parentKey: string) => {
  return list.map((item: INode) => {
    return {
      title: item.name,
      key: `${parentKey}-${item.id}`,
      icon: stateIconDict[item.state],
    };
  });
};

// 默认的筛选参数(主要用于查询后清空条件)(广告活动，广告组，广告等通用)
export const defaultFiltrateParams = {
  search: undefined,
  state: undefined,
  startDate: '',
  endDate: '',
  qualification: undefined,
  portfolioId: undefined,
  targetingType: undefined,
  matchType: undefined,
  salesMin: undefined,
  salesMax: undefined,
  orderNumMin: undefined,
  orderNumMax: undefined,
  conversionsRateMin: undefined,
  conversionsRateMax: undefined,
  roasMin: undefined,
  roasMax: undefined,
  cpcMin: undefined,
  cpcMax: undefined,
  cpaMin: undefined,
  cpaMax: undefined,
  impressionsMin: undefined,
  impressionsMax: undefined,
  clicksMin: undefined,
  clicksMax: undefined,
  spendMin: undefined,
  spendMax: undefined,
  acosMin: undefined,
  acosMax: undefined,
  ctrMin: undefined,
  ctrMax: undefined,
};

// 更新树数据
function updateTreeData(
  list: ITreeDataNode[], key: React.Key, children: ITreeDataNode[]): ITreeDataNode[] {
  for (let i = 0; i < list.length; i++) {
    const node = list[i];
    if (node.key === key) {
      list[i] = {
        ...node,
        children,
      };
      break;
    } else if (node.children) {
      list[i] = {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
  }
  return list;
}

const AdManageModel: IAdManageModelType = {
  namespace: 'adManage',

  state: {
    updateTime: '正在查询...',
    treeData: initTreeData,
    // 标签下的数量
    tabsCellCount: {
      campaignCount: 0,
      groupCount: 0,
      adCount: 0,
      keywordCount: 0,
      targetCount: 0,
      neTargetCount: 0,
    },
    // 广告活动
    campaignTab: {
      list: {
        total: 0,
        records: [],
        // 合计数据
        dataTotal: {},
      },
      // 查询参数
      searchParams: {
        order: null,
        current: 1,
        size: 20,
      },
      // 筛选参数
      filtrateParams: { ...defaultFiltrateParams },
      // 全部分组
      portfolioList: [],
      // 勾选的广告活动的id
      checkedIds: [],
      // 广告活动自定义列
      customCols: storage.get('adCampaignCustomCols') || {
        portfolios: true,
        adType: true,
        targetingType: true,
        createdTime: true,
        adGroupCount: true,
        biddingStrategy: true,
        topOfSearch: true,
        productPage: true,
        dailyBudget: true,
        negativeTargetCount: true,
        date: true,
        sales: false,
        orderNum: false,
        cpc: false,
        cpa: false,
        spend: false,
        acos: false,
        roas: false,
        impressions: false,
        clicks: false,
        ctr: false,
        conversionsRate: false,
      },
    },
    // 广告组
    groupTab: {
      list: {
        total: 0,
        records: [],
        // 合计数据
        dataTotal: {},
      },
      // 查询参数
      searchParams: {
        order: null,
        current: 1,
        size: 20,
      },
      // 筛选参数
      filtrateParams: { ...defaultFiltrateParams },
      // 勾选的广告组的id
      checkedIds: [],
      // 广告组自定义列
      customCols: storage.get('adGroupCustomCols') || {
        createdTime: true,
        defaultBid: true,
        productCount: true,
        targetCount: true,
        negativeTargetCount: true,
        date: true,
        budgetLimit: true,
        sales: false,
        orderNum: false,
        cpc: false,
        cpa: false,
        spend: false,
        acos: false,
        roas: false,
        impressions: false,
        clicks: false,
        ctr: false,
        conversionsRate: false,
      },
    },
    // 广告
    adTab: {
      list: {
        total: 0,
        records: [],
        // 合计数据
        dataTotal: {},
      },
      // 查询参数
      searchParams: {
        order: null,
        current: 1,
        size: 20,
      },
      // 筛选参数
      filtrateParams: { ...defaultFiltrateParams },
      // 勾选的广告的id
      checkedIds: [],
      // 广告自定义列
      customCols: storage.get('adCustomCols') || {
        // qualification: true,
        addTime: true,
        sales: false,
        orderNum: false,
        cpc: false,
        cpa: false,
        spend: false,
        acos: false,
        roas: false,
        impressions: false,
        clicks: false,
        ctr: false,
        conversionsRate: false,
      },
    },
    // 关键词
    keywordTab: {
      list: {
        total: 0,
        records: [],
        // 合计数据
        dataTotal: {},
      },
      // 查询参数
      searchParams: {
        order: null,
        current: 1,
        size: 20,
      },
      // 筛选参数
      filtrateParams: { ...defaultFiltrateParams },
      // 勾选的id
      checkedIds: [],
      // 自定义列
      customCols: storage.get('adKeywordCustomCols') || {
        matchType: true,
        suggested: true,
        bid: true,
        addTime: true,
        sales: false,
        orderNum: false,
        cpc: false,
        cpa: false,
        spend: false,
        acos: false,
        roas: false,
        impressions: false,
        clicks: false,
        ctr: false,
        conversionsRate: false,
      },
    },
    // Targeting
    targetingTab: {
      list: {
        total: 0,
        records: [],
        // 合计数据
        dataTotal: {},
      },
      // 查询参数
      searchParams: {
        order: null,
        current: 1,
        size: 20,
      },
      // 筛选参数
      filtrateParams: { ...defaultFiltrateParams },
      // 勾选的id
      checkedIds: [],
      // 自定义列
      customCols: storage.get('adTargetingCustomCols') || {
        matchType: true,
        suggested: true,
        bid: true,
        addTime: true,
        sales: false,
        orderNum: false,
        cpc: false,
        cpa: false,
        spend: false,
        acos: false,
        roas: false,
        impressions: false,
        clicks: false,
        ctr: false,
        conversionsRate: false,
      },
    },
  },

  effects: {
    // 获取店铺更新时间
    *fetchUpdateTime({ payload, callback }, { call, put }) {
      const res = yield call(queryUpdateTime, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveUpdateTime',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取菜单树节点（广告活动和广告组）
    *fetchTreeNode({ payload, callback, complete }, { call, put }) {
      // key 的组成： 类型-状态-广告活动ID-广告组ID
      const { key } = payload;
      const paramsArr = key.split('-');
      let service = queryCampaignSimpleList;
      const params: {
        adType: string;
        state: string;
        camId?: string;
      } = {
        adType: paramsArr[0],
        state: paramsArr[1],
      };
      // 通过广告活动请求广告组
      if (paramsArr.length > 2) {
        service = queryGroupSimpleList;
        params.camId = paramsArr[2];
      }
      const res = yield call(service, params);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveTreeNode',
          payload: { records, key },
        });
      }
      complete();
      callback && callback(res.code, res.message);
    },

    // 获取各标签显示的数量
    *fetchTabsCellCount({ payload, callback }, { call, put }) {
      const res = yield call(queryTabsCellCount, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveTabsCellCount',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告活动
    // 广告活动-获取 Portfolios
    *fetchPortfolioList({ payload, callback }, { call, put }) {
      const res = yield call(queryPortfolioList, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'savePortfolioList',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告活动-添加 Portfolio
    *addPortfolio({ payload, callback }, { call, put }) {
      const res = yield call(createPortfolio, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'insertPortfolio',
          payload: data,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告活动-添加 Portfolio 并设置广告活动为这个新的 Portfolio
    *newPortfolio({ payload, callback }, { call, put }) {
      const res = yield call(createPortfolio, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'insertPortfolio',
          payload: data,
        });
        yield put({
          type: 'modifyCampaign',
          payload: {
            record: {
              id: payload.record.id,
              portfolioId: data.id,
            },
            headersParams: payload.headersParams,
          },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告活动-修改 Portfolio 名称
    *renamePortfolio({ payload, callback }, { call, put }) {
      const res = yield call(updatePortfolioName, payload);
      if (res.code === 200) {
        yield put({
          type: 'updatePortfolioList',
          payload,
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告活动-获取列表
    *fetchCampaignList({ payload, callback }, { call, put, select }) {
      const { searchParams, filtrateParams, headersParams } = payload;
      // 旧的查询+筛选参数
      const oldParams = yield select((state: IConnectState) => {
        return Object.assign(
          {},
          state.adManage.campaignTab.searchParams,
          state.adManage.campaignTab.filtrateParams,
        );
      });
      // 本次查询的查询+筛选参数
      const newParams = Object.assign(oldParams, searchParams, filtrateParams);
      // 去掉搜索框的头尾空格
      if (newParams.search) {
        newParams.search = newParams.search.replace(/(^\s*)|(\s*$)/g, '');
      }
      const res = yield call(queryCampaignList, { ...newParams, headersParams });
      if (res.code === 200) {
        const { data: { page, total } } = res;
        // 保存列表数据
        yield put({
          type: 'saveCampaignList',
          payload: { page, dataTotal: total },
        });
        // 保存查询和筛选参数
        yield put({
          type: 'saveCampaignParams',
          payload: { searchParams, filtrateParams },
        });
        // 取消选中
        yield put({
          type: 'updateCampaignChecked',
          payload: [],
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告活动-批量操作修改状态
    *batchCampaign({ payload, callback }, { call, put }) {
      const res = yield call(batchCampaignState, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateCampaignList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告活动-修改广告活动的数据
    *modifyCampaign({ payload, callback }, { call, put }) {
      const res = yield call(updateCampaign, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'updateCampaignList',
          payload: { records: [data] },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告组
    // 广告组-获取列表
    *fetchGroupList({ payload, callback }, { call, put, select }) {
      const { searchParams, filtrateParams, headersParams } = payload;
      // 旧的查询+筛选参数
      const oldParams = yield select((state: IConnectState) => {
        return Object.assign(
          {},
          state.adManage.groupTab.searchParams,
          state.adManage.groupTab.filtrateParams,
        );
      });
      // 本次查询的查询+筛选参数
      const newParams = Object.assign(oldParams, searchParams, filtrateParams);
      // 去掉搜索框的头尾空格
      if (newParams.search) {
        newParams.search = newParams.search.replace(/(^\s*)|(\s*$)/g, '');
      }
      const res = yield call(queryGroupList, { ...newParams, headersParams });
      if (res.code === 200) {
        const { data: { page, total } } = res;
        // 保存列表数据
        yield put({
          type: 'saveGroupList',
          payload: { page, dataTotal: total },
        });
        // 保存查询和筛选参数
        yield put({
          type: 'saveGroupParams',
          payload: { searchParams, filtrateParams },
        });
        // 取消选中
        yield put({
          type: 'updateGroupChecked',
          payload: [],
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告组-修改广告组的数据
    *modifyGroup({ payload, callback }, { call, put }) {
      const res = yield call(updateGroup, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'updateGroupList',
          payload: { records: [data] },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告组-批量修改状态
    *batchGroup({ payload, callback }, { call, put }) {
      const res = yield call(batchGroupState, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateGroupList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告组-复制广告组
    *copyGroup({ payload, callback }, { call }) {
      const res = yield call(copyGroup, payload);
      callback && callback(res.code, res.message);
    },

    // 广告
    // 广告-获取列表
    *fetchAdList({ payload, callback }, { call, put, select }) {
      const { searchParams, filtrateParams, headersParams } = payload;
      // 旧的查询+筛选参数
      const oldParams = yield select((state: IConnectState) => {
        return Object.assign(
          {},
          state.adManage.adTab.searchParams,
          state.adManage.adTab.filtrateParams,
        );
      });
      // 本次查询的查询+筛选参数
      const newParams = Object.assign(oldParams, searchParams, filtrateParams);
      // 去掉搜索框的头尾空格
      if (newParams.search) {
        newParams.search = newParams.search.replace(/(^\s*)|(\s*$)/g, '');
      }
      const res = yield call(queryAdList, { ...newParams, headersParams });
      if (res.code === 200) {
        const { data: { page, total } } = res;
        // 保存列表数据
        yield put({
          type: 'saveAdList',
          payload: { page, dataTotal: total },
        });
        // 保存查询和筛选参数
        yield put({
          type: 'saveAdParams',
          payload: { searchParams, filtrateParams },
        });
        // 取消选中
        yield put({
          type: 'updateAdChecked',
          payload: [],
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告-修改广告数据(只要状态能修改)
    *modifyAd({ payload, callback }, { call, put }) {
      const res = yield call(updateGroup, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'updateAdList',
          payload: { records: [data] },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告-批量修改状态
    *batchAd({ payload, callback }, { call, put }) {
      const res = yield call(batchAdState, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateAdList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 关键词
    // 关键词-获取列表
    *fetchKeywordList({ payload, callback }, { call, put, select }) {
      const { searchParams, filtrateParams, headersParams } = payload;
      // 旧的查询+筛选参数
      const oldParams = yield select((state: IConnectState) => {
        return Object.assign(
          {},
          state.adManage.keywordTab.searchParams,
          state.adManage.keywordTab.filtrateParams,
        );
      });
      // 本次查询的查询+筛选参数
      const newParams = Object.assign(oldParams, searchParams, filtrateParams);
      // 去掉搜索框的头尾空格
      if (newParams.search) {
        newParams.search = newParams.search.replace(/(^\s*)|(\s*$)/g, '');
      }
      const res = yield call(queryKeywordList, { ...newParams, headersParams });
      if (res.code === 200) {
        const { data: { page, total } } = res;
        // 获取建议竞价
        const ids = page.records.map((item: API.IAdTargeting) => item.id);
        yield put({
          type: 'fetchKeywordSuggestedBid',
          payload: { headersParams, ids },
        });
        // 保存列表数据
        yield put({
          type: 'saveKeywordList',
          payload: { page, dataTotal: total },
        });
        // 保存查询和筛选参数
        yield put({
          type: 'saveKeywordParams',
          payload: { searchParams, filtrateParams },
        });
        // 取消选中
        yield put({
          type: 'updateKeywordChecked',
          payload: [],
        });
      }
      callback && callback(res.code, res.message);
    },

    // 关键词-获取建议竞价
    *fetchKeywordSuggestedBid({ payload, callback }, { call, put }) {
      const res = yield call(queryKeywordSuggestedBid, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateKeywordList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 关键词-批量修改
    *batchKeyword({ payload, callback }, { call, put }) {
      const res = yield call(batchKeyword, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateKeywordList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 关键词-修改关键词数据
    *modifyKeyword({ payload, callback }, { call, put }) {
      const res = yield call(updateGroup, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'updateKeywordList',
          payload: { records: [data] },
        });
      }
      callback && callback(res.code, res.message);
    },

    // Targeting
    // 关键词-获取列表
    *fetchTargetingList({ payload, callback }, { call, put, select }) {
      const { searchParams, filtrateParams, headersParams } = payload;
      // 旧的查询+筛选参数
      const oldParams = yield select((state: IConnectState) => {
        return Object.assign(
          {},
          state.adManage.targetingTab.searchParams,
          state.adManage.targetingTab.filtrateParams,
        );
      });
      // 本次查询的查询+筛选参数
      const newParams = Object.assign(oldParams, searchParams, filtrateParams);
      // 去掉搜索框的头尾空格
      if (newParams.search) {
        newParams.search = newParams.search.replace(/(^\s*)|(\s*$)/g, '');
      }
      const res = yield call(queryTargetingList, { ...newParams, headersParams });
      if (res.code === 200) {
        const { data: { page, total } } = res;
        // 获取建议竞价
        const ids = page.records.map((item: API.IAdTargeting) => item.id);
        yield put({
          type: 'fetchTargetingSuggestedBid',
          payload: { headersParams, ids },
        });
        // 保存列表数据
        yield put({
          type: 'saveTargetingList',
          payload: { page, dataTotal: total },
        });
        // 保存查询和筛选参数
        yield put({
          type: 'saveTargetingParams',
          payload: { searchParams, filtrateParams },
        });
        // 取消选中
        yield put({
          type: 'updateTargetingChecked',
          payload: [],
        });
      }
      callback && callback(res.code, res.message);
    },

    // 关键词-获取建议竞价
    *fetchTargetingSuggestedBid({ payload, callback }, { call, put }) {
      const res = yield call(queryTargetingSuggestedBid, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateTargetingList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 关键词-批量修改
    *batchTargeting({ payload, callback }, { call, put }) {
      const res = yield call(batchTargeting, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'updateTargetingList',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 关键词-修改关键词数据
    *modifyTargeting({ payload, callback }, { call, put }) {
      const res = yield call(updateGroup, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'updateTargetingList',
          payload: { records: [data] },
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    // 保存店铺更新时间
    saveUpdateTime(state, { payload }) {
      const { data } = payload;
      state.updateTime = data;
    },

    // 菜单树-保存菜单树
    saveTreeNode(state, { payload }) {
      const { records, key } = payload;
      const formatRecords = formattingRecords(records, key);
      const node = updateTreeData(state.treeData, key, formatRecords);
      state.treeData = node;
    },

    // 标签页-保存各标签显示的数量
    saveTabsCellCount(state, { payload }) {
      const { data } = payload;
      state.tabsCellCount = data;
    },

    // 广告活动
    // 广告活动-保存 Portfolios
    savePortfolioList(state, { payload }) {
      const { data } = payload;
      state.campaignTab.portfolioList = data;
    },

    // 广告活动-修改 Portfolio
    updatePortfolioList(state, { payload }) {
      const { id, name } = payload;
      for (let index = 0; index < state.campaignTab.portfolioList.length; index++) {
        const portfolio = state.campaignTab.portfolioList[index];
        if (portfolio.id === id) {
          portfolio.name = name;
          break;
        }
      }
      // 修改广告活动列表中的 Portfolio
      state.campaignTab.list.records.forEach((campaign: API.IAdCampaign) => {
        if (campaign.id === id) {
          campaign.portfolioName = name;
        }
      });
    },

    // 广告活动-添加 Portfolios
    insertPortfolio(state, { payload }) {
      state.campaignTab.portfolioList.unshift(payload);
    },

    // 广告活动-更新自定义列
    updateCampaignCustomCols(state, { payload }) {
      state.campaignTab.customCols = Object.assign(state.campaignTab.customCols, payload);
    },

    // 广告活动-保存列表
    saveCampaignList(state, { payload }) {
      const { page, dataTotal } = payload;
      state.campaignTab.list = { ...page, dataTotal };
    },

    // 广告活动-更新查询参数
    saveCampaignParams(state, { payload }) {
      const { searchParams, filtrateParams } = payload;
      state.campaignTab.searchParams = Object.assign(state.campaignTab.searchParams, searchParams);
      state.campaignTab.filtrateParams = Object.assign(
        state.campaignTab.filtrateParams,
        filtrateParams,
      );
    },

    // 广告活动-勾选
    updateCampaignChecked(state, { payload }) {
      state.campaignTab.checkedIds = payload;
    },

    // 广告活动-修改后更新数据
    updateCampaignList(state, { payload }) {
      const { records: newRecords } = payload;
      const { campaignTab: { list: { records } } } = state;
      for (let index = 0; index < records.length; index++) {
        const item = records[index];
        newRecords.forEach((newItem: API.IAdCampaign) => {
          if (item.id === newItem.id) {
            Object.assign(item, newItem);
          }
        });
      }
    },

    // 广告组
    // 广告组-保存列表
    saveGroupList(state, { payload }) {
      const { page, dataTotal } = payload;
      state.groupTab.list = { ...page, dataTotal };
    },

    // 广告组-更新查询参数
    saveGroupParams(state, { payload }) {
      const { searchParams, filtrateParams } = payload;
      state.groupTab.searchParams = Object.assign(state.groupTab.searchParams, searchParams);
      state.groupTab.filtrateParams = Object.assign(
        state.groupTab.filtrateParams,
        filtrateParams,
      );
    },

    // 广告组-勾选
    updateGroupChecked(state, { payload }) {
      state.groupTab.checkedIds = payload;
    },

    // 广告组-更新自定义列
    updateGroupCustomCols(state, { payload }) {
      state.groupTab.customCols = Object.assign(state.groupTab.customCols, payload);
    },

    // 广告组-修改后更新数据
    updateGroupList(state, { payload }) {
      const { records: newRecords } = payload;
      const { groupTab: { list: { records } } } = state;
      for (let index = 0; index < records.length; index++) {
        const item = records[index];
        newRecords.forEach((newItem: API.IAdGroup) => {
          if (item.id === newItem.id) {
            Object.assign(item, newItem);
          }
        });
      }
    },

    // 广告
    // 广告-保存列表
    saveAdList(state, { payload }) {
      const { page, dataTotal } = payload;
      state.adTab.list = { ...page, dataTotal };
    },

    // 广告-更新自定义列
    updateAdCustomCols(state, { payload }) {
      state.adTab.customCols = Object.assign(state.adTab.customCols, payload);
    },

    // 广告-更新查询参数
    saveAdParams(state, { payload }) {
      const { searchParams, filtrateParams } = payload;
      state.adTab.searchParams = Object.assign(state.adTab.searchParams, searchParams);
      state.adTab.filtrateParams = Object.assign(
        state.adTab.filtrateParams,
        filtrateParams,
      );
    },

    // 广告-勾选
    updateAdChecked(state, { payload }) {
      state.adTab.checkedIds = payload;
    },

    // 广告组-修改后更新数据
    updateAdList(state, { payload }) {
      const { records: newRecords } = payload;
      const { adTab: { list: { records } } } = state;
      for (let index = 0; index < records.length; index++) {
        const item = records[index];
        newRecords.forEach((newItem: API.IAd) => {
          if (item.id === newItem.id) {
            Object.assign(item, newItem);
          }
        });
      }
    },

    // 关键词
    // 关键词-保存列表
    saveKeywordList(state, { payload }) {
      const { page, dataTotal } = payload;
      state.keywordTab.list = { ...page, dataTotal };
    },

    // 关键词-更新自定义列
    updateKeywordCustomCols(state, { payload }) {
      state.keywordTab.customCols = Object.assign(state.keywordTab.customCols, payload);
    },

    // 关键词-更新查询参数
    saveKeywordParams(state, { payload }) {
      const { searchParams, filtrateParams } = payload;
      state.keywordTab.searchParams = Object.assign(state.keywordTab.searchParams, searchParams);
      state.keywordTab.filtrateParams = Object.assign(
        state.keywordTab.filtrateParams,
        filtrateParams,
      );
    },

    // 关键词-勾选
    updateKeywordChecked(state, { payload }) {
      state.keywordTab.checkedIds = payload;
    },

    // 关键词-修改后更新数据
    updateKeywordList(state, { payload }) {
      const { records: newRecords } = payload;
      const { keywordTab: { list: { records } } } = state;
      for (let index = 0; index < records.length; index++) {
        const item = records[index];
        newRecords.forEach((newItem: API.IAdTargeting) => {
          if (item.id === newItem.id) {
            Object.assign(item, newItem);
          }
        });
      }
    },

    // Targeting
    // Targeting-保存列表
    saveTargetingList(state, { payload }) {
      const { page, dataTotal } = payload;
      state.targetingTab.list = { ...page, dataTotal };
    },

    // Targeting-更新自定义列
    updateTargetingCustomCols(state, { payload }) {
      state.targetingTab.customCols = Object.assign(state.targetingTab.customCols, payload);
    },

    // Targeting-更新查询参数
    saveTargetingParams(state, { payload }) {
      const { searchParams, filtrateParams } = payload;
      state.targetingTab.searchParams = Object.assign(
        state.targetingTab.searchParams, searchParams
      );
      state.targetingTab.filtrateParams = Object.assign(
        state.targetingTab.filtrateParams,
        filtrateParams,
      );
    },

    // Targeting-勾选
    updateTargetingChecked(state, { payload }) {
      state.targetingTab.checkedIds = payload;
    },

    // Targeting-修改后更新数据
    updateTargetingList(state, { payload }) {
      const { records: newRecords } = payload;
      const { targetingTab: { list: { records } } } = state;
      for (let index = 0; index < records.length; index++) {
        const item = records[index];
        newRecords.forEach((newItem: API.IAdTargeting) => {
          if (item.id === newItem.id) {
            Object.assign(item, newItem);
          }
        });
      }
    },
  },
};

export default AdManageModel;
