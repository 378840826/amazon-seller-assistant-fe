import { AnyAction } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { IGlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { IUserModelState } from './user';
import { StateType } from './login';
import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

export { IGlobalModelState, SettingModelState, IUserModelState };

export interface IModelType {
  effects?: {
    [key: string]: Effect;
  };
  reducers?: {
    [key: string]: Reducer;
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
  loading: ILoading;
  settings: SettingModelState;
  user: IUserModelState;
  login: StateType;
}

export interface IRoute extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface IConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
