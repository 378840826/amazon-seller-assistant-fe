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
  type Site = 'US' | 'CA' | 'UK' | 'DE' | 'FR' | 'ES' | 'IT';
  interface IGlobalShopType {
    global: {
      shop: {
        // current: API.IShop;
        current: {
          id: string;
          storeName: string;
          marketplace: Site;
          sellerId: string;
          token: string;
          autoPrice: boolean;
          timezone: string;
          currency: string;
          marketplace: string;
          tokenInvalid: boolean;
        };
      };
    };
  }

  // 常见的返回数据格式
  interface IBaseResponse {
    code: number;
    message: string;
  }
}
