/*
 * @Author: Huang Chao Yi
 * @Email: 1089109@qq.com
 * @Date: 2021-04-10 14:29:04
 * @LastEditTime: 2021-04-12 10:33:58
 */
declare namespace ProfitTable {
  interface IShopProfitRecord {
    salesVolume: number;
    compensate: number;
    orderFee: number;
    returnRefund: number;
    fbaStorage: number;
    promotionExpenses: number;
    advertisingCosts: number;
    evaluationFee: number;
    earlyReviewer: number;
    otherServiceCharges: number;
    purchasingCost: number;
    purchasingLogistics: number;
    packagingConsumables: number;
    internationalLogistics: number;
    operatingCosts: number;
    domesticWarehouseCost: number;
    profit: number;
    profitMargin: number;
    roi: number;
    compensationForWarehouseDamage: number;
    distributionDamageCompensation: number;
    compensationForLossOfWarehouse: number;
    freeReplacementRefund: number;
    costAdjustment: number;
    platformChargeBack: number;
    commission: number;
    fbaFee: number;

    refundFee: number;
    orderCommission: number;
    extraDeliveryFee: number;
    extraReturnFee: number;
    returnOfPromotionFee: number;
    returnServiceCharge: number;
    monthlyStorageFee: number;
    longTermStorageFee: number;
    coupon: number;
    couponServiceCharge: number;
    promotion: number;
    lightningDealFee: number;
    fbaRemovalFee: number;
    subscriptionFee: number;
    inventoryUpdate: number;
    buyerRecharge: number;
  }
}
