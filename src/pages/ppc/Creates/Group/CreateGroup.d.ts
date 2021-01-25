/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-01-19 17:22:33
 */

declare namespace CreateGroup {
  interface ICampaignList {
    name: string;
    campaignId: string;
    campaignType: CreateCampaign.ICampaignType;
    targetingType: 'auto'|'manual';	
  }
}

