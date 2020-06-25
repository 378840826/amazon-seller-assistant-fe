declare namespace MwsOrderList {
  interface ITableData {
    tableData: {
      code: number;
      data: {
        total: number;
        current: number;
      };
    };
  }

  interface IGlobalType {
    global: {
      shop: {
        current: {};
      };
    };
  }

  // 表格的返回信息
  interface IResponseTableData {
    code: number;
    data: {
      records: [];
      total: number;
      size: number;
      current: number;
    };
    message: string;
  }

  // 订单
  interface IRowDataType {
    orderDetails: [];
    purchaseDate: string;
    orderId: string;
    isBusinessOrder: boolean;
    orderStatus: string;
    deliverMethod: string;
    actuallyPaid: string;
    shipServiceLevel: string;
    buyerMessage: {
      buyerName: string;
      telephone: string | number;
      addresseeName: string;
      shipPostalCode: string;
      detailedAddress: string;
      shipCity: string;
      shipState: string;
      shipCountry: string;
    };
  }

  // 订单的详情
  interface IRowChildDataType {
    imgUrl: string;
    productName: string;
    sku: string;
    unitPrice: number;
    asin: string;
    quantity: number;
    price: number;
    shippingPrice: number;
    shipPromotionDiscount: number;
    subTotal: number;
    itemPromotionDiscount: number;
    orderStatus: string;
    deliverStatus: string;
  }

  // 工具栏radio
  interface IRadioFields {
    businessOrder: string | boolean;
    orderStatus: string;
    deliverStatus: string;
    multiplePieces: string | boolean;
    preferentialOrder: string | boolean;
    multipleSku: string | boolean;
    deliverMethod: string;
    asinRelatedSearch: string;
    buyerRelatedSearch: string;
    startTime: string;
    endTime: string;
    current: number;
    size: number;
    shipServiceLevel: string;
  }

  // toolbar 组件的回调函数
  interface IToolbarProps {
    handleFiltarte: (param) => void;
  }

  interface IRequestDatas {
    current: number;
    size: number;
    startTime: string;
    endTime: string;
    asinRelatedSearch?: string;
    buyerRelatedSearch?: string;
  }
}
