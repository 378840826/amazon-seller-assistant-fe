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
  // 否定Targeting
  queryNegativeTargetingList,
  batchNegativeTargetingArchive,
  createNegativeTargeting,
  // SearchTerm报表
  querySearchTermList,
  queryQueryKeywordSuggestedBid,
  queryUsableCampaignList,
  queryUsablePutGroupList,
  createKeywords,
  queryUsableNegateGroupList,
  createNegateKeywords,
  getKeywordTextAssociate,
} from '@/services/adManage';
import { storage } from '@/utils/utils';
import { stateIconDict, initTreeData, ITreeSelectedInfo } from '@/pages/ppc/AdManage';
import { IPutKeyword, INegateKeyword } from '@/pages/ppc/AdManage/SearchTerm';

// 用于广告活动+广告组的级联选择
interface ICampaignAndGroup extends API.IAdCampaign {
  groupList: API.IAdGroup[];
}

export interface IAdManage {
  updateTime: string;
  treeData: ITreeDataNode[];
  treeSelectedInfo: ITreeSelectedInfo;
  treeExpandedKeys: string[];
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
  negativeTargetingTab: {
    list: {
      total: number;
      records: API.IAdNegativeTarget[];
    };
    searchParams: {
      size: number;
      current: number;
    };
    checkedIds: string[];
  };
  searchTermTab: {
    list: {
      total: number;
      records: API.IAdSearchTerm[];
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
    putKeywords: IPutKeyword[];
    negateKeywords: INegateKeyword[];
    usablePutCampaignList: ICampaignAndGroup[];
    usableNegateCampaignList: ICampaignAndGroup[];
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
  // 广告组的节点需要保存广告组的类型，用于判定选中广告组时要显示什么标签
  groupType?: API.GroupType;
}

// 排序
export type Order = 'descend' | 'ascend' | null | undefined;

// 按 Tree 的要求格式化数据, params key 是父节点的 key
export const formattingRecords = (
  list: INode[], parentKey: string, isLeaf: boolean, parentCampaignName: string,
// eslint-disable-next-line max-params
) => {
  return list.map((item: INode) => {
    const result: {
      title: string;
      key: string;
      icon: Element;
      isLeaf: boolean;
      parentCampaignName?: string;
      groupType?: API.GroupType;
    } = {
      title: item.name,
      key: `${parentKey}-${item.id}`,
      icon: stateIconDict[item.state],
      isLeaf,
    };
    // 广告组设置 parentCampaignName 用于面包屑展示
    if (parentKey.split('-').length > 2) {
      result.parentCampaignName = parentCampaignName;
      result.groupType = item.groupType;
    }
    return result;
  });
};

// 默认的筛选参数(主要用于查询后清空条件)(广告活动，广告组，广告等通用)
export const defaultFiltrateParams = {
  search: undefined,
  state: '',
  startDate: '',
  endDate: '',
  qualification: '',
  portfolioId: undefined,
  targetingType: '',
  matchType: '',
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
  // search term 报表的查询
  deliveryStatus: '',
  keywordText: '',
  queryKeyword: '',
  asinKeyword: '',
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
    // 在菜单树选中广告活动或广告组时，保存的广告活动和广告组信息
    treeSelectedInfo: { key: '' },
    treeExpandedKeys: [],
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
    // 否定Targeting
    negativeTargetingTab: {
      list: {
        total: 0,
        records: [],
      },
      searchParams: {
        current: 1,
        size: 20,
      },
      // 勾选的id
      checkedIds: [],
    },
    // searchTerm 报表
    searchTermTab: {
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
      // 用于批量投放，批量否定
      putKeywords: [],
      negateKeywords: [],
      // 快捷投放或否定时，可供选择的广告活动
      usablePutCampaignList: [],
      usableNegateCampaignList: [],
      // 自定义列
      customCols: storage.get('adSearchTermCustomCols') || {
        deliveryStatus: true,
        keywordText: true,
        matchType: true,
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
    *fetchTreeNode({ payload, callback, complete }, { call, put, select }) {
      // key 的组成： 类型-广告活动状态-广告活动ID-广告组ID
      // parentCampaignName 主要用于获取广告活动的名称展示在面包屑
      const { key, parentCampaignName } = payload;
      const paramsArr = key.split('-');
      let service = queryCampaignSimpleList;
      // 广告组是叶子节点
      let isLeaf = false;
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
        isLeaf = true;
      }
      const res = yield call(service, params);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveTreeNode',
          payload: { records, key, isLeaf, parentCampaignName },
        });
        // 设置菜单树展开的节点（通过url跳转到指定广告活动/广告组时，获取菜单树后立即展开）
        const currentKeys = yield select((state: IConnectState) => state.adManage.treeExpandedKeys);
        const typeKey = params.adType;
        const stateKey = `${typeKey}-${params.state}`;
        yield put({
          type: 'changeTreeExpandedKeys',
          // 去重
          payload: { keys: Array.from(new Set([...currentKeys, typeKey, stateKey, key])) },
        });
      }
      complete && complete();
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
        newParams.search = newParams.search.trim();
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
        newParams.search = newParams.search.trim();
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
        newParams.search = newParams.search.trim();
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
        newParams.search = newParams.search.trim();
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
    // Targeting-获取列表
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
        newParams.search = newParams.search.trim();
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

    // Targeting-获取建议竞价
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

    // Targeting-批量修改
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

    // Targeting-修改关键词数据
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

    // 否定Targeting
    // 否定Targeting-获取列表
    *fetchNegativeTargetingList({ payload, callback }, { call, put }) {
      const { searchParams, headersParams } = payload;
      const res = yield call(queryNegativeTargetingList, { ...searchParams, headersParams });
      if (res.code === 200) {
        const { data: { page, total } } = res;
        // 保存列表数据
        yield put({
          type: 'saveNegativeTargetingList',
          payload: { page, dataTotal: total },
        });
        // 保存查询和筛选参数
        yield put({
          type: 'saveNegativeTargetingParams',
          payload: { searchParams },
        });
        // 取消选中
        yield put({
          type: 'updateNegativeTargetingChecked',
          payload: [],
        });
      }
      callback && callback(res.code, res.message);
    },

    // 否定Targeting-批量归档
    *batchNegativeTargetingArchive({ payload, callback }, { call, put }) {
      const res = yield call(batchNegativeTargetingArchive, payload);
      if (res.code === 200) {
        // 刷新列表
        yield put({
          type: 'fetchNegativeTargetingList',
          payload: { headersParams: payload.headersParams },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 否定Targeting-添加
    *addNegativeTargeting({ payload, callback }, { call, put }) {
      const res = yield call(createNegativeTargeting, payload);
      if (res.code === 200) {
        // 刷新列表
        yield put({
          type: 'fetchNegativeTargetingList',
          payload: { headersParams: payload.headersParams },
        });
      }
      callback && callback(res.code, res.message);
    },

    // SearchTerm报表
    // SearchTerm报表-获取列表
    *fetchSearchTermList({ payload, callback }, { call, put, select }) {
      const { searchParams, filtrateParams, headersParams } = payload;
      // 旧的查询+筛选参数
      const oldParams = yield select((state: IConnectState) => {
        return Object.assign(
          {},
          state.adManage.searchTermTab.searchParams,
          state.adManage.searchTermTab.filtrateParams,
        );
      });
      // 本次查询的查询+筛选参数
      const newParams = Object.assign(oldParams, searchParams, filtrateParams);
      // 去掉搜索框的头尾空格
      if (newParams.keywordText) {
        newParams.keywordText = newParams.keywordText.trim();
      }
      if (newParams.queryKeyword) {
        newParams.queryKeyword = newParams.queryKeyword.trim();
      }
      if (newParams.asinKeyword) {
        newParams.asinKeyword = newParams.asinKeyword.trim();
      }
      const res = yield call(querySearchTermList, { ...newParams, headersParams });
      if (res.code === 200) {
        const { data: { page, total } } = res;
        // 保存列表数据
        yield put({
          type: 'saveSearchTermList',
          payload: { page, dataTotal: total },
        });
        // 保存查询和筛选参数
        yield put({
          type: 'saveSearchTermParams',
          payload: { searchParams, filtrateParams },
        });
        // 取消选中
        yield put({
          type: 'updateSearchTermChecked',
          payload: [],
        });
      }
      callback && callback(res.code, res.message);
    },

    // SearchTerm报表-获取搜索词建议竞价
    *fetchQueryKeywordSuggestedBid({ payload, callback }, { call, put }) {
      const res = yield call(queryQueryKeywordSuggestedBid, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveSearchTermPutKeywordSuggestedBid',
          payload: { records },
        });
      }
      callback && callback(res.code, res.message);
    },

    // SearchTerm报表-投放搜索词时，获取可供选择的广告活动
    *fetchUsablePutCampaignList({ payload, callback }, { call, put }) {
      const res = yield call(queryUsableCampaignList, { ...payload, camType: 'manual' });
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveUsablePutCampaignList',
          payload: records,
        });
      }
      callback && callback(res.code, res.message);
    },

