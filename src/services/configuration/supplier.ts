import request from '@/utils/request';

// 供应商列表
export async function getSupplierList(data: API.IParams) {
  return request('/api/mws/shipment/supplier/list', {
    method: 'POST',
    data,
  });
}

//修改供应商信息
export async function updateSupplier(data: API.IParams){
  return request('/api/mws/shipment/supplier/update', {
    method: 'POST',
    data,
  });
}

//修改供应商列表状态开关
export async function updateSupplierState(data: API.IParams){
  return request('/api/mws/shipment/supplier/update/state', {
    method: 'POST',
    data,
  });
}

//供应商创建
export async function addSupplier(data: API.IParams){
  return request('/api/mws/shipment/supplier/create', {
    method: 'POST',
    data,
  }); 
}
//获取子账号列表
export async function getUserList(){
  return request('/api/system/sam/user/list', {
    method: 'GET',
  });
}
//批量导入供应商
export async function updateBatchSupplier(data: API.IParams) {
  const formData = new FormData();
  formData.append('file', data.file);
  return request('/api/mws/shipment/supplier/upload', 
    { 
      method: 'POST',
      data: formData,
    }
  );
}
//删除供应商
export async function deleteSupplier(data: API.IParams) {
  return request('/api/mws/shipment/supplier/delete', {
    method: 'POST',
    data,
  });
}

