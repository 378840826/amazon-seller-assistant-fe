/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-03 15:12:15
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-07-09 10:31:54
 * @FilePath: \amzics-react\src\pages\mws\comment\Monitor\model.ts
 * 
 * 接口
 */ 
import { Effect, Reducer } from 'umi';
import { 
  getCommentList,
  downloadCommentTable,
  signHandle,
  // Test
} from '@/services/commentMonitor';

export interface ICommentMonitorState {
  code?: number;
  data: {
    records?: [];
  };
  commentTableData: {};
}

export interface ICommentMonitorType {
  namespace: 'commentMonitor';

  state: ICommentMonitorState;

  reducers: {
    changeData: Reducer;
  };

  effects: {
    getCommentList: Effect;
    downLoadComment: Effect;
    signHandle: Effect;
    // test: Effect;
  };
}

const CommentMonitor: ICommentMonitorType = {
  namespace: 'commentMonitor',

  state: {
    commentTableData: {},
    data: {},
  },

  reducers: {
    changeData(state, { payload }) {
      state.commentTableData = payload;
    },
  },

  effects: {
    // 获取评论列表
    *getCommentList({ payload }, { call }): Generator {
      try {
        const response = yield call(getCommentList, payload.data );
        payload.resolve(response);
      } catch (err) {
        payload.reject(err);
      }
    },

    // 点击下载
    *downLoadComment({ payload }, { call }): Generator {
      try {
        const response = yield call(downloadCommentTable, payload.data);
        payload.resolve(response);
      } catch (err) {
        payload.reject(err);
      }
    },

    // 标记已处理
    *signHandle({ payload }, { call }): Generator {
      try {
        const response = yield call(signHandle, payload.id);
        payload.resolve(response);
      } catch (err) {
        payload.reject(err);
      }
    },

    // *test({ payload }, { call }) {
    //   yield call(Test, payload.data);
    // },

  },
};


export default CommentMonitor;
