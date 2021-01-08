import { IModelType, IConnectState } from './connect';
import { queryUnreadNotices } from '@/services/notices';
import {
  queryMwsShopList,
  // queryPpcShopList,
  modifyShopAutoPrice,
  unbindShop,
  renameShop,
  updateShopToken,
  bindShop,
} from '@/services/shop';
import { storage } from '@/utils/utils';
import { Modal, message } from 'antd';
import { history } from 'umi';
import { 
  ruleAddRouter, 
  ruleAddSalesRouter,
  ruleAddCartRouter,
  ruleAddCompetitorRouter,
} from '@/utils/routes';

const { confirm } = Modal;

export interface IGlobalModelState {
  isShowPageTitle: boolean;
  unreadNotices: API.IUnreadNotices;
  shop: IShopSelector;
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
      type: window.location.pathname.includes('/ppc') ? 'ppc' : 'mws',
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
      },
      mws: [],
      ppc: [],
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
    *fetchShopList({ payload: { type } }, { call, put }) {
      const mws = yield call(queryMwsShopList);
      // const ppc = yield call(queryPpcShopList);
      const ppc = { data: { records: [] } };
      yield put({
        type: 'saveShopList',
        payload: {
          mws: mws.data.records,
          ppc: ppc.data.records,
          type,
        },
      });
    },

    // 切换 mws 店铺总开关
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

    // 解绑 mws 店铺
    *unbindMwsShop({ payload: { storeId }, callback }, { select, call, put }) {
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
            type: 'deleteMwsShop',
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

    // 修改 mws 店铺名称
    *modifyMwsShopName({ payload: { storeId, storeName }, callback }, { call, put }) {
      const res = yield call(renameShop, { storeId, storeName });
      if (res.code === 200) {
        yield put({
          type: 'renameMwsShop',
          payload: { storeId, storeName },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 更新 mws 店铺 Auth Token
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

    // 绑定 mws 店铺
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
      console.log(res, 'res');
      if (res.code === 200) {
        // 接口没有返回绑定成功的店铺，重新获取店铺列表
        yield put({
          type: 'fetchShopList',
          payload: { type: 'mws' },
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
      const list = payload[payload.type];
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
        mws: payload.mws.sort(compare),
        ppc: payload.ppc,
        type: payload.type,
        current,
      };
      // 如果没有店铺跳转到添加店铺页面
      if (current.id === undefined) {
        const { pathname } = window.location;
        // 不需要绑定店铺的
        const exclude = [
          '/vip/instructions',
          '/overview',
          '/users',
          '/center',
          '/message',
          '/sub-account',
        ];
        const isExclude = exclude.some(url => pathname.includes(url));
        if (!isExclude) {
          // message.destroy();
          const url = payload.type === 'mws' ? '/shop/list' : '/ppc/shop/list';
          !pathname.includes('/shop/') && history.push(url);
        }
      }
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
      state.shop.current = current;
    },

    // 切换店铺类型 + 没有添加店铺跳转到添加页面
    switchShopType(state, { payload }) {
      const { type, pathname } = payload;
      // 如果没有添加店铺，跳转到对应的添加店铺页
      const url = type === 'mws' ? '/shop/list' : '/ppc/shop/list';
      const { shop } = state;
      if (shop.type === type) {
        if (shop[type].length === 0 && shop.current.id > -1 && !pathname.includes('/shop/')) {
          history.push(url);
        }
        return { ...state };
      }
      const oldShop = storage.get('currentShop');
      let current = undefined;
      const newShopList = state.shop[type];
      // 如果切换后的店铺类型中没有添加店铺，跳转到对应的添加店铺页
      if ((!newShopList || newShopList.length === 0) && !pathname.includes('/shop/')) {
        history.push(url);
        const { shop } = state;
        return { ...state, shop: { ...shop, type } };
      }
      for (let index = 0; index < newShopList.length; index++) {
        const shop = newShopList[index];
        if (shop.sellerId === oldShop.sellerId && shop.marketplace === oldShop.marketplace) {
          current = shop;
          break;
        }
      }
      // 若没有相同的店铺，显示第一个店铺，并提示去添加店铺
      if (current === undefined) {
        current = newShopList[0];
        const { storeName, marketplace } = current;
        const text = type === 'ppc' ? '授权' : '绑定';
        const url = type === 'ppc' ? '/' : '/';
        confirm({
          title: `店铺 ${marketplace} : ${storeName} 未${text}`,
          okText: `去${text}`,
          cancelText: '取消',
          centered: true,
          onOk() {
            history.push(url);
          },
        });
      }
      storage.set('currentShop', current);
      state.shop.type = type;
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
      const list = state.shop.mws;
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

    // 解绑 mws 店铺
    deleteMwsShop(state, { payload }) {
      const { id } = payload;
      const list = state.shop.mws;
      for (let index = 0; index < list.length; index++) {
        const shop = list[index];
        if (shop.id === id) {
          list.splice(index, 1);
          break;
        }
      }
    },
    
    // 重命名 mws 店铺
    renameMwsShop(state, { payload }) {
      const { storeId, storeName } = payload;
      const list = state.shop.mws;
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
      const list = state.shop.mws;
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
    // 监听路由切换，修改店铺类型或店铺选择器状态
    // 广告 <=> 非广告店铺类型切换 或 隐藏 / 禁用 店铺选择器状态切换
    listen({ dispatch, history }) {
      return history.listen(async ({ pathname }) => {
        let type = '';
        if (pathname.includes('/ppc/')) {
          type = 'ppc';
        } else {
          type = 'mws';
        }
        type && dispatch({
          type: 'switchShopType',
          payload: { type, pathname },
        });
        const hiddenShopSelectorUrl = [
          '/shop/list',
          '/shop/bind',
          '/overview',
          '/ppc/overview',
          '/ppc/auth',
          '/center',
          '/sub-account',
        ];
        const disabledShopSelectorUrl = [
          '/ppc/campaign/add',
          '/ppc/group/add',
          '/competitor/history',
          '/competitor/list',
          ruleAddRouter,
          ruleAddSalesRouter,
          ruleAddCartRouter,
          ruleAddCompetitorRouter,
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
        // 不需要渲染统一样式的页面标题的页面的路由
        const unshownPageTitleUrl = [
          '/product/error-report',
          '/shop/bind',
          // 因 bs导入 页面标题需要特殊的样式
          '/report/import',
          '/competitor/list',
          '/competitor/history',
          '/mail/summary',
          '/mail/inbox',
          '/mail/reply',
          '/mail/no-reply',
          '/mail/outbox',
          '/mail/send-success',
          '/mail/send-fail',
          '/mail/sending',
          '/mail/rule',
          '/mail/template',
          '/dynamic/asin-overview',
          '/dynamic/asin-monitor',
          ruleAddRouter,
          ruleAddSalesRouter,
          ruleAddCartRouter,
          ruleAddCompetitorRouter,
          '/dynamic/rank-monitor',
        ];
        const isUnshow = unshownPageTitleUrl.some(path => path === pathname);
        dispatch({
          type: 'switchShowPageTitle',
          payload: { isShow: !isUnshow },
        });
      });
    },

    // 监听店铺是否已切换（多开标签页时切换店铺、另一标签页提示）
    watchShop({ dispatch, history: umiHistory }) {
      // 异步的、放在里面比较安全
      umiHistory.listen(() => {
        const pathname = umiHistory.location.pathname;
        const excludeUrls = [
          '/',
          '/#fun',
          '/#home',
          '/#fqa',
          '/index/crx',
          '/users/send-email',
          '/users/login',
          '/center',
          '/vip/membership',
          '/shop/list',
          '/shop/bind',
        ];

        if (excludeUrls.indexOf(pathname) > -1) {
          return;
        }
        
        window.addEventListener('storage', e => {
          const key = e.key;
          if (key === 'currentShop') {
            Modal.destroyAll();
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
        });
      });
    },
  },
};

export default GlobalModel;
