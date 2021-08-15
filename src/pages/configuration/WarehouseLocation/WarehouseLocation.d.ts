/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-22 10:15:55
 * @LastEditTime: 2021-04-26 11:28:10
 */

declare namespace WarehouseLocation {
  interface IRecord {
    id: number;
    name: string;
    countryCode: string;
    stateOrProvinceCode: string;
    districtOrCounty: string;
    addressLine1: string;
    addressLine2?: string;
    stores: {
      marketplace: string;
      storeName: string;
      id: string;
    }[];
  }
}
