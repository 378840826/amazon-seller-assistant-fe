/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-12-31 16:03:46
 */
import request from '@/utils/request';

// 创建广告活动
export async function createCampagin(data: API.IParams) {
  return request.post('/api/gd/ad/campaign/create', {
    data,
  });
}

// 商品列表 - 店铺下的商品列表
export async function getProductList(params: API.IParams) {
  return request('/api/gd/searchProduct', {
    params,
    data: params,
  });
}

// 根据商品列表获取关键词(SP) - 推荐关键字列表(SP)
export async function getKeywords(params: API.IParams) {
  return request.post('/api/gd/ad/group/suggestedKeywords', {
    data: params,
  });
}

// 根据商品列表获取建议分类(SP) - 建议分类列表(SP)
export async function getClassifys(params: API.IParams) {
  return request.post('/api/gd/ad/group/suggestedCategories', {
    data: params,
  });
}

// 根据商品列表获取商品(SP) - 获取建议asin(SP)
export async function getProductAsins(params: API.IParams) {
  return request.post('/api/gd/ad/group/suggestedAsins', {
    data: params,
  });
}


// 细化分类获取品牌
export async function getThiningBrands(data: API.IParams) {
  return request.post('/api/gd/ad/group/suggestedBrands', {
    data,
  });
}
