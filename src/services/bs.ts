import request from '@/utils/request';

export async function queryBsList(params: API.IParams) {
  return request('/api/mws/bs/page', {
    data: params,
    params,
  });
}

// 删除
export async function removeBs(params: API.IParams) {
  return request('/api/mws/bs/delete-bs', {
    data: params,
    params,
  });
}

// 批量上传的单个上传
export async function uploadBs(params: API.IParams) {
  const formData = new FormData();
  formData.append('file', params.myFile.file);
  return request('/api/mws/bs/upload-batch', {
    method: 'POST',
    data: formData,
    headers: {
      'StoreId': params.headersParams.StoreId,
    },
  });
}

// 插件状态
export async function queryPluginStatus(params: API.IParams) {
  return request('/api/mws/bs/date-bs', {
    method: 'GET',
    data: params,
    params,
  });
}

// 报表详情页
export async function queryReport(params: API.IParams) {
  return request('/api/mws/bs/info-bs', {
    method: 'GET',
    data: params,
    params,
  });
}
