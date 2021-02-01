import request from '@/utils/request';

export async function queryCurrent() {
  return request<API.ICurrentUser>('/api/system/user/logined');
}

export async function testRequest() {
  return request('https://darkroom.cc/api/blog');
}

export interface IModifyUsername {
  id: string;
  username: string;
}

export async function modifyUsername(data: IModifyUsername) {
  return request('/api/system/user/modify/username', {
    method: 'post',
    data: data,
  });
}

export interface IModifyPwd{
  id: string;
  password: string;
}

export function modifyPwd(params: IModifyPwd){
  return request('/api/system/user/modify/password', {
    method: 'POST',
    data: params,
  });
}

export interface IEmailExist{
  email: string;
}
export function emailExist(params: IEmailExist){
  return request('/api/system/user/exist/email', {
    method: 'GET',
    params: params,
  });
}
export interface IUsernameExist{
  username: string;
}

export function userNameExist(params: IUsernameExist){
  return request('/api/system/user/exist/username', {
    method: 'GET',
    params: params,
  });
}
export interface ISendForgetEmail{
  email: string;
  code: string;
  // random: string;
}
export function sendForgetEmail(params: ISendForgetEmail){
  return request('/api/system/user/forget-password', {
    method: 'POST',
    data: params,
  });
}
export interface IActiveEmail{
  email: string;
  uuid: string;
}
export function activeEmail(params: IActiveEmail){
  return request('/api/system/user/active', {
    method: 'GET',
    params: params,
  });
}

export interface IResetPwd{
  uuid: string;
  password: string;
}
export function resetPwd(params: IResetPwd){
  return request('/api/system/user/reset-password', {
    method: 'POST',
    data: params,
  });
}

export interface IPreLogin{
  username: string;
}

export function preLogin(params: IPreLogin){
  return request('/api/system/user/pre-login', {
    method: 'GET',
    params: params,
  });
}

export interface ILogin{
  email: string;
  password: string;
  code?: string;
  rememberMe: boolean;
  // random?: string;

}
export function login(params: ILogin){
  return request('/api/system/user/login', {
    method: 'POST',
    data: params,
  });
}

export function logout(){
  return request('/api/system/user/logout');
}
export interface IResentEmail{
  email: string;
}
export function resentEmail(params: IResentEmail){
  return request('/api/system/user/resend', {
    method: 'POST',
    data: params,
  });
}
export function unbindWechart(params: API.IParams){
  return request('/api/system/user/unbind-wechat', {
    method: 'POST',
    ...params,
  });
}
