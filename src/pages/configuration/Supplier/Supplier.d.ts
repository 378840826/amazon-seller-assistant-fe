declare namespace Supplier {
  interface ISupplierList {
    id: string;
    userID: string;
    userName: string;
    name: string;
    supplierId: string;
    contactsName: string;
    contactsPhone: string;
    buyerId: string;
    buyerName: string;
    email: string;
    qq: string;
    wechat: string;
    fax: string;
    settlementTypeStr: string;
    settlementType: string;
    proportionPay: string;
    cyclePay: string;
    dayPay: string;
    addressLine1: string;
    remarkText: string;
    gmtCreate: string;
    state: string;
    collectionCreateQos: [{
      id: string;
      name: string;
      bankName: string;
      bankAccount: string;
    }];
  }
}
