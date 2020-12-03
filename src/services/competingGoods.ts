/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-11-06 15:13:19
 * 竞品设定
 */

import request from '@/utils/request';

// 竞品设定-查询
export async function getCompetingGoods(params: API.IParams) {
  return request.post('/api/mws/nrule/compete/setting', {
    data: params,
    params,
  });
}

// 搜索ASIN接口 // url是爬虫提供的，文档 https://con.workics.cn/pages/viewpage.action?pageId=127569230
export async function getSearchAsin(params: string) {
  return request(params);
}


// 保存
export async function save(params: API.IParams) {
  return request.post('/api/mws/nrule/compete/save', {
    data: params,
  });
}
