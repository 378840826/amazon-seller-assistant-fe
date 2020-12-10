import { Response, Request } from 'express';

export default {
  // 分页查询
  'GET /api/mws/fis/page': (_: Request, res: Response) => {
    setTimeout(() => {
      const goodsCell = {
        'asin': 'B000000000',
        'sku': 'sku-1',
        'fnSku': 'fnSku-1',
        'sharedState': 1,
        'lastModifiedTime': '2020-06-06 06:06:06',
        'skuStatus': 'stop',
        'newProduct': true,
        'title': 'ier Reading manyReadingReading pos ier Reading many pos ier Reading many posReading',
        'listingStatus': 'Active',
        'openDate': '2020-06-06',
        'reviewScore': 4.5,
        'reviewCount': 123,
        'sellable': 49,
        'totalInventory': 91,
        'inTransitInventory': 206,
        'reservedAvailable': 20,
        'orderCount7day': 70,
        'orderCount30day': 300,
        'orderCount15day': 150,
        'orderCount7dayRatio': -7,
        'orderCount30dayRatio': 30,
        'orderCount15dayRatio': 15,
        'orderSevenNumRatioSub': 17,
        'orderFifteenNumRatioSub': 115,
        'orderThirtyNumRatioSub': -130,
        'orderSalesCount30day': 3000,
        'orderSalesCount7day': 700,
        'orderSalesCount15day': 1500,
        'orderSalesCount30dayRatio': 30,
        'orderSalesCount7dayRatio': 7,
        'orderSalesCount15dayRatio': 15,
        'salesSevenNumRatioSub': 7,
        'salesFifteenNumRatioSub': 15,
        'salesThirtyNumRatioSub': 30,
        'stockingCycle': 20,
        'firstPass': 10,
        'totalInventoryAvailableDays': 12,
        'availableDaysOfExistingInventory': 14,
        'estimatedOutOfStockTime': '2020-08-08',
        'recommendedReplenishmentVolume': 1000,
        'shippingMethodsList': [
          'byAir',
          'seaTransport',
          'airPie',
          'seaPie',
        ],
        'labels': [
          {
            'id': '1',
            'labelName': '标签1',
          },
          {
            'id': '2',
            'labelName': '标签2',
          },
        ],
      };
      const records = [];
      for (let index = 1; index < 21; index++) {
        const cell = { ...goodsCell };
        cell.asin = `B00000000${index}`;
        cell.sku = `150919USFBA${index}`;
        if (index % 2 > 0) {
          cell.listingStatus = 'Remove';
          cell.sharedState = 0;
        } else {
          cell.shippingMethodsList = ['seaTransport'];
          cell.skuStatus = 'normal';
        }
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

  // 获取全部标签
  'GET /api/mws/fis/labels': (_: Request, res: Response) => {
    setTimeout(() => {
      const groupCell = {
        id: '1',
        labelName: '标签1',
      };
      const records = [];
      for (let index = 1; index < 8; index++) {
        const cell = { ...groupCell };
        cell.id = `${index}`;
        cell.labelName = `标签${index}`;
        records.push(cell);
      }
      res.send({
        code: 200,
        data: {
          records,
        },
      });
    }, 300);
  },

  // 设置
  'POST /api/mws/fis/update-rule': (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '设置成功',
      });
    }, 1000);
  },

  // 删除标签
  'POST /api/mws/fis/label/remove': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '删除成功',
      });
    }, 300);
  },

  // 添加标签
  'POST /api/mws/fis/label/add': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          id: '99',
          labelName: '添加的标签',
        },
        message: '添加成功',
      });
    }, 500);
  },

  // 在途详情
  'GET /api/mws/fis/transit-details': (_: Request, res: Response) => {
    setTimeout(() => {
      const detailsCell = {
        shipmentId: 'F12312R3-1',
        shipmentName: 'shipmentName-1',
        createTime: '2018-07-11 07:00:00',
        updateTime: '2018-07-11 07:00:07',
        shippedQuantity: 12,
        receivedQuantity: 0,
        inTransitQuantity: 20,
        destination: 'CVG',
        status: 'working',
        estimatedArrival: '',
      };
      const records = [];
      for (let index = 1; index < 5; index++) {
        const cell = { ...detailsCell };
        cell.shipmentId = `F12312R-${index}`;
        cell.shipmentName = `12310第${index}批`;
        records.push(cell);
      }
      res.send({
        code: 200,
        data: { records },
      });
    }, 500);
  },  

  // 更新时间
  'GET /api/mws/fis/update-time': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: '2020-12-08 16:41:25 (太平洋时间)',
      });
    }, 500);
  },
};
