/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-03-01 10:23:00
 * @LastEditTime: 2021-04-29 11:03:56
 */
declare namespace skuData {

  interface IMskuList {
    sellerSku: string;
    asin1: string;
    storeId: string;
    storeName: string; // 店铺名称
    marketplace: string; // 站点
  }

  interface IRecord {
    id: string;
    userId: string;
    username: string;
    imageUrl: string;
    sku: string;
    nameNa: string;
    nameUs: string;
    category: string;
    category: string;
    salesman: string;
    state: string;
    packingLong: number;
    packingWide: number;
    packingHigh: number;
    packingType: 'feet'|'m'|'cm'|'inch';
    packingWeight: number;
    packingWeightType: 'g'|'kg'|'ounce'|'pound';
    commodityLong: number;
    commodityWide: number;
    commodityHigh: number;
    commodityType: 'feet'|'m'|'cm'|'inch';
    commodityWeight: number;
    commodityWeightType: 'g'|'kg'|'ounce'|'pound';
    packingMaterial: string;
    isFragile: boolean;
    purchasingCost: number;
    packagingCost: number;
    price: number;
    mskus: IMskuList[];
    locationNos: ILocations[];
    suppliers: ISupplierDownList[];
    pimageUrl: string;
  }

  interface IAddMskuCallbackParams {
    mskuList: string[];
    site: string;
    shop: string;
  }

  interface IMskuDownList {
    sellerSku: string;
    asin1: string;
    storeId: string;
  }

  interface ILocations {
    locationId: string; // 库位号id
    locationNo: string; // 库位号名称
    warehouseName: string; // 仓库名称
    warehouseId: string; // 仓库id
  }

  interface ISupplierDownList {
    supplierId: string;//供应商id
    supplierName: string;//供应商名称
    currencyType: string;//链接
    price: number;//价格
    placeUrl: string;//下单链接
  }
}
