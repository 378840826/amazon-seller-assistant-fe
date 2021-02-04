/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-06-30 11:57:55
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\layouts\AsinPandectLayout\routes.ts
 */
import { 
  asinPandectBaseRouter,
  asinPandectDynamicRouter,
  asinPandectOrderRouter,
  asinPandectB2bRouter,
  asinPandectPpcRouter,
  asinPandectTerritoryRouter,
  asinPandectReturnRouter,
  asinPandectComPro,
} from '@/utils/routes';

export default [
  {
    path: asinPandectBaseRouter,
    text: '基本信息',
  },
  {
    path: asinPandectDynamicRouter,
    text: 'ASIN动态',
  },
  {
    path: asinPandectOrderRouter,
    text: '订单解读',
  },
  {
    path: asinPandectB2bRouter,
    text: 'B2B销售',
  },
  {
    path: asinPandectPpcRouter,
    text: '广告表现',
  },
  {
    path: asinPandectTerritoryRouter,
    text: '地区销量',
  },
  {
    path: asinPandectReturnRouter,
    text: '退货分析',
  },
  {
    path: asinPandectComPro,
    text: '竞品监控',
  },
];
