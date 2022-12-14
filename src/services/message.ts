/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-08 17:43:19
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-08-20 17:34:23
 * @FilePath: \amzics-react\src\services\message.ts
 */ 
import request from '@/utils/request';

// 全部消息
export async function getAllMessageList(params: {}, data: {}) {
  return request(`/api/mws/review/reviews/all`, {
    params,
    data,
  });
}

// 评论提醒()
export async function getReviewMessageAll(params: {}, data: {}) {
  return request('/api/mws/review/remind/list', {
    params,
    data,
  });
}

// 跟卖消息列表请求
export async function getFollowMessage(params: {}, data: {}) {
  return request('/api/mws/follow/remind/list', {
    params,
    data,
  });
}

// 标记已处理
export async function updateMessageStatus(id: string) {
  return request(`/api/mws/review/handle/${id}`, {
    method: 'POST',
  });
}

// eslint-disable-next-line
export async function Test(data: any) {
  return request('/api/system/user/login', {
    method: 'POST',
    data,
  });
}
