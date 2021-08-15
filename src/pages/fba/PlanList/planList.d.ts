/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-03-16 11:19:38
 * @LastEditTime: 2021-05-17 11:47:59
 */
declare namespace planList {
  interface IDetailModalType {
    visible: boolean;
    method: 'FBA'| 'overseas'; // FBA和每外仓库
    dispose: boolean; // 是否已处理
    verify: boolean; // 是否已核实
    pageName?: 'dispose' | 'verify'; // dispose页面是处理页面， verify是核实页面 没有是详情
  }

  // 货件计划列表
  interface IRecord {
    id: number;
    // deleted: boolean;
    state: boolean;
    pstate: boolean;
  }

  // 商品列表
  interface IProductList {
    id: string;
    url: string;
    itemName: string;
    asin1: string;
    sellerSku: string;
    sku: string;
    fnsku: string;
    available: string;
    declareNum?: string;
    verifyNum?: string;
    disparityNum?: string;
  }

  // 目的仓库列表
  interface IWarehouses {
    id: string;
    name: string;
    addressLine1: string;
    type: string;
  }

  // 发货地址列表
  interface IAddressLine {
    id: string;
    name: string;
    addressLine1: string;
    type: string;
  }

  interface IPlanDetail {
    id: string;
    userName: string;
    shipmentId: string;
    /** 亚马逊生成的 ShipmentId， 后端接口传回 ShipmentId 数组 */
    mwsShipmentId: string[];
    invoiceId: string;
    countryCode: string;
    storeName: string;
    storeId: string;
    warehouseDe: string;
    shippingType: string;
    labelingType: string;
    addressLine1: string;
    gmtCreate: string;
    gmtModified: string;
    areCasesRequired: boolean;
    verifyType: boolean;
    state: boolean; // 处理（true)  作废（false)
    pstate: string; // 处理状态
    warehouseType: string;
  }

  interface ILog {
    userId: string;
    username: string;
    gmtCreate: string;
    modifyText: string;
  }

  interface IKuWeiInfo {
    locationId: string;
    locationNo: string;
    warehouseId: string;
    warehouseName: string;
  }

  interface IVerifyProductRecord {
    id: string;
    url: string;
    itemName: string;
    itemNameNa: string;
    asin1: string;
    sellerSku: string;
    sku: string;
    fnsku: string;
    declareNum: string;
    verifyNum: string;
    disparityNum: string;
    result: IKuWeiInfo[];
  }

  // 处理页面的表格数据结构
  interface IHandlePageRecord {
    mwsShipmentId: string;
    productCategory: string;
    declareNum: string;
    destinationFulfillmentCenterId: string;
    shipmentName: string;
    products: {
      url: string;
      itemName: string;
      asin1: string;
      sellerSku: string;
      sku: string;
      fnsku: string;
      available: string;
    }[];
  }
}
