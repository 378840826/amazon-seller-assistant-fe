import request from '@/utils/request';
//邮件未读数
export function getUnreadMail(params: API.IParams){
  return request('/api/mws/mail-assistant/receive-list/unread-number', {
    method: 'GET',
    ...params,
  });
}

//统计列表
export function getStatisticalList (params: API.IParams){ 
  return request('/api/mws/mail-assistant/statistical-list', {
    method: 'GET',
    ...params,
  });
}

//收件箱邮件列表
export function getReceiveEmailList(params: API.IParams){
  return request('/api/mws/mail-assistant/receive-list/list', {
    method: 'POST',
    ...params,
  });
}
//修改已读/未读/已回复/未回复
export function updateStatus(params: API.IParams){
  return request('/api/mws/mail-assistant/receive-list/update', {
    method: 'POST',
    ...params,
  });
}
//发件箱回复页面
export function receiveReplayPage(params: API.IParams){
  return request('/api/mws/mail-assistant/receive-list/reply-page', {
    method: 'GET',
    ...params,
  });
}
//收件箱回复页面
export function sendListReplayPage(params: API.IParams){
  return request('/api/mws/mail-assistant/send-list/reply-page', {
    method: 'GET',
    ...params,
  });
}

//收件箱和发件箱的模版列表
export function tankTemplateList(params: API.IParams){
  return request('/api/mws/mail-assistant/receive-list/template', {
    method: 'GET',
    ...params,
  });
}
//收件箱模版载入
export function receiveListTemplateLoad(params: API.IParams){
  return request('/api/mws/mail-assistant/receive-list/template-load', {
    method: 'GET',
    ...params,
  });
}

//发件箱模版载入
export function sendListTemplateLoad(params: API.IParams){
  return request('/api/mws/mail-assistant/send-list/template-load', {
    method: 'GET',
    ...params,
  });
}

//收件箱邮件提交
export function receiveListEmailSubmit(params: API.IParams){
  return request('/api/mws/mail-assistant/receive-list/mail-submit', {
    method: 'POST',
    ...params,
  });
}

//发件箱邮件提交
export function sendListEmailSubmit(params: API.IParams){
  return request('/api/mws/mail-assistant/send-list/mail-submit', {
    method: 'POST',
    ...params,
  });
}
//发件箱
export function getSendList(params: API.IParams){
  return request('/api/mws/mail-assistant/send-list/list', {
    method: 'POST',
    ...params,
  });
}


