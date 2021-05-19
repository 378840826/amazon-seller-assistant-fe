/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-22 10:15:55
 * @LastEditTime: 2021-03-18 20:46:50
 */

declare namespace Logistics {
  interface IRecord {
    id: string;
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
