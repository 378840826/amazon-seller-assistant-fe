import request from '@/utils/request';

export interface IModifyPwd{
  id: string;
  password: string;
}

export function getStoreList(){
  return request('/api/system/sam/store/list', {
    method: 'GET',
  });
}

export function getUserList(){
  return request('/api/system/sam/user/list', {
    method: 'GET',
  });
}

export interface IStore{
  id: string;
  type: 'mws' | 'aads';
}
export interface IAddUser{
  username: string;
  email: string;
  password: string;
  stores: Array<IStore>;

}
export function addUser(params: IAddUser){
  return request('/api/system/sam/user/add', {
    method: 'POST',
    data: params,
  });
}

export interface IDeleteUser{
  id: string;
}
export function deleteUser(params: IDeleteUser){
  return request('/api/system/sam/user/delete', {
    method: 'POST',
    data: params,
  });
}
export interface IModifySUsername{
  id: string;
  username: string;
}
export function modifySUsername(params: IModifySUsername){
  return request('/api/system/sam/user/modify/username', {
    method: 'POST',
    data: params,
  });
}


export interface IModifySEmail{
  id: string;
  email: string;
}
export function modifySEmail(params: IModifySEmail){
  return request('/api/system/sam/user/modify/email', {
    method: 'POST',
    data: params,
  });
}

export interface IModifySPassword{
  id: string;
  password: string;
}
export function modifySPassword(params: IModifySPassword){
  return request('/api/system/sam/user/modify/password', {
    method: 'POST',
    data: params,
  });
}


export function modifyStores(params: Array<IStore>){
  return request('/api/system/sam/user/modify/stores', {
    method: 'POST',
    data: params,
  });
}
