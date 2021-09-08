import { IModelType, IConnectState } from './connect';
import { queryUnreadNotices } from '@/services/notices';
import {
  queryShopList,
  modifyShopAutoPrice,
  unbindShop,
  renameShop,
  updateShopToken,
  adAuthorize,
  cancelAdAuthorize,
  bindShop,
} from '@/services/shop';
import { storage } from '@/utils/utils';
import { Modal, message } from 'antd';
import { history } from 'umi';
import {
  configHiddenShopSelectorUrl,
  configDisabledShopSelectorUrl,
  configUnshownPageTitleUrl,
} from '../../config/config.routes';
import { notTagShopHint } from './config/array';

const { confirm } = Modal;

export interface IGlobalModelState {
  isShowPageTitle: boolean;
  unreadNotices: API.IUnreadNotices;
  shop: IShopSelector;
}

export interface IShopSelector {
  status: 'normal' | 'hidden' | 'disabled';
  current: API.IShop;
  list: API.IShop[];
}

interface IGlobalModelType extends IModelType {
  namespace: 'global';
  state: IGlobalModelState;
}

const GlobalModel: IGlobalModelType = {
  namespace: 'global',

  state: {
    // 是否渲染统一的页面标题
    isShowPageTitle: true,
    // 未读消息数量
    unreadNotices: {
      reviewRemindCount: 0, // 监控评论未读数
      stockRemindCount: 0, // 库存未读数
      allUnReadCount: 0, // 全部未读数
      followUnReadCount: 0, // 跟卖未读消息数
    },
    // 店铺选择
    shop: {
      status: 'normal',
      current: {
        id: '-1',
        marketplace: 'US',
        storeName: '正在加载店铺数据',
        sellerId: '',
        token: '',
        autoPrice: false,
        currency: '$',
        tokenInvalid: false,
        timezone: '',
        bindAdStore: false,
      },
      list: [],
    },
  },

  effects: {
    // 获取未读消息数量
    *fetchUnreadNotices(_, { call, put }) {
      const response = yield call(queryUnreadNotices);
      if (response.code === 200){
        yield put({
          type: 'saveUnreadNotices',
          payload: response,
        });
      }
     
    },

    // 获取全部店铺
    *fetchShopList(_, { call, put }) {
      const res = yield call(queryShopList);
      yield put({
        type: 'saveShopList',
        payload: {
          list: res.data.records,
        },
      });
    },

    // 切换店铺总开关
    *switchShopAutoPrice({ payload: { id, autoPrice }, callback }, { call, put }) {
      const res = yield call(modifyShopAutoPrice, { storeId: id, autoPrice });
      if (res.code === 200) {
        yield put({
          type: 'saveShopAutoPrice',
          payload: {
            id,
            autoPrice,
          },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 解绑店铺
    *unbindShop({ payload: { storeId }, callback }, { select, call, put }) {
      const res = yield call(unbindShop, { storeId });
      if (res.code === 200) {
        const currentShop = yield select((state: IConnectState) => {
          return state.global.shop.current;
        });
        // 如果删除的是当前选中的店铺，刷新页面避免店铺选择器错误
        if (storeId === currentShop.id) {
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          yield put({
            type: 'deleteShop',
            payload: { id: storeId },
          });
          // 更新可绑定店铺数量
          yield put({
            type: 'user/updateMemberFunctionalSurplus',
            payload: {
              functionName: '绑定店铺',
              quantity: -1,
            },
          });
        }
      }
      callback && callback(res.code, res.message);
    },

    // 修改店铺名称
    *modifyShopName({ payload: { storeId, storeName }, callback }, { call, put }) {
      const res = yield call(renameShop, { storeId, storeName });
      if (res.code === 200) {
        yield put({
          type: 'renameShop',
          payload: { storeId, storeName },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 更新店铺 Auth Token
    *modifyShopToken({ payload: { id, token }, callback }, { call, put }) {
      const res = yield call(updateShopToken, { storeId: id, token });
      if (res.code === 200) {
        yield put({
          type: 'updateShopToken',
          payload: { id, token },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 绑定店铺
    *bindShop({ payload, callback }, { call, put, select }) {
      const { sellerId, storeName, token, europe, northAmerica, asiaPacific } = payload;
      const marketplaces = [].concat(northAmerica || [], europe || [], asiaPacific || []);
      // 判断绑定店铺的数量和剩余可绑定的数量
      const memberFunctionalSurplus: { functionName: string; frequency: number }[] = yield select(
        (state: IConnectState) => {
          return state.user.currentUser.memberFunctionalSurplus;
        }
      );
      // 可绑定店铺的数量
      const remaining = memberFunctionalSurplus?.find(item => 
        item.functionName === '绑定店铺'
      )?.frequency || 0;
      // 不能超过可绑定店铺的数量
      if (marketplaces.length > remaining) {
        message.error(`当前会员等级剩余可绑定店铺：${remaining}个`);
        return;
      }
      const res = yield call(bindShop, { sellerId, storeName, token, marketplaces });

      if (res.code === 200) {
        // 接口没有返回绑定成功的店铺，重新获取店铺列表
        yield put({
          type: 'fetchShopList',
        });
      }
      callback && callback(res.code, res.message);
    },

    // 广告店铺授权
    *adAuthorize({ payload, callback }, { call, put }) {
      const res = yield call(adAuthorize, payload);
      if (res.code === 200) {
        // 修改授权状态
        yield put({
          type: 'updateShopAdAuthorize',
          payload: {
            ...payload,
            bindAdStore: true,
          },
        });
      }
      callback && callback(res.code, res.message);
    },

    //取消广告店铺授权
    *cancelAdAuthorize({ payload, callback }, { call, put }) {
      const res = yield call(cancelAdAuthorize, payload);
      if (res.code === 200) {
        // 修改授权状态
        yield put({
          type: 'updateShopAdAuthorize',
          payload: {
            ...payload,
            bindAdStore: false,
          },
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    saveUnreadNotices(state, { payload }) {
      if (payload.code === 200) {
        const {
          reviewUnReadCount,
          allUnReadCount,
          followUnReadCount,
        } = payload.data;
        state.unreadNotices.reviewRemindCount = reviewUnReadCount;
        state.unreadNotices.allUnReadCount = allUnReadCount;
        state.unreadNotices.followUnReadCount = followUnReadCount;
      }
    },

    // 切换是否渲染统一的页面标题
    switchShowPageTitle(state, { payload }) {
      const { isShow } = payload;
      state.isShowPageTitle = isShow;
    },

    // 保存店铺数据
    saveShopList(state, { payload }) {
      // 检查 localStorage 的 currentShop 是否存在于当前 shopList
      const currentShop = storage.get('currentShop');
      const list = payload.list;
      const current = list.some((shop: API.IShop) => shop.id === currentShop.id)
        ? currentShop
        : list[0] || {};
      storage.set('currentShop', current);
      // 店铺按名称排序
      const compare = (a: API.IShop, b: API.IShop) => (
        a.storeName > b.storeName ? 1 : -1
      );
      state.shop = {
        status: state.shop.status,
        list: list.sort(compare),
        current,
      };
    },

    // 修改店铺授权状态
    updateShopAdAuthorize(state, { payload }) {
      const { bindAdStore, storeId, sellerId } = payload;
      const list = state.shop.list;
      // 授权, 相同 sellerId 下的店铺都会授权成功
      if (bindAdStore) {
        for (let index = 0; index < list.length; index++) {
          const shop = list[index];
          if (shop.sellerId === sellerId) {
            shop.bindAdStore = true;
          }
        }
      } else {
        // 取消授权，只取消单个店铺
        for (let index = 0; index < list.length; index++) {
          const shop = list[index];
          if (shop.id === storeId) {
            shop.bindAdStore = false;
            break;
          }
        }
      }
      // 修改选中店铺
      if (state.shop.current.id === storeId) {
        state.shop.current.bindAdStore = bindAdStore;
        storage.set('currentShop', state.shop.current);
      }
    },

    // 切换店铺
    setCurrentShop(state, { payload }) {
      const shopList = state.shop.list;
      let current = undefined;
      shopList.forEach((shop: API.IShop) => {
        if (shop.id === payload.id) {
          current = shop;
        }
      });
      storage.set('currentShop', current);
      state.shop.current = current;
    },


    // 切换店铺选择器状态
    switchShopStatus(state, { payload }) {
      const { status } = payload;
      if (state.shop.status === status) {
        return { ...state };
      }
      state.shop.status = status;
    },

    // 切换店铺总开关
    saveShopAutoPrice(state, { payload }) {
      const { id, autoPrice } = payload;
      const list = state.shop.list;
      for (let index = 0; index < list.length; index++) {
        const shop = list[index];
        if (shop.id === id) {
          shop.autoPrice = autoPrice;
          break;
        }
      }
      if (state.shop.current.id === id) {
        state.shop.current.autoPrice = autoPrice;
        storage.set('currentShop', state.shop.current);
      }
    },

    // 删除店铺数据
    deleteShop(state, { payload }) {
      const { id } = payload;
      const list = state.shop.list;
      for (let index = 0; index < list.length; index++) {
        const shop = list[index];
        if (shop.id === id) {
          list.splice(index, 1);
          break;
        }
      }
    },
    
    // 重命名店铺
    renameShop(state, { payload }) {
      const { storeId, storeName } = payload;
      const list = state.shop.list;
      for (let index = 0; index < list.length; index++) {
        const shop = list[index];
        if (shop.id === storeId) {
          shop.storeName = storeName;
          break;
        }
      }
      if (state.shop.current.id === storeId) {
        state.shop.current.storeName = storeName;
        storage.set('currentShop', state.shop.current);
      }
    },

    // 更新店铺 Auth Token
    updateShopToken(state, { payload }) {
      const { id, token } = payload;
      const list = state.shop.list;
      for (let index = 0; index < list.length; index++) {
        const shop = list[index];
        if (shop.id === id) {
          shop.token = token;
          break;
        }
      }
      if (state.shop.current.id === id) {
        state.shop.current.token = token;
        storage.set('currentShop', state.shop.current);
      }
    },

    // 当前店铺切换回切换之前的店铺
    saveHistoryShop(state) {
      const historyShop = { ...state.shop.current };
      storage.set('currentShop', historyShop);
      state.shop.current = historyShop;
    },
  },

  subscriptions: {
    // 监听路由切换，修改店铺选择器状态
    // 广告 <=> 非广告店铺类型切换不再需要判断，只监听隐藏/禁用店铺选择器状态切换
    listen({ dispatch, history }) {
      return history.listen(async ({ pathname }) => {
        const isHidden = configHiddenShopSelectorUrl.some(path => path === pathname);
        const isDisabled = configDisabledShopSelectorUrl.some(path => path === pathname);
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
        const isUnshow = configUnshownPageTitleUrl.some(path => path === pathname);
        dispatch({
          type: 'switchShowPageTitle',
          payload: { isShow: !isUnshow },
        });
      });
    },

    // 监听店铺是否已切换（多开标签页时切换店铺、另一标签页提示）
    watchShop({ dispatch, history: umiHistory }) {
      const bindFunction = function(e: StorageEvent) {
        const key = e.key;
        if (key === 'currentShop') {
          const box = document.querySelector('.g-shop-current-box');
          const site = box?.querySelector('.g-shop-current-site')?.innerHTML;
          const shopName = box?.querySelector('.g-shop-current-shopName')?.innerHTML;
          const current = JSON.parse(e.newValue as string);

          Modal.destroyAll();

          // 判断当前页面的店铺是否和最新的店铺是否相同
          if (current.storeName === shopName && current.marketplace === site) {
            // 经常N次切换店铺后，又回到了最初切换店铺时，弹窗去掉
            return;
          }

          confirm({
            title: `店铺已切换！`,
            okText: `刷新查看新店铺`,
            cancelText: '继续浏览原店铺',
            centered: true,
            icon: null,
            className: 'g-watch-shop-modal',
            zIndex: 99999,
            onOk() {
              history.go();
            },
            onCancel() {
              dispatch({
                type: 'saveHistoryShop',
              });
            },
          });
        }
      };

      umiHistory.listen(async ( { pathname }) => {
        if (notTagShopHint.indexOf(pathname) > -1) {
          window.removeEventListener('storage', bindFunction);
          return;
        }
        window.addEventListener('storage', bindFunction);
      });
    },
  },
};

export default GlobalModel;
