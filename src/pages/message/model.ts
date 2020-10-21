/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-08 17:50:42
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-10-15 11:44:42
 * @FilePath: \amzics-react\src\pages\message\model.ts
 */ 
import { Effect, Reducer } from 'umi';
import {
  getAllMessageList,
  getReviewMessageAll,
  updateMessageStatus,
  Test,
  getFollowMessage,
} from '@/services/message';

interface IMessageState {
  listData: [];
  allMessage: {};
  reviewMessage: {};
  followMessage: {};
}
interface IMessageType {
  namespace: 'messageModel';
  state: IMessageState;
  reducers: {
    changeListData: Reducer;
    changeAllMessage: Reducer;
    changeReviewMessage: Reducer;
    changeFollowMessage: Reducer;
  };
  effects: {
    getAllMessageList: Effect;
    getReviewMessageList: Effect;
    setMessageStatus: Effect;
    test: Effect;
    getFollowMessage: Effect;
  };
}


const messageModel: IMessageType = {
  namespace: 'messageModel',

  state: {
    listData: [],
    allMessage: {}, // 全部消息列表
    reviewMessage: {}, // 监控评论列表
    followMessage: {}, // 跟卖消息列表
  },

  reducers: {
    changeListData(state, { payload }) {
      state.listData = payload;
    },

    // 全部消息
    changeAllMessage(state, { payload }) {
      if (payload.data) {
        state.allMessage = payload.data || {};
        return;
      }
      state.allMessage = null; // 设置为null，页面根据这个判断异步是否已返回
    },

    // 监控评论列表
    changeReviewMessage(state, { payload }) {
      state.reviewMessage = payload.data || {};
    },

    // 监控评论列表
    changeFollowMessage(state, { payload }) {
      state.followMessage = payload.data || {};
    },
  },

  effects: {
    // 全部消息提醒列表
    *getAllMessageList({ payload }, { call, put }): Generator {
      const response = yield call(getAllMessageList, payload.data, payload.head);
      yield put({
        type: 'changeAllMessage',
        payload: response,
      });
    },
    
    // 监控评论提醒列表
    *getReviewMessageList({ payload }, { call, put }): Generator {
      const response = yield call(getReviewMessageAll, payload, payload.head);
      yield put({
        type: 'changeReviewMessage',
        payload: response,
      });
    },

    // 监控评论提醒列表
    *getFollowMessage({ payload }, { call, put }): Generator {
      const response = yield call(getFollowMessage, payload, payload.head);
      yield put({
        type: 'changeFollowMessage',
        payload: response,
      });
    },

    // 标记已处理
    *setMessageStatus({ payload }, { call }): Generator {
      try {
        const response = yield call(updateMessageStatus, payload.id);
        payload.resolve(response);
      } catch (err) {
        payload.reject(err);
      }
    },
    
    *test({ payload }, { call }) {
      yield call(Test, payload.data);
    },
  },
};

export default messageModel;
