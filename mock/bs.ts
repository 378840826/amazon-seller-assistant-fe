import { Response, Request } from 'express';

export default {
  'GET /api/mws/bs/page': (_: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records: any = [];
    for (let index = 1; index < 30; index++) {
      if (index % 2 > 0) {
        records.push({
          id: index,
          reportTime: `2020-01-${index}`,
          reportStatus: false,
          pluginMsg: '',
        });
      } else {
        records.push({
          id: index,
          reportTime: `2020-01-${index}`,
          reportStatus: true,
          pluginMsg: '插件自动同步失败，等待下一次同步',
        });
      }
    }
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          total: 999,
          size: 20,
          current: 1,
          records,
        },
      });
    }, 500);
  },
  
  'GET /api/mws/bs/delete-bs': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '成功',
      });
    }, 500);
  },

  'POST /api/mws/bs/update-bs': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '成功',
      });
    }, 500);
  },

  'POST /api/mws/bs/upload': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '上传成功',
      });
    }, 500);
  },

  'POST /api/mws/bs/upload-batch': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        message: '批量成功',
      });
    }, 500);
  },

  'GET /api/mws/bs/date-bs': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        data: {
          date: '2020-01-3',
          status: 0,
        },
        message: 'msg',
      });
    }, 500);
  },

  'GET /api/mws/bs/info-bs': (_: Request, res: Response) => {
    const cell = {
      id: '0',
      reportId: '10',
      parentAsin: 'B000000000',
      childAsin: 'B000000000',
      title: 'officia tempor quiofficia tempor quiofficia tempor quiofficia tempor quiofficia tempor quiofficia tempor quiofficia tempor quiofficia tempor quiofficia tempor quiofficia tempor quiofficia tempor quiofficia tempor qui',
      sessions: 10,
      sessionPercentage: 20,
      pageViews: 30,
      pageViewsPercentage: 40,
      buyBoxPercentage: 50,
      unitsOrdered: 60,
      unitsOrderedB2b: 70,
      unitSessionPercentage: 80,
      unitSessionPercentageB2b: 90,
      orderedProductSales: 100,
      orderedProductSalesB2b: 110,
      currency: '$',
      totalOrderItems: 120,
      totalOrderItemsB2b: 130,
    };
    const arr = [cell];
    for (let index = 0; index < 50; index++) {
      arr.push(cell);
    }
    setTimeout(() => {
      res.send({
        data: {
          records: arr,
          total: 999,
          size: 20,
          current: 1,
        },
        code: 200,
      });
    }, 500);
  },
};
