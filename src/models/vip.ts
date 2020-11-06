import { IModelType } from '@/models/connect';
import {
  queryMyVip,
  queryRenewCodeUrl,
} from '@/services/vip';
import vip0 from '@/assets/vip/vip0.png';
import vip1 from '@/assets/vip/vip1.png';
import vip2 from '@/assets/vip/vip2.png';
import vip3 from '@/assets/vip/vip3.png';

export interface IVipModelState {
  data: {
    level: number;
    isBilledAnnually: boolean;
    remainDays: number | string;
    residue: {
      [key: string]: number;
    };
    paymentHistory: {
      time: string;
      orderId: string;
      orderDetail: string;
      payment: string;
      cost: number;
    }[];
  };
  // 付款价格
  cost: number;
  // 续费二维码链接
  renewCodeUrl: string;
}

interface IVipModelType extends IModelType {
  namespace: 'vip';
  state: IVipModelState;
}

export const vipLevelDict = {
  0: {
    name: '普通会员',
    icon: vip0,
    month: {
      price: 0,
      originalPrice: 0,
    },
    year: {
      price: 0,
      originalPrice: 0,
    },
  },
  1: {
    name: 'VIP',
    icon: vip1,
    month: {
      price: 299,
      originalPrice: 299,
    },
    year: {
      price: 2999,
      originalPrice: 3588,
    },
  },
  2: {
    name: '高级VIP',
    icon: vip2,
    month: {
      price: 499,
      originalPrice: 499,
    },
    year: {
      price: 4999,
      originalPrice: 5988,
    },
  },
  3: {
    name: '至尊VIP',
    icon: vip3,
    month: {
      price: 999,
      originalPrice: 999,
    },
    year: {
      price: 9999,
      originalPrice: 11988,
    },
  },
};

const GoodsListModel: IVipModelType = {
  namespace: 'vip',
  state: {
    data: {
      level: 0,
      isBilledAnnually: false,
      remainDays: '—',
      residue: {
        mwsShop: 0,
        ppcShop: 0,
        subAccount: 0,
        reprice: 0,
        asinReport: 0,
        asinMonitor: 0,
        competitorMonitor: 0,
        reviewMonitor: 0,
        autoMail: 0,
        replenishmentExport: 0,
        ppcTrusteeship: 0,
      },
      paymentHistory: [{
        time: '2000-01-01 00:00:00',
        orderId: '',
        orderDetail: '',
        payment: '',
        cost: 0,
      }],
    },
    cost: 0,
    renewCodeUrl: '网络有点问题，请稍后刷新页面重试。',
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

    // 获取续费的 code_url
    *fetchRenewCodeUrl({ payload, callback }, { call, put }) {
      const res = yield call(queryRenewCodeUrl, payload);
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveRenewCodeUrl',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    // 保存我的 vip 信息
    saveMyVipInfo(state, { payload }) {
      state.data = payload.data;
    },

    // 保存续费二维码链接
    saveRenewCodeUrl(state, { payload }) {
      state.renewCodeUrl = payload.data;
    },
  },
};

export default GoodsListModel;
