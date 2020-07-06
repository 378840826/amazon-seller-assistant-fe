import { Response, Request } from 'express';

export default {
  // 查询商品列表（单个查询）
  'GET /api/mws/product/page/search': (_: Request, res: Response) => {
    setTimeout(() => {
      const goodsCell = {
        title: 'ier Reading manyReadingReading pos ier Reading many pos ier Reading many posReading',
        id: '1',
        sku: 'sku-1',
        asin: 'B000000000',
        url: 'https://www.baidu.com',
        fulfillmentChannel: 'FBA',
        sellable: 100,
        price: 999.99,
        postage: 3.99,
        competingCount: 20,
        reviewScore: 4.5,
        reviewCount: 770,
        commission: 1.88,
        fbaFee: 2.77,
        cost: 222.22,
        freight: 2.56,
        minPrice: null,
        maxPrice: 1099.99,
        dayOrder7Count: 70,
        dayOrder7Ratio: 777.77,
        dayOrder30Count: 3000,
        dayOrder30Ratio: -8.88,
        ruleId: '10',
        ruleName: '调价规则-1',
        adjustSwitch: true,
        acKeyword: 'keywordxx',
        acUrl: 'https://www.baidu.com',
        groupId: '1',
        groupName: '商品分组-1',
        ranking: [
          {
            categoryId: '11',
            categoryName: '分类名称11',
            categoryRanking: 55,
            isTopCategory: false,
          }, {
            categoryId: '1',
            categoryName: '分类名称1',
            categoryRanking: 955,
            isTopCategory: true,
          },
        ],
        listingStatus: 'Active',
        profitMargin: 33.33,
        profit: 101.58,
        openDate: '2020-06-06',
        sellableDays: 999,
        inbound: 500,
        imgUrl: 'https://images-na.ssl-images-amazon.com/images/I/512lGnVReaL.jpg',
        idAdd: true,
        isAc: false,
        isBs: true,
        isNr: false,
        isPrime: true,
        isPromotion: false,
        isCoupon: true,
        usedNewSellNum: 66,
        isBuyBox: true,
        addOnItem: 'addOnItemxx',
        bsCategory: 'bsCategoryxx',
        specialOffersProductPromotions: '促销说明xx',
        coupon: '-50%xx',
        sellerName: 'buybox卖家名称xx',
        nrCategory: 'nrCategoryxx',
      };
      const records = [];
      for (let index = 1; index < 21; index++) {
        const cell = { ...goodsCell };
        if (index % 2 > 0) {
          cell.sku = `150919USFBA${index}`;
          cell.listingStatus = 'Remove';
          cell.fulfillmentChannel = 'FBM';
          cell.adjustSwitch = false;
          cell.idAdd = !cell.idAdd;
          cell.isAc = !cell.isAc;
          cell.isPrime = !cell.isPrime;
        } else {
          cell.sku = `070323_5x_150919USFBA${index}`;
          cell.sellableDays = 0;
          cell.dayOrder7Ratio = 0 - cell.dayOrder7Ratio;
          cell.isBuyBox = false;
          cell.usedNewSellNum = 0;
          cell.ranking = [];
        }
        cell.id = `${index * 2}`;
        records.push(cell);
      }
      res.send({
        code: 200,
        data: {
          total: 1234,
          size: 20,
          current: 1,
          pages: 62,
          records,
        },
      });
    }, 300);
  },

  // 查询商品列表（批量查询）
  'POST /api/mws/product/batch/page': (_: Request, res: Response) => {
    setTimeout(() => {
      const goodsCell = {
        title: 'Reading manyReadingReading pos ier Reading many pos ier Reading many posReading',
        id: '1',
        sku: 'sku-1',
        asin: 'B000000000',
        url: 'https://www.baidu.com',
        fulfillmentChannel: 'FBA',
        sellable: 100,
        price: 999.99,
        postage: 3.99,
        competingCount: 20,
        reviewScore: 4.5,
        reviewCount: 770,
        commission: 1.88,
        fbaFee: 2.77,
        cost: 222.22,
        freight: 2.56,
        minPrice: null,
        maxPrice: 1099.99,
        dayOrder7Count: 70,
        dayOrder7Ratio: 777.77,
        dayOrder30Count: 3000,
        dayOrder30Ratio: -8.88,
        ruleId: '10',
        ruleName: '调价规则-1',
        adjustSwitch: true,
        acKeyword: 'keywordxx',
        acUrl: 'https://www.baidu.com',
        groupId: '100',
        groupName: '商品分组-1',
        ranking: [
          {
            categoryId: '11',
            categoryName: '分类名称11',
            categoryRanking: 55,
            isTopCategory: false,
          }, {
            categoryId: '1',
            categoryName: '分类名称1',
            categoryRanking: 955,
            isTopCategory: true,
          },
        ],
        listingStatus: 'Active',
        profitMargin: 33.33,
        profit: 101.58,
        openDate: '2020-06-06',
        sellableDays: 999,
        inbound: 500,
        imgUrl: 'https://images-na.ssl-images-amazon.com/images/I/512lGnVReaL.jpg',
        idAdd: true,
        isAc: false,
        isBs: true,
        isNr: false,
        isPrime: true,
        isPromotion: false,
        isCoupon: true,
        usedNewSellNum: 66,
        isBuyBox: true,
      };
      const records = [];
      for (let index = 1; index < 21; index++) {
        const cell = { ...goodsCell };
        if (index % 2 > 0) {
          cell.sku = `150919USFBA${index}`;
          cell.listingStatus = 'Remove';
          cell.fulfillmentChannel = 'FBM';
          cell.adjustSwitch = false;
          cell.idAdd = !cell.idAdd;
          cell.isAc = !cell.isAc;
          cell.isPrime = !cell.isPrime;
        } else {
          cell.sku = `070323_5x_150919USFBA${index}`;
          cell.sellableDays = 0;
          cell.dayOrder7Ratio = 0 - cell.dayOrder7Ratio;
          cell.isBuyBox = false;
          cell.usedNewSellNum = 0;
          cell.ranking = [];
        }
        cell.id = `${index * 2}`;
        records.push(cell);
      }
      res.send({
        code: 200,
        data: {
          total: 1234,
          size: 20,
          current: 1,
          pages: 62,
          records,
        },
      });
    }, 300);
  },

  // 获取店铺所有分组
  'GET /api/mws/product/group': (_: Request, res: Response) => {
    setTimeout(() => {
      const groupCell = {
        id: '1',
        groupName: '商品分组-1',
      };
      const records = [];
      for (let index = 1; index < 8; index++) {
        const cell = { ...groupCell };
        cell.id = `${index}`;
        cell.groupName = `商品分组---${index}`;
        records.push(cell);
      }
      records.push({
        id: '22',
        groupName: '未分组',
      });
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 修改商品分组（单个/批量）
  'POST /api/mws/product/batch/update/group': (req: Request, res: Response) => {
    const { body: { ids, groupId } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({ id, groupId, groupName: '修改后的分组' }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 修改商品调价规则（单个/批量）
  'POST /api/mws/product/batch/update/rule': (req: Request, res: Response) => {
    const { body: { ids, ruleId } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({ id, ruleId, ruleName: '修改后的规则' }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 修改商品最低价（单个/批量）
  'POST /api/mws/product/batch/update/min-price': (req: Request, res: Response) => {
    const { body: { ids, minPrice } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({ id, minPrice }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 修改商品最高价（单个/批量）
  'POST /api/mws/product/batch/update/max-price': (req: Request, res: Response) => {
    const { body: { ids, maxPrice } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({ id, maxPrice }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 开启商品调价（单个/批量）
  'POST /api/mws/product/batch/update/start-aj': (req: Request, res: Response) => {
    const { body: { ids } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({ id, adjustSwitch: true }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 关闭商品调价（单个/批量）
  'POST /api/mws/product/batch/update/close-aj': (req: Request, res: Response) => {
    const { body: { ids } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({ id, adjustSwitch: false }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 快捷设置售价（单个/批量）
  'POST /api/mws/product/batch/fast-update/price': (req: Request, res: Response) => {
    const { body: { ids } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({ id, price: 55.55 }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 快捷设置最高价（单个/批量）
  'POST /api/mws/product/batch/fast-update/max-price': (req: Request, res: Response) => {
    const { body: { ids } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({ id, maxPrice: 66.66 }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 快捷设置最低价（单个/批量）
  'POST /api/mws/product/batch/fast-update/min-price': (req: Request, res: Response) => {
    const { body: { ids } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({ id, minPrice: 44.44 }));
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 修改售价（单个/批量）
  'POST /api/mws/product/batch/update/price': (req: Request, res: Response) => {
    const { body: { ids, price } } = req;
    setTimeout(() => {
      const records = ids.map((id: string) => ({ id, price: price ? price : 555.55 }));
      res.send({
        code: 200,
        data: {
          records,
        },
        message: '提交成功，亚马逊商品页面价格3-5分钟后更新',
      });
    }, 300);
  },

  // 单行修改商品的调价系统参数（最高价。最低价，成本，运费，调价规则）
  'POST /api/mws/product/update': (req: Request, res: Response) => {
    const { body: { id } } = req;
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          records: [{
            id,
            maxPrice: 999.99,
            minPrice: 0.01,
            cost: 333.33,
          }],
        },
        message: '修改成功',
      });
    }, 300);
  },

  // 修改分组名称
  'POST /api/mws/product/group/update': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '修改成功',
      });
    }, 300);
  },

  // 删除分组
  'POST /api/mws/product/group/delete': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '删除成功',
      });
    }, 300);
  },

  // 添加分组
  'POST /api/mws/product/group/add': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          id: '99',
          groupName: '添加的分组',
        },
        message: '添加成功',
      });
    }, 300);
  },

  // 修改补货周期
  'POST /api/mws/product/replenishment-cycle': (_: Request, res: Response) => {
    setTimeout(() => {
      const goodsCell = {
        title: 'ier Reading manyReadingReading pos ier Reading many pos ier Reading many posReading',
        id: '1',
        sku: 'sku-1',
        asin: 'B000000000',
        url: 'https://www.baidu.com',
        fulfillmentChannel: 'FBA',
        sellable: 100,
        price: 999.99,
        postage: 3.99,
        competingCount: 20,
        reviewScore: 4.5,
        reviewCount: 770,
        commission: 1.88,
        fbaFee: 2.77,
        cost: 222.22,
        freight: 2.56,
        minPrice: null,
        maxPrice: 1099.99,
        dayOrder7Count: 70,
        dayOrder7Ratio: 777.77,
        dayOrder30Count: 3000,
        dayOrder30Ratio: -8.88,
        ruleId: '10',
        ruleName: '调价规则-1',
        adjustSwitch: true,
        acKeyword: 'keywordxx',
        acUrl: 'https://www.baidu.com',
        groupId: '1',
        groupName: '商品分组-1',
        ranking: [
          {
            categoryId: '11',
            categoryName: '分类名称11',
            categoryRanking: 55,
            isTopCategory: false,
          }, {
            categoryId: '1',
            categoryName: '分类名称1',
            categoryRanking: 955,
            isTopCategory: true,
          },
        ],
        listingStatus: 'Active',
        profitMargin: 33.33,
        profit: 101.58,
        openDate: '2020-06-06',
        sellableDays: 999,
        inbound: 500,
        imgUrl: 'https://images-na.ssl-images-amazon.com/images/I/512lGnVReaL.jpg',
        idAdd: true,
        isAc: false,
        isBs: true,
        isNr: false,
        isPrime: true,
        isPromotion: false,
        isCoupon: true,
        usedNewSellNum: 66,
        isBuyBox: true,
        addOnItem: 'addOnItemxx',
        bsCategory: 'bsCategoryxx',
        specialOffersProductPromotions: '促销说明xx',
        coupon: '-50%xx',
        sellerName: 'buybox卖家名称xx',
        nrCategory: 'nrCategoryxx',
      };
      const records = [];
      for (let index = 1; index < 21; index++) {
        const cell = { ...goodsCell };
        if (index % 2 > 0) {
          cell.sku = `150919USFBA${index}`;
          cell.listingStatus = 'Remove';
          cell.fulfillmentChannel = 'FBM';
          cell.adjustSwitch = false;
          cell.idAdd = !cell.idAdd;
          cell.isAc = !cell.isAc;
          cell.isPrime = !cell.isPrime;
        } else {
          cell.sku = `070323_5x_150919USFBA${index}`;
          cell.sellableDays = 0;
          cell.dayOrder7Ratio = 0 - cell.dayOrder7Ratio;
          cell.isBuyBox = false;
          cell.usedNewSellNum = 0;
          cell.ranking = [];
        }
        cell.id = `${index * 2}`;
        records.push(cell);
      }
      res.send({
        code: 200,
        data: {
          total: 1234,
          size: 20,
          current: 1,
          pages: 62,
          records,
        },
        message: '修改成功',
      });
    }, 300);
  },

  // 上传文件
  'POST /api/mws/product/report/upload': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          totalSize: 80,
          successSize: 75,
          errorSize: 5,
        },
        message: '导入成功XX，失败XX',
      });
    }, 300);
  },
  
};
