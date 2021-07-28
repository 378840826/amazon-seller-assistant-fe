/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-22 11:41:31
 * @LastEditTime: 2021-04-23 16:04:48
 */
declare namespace Shipment {
  interface IShipmentList {
    id: string;
    isGenerateInvoice: boolean;
    shipmentState: string;
    mwsShipmentId: string;
    shipmentName: string;
    shipmentId: string;
    invoiceId: string;
    countryCode: string;
    storeName: string;
    destinationFulfillmentCenterId: string;
    shippingType: string;
    shippingId: string;
    trackingId: string;
    casesRequired: string;
    labelingType: string;
    packageLabelType: string;
    referenceId: string;
    mskuNum: number;
    declareNum: number;
    issuedNum: number;
    receivedNum: number;
    disparityNum: number;
    userId: string;
    userName: string;
    gmtCreate: string;
    receivingTime: string;
    gmtModified: string;
  }

  interface IProductList {
    id: string;
    url: string;
    itemName: string;
    asin1: string;
    sku: string;
    sellerSku: string;
    fnsku: string;
    declareNum: number;
    issuedNum: number;
    receiveNum: number;
    mskuState: string;
  }

  interface ILogs {
    userId: number;
    username: string;
    gmtCreate: string;
    modifyText: string;
  }

  interface IShipmentDetails {
    isGenerateInvoice: boolean;
    shipmentStatus: string;
    mwsShipmentId: string;
    shipmentName: string;
    shipmentId: string;
    invoiceId: string;
    countryCode: string;
    storeName: string;
    warehouseDe: string;
    destinationFulfillmentCenterId: string;
    shippingType: string;
    shippingId: string;
    trackingId: string;
    areCasesRequired: string;
    labelingType: string;
    addressLine1: string;
    referenceId: string;
    mskuNum: number;
    declareNum: number;
    issuedNum: number;
    receivedNum: number;
    disparityNum: number;
    userId: number;
    userName: string;
    gmtCreate: string;
    receivingTime: string;
    gmtModified: string;
    txtUrl: string;
    productItemVos: IProductList[];
    shipmentModifies: ILogs[];
  }
}
