/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-21 16:29:44
 * @LastEditTime: 2021-04-21 18:01:33
 */

declare namespace DispatchList {
  interface IListRecord {
    id: string;
    state: string;
  }

  interface IProductVos {
    id: string;
    url: string;
    itemName: string;
    asin1: string;
    sku: string;
    sellerSku: string;
    fnsku: string;
    issuedNum: number;
    receiveNum: number;
    disparityNum: number;
    locationNo: string[];
  }

  interface IDispatchLog {
    userId: number;
    username: string;
    gmtCreate: string;
    modifyText: string;
  }

  interface IDispatchDetail {
    id: string;
    invoiceId: string;
    shippingType: string;
    shippingId: string;
    trackingId: string;
    remarkText: string;
    state: string;
    shipmentId: string;
    mwsShipmentId: string;
    countryCode: string;
    storeName: string;
    warehouseDe: string;
    destinationFulfillmentCenterId: string;
    casesRequired: string;
    labelingType: string;
    warehouseName: string;
    addressLine1: string;
    printingState: string;
    userName: string;
    gmtCreate: string;
    gmtModified: string;
    estimatedTime: string;
    userName: string;
    productItemVos: IProductVos[];
    shipmentModifies: IDispatchLog[];
  }
}
