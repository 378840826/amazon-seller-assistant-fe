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
    /** sd 广告活动的类型(受众 or 分类/商品  = T00030 or T00020) */
    tactic: string;
    targetingType: 'auto'|'manual';	
    /** SD广告活动的每日预算 */
    budget: number;
    /** SP广告活动的每日预算 */
    dailyBudget: number;
  }
}

