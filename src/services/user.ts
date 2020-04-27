import request from '@/utils/request';

export async function queryCurrent(): Promise<IQueryCurrent> {
  return request('/api/currentUser');
}

export async function testRequest(): Promise<API.IDataResponse> {
  return request('https://darkroom.cc/api/blog');
}
