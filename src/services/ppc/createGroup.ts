/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-01-19 17:15:46
 */
import request from '@/utils/request';

// 广告活动下拉列表
export async function getCampaignList(data: API.IParams) {
  return request('/api/gd/ad/campaign/simpleList', {
    data,
  });
}

// 创建广告组
export async function createGroup(data: API.IParams) {
  return request.post('/api/gd/ad/group/create', {
    data,
  });
}
