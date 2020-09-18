/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-07-11 17:15:23
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\pages\Global.d.ts
 * 
 * 全局TS类型
 */ 
declare namespace Global {
  import { Site } from '@/utils/utils';
  
  // dva 仓库中拿出来的选中店铺
  interface IGlobalShopType {
    global: {
      shop: {
        current: {
          id: string;
          storeName: string;
          currency: string;
          marketplace: Site;
          sellerId: string;
        };
      };
    };
  }
}
