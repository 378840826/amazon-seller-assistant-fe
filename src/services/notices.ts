import request from '@/utils/request';

// 获取未读消息数量
export async function queryUnreadNotices() {
  return request<API.IUnreadNotices>('/api/mws/review/reviews/unreadcount');
}