    // SearchTerm报表-否定搜索词时，获取可供选择的广告活动
    *fetchUsableNegateCampaignList({ payload, callback }, { call, put }) {
      const res = yield call(queryUsableCampaignList, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveUsableNegateCampaignList',
          payload: records,
        });
      }
      callback && callback(res.code, res.message);
    },

    // SearchTerm报表-投放搜索词时，获取可供选择的广告组
    *fetchUsablePutGroupList({ payload, callback }, { call, put }) {
      const res = yield call(queryUsablePutGroupList, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveUsablePutGroupList',
          payload: { records, camId: payload.camId },
        });
      }
      callback && callback(res.code, res.message);
    },

    // SearchTerm报表-否定搜索词时，获取可供选择的广告组
    *fetchUsableNegateGroupList({ payload, callback }, { call, put }) {
      const res = yield call(queryUsableNegateGroupList, payload);
      if (res.code === 200) {
        const { data: { records } } = res;
        yield put({
          type: 'saveUsableNegateGroupList',
          payload: { records, camId: payload.camId },
        });
      }
      callback && callback(res.code, res.message);
    },

    // SearchTerm报表-投放关键词(关键词为 SearchTerm 的搜索词)
    *putQueryKeywords({ payload, callback }, { call, put }) {
      const res = yield call(createKeywords, payload);
      let code = res.code;
      let message = res.message;
      if (res.code === 200) {
        const { keywordTexts } = payload;
        const { data: resData } = res;
        const newPutKeywords: IPutKeyword[] = [];
        keywordTexts.forEach((payloadItem: IPutKeyword) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resData.forEach((resItem: any) => {
            if (
              resItem.groupId === payloadItem.groupId &&
              resItem.keywordText === payloadItem.keywordText &&
              resItem.matchType === payloadItem.matchType
            ) {
              // 投放成功的，从已选中列表中删除，失败的增加错误提示
              if (resItem.state === 'fail') {
                // 投放失败的，增加错误提示
                newPutKeywords.push({ ...payloadItem, errorMsg: resItem.failMsg });
              }
            }
          });
        });
        if (newPutKeywords.length === 0) {
          code = 200;
          message = '投放成功';
        } else if (newPutKeywords.length === payload.keywordTexts.length) {
          code = 400;
          message = '投放失败';
        } else {
          code = 200;
          message = '部分关键词投放成功';
        }
        // 更新投放词列表
        yield put({
          type: 'saveSearchTermPutKeywords',
          payload: newPutKeywords,
        });
      }
      callback && callback(code, message);
    },

    // SearchTerm报表-否定搜索词投放
    *putNegateQueryKeywords({ payload, callback }, { call, put }) {
      const res = yield call(createNegateKeywords, payload);
      let code = res.code;
      let message = res.message;
      if (res.code === 200) {
        const { neKeywords } = payload;
        const { data: resData } = res;
        const newPutKeywords: IPutKeyword[] = [];
        neKeywords.forEach((payloadItem: IPutKeyword) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resData.forEach((resItem: any) => {
            if (
              resItem.groupId === payloadItem.groupId &&
              resItem.keywordText === payloadItem.keywordText &&
              resItem.matchType === payloadItem.matchType
            ) {
              // 投放成功的，从已选中列表中删除，失败的增加错误提示
              if (resItem.state === 'fail') {
                // 投放失败的，增加错误提示
                newPutKeywords.push({ ...payloadItem, errorMsg: resItem.failMsg });
              }
            }
          });
        });
        if (newPutKeywords.length === 0) {
          code = 200;
          message = '投放成功';
        } else if (newPutKeywords.length === payload.neKeywords.length) {
          code = 400;
          message = '投放失败';
        } else {
          code = 200;
          message = '部分关键词投放成功';
        }
        // 更新投放词列表
        yield put({
          type: 'saveSearchTermNegateKeywords',
          payload: newPutKeywords,
        });
      }
      callback && callback(code, message);
    },

    // SearchTerm报表-获取搜索投放词的联想词 (节流)
    fetchKeywordAssociate: [
      function* ({ payload, callback }, { call }) {
        const res = yield call(getKeywordTextAssociate, payload);
        if (res.code === 200) {
          callback && callback(res.code, res.message, res.data);
        } else {
          callback && callback(res.code, res.message);
        }
      },
      { type: 'throttle', ms: 500 },
    ],
  },

  reducers: {
    // 保存店铺更新时间
    saveUpdateTime(state, { payload }) {
      const { data } = payload;
      state.updateTime = data;
    },

    // 菜单树-保存菜单树
    saveTreeNode(state, { payload }) {      
      const { records, key, isLeaf, parentCampaignName } = payload;
      const formatRecords = formattingRecords(records, key, isLeaf, parentCampaignName);
      const node = updateTreeData(state.treeData, key, formatRecords);
      state.treeData = node;
    },

    // 菜单树-保存菜单树选中的key 和 广告活动或广告组信息
    saveTreeSelectedInfo(state, { payload }) {
      state.treeSelectedInfo = payload;
    },

    // 菜单树-菜单树展开的 key
    changeTreeExpandedKeys(state, { payload }) {
      const { keys } = payload;
      state.treeExpandedKeys = keys;
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

    // 否定Targeting
    // 否定Targeting-保存列表
    saveNegativeTargetingList(state, { payload }) {
      const { page, dataTotal } = payload;
      state.negativeTargetingTab.list = { ...page, dataTotal };
    },

    // 否定Targeting-更新查询参数
    saveNegativeTargetingParams(state, { payload }) {
      const { searchParams } = payload;
      state.negativeTargetingTab.searchParams = Object.assign(
        state.negativeTargetingTab.searchParams, searchParams
      );
    },

    // 否定Targeting-勾选
    updateNegativeTargetingChecked(state, { payload }) {
      state.negativeTargetingTab.checkedIds = payload;
    },

    // SearchTerm报表
    // SearchTerm报表-保存列表
    saveSearchTermList(state, { payload }) {
      const { page, dataTotal } = payload;
      state.searchTermTab.list = { ...page, dataTotal };
    },

    // SearchTerm报表-更新查询参数
    saveSearchTermParams(state, { payload }) {
      const { searchParams, filtrateParams } = payload;
      state.searchTermTab.searchParams = Object.assign(
        state.searchTermTab.searchParams, searchParams
      );
      state.searchTermTab.filtrateParams = Object.assign(
        state.searchTermTab.filtrateParams,
        filtrateParams,
      );
    },
    
    // SearchTerm报表-勾选
    updateSearchTermChecked(state, { payload }) {
      state.searchTermTab.checkedIds = payload;
      const checkedKeywords = payload.map((id: string) => {
        return state.searchTermTab.list.records.find(
          (item: API.IAdSearchTerm) => item.id === id
        );
      });
      const putKeywordList: IPutKeyword[] = [];
      const negateKeywordList: INegateKeyword[] = [];
      checkedKeywords.forEach((item: API.IAdSearchTerm) => {
        // 投放词排除 targeting，只保留关键词（ queryKeywordType 为 true 时 searchTerm 类型是 asin ）
        item.queryKeywordType ? null : putKeywordList.push({
          id: item.id,
          campaignTargetType: item.campaignTargetType,
          // 自动广告活动下不支持添加关键词
          camId: item.campaignTargetType === 'manual' ? item.camId : '',
          groupId: item.campaignTargetType === 'manual' ? item.groupId : '',
          groupName: item.groupName,
          queryKeywordType: item.queryKeywordType,
          matchType: item.matchType,
          // 投放列表的关键词等于 searchTerm 列表的搜索词
          keywordText: item.queryKeyword,
          // 关键词的建议竞价和建议竞价范围
          suggested: 0,
          suggestedRangeStart: 0,
          suggestedRangeEnd: 0,
          bid: item.groupBid,
        });
        negateKeywordList.push({
          id: item.id,
          camId: item.camId,
          groupId: item.groupId,
          groupName: item.groupName,
          matchType: 'negativeExact',
          /** 否定列表的关键词等于 searchTerm 列表的搜索词 */
          keywordText: item.queryKeyword,
        });
      });
      state.searchTermTab.putKeywords = putKeywordList;
      state.searchTermTab.negateKeywords = negateKeywordList;
    },

    // SearchTerm报表-保存投放关键词的建议竞价
    saveSearchTermPutKeywordSuggestedBid(state: IAdManage, { payload }) {
      const { records } = payload;
      const array = state.searchTermTab.putKeywords;
      for (let i = 0; i < array.length; i++) {
        const keywordItem = array[i];
        for (let j = 0; j < records.length; j++) {
          const payloadItem = records[j];
          if (keywordItem.keywordText === payloadItem.keywordText) {
            keywordItem.suggested = payloadItem.suggested;
            keywordItem.suggestedRangeStart = payloadItem.rangeStart;
            keywordItem.suggestedRangeEnd = payloadItem.rangeEnd;
            records.splice(j, 1);
            j--;
            break;
          }
        }
      }
    },

    // SearchTerm报表-保存投放词的信息 putKeywords
    saveSearchTermPutKeywords(state, { payload }) {
      state.searchTermTab.putKeywords = payload;
    },

    // SearchTerm报表-保存否定词的信息 negateKeywords
    saveSearchTermNegateKeywords(state, { payload }) {
      state.searchTermTab.negateKeywords = payload;
    },

    // SearchTerm报表-更新投放词的信息（竞价、广告组、广告活动、匹配方式）
    updateSearchTermPutKeywords(state, { payload }) {
      const list = state.searchTermTab.putKeywords;
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === payload.id) {
          list[i] = { ...list[i], ...payload };
        }
      }
    },

    // SearchTerm报表-更新否定词的信息（广告组、广告活动、匹配方式）
    updateSearchTermNegateInfo(state, { payload }) {
      const list = state.searchTermTab.negateKeywords;
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === payload.id) {
          list[i] = { ...list[i], ...payload };
        }
      }
    },

    // SearchTerm报表-更新自定义列
    updateSearchTermCustomCols(state, { payload }) {
      state.searchTermTab.customCols = Object.assign(state.searchTermTab.customCols, payload);
    },

    // SearchTerm报表-保存投放关键词时，可供选择的广告活动
    saveUsablePutCampaignList(state, { payload }) {
      state.searchTermTab.usablePutCampaignList = payload;
    },

    // SearchTerm报表-保存否定关键词时，可供选择的广告活动
    saveUsableNegateCampaignList(state, { payload }) {
      state.searchTermTab.usableNegateCampaignList = payload;
    },

    // SearchTerm报表-保存投放关键词时，可供选择的广告组
    saveUsablePutGroupList(state, { payload }) {
      const { records, camId } = payload;
      state.searchTermTab.usablePutCampaignList.forEach((item: ICampaignAndGroup) => {
        if (item.id === camId) {
          item.groupList = records;
        }
      });
    },

    // SearchTerm报表-保存否定关键词时，可供选择的广告组
    saveUsableNegateGroupList(state, { payload }) {
      const { records, camId } = payload;
      state.searchTermTab.usableNegateCampaignList.forEach((item: ICampaignAndGroup) => {
        if (item.id === camId) {
          item.groupList = records;
        }
      });
    },
  },
};

export default AdManageModel;
