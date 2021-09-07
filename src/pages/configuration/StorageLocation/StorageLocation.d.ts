/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-02-22 10:15:55
 * @LastEditTime: 2021-02-24 15:37:17
 */

declare namespace StorageLocation {
  interface IRecord {
    id: string;
    userid: number;
    username: string;
    warehouseId: number;
    locationNo: string;
    isCustomize: boolean;
    gmtCreate: string;
    gmtModified: string;
    state: string;
    skus: string[];
  }
}
