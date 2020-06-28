/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-08 17:50:42
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-28 14:49:41
 * @FilePath: \amzics-react\src\pages\message\model.ts
 */ 
import { Effect, Reducer } from 'umi';
import {
  getAllMessageList,
  getReviewMessageAll,
  updateMessageStatus,
  Test,
} from '@/services/message';

interface IMessageState {
  listData: [];
  allMessage: {};
  reviewMessage: {};
}
interface IMessageType {
  namespace: 'messageModel';
  state: IMessageState;
  reducers: {
    changeListData: Reducer;
    changeAllMessage: Reducer;
    changeReviewMessage: Reducer;
  };
  effects: {
    getAllMessageList: Effect;
    getReviewMessageList: Effect;
    setMessageStatus: Effect;
    test: Effect;
  };
}


const message: IMessageType = {
  namespace: 'messageModel',

  state: {
    listData: [],
    allMessage: {}, // 全部消息列表
    reviewMessage: {}, // 监控评论列表
  },

  reducers: {
    changeListData(state, { payload }) {
      state.listData = payload;
    },

    // 全部消息
    changeAllMessage(state, { payload }) {
      state.allMessage = payload;
    },

    // 监控评论列表
    changeReviewMessage(state, { payload }) {
      state.reviewMessage = payload;
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

export default message;
