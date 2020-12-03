/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2020-10-19 16:53:46
 * @LastEditors: Huang Chao Yi
 * @FilePath: \amzics-react\src\utils\routes.ts
 * 
 * 路由相关
 */


/**
 * 调价规则相关
 * /reprice/rules 调价规则列表
 * /reprice/rules/add 添加一条规则
 */
export const ruleListRouter = '/reprice/rules'; 
export const ruleAddRouter = '/reprice/rules/add';


// 跟卖监控
export const competitorMonitorRouter = '/competitor/monitor'; // 跟卖监控列表
export const competitorListRouter = '/competitor/list'; // 跟卖者列表
export const competitorHistoryRouter = '/competitor/history'; // 跟卖历史

// ASIN总览
export const asinPandectBaseRouter = '/asin/base'; // ASIN总览 - 基本信息
export const asinPandectDynamicRouter = '/asin/dt'; // ASIN总览 - ASIN动态
export const asinPandectOrderRouter = '/asin/order'; // ASIN总览 - 订单解读
export const asinPandectB2bRouter = '/asin/b2b'; // ASIN总览 - B2B
export const asinPandectPpcRouter = '/asin/ppc'; // ASIN总览 - 广告表现
export const asinPandectTerritoryRouter = '/asin/territory'; // ASIN总览 - 广告表现
export const asinPandectReturnRouter = '/asin/return'; // ASIN总览 - 退货分析

// 评论
export const reviewListRouter = '/review/list'; // 评论列表
