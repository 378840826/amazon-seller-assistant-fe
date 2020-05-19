import { IModelType } from './connect';
import { queryUnreadNotices } from '@/services/notices';
import { queryMwsShopList, queryPpcShopList } from '@/services/shop';
import { storage } from '@/utils/utils';
import { Modal } from 'antd';
import { router } from 'umi';

const { confirm } = Modal;

export interface IGlobalModelState {
  unreadNotices: API.IUnreadNotices;
  shop: IShopSelector;
  breadcrumbs: string;
}

export interface IShopSelector {
  status: 'normal' | 'hidden' | 'disabled';
  type: 'mws' | 'ppc';
  current: API.IShop;
  mws: Array<API.IShop>;
  ppc: Array<API.IShop>;
}

interface IGlobalModelType extends IModelType {
  namespace: 'global';
  state: IGlobalModelState;
}

const GlobalModel: IGlobalModelType = {
  namespace: 'global',

  state: {
    // 未读消息数量
    unreadNotices: {
      reviewRemindCount: 0,
      stockRemindCount: 0,
    },
    // 店铺选择
    shop: {
      status: 'normal',
      type: window.location.pathname.includes('/ppc') ? 'ppc' : 'mws',
      current: {
        id: -1,
        site: 'US',
        shopName: '正在加载店铺数据',
        sellerId: '',
        token: '',
        switch: false,
        currency: '$',
        tokenInvalid: false,
        timezone: '',
      },
      mws: [],
      ppc: [],
    },
    // 面包屑
    breadcrumbs: '',
  },

  effects: {
    // 获取未读消息数量
    *fetchUnreadNotices(_, { call, put }) {
      const response = yield call(queryUnreadNotices);
      yield put({
        type: 'saveUnreadNotices',
        payload: response,
      });
    },

    // 获取全部店铺
    *fetchShopList({ payload: { type } }, { call, put }) {
      const mws = yield call(queryMwsShopList);
      const ppc = yield call(queryPpcShopList);
      yield put({
        type: 'saveShopList',
        payload: {
          mws: mws.data,
          ppc: ppc.data,
          type,
        },
      });
    },
  },

  reducers: {
    saveUnreadNotices(state, { payload }) {
      return {
        ...state,
        unreadNotices: payload.data.unreadNotices,
      };
    },

    // 保存店铺数据
    saveShopList(state, { payload }) {
      // 检查 localStorage 的 currentShop 是否存在于当前 shopList
      const currentShop = storage.get('currentShop');
      const list = payload[payload.type];
      const current = list.some((shop: API.IShop) => shop.id === currentShop.id)
        ? currentShop
        : list[0];
      storage.set('currentShop', current);
      return {
        ...state,
        shop: {
          ...state.shop,
          mws: payload.mws,
          ppc: payload.ppc,
          type: payload.type,
          current,
        },
      };
    },

    // 切换店铺
    setCurrentShop(state, { payload }) {
      const shopList = state.shop.type === 'mws'
        ? state.shop.mws
        : state.shop.ppc;
      let current = undefined;
      shopList.forEach((shop: API.IShop) => {
        if (shop.id === payload.id) {
          current = shop;
        }
      });
      storage.set('currentShop', current);
      return {
        ...state,
        shop: {
          ...state.shop,
          current,
        },
      };
    },

    // 切换店铺类型
    switchShopType(state, { payload }) {
      const { type } = payload;
      if (state.shop.type === type) {
        return { ...state };
      }
      const oldShop = storage.get('currentShop');
      let current = undefined;
      const newShopList = state.shop[type];
      for (let index = 0; index < newShopList.length; index++) {
        const shop = newShopList[index];
        if (shop.sellerId === oldShop.sellerId && shop.site === oldShop.site) {
          current = shop;
          break;
        }
      }
      // 若没有相同的店铺，显示第一个店铺，并提示去添加店铺
      if (current === undefined) {
        current = newShopList[0];
        const { shopName, site } = current;
        const text = type === 'ppc' ? '授权' : '绑定';
        const url = type === 'ppc' ? '/' : '/';
        confirm({
          title: `店铺 ${site} : ${shopName} 未${text}`,
          okText: `去${text}`,
          cancelText: '取消',
          onOk() {
            router.push(url);
          },
        });
      }
      storage.set('currentShop', current);
      return {
        ...state,
        shop: {
          ...state.shop,
          type,
          current,
        },
      };
    },

    // 切换店铺选择器状态
    switchShopStatus(state, { payload }) {
      const { status } = payload;
      if (state.shop.status === status) {
        return { ...state };
      }
      return {
        ...state,
        shop: {
          ...state.shop,
          status: payload.status,
        },
      };
    },
  },

  subscriptions: {
    // 监听路由切换，修改店铺类型或店铺选择器状态
    // 广告 <=> 非广告店铺类型切换 或 隐藏 / 禁用 店铺选择器状态切换
    listen({ dispatch, history }) {
      return history.listen(async ({ pathname }) => {
        let type = '';
        if (pathname.includes('/ppc')) {
          type = 'ppc';
        } else if (pathname.includes('/mws')) {
          type = 'mws';
        }
        type && dispatch({
          type: 'switchShopType',
          payload: { type },
        });
        const hiddenShopSelectorUrl = [
          '/mws/shop/list',
          '/mws/shop/bind',
          '/mws/overview',
          '/ppc/overview',
          '/ppc/auth',
        ];
        const disabledShopSelectorUrl = [
          '/ppc/campaign/add',
          '/ppc/group/add',
        ];
        const isHidden = hiddenShopSelectorUrl.some(path => path === pathname);
        const isDisabled = disabledShopSelectorUrl.some(path => path === pathname);
        let status = 'normal';
        if (isHidden) {
          status = 'hidden';
        } else if (isDisabled) {
          status = 'disabled';
        }
        dispatch({
          type: 'switchShopStatus',
          payload: { status },
        });
      });
    },
  },
};

export default GlobalModel;
