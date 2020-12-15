import { IModelType } from '@/models/connect';
import {
  queryMyVip,
  queryCodeUrl,
  querypayStatus,
  queryRenewInfo,
  queryUpgradeInfo,
} from '@/services/vip';
import vip0 from '@/assets/vip/vip0.png';
import vip1 from '@/assets/vip/vip1.png';
import vip2 from '@/assets/vip/vip2.png';
import vip3 from '@/assets/vip/vip3.png';

export interface IVipBuy {
  // 会员等级名称
  memberLevel: string;
  // 月费/年费
  typeOfFee: string;
  // 原价
  originalPrice: number;
  // 现价
  currentPrice: number;
}

export interface IVipModelState {
  data: {
    // 当前会员等级名称
    memberLevel: string;
    // 剩余有效天数
    validPeriod: string;
    // 功能余量
    functionalSurplus: {
      [key: string]: number;
    }[];
    // 付费记录
    paymentRecords: {
      paymentTime: string;
      orderNo: string;
      orderInfo: string;
      paymentMethod: string;
      paymentAmount: number;
    }[];
  };
  // 付款价格
  cost: number;
  // 续费信息
  renewInfo: {
    info: {
      memberLevel: string;
      validPeriod: string;
      vipList: IVipBuy[];
      seniorVipList: IVipBuy[];
      extremeVipList: IVipBuy[];
    };
    codeUrl: string;
    orderId: string;
    payStatus: boolean;
  };
  // 升级信息
  upgradeInfo: {
    info: {
      memberLevel: string;
      // 当前费用类型 月卡/年卡/普通会员
      typeOfFee: '0' | '1' | null;
      validPeriod: string;
      // 当前会员价格，用于计算升级实付价格
      price: number;
      vipList: IVipBuy[];
      seniorVipList: IVipBuy[];
      extremeVipList: IVipBuy[];
    };
    codeUrl: string;
    orderId: string;
    payStatus: boolean;
  };
}

interface IVipModelType extends IModelType {
  namespace: 'vip';
  state: IVipModelState;
}

export const vipIconDict = {
  '普通会员': vip0,
  'VIP': vip1,
  '高级VIP': vip2,
  '至尊VIP': vip3,
};

export const vipLevelToNumberDict = {
  '普通会员': 0,
  'VIP': 1,
  '高级VIP': 2,
  '至尊VIP': 3,
};

export const vipNumberToLevelDict = {
  '0': '普通会员',
  '1': 'VIP',
  '2': '高级VIP',
  '3': '至尊VIP',
};

export const typeOfFeeToChineseDict = {
  '1': '月',
  '2': '年',
};

const GoodsListModel: IVipModelType = {
  namespace: 'vip',
  state: {
    data: {
      memberLevel: '普通会员',
      validPeriod: '0',
      functionalSurplus: [],
      paymentRecords: [{
        paymentTime: '2000-01-01 00:00:00',
        orderNo: '',
        orderInfo: '',
        paymentMethod: '',
        paymentAmount: 0,
      }],
    },
    cost: 0,
    renewInfo: {
      info: {
        memberLevel: '',
        validPeriod: '0',
        vipList: [],
        seniorVipList: [],
        extremeVipList: [],
      },
      codeUrl: '',
      orderId: '',
      payStatus: false,
    },
    upgradeInfo: {
      info: {
        memberLevel: '',
        typeOfFee: null,
        validPeriod: '0',
        price: 0,
        vipList: [],
        seniorVipList: [],
        extremeVipList: [],
      },
      codeUrl: '',
      orderId: '',
      payStatus: false,
    },
  },

  effects: {
    *fetchMyVipInfo({ payload, callback }, { call, put }) {
      const res = yield call(queryMyVip, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveMyVipInfo',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取续费信息
    *fetchRenewInfo({ callback }, { call, put }) {
      const res = yield call(queryRenewInfo);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveRenewInfo',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取续费的 code_url
    *fetchRenewCodeUrl({ payload, callback }, { call, put }) {
      const res = yield call(queryCodeUrl, payload);
      if (res.code === 200) {
        const { data: { advancePaymentInfo: { codeUrl, orderId } } } = res;
        yield put({
          type: 'saveRenewCodeUrl',
          payload: {
            codeUrl,
            orderId,
          },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取升级信息
    *fetchUpgradeInfo({ callback }, { call, put }) {
      const res = yield call(queryUpgradeInfo);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveUpgradeInfo',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 获取升级的 code_url
    *fetchUpgradeCodeUrl({ payload, callback }, { call, put }) {
      const res = yield call(queryCodeUrl, payload);
      if (res.code === 200) {
        const { data: { advancePaymentInfo: { codeUrl, orderId } } } = res;
        yield put({
          type: 'saveUpgradeCodeUrl',
          payload: {
            codeUrl,
            orderId,
          },
        });
      }
      callback && callback(res.code, res.message);
    },

    // poll 轮询支付结果
    pollPayStatus: [
      function* ({ payload, callback }, { call, put }) {
        const { orderId, type } = payload;
        const res = yield call(querypayStatus, { orderId });
        if (res.code === 200) {
          const reducersDict = {
            renew: 'saveRenewPayStatus',
            upgrade: 'saveUpgradePayStatus',
          };
          const { data: { payStatus } } = res;
          yield put({
            type: reducersDict[type],
            payload: { payStatus },
          });
        }
        callback && callback(res.code, res.message);
      },
      { type: 'poll', delay: 3000 },
    ],
  },

  reducers: {
    // 保存我的 vip 信息
    saveMyVipInfo(state, { payload }) {
      state.data = payload.data;
    },

    // 保存续费信息
    saveRenewInfo(state, { payload }) {
      const { data } = payload;
      state.renewInfo.info = data;
    },

    // 保存续费二维码链接
    saveRenewCodeUrl(state, { payload }) {
      const { codeUrl, orderId } = payload;
      state.renewInfo.codeUrl = codeUrl;
      state.renewInfo.orderId = orderId;
    },

    // 保存续费支付状态
    saveRenewPayStatus(state, { payload }) {
      const { payStatus } = payload;
      state.renewInfo.payStatus = payStatus;
    },

    // 保存升级信息
    saveUpgradeInfo(state, { payload }) {
      const { data } = payload;
      state.upgradeInfo.info = data;
    },

    // 保存升级二维码链接
    saveUpgradeCodeUrl(state, { payload }) {
      const { codeUrl, orderId } = payload;
      state.upgradeInfo.codeUrl = codeUrl;
      state.upgradeInfo.orderId = orderId;
    },

    // 保存升级支付状态
    saveUpgradePayStatus(state, { payload }) {
      const { payStatus } = payload;
      state.upgradeInfo.payStatus = payStatus;
    },
  },
};

export default GoodsListModel;
