import { ReactText } from 'react';
import { IModelType } from './connect.d';
import { message } from 'antd';
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
  receiveListEmailSubmit,
  sendListEmailSubmit,
  getSendList,
} from '@/services/mail';
import { nTs } from '@/utils/utils';


const common = {
  msg: '', //列表非200的错误信息
  tableInfo: {
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
    id: number;
  };
  request: API.IParams;
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
    request: {},
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
      if (response.code === 200){
        yield put({
          type: 'modifyInboxTableRecords',
          payload: payload.params,
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
    //收件箱和发件箱的模版列表
    *tankTemplateList({ payload, callback }, { call, put }){
      const response = yield call(tankTemplateList, payload);
      nTs(response);
      yield put({
        type: 'saveTemplateList',
        payload: response,
      });
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
    //手件箱邮件提交
    *receiveListEmailSubmit({ payload }, { call }){
      const response = yield call(receiveListEmailSubmit, payload);
      nTs(response);
      if (response.code === 200){
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    },
    //发件箱邮件提交
    *sendListEmailSubmit({ payload }, { call }){
      const response = yield call(sendListEmailSubmit, payload);
      nTs(response);
      if (response.code === 200){
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    },
    //
    *getSendList({ payload }, { call, put }){
      yield put({
        type: 'modifyInboxLoadingState',
        payload: true,
      });
      const response = yield call(getSendList, payload);
      yield put({
        type: 'saveSendList',
        payload: response,
      });
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
    saveReceiveEmailList(state, { payload }){
      nTs(payload);
      const { code, data, message } = payload;
      if (code === 200){
        const records = data.records;
        records.map( (item: API.IParams, index: number) => {
          item.key = index;
        });
        data.records = records;
        state.inbox = {
          ...state.inbox,
          tableInfo: data,
          tableLoading: false,
          rowSelection: [],
          id: Number(state.inbox.id) === -1 ? state.inbox.id : records[0].id,
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
    modifyInboxSendParams(state, { payload, callback }){
      state.request = {
        ...state.request,
        ...payload,
      };
      callback && callback();
    },
    receiveEmailRecover(state){
      state.inbox = common;
      state.request = {};
      state.templateList = [];
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
    saveSendList: (state, { payload }) => {
      nTs(payload);
      const { code, data, message } = payload;
      if (code === 200){
        const records = data.records;
        records.map( (item: API.IParams, index: number) => {
          item.key = index;
        });
        data.records = records;
        state.inbox = {
          ...state.inbox,
          tableInfo: data,
          tableLoading: false,
          rowSelection: [],
          id: Number(state.inbox.id) === -1 ? state.inbox.id : records[0].id,
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
          tableLoading: false,
          msg: message,
          rowSelection: [],
        };
      }
    },
  },
};
export default mailModel;
