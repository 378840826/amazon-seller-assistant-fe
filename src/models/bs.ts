import { IModelType, IConnectState } from '@/models/connect';
import {
  queryBsList,
  removeBs,
  uploadBs,
  queryPluginStatus,
  queryReport,
} from '@/services/bs';

export interface IBsModelState {
  list: {
    records: {
      id: string;
      reportTime: string;
      reportStatus: boolean;
      pluginMsg: string;
    }[];
    total: number;
    size: number;
    current: number;
  };
  filtrateParams: {
    startDate?: string;
    endDate?: string;
    status?: string;
  };
  headersParams?: {
    StoreId: string;
  };
  fileList: IFile[];
  // 已经上传完成或失败的数量（用于计算进度）
  completedNum: number;
  // 插件同步状态, status: 0 正在同步 1 同步成功 2 同步失败 3 代表目前无同步任务
  pluginStatus: {
    date: string;
    status: number;
  };
  // 报表详情
  report: {
    records: {
      [key: string]: string | number;
    }[];
    total: number;
    size: number;
    current: number;
  };
}

interface IBsModelType extends IModelType {
  namespace: 'bs';
  state: IBsModelState;
}

export interface IFile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any;
  isUpload: boolean;
  msg?: string;
}

const BsModel: IBsModelType = {
  namespace: 'bs',

  state: {
    list: {
      records: [],
      total: 0,
      size: 20,
      current: 1,
    },
    filtrateParams: {
      status: '',
    },
    headersParams: {
      StoreId: '-1',
    },
    fileList: [],
    completedNum: 0,
    pluginStatus: {
      date: '',
      status: 3,
    },
    report: {
      records: [],
      total: 0,
      size: 20,
      current: 1,
    },
  },

  effects: {
    // 查询和筛选
    *fetchBsList({ payload, callback }, { select, call, put }) {
      const { headersParams, filtrateParams } = payload;
      const {
        filtrateParams: oldFiltrateParams, headersParams: oldHeadersParams,
      } = yield select((state: IConnectState) => state.bs);
      const newFiltrateParams = Object.assign({}, oldFiltrateParams, filtrateParams);
      const newHeadersParams = headersParams || oldHeadersParams;
      const res = yield call(
        queryBsList,
        { ...newFiltrateParams, headersParams: newHeadersParams }
      );
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveBsList',
          payload: { data },
        });
        yield put({
          type: 'saveParams',
          payload: { filtrateParams, headersParams },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 删除
    *deleteBs({ payload, callback }, { call, put }) {
      const res = yield call(removeBs, payload);
      if (res.code === 200) {
        const { id } = payload;
        yield put({
          type: 'updateBsStatus',
          payload: { id, reportStatus: false },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 导入（批量导入的单个导入）
    *uploadBs({ payload, callback }, { call, put }) {
      const res = yield call(uploadBs, payload);
      const { myFile } = payload;
      if (res.code === 200) {
        yield put({
          type: 'updateFileList',
          payload: { myFile },
        });
      } else if (res.code === 500) {
        yield put({
          type: 'updateFileList',
          payload: { myFile, msg: res.message },
        });
      }
      callback && callback(res.code, res.message);
    },

    // 轮询 poll
    pollPluginStatus: [
      function* ({ payload, callback }, { call, put }) {
        const res = yield call(queryPluginStatus, payload);
        if (res.code === 200) {
          const { data: { date, status } } = res;
          yield put({
            type: 'savePluginStatus',
            payload: { date, status },
          });
        }
        callback && callback(res.code, res.message);
      },
      { type: 'poll', delay: 5000 },
    ],

    // 获取报表详情
    *fetchReport({ payload, callback }, { call, put }) {
      const { headersParams, filtrateParams } = payload;
      const res = yield call(queryReport, { ...filtrateParams, headersParams });
      if (res.code === 200) {
        const { data } = res;
        yield put({
          type: 'saveReport',
          payload: { data },
        });
      }
      callback && callback(res.code, res.message);
    },
  },

  reducers: {
    // 保存列表数据
    saveBsList(state, { payload }) {
      const { data } = payload;
      state.list = data;
    },

    // 保存筛选参数
    saveParams(state, { payload }) {
      const { filtrateParams, headersParams } = payload;
      state.filtrateParams = Object.assign(state.filtrateParams, filtrateParams);
      state.headersParams = Object.assign(state.headersParams, headersParams);
    },

    // 修改筛选参数(用在日历)
    updateParams(state, { payload }) {
      state.filtrateParams = Object.assign(state.filtrateParams, payload);
    },

    // 修改状态(删除，导入)
    updateBsStatus(state, { payload }) {
      const { id, reportStatus } = payload;
      const length = state.list.records.length;
      for (let index = 0; index < length; index++) {
        const bs = state.list.records[index];
        if (bs.id === id) {
          bs.reportStatus = reportStatus;
          break;
        }
      }
    },

    // 添加 file 到 fileList
    pushFileList(state, { payload }) {
      state.fileList.push(payload);
    },

    // 更新 fileList 中单个 file 的状态 和 更新进度
    updateFileList(state, { payload }) {
      const { myFile, msg } = payload;
      const { fileList } = state;
      state.completedNum++;
      for (let index = 0; index < fileList.length; index++) {
        const item = fileList[index];
        if (myFile.file.uid === item.file.uid) {
          item.isUpload = true;
          if (msg) {
            item.msg = msg;
          }
          return;
        }
      }
    },

    // 删除 fileList 中的单个 file 
    removeFile(state, { payload }) {
      const { myFile } = payload;
      const { fileList } = state;
      for (let index = 0; index < fileList.length; index++) {
        const item = fileList[index];
        if (myFile.file.uid === item.file.uid) {
          fileList.splice(index, 1);
          return;
        }
      }
    },

    // 清空 fileList
    emptyFileList(state) {
      state.fileList = [];
      state.completedNum = 0;
    },

    // 更新 pluginStatus 如果当前页数据有这个日期，同时更新
    savePluginStatus(state, { payload }) {
      const { date, status } = payload;
      state.pluginStatus = payload;
      // 如果插件没在同步
      if (!date || status === 3) {
        return;
      }
      // 把 date 改成和列表中的 date 相同的格式（进行比较）
      const formatDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
      // 如果当前页数据有这个日期，同时更新这条数据的状态
      const length = state.list.records.length;
      for (let index = 0; index < length; index++) {
        const bs = state.list.records[index];
        if (bs.reportTime === formatDate) {
          // 0 正在同步 1 同步成功 2 同步失败 3 代表目前无同步任务
          switch (status) {
          case 0:
            bs.pluginMsg = '插件正在自动导入';
            break;
          case 1:
            bs.reportStatus = true;
            bs.pluginMsg = '';
            break;
          case 2:
            bs.pluginMsg = '插件自动导入失败，等待下一次导入';
            break;                   
          default:
            break;
          }
          break;
        }
      }
    },

    // 保存报表详情
    saveReport(state, { payload }) {
      const { data } = payload;
      state.report = data;
    },
  },
};

export default BsModel;
