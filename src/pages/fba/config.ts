/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-03-17 14:15:03
 * @LastEditTime: 2021-05-08 14:56:17
 */

// 物流方式
export const logisticMethods = [
  {
    label: '海运',
    value: '海运',
  },
  {
    label: '空运',
    value: '空运',
  },
  {
    label: '海派',
    value: '海派',
  },
  {
    label: '空派',
    value: '空派',
  },
];

// 包装方式
export const wayPacking = [
  {
    label: '混装',
    value: false,
  },
  {
    label: '原厂包装',
    value: true,
  },
];

// 贴标方
export const labelling = [
  {
    label: '亚马逊',
    value: 'AMAZON_LABEL_ONLY',
  },
  {
    label: '卖家',
    value: 'SELLER_LABEL',
  },
];
