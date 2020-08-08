/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-30 15:23:40
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\services\asinPandect.ts
 */ 
import request from '@/utils/request';


//------------>>>>>>>>>>>>> 通用 start//
// 获取ASIN
export async function getServersAsin(data: { asin: string}) {
  return request('/api/mws/asin-overview/getAsinOrSku', {
    data,
    params: {
      asin: data.asin,
    },
  });
}

// 获取兄弟ASIN
export async function getSiblingsAsin(data: { asin: string}) {
  return request<API.IUnreadNotices>('/api/mws/asin-overview/asin-list', {
    data,
    params: {
      asin: data.asin,
    },
  });
}


export async function Login(data: {}) {
  return request.post('/api/system/user/login', {
    data,
  });
}
//------------>>>>>>>>>>>>> 通用 end//


// ------------>>>>>>>>>>>>> 地区销售 start //
// 初始化数据
export async function getDSellInit(data: {}) {
  return request.post('/api/mws/asin-overview/sales-inventory', {
    data,
  });
}

// ------------>>>>>>>>>>>>> 地区销售 end //


// ------------>>>>>>>>>>>>> 退货分析 start //
export async function getReturnProductInitData(data: {}) {
  return request.post('/api/mws/asin-overview/return-analysis', {
    data,
  });
}
// ------------>>>>>>>>>>>>> 地区销售 end //


// ------------>>>>>>>>>>>>> 订单解读 start //
export async function getAsinOrderInit(data: { asin: string }) {
  return request.post('/api/mws/order/analysis', {
    params: {
      asin: data.asin,
    },
    data,
  });
}

// 获取折线图数据
export async function getOrderLineChartData(data: {}) {
  return request.post('/api/mws/order/analysis/line-change', {
    data,
  });
}

// 分时统时直柱图数据
export async function getServerBarData(data: { headersParams: {StoreId: string} }) {
  return request('/api/mws/order/analysis/histogram', {
    headers: {
      StoreId: data.headersParams.StoreId,
    },
    params: data,
  });
}

// 表格数据
export async function getOrderInitData(data: { current: number; size: number }) {
  return request.post('/api/mws/order/analysis/page', {
    params: {
      current: data.current,
      size: data.size,
    },
    data,
  });
}

// 关联销售详情
export async function getGuanLianSales(params: { StoreId: string } ) {
  return request('/api/mws/order/analysis/related-info', {
    params,
    headers: {
      StoreId: params.StoreId,
    },
  });
}

// 关联销售详情
export async function orderTableDownload(params: { headersParams: {StoreId: string }}) {
  return request('/api/mws/order/analysis/download', {
    params,
    responseType: 'blob',
    headers: {
      StoreId: params.headersParams.StoreId,
    },
  });
}
// ------------>>>>>>>>>>>>> 订单解读 end //
