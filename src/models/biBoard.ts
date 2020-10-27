import { IModelType } from '@/models/connect';
import {
  queryKanbanData,
  addCompetitorMonitor,
} from '@/services/biBoard';
import { storage } from '@/utils/utils';

export interface IBiBoardModelState {
  queue: string[];
  customCols: {
    [key: string]: boolean;
  };
  data: API.IBiBoard;
}

interface IBiBoardModelType extends IModelType {
  namespace: 'biBoard';
  state: IBiBoardModelState;
}

const GoodsListModel: IBiBoardModelType = {
  namespace: 'biBoard',

  state: {
    // 显示顺序
    queue: storage.get('biBoardQueue') || [
      'fisKanban',
      'ajKanban',
      'followKanban',
      'buyboxPercentageKanban',
      'mailKanban',
      'reviewKanban',
      'feedbackKanban',
      'acKeywordKanban',
      'adKeywordKanban',
      'adIneligibleKanban',
    ],
    // 自定义显示
    customCols: storage.get('biBoardCustomCols') || {
      fisKanban: true,
      ajKanban: true,
      followKanban: true,
      buyboxPercentageKanban: true,
      mailKanban: true,
      reviewKanban: true,
      feedbackKanban: true,
      acKeywordKanban: true,
      adKeywordKanban: true,
      adIneligibleKanban: true,
    },
    data: {
      // 现有库存预计可售
      fisKanban: [{
        asin: '',
        sku: '',
        img: '',
        availableDays: 0,
      }],
      // 智能调价
      ajKanban: [{
        ruleName: '',
        ajFrequency: 0,
      }],
      // 跟卖监控
      followKanban: {
        monitoringCount: 0,
        followAsinCount: 0,
        followAsinNotJoninBuyboxAj: 0,
        buyboxLostAsinCount: 0,
        buyboxLostAsinNotJoninBuyboxAj: 0,
      },
      // 购物车占比
      buyboxPercentageKanban: {
        buyboxPercentage: [{
          asin: '',
          sku: '',
          img: '',
          isJoinFollowMonitoring: false,
          buyboxPercentage: 0,
        }],
        lastTime: '',
      },
      // 邮件
      mailKanban: {
        unMailNumber: 0,
        urgentMailTimeLeftHours: 0,
        urgentMailTimeLeftMinute: 0,
      },
      // Review
      reviewKanban: {
        oneStar: 0,
        oneStarUnanswered: 0,
        twoStar: 0,
        twoStarUnanswered: 0,
        threeStar: 0,
        threeStarUnanswered: 0,
        fourStar: 0,
        fourStarUnanswered: 0,
        fiveStar: 0,
        fiveStarUnanswered: 0,
      },
      // Feedback
      feedbackKanban: {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
      },
      // Amazon's Choice关键词
      acKeywordKanban: {
        asinInfos: [{
          asin: '',
          sku: '',
          img: '',
          addKeyword: '',
          titleNotIncluded: [],
          bpNotIncluded: [],
          descriptionNotIncluded: [],
        }],
        lastTime: '',
      },
      // 广告关键词表现
      adKeywordKanban: [{
        adCampaignsName: '',
        adGroupName: '',
        acos: 0,
        keyword: '',
      }],
      // 广告Ineligible原因
      adIneligibleKanban: [{
        asin: '',
        sku: '',
        img: '',
        Ineligible: '',
      }],
    },
  },

  effects: {
    *fetchKanbanData({ payload, callback }, { call, put }) {
      const res = yield call(queryKanbanData, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveKanbanData',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 添加跟卖监控
    *addCompetitorMonitor({ payload, callback }, { call, put }) {
      const res = yield call(addCompetitorMonitor, payload);
      if (res.code === 200) {
        yield put({
          type: 'saveCompetitorMonitor',
          payload,
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    // 保存看板数据
    saveKanbanData(state, { payload }) {
      const { data } = payload;
      state.data = data;
    },

    // 更新购物车占比卡片中的 asin 为已加入跟卖监控状态
    saveCompetitorMonitor(state, { payload }) {
      const { asin } = payload;
      const array = state.data.buyboxPercentageKanban.buyboxPercentage;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.asin === asin) {
          element.isJoinFollowMonitoring = true;
          return;
        }
      }
    },

    // 更新自定义列数据
    updateCustomCols(state, { payload }) {
      const newCustomCols = { ...state.customCols, ...payload };
      state.customCols = newCustomCols;
      storage.set('biBoardCustomCols', newCustomCols);
    },

    // 更新显示顺序
    updateQueue(state, { payload }) {
      state.queue = payload;
      storage.set('biBoardQueue', payload);
    },
  },
};

export default GoodsListModel;
