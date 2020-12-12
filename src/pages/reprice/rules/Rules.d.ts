declare namespace Rules {
  interface ITableResponseType {
    id: string;
    name: string;
    type: string;
    description: string;
    timing: string;
    productCount: number;
    system: boolean;
    updateTime: string;
  }

  // 安全设定
  interface ISafeDataType {
    stockLeValue: string;
    stockLeAction: string;
    gtMaxAction: string;
    ltMinAction: string;
  }

  interface ICompeteData {
    name: string;
    description: string;
    condition: {
      competePrice: string;
      action: string;
      unit: string;
      value: string;
    };
    safe?: ISafeDataType;
    timing: string;
  }

  interface IHaveTypeData {
    me: string;
    lowest: string;
    operator: string;
    myPrice?: string;
    action: string;
    actionOperator?: string;
    unit?: string;
    value?: string;
  }

  interface INotHaveTypeData {
    me: string;
    lowest: string;
    operator: string;
    myPrice?: string;
    action: string;
    actionOperator?: string;
    unit?: string;
    value?: string;
  }

  interface IHoldCartType {
    me: string;
    buybox: string;
    action: string;
    unit: string;
    value: string;
  }

  interface IHaveopponets {
    key: number;
    Component: ReactDOM;
    state: IHaveTypeData;
  }

  interface INotHaveopponets {
    key: number;
    Component: ReactDOM;
    state: INotHaveTypeData;
  }

  interface IHoldCarts {
    key: number;
    Component: ReactDOM;
    state: IHoldCartType;
  }

  interface IBuyboxDataType {
    name: string;
    description: string;
    safe?: ISafeDataType;
    self: {
      only: {
        action: string;
      };
      unonly: IHaveTypeData[];
    };
    other: IHoldCartType[];
    nobody: IHaveTypeData[];
    competitor: {
      power: boolean;
      scope: string;
      shipping: string[];
      sellerId: string[];
    };
    safe: ISafeDataType;
    timing: string;
  }

  interface ISalesConditionsItemType {
    type: string;
    period: string;
    operator: string;
    operatorUnit: string;
    basis: string;
    rateTrend: string;
    rateUnit: string;
    rateBasis: string;
    action: string;
    unit: string;
    value: string;
  }

  interface ISalesConditions {
    key: number;
    Component: ReactDOM;
    state: ISalesConditionsItemType;
  }

  interface ISalesDataType {
    name: string;
    description: string;
    conditions: ISalesConditionsItemType[];
    safe: ISafeDataType;
    timing: string;
  }


}
