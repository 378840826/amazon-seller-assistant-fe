/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-26 17:43:40
 * @LastEditTime: 2021-04-29 11:06:41
 */
import request from '@/utils/request';

// 获取sku列表
export async function getskuList(params: API.IParams) {
  return request('/api/mws/shipment/sku/product/list', {
    // method: 'POST',
    params,
  });
}

// 添加SKU
export async function addSku(data: API.IParams) {
  return request('/api/mws/shipment/sku/product/create', {
    method: 'POST',
    data,
  });
}

// 获取仓库下的库位号列表 
export async function getLocationList(params: API.IParams) {
  return request('/api/mws/shipment/sku/product/location/list', {
    params,
  });
}


// 店铺下的mSku列表
export async function getMskuList(params: API.IParams) {
  return request('/api/mws/shipment/sku/product/msku/list', { params });
}


// 批量关联库位号
export async function uploadBatchRelevance(data: API.IParams) {
  const formData = new FormData();
  formData.append('file', data.file);
  return request('/api/mws/shipment/sku/product/upload/skuProduct/location', 
    { 
      method: 'POST',
      data: formData,
    }
  );
}

// 批量上传SKU
export async function uploadBatchSKU(data: API.IParams) {
  const formData = new FormData();
  formData.append('file', data.file);
  return request('/api/mws/shipment/sku/product/upload/skuProduct', 
    { 
      method: 'POST',
      data: formData,
    }
  );
}

//覆盖重复的sku
export async function coverSKU(data: API.IParams) {
  return request('/api/mws/shipment/sku/product/update/skuProducts', { 
    method: 'POST',
    data,
  });
}

// 批量删除SKU
export async function batchDelete(data: API.IParams) {
  return request('/api/mws/shipment/sku/product/delete', { 
    method: 'POST',
    data,
  });
}


// SKU智能匹配
export async function aiSKU(data: API.IParams) {
  return request('/api/mws/shipment/sku/product/auto/skuProduct/msku', { 
    method: 'POST',
    data,
  });
}

// 批量修改状态
export async function batchUpdateState(data: API.IParams) {
  return request('/api/mws/shipment/sku/product/update/state', { 
    method: 'POST',
    data,
  });
}


// 修改单个SKU资料
export async function updateSku(data: API.IParams) {
  return request('/api/mws/shipment/sku/product/update', { 
    method: 'POST',
    data,
  });
}
