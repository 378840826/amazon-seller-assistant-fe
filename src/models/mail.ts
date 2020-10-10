import { ReactText } from 'react';
import { IModelType } from './connect.d';
import { message } from 'antd';
import { ITemplateData } from '@/pages/mws/mail/template';
import { 
  getUnreadMail,
  getStatisticalList,
  getReceiveEmailList,
  updateStatus,
  receiveReplayPage,
  sendListReplayPage,
  tankTemplateList,
  receiveListTemplateLoad,
  sendListTemplateLoad,
  getSendList,
  getRuleList,
  switchRule,
  deleteRule,
  addRule,
  updateRule,
  saveAddRule,
  saveUpdateRule,
  getTemplateList,
  switchTemplate,
  deleteTemplateList,
  updateTemplate,
  saveTemplate,
  saveUpdateTemplate,
  receiveListEmailSubmit,
  sendListEmailSubmit,
} from '@/services/mail';
import { nTs } from '@/utils/utils';


const common = {
  msg: '', //列表非200的错误信息
  tableInfo: { //收件箱或者发件箱表格中的信息
    total: 0,
    current: 1,
    size: 20,
    pages: 0,
    records: [],
  },
  tableLoading: false,
  rowSelection: [], //表格选中的复选框选项
  id: -1, //选中的邮件id,为正值出现回复页面,默认-1
};

const receiveList = ['/mws/mail/inbox', '/mws/mail/reply', '/mws/mail/no-reply'];

