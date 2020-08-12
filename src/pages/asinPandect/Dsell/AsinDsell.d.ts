declare namespace AsinDsell {
  interface ITooltipType {
    data: {
      name: string;
      value: number[];
    };
    seriesName: string;
  }

  interface IASin {
    asinGlobal: {
      asin: string;
    };
  }

  interface IMapDataType {
    state: string;
    sales: string;
    quantity: string;
  }

}
