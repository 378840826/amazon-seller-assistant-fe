// 判断是否归档状态
export const isArchived: (state: string) => boolean = (state: string) => state === 'archived';

// 投放方式字典
export const targetingTypeDict = {
  manual: '手动',
  auto: '自动',
  T00020: '分类/商品',
  T00030: '受众',
};
