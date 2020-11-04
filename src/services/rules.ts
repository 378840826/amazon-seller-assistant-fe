/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-22 10:06:51
 * @FilePath: \amzics-react\src\services\rules.ts
 * 
 * 调价规则
 */
import request from '@/utils/request';

// 规则列表
export async function rulesList(data: API.IParams) {
  return request('/api/mws/nrule/list', {
    params: data,
    data,
  });
}


// 规则列表 - 修改规则名称和规则说明
export async function setRuleName(data: API.IParams) {
  return request.post('/api/mws/nrule/update', {
    requestType: 'form',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  });
}
// 规则列表 - 修改规则定时
export async function setTiming(data: API.IParams) {
  return request.post('/api/mws/nrule/timing', {
    requestType: 'form',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  });
}

//  规则列表 - 删除规则
export async function deleteRule(data: API.IParams) {
  return request.post('/api/mws/nrule/delete', {
    requestType: 'form',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  });
}


// 竞品规则设定查询
export async function getCompete(data: API.IParams) {
  const params = data.ruleId ? { ruleId: data.ruleId } : {};
  return request('/api/mws/nrule/setting/compete', {
    params,
    data,
  });
}

// 竞品规则设定修改或添加
export async function addtOrSetCompete(data: API.IParams) {
  return request.post('/api/mws/nrule/setting/compete', {
    params: {
      ruleId: data.ruleId,
    },
    data,
  });
}

// buybox规则设定修改或添加
export async function addtOrSetBuybox(data: API.IParams) {
  const params = data.ruleId ? { ruleId: data.ruleId } : {};
  return request.post('/api/mws/nrule/setting/buybox', {
    params,
    data,
  });
}

// buybox规则设定查询
export async function getBuybox(data: API.IParams) {
  return request('/api/mws/nrule/setting/buybox', {
    params: {
      ruleId: data.ruleId,
    },
    data,
  });
}

// 销售表现规则设定修改或者添加
export async function addtOrSetSales(data: API.IParams) {
  const params = data.ruleId ? { ruleId: data.ruleId } : {};
  return request.post('/api/mws/nrule/setting/sell', {
    params,
    data,
  });
}

// 销售表现规则设定查询
export async function getSales(data: API.IParams) {
  return request('/api/mws/nrule/setting/sell', {
    params: {
      ruleId: data.ruleId,
    },
    data,
  });
}