export interface ITemplates{
  templateSubject: string;
  templateName: string;
  templateType: string;
  templateId: number;
}
export interface IMailModelState{
  unreadCount: number;
  inbox: {
    msg: string;
    tableInfo: {
      total: number;
      current: number;
      size: number;
      pages: number;
      records: API.IParams[];
    };
    tableLoading: boolean;
    rowSelection: ReactText[];
    id: number | string;
  };
  templateList: ITemplates[];
}
export interface IMailModelType extends IModelType{
  namespace: 'mail';
  state: IMailModelState;
}
const mailModel: IMailModelType = {
  namespace: 'mail',
  state: {
    unreadCount: 0,
    inbox: common,
    templateList: [],
  },
  effects: {
    *getUnreadMail({ payload }, { call, put }){
      const response = yield call(getUnreadMail, payload);
      if (response.code === 200){
        yield put({
          type: 'saveUnreadMail',
          payload: response,
        });
      }
    },
    *getStatisticalList({ payload, callback }, { call }){
      const response = yield call(getStatisticalList, payload);
      nTs(response);
      if (response.code === 200){
        response.data.records.map((item: API.IParams, index: number) => {
          item.key = index;
        });
      }
      callback && callback(response);
    },
    //收件箱获取列表
    *getReceiveEmailList({ payload }, { call, put }){
      yield put({
        type: 'modifyInboxLoadingState',
        payload: true,
      });
      const response = yield call(getReceiveEmailList, payload);
      yield put({
        type: 'saveReceiveEmailList',
        payload: response,
      });
    },

    //收件箱修改 已读，未读，已回复，未回复
    *updateStatus({ payload, callback }, { call, put }){
      const response = yield call(updateStatus, payload);
      console.log('payload:', payload);
      if (response.code === 200){
        yield put({
          type: 'modifyInboxTableRecords',
          payload: payload.data,
        });
        callback && callback(response.message);
      } else {
        message.error(response.message);
      }
    },
    *receiveReplayPage({ payload, callback }, { call }){
      const response = yield call(receiveReplayPage, payload);
      nTs(response);
      callback && callback(response);
    },
    *sendListReplayPage({ payload, callback }, { call }){
      const response = yield call(sendListReplayPage, payload);
      nTs(response);
      callback && callback(response);
    },
    //收件箱和发件箱的模版列表获取 同一个连接
    *tankTemplateList({ payload, callback }, { call, put }){
      const response = yield call(tankTemplateList, payload);
      nTs(response);
      yield put({
        type: 'saveTemplateList',
        payload: response,
      });
      callback && callback();
    },
    //收件箱模版载入
    *receiveListTemplateLoad({ payload, callback }, { call }){
      const response = yield call(receiveListTemplateLoad, payload);
      nTs(response);
      if (response.code === 200){
        callback && callback(response.data);
      } else {
        message.error(response.message);
      }
    },
    //发件箱模版载入
    *sendListTemplateLoad({ payload, callback }, { call }){
      const response = yield call(sendListTemplateLoad, payload);
      nTs(response);
      if (response.code === 200){
        callback && callback(response.data);
      } else {
        message.error(response.message);
      }
    },
    //邮件提交
    *receiveOrSendEmailSubmit({ payload, callback }, { call }){
      const { pathname, StoreId, ...params } = payload;
      const formData = new FormData();
      Object.keys(params).map(key => {
        console.log('key', key);
        if (key === 'file'){
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params.file.map( (item: any) => {
            formData.append('file', item);
          });
        } else {
          formData.append(key, params[key]);
        }
        
      });
      let response = null;
      if (receiveList.indexOf(pathname) > -1){
        response = yield call(receiveListEmailSubmit, { StoreId, formData });
      } else {
        response = yield call(sendListEmailSubmit, { StoreId, formData });
      }
      callback && callback(response); 
    },
    *getSendList({ payload }, { call, put }){
      yield put({
        type: 'modifyInboxLoadingState',
        payload: true,
      });
      const response = yield call(getSendList, payload);
      yield put({
        type: 'saveReceiveEmailList',
        payload: response,
      });
    },
    //获取规则列表
    *getRuleList({ payload, callback }, { call }){
      const response = yield call(getRuleList, payload);
      nTs(response);
      response.data.map( (item: API.IParams, index: number) => {
        item.key = index;
      });
      callback && callback(response);
    },
    //修改开关
    *switchRule({ payload, callback }, { call }){
      const response = yield call(switchRule, payload);
      if (response.code === 200){
        callback && callback();
      } else {
        message.error(response.message);
      }
    },
    //删除规则
    *deleteRule({ payload, callback }, { call }){
      const response = yield call(deleteRule, payload);
      if (response.code === 200){
        callback && callback();
      } else {
        message.error(response.message);
      }
    },
    //规则修改或添加
    *addOrUpdateRule({ payload, callback }, { call }){
      const { id, StoreId } = payload;
      let response = { code: 200, data: [] };
      if (id === -1){
        response = yield call(addRule, {
          data: {
            headersParams: { StoreId },
          },
        });
        const { code, data } = response;
        if (code === 200){
          data.map( (item: API.IParams) => item.templateStatus = false);
        }
      } else {
        response = yield call(updateRule, {
          data: {
            headersParams: { StoreId },
          },
          params: {
            id,
          },
        });
      }
      callback && callback(response);
    },
    //添加或者修改规则保存
    *saveUpdateOrAddRule({ payload, callback }, { call }){
      const { id, StoreId, params } = payload;
      let response;
      if (id === -1){
        response = yield call(saveAddRule, {
          data: {
            headersParams: { StoreId },
            ...params,
          },
        
        });
      } else {
        response = yield call(saveUpdateRule, {
          data: {
            headersParams: { StoreId },
            id,
            ...params,
          },
        });
      }
      callback && callback(response);
    },
    //获取模版列表
    *getTemplateList({ payload, callback }, { call }){
      const response = yield call(getTemplateList, payload);
      const { code, data } = response;
      if (code === 200){
        data.map((item: ITemplateData, index: number) => {
          item.key = index;
        });
      }
      callback && callback(response);
    },
    //修改按钮状态
    *switchTemplate({ payload, callback }, { call }){
      const response = yield call(switchTemplate, payload);
      const { code } = response;
      if (code !== 200){
        message.error(response.message);
      }
      callback && callback();
    },
    //删除模版列表中的规则
    *deleteTemplateList({ payload, callback }, { call }){
      const response = yield call(deleteTemplateList, payload);
      callback && callback(response);
    },
    //修改模版的加载
    *updateTemplate({ payload, callback }, { call }){
      const response = yield call(updateTemplate, payload);
      callback && callback(response);
    },
    //保存模版与修改模版确认按钮点击
    *saveOrUpdateTemplate({ payload, callback }, { call }){
      const { id, params, StoreId } = payload;
      let response = null;
      if (id === -1){
        response = yield call(saveTemplate, {
          data: {
            headersParams: { StoreId },
            ...params,
          },
        });
      } else {
        response = yield call(saveUpdateTemplate, {
          data: {
            headersParams: { StoreId },
            ...params,
            id,
          },
        });
      }
      callback && callback(response);
    },
  },
  reducers: {
    saveUnreadMail(state, { payload }){
      nTs(payload);
      state.unreadCount = payload.data.unReadNumber;
    },
    modifyInboxLoadingState(state, { payload }){
      state.inbox.tableLoading = payload;
    },
    //保存收件和发件列表
    saveReceiveEmailList(state, { payload }){
      nTs(payload);
      const { code, data, message } = payload;
      // console.log('data:', data);
      if (code === 200){
        const records = data.records;
        const id = records.length === 0 ? -1 : records[0].id;
        records.map( (item: API.IParams, index: number) => {
          item.key = index;
        });
        data.records = records;
        state.inbox = {
          ...state.inbox,
          tableInfo: data,
          tableLoading: false,
          rowSelection: [],
          id: Number(state.inbox.id) === -1 ? state.inbox.id : id,
        };
      } else {
        state.inbox = {
          ...state.inbox,
          tableInfo: {
            total: 0,
            current: 1,
            size: 20,
            pages: 0,
            records: [],
          },
          id: -1,
          tableLoading: false,
          msg: message,
          rowSelection: [],
        };
      }
    },
    modifyInboxTableRecords(state, { payload }){
      const { ids, status } = payload;
      const records = state.inbox.tableInfo.records;
      const rowIndex: number[] = [];
      ids.map( (id: number) => {
        rowIndex.push(
          records.findIndex((item: API.IParams) => {
            return item.id === id;
          })
        );
      });
      rowIndex.map(item => {
        if (status === 'read-true'){
          records[item].hasRead = true;
        }
        if (status === 'read-false'){
          records[item].hasRead = false;
        }
        if (status === 'replied-true'){
          records[item].hasReplied = true;
        }
        if (status === 'replied-false'){
          records[item].hasReplied = false;
        }
      });
      state.inbox.records = records;
      
    },
    modifyInboxRowSelection(state, { payload }){
      state.inbox.rowSelection = payload;
    },
    modifyInboxId(state, { payload }){
      state.inbox.id = payload;
    },
    receiveEmailRecover(state, { callback }){
      state.inbox = common;
      state.templateList = [];
      callback && callback();
    },
    saveTemplateList(state, { payload }){
      if (payload.code === 200){
        state.templateList = payload.data;
      } else {
        state.templateList = [];
      }
    },
    reduceCountDown(state, { payload }){
      const time = state.inbox.tableInfo.records[payload].countDown;
      time > 0 ? state.inbox.tableInfo.records[payload].countDown -= 60 * 1000 : 0;
    },
  },
};
export default mailModel;
