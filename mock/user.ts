import { Response, Request } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'GET /api/currentUser': (_: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200,
        token: 'test-token',
        message: '成功',
        data: {
          id: 1,
          username: 'Serati Ma',
          email: 'a@b.com',
          phone: '10000',
          isMainAccount: false,
        },
      });
    }, 1000);
  },
};
