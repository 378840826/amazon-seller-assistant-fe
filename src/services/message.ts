/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-08 17:43:19
 * @LastEditors: Huang Chao Yi
 * @LastEditTime: 2020-06-28 14:49:26
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

// 标记已处理
export async function updateMessageStatus(id: string) {
  return request(`/api/mws/review/handle/${id}`, {
    method: 'POST',
  });
}

export async function Test(data: any) {
  return request('/api/system/user/login', {
    method: 'POST',
    data,
  });
}
