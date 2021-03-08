import request from '@/utils/request';
//所有子账号
export function getSamList(){
  return request('/api/system/role-permission/sam-list', {
    method: 'GET',
  });
}

//角色权限列表
export function getRolePermission(){
  return request('/api/system/role-permission/list', {
    method: 'GET',
  });
}

//修改状态
export function updateStatus(params: API.IParams){
  return request('/api/system/role-permission/update-state', {
    method: 'POST',
    ...params,
  });
}

//删除角色
export function deleteRole(params: API.IParams){
  return request('/api/system/role-permission/delete-role', {
    method: 'POST',
    ...params,
  });
}

//添加角色
export function addRole(params: API.IParams){
  return request('/api/system/role-permission/add-role', {
    method: 'POST',
    ...params,
  });
}

//修改角色
export function updateRole(params: API.IParams){
  return request('/api/system/role-permission/update-role', {
    method: 'POST',
    ...params,
  });
}

//修改角色的子账号分配
export function updateSam(params: API.IParams){
  return request('/api/system/role-permission/update-sam', {
    method: 'POST',
    ...params,
  });
}

//所有权限
export function getPermissionList(params: API.IParams){
  return request('/api/system/role-permission/permission-list', {
    method: 'GET',
    ...params,
  });
}
