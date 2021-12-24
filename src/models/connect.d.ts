import { MenuDataItem } from '@ant-design/pro-layout';
import { IGoodsListModelState } from './goodsList';
import { IReplenishmentModelState } from './replenishment';
import { IStoreReportModelState } from './storeReport';
import { IStoreDetailModelState } from './storeDetail';
import { IBsModelState } from './bs';
import { IBiBoardModelState } from './biBoard';
import { IAdManage } from './adManage';
import { IVipModelState } from './vip';
import { IGlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { IUserModelState } from './user';
import { ISubModelState } from './sub';
import { IMailModelState } from './mail';
import { IComProState } from '@/pages/asinPandect/models/comPro';
import { IAsinGlobalType } from '@/pages/asinPandect/models/global';
import { StateType } from './login';
import { Effect, ImmerReducer, Subscription, Dispatch } from 'umi';

export { IGlobalModelState, SettingModelState, IUserModelState };

export interface IModelType {
  effects?: {
    [key: string]: Effect | [Effect, { type: string; delay?: number; ms?: number }];
  };
  reducers?: {
    [key: string]: ImmerReducer;
  };
  subscriptions?: {
    [key: string]: Subscription;
  };
}

export interface ILoading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface IConnectState {
  global: IGlobalModelState;
  goodsList: IGoodsListModelState;
  replenishment: IReplenishmentModelState;
  storeReport: IStoreReportModelState;
  storeDetail: IStoreDetailModelState;
  bs: IBsModelState;
  biBoard: IBiBoardModelState;
  adManage: IAdManage;
  vip: IVipModelState;
  loading: ILoading;
  settings: SettingModelState;
  user: IUserModelState;
  login: StateType;
  sub: ISubModelState;
  mail: IMailModelState;
  comPro: IComProState;
  asinGlobal: IAsinGlobalType['state'];
}

export interface IRoute extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface IConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<Action>;
}
