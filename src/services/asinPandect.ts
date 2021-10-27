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


// ------------>>>>>>>>>>>>> B2B销售 start //
// 如果选择的是这个按周按月的周期时间 :那么必须传的参数是 timeMethod  startTime  endTime cycle 不要传或者传null
// 选择这个最近多少天之类的 必须 传 cycle  ,  timeMethod  startTime  endTime这三个可以不传或者null

// 初始化数据
export async function getB2BinitData(data: {}) {
  return request.post('/api/mws/order/analysis/bs', {
    data,
  });
}

// 折线图数据
export async function getB2BlineChartData(data: {}) {
  return request.post('/api/mws/order/analysis/bs/line-change', {
    data,
  });
}

// ------------>>>>>>>>>>>>> B2B销售 end //


// ------------>>>>>>>>>>>>> 基本信息 start //
// 初始化数据
export async function getBaseInitData(data: { asin: string}) {
  return request('/api/mws/product/asin-info', {
    params: {
      asin: data.asin,
    },
    data,
  });
}

export async function tabSkuData(data: { sku: string}) {
  return request('/api/mws/product/sku-exp', {
    params: {
      sku: data.sku,
    },
    data,
  });
}

//价格预估
export async function priceEstimated(data: { asin: string}) {
  return request.post('/api/mws/product/estimate/sku-exp', {
    data,
  });
}

// 修改价格估算
export async function updatePriceEstimated(data: { asin: string}) {
  return request.post('/api/mws/product/update/sku-exp', {
    data,
  });
}
// ------------>>>>>>>>>>>>> 基本信息 end //
