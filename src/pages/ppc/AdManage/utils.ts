// 判断是否归档状态
export const isArchived: (state: string) => boolean = (state: string) => state === 'archived';

// 投放方式字典
export const targetingTypeDict = {
  manual: '手动',
  auto: '自动',
  T00020: '分类/商品',
  T00030: '受众',
};

// 获取跳转到指定广告活动或广告组的 url
export function getAssignUrl(params: {
  campaignType: 'sp' | 'sb' | 'sd';
  campaignState: API.AdState;
  campaignId: string;
  campaignName: string;
  groupId?: string;
  groupName?: string;
  tab?: 'campaign' | 'group' | 'ad' | 'keyword' | 'targeting' | 'negativeTargeting' | 'searchTerm' | 'history';
  // 跳转广告组时，区分关键词广告组和商品/分类广告组，以此来确定 targeting 标签是“关键词”还是“分类/商品投放”(否定targeting同理)
  groupType?: API.GroupType;
}) {
  const {
    campaignType, campaignState, campaignId, campaignName, groupId, groupName, tab, groupType,
  } = params;
  // eslint-disable-next-line max-len
  let url = `/ppc/manage?campaignType=${campaignType}&campaignState=${campaignState}&campaignId=${campaignId}&campaignName=${campaignName}`;
  if (groupId && groupName) {
    url = `${url}&groupId=${groupId}&groupName=${groupName}&groupType=${groupType}`;
  }
  if (tab) {
    url = `${url}&tab=${tab}`;
  }
  return url;
}
