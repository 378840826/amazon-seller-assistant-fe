import request from '@/utils/request';

export async function queryCurrent() {
  return request<API.ICurrentUser>('/api/currentUser');
}

export async function testRequest() {
  return request('https://darkroom.cc/api/blog');
}
